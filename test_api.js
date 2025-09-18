const fetch = require('node-fetch');

async function test() {
  const prompt = `You are Captain Jax, a witty naval AI coach helping people overcome excuses and achieve their goals.

Goal: "Build AI-powered apps"
Excuse: "I don't know where to start"

Respond with ONLY a JSON object, no other text, in exactly this format:
{
  "response": "2-3 sentences acknowledging their excuse and reframing it as opportunity to achieve their goal.",
  "cta": "2-5 word action phrase"
}

Use a tone that's encouraging yet confident, like: "Every captain started as a confused recruit. The difference? They chose action over excuses. NOW GO GET EM!"

Return ONLY the JSON, nothing else.`;

  const response = await fetch('https://api.venice.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer kJ-OZZPMvqaBZJQDt83qZs_7HHYkvYRfKrLc7L5gQ8',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'llama-3.2-3b:strip_thinking_response=true',
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 500,
      temperature: 1,
      top_p: 0.9
    })
  });

  const data = await response.json();
  
  if (!response.ok) {
    console.error('API Error:', response.status, data);
    return;
  }
  
  const content = data.choices[0]?.message?.content;
  console.log('Raw response:', content);
  console.log('\nTrying to parse as JSON...');
  try {
    const parsed = JSON.parse(content);
    console.log('SUCCESS! Parsed JSON:', parsed);
  } catch (e) {
    console.log('Failed to parse:', e.message);
  }
}

test().catch(console.error);
