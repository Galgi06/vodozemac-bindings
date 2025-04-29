import { Sas } from '../pkg/vodozemac.js';
import { describe, it, expect } from 'vitest';

const EXTRA_INFO = "extra_info";
const MESSAGE = "Test message"

describe('Sas', function() {
    it('should be created successfully', function() {
        let alice = new Sas();

        expect(alice.public_key).not.toBe("");
    });

    it('should allow us to establish a shared secret', function() {
        let alice = new Sas();
        let bob = new Sas();
        const alice_public_key = alice.public_key;
        const bob_public_key = bob.public_key;

        const alice_established = alice.diffie_hellman(bob_public_key);
        const bob_established = bob.diffie_hellman(alice_public_key);

        // Check if established objects exist (basic check)
        expect(alice_established).toBeDefined();
        expect(bob_established).toBeDefined();
    });

    it('should allow us to generate common short auth strings', function() {
        let alice = new Sas();
        let bob = new Sas();
        const alice_public_key = alice.public_key;
        const bob_public_key = bob.public_key;

        const alice_established = alice.diffie_hellman(bob_public_key);
        const bob_established = bob.diffie_hellman(alice_public_key);

        const alice_bytes = alice_established.bytes(EXTRA_INFO);
        const bob_bytes = bob_established.bytes(EXTRA_INFO);

        expect(alice_bytes.emoji_indices).toEqual(bob_bytes.emoji_indices);
        expect(alice_bytes.decimals).toEqual(bob_bytes.decimals);
    });

    it('should allow us to generate a message authentication code', function() {
        let alice = new Sas();
        let bob = new Sas();
        const alice_public_key = alice.public_key;
        const bob_public_key = bob.public_key;

        const alice_established = alice.diffie_hellman(bob_public_key);
        const bob_established = bob.diffie_hellman(alice_public_key);

        const alice_mac = alice_established.calculate_mac(MESSAGE, EXTRA_INFO);
        const bob_mac = bob_established.calculate_mac(MESSAGE, EXTRA_INFO);

        expect(() => alice_established.verify_mac("", EXTRA_INFO, bob_mac)).toThrow();
        alice_established.verify_mac(MESSAGE, EXTRA_INFO, bob_mac);
        bob_established.verify_mac(MESSAGE, EXTRA_INFO, alice_mac);
        expect(alice_mac).toEqual(bob_mac);
    });
});
