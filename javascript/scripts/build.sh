# !/usr/bin/env bash

set -eux

WASM_PACK_ARGS="${WASM_PACK_ARGS:-}"

# Generate the JavaScript bindings
# --no-pack disables generation of a `package.json` file, as we're managing it ourselves.
wasm-pack build --no-pack --target bundler --scope towns-protocol --out-dir pkg --weak-refs

# This will generate the following files in the `pkg` directory for us:
#   - vodozemac.d.ts: TypeScript declarations of the bindings
#   - vodozemac.js: logic to load the WASM module
#   - vodozemac_bg.js: the JS <-> WASM glue
#   - vodozemac_bg.wasm: the actual WASM module
#   - vodozemac_bg.wasm.d.ts: types for the exports of the WASM module

# We're not interested in the loading logic, as it doesn't work well on all platforms, so we ship our own loader.
rm pkg/vodozemac.js

# The JS <-> WASM glue uses ESM syntax, so we want to create a CommonJS version of it
esbuild pkg/vodozemac_bg.js --bundle --outfile=pkg/vodozemac_bg.cjs