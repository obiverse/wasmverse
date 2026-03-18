//! # euler::router — URL as state
//!
//! Euler solved the Bridges of Königsberg by abstracting
//! the specific (bridges) into the general (graph theory).
//! A URL is a graph address. This module parses it.
//! Pure functions — no browser history API coupling.

/// A parsed route: path + query params + hash fragment
#[derive(Debug, Clone)]
pub struct Route {
    pub path: String,
    pub params: Vec<(String, String)>,
    pub hash: String,
}

impl Route {
    /// Parse a URL string into a Route.
    /// Handles: "/path?key=val&k2=v2#fragment"
    /// Also handles full URLs: "https://host/path?query#hash"
    pub fn parse(url: &str) -> Route {
        let url = url.trim();

        // Strip protocol + host if present
        let path_start = if let Some(pos) = url.find("://") {
            // Find the first / after the host
            url[pos + 3..].find('/').map(|p| pos + 3 + p).unwrap_or(url.len())
        } else {
            0
        };

        let remainder = &url[path_start..];

        // Split hash
        let (before_hash, hash) = match remainder.find('#') {
            Some(pos) => (&remainder[..pos], remainder[pos + 1..].to_string()),
            None => (remainder, String::new()),
        };

        // Split query
        let (path, query_str) = match before_hash.find('?') {
            Some(pos) => (&before_hash[..pos], &before_hash[pos + 1..]),
            None => (before_hash, ""),
        };

        // Parse query params
        let params: Vec<(String, String)> = if query_str.is_empty() {
            Vec::new()
        } else {
            query_str.split('&')
                .filter(|s| !s.is_empty())
                .map(|pair| {
                    match pair.find('=') {
                        Some(pos) => (
                            url_decode(&pair[..pos]),
                            url_decode(&pair[pos + 1..]),
                        ),
                        None => (url_decode(pair), String::new()),
                    }
                })
                .collect()
        };

        Route {
            path: path.to_string(),
            params,
            hash,
        }
    }

    /// Get a query parameter by name
    pub fn param(&self, key: &str) -> Option<&str> {
        self.params.iter()
            .find(|(k, _)| k == key)
            .map(|(_, v)| v.as_str())
    }

    /// Build a URL from components
    pub fn build(path: &str, params: &[(&str, &str)], hash: &str) -> String {
        let mut url = path.to_string();
        if !params.is_empty() {
            url.push('?');
            for (i, (k, v)) in params.iter().enumerate() {
                if i > 0 { url.push('&'); }
                url.push_str(k);
                url.push('=');
                url.push_str(v);
            }
        }
        if !hash.is_empty() {
            url.push('#');
            url.push_str(hash);
        }
        url
    }
}

/// Simple URL decoding (handles %20, %2F, etc.)
fn url_decode(s: &str) -> String {
    let mut result = String::with_capacity(s.len());
    let mut chars = s.chars();
    while let Some(c) = chars.next() {
        if c == '%' {
            let hi = chars.next().unwrap_or('0');
            let lo = chars.next().unwrap_or('0');
            let byte = u8::from_str_radix(&format!("{}{}", hi, lo), 16).unwrap_or(b'?');
            result.push(byte as char);
        } else if c == '+' {
            result.push(' ');
        } else {
            result.push(c);
        }
    }
    result
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_parse_simple() {
        let r = Route::parse("/read.html?book=wasm");
        assert_eq!(r.path, "/read.html");
        assert_eq!(r.param("book"), Some("wasm"));
        assert_eq!(r.hash, "");
    }

    #[test]
    fn test_parse_with_hash() {
        let r = Route::parse("/read.html?book=wasm#letter-5");
        assert_eq!(r.param("book"), Some("wasm"));
        assert_eq!(r.hash, "letter-5");
    }

    #[test]
    fn test_parse_full_url() {
        let r = Route::parse("https://example.com/app/read?book=rust&page=3#ch2");
        assert_eq!(r.path, "/app/read");
        assert_eq!(r.param("book"), Some("rust"));
        assert_eq!(r.param("page"), Some("3"));
        assert_eq!(r.hash, "ch2");
    }

    #[test]
    fn test_parse_no_query() {
        let r = Route::parse("/index.html");
        assert_eq!(r.path, "/index.html");
        assert!(r.params.is_empty());
    }

    #[test]
    fn test_build() {
        let url = Route::build("/read", &[("book", "wasm")], "letter-5");
        assert_eq!(url, "/read?book=wasm#letter-5");
    }

    #[test]
    fn test_build_no_params() {
        let url = Route::build("/index.html", &[], "");
        assert_eq!(url, "/index.html");
    }

    #[test]
    fn test_url_decode() {
        assert_eq!(url_decode("hello%20world"), "hello world");
        assert_eq!(url_decode("a+b"), "a b");
    }
}
