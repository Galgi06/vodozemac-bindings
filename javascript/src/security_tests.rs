use vodozemac::{
    Ed25519Keypair, Ed25519Signature,
    megolm::SessionConfig as MegolmSessionConfig,
    olm::{OlmMessage, SessionConfig as OlmSessionConfig},
};

#[test]
fn default_olm_session_config_creates_v1_messages() {
    let alice = vodozemac::olm::Account::new();
    let mut bob = vodozemac::olm::Account::new();
    bob.generate_fallback_key();

    let (_, fallback_key) = match bob.fallback_key().into_iter().next() {
        Some(key) => key,
        None => panic!("fallback key should exist"),
    };

    let mut session = match alice.create_outbound_session(
        OlmSessionConfig::default(),
        bob.curve25519_key(),
        fallback_key,
    ) {
        Ok(session) => session,
        Err(error) => panic!("outbound session with default config should be created: {error}"),
    };

    let message = match session.encrypt("hello from v1 default") {
        Ok(message) => message,
        Err(error) => panic!("encryption with default config should succeed: {error}"),
    };

    match message {
        OlmMessage::PreKey(pre_key) => {
            assert_eq!(
                pre_key.message().version(),
                3,
                "default olm session config must produce v1/truncated-mac messages",
            );
        }
        OlmMessage::Normal(_) => {
            panic!("first encrypted message should be a pre-key message");
        }
    }
}

#[test]
fn default_megolm_session_config_is_v1() {
    assert_eq!(
        MegolmSessionConfig::default().version(),
        MegolmSessionConfig::version_1().version(),
        "default megolm session config must be v1",
    );
}

#[test]
fn invalid_ed25519_signature_is_rejected() {
    let key_pair = Ed25519Keypair::new();
    let signature = key_pair.sign(b"qidra");
    let mut signature_bytes = signature.to_bytes();
    signature_bytes[0] ^= 0x01;

    let tampered_signature = match Ed25519Signature::from_slice(&signature_bytes) {
        Ok(signature) => signature,
        Err(error) => panic!("signature bytes must stay valid: {error}"),
    };

    assert!(
        key_pair.public_key().verify(b"qidra", &tampered_signature).is_err(),
        "strict Ed25519 verification must reject tampered signatures",
    );
}
