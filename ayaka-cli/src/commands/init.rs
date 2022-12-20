use std::fs;
use std::path::Path;
use chrono::Local;

use log::{error, info};
use uuid::Uuid;

use crate::utils::Fs;

const CONFIG_TEMPLATE: &str = get_string!("templates/config.toml");

const SAMPLE_ARTICLE: &str = get_string!("sample/sample.md");
const AYAYAKA_ICON: &[u8] = get_binary!("sample/150px-Ayayaka.png");

pub fn entry() -> anyhow::Result<()> {
    if !Fs::is_empty(".") {
        error!("Current directory is not empty!");
        return Ok(());
    }

    // default config.toml
    fs::write("config.toml", CONFIG_TEMPLATE)?;
    info!("Generated default config.yml");

    // sample article
    fs::create_dir("articles")?;
    let content = SAMPLE_ARTICLE.replace("{{uuid}}", &Uuid::new_v4().to_string())
        .replace("{{date}}", &Local::now().format("%Y-%m-%d %X").to_string());
    let dir = Path::new("articles").join("sample");
    fs::create_dir(&dir)?;
    fs::write(dir.join("index.md"), content)?;
    fs::write(dir.join("150px-Ayayaka.png"), AYAYAKA_ICON)?;
    info!("Generated sample article");

    info!("All done.");
    Ok(())
}
