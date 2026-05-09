🔴 $RIOT — Persistent Punk Agents
Agentic NFTs with Verifiable Long-Term Memory on Sui
   
🌐 Website • 📊 DeepSurge • 💬 Telegram • 🐦 X

🧠 The Problem
AI agents today are powerful, but still fundamentally stateless and fragmented:
•❌ They complete tasks in isolation and lose context across sessions

•❌ Memory is locked to a single app, model, or device

•❌ Agents can’t share knowledge across tools, teams, or workflows

•❌ NFTs are static JPEGs with no ongoing utility or engagement
As agents evolve from simple assistants to autonomous, long-running systems, they need a durable foundation — memory that is portable, persistent, and not locked into a single platform.

🔥 The Solution
$RIOT is a multi-agent punk collective where each character is a long-running autonomous agent with:
•✅ Persistent memory via MemWal (Walrus Memory) — cross-session, verifiable, on-chain

•✅ Multi-agent coordination — agents delegate tasks and share context via Sui Stack Messaging

•✅ Artifact-driven workflows — generated art, lore, and logs stored as Walrus blobs with on-chain provenance

•✅ Portable ownership — sell the NFT, transfer the agent’s memory history
“Most NFTs are dead JPEGs. What if your NFT actually remembered you?”

🏗️ System Architecture
┌─────────────────────────────────────────────────────────────────┐
│                         USER LAYER                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │   Telegram   │  │   Discord    │  │  Web dApp    │          │
│  │     Bot      │  │     Bot      │  │  (Walrus Site)│         │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘          │
└─────────┼──────────────────┼──────────────────┼──────────────────┘
          │                  │                  │
          └──────────────────┴──────────────────┘
                             │
                    ┌────────▼────────┐
                    │   OpenClaw      │
                    │  Agent Engine   │
                    │  + DeepSeek LLM │
                    └────────┬────────┘
                             │
          ┌──────────────────┼──────────────────┐
          │                  │                  │
   ┌──────▼──────┐  ┌───────▼───────┐  ┌──────▼──────┐
   │    J4       │  │     J1        │  │    J10      │
   │  Frontman   │  │  Strategist   │  │   Artist    │
   │  (UI/UX)    │  │  (Analytics)  │  │ (Generator) │
   └──────┬──────┘  └───────┬───────┘  └──────┬──────┘
          │                  │                  │
          └──────────────────┼──────────────────┘
                             │
              ┌──────────────▼──────────────┐
              │      MEMWAL (WALRUS MEMORY) │
              │  ┌─────────────────────────┐  │
              │  │  Shared Context Layer   │  │
              │  │  • User preferences     │  │
              │  │  • Conversation logs    │  │
              │  │  • Agent state          │  │
              │  │  • Artifact references  │  │
              │  └─────────────────────────┘  │
              └──────────────┬────────────────┘
                             │
          ┌──────────────────┼──────────────────┐
          │                  │                  │
   ┌──────▼──────┐  ┌───────▼───────┐  ┌──────▼──────┐
   │   Walrus    │  │     Seal      │  │    Sui      │
   │   Storage   │  │   (Privacy)   │  │  Blockchain │
   │             │  │               │  │             │
   │ • Artifacts │  │ • Encrypted   │  │ • NFT       │
   │ • Metadata  │  │   memory      │  │   ownership │
   │ • Logs      │  │ • Access      │  │ • Blob IDs  │
   │             │  │   control     │  │ • Agent IDs │
   └─────────────┘  └───────────────┘  └─────────────┘
Data Flow: From Chat to Chain
1.User sends message via Telegram Bot
2.J4 (Frontman) retrieves user history from MemWal
3.J4 delegates to specialist agent (e.g., J10-Artist) via Sui Stack Messaging
4.Specialist agent reads shared context, generates artifact
5.Artifact uploaded to Walrus → returns Blob ID
6.Move smart contract updates NFT metadata with blob_ref
7.J4 responds to user with result + roast

🛠️ Tech Stack
Layer	Technology	Purpose
Blockchain	Sui (Move)	NFT ownership, Agent ID registry, Blob reference
Memory	MemWal	Persistent, cross-session agent memory on Walrus
Storage	Walrus	Artifact persistence (images, logs, metadata)
Privacy	Seal	Encrypted memory segments & access control
Messaging	Sui Stack Messaging	Inter-agent communication & recovery
AI Engine	OpenClaw + DeepSeek	Personality engine, reasoning, generation
Interface	Telegram Bot	User-facing chat interface
Gallery	Walrus Sites	Decentralized, dynamic artifact gallery

📁 Project Structure
the-riot-sui/
├── contracts/
│   └── move/                    # Sui Move smart contracts
│       ├── sources/
│       │   ├── riot_nft.move    # NFT + Agent ID + Blob registry
│       │   └── riot_memory.move # On-chain memory reference
│       └── tests/
├── agents/
│   ├── j4/                      # J4 — Frontman Agent
│   ├── j1/                      # J1 — Strategist Agent
│   ├── j10/                     # J10 — Artist Agent
│   └── shared/
│       ├── memwal_adapter.py    # MemWal read/write wrapper
│       ├── walrus_client.py     # Walrus blob upload/download
│       └── stack_messaging.py   # Inter-agent messaging
├── bot/
│   └── telegram/
│       ├── main.py              # Telegram bot entrypoint
│       └── handlers/
├── frontend/
│   ├── index.html               # Landing page (this repo)
│   └── walrus-site/             # Walrus Sites deployment
├── assets/
│   └── characters/              # 18 base hand-drawn artworks
└── docs/
    ├── ARCHITECTURE.md
    └── API.md

🚀 Quickstart
Prerequisites
•Sui CLI
•Walrus CLI
•Python 3.10+
•Telegram Bot Token
1. Clone & Setup
git clone https://github.com/cryptoriot666/the-riot-sui.git
cd the-riot-sui

# Install dependencies
pip install -r requirements.txt

# Setup MemWal delegate key
python scripts/setup_memwal.py --agent-id J4
2. Deploy Move Contract (Testnet)
cd contracts/move
sui move build
sui client publish --gas-budget 50000000
3. Run J4 Agent Locally
cd agents/j4
python main.py   --memwal-key $MEMWAL_DELEGATE_KEY   --contract-id $RIOT_CONTRACT_ID   --telegram-token $TG_BOT_TOKEN
4. Upload Artifact to Walrus
walrus store assets/characters/J4_cyberpunk_v2.png
# Returns: Blob ID → update NFT metadata

🎬 Demo
Coming soon: Full demo video for Sui Overflow 2026 submission.
Live Preview
Feature	Status	Link
Landing Page	✅ Live	theriot.vercel.app
DeepSurge Project	✅ Live	View Project
Telegram Bot	🚧 WIP	Join Portal
Move Contract	🚧 WIP	contracts/move/
MemWal Integration	🚧 WIP	agents/shared/memwal_adapter.py

🧪 What Makes This Different
For Users
•Your agent remembers your jokes, preferences, and history — across sessions, browsers, and devices
•Agents coordinate — tell J4 something, J10 knows it instantly
•Your NFT evolves — new artifacts, new lore, new personality over time
For Developers
•Open-source template for attaching MemWal to any Sui NFT
•Reusable adapters for Walrus storage + Move blob registry
•Multi-agent framework using Sui Stack Messaging for coordination

👥 Team
Role	Handle	Status
Founder & Artist	@suicryptoriot	✅ Active
Move Developer	—	🔍 Open
AI / Backend Dev	—	🔍 Open
Want to join? DM on X or join Telegram.

📜 License
MIT — Open source forever. Fork it, break it, make it yours.

Built for Sui Overflow 2026 — Walrus Track
🔴 The riot is inevitable. 🔴
