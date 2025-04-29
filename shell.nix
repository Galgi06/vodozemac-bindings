{ pkgs ? import <nixpkgs> {} }:

pkgs.mkShell {
  # Native build inputs, needed during building
  nativeBuildInputs = [
    pkgs.pkg-config
  ];

  # Build inputs, needed during runtime and linking
  buildInputs = [
    pkgs.libiconv
    pkgs.wasm-pack
  ];
} 