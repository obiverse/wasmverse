use wasm_bindgen::prelude::*;

// ============================================================================
// PATH 1: The Figma Pattern — Wasm Owns State, JS Paints
// ============================================================================
//
// MENTAL MODEL:
//   Wasm = brain (compute, state, simulation)
//   JS   = eyes + hands (canvas rendering, user input)
//   Boundary = one pointer per frame (zero-copy)
//
// WHY THIS MATTERS:
//   - No serialization overhead (JS reads Wasm memory directly)
//   - Predictable performance (no GC pauses, no JIT deopt)
//   - Framework-agnostic (works in React, Vue, Svelte, vanilla, anything)
//
// HOW IT WORKS:
//   1. Rust struct lives in Wasm linear memory (a flat byte array)
//   2. cells_ptr() returns a raw pointer INTO that memory
//   3. JS creates a Uint8Array VIEW over the same bytes — no copy!
//   4. JS reads the pixels and blits them to Canvas
//
// PLAN 9 PARALLEL:
//   This is like a file server. The Universe struct is the "file".
//   cells_ptr() is read(). tick() is a write that transforms state.
//   The Canvas is just a "display device" mounted in the namespace.

/// Cell states — #[repr(u8)] means each cell is exactly one byte in memory.
/// This is critical: it lets JS read cells directly as a Uint8Array without
/// any encoding/decoding. The repr controls the binary layout.
#[wasm_bindgen]
#[repr(u8)]
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub enum Cell {
    Dead = 0,
    Alive = 1,
}

/// The Universe — all state lives here, in Wasm linear memory.
///
/// When JS calls Universe.new(), wasm-bindgen:
///   1. Allocates space in the Wasm heap (malloc inside linear memory)
///   2. Returns an opaque handle (integer) to JS
///   3. JS stores that handle; future method calls pass it back
///
/// The Vec<Cell> is contiguous bytes in linear memory — JS can read
/// them directly through a typed array view at the pointer address.
#[wasm_bindgen]
pub struct Universe {
    width: u32,
    height: u32,
    cells: Vec<Cell>,
    /// Generation counter — demonstrates mutable state owned by Wasm
    generation: u64,
}

#[wasm_bindgen]
impl Universe {
    /// Create a new universe with an interesting initial pattern.
    ///
    /// NOTE: This runs IN Wasm. The Vec<Cell> is allocated in Wasm's
    /// linear memory (the flat byte array). No JS heap objects created.
    pub fn new(width: u32, height: u32) -> Universe {
        // Seed with a pattern — every cell where (row * col) creates
        // interesting interference patterns
        let cells: Vec<Cell> = (0..width * height)
            .map(|i| {
                let row = i / width;
                let col = i % width;
                // Creates a diamond-like pattern with some chaos
                if col % 2 == 0 || row % 3 == 0 || (row + col) % 7 == 0 {
                    Cell::Alive
                } else {
                    Cell::Dead
                }
            })
            .collect();

        Universe {
            width,
            height,
            cells,
            generation: 0,
        }
    }

    // ---- Accessors: cheap i32 returns, no serialization ----

    pub fn width(&self) -> u32 {
        self.width
    }

    pub fn height(&self) -> u32 {
        self.height
    }

    pub fn generation(&self) -> u64 {
        self.generation
    }

    /// THE KEY METHOD: returns a raw pointer into Wasm linear memory.
    ///
    /// JS will do: new Uint8Array(wasm.memory.buffer, ptr, width * height)
    /// This creates a VIEW — not a copy. JS and Wasm share the same bytes.
    /// Cost: one i32 crossing the boundary. That's it.
    pub fn cells_ptr(&self) -> *const Cell {
        self.cells.as_ptr()
    }

    /// Toggle a cell — demonstrates Wasm handling input events.
    /// JS captures click → converts to grid coords → calls this.
    pub fn toggle_cell(&mut self, row: u32, col: u32) {
        let idx = self.get_index(row, col);
        self.cells[idx] = match self.cells[idx] {
            Cell::Dead => Cell::Alive,
            Cell::Alive => Cell::Dead,
        };
    }

    /// Insert a glider at the given position.
    /// A glider is the simplest self-replicating pattern in Game of Life.
    pub fn insert_glider(&mut self, row: u32, col: u32) {
        let glider = [(0, 1), (1, 2), (2, 0), (2, 1), (2, 2)];
        for (dr, dc) in glider {
            let r = (row + dr) % self.height;
            let c = (col + dc) % self.width;
            let idx = self.get_index(r, c);
            self.cells[idx] = Cell::Alive;
        }
    }

    /// Insert a pulsar (period-3 oscillator) — more complex pattern.
    pub fn insert_pulsar(&mut self, row: u32, col: u32) {
        let offsets: &[(u32, u32)] = &[
            // Top-right quadrant (reflected to other 3 quadrants)
            (1, 2), (1, 3), (1, 4),
            (2, 1), (3, 1), (4, 1),
            (2, 6), (3, 6), (4, 6),
            (6, 2), (6, 3), (6, 4),
            // Bottom-right
            (8, 2), (8, 3), (8, 4),
            (9, 1), (10, 1), (11, 1),
            (9, 6), (10, 6), (11, 6),
            (13, 2), (13, 3), (13, 4),
            // Mirror left side
            (1, 8), (1, 9), (1, 10),
            (2, 7), (3, 7), (4, 7),
            (2, 12), (3, 12), (4, 12),
            (6, 8), (6, 9), (6, 10),
            (8, 8), (8, 9), (8, 10),
            (9, 7), (10, 7), (11, 7),
            (9, 12), (10, 12), (11, 12),
            (13, 8), (13, 9), (13, 10),
        ];
        for &(dr, dc) in offsets {
            let r = (row + dr) % self.height;
            let c = (col + dc) % self.width;
            let idx = self.get_index(r, c);
            self.cells[idx] = Cell::Alive;
        }
    }

    /// Advance one generation — Conway's Game of Life rules.
    ///
    /// THIS IS WHERE WASM SHINES: tight loop over contiguous memory,
    /// no GC, no JIT warmup, no deoptimization. Pure computation.
    ///
    /// Rules:
    ///   - Alive + <2 neighbors → Dead (underpopulation)
    ///   - Alive + 2|3 neighbors → Alive (survival)
    ///   - Alive + >3 neighbors → Dead (overpopulation)
    ///   - Dead + exactly 3 neighbors → Alive (reproduction)
    pub fn tick(&mut self) {
        let mut next = self.cells.clone();

        for row in 0..self.height {
            for col in 0..self.width {
                let idx = self.get_index(row, col);
                let cell = self.cells[idx];
                let live_neighbors = self.live_neighbor_count(row, col);

                next[idx] = match (cell, live_neighbors) {
                    (Cell::Alive, x) if x < 2 => Cell::Dead,
                    (Cell::Alive, 2) | (Cell::Alive, 3) => Cell::Alive,
                    (Cell::Alive, x) if x > 3 => Cell::Dead,
                    (Cell::Dead, 3) => Cell::Alive,
                    (otherwise, _) => otherwise,
                };
            }
        }

        self.cells = next;
        self.generation += 1;
    }

    /// Clear all cells
    pub fn clear(&mut self) {
        self.cells = vec![Cell::Dead; (self.width * self.height) as usize];
    }

    /// Randomize all cells
    pub fn randomize(&mut self) {
        // Use a simple LCG instead of pulling in rand crate
        let mut seed = self.generation.wrapping_mul(6364136223846793005).wrapping_add(1);
        for cell in self.cells.iter_mut() {
            seed = seed.wrapping_mul(6364136223846793005).wrapping_add(1);
            *cell = if (seed >> 33) % 2 == 0 {
                Cell::Alive
            } else {
                Cell::Dead
            };
        }
    }
}

// Private helpers — not exported to JS
impl Universe {
    fn get_index(&self, row: u32, col: u32) -> usize {
        (row * self.width + col) as usize
    }

    /// Count live neighbors using wrapping (toroidal topology).
    /// The universe wraps around — like a torus. Edges connect.
    fn live_neighbor_count(&self, row: u32, col: u32) -> u8 {
        let mut count = 0u8;

        // Check all 8 neighbors using wrapping arithmetic
        // This avoids branches — critical for tight loop performance
        for &dr in &[self.height - 1, 0, 1] {
            for &dc in &[self.width - 1, 0, 1] {
                if dr == 0 && dc == 0 {
                    continue; // Skip self
                }
                let r = (row + dr) % self.height;
                let c = (col + dc) % self.width;
                count += self.cells[self.get_index(r, c)] as u8;
            }
        }
        count
    }
}

// ============================================================================
// BONUS: A pure compute function — demonstrates Wasm for number crunching
// ============================================================================

/// Mandelbrot set computation — returns iteration count for a point.
/// This is the kind of work where Wasm absolutely dominates JS:
/// tight numeric loop, no allocations, pure math.
#[wasm_bindgen]
pub fn mandelbrot_point(cx: f64, cy: f64, max_iter: u32) -> u32 {
    let mut zx = 0.0f64;
    let mut zy = 0.0f64;
    let mut i = 0u32;
    while i < max_iter && zx * zx + zy * zy < 4.0 {
        let tmp = zx * zx - zy * zy + cx;
        zy = 2.0 * zx * zy + cy;
        zx = tmp;
        i += 1;
    }
    i
}

/// Compute entire Mandelbrot image into a pre-allocated buffer.
/// Returns pointer to RGBA pixel data — JS blits directly to canvas.
#[wasm_bindgen]
pub struct MandelbrotRenderer {
    width: u32,
    height: u32,
    pixels: Vec<u8>, // RGBA, 4 bytes per pixel
}

#[wasm_bindgen]
impl MandelbrotRenderer {
    pub fn new(width: u32, height: u32) -> MandelbrotRenderer {
        MandelbrotRenderer {
            width,
            height,
            pixels: vec![0u8; (width * height * 4) as usize],
        }
    }

    pub fn width(&self) -> u32 {
        self.width
    }

    pub fn height(&self) -> u32 {
        self.height
    }

    /// Render the Mandelbrot set for a given viewport.
    /// cx, cy = center; zoom = scale factor; max_iter = detail level.
    ///
    /// ALL computation happens in Wasm. JS just blits the result.
    pub fn render(&mut self, cx: f64, cy: f64, zoom: f64, max_iter: u32) {
        let w = self.width as f64;
        let h = self.height as f64;

        for py in 0..self.height {
            for px in 0..self.width {
                let x = cx + (px as f64 - w / 2.0) / (w * zoom);
                let y = cy + (py as f64 - h / 2.0) / (h * zoom);
                let iter = mandelbrot_point(x, y, max_iter);

                let idx = ((py * self.width + px) * 4) as usize;
                if iter == max_iter {
                    // In the set — black
                    self.pixels[idx] = 0;
                    self.pixels[idx + 1] = 0;
                    self.pixels[idx + 2] = 0;
                    self.pixels[idx + 3] = 255;
                } else {
                    // Outside — color by iteration count
                    let t = iter as f64 / max_iter as f64;
                    self.pixels[idx] = (9.0 * (1.0 - t) * t * t * t * 255.0) as u8;
                    self.pixels[idx + 1] = (15.0 * (1.0 - t) * (1.0 - t) * t * t * 255.0) as u8;
                    self.pixels[idx + 2] = (8.5 * (1.0 - t) * (1.0 - t) * (1.0 - t) * t * 255.0) as u8;
                    self.pixels[idx + 3] = 255;
                }
            }
        }
    }

    /// Return pointer to RGBA pixel buffer — JS reads directly, zero-copy.
    pub fn pixels_ptr(&self) -> *const u8 {
        self.pixels.as_ptr()
    }
}
