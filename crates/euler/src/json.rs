//! # euler::json — Zero-dependency JSON for known schemas
//!
//! Euler standardized mathematical notation so that ideas could
//! travel between minds without loss. JSON is our notation —
//! but we refuse serde's 80KB tax. For a known schema,
//! 200 lines of careful code suffice.

// ═══════════════════════════════════════════════
// SERIALIZATION — The Writer
// ═══════════════════════════════════════════════

/// A streaming JSON writer. Chainable methods, zero allocation beyond the buffer.
pub struct Writer {
    buf: String,
    /// Whether the next value needs a preceding comma. Public so callers
    /// can force separator state when mixing builder calls with raw writes.
    pub needs_sep: bool,
}

impl Writer {
    pub fn new() -> Self {
        Writer { buf: String::with_capacity(2048), needs_sep: false }
    }

    pub fn object_open(&mut self) -> &mut Self {
        self.buf.push('{');
        self.needs_sep = false;
        self
    }

    pub fn object_close(&mut self) -> &mut Self {
        self.buf.push('}');
        self.needs_sep = true;
        self
    }

    pub fn array_open(&mut self) -> &mut Self {
        self.buf.push('[');
        self.needs_sep = false;
        self
    }

    pub fn array_close(&mut self) -> &mut Self {
        self.buf.push(']');
        self.needs_sep = true;
        self
    }

    /// Write a key (auto-inserts comma if needed)
    pub fn key(&mut self, k: &str) -> &mut Self {
        if self.needs_sep { self.buf.push(','); }
        self.buf.push('"');
        self.buf.push_str(&escape(k));
        self.buf.push_str("\":");
        self.needs_sep = false;
        self
    }

    /// Write a string value
    pub fn val_str(&mut self, v: &str) -> &mut Self {
        if self.needs_sep { self.buf.push(','); }
        self.buf.push('"');
        self.buf.push_str(&escape(v));
        self.buf.push('"');
        self.needs_sep = true;
        self
    }

    /// Write a numeric value
    pub fn val_num(&mut self, v: f64) -> &mut Self {
        if self.needs_sep { self.buf.push(','); }
        // Avoid trailing decimals for integers
        if v == (v as i64) as f64 {
            self.buf.push_str(&format!("{}", v as i64));
        } else {
            self.buf.push_str(&format!("{}", v));
        }
        self.needs_sep = true;
        self
    }

    pub fn val_bool(&mut self, v: bool) -> &mut Self {
        if self.needs_sep { self.buf.push(','); }
        self.buf.push_str(if v { "true" } else { "false" });
        self.needs_sep = true;
        self
    }

    /// Consume the writer, return the JSON string
    pub fn finish(self) -> String {
        self.buf
    }

    /// Write raw JSON (for nested serialization)
    pub fn raw(&mut self, s: &str) -> &mut Self {
        if self.needs_sep { self.buf.push(','); }
        self.buf.push_str(s);
        self.needs_sep = true;
        self
    }
}

// ═══════════════════════════════════════════════
// PARSING — Extract by key from known schema
// ═══════════════════════════════════════════════

/// Escape a string for JSON embedding
pub fn escape(s: &str) -> String {
    let mut out = String::with_capacity(s.len());
    for c in s.chars() {
        match c {
            '"' => out.push_str("\\\""),
            '\\' => out.push_str("\\\\"),
            '\n' => out.push_str("\\n"),
            '\r' => out.push_str("\\r"),
            '\t' => out.push_str("\\t"),
            c if (c as u32) < 0x20 => {
                out.push_str(&format!("\\u{:04x}", c as u32));
            }
            c => out.push(c),
        }
    }
    out
}

/// Extract a string value by key: `"key":"value"` → `Some("value")`
pub fn get_str(json: &str, key: &str) -> Option<String> {
    let pattern = format!("\"{}\"", key);
    let pos = json.find(&pattern)?;
    let after = json[pos + pattern.len()..].trim_start();
    if !after.starts_with(':') { return None; }
    let after = after[1..].trim_start();
    if !after.starts_with('"') { return None; }
    let after = &after[1..];
    let mut result = String::new();
    let mut chars = after.chars();
    loop {
        match chars.next()? {
            '"' => return Some(result),
            '\\' => match chars.next()? {
                '"' => result.push('"'),
                '\\' => result.push('\\'),
                'n' => result.push('\n'),
                'r' => result.push('\r'),
                't' => result.push('\t'),
                c => { result.push('\\'); result.push(c); }
            },
            c => result.push(c),
        }
    }
}

/// Extract a numeric value by key
pub fn get_num(json: &str, key: &str) -> Option<f64> {
    let pattern = format!("\"{}\"", key);
    let pos = json.find(&pattern)?;
    let after = json[pos + pattern.len()..].trim_start();
    if !after.starts_with(':') { return None; }
    let after = after[1..].trim_start();
    let end = after.find(|c: char| !c.is_ascii_digit() && c != '.' && c != '-' && c != 'e' && c != 'E' && c != '+')?;
    after[..end].parse().ok()
}

/// Extract a nested object by key: `"key":{...}` → `Some("{...}")`
pub fn get_object(json: &str, key: &str) -> Option<String> {
    let pattern = format!("\"{}\"", key);
    let pos = json.find(&pattern)?;
    let after = json[pos + pattern.len()..].trim_start();
    if !after.starts_with(':') { return None; }
    let after = after[1..].trim_start();
    extract_balanced(after, '{', '}')
}

/// Extract a nested array by key: `"key":[...]` → `Some("[...]")`
pub fn get_array(json: &str, key: &str) -> Option<String> {
    let pattern = format!("\"{}\"", key);
    let pos = json.find(&pattern)?;
    let after = json[pos + pattern.len()..].trim_start();
    if !after.starts_with(':') { return None; }
    let after = after[1..].trim_start();
    extract_balanced(after, '[', ']')
}

/// Iterate over key-value pairs in a JSON object
pub fn iter_object(json: &str) -> Vec<(String, String)> {
    let json = json.trim();
    if !json.starts_with('{') || !json.ends_with('}') { return Vec::new(); }
    let inner = &json[1..json.len()-1];
    parse_pairs(inner)
}

/// Iterate over elements in a JSON array
pub fn iter_array(json: &str) -> Vec<String> {
    let json = json.trim();
    if !json.starts_with('[') || !json.ends_with(']') { return Vec::new(); }
    let inner = &json[1..json.len()-1];
    parse_elements(inner)
}

// ── Internal helpers ──────────────────────────

fn extract_balanced(s: &str, open: char, close: char) -> Option<String> {
    if !s.starts_with(open) { return None; }
    let mut depth = 0;
    let mut in_string = false;
    let mut esc = false;
    for (i, c) in s.char_indices() {
        if esc { esc = false; continue; }
        if c == '\\' && in_string { esc = true; continue; }
        if c == '"' { in_string = !in_string; continue; }
        if in_string { continue; }
        if c == open { depth += 1; }
        if c == close { depth -= 1; if depth == 0 { return Some(s[..=i].to_string()); } }
    }
    None
}

fn parse_pairs(inner: &str) -> Vec<(String, String)> {
    let mut result = Vec::new();
    let mut pos = 0;
    let bytes = inner.as_bytes();
    while pos < bytes.len() {
        skip_ws(bytes, &mut pos);
        if pos >= bytes.len() { break; }
        if bytes[pos] != b'"' { break; }
        let key = read_string(inner, &mut pos);
        skip_ws(bytes, &mut pos);
        if pos < bytes.len() && bytes[pos] == b':' { pos += 1; }
        skip_ws(bytes, &mut pos);
        if pos >= bytes.len() { break; }
        let val = read_value(inner, &mut pos);
        result.push((key, val));
        skip_ws(bytes, &mut pos);
        if pos < bytes.len() && bytes[pos] == b',' { pos += 1; }
    }
    result
}

fn parse_elements(inner: &str) -> Vec<String> {
    let mut result = Vec::new();
    let mut pos = 0;
    let bytes = inner.as_bytes();
    while pos < bytes.len() {
        skip_ws(bytes, &mut pos);
        if pos >= bytes.len() { break; }
        let val = read_value(inner, &mut pos);
        if !val.is_empty() { result.push(val); }
        skip_ws(bytes, &mut pos);
        if pos < bytes.len() && bytes[pos] == b',' { pos += 1; }
    }
    result
}

fn skip_ws(bytes: &[u8], pos: &mut usize) {
    while *pos < bytes.len() && matches!(bytes[*pos], b' ' | b'\n' | b'\r' | b'\t') {
        *pos += 1;
    }
}

fn read_string(s: &str, pos: &mut usize) -> String {
    let bytes = s.as_bytes();
    if bytes[*pos] != b'"' { return String::new(); }
    *pos += 1;
    let start = *pos;
    while *pos < bytes.len() {
        if bytes[*pos] == b'\\' { *pos += 2; continue; }
        if bytes[*pos] == b'"' { let val = &s[start..*pos]; *pos += 1; return val.to_string(); }
        *pos += 1;
    }
    s[start..].to_string()
}

fn read_value(s: &str, pos: &mut usize) -> String {
    let bytes = s.as_bytes();
    if *pos >= bytes.len() { return String::new(); }
    match bytes[*pos] {
        b'"' => { let start = *pos; let _ = read_string(s, pos); s[start..*pos].to_string() }
        b'{' | b'[' => {
            let open = bytes[*pos] as char;
            let close = if open == '{' { '}' } else { ']' };
            match extract_balanced(&s[*pos..], open, close) {
                Some(v) => { *pos += v.len(); v }
                None => { *pos = s.len(); String::new() }
            }
        }
        _ => {
            let start = *pos;
            while *pos < bytes.len() && !matches!(bytes[*pos], b',' | b'}' | b']') {
                *pos += 1;
            }
            s[start..*pos].trim().to_string()
        }
    }
}

// ═══════════════════════════════════════════════
// TESTS
// ═══════════════════════════════════════════════

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_escape() {
        assert_eq!(escape("hello \"world\""), "hello \\\"world\\\"");
        assert_eq!(escape("line\nbreak"), "line\\nbreak");
    }

    #[test]
    fn test_writer() {
        let mut w = Writer::new();
        w.object_open().key("name").val_str("euler").key("version").val_num(1.0).object_close();
        assert_eq!(w.finish(), r#"{"name":"euler","version":1}"#);
    }

    #[test]
    fn test_writer_nested() {
        let mut w = Writer::new();
        w.object_open()
            .key("theme").val_str("midnight")
            .key("colors").object_open()
                .key("bg").val_str("#000")
            .object_close()
        .object_close();
        assert_eq!(w.finish(), "{\"theme\":\"midnight\",\"colors\":{\"bg\":\"#000\"}}");
    }

    #[test]
    fn test_get_str() {
        let json = r#"{"name":"euler","version":"1.0"}"#;
        assert_eq!(get_str(json, "name"), Some("euler".to_string()));
        assert_eq!(get_str(json, "version"), Some("1.0".to_string()));
        assert_eq!(get_str(json, "missing"), None);
    }

    #[test]
    fn test_get_num() {
        let json = r#"{"count":42,"ratio":3.14}"#;
        assert_eq!(get_num(json, "count"), Some(42.0));
        assert_eq!(get_num(json, "ratio"), Some(3.14));
    }

    #[test]
    fn test_iter_object() {
        let json = r#"{"a":"1","b":"2"}"#;
        let pairs = iter_object(json);
        assert_eq!(pairs.len(), 2);
        assert_eq!(pairs[0].0, "a");
    }

    #[test]
    fn test_iter_array() {
        let json = r#"[{"id":"a"},{"id":"b"}]"#;
        let items = iter_array(json);
        assert_eq!(items.len(), 2);
        assert!(items[0].contains("\"a\""));
    }

    #[test]
    fn test_roundtrip() {
        let mut w = Writer::new();
        w.object_open()
            .key("text").val_str("hello \"world\" \n end")
            .key("num").val_num(42.0)
        .object_close();
        let json = w.finish();
        assert_eq!(get_str(&json, "text"), Some("hello \"world\" \n end".to_string()));
        assert_eq!(get_num(&json, "num"), Some(42.0));
    }
}
