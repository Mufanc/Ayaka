use clap::{Parser, Subcommand};

#[derive(Subcommand, Debug)]
pub enum Action {
    #[clap(about = "Initialize Ayaka in current directory")]
    Init,
    #[clap(visible_alias = "n", about = "Create an new article with given name")]
    New {
        #[clap(value_names = & ["NAME"])]
        article_name: String,
    },
    #[clap(
        visible_alias = "g",
        about = "Generate web contents from your article(s)"
    )]
    Gen,
    #[clap(
        visible_alias = "p",
        about = "Start a server to preview your articles"
    )]
    Preview {
        #[clap(short, long, default_value = "8080")]
        port: u16,
    }
}

#[derive(Parser, Debug)]
#[clap(version, disable_help_subcommand(true))]
pub struct Args {
    #[command(subcommand)]
    pub action: Action,
}

pub fn parse() -> Args {
    Args::parse()
}
