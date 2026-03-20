//! # Euler — A General-Purpose WASM Web Framework
//!
//! Named after Leonhard Euler, who found the general system
//! that made specific problems trivial.
//!
//! Five modules (the theorems):
//!   json   — serialize/parse without serde
//!   store  — versioned state container
//!   theme  — color math + CSS generation
//!   router — URL parsing
//!   search — full-text TF-IDF index
//!
//! This file (the proof): The Epistolary Library,
//! the first application built on euler.

pub mod json;
pub mod store;
pub mod theme;
pub mod router;
pub mod search;
pub mod perf;

use std::collections::HashMap;
use store::Versioned;
use wasm_bindgen::prelude::*;

// ═══════════════════════════════════════════════
// DOMAIN TYPES — Specific to the Epistolary Library
// ═══════════════════════════════════════════════

#[derive(Clone, Default)]
struct ReadingState {
    chapters_read: u32,
    total_chapters: u32,
    scroll_position: f64,
    current_chapter_id: String,
    last_read: f64,
    reading_time_ms: f64,  // total reading time accumulated across sessions
    session_start: f64,    // perf.now() when current session started; 0 = no session
}

#[derive(Clone)]
struct Bookmark {
    chapter_id: String,
    timestamp: f64,
}

#[derive(Clone)]
struct Highlight {
    id: String,
    chapter_id: String,
    text: String,
    color: String,
    note: String,
    timestamp: f64,
}

#[derive(Clone)]
struct BookMeta {
    id: String,
    title: String,
    letters: u32,
}

#[derive(Default)]
struct AppState {
    theme_name: String,
    font_size: u8,
    line_height: u8,
    content_width: u8,
    sort_key: String,
    filter_key: String,
    view_mode: String,
    reading: HashMap<String, ReadingState>,
    bookmarks: HashMap<String, Vec<Bookmark>>,
    highlights: HashMap<String, Vec<Highlight>>,
    books: Vec<BookMeta>,
}

impl AppState {
    fn new() -> Self {
        AppState {
            theme_name: "midnight".to_string(),
            font_size: 19,
            line_height: 19,  // 1.9 × 10
            content_width: 72,
            sort_key: "default".to_string(),
            filter_key: "all".to_string(),
            view_mode: "grid".to_string(),
            ..Default::default()
        }
    }
}

// ═══════════════════════════════════════════════
// THE EULER STRUCT — The wasm-bindgen entry point
// ═══════════════════════════════════════════════

#[wasm_bindgen]
pub struct Euler {
    state: Versioned<AppState>,
    index: search::Index,
}

#[wasm_bindgen]
impl Euler {

    // ── Lifecycle ─────────────────────────────

    #[wasm_bindgen(constructor)]
    pub fn new() -> Euler {
        Euler {
            state: Versioned::new(AppState::new()),
            index: search::Index::new(),
        }
    }

    pub fn version(&self) -> u64 {
        self.state.version()
    }

    pub fn hydrate(&mut self, json_str: &str) {
        let s = self.state.get_mut();

        if let Some(v) = json::get_str(json_str, "theme") { s.theme_name = v; }
        if let Some(v) = json::get_num(json_str, "fontSize") { s.font_size = (v as u8).clamp(14, 24); }
        if let Some(v) = json::get_num(json_str, "lineHeight") { s.line_height = (v as u8).clamp(14, 22); }
        if let Some(v) = json::get_num(json_str, "contentWidth") { s.content_width = (v as u8).clamp(55, 90); }

        // Reading state
        if let Some(reading_obj) = json::get_object(json_str, "reading") {
            for (book_id, inner) in json::iter_object(&reading_obj) {
                let mut rs = ReadingState::default();
                if let Some(v) = json::get_num(&inner, "chaptersRead") { rs.chapters_read = v as u32; }
                if let Some(v) = json::get_num(&inner, "totalChapters") { rs.total_chapters = v as u32; }
                if let Some(v) = json::get_num(&inner, "scrollPosition") { rs.scroll_position = v; }
                if let Some(v) = json::get_str(&inner, "currentChapterId") { rs.current_chapter_id = v; }
                if let Some(v) = json::get_num(&inner, "lastRead") { rs.last_read = v; }
                if let Some(v) = json::get_num(&inner, "readingTimeMs") { rs.reading_time_ms = v; }
                // session_start is ephemeral — never persisted
                s.reading.insert(book_id, rs);
            }
        }

        // Bookmarks
        if let Some(bm_obj) = json::get_object(json_str, "bookmarks") {
            for (book_id, arr) in json::iter_object(&bm_obj) {
                let mut bookmarks = Vec::new();
                for item in json::iter_array(&arr) {
                    let ch = json::get_str(&item, "chapterId").unwrap_or_default();
                    let ts = json::get_num(&item, "timestamp").unwrap_or(0.0);
                    if !ch.is_empty() { bookmarks.push(Bookmark { chapter_id: ch, timestamp: ts }); }
                }
                if !bookmarks.is_empty() { s.bookmarks.insert(book_id, bookmarks); }
            }
        }

        // Highlights
        if let Some(hl_obj) = json::get_object(json_str, "highlights") {
            for (book_id, arr) in json::iter_object(&hl_obj) {
                let mut highlights = Vec::new();
                for item in json::iter_array(&arr) {
                    let id = json::get_str(&item, "id").unwrap_or_default();
                    if id.is_empty() { continue; }
                    highlights.push(Highlight {
                        id,
                        chapter_id: json::get_str(&item, "chapterId").unwrap_or_default(),
                        text: json::get_str(&item, "text").unwrap_or_default(),
                        color: json::get_str(&item, "color").unwrap_or_else(|| "gold".into()),
                        note: json::get_str(&item, "note").unwrap_or_default(),
                        timestamp: json::get_num(&item, "timestamp").unwrap_or(0.0),
                    });
                }
                if !highlights.is_empty() { s.highlights.insert(book_id, highlights); }
            }
        }
    }

    pub fn dehydrate(&self) -> String {
        let s = self.state.get();
        let mut w = json::Writer::new();
        w.object_open();
        w.key("theme").val_str(&s.theme_name);
        w.key("fontSize").val_num(s.font_size as f64);
        w.key("lineHeight").val_num(s.line_height as f64);
        w.key("contentWidth").val_num(s.content_width as f64);

        // Reading
        w.key("reading").object_open();
        for (i, (id, rs)) in s.reading.iter().enumerate() {
            if i > 0 { w.needs_sep = true; }
            w.key(id).object_open();
            w.key("chaptersRead").val_num(rs.chapters_read as f64);
            w.key("totalChapters").val_num(rs.total_chapters as f64);
            w.key("scrollPosition").val_num(rs.scroll_position);
            w.key("currentChapterId").val_str(&rs.current_chapter_id);
            w.key("lastRead").val_num(rs.last_read);
            w.key("readingTimeMs").val_num(rs.reading_time_ms);
            w.object_close();
        }
        w.object_close();

        // Bookmarks
        w.key("bookmarks").object_open();
        for (i, (id, bms)) in s.bookmarks.iter().enumerate() {
            if bms.is_empty() { continue; }
            if i > 0 { w.needs_sep = true; }
            w.key(id).array_open();
            for (j, b) in bms.iter().enumerate() {
                if j > 0 { w.needs_sep = true; }
                w.object_open();
                w.key("chapterId").val_str(&b.chapter_id);
                w.key("timestamp").val_num(b.timestamp);
                w.object_close();
            }
            w.array_close();
        }
        w.object_close();

        // Highlights
        w.key("highlights").object_open();
        for (i, (id, hls)) in s.highlights.iter().enumerate() {
            if hls.is_empty() { continue; }
            if i > 0 { w.needs_sep = true; }
            w.key(id).array_open();
            for (j, h) in hls.iter().enumerate() {
                if j > 0 { w.needs_sep = true; }
                w.object_open();
                w.key("id").val_str(&h.id);
                w.key("chapterId").val_str(&h.chapter_id);
                w.key("text").val_str(&h.text);
                w.key("color").val_str(&h.color);
                w.key("note").val_str(&h.note);
                w.key("timestamp").val_num(h.timestamp);
                w.object_close();
            }
            w.array_close();
        }
        w.object_close();

        w.object_close();
        w.finish()
    }

    // ── Theme (delegates to euler::theme) ─────

    pub fn theme_css_json(&self) -> String {
        let name = &self.state.get().theme_name;
        theme::get(name).unwrap_or(&theme::MIDNIGHT).to_css_json()
    }

    pub fn theme_css_json_with_accent(&self, accent: &str) -> String {
        let name = &self.state.get().theme_name;
        let t = theme::get(name).unwrap_or(&theme::MIDNIGHT);
        if accent.is_empty() { t.to_css_json() }
        else { t.with_overrides(&[("--gold", accent), ("--gold-bright", accent), ("--gold-dim", accent)]) }
    }

    pub fn current_theme(&self) -> String { self.state.get().theme_name.clone() }

    pub fn set_theme(&mut self, name: &str) {
        if theme::get(name).is_some() {
            self.state.get_mut().theme_name = name.to_string();
        }
    }

    // ── Typography ────────────────────────────

    pub fn font_size(&self) -> u8 { self.state.get().font_size }
    pub fn line_height_x10(&self) -> u8 { self.state.get().line_height }
    pub fn content_width(&self) -> u8 { self.state.get().content_width }

    pub fn set_font_size(&mut self, v: u8) { self.state.get_mut().font_size = v.clamp(14, 24); }
    pub fn set_line_height(&mut self, v: u8) { self.state.get_mut().line_height = v.clamp(14, 22); }
    pub fn set_content_width(&mut self, v: u8) { self.state.get_mut().content_width = v.clamp(55, 90); }

    // ── Router (uses euler::router) ───────────

    pub fn should_show_hero(&self, book_id: &str) -> bool {
        match self.state.get().reading.get(book_id) {
            Some(rs) => rs.chapters_read == 0,
            None => true,
        }
    }

    pub fn hero_button_text(&self, book_id: &str) -> String {
        match self.state.get().reading.get(book_id) {
            Some(rs) if rs.chapters_read > 0 && rs.chapters_read < rs.total_chapters =>
                format!("Continue from Letter {}", rs.chapters_read),
            Some(rs) if rs.chapters_read > 0 => "Read Again".to_string(),
            _ => "Begin Reading".to_string(),
        }
    }

    pub fn get_scroll_target(&self, book_id: &str) -> String {
        self.state.get().reading.get(book_id)
            .filter(|rs| !rs.current_chapter_id.is_empty())
            .map(|rs| rs.current_chapter_id.clone())
            .unwrap_or_default()
    }

    pub fn get_scroll_fraction(&self, book_id: &str) -> f64 {
        self.state.get().reading.get(book_id).map(|rs| rs.scroll_position).unwrap_or(0.0)
    }

    pub fn get_breadcrumb(&self, book_id: &str) -> String {
        let s = self.state.get();
        let title = s.books.iter().find(|b| b.id == book_id).map(|b| b.title.as_str()).unwrap_or("");
        let chapter = s.reading.get(book_id).map(|rs| rs.current_chapter_id.as_str()).unwrap_or("");
        let mut w = json::Writer::new();
        w.object_open().key("book").val_str(title).key("chapter").val_str(chapter).object_close();
        w.finish()
    }

    pub fn get_next_book(&self, current_id: &str) -> String {
        let books = &self.state.get().books;
        let pos = books.iter().position(|b| b.id == current_id);
        match pos {
            Some(i) if i + 1 < books.len() => {
                let next = &books[i + 1];
                let mut w = json::Writer::new();
                w.object_open().key("id").val_str(&next.id).key("title").val_str(&next.title).object_close();
                w.finish()
            }
            _ => String::new(),
        }
    }

    /// Parse a URL using euler::router
    pub fn parse_route(&self, url: &str) -> String {
        let route = router::Route::parse(url);
        let mut w = json::Writer::new();
        w.object_open()
            .key("path").val_str(&route.path)
            .key("hash").val_str(&route.hash);
        // params as object
        w.key("params").object_open();
        for (i, (k, v)) in route.params.iter().enumerate() {
            if i > 0 { w.needs_sep = true; }
            w.key(k).val_str(v);
        }
        w.object_close();
        w.object_close();
        w.finish()
    }

    // ── Library ───────────────────────────────

    pub fn load_manifest(&mut self, manifest_json: &str) {
        let s = self.state.get_mut();
        s.books.clear();
        if let Some(arr) = json::get_object(manifest_json, "books")
            .or_else(|| json::get_array(manifest_json, "books")) // handle both array/object
        {
            for item in json::iter_array(&arr) {
                let id = json::get_str(&item, "id").unwrap_or_default();
                if id.is_empty() { continue; }
                s.books.push(BookMeta {
                    id,
                    title: json::get_str(&item, "title").unwrap_or_default(),
                    letters: json::get_num(&item, "letters").unwrap_or(0.0) as u32,
                });
            }
        }
    }

    pub fn set_sort(&mut self, key: &str) { self.state.get_mut().sort_key = key.to_string(); }
    pub fn set_filter(&mut self, key: &str) { self.state.get_mut().filter_key = key.to_string(); }
    pub fn set_view_mode(&mut self, mode: &str) { self.state.get_mut().view_mode = mode.to_string(); }
    pub fn view_mode(&self) -> String { self.state.get().view_mode.clone() }

    /// Sort/filter books, return JSON array of IDs
    pub fn sort_books(&self) -> String {
        let s = self.state.get();
        let mut books: Vec<&BookMeta> = s.books.iter().collect();

        // Filter
        match s.filter_key.as_str() {
            "reading" => books.retain(|b| {
                s.reading.get(&b.id).map(|r| r.chapters_read > 0 && r.chapters_read < b.letters).unwrap_or(false)
            }),
            "new" => books.retain(|b| {
                s.reading.get(&b.id).map(|r| r.chapters_read == 0).unwrap_or(true)
            }),
            "completed" => books.retain(|b| {
                s.reading.get(&b.id).map(|r| r.chapters_read >= b.letters && b.letters > 0).unwrap_or(false)
            }),
            _ => {}
        }

        // Sort
        match s.sort_key.as_str() {
            "title" => books.sort_by(|a, b| a.title.cmp(&b.title)),
            "recent" => books.sort_by(|a, b| {
                let ta = s.reading.get(&a.id).map(|r| r.last_read).unwrap_or(0.0);
                let tb = s.reading.get(&b.id).map(|r| r.last_read).unwrap_or(0.0);
                tb.partial_cmp(&ta).unwrap_or(std::cmp::Ordering::Equal)
            }),
            "progress" => books.sort_by(|a, b| {
                let pa = if a.letters > 0 { s.reading.get(&a.id).map(|r| r.chapters_read as f64 / a.letters as f64).unwrap_or(0.0) } else { 0.0 };
                let pb = if b.letters > 0 { s.reading.get(&b.id).map(|r| r.chapters_read as f64 / b.letters as f64).unwrap_or(0.0) } else { 0.0 };
                pb.partial_cmp(&pa).unwrap_or(std::cmp::Ordering::Equal)
            }),
            _ => {}
        }

        let mut w = json::Writer::new();
        w.array_open();
        for (i, b) in books.iter().enumerate() {
            if i > 0 { w.needs_sep = true; }
            w.val_str(&b.id);
        }
        w.array_close();
        w.finish()
    }

    pub fn get_book_button_text(&self, book_id: &str) -> String { self.hero_button_text(book_id) }
    pub fn get_book_progress_pct(&self, book_id: &str) -> f32 {
        let s = self.state.get();
        let letters = s.books.iter().find(|b| b.id == book_id).map(|b| b.letters).unwrap_or(0);
        if letters == 0 { return 0.0; }
        let read = s.reading.get(book_id).map(|r| r.chapters_read).unwrap_or(0);
        (read as f32 / letters as f32).min(1.0)
    }

    pub fn get_continue_info(&self) -> String {
        let s = self.state.get();
        let mut best: Option<(&str, &ReadingState)> = None;
        for (id, rs) in &s.reading {
            if rs.chapters_read == 0 { continue; }
            let total = s.books.iter().find(|b| b.id == *id).map(|b| b.letters).unwrap_or(0);
            if rs.chapters_read < total {
                match best {
                    None => best = Some((id, rs)),
                    Some((_, prev)) if rs.last_read > prev.last_read => best = Some((id, rs)),
                    _ => {}
                }
            }
        }
        match best {
            Some((id, rs)) => {
                let title = s.books.iter().find(|b| b.id == id).map(|b| b.title.as_str()).unwrap_or("");
                let total = s.books.iter().find(|b| b.id == id).map(|b| b.letters).unwrap_or(0);
                let pct = if total > 0 { (rs.chapters_read as f64 / total as f64 * 100.0) as u32 } else { 0 };
                let mut w = json::Writer::new();
                w.object_open()
                    .key("bookId").val_str(id)
                    .key("title").val_str(title)
                    .key("chaptersRead").val_num(rs.chapters_read as f64)
                    .key("total").val_num(total as f64)
                    .key("pct").val_num(pct as f64)
                .object_close();
                w.finish()
            }
            None => String::new(),
        }
    }

    pub fn get_last_read(&self, book_id: &str) -> f64 {
        self.state.get().reading.get(book_id).map(|r| r.last_read).unwrap_or(0.0)
    }

    // ── Reading State ─────────────────────────

    pub fn on_book_open(&mut self, book_id: &str) {
        let s = self.state.get_mut();
        s.reading.entry(book_id.to_string()).or_insert_with(ReadingState::default);
    }

    // ── Reading Session Timing ─────────────────

    /// Begin a reading session. Records performance.now() as the session start.
    /// Called when the reader opens a book or the tab returns to focus.
    pub fn session_start(&mut self, book_id: &str) {
        let rs = self.state.get_mut().reading.entry(book_id.to_string()).or_default();
        rs.session_start = perf::now();
    }

    /// End the reading session and accumulate elapsed time into reading_time_ms.
    /// Returns elapsed ms for this session. Returns 0 if no session was started.
    /// Called when the tab loses focus, is closed, or the user navigates away.
    pub fn session_end(&mut self, book_id: &str) -> f64 {
        let rs = self.state.get_mut().reading.entry(book_id.to_string()).or_default();
        if rs.session_start > 0.0 {
            let elapsed = perf::now() - rs.session_start;
            rs.reading_time_ms += elapsed;
            rs.session_start = 0.0;
            elapsed
        } else {
            0.0
        }
    }

    /// Get total accumulated reading time in ms for a book.
    pub fn get_reading_time_ms(&self, book_id: &str) -> f64 {
        self.state.get().reading.get(book_id)
            .map(|rs| rs.reading_time_ms)
            .unwrap_or(0.0)
    }

    pub fn on_scroll_book(&mut self, book_id: &str, position: f64, chapter_id: &str) {
        let rs = self.state.get_mut().reading.entry(book_id.to_string()).or_default();
        rs.scroll_position = position.clamp(0.0, 1.0);
        if !chapter_id.is_empty() { rs.current_chapter_id = chapter_id.to_string(); }
    }

    pub fn on_chapter_enter(&mut self, book_id: &str, chapter_idx: u32, total: u32, timestamp: f64) {
        let rs = self.state.get_mut().reading.entry(book_id.to_string()).or_default();
        rs.total_chapters = total;
        if chapter_idx > rs.chapters_read { rs.chapters_read = chapter_idx; }
        rs.last_read = timestamp;
    }

    // ── Bookmarks ─────────────────────────────

    pub fn toggle_bookmark(&mut self, book_id: &str, chapter_id: &str, timestamp: f64) -> bool {
        let bms = self.state.get_mut().bookmarks.entry(book_id.to_string()).or_default();
        if let Some(pos) = bms.iter().position(|b| b.chapter_id == chapter_id) {
            bms.remove(pos); false
        } else {
            bms.push(Bookmark { chapter_id: chapter_id.to_string(), timestamp }); true
        }
    }

    pub fn is_bookmarked(&self, book_id: &str, chapter_id: &str) -> bool {
        self.state.get().bookmarks.get(book_id).map(|bm| bm.iter().any(|b| b.chapter_id == chapter_id)).unwrap_or(false)
    }

    pub fn get_bookmarks_json(&self, book_id: &str) -> String {
        let empty = Vec::new();
        let bms = self.state.get().bookmarks.get(book_id).unwrap_or(&empty);
        let mut w = json::Writer::new();
        w.array_open();
        for (i, b) in bms.iter().enumerate() {
            if i > 0 { w.needs_sep = true; }
            w.object_open().key("chapterId").val_str(&b.chapter_id).key("timestamp").val_num(b.timestamp).object_close();
        }
        w.array_close();
        w.finish()
    }

    // ── Highlights ────────────────────────────

    pub fn add_highlight(&mut self, book_id: &str, chapter_id: &str, text: &str, color: &str, id: &str, timestamp: f64) {
        let hls = self.state.get_mut().highlights.entry(book_id.to_string()).or_default();
        hls.push(Highlight {
            id: id.to_string(), chapter_id: chapter_id.to_string(),
            text: text.to_string(), color: color.to_string(),
            note: String::new(), timestamp,
        });
    }

    pub fn remove_highlight(&mut self, book_id: &str, highlight_id: &str) {
        if let Some(hls) = self.state.get_mut().highlights.get_mut(book_id) {
            hls.retain(|h| h.id != highlight_id);
        }
    }

    pub fn update_highlight_note(&mut self, book_id: &str, highlight_id: &str, note: &str) {
        if let Some(hls) = self.state.get_mut().highlights.get_mut(book_id) {
            if let Some(h) = hls.iter_mut().find(|h| h.id == highlight_id) { h.note = note.to_string(); }
        }
    }

    pub fn get_highlights_json(&self, book_id: &str) -> String {
        let empty = Vec::new();
        let hls = self.state.get().highlights.get(book_id).unwrap_or(&empty);
        let mut w = json::Writer::new();
        w.array_open();
        for (i, h) in hls.iter().enumerate() {
            if i > 0 { w.needs_sep = true; }
            w.object_open()
                .key("id").val_str(&h.id)
                .key("chapterId").val_str(&h.chapter_id)
                .key("text").val_str(&h.text)
                .key("color").val_str(&h.color)
                .key("note").val_str(&h.note)
                .key("timestamp").val_num(h.timestamp)
            .object_close();
        }
        w.array_close();
        w.finish()
    }

    // ── Export ─────────────────────────────────

    pub fn export_study_markdown(&self, book_id: &str, book_title: &str) -> String {
        let s = self.state.get();
        let mut md = format!("# Study Notes: {}\n\n---\n\n", book_title);
        let empty_bm = Vec::new();
        let bms = s.bookmarks.get(book_id).unwrap_or(&empty_bm);
        if !bms.is_empty() {
            md.push_str("## Bookmarks\n\n");
            for b in bms { md.push_str(&format!("- {}\n", b.chapter_id)); }
            md.push_str("\n---\n\n");
        }
        let empty_hl = Vec::new();
        let hls = s.highlights.get(book_id).unwrap_or(&empty_hl);
        if !hls.is_empty() {
            md.push_str("## Highlights\n\n");
            let mut current = String::new();
            for h in hls {
                if h.chapter_id != current { current = h.chapter_id.clone(); md.push_str(&format!("### {}\n\n", current)); }
                md.push_str(&format!("> \"{}\" *({})*\n", h.text, h.color));
                if !h.note.is_empty() { md.push_str(&format!(">\n> **Note:** {}\n", h.note)); }
                md.push('\n');
            }
        }
        md
    }

    // ── Search (delegates to euler::search) ───

    pub fn index_book(&mut self, id: &str, title: &str, content: &str) {
        self.index.add(id, title, content);
    }

    pub fn search_library(&self, query: &str, max: u32) -> String {
        let results = self.index.query(query, max as usize);
        let mut w = json::Writer::new();
        w.array_open();
        for (i, r) in results.iter().enumerate() {
            if i > 0 { w.needs_sep = true; }
            w.object_open()
                .key("id").val_str(&r.doc_id)
                .key("title").val_str(&r.title)
                .key("score").val_num(r.score as f64)
                .key("snippet").val_str(&r.snippet)
            .object_close();
        }
        w.array_close();
        w.finish()
    }

    pub fn search_in_book(&self, book_id: &str, query: &str) -> String {
        let results = self.index.query_in_doc(book_id, query);
        let mut w = json::Writer::new();
        w.array_open();
        for (i, (pos, snippet)) in results.iter().enumerate() {
            if i > 0 { w.needs_sep = true; }
            w.object_open().key("position").val_num(*pos as f64).key("snippet").val_str(snippet).object_close();
        }
        w.array_close();
        w.finish()
    }

    // ── Analytics ─────────────────────────────

    pub fn word_count(&self, text: &str) -> u32 {
        text.split_whitespace().count() as u32
    }

    pub fn estimated_read_time(&self, text: &str) -> u32 {
        (self.word_count(text) / 250).max(1)
    }
}

// ═══════════════════════════════════════════════
// TESTS — Euler verified every step
// ═══════════════════════════════════════════════

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_new() {
        let e = Euler::new();
        assert_eq!(e.current_theme(), "midnight");
        assert_eq!(e.font_size(), 19);
        assert_eq!(e.version(), 0);
    }

    #[test]
    fn test_version_tracks_mutations() {
        let mut e = Euler::new();
        let v0 = e.version();
        e.set_theme("parchment");
        assert!(e.version() > v0);
    }

    #[test]
    fn test_hero_button_new() {
        let e = Euler::new();
        assert_eq!(e.hero_button_text("wasm"), "Begin Reading");
        assert!(e.should_show_hero("wasm"));
    }

    #[test]
    fn test_hero_button_continuing() {
        let mut e = Euler::new();
        e.on_chapter_enter("wasm", 5, 40, 1000.0);
        assert_eq!(e.hero_button_text("wasm"), "Continue from Letter 5");
        assert!(!e.should_show_hero("wasm"));
    }

    #[test]
    fn test_hero_button_completed() {
        let mut e = Euler::new();
        e.on_chapter_enter("wasm", 40, 40, 1000.0);
        assert_eq!(e.hero_button_text("wasm"), "Read Again");
    }

    #[test]
    fn test_theme_switch() {
        let mut e = Euler::new();
        e.set_theme("parchment");
        assert_eq!(e.current_theme(), "parchment");
        let css = e.theme_css_json();
        assert!(css.contains("#faf7f0"));
    }

    #[test]
    fn test_bookmark_toggle() {
        let mut e = Euler::new();
        assert!(e.toggle_bookmark("wasm", "letter-1", 1000.0));
        assert!(e.is_bookmarked("wasm", "letter-1"));
        assert!(!e.toggle_bookmark("wasm", "letter-1", 2000.0));
        assert!(!e.is_bookmarked("wasm", "letter-1"));
    }

    #[test]
    fn test_scroll_position() {
        let mut e = Euler::new();
        e.on_scroll_book("wasm", 0.65, "letter-12");
        assert_eq!(e.get_scroll_target("wasm"), "letter-12");
        assert!((e.get_scroll_fraction("wasm") - 0.65).abs() < 0.001);
    }

    #[test]
    fn test_round_trip() {
        let mut e = Euler::new();
        e.set_theme("dawn");
        e.set_font_size(22);
        e.on_chapter_enter("wasm", 5, 40, 12345.0);
        e.toggle_bookmark("wasm", "letter-3", 1000.0);
        e.add_highlight("wasm", "letter-1", "test text", "coral", "h1", 2000.0);

        let json = e.dehydrate();
        let mut e2 = Euler::new();
        e2.hydrate(&json);

        assert_eq!(e2.current_theme(), "dawn");
        assert_eq!(e2.font_size(), 22);
        assert_eq!(e2.hero_button_text("wasm"), "Continue from Letter 5");
        assert!(e2.is_bookmarked("wasm", "letter-3"));
        assert!(e2.get_highlights_json("wasm").contains("test text"));
    }

    #[test]
    fn test_sort_by_progress() {
        let mut e = Euler::new();
        e.load_manifest(r#"{"books":[{"id":"a","title":"Alpha","letters":10},{"id":"b","title":"Beta","letters":10}]}"#);
        e.on_chapter_enter("b", 8, 10, 1000.0);
        e.on_chapter_enter("a", 2, 10, 2000.0);
        e.set_sort("progress");
        let sorted = e.sort_books();
        assert!(sorted.find("\"b\"").unwrap() < sorted.find("\"a\"").unwrap());
    }

    #[test]
    fn test_search() {
        let mut e = Euler::new();
        e.index_book("wasm", "Universal Machine", "Transistors are the foundation of computation");
        e.index_book("rust", "Ownership of Memory", "Memory safety without garbage collection");

        let results = e.search_library("transistors", 5);
        assert!(results.contains("wasm"));
    }

    #[test]
    fn test_route_parsing() {
        let e = Euler::new();
        let route = e.parse_route("/read.html?book=wasm#letter-5");
        assert!(route.contains("\"book\":\"wasm\""));
        assert!(route.contains("\"hash\":\"letter-5\""));
    }

    #[test]
    fn test_word_count() {
        let e = Euler::new();
        assert_eq!(e.word_count("the quick brown fox"), 4);
    }

    #[test]
    fn test_continue_info() {
        let mut e = Euler::new();
        e.load_manifest(r#"{"books":[{"id":"wasm","title":"Universal Machine","letters":40}]}"#);
        e.on_chapter_enter("wasm", 5, 40, 1000.0);
        let info = e.get_continue_info();
        assert!(info.contains("wasm"));
        assert!(info.contains("Universal Machine"));
    }
}
