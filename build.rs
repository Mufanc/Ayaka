use std::process::Command;

fn main() {
    Command::new("pnpm")
        .current_dir("frontend")
        .args(["run", "build"])
        .spawn()
        .expect("failed to build frontend!");
}
