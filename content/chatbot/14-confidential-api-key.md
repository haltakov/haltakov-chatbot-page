---
id: confidential-api-key
question: What is the Confidential API Keys project?
---

**Confidential API Keys** is an open-source reference implementation for a common security problem: a service may need to use your API key, but the key can expose more data than the service actually needs.

The project uses a restricted Stripe API key and MRR calculation as a concrete example. The key is encrypted with Google Cloud KMS and only decrypted by reviewed code running inside Google Confidential Space.

Hardware-backed attestation verifies both the isolated environment and the exact container image before the encryption key becomes available. This means the service provider does not have direct access to the API key or the protected memory while the code runs.

The same pattern can be applied to other sensitive credentials. The complete implementation and setup scripts are on [GitHub](https://github.com/haltakov/confidential-api-key).
