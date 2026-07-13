import { Account, SessionConfigVersion } from '../node.mjs';
import { describe, expect, it } from 'vitest';

function toUnpaddedBase64(bytes: Uint8Array): string {
  return Buffer.from(bytes).toString('base64').replace(/=+$/u, '');
}

describe('security guardrails', function () {
  it('surfaces a non-contributory key as a JS error', function () {
    const alice = new Account();
    const bob = new Account();
    const allZeroPublicKey = toUnpaddedBase64(new Uint8Array(32));

    expect(() =>
      alice.create_outbound_session(
        bob.curve25519_key,
        allZeroPublicKey,
        SessionConfigVersion.V1,
      ),
    ).toThrow();
  });
});
