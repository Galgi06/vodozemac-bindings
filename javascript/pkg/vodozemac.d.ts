/* tslint:disable */
/* eslint-disable */
export enum GroupSessionVersion {
  V1 = 0,
}
export enum SessionConfigVersion {
  V1 = 0,
}
export class Account {
  free(): void;
  static from_pickle(pickle: string, pickle_key: Uint8Array): Account;
  pickle_libolm(pickle_key: Uint8Array): string;
  static from_libolm_pickle(pickle: string, pickle_key: Uint8Array): Account;
  generate_fallback_key(): void;
  create_inbound_session(identity_key: string, message: OlmMessage): InboundCreationResult;
  generate_one_time_keys(count: number): OneTimeKeyGenerationResult;
  mark_keys_as_published(): void;
  create_outbound_session(identity_key: string, one_time_key: string, session_version: SessionConfigVersion): Session;
  constructor();
  sign(message: string): string;
  pickle(pickle_key: Uint8Array): string;
  readonly ed25519_key: string;
  readonly fallback_key: any;
  readonly one_time_keys: any;
  readonly curve25519_key: string;
  readonly max_number_of_one_time_keys: number;
}
export class DecryptedMessage {
  private constructor();
  free(): void;
  plaintext: string;
  message_index: number;
}
export class EstablishedSas {
  private constructor();
  free(): void;
  verify_mac(input: string, info: string, tag: string): void;
  calculate_mac(input: string, info: string): string;
  calculate_mac_invalid_base64(input: string, info: string): string;
  bytes(info: string): SasBytes;
}
export class GroupSession {
  free(): void;
  static from_pickle(pickle: string, pickle_key: Uint8Array): GroupSession;
  static from_libolm_pickle(pickle: string, pickle_key: Uint8Array): GroupSession;
  constructor(version: GroupSessionVersion);
  pickle(pickle_key: Uint8Array): string;
  encrypt(plaintext: string): string;
  readonly session_id: string;
  readonly session_key: string;
  readonly message_index: number;
}
export class InboundCreationResult {
  private constructor();
  free(): void;
  readonly session: Session;
  readonly plaintext: string;
}
export class InboundGroupSession {
  free(): void;
  static from_pickle(pickle: string, pickle_key: Uint8Array): InboundGroupSession;
  static from_libolm_pickle(pickle: string, pickle_key: Uint8Array): InboundGroupSession;
  constructor(session_key: string, group_session_version: GroupSessionVersion);
  static import(session_key: string, group_session_version: GroupSessionVersion): InboundGroupSession;
  pickle(pickle_key: Uint8Array): string;
  decrypt(ciphertext: string): DecryptedMessage;
  export_at(index: number): string | undefined;
  readonly session_id: string;
  readonly first_known_index: number;
}
export class OlmMessage {
  free(): void;
  constructor(message_type: number, ciphertext: Uint8Array);
  ciphertext: Uint8Array;
  message_type: number;
}
export class OneTimeKeyGenerationResult {
  private constructor();
  free(): void;
  readonly created: string[];
  readonly removed: string[];
}
export class Sas {
  free(): void;
  diffie_hellman(key: string): EstablishedSas;
  constructor();
  readonly public_key: string;
}
export class SasBytes {
  private constructor();
  free(): void;
  readonly emoji_indices: Uint8Array;
  readonly decimals: Uint16Array;
}
export class Session {
  private constructor();
  free(): void;
  static from_pickle(pickle: string, pickle_key: Uint8Array): Session;
  session_matches(message: OlmMessage): boolean;
  static from_libolm_pickle(pickle: string, pickle_key: Uint8Array): Session;
  pickle(pickle_key: Uint8Array): string;
  decrypt(message: OlmMessage): string;
  encrypt(plaintext: string): OlmMessage;
  readonly session_id: string;
}
