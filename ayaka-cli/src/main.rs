use std::env;
use std::fmt::Debug;

use colored::Colorize;
use log::{LevelFilter, Record};
use log4rs::append::console::ConsoleAppender;
use log4rs::config::{Appender, Root};
use log4rs::encode::pattern::PatternEncoder;
use log4rs::encode::{Encode, Write};
use log4rs::Config;
use once_cell::sync::Lazy;
use regex::Regex;

use crate::argparse::Action;

mod argparse;
mod commands;
mod utils;

#[derive(Debug)]
struct LogWrapper(Box<dyn Encode>);

impl Encode for LogWrapper {
    fn encode(&self, writer: &mut dyn Write, record: &Record) -> anyhow::Result<()> {
        static PATTERN: Lazy<Regex> = Lazy::new(|| Regex::new(r"\*{2}(.*?)\*{2}").unwrap());

        let metadata = record.metadata().clone();
        let args = record.args().to_string();
        let args = PATTERN.replace_all(&args, "$1".yellow().to_string());

        self.0.encode(
            writer,
            &Record::builder()
                .metadata(metadata)
                .args(format_args!("{}", args))
                .build(),
        )
    }
}

impl LogWrapper {
    fn new() -> Self {
        Self(Box::new(PatternEncoder::new(&format!(
            "[ {} ] {} | {}",
            "{h({l}):5.5}",
            "{d(%H:%M:%S)}".green().dimmed(),
            "{m}{n}"
        ))))
    }
}

fn main() -> anyhow::Result<()> {
    if env::var("RUST_LOG").is_err() {
        env::set_var("RUST_LOG", "info")
    }

    let config = Config::builder()
        .appender(
            Appender::builder().build(
                "stdout",
                Box::new(
                    ConsoleAppender::builder()
                        .encoder(Box::new(LogWrapper::new()))
                        .build(),
                ),
            ),
        )
        .build(Root::builder().appender("stdout").build(LevelFilter::Info))?;

    log4rs::init_config(config)?;

    let args = argparse::parse();
    match args.action {
        Action::Init => commands::initialize()?,
        Action::New { article_name } => commands::new(&article_name)?,
        Action::Gen => commands::generate()?,
        Action::Preview { port } => commands::preview(port)?,
    }

    Ok(())
}
