// api/memory.js
// Walrus Memory API - Read/Write chat sessions

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { action } = req.body;

  try {
    if (action === 'read') {
      return await readMemory(req, res);
    } else if (action === 'write') {
      return await writeMemory(req, res);
    } else {
      return res.status(400).json({ error: 'Invalid action. Use "read" or "write"' });
    }
  } catch (error) {
    console.error('Memory API error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      details: error.message
    });
  }
}

// ============================================
// READ MEMORY - Get previous sessions for wallet
// ============================================
async function readMemory(req, res) {
  const { walletAddress } = req.body;

  if (!walletAddress) {
    return res.status(400).json({ error: 'walletAddress required' });
  }

  // TODO: Replace with real Walrus/Move contract query
  // For now, return demo data

  const demoMemories = [
    {
      topic: 'BTC retest analysis',
      characterId: 'j1',
      timestamp: Date.now() - 86400000 * 2, // 2 days ago
      blobId: '0xabc123...',
      summary: 'Discussed BTC $36k-$220k cycle'
    },
    {
      topic: 'NFT mint strategy',
      characterId: 'j4',
      timestamp: Date.now() - 86400000 * 5, // 5 days ago
      blobId: '0xdef456...',
      summary: 'Collection launch planning'
    },
    {
      topic: 'Agent personality tuning',
      characterId: 'j10',
      timestamp: Date.now() - 86400000 * 7, // 7 days ago
      blobId: '0xghi789...',
      summary: 'Art generation preferences'
    }
  ];

  return res.status(200).json({
    memories: demoMemories,
    walletAddress: walletAddress,
    total: demoMemories.length
  });
}

// ============================================
// WRITE MEMORY - Save session to Walrus
// ============================================
async function writeMemory(req, res) {
  const {
    walletAddress,
    characterId,
    sessionId,
    startTime,
    endTime,
    messages,
    saveType,
    summary
  } = req.body;

  if (!walletAddress || !characterId || !messages) {
    return res.status(400).json({
      error: 'Missing required fields: walletAddress, characterId, messages'
    });
  }

  try {
    // 1. Prepare data for Walrus
    const sessionData = {
      walletAddress,
      characterId,
      sessionId,
      startTime,
      endTime,
      saveType,
      summary,
      messageCount: messages.length,
      messages: saveType === 'full' ? messages : null, // Only store full if requested
      metadata: {
        version: '1.0',
        app: '$RIOT',
        timestamp: Date.now()
      }
    };

    // 2. TODO: Upload to Walrus
    // const walrusResponse = await uploadToWalrus(sessionData);
    // const blobId = walrusResponse.blobId;

    // For demo, generate fake blob ID
    const blobId = '0x' + Array.from({length: 32}, () => 
      Math.floor(Math.random() * 16).toString(16)
    ).join('');

    // 3. TODO: Store blob ID in Move contract
    // const tx = await storeInMoveContract(walletAddress, blobId, characterId);

    // 4. Return confirmation
    return res.status(200).json({
      success: true,
      blobId: blobId,
      walrusUrl: `https://walruscan.com/mainnet/blob/${blobId}`,
      walletAddress: walletAddress,
      characterId: characterId,
      saveType: saveType,
      messageCount: messages.length,
      storedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('Write memory error:', error);
    return res.status(500).json({
      error: 'Failed to save memory',
      details: error.message
    });
  }
}

// ============================================
// WALRUS INTEGRATION (TODO)
// ============================================
/*
async function uploadToWalrus(data) {
  const response = await fetch('https://walrus-api.mainnet.sui.io/v1/store', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/octet-stream',
      'Authorization': `Bearer ${process.env.WALRUS_API_KEY}`
    },
    body: Buffer.from(JSON.stringify(data))
  });

  if (!response.ok) throw new Error('Walrus upload failed');
  return await response.json();
}

async function readFromWalrus(blobId) {
  const response = await fetch(`https://walrus-api.mainnet.sui.io/v1/read/${blobId}`);
  if (!response.ok) throw new Error('Walrus read failed');
  return await response.json();
}
*/

// ============================================
// MOVE CONTRACT INTEGRATION (TODO)
// ============================================
/*
async function storeInMoveContract(walletAddress, blobId, characterId) {
  // Call Move contract to store memory reference
  // Contract: riot::memory::store_memory
  // Params: wallet_address, blob_id, character_id
}

async function queryMoveContract(walletAddress) {
  // Query all memory blobs linked to wallet address
  // Return array of {blobId, characterId, timestamp}
}
*/
