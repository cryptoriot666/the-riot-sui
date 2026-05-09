module riot_nft::riot_nft {
    use sui::object::{Self, UID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    use sui::url::{Self, Url};
    use sui::event;
    use std::string::{Self, String};
    use std::vector;

    // ======== Errors ========
    const ENotAuthorized: u64 = 0;
    const EAgentNotFound: u64 = 1;
    const EBlobAlreadyExists: u64 = 2;

    // ======== Structs ========

    /// The AdminCap is used to authorize admin operations
    struct AdminCap has key { id: UID }

    /// Represents a single Agent (character) in the Riot collective
    struct Agent has key, store {
        id: UID,
        agent_id: String,
        name: String,
        role: String,        // e.g. "frontman", "strategist", "artist"
        personality: String, // JSON or description
        owner: address,
        memory_space_id: String, // MemWal memory space reference
        walrus_blob_id: String,  // Base art/metadata blob on Walrus
        created_at: u64,
    }

    /// Global registry for all agents and their artifacts
    struct AgentRegistry has key {
        id: UID,
        total_agents: u64,
        admin: address,
    }

    /// Represents an artifact (generated content) linked to an agent
    struct Artifact has key, store {
        id: UID,
        agent_id: String,
        artifact_type: String, // "art", "lore", "log", "voice"
        walrus_blob_id: String,
        metadata_uri: String,
        timestamp: u64,
        encrypted: bool,       // Seal encryption flag
    }

    // ======== Events ========

    struct AgentMinted has copy, drop {
        agent_id: String,
        owner: address,
        memory_space_id: String,
    }

    struct ArtifactStored has copy, drop {
        agent_id: String,
        artifact_type: String,
        walrus_blob_id: String,
        encrypted: bool,
    }

    struct MemoryUpdated has copy, drop {
        agent_id: String,
        new_blob_id: String,
    }

    // ======== Init ========

    fun init(ctx: &mut TxContext) {
        let sender = tx_context::sender(ctx);
        transfer::transfer(AdminCap { id: object::new(ctx) }, sender);
        transfer::share_object(AgentRegistry {
            id: object::new(ctx),
            total_agents: 0,
            admin: sender,
        });
    }

    // ======== Public Functions ========

    /// Mint a new Agent NFT with MemWal memory space binding
    public entry fun mint_agent(
        registry: &mut AgentRegistry,
        agent_id: String,
        name: String,
        role: String,
        personality: String,
        memory_space_id: String,
        walrus_blob_id: String,
        ctx: &mut TxContext
    ) {
        let sender = tx_context::sender(ctx);
        let agent = Agent {
            id: object::new(ctx),
            agent_id,
            name,
            role,
            personality,
            owner: sender,
            memory_space_id,
            walrus_blob_id,
            created_at: tx_context::epoch(ctx),
        };

        registry.total_agents = registry.total_agents + 1;

        event::emit(AgentMinted {
            agent_id: agent.agent_id,
            owner: sender,
            memory_space_id: agent.memory_space_id,
        });

        transfer::transfer(agent, sender);
    }

    /// Store an artifact (generated content) linked to an agent
    public entry fun store_artifact(
        agent: &Agent,
        artifact_type: String,
        walrus_blob_id: String,
        metadata_uri: String,
        encrypted: bool,
        ctx: &mut TxContext
    ) {
        let artifact = Artifact {
            id: object::new(ctx),
            agent_id: agent.agent_id,
            artifact_type,
            walrus_blob_id,
            metadata_uri,
            timestamp: tx_context::epoch(ctx),
            encrypted,
        };

        event::emit(ArtifactStored {
            agent_id: agent.agent_id,
            artifact_type: artifact.artifact_type,
            walrus_blob_id: artifact.walrus_blob_id,
            encrypted,
        });

        transfer::transfer(artifact, agent.owner);
    }

    /// Update the Walrus blob reference for agent metadata/art
    public entry fun update_agent_blob(
        agent: &mut Agent,
        new_walrus_blob_id: String,
        _ctx: &mut TxContext
    ) {
        agent.walrus_blob_id = new_walrus_blob_id;
    }

    /// Update MemWal memory space reference
    public entry fun update_memory_space(
        agent: &mut Agent,
        new_memory_space_id: String,
        _ctx: &mut TxContext
    ) {
        agent.memory_space_id = new_memory_space_id;
    }

    // ======== Read Functions ========

    public fun get_agent_info(agent: &Agent): (String, String, String, String, address) {
        (agent.agent_id, agent.name, agent.role, agent.memory_space_id, agent.owner)
    }

    public fun get_artifact_info(artifact: &Artifact): (String, String, String, bool) {
        (artifact.agent_id, artifact.artifact_type, artifact.walrus_blob_id, artifact.encrypted)
    }

    public fun get_registry_count(registry: &AgentRegistry): u64 {
        registry.total_agents
    }
}
