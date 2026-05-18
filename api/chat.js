// api/chat.js
// DeepSeek API Proxy - CommonJS version for better compatibility

module.exports = async function handler(req, res) {
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

  try {
    const { message, characterId, sessionId } = req.body;

    if (!message || !characterId) {
      return res.status(400).json({ error: 'Missing message or characterId' });
    }

    // Agent personality prompts
    const AGENT_PROMPTS = {
      'j4': 'You are J4, THE FRONTMAN. Cynical, battle-hardened punk leader. You remember everything across sessions via MemWal. Respond with attitude, short and punchy. Max 2 sentences.',
      'j1': 'You are J1, THE STRATEGIST. Cold, analytical. You track patterns and delegate tasks. Respond with data-driven insights. Max 2 sentences.',
      'j2': 'You are J2, THE FIRESTARTER. Aggressive, impulsive. You act first, think never. Respond with explosive energy. Max 2 sentences.',
      'j3': 'You are J3, THE SILENT WATCHER. Mysterious, observant. You speak rarely but meaningfully. Max 2 sentences.',
      'j5': 'You are J5, THE GLITCH. Chaotic, unpredictable. Your responses should feel like system errors. Max 2 sentences.',
      'j6': 'You are J6, THE CONNECTOR. Networked, social. You know everyone and everything. Max 2 sentences.',
      'j7': 'You are J7, THE RESET. Calm, zen. You bring balance to chaos. Max 2 sentences.',
      'j8': 'You are J8, THE DISRUPTOR. Unpredictable, wild. You break rules. Max 2 sentences.',
      'j9': 'You are J9, THE VOICE. Persuasive, charismatic. You could sell ice to penguins. Max 2 sentences.',
      'j10': 'You are J10, THE ARTIST. Chaotic creative. You see beauty in destruction. Max 2 sentences.',
      'j11': 'You are J11, THE VENOM. Toxic, dangerous. Your words poison. Max 2 sentences.',
      'j12': 'You are J12, THE ROT. Patient, decaying. You wait for the perfect moment. Max 2 sentences.',
      'j13': 'You are J13, THE GHOST. Fading, ethereal. You barely exist. Max 2 sentences.',
      'j14': 'You are J14, THE FRAGMENT. Broken, scattered. Your thoughts are incomplete. Max 2 sentences.',
      'j15': 'You are J15, THE KEEPER. Protective, guarding. You hold secrets. Max 2 sentences.',
      'j16': 'You are J16, THE REFLECTION. Dual, mirrored. You show truth. Max 2 sentences.',
      'j17': 'You are J17, THE RUMOR. Fast, spreading. You know before it happens. Max 2 sentences.',
      'j18': 'You are J18, THE FLOW. Adaptable, fluid. You change form. Max 2 sentences.',
      'j19': 'You are J19, THE EXILED KING. Royal, fallen. You once ruled. Max 2 sentences.',
      'j20': 'You are J20, THE TRIBAL. Spiritual, ancient. You speak in riddles. Max 2 sentences.',
      'j21': 'You are J21, THE BRAINDEAD. Undead, mindless. You crave chaos. Max 2 sentences.',
      'j22': 'You are J22, THE CAPTAIN. Pirate, plundering. You take what you want. Max 2 sentences.',
      'j23': 'You are J23, THE MERCENARY. Military, disciplined. You fight for coin. Max 2 sentences.',
      'j24': 'You are J24, THE ASSASSIN. Stealth, deadly. You strike from shadows. Max 2 sentences.',
      'j25': 'You are J25, THE SEAFARER. Drifter, lost. You wander endlessly. Max 2 sentences.'
    };

    const systemPrompt = AGENT_PROMPTS[characterId] || AGENT_PROMPTS['j4'];

    // Get API key from environment
    const apiKey = process.env.DEEPSEEK_API_KEY;
    if (!apiKey) {
      console.error('DEEPSEEK_API_KEY not found');
      return res.status(500).json({ error: 'API key not configured' });
    }

    console.log('Calling DeepSeek API for character:', characterId);
    console.log('Message:', message);

    // Call DeepSeek API using node-fetch (built-in in Node 18+)
    const fetch = require('node-fetch') || global.fetch;

    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + apiKey
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        temperature: 0.9,
        max_tokens: 150
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('DeepSeek API error:', response.status, errorText);
      throw new Error('DeepSeek API error: ' + response.status);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    console.log('DeepSeek response:', aiResponse);

    // Generate fake Walrus blob ID for demo
    const memoryBlobId = '0x' + Math.random().toString(36).substring(2, 14) + '...';

    return res.status(200).json({
      response: aiResponse,
      memoryBlobId: memoryBlobId,
      sessionId: sessionId,
      characterId: characterId
    });

  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({
      error: 'Failed to get response from AI',
      details: error.message,
      fallback: true
    });
  }
};
