// ============================================================================
// PATH 3: WIT Component Implementation — A Draw App
// ============================================================================
//
// This file shows what a component implementing the draw-app world looks like.
//
// NOTE: This is currently illustrative code. To compile this as a real
// Wasm component, you'd need:
//   cargo install cargo-component
//   cargo component build
//
// The Component Model tooling is still maturing. What matters now is
// understanding the PATTERN — the tooling will catch up.
//
// THE PATTERN:
//   1. Define interfaces in WIT (we did this in wit/canvas.wit)
//   2. Implement the world's exports in your language
//   3. The host provides the world's imports at instantiation
//   4. Components compose: one component's exports feed another's imports
//
// This is exactly how Plan 9 worked:
//   1. Define the protocol (9P)
//   2. Implement a file server
//   3. The kernel mounts it, providing a namespace
//   4. Processes compose by mounting each other's file trees

/// Simulated canvas state — in a real component, the `surface::canvas`
/// import would be provided by the host. Here we simulate it to show
/// the programming model.
pub struct AppState {
    time: f64,
    mouse_x: f32,
    mouse_y: f32,
    width: u32,
    height: u32,
    particles: Vec<Particle>,
}

pub struct Particle {
    x: f32,
    y: f32,
    vx: f32,
    vy: f32,
    life: f32,
    color: [u8; 4],
}

impl AppState {
    pub fn new(width: u32, height: u32) -> Self {
        AppState {
            time: 0.0,
            mouse_x: width as f32 / 2.0,
            mouse_y: height as f32 / 2.0,
            width,
            height,
            particles: Vec::with_capacity(1000),
        }
    }

    /// This is what `export update: func(dt: f64)` looks like.
    ///
    /// The host calls this every frame. The component:
    ///   1. Updates simulation state (in Wasm linear memory)
    ///   2. Calls imported canvas functions to draw
    ///
    /// The imported canvas functions are provided by the host.
    /// In a browser host → they call Canvas2D/WebGL
    /// In a native host → they call Vulkan/Metal
    /// In a test host → they record draw calls for assertion
    pub fn update(&mut self, dt: f64) {
        self.time += dt;

        // Spawn particles at mouse position
        let seed = (self.time * 1000.0) as u64;
        for i in 0..3 {
            let angle = ((seed + i) % 628) as f32 / 100.0;
            let speed = 50.0 + ((seed + i * 7) % 100) as f32;
            self.particles.push(Particle {
                x: self.mouse_x,
                y: self.mouse_y,
                vx: angle.cos() * speed,
                vy: angle.sin() * speed,
                life: 1.0,
                color: [
                    (200 + (seed % 55)) as u8,
                    ((seed / 3) % 200) as u8,
                    ((seed / 7) % 255) as u8,
                    255,
                ],
            });
        }

        // Update particles
        let dt_f32 = dt as f32;
        for p in &mut self.particles {
            p.x += p.vx * dt_f32;
            p.y += p.vy * dt_f32;
            p.vy += 98.0 * dt_f32; // gravity
            p.life -= dt_f32 * 0.5;
        }

        // Remove dead particles
        self.particles.retain(|p| p.life > 0.0);

        // Cap particle count
        if self.particles.len() > 1000 {
            self.particles.drain(0..self.particles.len() - 1000);
        }
    }

    /// Get draw commands — in a real component, you'd call the imported
    /// canvas interface directly. Here we return a list of draw commands
    /// to demonstrate the concept.
    ///
    /// REAL COMPONENT CODE would look like:
    /// ```ignore
    /// // These are imported from the host via WIT:
    /// use wasmverse::canvas::surface::Canvas;
    ///
    /// fn render(canvas: &Canvas) {
    ///     canvas.clear(Color { r: 10, g: 10, b: 15, a: 255 });
    ///     for p in &self.particles {
    ///         canvas.fill_circle(
    ///             Point { x: p.x, y: p.y },
    ///             3.0 * p.life,
    ///             Color { r: p.color[0], g: p.color[1], b: p.color[2],
    ///                     a: (p.life * 255.0) as u8 },
    ///         );
    ///     }
    /// }
    /// ```
    ///
    /// Notice: the component doesn't know if canvas is:
    ///   - A browser <canvas> element
    ///   - A native GPU surface
    ///   - A headless test buffer
    ///   - A remote display (like Plan 9's /mnt/wsys)
    ///
    /// This is the power of capability-based interfaces.
    pub fn get_particles(&self) -> &[Particle] {
        &self.particles
    }

    pub fn set_mouse(&mut self, x: f32, y: f32) {
        self.mouse_x = x;
        self.mouse_y = y;
    }
}

// ============================================================================
// For now, export via wasm-bindgen (the "polyfill" path)
// When cargo-component matures, this switches to WIT-native exports
// ============================================================================

#[cfg(target_arch = "wasm32")]
use wasm_bindgen::prelude::*;

#[cfg(target_arch = "wasm32")]
#[wasm_bindgen]
pub struct WitDemo {
    state: AppState,
    // Flat buffer for particle data: [x, y, r, g, b, a, life, _pad] per particle
    render_buf: Vec<f32>,
}

#[cfg(target_arch = "wasm32")]
#[wasm_bindgen]
impl WitDemo {
    pub fn new(width: u32, height: u32) -> WitDemo {
        WitDemo {
            state: AppState::new(width, height),
            render_buf: Vec::new(),
        }
    }

    pub fn update(&mut self, dt: f64) {
        self.state.update(dt);
    }

    pub fn set_mouse(&mut self, x: f32, y: f32) {
        self.state.set_mouse(x, y);
    }

    pub fn particle_count(&self) -> u32 {
        self.state.particles.len() as u32
    }

    /// Pack particles into flat f32 buffer for zero-copy JS access.
    /// Layout: [x, y, r, g, b, a, life, 0.0] per particle (8 floats)
    pub fn particles_ptr(&mut self) -> *const f32 {
        self.render_buf.clear();
        for p in &self.state.particles {
            self.render_buf.push(p.x);
            self.render_buf.push(p.y);
            self.render_buf.push(p.color[0] as f32);
            self.render_buf.push(p.color[1] as f32);
            self.render_buf.push(p.color[2] as f32);
            self.render_buf.push(p.color[3] as f32 * p.life);
            self.render_buf.push(p.life);
            self.render_buf.push(0.0); // padding for alignment
        }
        self.render_buf.as_ptr()
    }
}
