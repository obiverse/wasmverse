use wasm_bindgen::prelude::*;
use wasm_bindgen_futures::JsFuture;
use js_sys::{Array, Float32Array, Object, Reflect};

// ============================================================================
// PATH 2: GPU Rendering with WebGPU
// ============================================================================
//
// MENTAL MODEL:
//   Wasm orchestrates the GPU through JavaScript interop.
//   The GPU does massively parallel pixel computation.
//
// WHY RAW JS INTEROP (not web-sys typed bindings):
//   WebGPU's web-sys bindings are unstable and change frequently.
//   Using JsValue + Reflect gives us a stable foundation that matches
//   the actual JavaScript API 1:1. Same pattern Figma uses internally.
//
//   This also teaches you HOW wasm-bindgen works under the hood:
//   every "typed" web-sys call is just Reflect::set/get on JsValues.
//
// THE RENDERING PIPELINE:
//   1. navigator.gpu.requestAdapter() → GPU hardware handle
//   2. adapter.requestDevice() → logical device
//   3. Create shader module (WGSL program for the GPU)
//   4. Create render pipeline (vertex → rasterize → fragment)
//   5. Each frame: write uniforms → encode commands → submit
//
// PLAN 9 PARALLEL:
//   This is /dev/gpu as a file server. We open it (requestDevice),
//   write commands (command encoder), and the GPU renders.

/// WGSL shader — runs on the GPU, not the CPU.
///
/// A full-screen plasma effect computed in parallel for every pixel.
/// The vertex shader generates geometry; the fragment shader colors it.
const SHADER: &str = r#"
struct Uniforms {
    time: f32,
    width: f32,
    height: f32,
    _pad: f32,
}
@group(0) @binding(0) var<uniform> u: Uniforms;

struct VertexOutput {
    @builtin(position) pos: vec4f,
    @location(0) uv: vec2f,
}

@vertex
fn vs_main(@builtin(vertex_index) i: u32) -> VertexOutput {
    // Full-screen triangle from vertex index — no vertex buffer needed
    var pos = array<vec2f, 3>(
        vec2f(-1.0, -1.0),
        vec2f( 3.0, -1.0),
        vec2f(-1.0,  3.0),
    );
    var out: VertexOutput;
    out.pos = vec4f(pos[i], 0.0, 1.0);
    out.uv = pos[i] * 0.5 + 0.5;
    return out;
}

@fragment
fn fs_main(in: VertexOutput) -> @location(0) vec4f {
    let t = u.time;
    let uv = in.uv;

    // Plasma: overlapping sine waves
    let r = sin(uv.x * 10.0 + t) * 0.5 + 0.5;
    let g = sin(uv.y * 8.0 + t * 1.3) * 0.5 + 0.5;
    let b = sin((uv.x + uv.y) * 6.0 + t * 0.7) * 0.5 + 0.5;

    // Radial wave
    let cx = uv.x - 0.5;
    let cy = uv.y - 0.5;
    let dist = sqrt(cx * cx + cy * cy);
    let wave = sin(dist * 20.0 - t * 3.0) * 0.5 + 0.5;

    return vec4f(r * wave, g * wave, b, 1.0);
}
"#;

/// Helper: set a property on a JS object
fn js_set(obj: &JsValue, key: &str, val: &JsValue) {
    Reflect::set(obj, &JsValue::from_str(key), val).unwrap();
}

/// Helper: get a property from a JS object
fn js_get(obj: &JsValue, key: &str) -> JsValue {
    Reflect::get(obj, &JsValue::from_str(key)).unwrap()
}

/// Helper: call a method with no args
fn js_call0(obj: &JsValue, method: &str) -> JsValue {
    let func = js_get(obj, method);
    let func: js_sys::Function = func.unchecked_into();
    func.call0(obj).unwrap()
}

/// Helper: call a method with 1 arg
fn js_call1(obj: &JsValue, method: &str, arg: &JsValue) -> JsValue {
    let func = js_get(obj, method);
    let func: js_sys::Function = func.unchecked_into();
    func.call1(obj, arg).unwrap()
}

/// GPU Renderer — stores the WebGPU handles as opaque JsValues.
///
/// This is intentionally low-level to show what's actually happening.
/// Every WebGPU call is a JS function call through the Wasm boundary.
#[wasm_bindgen]
pub struct GpuRenderer {
    device: JsValue,
    context: JsValue,
    pipeline: JsValue,
    uniform_buffer: JsValue,
    bind_group: JsValue,
    queue: JsValue,
    width: f32,
    height: f32,
}

#[wasm_bindgen]
impl GpuRenderer {
    /// Initialize WebGPU. Async because GPU access requires negotiation.
    pub async fn new(canvas_id: &str) -> Result<GpuRenderer, JsValue> {
        let window = web_sys::window().ok_or("no window")?;
        let document = window.document().ok_or("no document")?;
        let canvas = document.get_element_by_id(canvas_id).ok_or("no canvas")?;
        let canvas: web_sys::HtmlCanvasElement = canvas.dyn_into()?;

        let width = canvas.width() as f32;
        let height = canvas.height() as f32;

        // navigator.gpu
        let navigator: JsValue = window.navigator().into();
        let gpu = js_get(&navigator, "gpu");
        if gpu.is_undefined() {
            return Err(JsValue::from_str("WebGPU not available"));
        }

        // requestAdapter()
        let adapter_promise = js_call0(&gpu, "requestAdapter");
        let adapter = JsFuture::from(js_sys::Promise::from(adapter_promise)).await?;

        // requestDevice()
        let device_promise = js_call0(&adapter, "requestDevice");
        let device = JsFuture::from(js_sys::Promise::from(device_promise)).await?;

        // Get queue
        let queue = js_get(&device, "queue");

        // Configure canvas context
        let context_val: JsValue = canvas
            .get_context("webgpu")?
            .ok_or("no webgpu context")?
            .into();

        // getPreferredCanvasFormat
        let format = js_call0(&gpu, "getPreferredCanvasFormat");

        let config = Object::new();
        js_set(&config, "device", &device);
        js_set(&config, "format", &format);
        let config_val: JsValue = config.into();
        js_call1(&context_val, "configure", &config_val);

        // Create shader module
        let shader_desc = Object::new();
        js_set(&shader_desc, "code", &JsValue::from_str(SHADER));
        let shader = js_call1(&device, "createShaderModule", &shader_desc.into());

        // Create uniform buffer (16 bytes: time, width, height, pad)
        let buf_desc = Object::new();
        js_set(&buf_desc, "size", &JsValue::from(16));
        // GPUBufferUsage.UNIFORM (0x0040) | GPUBufferUsage.COPY_DST (0x0008)
        js_set(&buf_desc, "usage", &JsValue::from(0x0040 | 0x0008));
        let uniform_buffer = js_call1(&device, "createBuffer", &buf_desc.into());

        // Create bind group layout
        let entry = Object::new();
        js_set(&entry, "binding", &JsValue::from(0));
        // GPUShaderStage.VERTEX (0x1) | GPUShaderStage.FRAGMENT (0x2)
        js_set(&entry, "visibility", &JsValue::from(0x1 | 0x2));
        let buf_binding = Object::new();
        js_set(&buf_binding, "type", &JsValue::from_str("uniform"));
        js_set(&entry, "buffer", &buf_binding.into());

        let entries = Array::new();
        entries.push(&entry.into());
        let bgl_desc = Object::new();
        js_set(&bgl_desc, "entries", &entries.into());
        let bind_group_layout = js_call1(&device, "createBindGroupLayout", &bgl_desc.into());

        // Create bind group
        let bg_entry = Object::new();
        js_set(&bg_entry, "binding", &JsValue::from(0));
        let resource = Object::new();
        js_set(&resource, "buffer", &uniform_buffer);
        js_set(&bg_entry, "resource", &resource.into());

        let bg_entries = Array::new();
        bg_entries.push(&bg_entry.into());
        let bg_desc = Object::new();
        js_set(&bg_desc, "layout", &bind_group_layout);
        js_set(&bg_desc, "entries", &bg_entries.into());
        let bind_group = js_call1(&device, "createBindGroup", &bg_desc.into());

        // Create pipeline layout
        let layouts = Array::new();
        layouts.push(&bind_group_layout);
        let pl_desc = Object::new();
        js_set(&pl_desc, "bindGroupLayouts", &layouts.into());
        let pipeline_layout = js_call1(&device, "createPipelineLayout", &pl_desc.into());

        // Create render pipeline
        let vertex = Object::new();
        js_set(&vertex, "module", &shader);
        js_set(&vertex, "entryPoint", &JsValue::from_str("vs_main"));

        let color_target = Object::new();
        js_set(&color_target, "format", &format);
        let targets = Array::new();
        targets.push(&color_target.into());
        let fragment = Object::new();
        js_set(&fragment, "module", &shader);
        js_set(&fragment, "entryPoint", &JsValue::from_str("fs_main"));
        js_set(&fragment, "targets", &targets.into());

        let pipe_desc = Object::new();
        js_set(&pipe_desc, "layout", &pipeline_layout);
        js_set(&pipe_desc, "vertex", &vertex.into());
        js_set(&pipe_desc, "fragment", &fragment.into());
        let pipeline = js_call1(&device, "createRenderPipeline", &pipe_desc.into());

        Ok(GpuRenderer {
            device,
            context: context_val,
            pipeline,
            uniform_buffer,
            bind_group,
            queue,
            width,
            height,
        })
    }

    /// Render one frame. Called each requestAnimationFrame.
    ///
    /// Total: ~10 JS calls per frame. Each one triggers massive GPU parallelism.
    pub fn render_frame(&self, time: f32) {
        // Write uniform data (time, width, height) to GPU
        let data = Float32Array::new_with_length(4);
        data.set_index(0, time);
        data.set_index(1, self.width);
        data.set_index(2, self.height);
        data.set_index(3, 0.0);

        // queue.writeBuffer(buffer, offset, data)
        let write_buf_fn: js_sys::Function =
            js_get(&self.queue, "writeBuffer").unchecked_into();
        write_buf_fn
            .call3(&self.queue, &self.uniform_buffer, &JsValue::from(0), &data)
            .unwrap();

        // Get current texture
        let texture = js_call0(&self.context, "getCurrentTexture");
        let view = js_call0(&texture, "createView");

        // Build render pass descriptor
        let color_attachment = Object::new();
        js_set(&color_attachment, "view", &view);
        js_set(&color_attachment, "loadOp", &JsValue::from_str("clear"));
        js_set(&color_attachment, "storeOp", &JsValue::from_str("store"));
        let clear_color = Array::of4(
            &JsValue::from(0.0),
            &JsValue::from(0.0),
            &JsValue::from(0.0),
            &JsValue::from(1.0),
        );
        js_set(&color_attachment, "clearValue", &clear_color.into());

        let color_attachments = Array::new();
        color_attachments.push(&color_attachment.into());
        let render_pass_desc = Object::new();
        js_set(&render_pass_desc, "colorAttachments", &color_attachments.into());

        // Encode commands
        let encoder = js_call0(&self.device, "createCommandEncoder");
        let pass = js_call1(&encoder, "beginRenderPass", &render_pass_desc.into());

        // Set pipeline and bind group, draw
        js_call1(&pass, "setPipeline", &self.pipeline);

        let set_bg_fn: js_sys::Function = js_get(&pass, "setBindGroup").unchecked_into();
        set_bg_fn
            .call2(&pass, &JsValue::from(0), &self.bind_group)
            .unwrap();

        let draw_fn: js_sys::Function = js_get(&pass, "draw").unchecked_into();
        draw_fn.call1(&pass, &JsValue::from(3)).unwrap(); // 3 vertices

        js_call0(&pass, "end");

        // Submit
        let command_buffer = js_call0(&encoder, "finish");
        let commands = Array::new();
        commands.push(&command_buffer);
        js_call1(&self.queue, "submit", &commands.into());
    }
}
