use std::fs;
use std::path::Path;

use chrono::Local;
use log::{error, info};
use once_cell::sync::Lazy;
use regex::Regex;
use uuid::Uuid;

use crate::utils::Ayaka;

const ARTICLE_TEMPLATE: &str = get_string!("templates/article.md");

pub fn entry(article_name: &str) -> anyhow::Result<()> {
    static PATTERN: Lazy<Regex> = Lazy::new(|| Regex::new("[A-Z0-9-_]+").unwrap());

    if !Ayaka::is_init() {
        error!("Ayaka is not initialized here!");
        return Ok(())
    }

    if !PATTERN.is_match(article_name) {
        error!("Article name doesn't match **{:?}**", *PATTERN);
        return Ok(())
    }

    let content = ARTICLE_TEMPLATE.replace("{{uuid}}", &Uuid::new_v4().to_string())
        .replace("{{article_name}}", article_name)
        .replace("{{date}}", &Local::now().format("%Y-%m-%d %X").to_string());

    let dir = Path::new("articles").join(article_name);
    fs::create_dir(&dir)?;
    fs::write(dir.join("index.md"), content)?;
    info!("Created new **index.md** in **{}**", article_name);

    Ok(())
}
