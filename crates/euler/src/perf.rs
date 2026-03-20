//! # euler::perf — High-resolution timing via web-sys
//!
//! Wraps `window.performance.now()` to track reading session durations.
//! Returns 0.0 in non-browser contexts (native tests, server-side).
//!
//! The measurement: Euler records `performance.now()` when a book is opened
//! and when the tab loses focus. Elapsed time accumulates in `reading_time_ms`.
//! This gives a true "time actually reading" figure — not time-on-page.

/// Returns a high-resolution timestamp in milliseconds (like JS `performance.now()`).
/// Returns 0.0 if not in a browser context (graceful no-op for tests).
pub fn now() -> f64 {
    web_sys::window()
        .and_then(|w| w.performance())
        .map(|p| p.now())
        .unwrap_or(0.0)
}
