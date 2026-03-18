//! # euler::store — Versioned state container
//!
//! Euler's method: compute only what has changed.
//! Every mutation increments a version counter.
//! The JS shell checks: if version unchanged, skip re-render.

/// A versioned wrapper for any state type.
/// Every mutable access bumps the version counter.
///
/// ```ignore
/// let mut v = Versioned::new(AppState::default());
/// assert_eq!(v.version(), 0);
/// v.get_mut().name = "euler".to_string(); // bumps to 1
/// assert_eq!(v.version(), 1);
/// let _ = v.get(); // read-only — no version change
/// assert_eq!(v.version(), 1);
/// ```
pub struct Versioned<T> {
    inner: T,
    version: u64,
}

impl<T> Versioned<T> {
    pub fn new(val: T) -> Self {
        Versioned { inner: val, version: 0 }
    }

    /// Read-only access. Does not bump version.
    pub fn get(&self) -> &T {
        &self.inner
    }

    /// Mutable access. Bumps version automatically.
    /// This is the key contract: if you get_mut(), something changed.
    pub fn get_mut(&mut self) -> &mut T {
        self.version += 1;
        &mut self.inner
    }

    /// Current version number. JS checks this to decide re-render.
    pub fn version(&self) -> u64 {
        self.version
    }

    /// Replace the inner value entirely. Bumps version.
    pub fn set(&mut self, val: T) {
        self.version += 1;
        self.inner = val;
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_version_increments_on_mut() {
        let mut v = Versioned::new(42u32);
        assert_eq!(v.version(), 0);
        assert_eq!(*v.get(), 42);
        *v.get_mut() = 99;
        assert_eq!(v.version(), 1);
        assert_eq!(*v.get(), 99);
    }

    #[test]
    fn test_read_does_not_bump() {
        let v = Versioned::new("hello");
        assert_eq!(v.version(), 0);
        let _ = v.get();
        assert_eq!(v.version(), 0);
    }

    #[test]
    fn test_set_bumps() {
        let mut v = Versioned::new(0);
        v.set(10);
        assert_eq!(v.version(), 1);
        assert_eq!(*v.get(), 10);
    }
}
