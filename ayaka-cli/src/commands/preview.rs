use std::net::{Ipv4Addr, SocketAddr, SocketAddrV4};
use tokio::runtime::Runtime;

pub fn entry(port: u16) -> anyhow::Result<()> {
    let address = SocketAddr::V4(
        SocketAddrV4::new(Ipv4Addr::new(127, 0, 0, 1), port)
    );

    Runtime::new()?.block_on(async {
        warp::serve(warp::fs::dir(".deploy")).run(address).await
    });

    Ok(())
}
