FROM ubuntu:latest

# Install required packages
RUN apt-get update -y && \
    apt-get upgrade -y && \
    apt-get install -y git build-essential libssl-dev curl

# Install Rust and Cargo
RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
ENV PATH="/root/.cargo/bin:${PATH}"
RUN rustup default stable

# Install Foundry
RUN git clone https://github.com/foundry-rs/foundry.git && \
    cd foundry && \
    cargo build --release
ENV FOUNDRY_PATH=/foundry/target/release/foundry

# Install Echidna
RUN curl https://raw.githubusercontent.com/crytic/echidna/master/install.sh -sSf | sh -s -- -y
ENV ECHIDNA_PATH=/root/.cargo/bin/echidna

# Install Slither
RUN apt-get install -y python3-pip && \
    pip3 install slither-analyzer

# Install Halmos
WORKDIR /tmp
RUN git clone https://github.com/a16z/halmos.git && \
    cd halmos && \
    echo '[dependencies]' >> Cargo.toml && \
    echo 'serde = { version = "1.0", features = ["derive"] }' >> Cargo.toml && \
    echo 'hex = "0.4.3"' >> Cargo.toml && \
    echo 'rand = "0.7.3"' >> Cargo.toml && \
    echo 'thiserror = "1.0.26"' >> Cargo.toml && \
    cargo build --release

WORKDIR /app

COPY aggregator /app/

RUN cargo build --release

CMD ["./target/release/aggregator"]
