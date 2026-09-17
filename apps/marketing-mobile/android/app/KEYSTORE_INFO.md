# Android Production Keystore Details (Google Play Console)

> **CRITICAL**: Do NOT delete, overwrite, or regenerate this keystore file (`release.keystore`). Google Play Console binds this exact key to the app (`com.realestateerp.marketingmobile`). If this key changes or fingerprints mismatch, Play Console will reject all future app updates with `SHA-256 fingerprint mismatch`!

---

## Keystore Specifications

- **File**: `apps/marketing-mobile/android/app/release.keystore`
- **Keystore Type**: PKCS12
- **Key Alias**: `realestate-release-key`
- **Store Password**: `RealEstateERP2026!`
- **Key Password**: `RealEstateERP2026!`
- **Algorithm**: RSA 2048-bit
- **Validity**: September 12, 2026 to January 28, 2054 (28 years)
- **Owner / Issuer**: `CN=RealEstateERP, OU=Mobile, O=RealEstateERP, L=Hyderabad, ST=Telangana, C=IN`

## Certificate Fingerprints (For Google Play Console / Firebase)

- **SHA-1**: `D3:C3:4C:E4:00:BB:F4:EE:D6:9B:46:D5:BE:66:F0:2D:62:09:13:6F`
- **SHA-256**: `91:08:F5:47:F8:39:29:58:7D:6B:30:D7:F7:C8:E5:39:9D:41:68:B2:B1:5F:79:B1:65:E8:BB:11:4D:4A:05:46`

---

## Usage in Builds

The credentials are automatically read from `apps/marketing-mobile/android/gradle.properties`:
```properties
MYAPP_RELEASE_STORE_FILE=release.keystore
MYAPP_RELEASE_KEY_ALIAS=realestate-release-key
MYAPP_RELEASE_STORE_PASSWORD=RealEstateERP2026!
MYAPP_RELEASE_KEY_PASSWORD=RealEstateERP2026!
```

Both Gradle tasks:
- `./gradlew assembleRelease` (Generates signed `.apk`)
- `./gradlew bundleRelease` (Generates signed `.aab`)
are pre-configured to use this keystore.
