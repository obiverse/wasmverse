//! # euler::theme — Color as mathematics
//!
//! Euler saw harmony in numbers. A theme is a set of colors,
//! each a triple of integers, composed into CSS custom properties.
//! Domain-agnostic: any app defines its own variable names.

use crate::json;

/// An RGB color. All math is integer — no floating point rounding.
#[derive(Clone, Copy, Debug, PartialEq)]
pub struct Color(pub u8, pub u8, pub u8);

impl Color {
    /// Convert to hex string: "#0a0a14"
    pub fn to_hex(&self) -> String {
        format!("#{:02x}{:02x}{:02x}", self.0, self.1, self.2)
    }

    /// Convert to rgba string: "rgba(10,10,20,0.5)"
    pub fn to_rgba(&self, alpha: f32) -> String {
        format!("rgba({},{},{},{})", self.0, self.1, self.2, alpha)
    }

    /// Linear interpolation between two colors
    pub fn mix(&self, other: &Color, t: f32) -> Color {
        let t = t.clamp(0.0, 1.0);
        let inv = 1.0 - t;
        Color(
            (self.0 as f32 * inv + other.0 as f32 * t) as u8,
            (self.1 as f32 * inv + other.1 as f32 * t) as u8,
            (self.2 as f32 * inv + other.2 as f32 * t) as u8,
        )
    }

    /// Lighten by a percentage (0-100)
    pub fn lighten(&self, pct: u8) -> Color {
        self.mix(&Color(255, 255, 255), pct as f32 / 100.0)
    }

    /// Darken by a percentage (0-100)
    pub fn darken(&self, pct: u8) -> Color {
        self.mix(&Color(0, 0, 0), pct as f32 / 100.0)
    }
}

/// A theme: a named set of CSS custom properties.
/// The vars slice is `&[("--property-name", "value")]`.
/// Domain-agnostic — any app defines its own variables.
pub struct Theme {
    pub name: &'static str,
    pub vars: &'static [(&'static str, &'static str)],
}

impl Theme {
    /// Generate JSON of CSS custom properties: {"--bg":"#0a0a14",...}
    pub fn to_css_json(&self) -> String {
        let mut w = json::Writer::new();
        w.object_open();
        for (i, (prop, val)) in self.vars.iter().enumerate() {
            if i > 0 { w.needs_sep = true; } // force comma
            w.key(prop).val_str(val);
            w.needs_sep = false; // key already handled sep
        }
        // Fix: use raw construction for cleaner output
        let mut s = String::from("{");
        for (i, (prop, val)) in self.vars.iter().enumerate() {
            if i > 0 { s.push(','); }
            s.push_str(&format!("\"{}\":\"{}\"", json::escape(prop), json::escape(val)));
        }
        s.push('}');
        s
    }

    /// Generate CSS JSON with specific overrides (e.g., book accent color)
    pub fn with_overrides(&self, overrides: &[(&str, &str)]) -> String {
        let mut s = String::from("{");
        for (i, (prop, val)) in self.vars.iter().enumerate() {
            if i > 0 { s.push(','); }
            // Check if this property is overridden
            let actual_val = overrides.iter()
                .find(|(k, _)| *k == *prop)
                .map(|(_, v)| *v)
                .unwrap_or(val);
            s.push_str(&format!("\"{}\":\"{}\"", json::escape(prop), json::escape(actual_val)));
        }
        s.push('}');
        s
    }
}

// ═══════════════════════════════════════════════
// BUILT-IN THEMES — The four seasons of reading
// ═══════════════════════════════════════════════

pub const MIDNIGHT: Theme = Theme {
    name: "midnight",
    vars: &[
        ("--bg-deep", "#06060e"), ("--bg", "#0a0a14"), ("--bg-elevated", "#0f0f1e"),
        ("--bg-code", "#0c0c18"), ("--text", "#ddd5c4"), ("--text-dim", "#9e9684"),
        ("--text-bright", "#f0e8d8"), ("--gold", "#c9a96e"), ("--gold-bright", "#e4c98a"),
        ("--gold-dim", "#8b6914"), ("--gold-glow", "rgba(201,169,110,0.12)"),
        ("--border", "#1e1e30"), ("--border-subtle", "#16162a"),
    ],
};

pub const PARCHMENT: Theme = Theme {
    name: "parchment",
    vars: &[
        ("--bg-deep", "#efe8d8"), ("--bg", "#faf7f0"), ("--bg-elevated", "#f4efe4"),
        ("--bg-code", "#ece5d4"), ("--text", "#2a2520"), ("--text-dim", "#6b6358"),
        ("--text-bright", "#1a1510"), ("--gold", "#8b6914"), ("--gold-bright", "#6b4f1d"),
        ("--gold-dim", "#b8951f"), ("--gold-glow", "rgba(139,105,20,0.12)"),
        ("--border", "#d8ceb8"), ("--border-subtle", "#e2d9c8"),
    ],
};

pub const SEPIA: Theme = Theme {
    name: "sepia",
    vars: &[
        ("--bg-deep", "#ede3cc"), ("--bg", "#f5edd8"), ("--bg-elevated", "#efe7d0"),
        ("--bg-code", "#e8e0c8"), ("--text", "#3d3229"), ("--text-dim", "#7a6e5e"),
        ("--text-bright", "#2a2118"), ("--gold", "#6b4f1d"), ("--gold-bright", "#523a12"),
        ("--gold-dim", "#9e7a30"), ("--gold-glow", "rgba(107,79,29,0.12)"),
        ("--border", "#d0c4aa"), ("--border-subtle", "#dbd0b8"),
    ],
};

pub const DAWN: Theme = Theme {
    name: "dawn",
    vars: &[
        ("--bg-deep", "#1a1520"), ("--bg", "#201a2a"), ("--bg-elevated", "#281f35"),
        ("--bg-code", "#1e1828"), ("--text", "#d8cce0"), ("--text-dim", "#9a8ba8"),
        ("--text-bright", "#efe4f8"), ("--gold", "#b088d0"), ("--gold-bright", "#c8a0e8"),
        ("--gold-dim", "#7a5a9a"), ("--gold-glow", "rgba(176,136,208,0.12)"),
        ("--border", "#352a45"), ("--border-subtle", "#2a2038"),
    ],
};

const ALL_THEMES: &[&Theme] = &[&MIDNIGHT, &PARCHMENT, &SEPIA, &DAWN];

/// Look up a theme by name
pub fn get(name: &str) -> Option<&'static Theme> {
    ALL_THEMES.iter().find(|t| t.name == name).copied()
}

/// List all built-in themes
pub fn list() -> &'static [&'static Theme] {
    ALL_THEMES
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_color_hex() {
        assert_eq!(Color(10, 10, 20).to_hex(), "#0a0a14");
        assert_eq!(Color(255, 255, 255).to_hex(), "#ffffff");
    }

    #[test]
    fn test_color_mix() {
        let black = Color(0, 0, 0);
        let white = Color(255, 255, 255);
        let mid = black.mix(&white, 0.5);
        assert_eq!(mid, Color(127, 127, 127));
    }

    #[test]
    fn test_theme_css_json() {
        let css = MIDNIGHT.to_css_json();
        assert!(css.contains("\"--bg\":\"#0a0a14\""));
        assert!(css.starts_with('{'));
        assert!(css.ends_with('}'));
    }

    #[test]
    fn test_theme_overrides() {
        let css = MIDNIGHT.with_overrides(&[("--gold", "#ff0000")]);
        assert!(css.contains("\"--gold\":\"#ff0000\""));
        assert!(css.contains("\"--bg\":\"#0a0a14\"")); // non-overridden preserved
    }

    #[test]
    fn test_get_theme() {
        assert_eq!(get("midnight").unwrap().name, "midnight");
        assert_eq!(get("parchment").unwrap().name, "parchment");
        assert!(get("nonexistent").is_none());
    }

    #[test]
    fn test_list_themes() {
        assert_eq!(list().len(), 4);
    }
}
