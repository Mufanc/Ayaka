use std::path::Path;

pub struct Fs;

impl Fs {
    pub fn is_empty<P: AsRef<Path>>(path: P) -> bool {
        path.as_ref()
            .read_dir()
            .map(|mut dir| dir.next().is_none())
            .unwrap_or(false)
    }
}

pub struct Ayaka;

impl Ayaka {
    pub fn is_init() -> bool {
        if !Path::new("configs.toml").exists() {
            return false;
        }
        if !Path::new("articles").exists() {
            return false;
        }
        true
    }
}
