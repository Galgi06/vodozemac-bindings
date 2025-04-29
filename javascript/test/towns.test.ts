import { describe, it, expect } from 'vitest'
import { Account, SessionConfigVersion } from '../pkg/vodozemac';


describe('Encrypt and decrypt', () => {
    it('should encrypt and decrypt using fallback keys between two accounts', async () => {
        const alice = new Account();
        const bob = new Account();
        alice.generate_fallback_key();
        bob.generate_fallback_key();

        const aliceIdentityKey = alice.curve25519_key
        const [aliceFallbackKey] = alice.fallback_key.values()

        const bobIdentityKey = bob.curve25519_key
        const [bobFallbackKey] = bob.fallback_key.values()

        expect(aliceIdentityKey).toBeDefined()
        expect(aliceFallbackKey).toBeDefined()
        expect(bobIdentityKey).toBeDefined()
        expect(bobFallbackKey).toBeDefined()

        const plaintext = 'Minimal hello for fallback key test'

        const encrypted = bob.create_outbound_session(
            aliceIdentityKey,
            aliceFallbackKey,
            SessionConfigVersion.V1
        ).encrypt(plaintext)
        expect(encrypted.message_type).toBe(0)
        expect(encrypted.ciphertext).toBeDefined()
        expect(encrypted.ciphertext.length).toBeGreaterThan(10)


        const { session } = alice.create_inbound_session(
            bobIdentityKey,
            encrypted,
        )
        const decrypted = session.decrypt(encrypted)
        expect(decrypted).toBe(plaintext) // Fails here
    })

    it('should encrypt and decrypt using one_time_keys between two accounts', async () => {
        const alice = new Account();
        const bob = new Account();
        alice.generate_one_time_keys(10);
        bob.generate_one_time_keys(10);

        const aliceIdentityKey = alice.curve25519_key
        const [aliceOneTimeKeys] = alice.one_time_keys.values()

        const bobIdentityKey = bob.curve25519_key
        const [bobOneTimeKeys] = bob.one_time_keys.values()

        expect(aliceIdentityKey).toBeDefined()
        expect(aliceOneTimeKeys).toBeDefined()
        expect(bobIdentityKey).toBeDefined()
        expect(bobOneTimeKeys).toBeDefined()

        const plaintext = 'Minimal hello for fallback key test'

        const encrypted = bob.create_outbound_session(
            aliceIdentityKey,
            aliceOneTimeKeys,
            SessionConfigVersion.V1
        ).encrypt(plaintext)
        expect(encrypted.message_type).toBe(0)
        expect(encrypted.ciphertext).toBeDefined()
        expect(encrypted.ciphertext.length).toBeGreaterThan(10)


        // TODO: what if we use new InboundGroupSession(encrypted, GroupSessionVersion.V1) instead of create_inbound_session?
        const { session } = alice.create_inbound_session(
            bobIdentityKey,
            encrypted,
        )
        const decrypted = session.decrypt(encrypted)
        expect(decrypted).toBe(plaintext) // Fails here
    })

    it.skip('stress test', async () => {
        const alice = new Account();
        const bob = new Account();
        // public one time key for pre-key message generation to establish the session
        bob.generate_fallback_key()
        bob.generate_one_time_keys(1);
        bob.mark_keys_as_published()
        bob.generate_one_time_keys(1);

        alice.generate_fallback_key()
        alice.generate_one_time_keys(2);
        

        const bobIdKey = bob.curve25519_key

        const [bobOneTimeKey] = bob.one_time_keys.values()
        // create outbound sessions using bob's one time key
        expect(bobOneTimeKey).toBeDefined()
        expect(bobIdKey).toBeDefined()

        const aliceSession = alice.create_outbound_session(bobIdKey, bobOneTimeKey, SessionConfigVersion.V1)
        let TEST_TEXT = 'test message for bob'
        let encrypted = aliceSession.encrypt(TEST_TEXT)
        expect(encrypted.message_type).toEqual(0)

        // create inbound sessions using own account and encrypted body from alice
        const { session: bobSession} = bob.create_inbound_session(alice.curve25519_key, encrypted) 
        // bob.remove_one_time_keys(bobSession) 

        let decrypted = bobSession.decrypt(encrypted)
        expect(decrypted).toEqual(TEST_TEXT)

        TEST_TEXT = 'test message for alice'
        encrypted = bobSession.encrypt(TEST_TEXT)
        expect(encrypted.message_type).toEqual(1)
        decrypted = aliceSession.decrypt(encrypted)
        expect(decrypted).toEqual(TEST_TEXT)
    })

    it.only('should work', async () => {
        const alice = new Account()
        const bob = new Account()

        bob.generate_fallback_key()

        const [bobFallbackKey] = bob.fallback_key.values()

        const aliceSession = alice.create_outbound_session(bob.curve25519_key, bobFallbackKey, SessionConfigVersion.V1)

        const testmessage = 'test message for bob'
        const message = aliceSession.encrypt(testmessage)

        expect(message.message_type).toEqual(0)

        // the plaintext is returned from the inbound session
        // So, if you try SESSION, PLAINTEXT
        // you will get a null pointer.
        // You need to use PLAINTEXT first, then SESSION.
        const { plaintext, session } = bob.create_inbound_session(alice.curve25519_key, message)

        expect(session.session_id).toBe(aliceSession.session_id)
        expect(plaintext).toBe(testmessage)


        // bob replies to alice
        const testmessage2 = 'test message for alice'
        const bob_encrypted_reply = session.encrypt(testmessage2)
        expect(bob_encrypted_reply.message_type).toEqual(1)


        // alice decrypts bob's reply
        const decrypted = aliceSession.decrypt(bob_encrypted_reply)
        expect(decrypted).toEqual(testmessage2)
    })
})
