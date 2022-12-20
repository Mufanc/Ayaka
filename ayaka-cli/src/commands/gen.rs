use std::fs;
use std::path::Path;
use anyhow::Context;
use include_dir::{Dir, include_dir};

use log::{error, info, warn};
use once_cell::sync::Lazy;
use regex::Regex;
use serde::{Deserialize, Serialize};
use crate::utils::Ayaka;

const WEB_CONTENTS: Dir = include_dir!("$PROJECT_ROOT/../ayaka-app/dist");

#[derive(Serialize, Deserialize)]
struct Article {
    uuid: String,
    article_name: String,
    date: String,
    description: String
}

pub fn entry() -> anyhow::Result<()> {
    static HEADER_PATTERN: Lazy<Regex> = Lazy::new(|| {
        Regex::new("^<!--\n((?:.*\n)+?)%-->\n([\\s\\S]+)$").unwrap()
    });

    if !Ayaka::is_init() {
        error!("Ayaka is not initialized here!");
        return Ok(())
    }

    info!("Start processing...");

    let articles_dir = Path::new("articles");
    let deploy_dir = Path::new(".deploy");

    if deploy_dir.exists() {
        fs::remove_dir_all(deploy_dir)?;
    }
    fs::create_dir(deploy_dir)?;

    let posts_dir = deploy_dir.join("posts");
    fs::create_dir(&posts_dir)?;

    let mut articles: Vec<Article> = Vec::new();

    for entry in articles_dir.read_dir()? {
        let article_root = entry?.path();

        let index = article_root.join("index.md");
        if !index.exists() {
            warn!("No **index.md** found in {:?}", article_root);
            continue;
        }

        info!("Process: **{:?}**", index);

        let content = fs::read_to_string(index)?;
        let groups: Vec<String> = HEADER_PATTERN
            .captures(&content)
            .expect("Failed to parse front-matter")
            .iter()
            .map(|it| it.unwrap().as_str().to_string())
            .collect();

        let headers: Article = toml::from_str(&groups[1]).context(here!())?;
        let content = groups[2].trim_start();

        let deploy_root = posts_dir.join(&headers.uuid);
        fs::create_dir(&deploy_root)?;

        // write content to index.md
        fs::write(deploy_root.join("index.md"), content)?;
        fs::write(
            deploy_root.join("article.json"),
            serde_json::to_string(&headers).unwrap()
        )?;

        // copy other files to article_root
        for entry in article_root.read_dir()? {
            let entry = entry?.path();
            let name = entry.file_name().unwrap();

            if name == "index.md" {
                continue;
            }

            fs::copy(&entry, deploy_root.join(name))?;
            info!("Copy: **{:?}**", entry);
        }

        articles.push(headers);
    }

    fs::write(deploy_dir.join("articles.json"), serde_json::to_string(&articles)?)?;

    info!("Extract web contents...");
    WEB_CONTENTS.extract(deploy_dir)?;

    Ok(())
}
