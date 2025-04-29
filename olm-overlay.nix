# olm-overlay.nix
final: prev: {
  olm = prev.olm.overrideAttrs (oldAttrs: {
    patches = oldAttrs.patches or [];
    postPatch = (oldAttrs.postPatch or "") + ''
      substituteInPlace include/olm/list.hh \
        --replace "T * const other_pos = other._data;" "T * other_pos = other._data;" \
        --replace "*this_pos = *other;" "*this_pos = *other_pos;"
    '';

    postInstall = (oldAttrs.postInstall or "") + ''
      install -v -D olm.pc $out/lib/pkgconfig/olm.pc
    '';
  });
} 