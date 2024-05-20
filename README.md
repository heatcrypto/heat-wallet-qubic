# Heat Wallet/Qubic integration

- PrivateKey -> PublicKey
- PublicKey -> Address
- PrivateKey -> Seed
- HexToBase26
- Validate Address with Checksum
- Build and Sign Transfer Transaction
- Parse Binary Transfer Transaction

## Usage

Must call `await qubicReady()` before usage as some code relies on `wasm` being loaded and ready.