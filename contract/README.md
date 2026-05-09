# $RIOT Move Smart Contract

Sui Move contract for Agentic Punk NFTs with Walrus blob registry and MemWal memory anchors.

## Features

- **Agent NFT** — Each character is an on-chain object with unique Agent ID
- **Walrus Blob Registry** — Store/retrieve blob IDs for art, metadata, logs
- **Memory Anchor** — On-chain link between Agent and MemWal (Walrus Memory) space
- **Artifact Tracking** — Generated content (art, lore) stored as Walrus blobs with provenance
- **Seal Integration Ready** — `encrypted` flag on artifacts for privacy layer

## Quick Deploy (Testnet)

### 1. Prerequisites

```bash
# Sui CLI installed
sui --version

# Wallet configured for testnet
sui client switch --env testnet
```

### 2. Build

```bash
cd contracts/move
sui move build
```

### 3. Publish

```bash
sui client publish --gas-budget 50000000
```

### 4. Save Package ID

After publish, copy the `Package ID` from output. Update:
- DeepSurge $RIOT project page
- Frontend config
- GitHub README

## Contract Structure

```
sources/
├── riot_nft.move      # Main NFT + Agent + Artifact logic
└── riot_memory.move   # MemWal memory anchor + sync
```

## Key Functions

### Mint Agent
```move
riot_nft::mint_agent(
    &mut registry,
    b"J4",                          // agent_id
    b"J4 The Veteran",              // name
    b"frontman",                    // role
    b"cynical, battle-hardened",    // personality
    b"memwal_j4_001",               // memory_space_id
    b"0xwalrus_blob_base_art",      // walrus_blob_id
    ctx
);
```

### Store Artifact
```move
riot_nft::store_artifact(
    &agent,
    b"art",                         // artifact_type
    b"0xnew_walrus_blob",           // walrus_blob_id
    b"https://...",                 // metadata_uri
    false,                          // encrypted (true = Seal)
    ctx
);
```

### Create Memory Anchor
```move
riot_memory::create_memory_anchor(
    b"J4",
    b"memwal_j4_001",
    b"delegate_key_hash",           // hash only, not the actual key
    b"0xinitial_blob",
    ctx
);
```

### Sync Memory
```move
riot_memory::sync_memory(
    &mut anchor,
    b"0xlatest_memory_blob",        // updated when agent chats
    ctx
);
```

## Events (For Indexing)

| Event | Emitted When |
|-------|-------------|
| `AgentMinted` | New agent NFT created |
| `ArtifactStored` | New art/log stored on Walrus |
| `MemorySynced` | Agent memory updated |

## Integration with MemWal

1. Agent minted → `memory_space_id` recorded on-chain
2. J4 chats with user → MemWal stores conversation
3. MemWal writes snapshot to Walrus → gets `blob_id`
4. Backend calls `sync_memory()` → updates `latest_blob_id` on-chain
5. Next session: J4 reads `latest_blob_id` → fetches memory from Walrus

## Next Steps

- [ ] Add `Seal` encryption for private memory segments
- [ ] Add multi-agent delegation registry (J4 → J10)
- [ ] Add Sui Stack Messaging integration for inter-agent comms
