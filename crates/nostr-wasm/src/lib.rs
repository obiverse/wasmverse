/* ═══════════════════════════════════════════════════════════════════════
   NOSTR-WASM — Sovereign cryptographic primitives for the Letterverse

   Everything that touches private key material lives here, in Rust,
   compiled to WebAssembly. The browser sandbox plus WASM's isolated
   linear memory makes this the safest place a web app can do crypto.

   Exports:
     generate_keypair()                          → JSON {nsec_hex, npub_hex}
     pubkey_from_nsec(nsec_hex)                  → npub_hex
     nip44_encrypt(nsec, npub, plaintext)         → base64 ciphertext
     nip44_decrypt(nsec, npub, ciphertext_b64)    → plaintext
     sign_event(nsec, kind, tags_json, content)   → signed event JSON
     random_hex(len)                              → hex string

   NIP-44 v2 algorithm (matches obiverse_core/crypto/nip44.dart exactly):
     conversation_key = HKDF-extract(salt="nip44-v2", ikm=ECDH_x)
     (chacha_key, chacha_nonce, hmac_key) = HKDF-expand(conversation_key, nonce, 76)
     padded    = length_prefix(2) || plaintext || zero_padding
     ciphertext = ChaCha20(chacha_key, chacha_nonce, padded)
     mac       = HMAC-SHA256(hmac_key, nonce || ciphertext)
     payload   = 0x02 || nonce(32) || ciphertext || mac(32)
     encoded   = base64(payload)
   ═══════════════════════════════════════════════════════════════════════ */

use wasm_bindgen::prelude::*;
use qrcode::{QrCode, EcLevel};

// ── Crypto imports ────────────────────────────────────────────────────────

use k256::{SecretKey, PublicKey};
use k256::schnorr::SigningKey;
use k256::schnorr::signature::hazmat::PrehashSigner;
use k256::elliptic_curve::sec1::ToEncodedPoint;

use sha2::{Sha256, Digest};
use hmac::{Hmac, Mac};
use hkdf::Hkdf;
use chacha20::ChaCha20;
use chacha20::cipher::{KeyIvInit, StreamCipher};
use subtle::ConstantTimeEq;

use base64ct::{Base64, Encoding};
use hex;

type HmacSha256 = Hmac<Sha256>;

// ── Utilities ─────────────────────────────────────────────────────────────

// ── QR Code generation ────────────────────────────────────────────────────

/// Encode `text` as a QR code and return raw RGBA pixel data.
///
/// Returns a flat Vec<u8> of `actual_size * actual_size * 4` bytes (RGBA).
/// `actual_size` = (modules + 8 quiet-zone) * scale — call `qr_actual_size`
/// first if you need to know the canvas dimensions.
///
/// dark_rgb / light_rgb — 24-bit 0xRRGGBB colours.
/// Render with: `ctx.putImageData(new ImageData(new Uint8ClampedArray(pixels), w, h), 0, 0)`
#[wasm_bindgen]
pub fn qr_pixels(
    text: &str,
    scale: u32,
    dark_rgb: u32,
    light_rgb: u32,
) -> Result<Vec<u8>, JsError> {
    let code = QrCode::with_error_correction_level(text.as_bytes(), EcLevel::L)
        .map_err(|e| JsError::new(&e.to_string()))?;

    let mods = code.width();   // module count per side (no quiet zone)
    let qz   = 4usize;         // QR spec: 4-module quiet zone each side
    let total = mods + qz * 2; // total modules including quiet zone
    let sc    = scale as usize;
    let px    = total * sc;    // canvas side in pixels

    let dr = ((dark_rgb  >> 16) & 0xFF) as u8;
    let dg = ((dark_rgb  >>  8) & 0xFF) as u8;
    let db = ( dark_rgb         & 0xFF) as u8;
    let lr = ((light_rgb >> 16) & 0xFF) as u8;
    let lg = ((light_rgb >>  8) & 0xFF) as u8;
    let lb = ( light_rgb        & 0xFF) as u8;

    let mut pixels = vec![0u8; px * px * 4];

    for row in 0..px {
        let mod_row = row / sc;
        for col in 0..px {
            let mod_col = col / sc;
            // Is this pixel inside the data area (not the quiet zone)?
            let is_dark = if mod_row >= qz && mod_row < qz + mods
                          && mod_col >= qz && mod_col < qz + mods {
                code[(mod_row - qz, mod_col - qz)] == qrcode::Color::Dark
            } else {
                false // quiet zone = light
            };

            let i = (row * px + col) * 4;
            if is_dark {
                pixels[i] = dr; pixels[i+1] = dg; pixels[i+2] = db; pixels[i+3] = 255;
            } else {
                pixels[i] = lr; pixels[i+1] = lg; pixels[i+2] = lb; pixels[i+3] = 255;
            }
        }
    }

    Ok(pixels)
}

/// Return the canvas side length (pixels) that `qr_pixels` will produce.
/// canvas.width = canvas.height = qr_actual_size(text, scale)
#[wasm_bindgen]
pub fn qr_actual_size(text: &str, scale: u32) -> Result<u32, JsError> {
    let code = QrCode::with_error_correction_level(text.as_bytes(), EcLevel::L)
        .map_err(|e| JsError::new(&e.to_string()))?;
    Ok(((code.width() + 8) * scale as usize) as u32)
}

/// Generate `len` cryptographically random bytes and return as hex string.
#[wasm_bindgen]
pub fn random_hex(len: usize) -> String {
    let mut bytes = vec![0u8; len];
    getrandom::getrandom(&mut bytes).expect("getrandom failed");
    hex::encode(bytes)
}

/// Derive the 32-byte x-only public key (Nostr npub) from a private key.
#[wasm_bindgen]
pub fn pubkey_from_nsec(nsec_hex: &str) -> Result<String, JsError> {
    let nsec_bytes = hex_to_32(nsec_hex)?;
    let signing = SigningKey::from_bytes(&nsec_bytes)
        .map_err(|e| JsError::new(&e.to_string()))?;
    Ok(hex::encode(signing.verifying_key().to_bytes()))
}

/// Generate a fresh secp256k1 keypair. Returns JSON `{nsec_hex, npub_hex}`.
/// Uses the browser's `crypto.getRandomValues` via the `getrandom` crate.
#[wasm_bindgen]
pub fn generate_keypair() -> Result<JsValue, JsError> {
    let mut raw = [0u8; 32];
    getrandom::getrandom(&mut raw).map_err(|e| JsError::new(&e.to_string()))?;

    // Retry on the (astronomically rare) case of an invalid scalar
    let secret = SecretKey::from_slice(&raw)
        .map_err(|e| JsError::new(&e.to_string()))?;

    let nsec_hex = hex::encode(secret.to_bytes());
    let npub_hex = {
        let pt = secret.public_key().to_encoded_point(true);
        // Compressed point = 0x02|0x03 (1 byte) + x (32 bytes). Take x only.
        hex::encode(&pt.as_bytes()[1..33])
    };

    let json = format!(r#"{{"nsec_hex":"{nsec_hex}","npub_hex":"{npub_hex}"}}"#);
    Ok(JsValue::from_str(&json))
}

// ── NIP-44 v2 ─────────────────────────────────────────────────────────────

/// Encrypt `plaintext` from `sender_nsec_hex` to `recipient_npub_hex`.
/// Returns a base64-encoded payload (version || nonce || ciphertext || mac).
#[wasm_bindgen]
pub fn nip44_encrypt(
    sender_nsec_hex: &str,
    recipient_npub_hex: &str,
    plaintext: &str,
) -> Result<String, JsError> {
    let nsec = hex_to_32(sender_nsec_hex)?;
    let npub = hex_to_32(recipient_npub_hex)?;
    let conv_key = conversation_key(&nsec, &npub)?;

    // Random 32-byte nonce
    let mut nonce = [0u8; 32];
    getrandom::getrandom(&mut nonce).map_err(|e| JsError::new(&e.to_string()))?;

    let payload = encrypt_with_key(&conv_key, &nonce, plaintext.as_bytes())
        .map_err(|e| JsError::new(&e))?;
    Ok(Base64::encode_string(&payload))
}

/// Decrypt a base64-encoded NIP-44 v2 payload.
#[wasm_bindgen]
pub fn nip44_decrypt(
    receiver_nsec_hex: &str,
    sender_npub_hex: &str,
    ciphertext_b64: &str,
) -> Result<String, JsError> {
    let nsec = hex_to_32(receiver_nsec_hex)?;
    let npub = hex_to_32(sender_npub_hex)?;
    let conv_key = conversation_key(&nsec, &npub)?;

    let payload = Base64::decode_vec(ciphertext_b64)
        .map_err(|_| JsError::new("Invalid base64"))?;

    decrypt_with_key(&conv_key, &payload)
        .map_err(|e| JsError::new(&e))
}

// ── Nostr event signing ───────────────────────────────────────────────────

/// Build and sign a NIP-01 Nostr event. Returns the full signed event JSON.
///
/// `tags_json` — a JSON array of arrays, e.g. `[["p","npub_hex"]]`
/// `kind`      — Nostr event kind (e.g. 24133 for NIP-46)
/// The event id, pubkey, created_at, and sig are computed internally.
#[wasm_bindgen]
pub fn sign_event(
    nsec_hex: &str,
    kind: u32,
    tags_json: &str,
    content: &str,
) -> Result<String, JsError> {
    let nsec_bytes = hex_to_32(nsec_hex)?;
    let signing = SigningKey::from_bytes(&nsec_bytes)
        .map_err(|e| JsError::new(&e.to_string()))?;
    let npub_hex = hex::encode(signing.verifying_key().to_bytes());

    // Unix timestamp from the JS Date object
    let created_at = (js_sys::Date::now() / 1000.0) as u64;

    // Canonical NIP-01 serialisation for hashing
    // [0, pubkey, created_at, kind, tags, content]
    let serialized = format!(
        r#"[0,"{npub_hex}",{created_at},{kind},{tags_json},{content_json}]"#,
        content_json = json_string(content),
    );

    // Event id = SHA-256 of the canonical JSON
    let mut hasher = Sha256::new();
    hasher.update(serialized.as_bytes());
    let id_bytes: [u8; 32] = hasher.finalize().into();
    let id_hex = hex::encode(id_bytes);

    // BIP-340 Schnorr signature over the 32-byte event id
    let sig: k256::schnorr::Signature = signing
        .sign_prehash(&id_bytes)
        .map_err(|e| JsError::new(&e.to_string()))?;
    let sig_hex = hex::encode(sig.to_bytes());

    let event_json = format!(
        r#"{{"id":"{id_hex}","pubkey":"{npub_hex}","created_at":{created_at},"kind":{kind},"tags":{tags_json},"content":{content_json},"sig":"{sig_hex}"}}"#,
        content_json = json_string(content),
    );
    Ok(event_json)
}

// ── Internal helpers ──────────────────────────────────────────────────────

fn hex_to_32(s: &str) -> Result<[u8; 32], JsError> {
    let bytes = hex::decode(s).map_err(|_| JsError::new("Invalid hex"))?;
    bytes.try_into().map_err(|_| JsError::new("Expected 32-byte hex"))
}

/// Compute NIP-44 conversation key.
/// conversation_key = HKDF-extract(salt="nip44-v2", ikm=ECDH_x)
fn conversation_key(nsec: &[u8; 32], npub: &[u8; 32]) -> Result<[u8; 32], JsError> {
    // Parse private key as SecretKey
    let secret = SecretKey::from_slice(nsec)
        .map_err(|e| JsError::new(&e.to_string()))?;

    // Reconstruct compressed SEC1 pubkey from x-only: prefix 0x02 (even y)
    let mut compressed = [0u8; 33];
    compressed[0] = 0x02;
    compressed[1..].copy_from_slice(npub);
    let public = PublicKey::from_sec1_bytes(&compressed)
        .map_err(|e| JsError::new(&e.to_string()))?;

    // ECDH → 32-byte shared x-coordinate
    let shared = k256::elliptic_curve::ecdh::diffie_hellman(
        secret.to_nonzero_scalar(),
        public.as_affine(),
    );
    let ecdh_x: [u8; 32] = shared.raw_secret_bytes().as_slice().try_into().unwrap();

    // HKDF-extract(salt="nip44-v2", ikm=ecdh_x) → conversation_key
    let (prk, _) = Hkdf::<Sha256>::extract(Some(b"nip44-v2"), &ecdh_x);
    Ok(prk.into())
}

/// Derive per-message ChaCha20 key (32), nonce (12), and HMAC key (32)
/// from the conversation key and a 32-byte random nonce.
fn derive_message_keys(
    conv_key: &[u8; 32],
    nonce: &[u8; 32],
) -> ([u8; 32], [u8; 12], [u8; 32]) {
    let hkdf = Hkdf::<Sha256>::from_prk(conv_key).expect("valid PRK");
    let mut okm = [0u8; 76];
    hkdf.expand(nonce, &mut okm).expect("expand ok");

    let mut chacha_key   = [0u8; 32];
    let mut chacha_nonce = [0u8; 12];
    let mut hmac_key     = [0u8; 32];
    chacha_key.copy_from_slice(&okm[0..32]);
    chacha_nonce.copy_from_slice(&okm[32..44]);
    hmac_key.copy_from_slice(&okm[44..76]);
    (chacha_key, chacha_nonce, hmac_key)
}

/// NIP-44 v2 padding: 2-byte big-endian length prefix + zero pad.
fn pad(plaintext: &[u8]) -> Vec<u8> {
    let padded_len = calc_padded_len(plaintext.len());
    let mut result = vec![0u8; 2 + padded_len];
    result[0] = (plaintext.len() >> 8) as u8;
    result[1] = (plaintext.len() & 0xFF) as u8;
    result[2..2 + plaintext.len()].copy_from_slice(plaintext);
    result
}

/// Remove NIP-44 padding and return UTF-8 plaintext.
fn unpad(padded: &[u8]) -> Result<String, String> {
    if padded.len() < 2 {
        return Err("Padded data too short".into());
    }
    let len = ((padded[0] as usize) << 8) | (padded[1] as usize);
    if len < 1 || len > 65535 || len + 2 > padded.len() {
        return Err(format!("Invalid unpadded length: {len}"));
    }
    let expected = 2 + calc_padded_len(len);
    if padded.len() != expected {
        return Err("Invalid padding structure".into());
    }
    for &b in &padded[2 + len..] {
        if b != 0 {
            return Err("Non-zero padding byte".into());
        }
    }
    String::from_utf8(padded[2..2 + len].to_vec())
        .map_err(|e| e.to_string())
}

fn calc_padded_len(unpadded_len: usize) -> usize {
    if unpadded_len == 0 { return 32; }
    if unpadded_len <= 32 { return 32; }
    let next_power = 1usize << (usize::BITS - (unpadded_len - 1).leading_zeros()) as u32;
    let chunk = if next_power <= 256 { 32 } else { next_power / 8 };
    chunk * ((unpadded_len - 1) / chunk + 1)
}

/// Encrypt plaintext bytes → NIP-44 raw payload bytes (not base64-encoded yet).
fn encrypt_with_key(
    conv_key: &[u8; 32],
    nonce: &[u8; 32],
    plaintext: &[u8],
) -> Result<Vec<u8>, String> {
    if plaintext.is_empty() || plaintext.len() > 65535 {
        return Err("Plaintext must be 1–65535 bytes".into());
    }

    let (chacha_key, chacha_nonce, hmac_key) = derive_message_keys(conv_key, nonce);

    // Pad then encrypt with ChaCha20
    let mut padded = pad(plaintext);
    let mut cipher = ChaCha20::new(&chacha_key.into(), &chacha_nonce.into());
    cipher.apply_keystream(&mut padded);
    let ciphertext = padded;

    // MAC = HMAC-SHA256(hmac_key, nonce || ciphertext)
    let mut mac_input = Vec::with_capacity(32 + ciphertext.len());
    mac_input.extend_from_slice(nonce);
    mac_input.extend_from_slice(&ciphertext);
    let mac = hmac_sha256(&hmac_key, &mac_input);

    // version(1) || nonce(32) || ciphertext || mac(32)
    let mut payload = Vec::with_capacity(1 + 32 + ciphertext.len() + 32);
    payload.push(0x02);
    payload.extend_from_slice(nonce);
    payload.extend_from_slice(&ciphertext);
    payload.extend_from_slice(&mac);
    Ok(payload)
}

/// Decrypt a raw NIP-44 payload (not base64) → plaintext string.
fn decrypt_with_key(conv_key: &[u8; 32], payload: &[u8]) -> Result<String, String> {
    if payload.len() < 99 {
        return Err(format!("Payload too short: {} bytes", payload.len()));
    }
    if payload[0] != 0x02 {
        return Err(format!("Unsupported NIP-44 version: {}", payload[0]));
    }

    let nonce      = &payload[1..33];
    let ciphertext = &payload[33..payload.len() - 32];
    let mac        = &payload[payload.len() - 32..];

    let nonce_arr: [u8; 32] = nonce.try_into().unwrap();
    let (chacha_key, chacha_nonce, hmac_key) = derive_message_keys(conv_key, &nonce_arr);

    // Verify MAC constant-time
    let mut mac_input = Vec::with_capacity(32 + ciphertext.len());
    mac_input.extend_from_slice(nonce);
    mac_input.extend_from_slice(ciphertext);
    let expected_mac = hmac_sha256(&hmac_key, &mac_input);

    if mac.ct_eq(&expected_mac).unwrap_u8() == 0 {
        return Err("MAC verification failed".into());
    }

    // Decrypt
    let mut padded = ciphertext.to_vec();
    let mut cipher = ChaCha20::new(&chacha_key.into(), &chacha_nonce.into());
    cipher.apply_keystream(&mut padded);

    unpad(&padded)
}

fn hmac_sha256(key: &[u8; 32], data: &[u8]) -> [u8; 32] {
    let mut mac = HmacSha256::new_from_slice(key).expect("HMAC accepts any key size");
    mac.update(data);
    mac.finalize().into_bytes().into()
}

/// Escape a Rust string as a JSON string literal (including surrounding quotes).
/// Only handles the cases that appear in Nostr content fields.
fn json_string(s: &str) -> String {
    let mut out = String::with_capacity(s.len() + 2);
    out.push('"');
    for c in s.chars() {
        match c {
            '"'  => out.push_str("\\\""),
            '\\' => out.push_str("\\\\"),
            '\n' => out.push_str("\\n"),
            '\r' => out.push_str("\\r"),
            '\t' => out.push_str("\\t"),
            c if (c as u32) < 0x20 => {
                out.push_str(&format!("\\u{:04x}", c as u32));
            }
            c    => out.push(c),
        }
    }
    out.push('"');
    out
}
