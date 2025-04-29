let
  olm_overlay = import ./olm-overlay.nix;
  pkgs = import <nixpkgs> { overlays = [ olm_overlay ]; };
in
  pkgs.mkShell {
    name = "vodozemac-dev-shell";

    nativeBuildInputs = with pkgs; [
      pkg-config
    ];

    buildInputs = with pkgs; [
      # Rust toolchain
      rustc
      libiconv
      lld
      cargo
      wasm-pack

      # C toolchain and libs needed by bindgen/olm
      clang
      llvmPackages.libclang
      olm # Use the patched olm package from overlay

      # Optional: Tools for generate_bindings.sh if used
      # which
      # git
    ];

    # Needed by bindgen to find libclang
    shellHook = ''
      export LIBCLANG_PATH="${pkgs.llvmPackages.libclang.lib}/lib"
      # Explicitly add olm's pkgconfig path (from the default output)
      export PKG_CONFIG_PATH="${pkgs.olm}/lib/pkgconfig''${PKG_CONFIG_PATH:+:}$PKG_CONFIG_PATH"
    '';
} 