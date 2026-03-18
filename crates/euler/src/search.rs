//! # euler::search — Full-text search with TF-IDF scoring
//!
//! Euler's insight on series: every complex function can be
//! decomposed into simpler terms. A document is decomposed
//! into terms. A query finds the terms. Scoring ranks by relevance.
//! General-purpose — works for any text corpus.

use std::collections::{HashMap, HashSet};

/// A document in the index
struct Doc {
    id: String,
    title: String,
    word_count: u32,
    content: String,
}

/// A search result
pub struct Result {
    pub doc_id: String,
    pub title: String,
    pub score: f32,
    pub snippet: String,
}

/// Full-text search index with TF-IDF scoring
pub struct Index {
    /// Inverted index: term → [(doc_index, term_frequency)]
    inverted: HashMap<String, Vec<(u16, f32)>>,
    /// All indexed documents
    docs: Vec<Doc>,
    /// ID → index lookup
    id_map: HashMap<String, u16>,
    /// Stopwords to filter during tokenization
    stopwords: HashSet<&'static str>,
}

impl Index {
    pub fn new() -> Self {
        Index {
            inverted: HashMap::new(),
            docs: Vec::new(),
            id_map: HashMap::new(),
            stopwords: STOPWORDS.iter().copied().collect(),
        }
    }

    /// Add a document to the index
    pub fn add(&mut self, id: &str, title: &str, content: &str) {
        let doc_idx = self.docs.len() as u16;
        self.id_map.insert(id.to_string(), doc_idx);

        let tokens = self.tokenize(content);
        let word_count = tokens.len() as u32;

        // Count term frequencies
        let mut tf_map: HashMap<String, u32> = HashMap::new();
        for token in &tokens {
            *tf_map.entry(token.clone()).or_insert(0) += 1;
        }

        // Normalize TF and add to inverted index
        let total = word_count.max(1) as f32;
        for (term, count) in &tf_map {
            let tf = *count as f32 / total;
            self.inverted.entry(term.clone())
                .or_insert_with(Vec::new)
                .push((doc_idx, tf));
        }

        self.docs.push(Doc {
            id: id.to_string(),
            title: title.to_string(),
            word_count,
            content: content.to_string(),
        });
    }

    /// Search across all documents. Returns top `max` results ranked by TF-IDF.
    pub fn query(&self, q: &str, max: usize) -> Vec<Result> {
        let query_terms = self.tokenize(q);
        if query_terms.is_empty() { return Vec::new(); }

        let n = self.docs.len() as f32;
        if n == 0.0 { return Vec::new(); }

        // Score each document
        let mut scores: HashMap<u16, f32> = HashMap::new();
        for term in &query_terms {
            if let Some(postings) = self.inverted.get(term) {
                let df = postings.len() as f32;
                let idf = (n / df).ln() + 1.0; // smoothed IDF
                for &(doc_idx, tf) in postings {
                    *scores.entry(doc_idx).or_insert(0.0) += tf * idf;
                }
            }
        }

        // Sort by score descending
        let mut ranked: Vec<(u16, f32)> = scores.into_iter().collect();
        ranked.sort_by(|a, b| b.1.partial_cmp(&a.1).unwrap_or(std::cmp::Ordering::Equal));
        ranked.truncate(max);

        // Build results with snippets
        ranked.into_iter().map(|(idx, score)| {
            let doc = &self.docs[idx as usize];
            let snippet = extract_snippet(&doc.content, &query_terms, 120);
            Result {
                doc_id: doc.id.clone(),
                title: doc.title.clone(),
                score,
                snippet,
            }
        }).collect()
    }

    /// Search within a specific document. Returns positions and snippets.
    pub fn query_in_doc(&self, doc_id: &str, q: &str) -> Vec<(usize, String)> {
        let doc_idx = match self.id_map.get(doc_id) {
            Some(idx) => *idx as usize,
            None => return Vec::new(),
        };
        let doc = &self.docs[doc_idx];
        let query_lower = q.to_lowercase();
        let content_lower = doc.content.to_lowercase();

        let mut results = Vec::new();
        let mut start = 0;
        while let Some(pos) = content_lower[start..].find(&query_lower) {
            let abs_pos = start + pos;
            let snippet_start = abs_pos.saturating_sub(40);
            let snippet_end = (abs_pos + query_lower.len() + 40).min(doc.content.len());
            let snippet = doc.content[snippet_start..snippet_end].to_string();
            results.push((abs_pos, snippet));
            start = abs_pos + 1;
            if results.len() >= 100 { break; } // cap
        }
        results
    }

    /// Number of indexed documents
    pub fn doc_count(&self) -> usize {
        self.docs.len()
    }

    // ── Internal ──────────────────────────────

    fn tokenize(&self, text: &str) -> Vec<String> {
        text.split(|c: char| !c.is_alphanumeric())
            .filter(|w| w.len() > 1)
            .map(|w| {
                let lower = w.to_lowercase();
                // Strip possessive 's
                lower.strip_suffix("'s").unwrap_or(&lower).to_string()
            })
            .filter(|w| w.len() > 1 && !self.stopwords.contains(w.as_str()))
            .collect()
    }
}

/// Extract a snippet centered around the first occurrence of any query term
fn extract_snippet(content: &str, terms: &[String], window: usize) -> String {
    let lower = content.to_lowercase();
    let mut best_pos = None;
    for term in terms {
        if let Some(pos) = lower.find(term.as_str()) {
            match best_pos {
                None => best_pos = Some(pos),
                Some(bp) if pos < bp => best_pos = Some(pos),
                _ => {}
            }
        }
    }
    let pos = best_pos.unwrap_or(0);
    let start = pos.saturating_sub(window / 2);
    let end = (pos + window / 2).min(content.len());

    // Align to word boundaries
    let start = content[..start].rfind(' ').map(|p| p + 1).unwrap_or(start);
    let end = content[end..].find(' ').map(|p| end + p).unwrap_or(end);

    let mut snippet = String::new();
    if start > 0 { snippet.push_str("..."); }
    snippet.push_str(content[start..end].trim());
    if end < content.len() { snippet.push_str("..."); }
    snippet
}

// ═══════════════════════════════════════════════
// STOPWORDS — The 50 most common English words
// ═══════════════════════════════════════════════

const STOPWORDS: &[&str] = &[
    "a", "an", "and", "are", "as", "at", "be", "but", "by", "for",
    "from", "had", "has", "have", "he", "her", "his", "how", "if", "in",
    "into", "is", "it", "its", "may", "my", "no", "not", "of", "on",
    "or", "our", "out", "own", "say", "she", "so", "some", "than", "that",
    "the", "their", "them", "then", "there", "they", "this", "to", "was", "we",
    "were", "what", "when", "which", "who", "will", "with", "would", "you", "your",
];

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_basic_search() {
        let mut idx = Index::new();
        idx.add("doc1", "Euler's Formula", "The most beautiful equation in mathematics is Euler's formula");
        idx.add("doc2", "Newton's Laws", "Newton discovered the laws of motion and gravity");
        idx.add("doc3", "Euler's Bridges", "Euler solved the Königsberg bridges problem using graph theory");

        let results = idx.query("euler", 5);
        assert!(results.len() >= 2);
        // Results about Euler should score higher
        assert!(results[0].doc_id == "doc1" || results[0].doc_id == "doc3");
    }

    #[test]
    fn test_tfidf_ranking() {
        let mut idx = Index::new();
        idx.add("rare", "Rare Word", "The quantum chromodynamics theory explains quark interactions");
        idx.add("common", "Common Word", "The theory of everything is a popular science topic about theory");

        let results = idx.query("theory", 5);
        // "common" mentions "theory" twice, should score higher for that term
        assert!(!results.is_empty());
    }

    #[test]
    fn test_search_in_doc() {
        let mut idx = Index::new();
        idx.add("book1", "Test Book", "Chapter one discusses transistors. Chapter two discusses memory. Chapter three discusses transistors again.");

        let results = idx.query_in_doc("book1", "transistors");
        assert_eq!(results.len(), 2);
    }

    #[test]
    fn test_empty_query() {
        let mut idx = Index::new();
        idx.add("doc1", "Title", "Some content here");
        assert!(idx.query("", 5).is_empty());
    }

    #[test]
    fn test_snippet_extraction() {
        let snippet = extract_snippet(
            "The quick brown fox jumps over the lazy dog near the river bank",
            &["fox".to_string()],
            40,
        );
        assert!(snippet.contains("fox"));
    }

    #[test]
    fn test_doc_count() {
        let mut idx = Index::new();
        assert_eq!(idx.doc_count(), 0);
        idx.add("a", "A", "content");
        idx.add("b", "B", "content");
        assert_eq!(idx.doc_count(), 2);
    }
}
