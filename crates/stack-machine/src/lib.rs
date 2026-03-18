use wasm_bindgen::prelude::*;

// ── Opcodes ─────────────────────────────────────────────────
// A minimal instruction set inspired by Knuth's MIX,
// but stack-based to mirror WebAssembly itself.
pub const OP_NOP: u8 = 0x00;
pub const OP_PUSH: u8 = 0x01; // followed by 4 bytes (i32 LE)
pub const OP_ADD: u8 = 0x02;
pub const OP_SUB: u8 = 0x03;
pub const OP_MUL: u8 = 0x04;
pub const OP_DIV: u8 = 0x05;
pub const OP_MOD: u8 = 0x06;
pub const OP_DUP: u8 = 0x07;
pub const OP_DROP: u8 = 0x08;
pub const OP_SWAP: u8 = 0x09;
pub const OP_LOAD: u8 = 0x0A;  // pop addr, push memory[addr]
pub const OP_STORE: u8 = 0x0B; // pop val, pop addr, memory[addr] = val
pub const OP_JMP: u8 = 0x0C;   // next 2 bytes = address
pub const OP_JZ: u8 = 0x0D;    // pop, jump if zero
pub const OP_JNZ: u8 = 0x0E;   // pop, jump if nonzero
pub const OP_LT: u8 = 0x0F;    // pop b, pop a, push (a < b) ? 1 : 0
pub const OP_EQ: u8 = 0x10;    // pop b, pop a, push (a == b) ? 1 : 0
pub const OP_GT: u8 = 0x11;    // pop b, pop a, push (a > b) ? 1 : 0
pub const OP_OUTPUT: u8 = 0x12; // pop and record as output
pub const OP_HALT: u8 = 0xFF;

const MEMORY_SIZE: usize = 256;
const MAX_STACK: usize = 256;
const MAX_OUTPUT: usize = 64;

/// A step-by-step stack machine.
///
/// This is a pedagogical VM — the simplest possible machine that
/// demonstrates how WebAssembly actually works. Each `step()` call
/// executes one instruction and exposes the full machine state
/// (stack, memory, program counter) for visualization.
#[wasm_bindgen]
pub struct StackMachine {
    stack: Vec<i32>,
    memory: Vec<i32>,
    program: Vec<u8>,
    pc: u32,
    halted: bool,
    error: String,
    step_count: u32,
    // Last instruction metadata (for visualization)
    last_op: u8,
    last_pc: u32,
    // Output buffer
    output: Vec<i32>,
}

#[wasm_bindgen]
impl StackMachine {
    #[wasm_bindgen(constructor)]
    pub fn new() -> StackMachine {
        StackMachine {
            stack: Vec::with_capacity(MAX_STACK),
            memory: vec![0i32; MEMORY_SIZE],
            program: Vec::new(),
            pc: 0,
            halted: true,
            error: String::new(),
            step_count: 0,
            last_op: OP_NOP,
            last_pc: 0,
            output: Vec::new(),
        }
    }

    /// Load a program from assembly text.
    ///
    /// Format (one instruction per line):
    /// ```
    /// PUSH 3
    /// PUSH 4
    /// ADD
    /// OUTPUT
    /// HALT
    /// ```
    pub fn load_program(&mut self, source: &str) {
        self.program.clear();
        self.error.clear();

        for line in source.lines() {
            let line = line.trim();
            if line.is_empty() || line.starts_with('#') || line.starts_with(';') {
                continue;
            }

            let parts: Vec<&str> = line.splitn(2, ' ').collect();
            let op = parts[0].to_uppercase();

            match op.as_str() {
                "NOP" => self.program.push(OP_NOP),
                "PUSH" => {
                    self.program.push(OP_PUSH);
                    let val = parts.get(1)
                        .and_then(|s| s.trim().parse::<i32>().ok())
                        .unwrap_or(0);
                    for b in val.to_le_bytes() {
                        self.program.push(b);
                    }
                }
                "ADD" => self.program.push(OP_ADD),
                "SUB" => self.program.push(OP_SUB),
                "MUL" => self.program.push(OP_MUL),
                "DIV" => self.program.push(OP_DIV),
                "MOD" => self.program.push(OP_MOD),
                "DUP" => self.program.push(OP_DUP),
                "DROP" => self.program.push(OP_DROP),
                "SWAP" => self.program.push(OP_SWAP),
                "LOAD" => self.program.push(OP_LOAD),
                "STORE" => self.program.push(OP_STORE),
                "JMP" => {
                    self.program.push(OP_JMP);
                    let addr = parts.get(1)
                        .and_then(|s| s.trim().parse::<u16>().ok())
                        .unwrap_or(0);
                    self.program.push((addr & 0xFF) as u8);
                    self.program.push((addr >> 8) as u8);
                }
                "JZ" => {
                    self.program.push(OP_JZ);
                    let addr = parts.get(1)
                        .and_then(|s| s.trim().parse::<u16>().ok())
                        .unwrap_or(0);
                    self.program.push((addr & 0xFF) as u8);
                    self.program.push((addr >> 8) as u8);
                }
                "JNZ" => {
                    self.program.push(OP_JNZ);
                    let addr = parts.get(1)
                        .and_then(|s| s.trim().parse::<u16>().ok())
                        .unwrap_or(0);
                    self.program.push((addr & 0xFF) as u8);
                    self.program.push((addr >> 8) as u8);
                }
                "LT" => self.program.push(OP_LT),
                "EQ" => self.program.push(OP_EQ),
                "GT" => self.program.push(OP_GT),
                "OUTPUT" => self.program.push(OP_OUTPUT),
                "HALT" => self.program.push(OP_HALT),
                _ => {
                    self.error = format!("Unknown instruction: {}", op);
                    return;
                }
            }
        }

        self.reset();
    }

    /// Reset execution state (keep program loaded)
    pub fn reset(&mut self) {
        self.stack.clear();
        self.memory = vec![0i32; MEMORY_SIZE];
        self.pc = 0;
        self.halted = self.program.is_empty();
        self.error.clear();
        self.step_count = 0;
        self.last_op = OP_NOP;
        self.last_pc = 0;
        self.output.clear();
    }

    /// Execute one instruction. Returns false if halted.
    pub fn step(&mut self) -> bool {
        if self.halted {
            return false;
        }

        let pc = self.pc as usize;
        if pc >= self.program.len() {
            self.halted = true;
            self.error = "PC past end of program".into();
            return false;
        }

        let op = self.program[pc];
        self.last_op = op;
        self.last_pc = self.pc;
        self.step_count += 1;

        match op {
            OP_NOP => {
                self.pc += 1;
            }
            OP_PUSH => {
                if pc + 4 >= self.program.len() {
                    self.halted = true;
                    self.error = "PUSH: missing operand".into();
                    return false;
                }
                let bytes = [
                    self.program[pc + 1],
                    self.program[pc + 2],
                    self.program[pc + 3],
                    self.program[pc + 4],
                ];
                let val = i32::from_le_bytes(bytes);
                self.push(val);
                self.pc += 5;
            }
            OP_ADD => {
                if let Some((a, b)) = self.pop2() {
                    self.push(a.wrapping_add(b));
                }
                self.pc += 1;
            }
            OP_SUB => {
                if let Some((a, b)) = self.pop2() {
                    self.push(a.wrapping_sub(b));
                }
                self.pc += 1;
            }
            OP_MUL => {
                if let Some((a, b)) = self.pop2() {
                    self.push(a.wrapping_mul(b));
                }
                self.pc += 1;
            }
            OP_DIV => {
                if let Some((a, b)) = self.pop2() {
                    if b == 0 {
                        self.halted = true;
                        self.error = "Division by zero".into();
                        return false;
                    }
                    self.push(a / b);
                }
                self.pc += 1;
            }
            OP_MOD => {
                if let Some((a, b)) = self.pop2() {
                    if b == 0 {
                        self.halted = true;
                        self.error = "Modulo by zero".into();
                        return false;
                    }
                    self.push(a % b);
                }
                self.pc += 1;
            }
            OP_DUP => {
                if let Some(val) = self.stack.last().copied() {
                    self.push(val);
                } else {
                    self.halted = true;
                    self.error = "DUP: stack empty".into();
                    return false;
                }
                self.pc += 1;
            }
            OP_DROP => {
                if self.stack.pop().is_none() {
                    self.halted = true;
                    self.error = "DROP: stack empty".into();
                    return false;
                }
                self.pc += 1;
            }
            OP_SWAP => {
                let len = self.stack.len();
                if len < 2 {
                    self.halted = true;
                    self.error = "SWAP: need 2 values".into();
                    return false;
                }
                self.stack.swap(len - 1, len - 2);
                self.pc += 1;
            }
            OP_LOAD => {
                if let Some(addr) = self.stack.pop() {
                    let a = addr as usize;
                    if a >= MEMORY_SIZE {
                        self.halted = true;
                        self.error = format!("LOAD: address {} out of bounds", addr);
                        return false;
                    }
                    self.push(self.memory[a]);
                } else {
                    self.halted = true;
                    self.error = "LOAD: stack empty".into();
                    return false;
                }
                self.pc += 1;
            }
            OP_STORE => {
                if self.stack.len() < 2 {
                    self.halted = true;
                    self.error = "STORE: need 2 values".into();
                    return false;
                }
                let val = self.stack.pop().unwrap();
                let addr = self.stack.pop().unwrap();
                let a = addr as usize;
                if a >= MEMORY_SIZE {
                    self.halted = true;
                    self.error = format!("STORE: address {} out of bounds", addr);
                    return false;
                }
                self.memory[a] = val;
                self.pc += 1;
            }
            OP_JMP => {
                let addr = self.read_u16(pc + 1);
                self.pc = addr as u32;
            }
            OP_JZ => {
                let addr = self.read_u16(pc + 1);
                if let Some(val) = self.stack.pop() {
                    if val == 0 {
                        self.pc = addr as u32;
                    } else {
                        self.pc += 3;
                    }
                } else {
                    self.halted = true;
                    self.error = "JZ: stack empty".into();
                    return false;
                }
            }
            OP_JNZ => {
                let addr = self.read_u16(pc + 1);
                if let Some(val) = self.stack.pop() {
                    if val != 0 {
                        self.pc = addr as u32;
                    } else {
                        self.pc += 3;
                    }
                } else {
                    self.halted = true;
                    self.error = "JNZ: stack empty".into();
                    return false;
                }
            }
            OP_LT => {
                if let Some((a, b)) = self.pop2() {
                    self.push(if a < b { 1 } else { 0 });
                }
                self.pc += 1;
            }
            OP_EQ => {
                if let Some((a, b)) = self.pop2() {
                    self.push(if a == b { 1 } else { 0 });
                }
                self.pc += 1;
            }
            OP_GT => {
                if let Some((a, b)) = self.pop2() {
                    self.push(if a > b { 1 } else { 0 });
                }
                self.pc += 1;
            }
            OP_OUTPUT => {
                if let Some(val) = self.stack.pop() {
                    if self.output.len() < MAX_OUTPUT {
                        self.output.push(val);
                    }
                } else {
                    self.halted = true;
                    self.error = "OUTPUT: stack empty".into();
                    return false;
                }
                self.pc += 1;
            }
            OP_HALT => {
                self.halted = true;
            }
            _ => {
                self.halted = true;
                self.error = format!("Unknown opcode: 0x{:02X}", op);
                return false;
            }
        }

        !self.halted
    }

    /// Run N steps at once
    pub fn step_n(&mut self, n: u32) -> bool {
        for _ in 0..n {
            if !self.step() {
                return false;
            }
        }
        true
    }

    // ── Helpers ──────────────────────────────────────────────

    fn push(&mut self, val: i32) {
        if self.stack.len() >= MAX_STACK {
            self.halted = true;
            self.error = "Stack overflow".into();
            return;
        }
        self.stack.push(val);
    }

    fn pop2(&mut self) -> Option<(i32, i32)> {
        if self.stack.len() < 2 {
            self.halted = true;
            self.error = "Stack underflow: need 2 values".into();
            return None;
        }
        let b = self.stack.pop().unwrap();
        let a = self.stack.pop().unwrap();
        Some((a, b))
    }

    fn read_u16(&self, offset: usize) -> u16 {
        if offset + 1 >= self.program.len() {
            return 0;
        }
        u16::from_le_bytes([self.program[offset], self.program[offset + 1]])
    }

    // ── Accessors (zero-copy where possible) ─────────────────

    pub fn stack_ptr(&self) -> *const i32 {
        self.stack.as_ptr()
    }

    pub fn stack_depth(&self) -> u32 {
        self.stack.len() as u32
    }

    pub fn memory_ptr(&self) -> *const i32 {
        self.memory.as_ptr()
    }

    pub fn memory_size(&self) -> u32 {
        MEMORY_SIZE as u32
    }

    pub fn program_ptr(&self) -> *const u8 {
        self.program.as_ptr()
    }

    pub fn program_len(&self) -> u32 {
        self.program.len() as u32
    }

    pub fn pc(&self) -> u32 {
        self.pc
    }

    pub fn last_op(&self) -> u8 {
        self.last_op
    }

    pub fn last_pc(&self) -> u32 {
        self.last_pc
    }

    pub fn is_halted(&self) -> bool {
        self.halted
    }

    pub fn get_error(&self) -> String {
        self.error.clone()
    }

    pub fn step_count(&self) -> u32 {
        self.step_count
    }

    pub fn output_ptr(&self) -> *const i32 {
        self.output.as_ptr()
    }

    pub fn output_len(&self) -> u32 {
        self.output.len() as u32
    }

    /// Get the opcode name for display
    pub fn opcode_name(op: u8) -> String {
        match op {
            OP_NOP => "NOP",
            OP_PUSH => "PUSH",
            OP_ADD => "ADD",
            OP_SUB => "SUB",
            OP_MUL => "MUL",
            OP_DIV => "DIV",
            OP_MOD => "MOD",
            OP_DUP => "DUP",
            OP_DROP => "DROP",
            OP_SWAP => "SWAP",
            OP_LOAD => "LOAD",
            OP_STORE => "STORE",
            OP_JMP => "JMP",
            OP_JZ => "JZ",
            OP_JNZ => "JNZ",
            OP_LT => "LT",
            OP_EQ => "EQ",
            OP_GT => "GT",
            OP_OUTPUT => "OUTPUT",
            OP_HALT => "HALT",
            _ => "???",
        }.into()
    }

    /// Disassemble the loaded program into readable text
    pub fn disassemble(&self) -> String {
        let mut result = String::new();
        let mut pc = 0;
        while pc < self.program.len() {
            let op = self.program[pc];
            result.push_str(&format!("{:04}: ", pc));
            match op {
                OP_PUSH => {
                    if pc + 4 < self.program.len() {
                        let bytes = [
                            self.program[pc + 1],
                            self.program[pc + 2],
                            self.program[pc + 3],
                            self.program[pc + 4],
                        ];
                        let val = i32::from_le_bytes(bytes);
                        result.push_str(&format!("PUSH {}\n", val));
                        pc += 5;
                    } else {
                        result.push_str("PUSH ???\n");
                        break;
                    }
                }
                OP_JMP | OP_JZ | OP_JNZ => {
                    let name = Self::opcode_name(op);
                    if pc + 2 < self.program.len() {
                        let addr = u16::from_le_bytes([
                            self.program[pc + 1],
                            self.program[pc + 2],
                        ]);
                        result.push_str(&format!("{} {}\n", name, addr));
                        pc += 3;
                    } else {
                        result.push_str(&format!("{} ???\n", name));
                        break;
                    }
                }
                _ => {
                    result.push_str(&format!("{}\n", Self::opcode_name(op)));
                    pc += 1;
                }
            }
        }
        result
    }
}
