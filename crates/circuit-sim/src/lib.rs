use wasm_bindgen::prelude::*;

/// A component in the circuit
#[derive(Clone, Debug)]
enum Component {
    /// Voltage source: value in volts
    Source(f64),
    /// Resistor: value in ohms
    Resistor(f64),
    /// Series combination of sub-circuits
    Series(Vec<Component>),
    /// Parallel combination of sub-circuits
    Parallel(Vec<Component>),
}

impl Component {
    /// Total resistance of this component/sub-circuit (ohms)
    fn resistance(&self) -> f64 {
        match self {
            Component::Source(_) => 0.0, // ideal voltage source
            Component::Resistor(r) => *r,
            Component::Series(parts) => {
                parts.iter().map(|p| p.resistance()).sum()
            }
            Component::Parallel(parts) => {
                let sum_inv: f64 = parts.iter()
                    .map(|p| {
                        let r = p.resistance();
                        if r > 0.0 { 1.0 / r } else { 0.0 }
                    })
                    .sum();
                if sum_inv > 0.0 { 1.0 / sum_inv } else { 0.0 }
            }
        }
    }
}

/// Solved node in the circuit — exposed for visualization
#[derive(Clone, Debug, Default)]
struct SolvedNode {
    label: String,
    kind: u8,          // 0=source, 1=resistor, 2=series, 3=parallel
    resistance: f64,   // ohms
    voltage: f64,      // voltage drop across this component
    current: f64,      // current through this component
    power: f64,        // power dissipated (watts)
}

/// The circuit simulator
///
/// Models a DC circuit as a tree of series/parallel components
/// connected to a single voltage source. Solves using Ohm's law
/// and the series/parallel reduction rules.
#[wasm_bindgen]
pub struct CircuitSim {
    /// The circuit topology
    circuit: Component,
    /// Solved state for each component (flattened for JS access)
    nodes: Vec<SolvedNode>,
    /// Source voltage
    source_voltage: f64,
    /// Total circuit current
    total_current: f64,
    /// Total resistance
    total_resistance: f64,
    /// Total power
    total_power: f64,
    /// Flat f64 buffer for zero-copy JS access
    /// Layout per node: [kind, resistance, voltage, current, power] = 5 floats
    buffer: Vec<f64>,
}

#[wasm_bindgen]
impl CircuitSim {
    #[wasm_bindgen(constructor)]
    pub fn new() -> CircuitSim {
        CircuitSim {
            circuit: Component::Source(12.0),
            nodes: Vec::new(),
            source_voltage: 12.0,
            total_current: 0.0,
            total_resistance: 0.0,
            total_power: 0.0,
            buffer: Vec::new(),
        }
    }

    /// Load a circuit from a simple text description.
    ///
    /// Format (text, not code):
    ///
    /// `V 12` — voltage source, 12V
    /// `R 100` — 100 ohm resistor
    /// `S [ R 100 R 200 ]` — series: 100Ω + 200Ω
    /// `P [ R 100 R 200 ]` — parallel: 100Ω ∥ 200Ω
    /// `S [ R 100 P [ R 200 R 300 ] ]` — nested
    pub fn load(&mut self, desc: &str) {
        let tokens: Vec<&str> = desc.split_whitespace().collect();
        let (circuit, _) = parse_tokens(&tokens, 0);
        self.circuit = circuit;
        self.solve();
    }

    /// Load a preset circuit by name
    pub fn load_preset(&mut self, name: &str) {
        self.circuit = match name {
            "series2" => {
                // 12V source, two resistors in series (100Ω + 220Ω)
                self.source_voltage = 12.0;
                Component::Series(vec![
                    Component::Source(12.0),
                    Component::Resistor(100.0),
                    Component::Resistor(220.0),
                ])
            }
            "parallel2" => {
                // 12V source, two resistors in parallel (100Ω ∥ 220Ω)
                self.source_voltage = 12.0;
                Component::Series(vec![
                    Component::Source(12.0),
                    Component::Parallel(vec![
                        Component::Resistor(100.0),
                        Component::Resistor(220.0),
                    ]),
                ])
            }
            "series3" => {
                // 9V source, three resistors in series
                self.source_voltage = 9.0;
                Component::Series(vec![
                    Component::Source(9.0),
                    Component::Resistor(47.0),
                    Component::Resistor(100.0),
                    Component::Resistor(330.0),
                ])
            }
            "mixed" => {
                // 12V, R1 in series with (R2 ∥ R3)
                self.source_voltage = 12.0;
                Component::Series(vec![
                    Component::Source(12.0),
                    Component::Resistor(100.0),
                    Component::Parallel(vec![
                        Component::Resistor(220.0),
                        Component::Resistor(330.0),
                    ]),
                ])
            }
            "voltage_divider" => {
                // Classic voltage divider: 5V, R1=1kΩ, R2=2kΩ
                self.source_voltage = 5.0;
                Component::Series(vec![
                    Component::Source(5.0),
                    Component::Resistor(1000.0),
                    Component::Resistor(2000.0),
                ])
            }
            "led_circuit" => {
                // LED circuit: 5V source, 330Ω resistor (LED modeled as 2V drop + 150Ω)
                self.source_voltage = 5.0;
                Component::Series(vec![
                    Component::Source(5.0),
                    Component::Resistor(330.0),
                    Component::Resistor(150.0), // LED approximation
                ])
            }
            _ => {
                self.source_voltage = 12.0;
                Component::Series(vec![
                    Component::Source(12.0),
                    Component::Resistor(100.0),
                ])
            }
        };
        self.solve();
    }

    /// Set the source voltage and re-solve
    pub fn set_voltage(&mut self, v: f64) {
        self.source_voltage = v.max(0.0);
        // Update source in circuit
        set_source_voltage(&mut self.circuit, self.source_voltage);
        self.solve();
    }

    /// Solve the circuit using Ohm's law
    fn solve(&mut self) {
        self.nodes.clear();
        self.total_resistance = self.circuit.resistance();
        self.total_current = if self.total_resistance > 0.0 {
            self.source_voltage / self.total_resistance
        } else {
            0.0
        };
        self.total_power = self.source_voltage * self.total_current;

        // Flatten the circuit tree into solved nodes
        solve_component(&self.circuit, self.total_current, &mut self.nodes);

        // Build the flat buffer for JS zero-copy access
        self.buffer.clear();
        for node in &self.nodes {
            self.buffer.push(node.kind as f64);
            self.buffer.push(node.resistance);
            self.buffer.push(node.voltage);
            self.buffer.push(node.current);
            self.buffer.push(node.power);
        }
    }

    // ── Accessors ───────────────────────────────

    pub fn source_voltage(&self) -> f64 { self.source_voltage }
    pub fn total_current(&self) -> f64 { self.total_current }
    pub fn total_current_ma(&self) -> f64 { self.total_current * 1000.0 }
    pub fn total_resistance(&self) -> f64 { self.total_resistance }
    pub fn total_power(&self) -> f64 { self.total_power }
    pub fn total_power_mw(&self) -> f64 { self.total_power * 1000.0 }
    pub fn node_count(&self) -> u32 { self.nodes.len() as u32 }

    /// Pointer to the flat buffer for zero-copy JS access.
    /// Layout: [kind, resistance, voltage, current, power] × node_count
    pub fn buffer_ptr(&self) -> *const f64 { self.buffer.as_ptr() }

    /// Get a human-readable summary of the circuit
    pub fn summary(&self) -> String {
        let mut s = format!(
            "Source: {:.1}V | Total R: {:.1}Ω | Current: {:.2}mA | Power: {:.2}mW\n\n",
            self.source_voltage,
            self.total_resistance,
            self.total_current * 1000.0,
            self.total_power * 1000.0,
        );

        for (i, node) in self.nodes.iter().enumerate() {
            if node.kind == 0 { continue; } // skip source
            s.push_str(&format!(
                "{}: {} = {:.1}Ω → V={:.2}V, I={:.2}mA, P={:.2}mW\n",
                node.label,
                match node.kind { 1 => "Resistor", 2 => "Series", 3 => "Parallel", _ => "?" },
                node.resistance,
                node.voltage,
                node.current * 1000.0,
                node.power * 1000.0,
            ));
        }
        s
    }

    /// Get the label for node at index
    pub fn node_label(&self, idx: u32) -> String {
        self.nodes.get(idx as usize).map(|n| n.label.clone()).unwrap_or_default()
    }

    /// Ohm's law calculator: given any two of V, I, R, compute the third.
    /// Pass -1 for the unknown.
    pub fn ohms_law(v: f64, i: f64, r: f64) -> String {
        if v < 0.0 {
            // V = IR
            let result = i * r;
            format!("V = I × R = {:.4} × {:.4} = {:.4} V", i, r, result)
        } else if i < 0.0 {
            // I = V/R
            if r == 0.0 { return "Error: R cannot be 0".into(); }
            let result = v / r;
            format!("I = V / R = {:.4} / {:.4} = {:.4} A ({:.2} mA)", v, r, result, result * 1000.0)
        } else {
            // R = V/I
            if i == 0.0 { return "Error: I cannot be 0".into(); }
            let result = v / i;
            format!("R = V / I = {:.4} / {:.4} = {:.4} Ω", v, i, result)
        }
    }

    /// Power calculator: P = IV = I²R = V²/R
    pub fn power_calc(v: f64, i: f64) -> String {
        let p = v * i;
        format!("P = V × I = {:.4} × {:.4} = {:.4} W ({:.2} mW)", v, i, p, p * 1000.0)
    }
}

// ── Internal helpers ────────────────────────────

fn set_source_voltage(comp: &mut Component, v: f64) {
    match comp {
        Component::Source(ref mut sv) => *sv = v,
        Component::Series(ref mut parts) | Component::Parallel(ref mut parts) => {
            for p in parts { set_source_voltage(p, v); }
        }
        _ => {}
    }
}

fn solve_component(comp: &Component, current: f64, nodes: &mut Vec<SolvedNode>) {
    let idx = nodes.len();
    match comp {
        Component::Source(v) => {
            nodes.push(SolvedNode {
                label: "V₁".into(),
                kind: 0,
                resistance: 0.0,
                voltage: *v,
                current,
                power: v * current,
            });
        }
        Component::Resistor(r) => {
            let v = current * r;
            let label = format!("R{}", idx);
            nodes.push(SolvedNode {
                label,
                kind: 1,
                resistance: *r,
                voltage: v,
                current,
                power: v * current,
            });
        }
        Component::Series(parts) => {
            // In series: same current through all, voltages add
            for part in parts {
                solve_component(part, current, nodes);
            }
        }
        Component::Parallel(parts) => {
            // In parallel: same voltage across all, currents add
            let total_r = comp.resistance();
            let v_across = current * total_r;
            for part in parts {
                let part_r = part.resistance();
                let part_i = if part_r > 0.0 { v_across / part_r } else { 0.0 };
                solve_component(part, part_i, nodes);
            }
        }
    }
}

fn parse_tokens(tokens: &[&str], start: usize) -> (Component, usize) {
    if start >= tokens.len() {
        return (Component::Resistor(100.0), start);
    }

    match tokens[start] {
        "V" => {
            let v = tokens.get(start + 1).and_then(|s| s.parse().ok()).unwrap_or(12.0);
            (Component::Source(v), start + 2)
        }
        "R" => {
            let r = tokens.get(start + 1).and_then(|s| s.parse().ok()).unwrap_or(100.0);
            (Component::Resistor(r), start + 2)
        }
        "S" | "P" => {
            let is_series = tokens[start] == "S";
            let mut parts = Vec::new();
            let mut pos = start + 1;
            // Expect '['
            if tokens.get(pos) == Some(&"[") { pos += 1; }
            while pos < tokens.len() && tokens[pos] != "]" {
                let (comp, new_pos) = parse_tokens(tokens, pos);
                parts.push(comp);
                pos = new_pos;
            }
            if pos < tokens.len() { pos += 1; } // skip ']'
            let comp = if is_series { Component::Series(parts) } else { Component::Parallel(parts) };
            (comp, pos)
        }
        _ => (Component::Resistor(100.0), start + 1),
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_series_resistance() {
        let c = Component::Series(vec![
            Component::Resistor(100.0),
            Component::Resistor(200.0),
        ]);
        assert_eq!(c.resistance(), 300.0);
    }

    #[test]
    fn test_parallel_resistance() {
        let c = Component::Parallel(vec![
            Component::Resistor(100.0),
            Component::Resistor(100.0),
        ]);
        assert_eq!(c.resistance(), 50.0);
    }

    #[test]
    fn test_ohms_law() {
        let mut sim = CircuitSim::new();
        sim.load_preset("series2");
        // 12V / 320Ω = 37.5mA
        assert!((sim.total_current() - 0.0375).abs() < 0.001);
        assert!((sim.total_resistance() - 320.0).abs() < 0.1);
    }

    #[test]
    fn test_parallel_circuit() {
        let mut sim = CircuitSim::new();
        sim.load_preset("parallel2");
        // 100Ω ∥ 220Ω = 68.75Ω
        assert!((sim.total_resistance() - 68.75).abs() < 0.1);
    }

    #[test]
    fn test_mixed_circuit() {
        let mut sim = CircuitSim::new();
        sim.load_preset("mixed");
        // 100Ω + (220Ω ∥ 330Ω) = 100 + 132 = 232Ω
        assert!((sim.total_resistance() - 232.0).abs() < 1.0);
    }

    #[test]
    fn test_voltage_divider() {
        let mut sim = CircuitSim::new();
        sim.load_preset("voltage_divider");
        // Vout = 5V × 2000/(1000+2000) = 3.33V
        // Total R = 3000Ω, I = 5/3000 = 1.67mA
        assert!((sim.total_resistance() - 3000.0).abs() < 0.1);
        assert!((sim.total_current() * 1000.0 - 1.667).abs() < 0.01);
    }

    #[test]
    fn test_summary() {
        let mut sim = CircuitSim::new();
        sim.load_preset("series2");
        let s = sim.summary();
        assert!(s.contains("12.0V"));
        assert!(s.contains("320.0Ω"));
    }

    #[test]
    fn test_node_count() {
        let mut sim = CircuitSim::new();
        sim.load_preset("series2");
        assert_eq!(sim.node_count(), 3); // source + 2 resistors
    }

    #[test]
    fn test_ohms_law_calc() {
        let result = CircuitSim::ohms_law(-1.0, 0.5, 100.0);
        assert!(result.contains("50"));
    }
}
