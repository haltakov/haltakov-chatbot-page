#!/bin/sh
set -eu

# Nixpacks selects only a Node major and may cache an older vulnerable package.
# Install the official security release before dependency installation/builds.
version=26.12.1
case "$(uname -m)" in
  x86_64) arch=x64; checksum=6170b2d474e1c626f43cff3adc118df9fe3b573258a4fc3d850c8dbc6b079bbd ;;
  aarch64|arm64) arch=arm64; checksum=42aa04922591ee5d4dbc7740d452621acf28508239daa512f5ee8c47ee224fdb ;;
  *) echo "Unsupported Node architecture: $(uname -m)" >&2; exit 1 ;;
esac

archive="node-v${version}-linux-${arch}.tar.xz"
tmp_dir=$(mktemp -d)
trap 'rm -rf "$tmp_dir"' EXIT HUP INT TERM
curl --fail --show-error --silent --location --retry 3 \
  "https://nodejs.org/dist/v${version}/${archive}" -o "$tmp_dir/$archive"
printf '%s  %s\n' "$checksum" "$tmp_dir/$archive" | sha256sum --check -
mkdir -p /opt/node
tar -xJf "$tmp_dir/$archive" -C /opt/node --strip-components=1
export PATH="/opt/node/bin:$PATH"
test "$(node --version)" = "v$version"
# Node 26 no longer bundles Corepack; keep the declared package manager usable.
npm install --global --prefix /opt/node corepack@0.36.0
corepack enable --install-directory /opt/node/bin
node --version
