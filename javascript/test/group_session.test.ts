import { GroupSession, GroupSessionVersion, InboundGroupSession } from '../pkg/vodozemac.js';
import { describe, it, expect } from 'vitest';

const stringToUint8Array = (str: string) => new Uint8Array(Buffer.from(str));
const PICKLE_KEY = stringToUint8Array("DEFAULT_PICKLE_KEY_1234567890___");

describe('Megolm Session', function() {
    it('should be created successfully', function() {
        const session = new GroupSession(GroupSessionVersion.V1);
        const inbound = new InboundGroupSession(session.session_key, GroupSessionVersion.V1);

        expect(inbound.session_id).not.toBe("");
        expect(inbound.session_id).toEqual(session.session_id);
    });

    it('should tell us the current message index', function() {
        const session = new GroupSession(GroupSessionVersion.V1);
        let inbound = new InboundGroupSession(session.session_key, GroupSessionVersion.V1);

        expect(session.message_index).toBe(0);
        expect(inbound.first_known_index).toBe(0);

        session.encrypt("Test");
        // Recreate inbound to get the latest state if needed (depending on session logic)
        inbound = new InboundGroupSession(session.session_key, GroupSessionVersion.V1);

        expect(session.message_index).toBe(1);
        expect(inbound.first_known_index).toBe(1);
    });

    it('should let us pickle the outbound group session', function() {
        const session = new GroupSession(GroupSessionVersion.V1);
        const pickled = session.pickle(PICKLE_KEY);
        const unpickled = GroupSession.from_pickle(pickled, PICKLE_KEY);

        expect(session.session_id).toEqual(unpickled.session_id);
    });

    it('should let us pickle the inbound group session', function() {
        const outbound = new GroupSession(GroupSessionVersion.V1);
        const session = new InboundGroupSession(outbound.session_key, GroupSessionVersion.V1);

        const pickled = session.pickle(PICKLE_KEY);
        const unpickled = InboundGroupSession.from_pickle(pickled, PICKLE_KEY);

        expect(session.session_id).toEqual(unpickled.session_id);
    });

    it('should throw an exception if unpickling fails', function() {
        expect(() => GroupSession.from_pickle("", PICKLE_KEY)).toThrow();
        expect(() => InboundGroupSession.from_pickle("", PICKLE_KEY)).toThrow();
    });

    it('should throw an exception if decryption fails', function() {
        const outbound = new GroupSession(GroupSessionVersion.V1);
        const session = new InboundGroupSession(outbound.session_key, GroupSessionVersion.V1);

        expect(() => session.decrypt("")).toThrow();
    });

    it('should let us encrypt and decrypt messages', function() {
        let plaintext = "It's a secret to everybody"

        const outbound = new GroupSession(GroupSessionVersion.V1);
        const session = new InboundGroupSession(outbound.session_key, GroupSessionVersion.V1);
        let encrypted = outbound.encrypt(plaintext);

        let { plaintext: decrypted, message_index } = session.decrypt(encrypted);

        expect(plaintext).toEqual(decrypted);
        expect(message_index).toEqual(0);

        plaintext = "Another secret";
        encrypted = outbound.encrypt(plaintext);
        let { plaintext: decrypted2, message_index: message_index2 } = session.decrypt(encrypted);

        expect(plaintext).toEqual(decrypted2);
        expect(message_index2).toEqual(1);
    });

    it('should let us export inbound group sessions', function() {
        const plaintext = "It's a secret to everybody"

        const outbound = new GroupSession(GroupSessionVersion.V1);
        const session = new InboundGroupSession(outbound.session_key, GroupSessionVersion.V1);

        const exported = session.export_at(0);
        expect(exported).not.toBe("");
        const imported = InboundGroupSession.import(exported!, GroupSessionVersion.V1);

        expect(session.session_id).toEqual(imported.session_id);
        let encrypted = outbound.encrypt(plaintext);

        let { plaintext: decrypted, message_index } = imported.decrypt(encrypted);

        expect(plaintext).toEqual(decrypted);
        expect(message_index).toBe(0);
    });
});
