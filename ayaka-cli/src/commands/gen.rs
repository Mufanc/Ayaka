use std::fs;
use std::path::Path;
use include_dir::{Dir, include_dir};

use log::{error, info, warn};
use once_cell::sync::Lazy;
use regex::Regex;
use toml::Value;
use crate::utils::Ayaka;

const WEB_CONTENTS: Dir = include_dir!("$PROJECT_ROOT/../ayaka-app/dist");

pub fn entry() -> anyhow::Result<()> {
    static HEADER_PATTERN: Lazy<Regex> = Lazy::new(|| {
        Regex::new("^<!--\n((?:.*\n)+?)%-->\n([\\s\\S]+)$").unwrap()
    });

    if !Ayaka::is_init() {
        error!("Ayaka is not initialized here!");
        return Ok(())
    }

    let articles_dir = Path::new("articles");
    let deploy_dir = Path::new(".deploy");

    if deploy_dir.exists() {
        fs::remove_dir_all(deploy_dir)?;
    }
    fs::create_dir(deploy_dir)?;

    let posts_dir = deploy_dir.join("posts");
    fs::create_dir(&posts_dir)?;

    let mut articles = Value::Array(Vec::new());

    for entry in articles_dir.read_dir()? {
        let article_root = entry?.path();

        let index = article_root.join("index.md");
        if !index.exists() {
            warn!("No **index.md** found in {:?}", article_root);
            continue;
        }

        info!("Processing: **{:?}**", article_root.file_name().unwrap());

        let content = fs::read_to_string(index)?;
        let groups = HEADER_PATTERN.captures(&content).expect("Failed to parse front-matter");

        let headers = groups.get(1).unwrap().as_str().parse::<Value>()?;
        let content = groups.get(2).unwrap().as_str().trim_start();

        let deploy_root = posts_dir.join(headers["uuid"].as_str().unwrap());
        fs::create_dir(&deploy_root)?;

        // write content to index.md
        fs::write(deploy_root.join("index.md"), content)?;

        // copy other files to article_root
        for entry in article_root.read_dir()? {
            let entry = entry?.path();
            let name = entry.file_name().unwrap();
            if name == "index.md" {
                continue;
            }
            fs::copy(&entry, deploy_root.join(name))?;
            info!("Copy asset: **{:?}**", entry);
        }

        articles.as_array_mut().unwrap().push(headers);
    }

    fs::write(deploy_dir.join("articles.json"), serde_json::to_string(&articles)?)?;

    WEB_CONTENTS.extract(deploy_dir)?;

    Ok(())
}
