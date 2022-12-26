macro_rules! import {
    ($name: ident) => {
        mod $name;
        pub use $name::entry as $name;
    };
}

macro_rules! get_string {
    ($path: expr) => {
        include_str!(concat!(env!("PROJECT_ROOT"), "assets/", $path))
    };
}

macro_rules! get_binary {
    ($path: expr) => {
        include_bytes!(concat!(env!("PROJECT_ROOT"), "assets/", $path))
    };
}

macro_rules! here {
    () => {
        concat!("at ", file!(), " line ", line!(), " column ", column!())
    };
}

import!(initialize);
import!(new);
import!(generate);
import!(preview);
