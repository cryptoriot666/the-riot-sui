module riot_nft::riot_memory {
    use sui::object::{Self, UID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    use sui::event;
    use std::string::{Self, String};

    // ======== Structs ========

    /// Links an on-chain Agent to its off-chain MemWal memory
    struct MemoryAnchor has key, store {
        id: UID,
        agent_id: String,
        memwal_space_id: String,
        delegate_key_hash: String, // Hash of MemWal delegate key (not the key itself)
        latest_blob_id: String,    // Latest Walrus blob containing memory snapshot
        version: u64,              // Incremented on each memory update
    }

    // ======== Events ========

    struct MemoryAnchorCreated has copy, drop {
        agent_id: String,
        memwal_space_id: String,
    }

    struct MemorySynced has copy, drop {
        agent_id: String,
        new_blob_id: String,
        version: u64,
    }

    // ======== Functions ========

    /// Create a new MemoryAnchor binding on-chain Agent to MemWal
    public entry fun create_memory_anchor(
        agent_id: String,
        memwal_space_id: String,
        delegate_key_hash: String,
        initial_blob_id: String,
        ctx: &mut TxContext
    ) {
        let anchor = MemoryAnchor {
            id: object::new(ctx),
            agent_id,
            memwal_space_id,
            delegate_key_hash,
            latest_blob_id: initial_blob_id,
            version: 1,
        };

        event::emit(MemoryAnchorCreated {
            agent_id: anchor.agent_id,
            memwal_space_id: anchor.memwal_space_id,
        });

        transfer::transfer(anchor, tx_context::sender(ctx));
    }

    /// Sync memory — update latest blob reference when agent memory changes
    public entry fun sync_memory(
        anchor: &mut MemoryAnchor,
        new_blob_id: String,
        _ctx: &mut TxContext
    ) {
        anchor.latest_blob_id = new_blob_id;
        anchor.version = anchor.version + 1;

        event::emit(MemorySynced {
            agent_id: anchor.agent_id,
            new_blob_id: anchor.latest_blob_id,
            version: anchor.version,
        });
    }

    /// Read functions
    public fun get_memory_state(anchor: &MemoryAnchor): (String, String, u64) {
        (anchor.memwal_space_id, anchor.latest_blob_id, anchor.version)
    }

    public fun get_agent_id(anchor: &MemoryAnchor): String {
        anchor.agent_id
    }
}
