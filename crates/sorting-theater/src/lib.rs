use wasm_bindgen::prelude::*;

/// Algorithm identifiers
const BUBBLE: u8 = 0;
const INSERTION: u8 = 1;
const SELECTION: u8 = 2;
const QUICKSORT: u8 = 3;
const HEAPSORT: u8 = 4;
const MERGE: u8 = 5;

/// A step-by-step sorting visualizer.
///
/// Each call to `step()` advances exactly one comparison or swap,
/// exposing the full array state for zero-copy rendering.
/// This is the TAOCP approach: make every atomic operation visible.
#[wasm_bindgen]
pub struct SortingTheater {
    data: Vec<u32>,
    original: Vec<u32>,
    size: u32,
    algorithm: u8,
    // Visualization state
    highlight_a: i32,
    highlight_b: i32,
    sorted_from: i32, // elements at index >= sorted_from are sorted (for bubble)
    // Counters
    comparisons: u32,
    swaps: u32,
    done: bool,
    // Algorithm-specific state (register file)
    // Bubble/Insertion/Selection: [i, j, ...]
    // Quicksort: explicit stack of (lo, hi) pairs + partition state
    // Heapsort: [phase, node, heap_size]
    // Merge: iterative bottom-up state
    regs: Vec<i32>,
    // Auxiliary buffer for merge sort
    aux: Vec<u32>,
}

#[wasm_bindgen]
impl SortingTheater {
    #[wasm_bindgen(constructor)]
    pub fn new(size: u32, algorithm: u8) -> SortingTheater {
        let mut data: Vec<u32> = (1..=size).collect();
        // Fisher-Yates shuffle with LCG
        let mut rng: u64 = 0xDEAD_BEEF;
        for i in (1..data.len()).rev() {
            rng = rng.wrapping_mul(6364136223846793005).wrapping_add(1);
            let j = (rng >> 33) as usize % (i + 1);
            data.swap(i, j);
        }
        let original = data.clone();
        let aux = vec![0u32; size as usize];
        let mut theater = SortingTheater {
            data,
            original,
            size,
            algorithm,
            highlight_a: -1,
            highlight_b: -1,
            sorted_from: size as i32,
            comparisons: 0,
            swaps: 0,
            done: false,
            regs: Vec::new(),
            aux,
        };
        theater.init_algorithm();
        theater
    }

    fn init_algorithm(&mut self) {
        self.done = false;
        self.comparisons = 0;
        self.swaps = 0;
        self.highlight_a = -1;
        self.highlight_b = -1;
        self.sorted_from = self.size as i32;
        match self.algorithm {
            BUBBLE => {
                // regs: [i (pass), j (position in pass)]
                self.regs = vec![0, 0];
            }
            INSERTION => {
                // regs: [i (element to insert), j (comparison position)]
                self.regs = vec![1, 0]; // start inserting element 1
            }
            SELECTION => {
                // regs: [i (position to fill), j (scan position), min_idx]
                self.regs = vec![0, 1, 0];
            }
            QUICKSORT => {
                // regs: [state, lo, hi, pivot_val, i, j]
                // state: 0 = pop from stack, 1 = partitioning
                // stack stored in regs[6..] as pairs (lo, hi)
                let n = self.size as i32;
                self.regs = vec![0, 0, 0, 0, 0, 0, 0, n - 1];
            }
            HEAPSORT => {
                // regs: [phase, i, heap_size]
                // phase 0: building heap (sift down from n/2-1 to 0)
                // phase 1: extracting (swap root with end, sift down)
                let n = self.size as i32;
                self.regs = vec![0, n / 2 - 1, n, -1, -1];
                // regs[3], regs[4] used for sift_down state: current, child
            }
            MERGE => {
                // Bottom-up merge sort
                // regs: [width, lo, phase]
                // phase 0: merge current pair, phase 1: advance
                self.regs = vec![1, 0, 0, 0]; // width, lo, merge_i, merge_j
                self.aux = self.data.clone();
            }
            _ => {
                self.done = true;
            }
        }
    }

    /// Advance one step. Returns false when sorting is complete.
    pub fn step(&mut self) -> bool {
        if self.done {
            return false;
        }
        match self.algorithm {
            BUBBLE => self.step_bubble(),
            INSERTION => self.step_insertion(),
            SELECTION => self.step_selection(),
            QUICKSORT => self.step_quicksort(),
            HEAPSORT => self.step_heapsort(),
            MERGE => self.step_merge(),
            _ => {
                self.done = true;
                false
            }
        }
    }

    // ── Bubble Sort ─────────────────────────────────────────
    fn step_bubble(&mut self) -> bool {
        let n = self.size as i32;
        let i = self.regs[0]; // pass number
        let j = self.regs[1]; // position in pass

        if i >= n - 1 {
            self.done = true;
            self.highlight_a = -1;
            self.highlight_b = -1;
            return false;
        }

        let limit = n - 1 - i;
        if j >= limit {
            // End of pass
            self.sorted_from = limit;
            self.regs[0] += 1;
            self.regs[1] = 0;
            return true;
        }

        let a = j as usize;
        let b = (j + 1) as usize;
        self.highlight_a = j;
        self.highlight_b = j + 1;
        self.comparisons += 1;

        if self.data[a] > self.data[b] {
            self.data.swap(a, b);
            self.swaps += 1;
        }

        self.regs[1] += 1;
        true
    }

    // ── Insertion Sort ──────────────────────────────────────
    fn step_insertion(&mut self) -> bool {
        let n = self.size as i32;
        let i = self.regs[0]; // element being inserted
        let j = self.regs[1]; // comparison position

        if i >= n {
            self.done = true;
            self.highlight_a = -1;
            self.highlight_b = -1;
            return false;
        }

        if j == 0 && self.regs[1] == 0 {
            // Start inserting element i: set j = i
            self.regs[1] = i;
        }

        let jj = self.regs[1];
        if jj <= 0 {
            // Element is in position, move to next
            self.regs[0] += 1;
            self.regs[1] = self.regs[0];
            self.sorted_from = self.size as i32 - self.regs[0];
            return true;
        }

        let a = (jj - 1) as usize;
        let b = jj as usize;
        self.highlight_a = jj - 1;
        self.highlight_b = jj;
        self.comparisons += 1;

        if self.data[a] > self.data[b] {
            self.data.swap(a, b);
            self.swaps += 1;
            self.regs[1] -= 1;
        } else {
            // Element is in position
            self.regs[0] += 1;
            self.regs[1] = self.regs[0];
        }
        true
    }

    // ── Selection Sort ──────────────────────────────────────
    fn step_selection(&mut self) -> bool {
        let n = self.size as i32;
        let i = self.regs[0]; // position to fill
        let j = self.regs[1]; // scan position
        let min_idx = self.regs[2];

        if i >= n - 1 {
            self.done = true;
            self.highlight_a = -1;
            self.highlight_b = -1;
            return false;
        }

        if j >= n {
            // Done scanning, swap minimum into position
            if min_idx != i {
                self.data.swap(i as usize, min_idx as usize);
                self.swaps += 1;
                self.highlight_a = i;
                self.highlight_b = min_idx;
            }
            self.regs[0] += 1;
            self.regs[1] = self.regs[0] + 1;
            self.regs[2] = self.regs[0];
            return true;
        }

        // Compare
        self.highlight_a = min_idx;
        self.highlight_b = j;
        self.comparisons += 1;

        if self.data[j as usize] < self.data[min_idx as usize] {
            self.regs[2] = j; // new minimum
        }

        self.regs[1] += 1;
        true
    }

    // ── Quicksort ───────────────────────────────────────────
    fn step_quicksort(&mut self) -> bool {
        let state = self.regs[0];

        if state == 0 {
            // Pop from stack
            let stack_len = self.regs.len();
            if stack_len <= 6 {
                self.done = true;
                self.highlight_a = -1;
                self.highlight_b = -1;
                return false;
            }
            let hi = self.regs[stack_len - 1];
            let lo = self.regs[stack_len - 2];
            self.regs.truncate(stack_len - 2);

            if lo >= hi {
                return true; // skip empty/single partitions
            }

            // Set up partition: pivot = data[hi], i = lo - 1, j = lo
            self.regs[1] = lo;
            self.regs[2] = hi;
            self.regs[3] = self.data[hi as usize] as i32; // pivot value
            self.regs[4] = lo - 1; // i
            self.regs[5] = lo; // j
            self.regs[0] = 1; // partitioning state
            return true;
        }

        // state == 1: partitioning
        let lo = self.regs[1];
        let hi = self.regs[2];
        let pivot = self.regs[3] as u32;
        let i = self.regs[4];
        let j = self.regs[5];

        if j >= hi {
            // Partition complete: swap pivot into position
            let final_pos = (i + 1) as usize;
            self.data.swap(final_pos, hi as usize);
            self.swaps += 1;
            self.highlight_a = final_pos as i32;
            self.highlight_b = hi;

            let p = final_pos as i32;
            // Push left and right partitions onto stack
            self.regs.push(lo);
            self.regs.push(p - 1);
            self.regs.push(p + 1);
            self.regs.push(hi);
            self.regs[0] = 0; // back to pop state
            return true;
        }

        // Compare data[j] with pivot
        self.highlight_a = j;
        self.highlight_b = hi; // pivot position
        self.comparisons += 1;

        if self.data[j as usize] <= pivot {
            self.regs[4] += 1; // i++
            let new_i = self.regs[4] as usize;
            if new_i != j as usize {
                self.data.swap(new_i, j as usize);
                self.swaps += 1;
            }
        }

        self.regs[5] += 1; // j++
        true
    }

    // ── Heapsort ────────────────────────────────────────────
    fn step_heapsort(&mut self) -> bool {
        let phase = self.regs[0];
        let heap_size = self.regs[2];

        if phase == 0 {
            // Build heap phase: sift down from regs[1] to 0
            let i = self.regs[1];
            if i < 0 {
                // Heap built, switch to extract phase
                self.regs[0] = 1;
                self.regs[2] = self.size as i32 - 1;
                return true;
            }

            // One step of sift-down for node i
            if self.sift_down_step(i, heap_size) {
                // sift-down for this node complete, move to next
                self.regs[1] -= 1;
            }
            return true;
        }

        // Extract phase
        if heap_size <= 0 {
            self.done = true;
            self.highlight_a = -1;
            self.highlight_b = -1;
            return false;
        }

        let hs = heap_size;
        // If regs[3] == -1, we need to start a new extraction
        if self.regs[3] == -1 {
            // Swap root with end
            self.data.swap(0, hs as usize);
            self.swaps += 1;
            self.highlight_a = 0;
            self.highlight_b = hs;
            self.regs[2] -= 1; // shrink heap
            self.regs[3] = 0; // start sift down from root
            self.regs[4] = -1; // child not yet computed
            return true;
        }

        // Sift down root in reduced heap
        let new_hs = self.regs[2];
        if self.sift_down_step(self.regs[3], new_hs) {
            self.regs[3] = -1; // sift complete, next extraction
        }
        true
    }

    /// One comparison+swap of sift-down. Returns true if sift is complete.
    fn sift_down_step(&mut self, node: i32, heap_size: i32) -> bool {
        let left = 2 * node + 1;
        let right = 2 * node + 2;

        if left >= heap_size {
            return true; // leaf node, done
        }

        let mut largest = node;
        self.comparisons += 1;
        self.highlight_a = node;
        self.highlight_b = left;

        if self.data[left as usize] > self.data[largest as usize] {
            largest = left;
        }

        if right < heap_size {
            self.comparisons += 1;
            if self.data[right as usize] > self.data[largest as usize] {
                largest = right;
            }
        }

        if largest != node {
            self.data.swap(node as usize, largest as usize);
            self.swaps += 1;
            self.highlight_a = node;
            self.highlight_b = largest;
            // Continue sifting from new position
            self.regs[3] = largest;
            return false;
        }

        true // heap property satisfied
    }

    // ── Merge Sort (bottom-up iterative) ────────────────────
    fn step_merge(&mut self) -> bool {
        let n = self.size as i32;
        let width = self.regs[0];
        let lo = self.regs[1];

        if width >= n {
            self.done = true;
            self.highlight_a = -1;
            self.highlight_b = -1;
            return false;
        }

        if lo >= n {
            // Done with this width, double it
            self.regs[0] *= 2;
            self.regs[1] = 0;
            return true;
        }

        // Merge data[lo..lo+width] with data[lo+width..lo+2*width]
        let mid = (lo + width).min(n);
        let hi = (lo + 2 * width).min(n);

        let mut i = lo;
        let mut j = mid;
        let mut k = lo;

        // Copy current segment to aux
        for idx in lo..hi {
            self.aux[idx as usize] = self.data[idx as usize];
        }

        // Merge back
        while i < mid && j < hi {
            self.comparisons += 1;
            if self.aux[i as usize] <= self.aux[j as usize] {
                self.data[k as usize] = self.aux[i as usize];
                i += 1;
            } else {
                self.data[k as usize] = self.aux[j as usize];
                j += 1;
                self.swaps += 1;
            }
            k += 1;
        }
        while i < mid {
            self.data[k as usize] = self.aux[i as usize];
            i += 1;
            k += 1;
        }
        while j < hi {
            self.data[k as usize] = self.aux[j as usize];
            j += 1;
            k += 1;
        }

        self.highlight_a = lo;
        self.highlight_b = hi - 1;

        // Advance to next pair
        self.regs[1] += 2 * width;
        true
    }

    // ── Accessors ───────────────────────────────────────────

    pub fn data_ptr(&self) -> *const u32 {
        self.data.as_ptr()
    }

    pub fn size(&self) -> u32 {
        self.size
    }

    pub fn highlight_a(&self) -> i32 {
        self.highlight_a
    }

    pub fn highlight_b(&self) -> i32 {
        self.highlight_b
    }

    pub fn comparisons(&self) -> u32 {
        self.comparisons
    }

    pub fn swaps(&self) -> u32 {
        self.swaps
    }

    pub fn is_done(&self) -> bool {
        self.done
    }

    pub fn algorithm(&self) -> u8 {
        self.algorithm
    }

    pub fn set_algorithm(&mut self, algo: u8) {
        self.algorithm = algo;
        self.data = self.original.clone();
        self.init_algorithm();
    }

    pub fn reset(&mut self) {
        self.data = self.original.clone();
        self.init_algorithm();
    }

    pub fn randomize(&mut self) {
        let mut data: Vec<u32> = (1..=self.size).collect();
        let mut rng: u64 = (self.comparisons as u64)
            .wrapping_mul(6364136223846793005)
            .wrapping_add(0xCAFE_BABE);
        for i in (1..data.len()).rev() {
            rng = rng.wrapping_mul(6364136223846793005).wrapping_add(1);
            let j = (rng >> 33) as usize % (i + 1);
            data.swap(i, j);
        }
        self.data = data.clone();
        self.original = data;
        self.aux = vec![0u32; self.size as usize];
        self.init_algorithm();
    }

    /// Run N steps at once (for "play" mode)
    pub fn step_n(&mut self, n: u32) -> bool {
        for _ in 0..n {
            if !self.step() {
                return false;
            }
        }
        true
    }

    /// Algorithm name
    pub fn algorithm_name(&self) -> String {
        match self.algorithm {
            BUBBLE => "Bubble Sort".into(),
            INSERTION => "Insertion Sort".into(),
            SELECTION => "Selection Sort".into(),
            QUICKSORT => "Quicksort".into(),
            HEAPSORT => "Heapsort".into(),
            MERGE => "Merge Sort".into(),
            _ => "Unknown".into(),
        }
    }
}
