# @towns-protocol/vodozemac 

These are the Javascript bindings for [vodozemac](https://github.com/matrix-org/vodozemac). Web based environments are
supported as well as node based ones.

This package was highly inspired by [matrix-rust-sdk-crpyto-wasm](https://github.com/matrix-org/matrix-rust-sdk-crpyto-wasm).

## Usage

1. Install in your project:

    ```
    yarn add @towns-protocol/vodozemac
    ```

2. Import the library into your project and initialise it.

    On Web platforms, the library must be initialised by calling `initAsync`
    before it can be used, else it will throw an error. This is also recommended
    on other platforms, as it allows the WebAssembly module to be loaded
    asynchronously.

    ```javascript
    import * as Vodozemac from "@towns-protocol/vodozemac";

    async function loadVodozemac() {
        // Do this before any other calls to the library
        await Vodozemac.initAsync();
        return Vodozemac;
    }
    ```

3. Build your project.

    The packaging of this library aims to "just work" the same as any plain-javascript project would: it includes
    separate entry points for Node.js-like environments (which read the WASM file via
    [`fs.readFile()`](https://nodejs.org/api/fs.html#fsreadfilepath-options-callback)) and web-like environments (which
    download the WASM file with [`fetch()`](https://developer.mozilla.org/en-US/docs/Web/API/Window/fetch)). There are
    both CommonJS and ES Module entry points for each environment; an appropriate entrypoint should be selected
    automatically.

    If your environment supports the experimental [ES Module Integration Proposal for WebAssembly](https://github.com/WebAssembly/esm-integration),
    you can instead use that, by setting the `towns-protocol:wasm-esm` custom [export condition](https://nodejs.org/api/packages.html#conditional-exports).
    This is only supported when the library is imported as an ES Module. For example:

    - In Webpack, set [`experiments.asyncWebAssembly`](https://webpack.js.org/configuration/experiments/#experiments)
      to `true` and [`resolve.conditionNames`](https://webpack.js.org/configuration/resolve/#resolveconditionnames)
      to `["towns-protocol:wasm-esm", "..."]` (the `"..."` preserves default condition names).
    - In Node.js, invoke with commandline arguments [`--experimental-wasm-modules`](https://nodejs.org/api/esm.html#wasm-modules)
      [`--conditions=wasm-esm`](https://nodejs.org/api/cli.html#-c-condition---conditionscondition).


## Contributing

TBD: npm publish guide

## Third-Party Code

Some parts of this project are derived from code licensed under the Apache License, Version 2.0:

- [index-wasm-esm.mjs](./index-wasm-esm.mjs): originally from [matrix-rust-sdk-crpyto-wasm](https://github.com/matrix-org/matrix-rust-sdk-crpyto-wasm)
- [index.d.ts](./index.d.ts): originally from [matrix-rust-sdk-crpyto-wasm](https://github.com/matrix-org/matrix-rust-sdk-crpyto-wasm)
- [index.mjs](./index.mjs): originally from [matrix-rust-sdk-crpyto-wasm](https://github.com/matrix-org/matrix-rust-sdk-crpyto-wasm)
- [node.cjs](./node.cjs): originally from [matrix-rust-sdk-crpyto-wasm](https://github.com/matrix-org/matrix-rust-sdk-crpyto-wasm)
- [node.mjs](./node.mjs): originally from [matrix-rust-sdk-crpyto-wasm](https://github.com/matrix-org/matrix-rust-sdk-crpyto-wasm)
