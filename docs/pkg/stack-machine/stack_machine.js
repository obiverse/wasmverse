/* @ts-self-types="./stack_machine.d.ts" */

/**
 * A step-by-step stack machine.
 *
 * This is a pedagogical VM — the simplest possible machine that
 * demonstrates how WebAssembly actually works. Each `step()` call
 * executes one instruction and exposes the full machine state
 * (stack, memory, program counter) for visualization.
 */
export class StackMachine {
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        StackMachineFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_stackmachine_free(ptr, 0);
    }
    /**
     * Disassemble the loaded program into readable text
     * @returns {string}
     */
    disassemble() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.stackmachine_disassemble(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {string}
     */
    get_error() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.stackmachine_get_error(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {boolean}
     */
    is_halted() {
        const ret = wasm.stackmachine_is_halted(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @returns {number}
     */
    last_op() {
        const ret = wasm.stackmachine_last_op(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {number}
     */
    last_pc() {
        const ret = wasm.stackmachine_last_pc(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * Load a program from assembly text.
     *
     * Format (one instruction per line):
     * ```
     * PUSH 3
     * PUSH 4
     * ADD
     * OUTPUT
     * HALT
     * ```
     * @param {string} source
     */
    load_program(source) {
        const ptr0 = passStringToWasm0(source, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.stackmachine_load_program(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @returns {number}
     */
    memory_ptr() {
        const ret = wasm.stackmachine_memory_ptr(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * @returns {number}
     */
    memory_size() {
        const ret = wasm.stackmachine_memory_size(this.__wbg_ptr);
        return ret >>> 0;
    }
    constructor() {
        const ret = wasm.stackmachine_new();
        this.__wbg_ptr = ret >>> 0;
        StackMachineFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * Get the opcode name for display
     * @param {number} op
     * @returns {string}
     */
    static opcode_name(op) {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.stackmachine_opcode_name(op);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {number}
     */
    output_len() {
        const ret = wasm.stackmachine_output_len(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * @returns {number}
     */
    output_ptr() {
        const ret = wasm.stackmachine_output_ptr(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * @returns {number}
     */
    pc() {
        const ret = wasm.stackmachine_pc(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * @returns {number}
     */
    program_len() {
        const ret = wasm.stackmachine_program_len(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * @returns {number}
     */
    program_ptr() {
        const ret = wasm.stackmachine_program_ptr(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * Reset execution state (keep program loaded)
     */
    reset() {
        wasm.stackmachine_reset(this.__wbg_ptr);
    }
    /**
     * @returns {number}
     */
    stack_depth() {
        const ret = wasm.stackmachine_stack_depth(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * @returns {number}
     */
    stack_ptr() {
        const ret = wasm.stackmachine_stack_ptr(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * Execute one instruction. Returns false if halted.
     * @returns {boolean}
     */
    step() {
        const ret = wasm.stackmachine_step(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @returns {number}
     */
    step_count() {
        const ret = wasm.stackmachine_step_count(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * Run N steps at once
     * @param {number} n
     * @returns {boolean}
     */
    step_n(n) {
        const ret = wasm.stackmachine_step_n(this.__wbg_ptr, n);
        return ret !== 0;
    }
}
if (Symbol.dispose) StackMachine.prototype[Symbol.dispose] = StackMachine.prototype.free;

function __wbg_get_imports() {
    const import0 = {
        __proto__: null,
        __wbg___wbindgen_throw_6ddd609b62940d55: function(arg0, arg1) {
            throw new Error(getStringFromWasm0(arg0, arg1));
        },
        __wbindgen_init_externref_table: function() {
            const table = wasm.__wbindgen_externrefs;
            const offset = table.grow(4);
            table.set(0, undefined);
            table.set(offset + 0, undefined);
            table.set(offset + 1, null);
            table.set(offset + 2, true);
            table.set(offset + 3, false);
        },
    };
    return {
        __proto__: null,
        "./stack_machine_bg.js": import0,
    };
}

const StackMachineFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_stackmachine_free(ptr >>> 0, 1));

function getStringFromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return decodeText(ptr, len);
}

let cachedUint8ArrayMemory0 = null;
function getUint8ArrayMemory0() {
    if (cachedUint8ArrayMemory0 === null || cachedUint8ArrayMemory0.byteLength === 0) {
        cachedUint8ArrayMemory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachedUint8ArrayMemory0;
}

function passStringToWasm0(arg, malloc, realloc) {
    if (realloc === undefined) {
        const buf = cachedTextEncoder.encode(arg);
        const ptr = malloc(buf.length, 1) >>> 0;
        getUint8ArrayMemory0().subarray(ptr, ptr + buf.length).set(buf);
        WASM_VECTOR_LEN = buf.length;
        return ptr;
    }

    let len = arg.length;
    let ptr = malloc(len, 1) >>> 0;

    const mem = getUint8ArrayMemory0();

    let offset = 0;

    for (; offset < len; offset++) {
        const code = arg.charCodeAt(offset);
        if (code > 0x7F) break;
        mem[ptr + offset] = code;
    }
    if (offset !== len) {
        if (offset !== 0) {
            arg = arg.slice(offset);
        }
        ptr = realloc(ptr, len, len = offset + arg.length * 3, 1) >>> 0;
        const view = getUint8ArrayMemory0().subarray(ptr + offset, ptr + len);
        const ret = cachedTextEncoder.encodeInto(arg, view);

        offset += ret.written;
        ptr = realloc(ptr, len, offset, 1) >>> 0;
    }

    WASM_VECTOR_LEN = offset;
    return ptr;
}

let cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });
cachedTextDecoder.decode();
const MAX_SAFARI_DECODE_BYTES = 2146435072;
let numBytesDecoded = 0;
function decodeText(ptr, len) {
    numBytesDecoded += len;
    if (numBytesDecoded >= MAX_SAFARI_DECODE_BYTES) {
        cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });
        cachedTextDecoder.decode();
        numBytesDecoded = len;
    }
    return cachedTextDecoder.decode(getUint8ArrayMemory0().subarray(ptr, ptr + len));
}

const cachedTextEncoder = new TextEncoder();

if (!('encodeInto' in cachedTextEncoder)) {
    cachedTextEncoder.encodeInto = function (arg, view) {
        const buf = cachedTextEncoder.encode(arg);
        view.set(buf);
        return {
            read: arg.length,
            written: buf.length
        };
    };
}

let WASM_VECTOR_LEN = 0;

let wasmModule, wasm;
function __wbg_finalize_init(instance, module) {
    wasm = instance.exports;
    wasmModule = module;
    cachedUint8ArrayMemory0 = null;
    wasm.__wbindgen_start();
    return wasm;
}

async function __wbg_load(module, imports) {
    if (typeof Response === 'function' && module instanceof Response) {
        if (typeof WebAssembly.instantiateStreaming === 'function') {
            try {
                return await WebAssembly.instantiateStreaming(module, imports);
            } catch (e) {
                const validResponse = module.ok && expectedResponseType(module.type);

                if (validResponse && module.headers.get('Content-Type') !== 'application/wasm') {
                    console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve Wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", e);

                } else { throw e; }
            }
        }

        const bytes = await module.arrayBuffer();
        return await WebAssembly.instantiate(bytes, imports);
    } else {
        const instance = await WebAssembly.instantiate(module, imports);

        if (instance instanceof WebAssembly.Instance) {
            return { instance, module };
        } else {
            return instance;
        }
    }

    function expectedResponseType(type) {
        switch (type) {
            case 'basic': case 'cors': case 'default': return true;
        }
        return false;
    }
}

function initSync(module) {
    if (wasm !== undefined) return wasm;


    if (module !== undefined) {
        if (Object.getPrototypeOf(module) === Object.prototype) {
            ({module} = module)
        } else {
            console.warn('using deprecated parameters for `initSync()`; pass a single object instead')
        }
    }

    const imports = __wbg_get_imports();
    if (!(module instanceof WebAssembly.Module)) {
        module = new WebAssembly.Module(module);
    }
    const instance = new WebAssembly.Instance(module, imports);
    return __wbg_finalize_init(instance, module);
}

async function __wbg_init(module_or_path) {
    if (wasm !== undefined) return wasm;


    if (module_or_path !== undefined) {
        if (Object.getPrototypeOf(module_or_path) === Object.prototype) {
            ({module_or_path} = module_or_path)
        } else {
            console.warn('using deprecated parameters for the initialization function; pass a single object instead')
        }
    }

    if (module_or_path === undefined) {
        module_or_path = new URL('stack_machine_bg.wasm', import.meta.url);
    }
    const imports = __wbg_get_imports();

    if (typeof module_or_path === 'string' || (typeof Request === 'function' && module_or_path instanceof Request) || (typeof URL === 'function' && module_or_path instanceof URL)) {
        module_or_path = fetch(module_or_path);
    }

    const { instance, module } = await __wbg_load(await module_or_path, imports);

    return __wbg_finalize_init(instance, module);
}

export { initSync, __wbg_init as default };
