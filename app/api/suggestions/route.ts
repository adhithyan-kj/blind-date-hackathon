import { NextRequest, NextResponse } from 'next/server';

interface SuggestionResult {
  id: string;
  text: string;
  sourceIntent: string;
  relevanceScore: number;
}

export async function POST(req: NextRequest) {
  try {
    const { utterance } = await req.json();

    if (!utterance || typeof utterance !== 'string' || !utterance.trim()) {
      return NextResponse.json({
        suggestions: [
          { id: `opt_1_${Date.now()}`, text: 'Yes, that sounds good.', sourceIntent: 'default', relevanceScore: 0.95 },
          { id: `opt_2_${Date.now()}`, text: 'No, thank you.', sourceIntent: 'default', relevanceScore: 0.90 },
          { id: `opt_3_${Date.now()}`, text: 'Please give me a moment.', sourceIntent: 'default', relevanceScore: 0.85 },
          { id: `opt_4_${Date.now()}`, text: 'Could you please repeat that?', sourceIntent: 'default', relevanceScore: 0.80 },
        ],
      });
    }

    const clean = utterance.trim();
    const fastrouterKey = process.env.FASTROUTER_API_KEY;
    const groqKey = process.env.GROQ_API_KEY;

    // 1. FastRouter AI Gateway
    if (fastrouterKey) {
      try {
        const frRes = await fetch('https://api.fastrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${fastrouterKey}`,
          },
          body: JSON.stringify({
            model: 'fastrouter/auto',
            messages: [
              {
                role: 'system',
                content:
                  'You are an AAC assistive communication AI for someone who stammers. The user needs to tap 1 of 4 short speech buttons to respond to a conversation partner. When given what the partner said, output EXACTLY a JSON array of 4 short, realistic, first-person reply strings: Option 1 (direct answer/preference), Option 2 (alternative answer/choice), Option 3 (neutral/clarification/polite follow-up), Option 4 (polite decline or asking for time). If they ask "tea or coffee", option 1 must be "Tea, please." and option 2 must be "Coffee, please.". Return ONLY the JSON array like ["Tea, please.", "Coffee, please.", "Just water, thank you.", "Neither for me right now."].',
              },
              {
                role: 'user',
                content: clean,
              },
            ],
            temperature: 0.2,
            max_tokens: 150,
          }),
        });

        if (frRes.ok) {
          const data = await frRes.json();
          const content = data.choices?.[0]?.message?.content || '';
          const match = content.match(/\[[\s\S]*\]/);
          if (match) {
            const parsedArray = JSON.parse(match[0]);
            if (Array.isArray(parsedArray) && parsedArray.length >= 4) {
              const suggestions: SuggestionResult[] = parsedArray.slice(0, 4).map((item, idx) => ({
                id: `fr_${Date.now()}_${idx + 1}`,
                text: String(item).trim().replace(/^["']|["']$/g, ''),
                sourceIntent: 'fastrouter_ai',
                relevanceScore: 0.99 - idx * 0.05,
              }));
              return NextResponse.json({ suggestions, model: `fastrouter:${data.model || 'auto'}` });
            }
          }
        } else {
          console.warn('FastRouter response not ok:', frRes.status, await frRes.text());
        }
      } catch (frErr) {
        console.warn('FastRouter call failed:', frErr);
      }
    }

    // 2. Groq Ultra-Fast AI Generation
    if (groqKey) {
      try {
        const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${groqKey}`,
          },
          body: JSON.stringify({
            model: 'llama-3.3-70b-versatile',
            messages: [
              {
                role: 'system',
                content:
                  'You are an AAC assistive communication AI for someone who stammers. The user needs to tap 1 of 4 short speech buttons to respond to a conversation partner. When given what the partner said, output EXACTLY a JSON array of 4 short, realistic, first-person reply strings: Option 1 (direct answer/preference), Option 2 (alternative answer/choice), Option 3 (neutral/clarification/polite follow-up), Option 4 (polite decline or asking for time). If they ask "tea or coffee", option 1 must be "Tea, please." and option 2 must be "Coffee, please.". Return ONLY the JSON array like ["Tea, please.", "Coffee, please.", "Just water, thank you.", "Neither for me right now."].',
              },
              {
                role: 'user',
                content: clean,
              },
            ],
            temperature: 0.2,
            max_tokens: 150,
          }),
        });

        if (groqRes.ok) {
          const data = await groqRes.json();
          const content = data.choices?.[0]?.message?.content || '';
          const match = content.match(/\[[\s\S]*\]/);
          if (match) {
            const parsedArray = JSON.parse(match[0]);
            if (Array.isArray(parsedArray) && parsedArray.length >= 4) {
              const suggestions: SuggestionResult[] = parsedArray.slice(0, 4).map((item, idx) => ({
                id: `groq_${Date.now()}_${idx + 1}`,
                text: String(item).trim().replace(/^["']|["']$/g, ''),
                sourceIntent: 'groq_ai',
                relevanceScore: 0.99 - idx * 0.05,
              }));
              return NextResponse.json({ suggestions, model: 'groq:llama-3.3-70b-versatile' });
            }
          }
        } else {
          console.warn('Groq response not ok:', groqRes.status, await groqRes.text());
        }
      } catch (groqErr) {
        console.warn('Groq call failed, falling back to local NLP generator:', groqErr);
      }
    }

    // 2. Intelligent Contextual Local Fallback Engine
    const suggestions = generateContextualAISuggestions(clean);
    return NextResponse.json({ suggestions, model: 'local-contextual-nlp' });
  } catch (error) {
    console.error('API /api/suggestions error:', error);
    return NextResponse.json(
      { error: 'Failed to generate suggestions' },
      { status: 500 }
    );
  }
}

function generateContextualAISuggestions(clean: string): SuggestionResult[] {
  const lower = clean.toLowerCase();
  const timestamp = Date.now();

  // Tea & Coffee
  const hasTea = /\btea\b/i.test(lower);
  const hasCoffee = /\bcoffee\b/i.test(lower);
  if (hasTea && hasCoffee) {
    const coffeeFirst = lower.indexOf('coffee') < lower.indexOf('tea');
    return [
      { id: `ai_${timestamp}_1`, text: coffeeFirst ? 'Coffee, please.' : 'Tea, please.', sourceIntent: 'ai_choice', relevanceScore: 0.99 },
      { id: `ai_${timestamp}_2`, text: coffeeFirst ? 'Tea, please.' : 'Coffee, please.', sourceIntent: 'ai_choice', relevanceScore: 0.96 },
      { id: `ai_${timestamp}_3`, text: 'Just water is fine, thank you.', sourceIntent: 'ai_choice', relevanceScore: 0.88 },
      { id: `ai_${timestamp}_4`, text: 'Neither for me right now.', sourceIntent: 'ai_choice', relevanceScore: 0.80 },
    ];
  } else if (hasTea) {
    return [
      { id: `ai_${timestamp}_1`, text: 'Tea, please.', sourceIntent: 'ai_beverage', relevanceScore: 0.99 },
      { id: `ai_${timestamp}_2`, text: 'Coffee, please.', sourceIntent: 'ai_beverage', relevanceScore: 0.94 },
      { id: `ai_${timestamp}_3`, text: 'Yes, that would be lovely.', sourceIntent: 'ai_beverage', relevanceScore: 0.88 },
      { id: `ai_${timestamp}_4`, text: 'No thank you, I am good.', sourceIntent: 'ai_beverage', relevanceScore: 0.80 },
    ];
  } else if (hasCoffee) {
    return [
      { id: `ai_${timestamp}_1`, text: 'Coffee, please.', sourceIntent: 'ai_beverage', relevanceScore: 0.99 },
      { id: `ai_${timestamp}_2`, text: 'Tea, please.', sourceIntent: 'ai_beverage', relevanceScore: 0.94 },
      { id: `ai_${timestamp}_3`, text: 'Yes, that would be lovely.', sourceIntent: 'ai_beverage', relevanceScore: 0.88 },
      { id: `ai_${timestamp}_4`, text: 'No thank you, I am good.', sourceIntent: 'ai_beverage', relevanceScore: 0.80 },
    ];
  }

  // A or B Choices (e.g. cash or card, red or blue)
  const choiceMatch = clean.match(/\b([a-zA-Z]+(?:\s+[a-zA-Z]+)?)\s+(?:or|\/)\s+([a-zA-Z]+(?:\s+[a-zA-Z]+)?)\b/i);
  if (choiceMatch) {
    const opt1 = choiceMatch[1].trim();
    const opt2 = choiceMatch[2].trim();
    const cap1 = opt1.charAt(0).toUpperCase() + opt1.slice(1);
    const cap2 = opt2.charAt(0).toUpperCase() + opt2.slice(1);
    return [
      { id: `ai_${timestamp}_1`, text: `${cap1}, please.`, sourceIntent: 'ai_choice', relevanceScore: 0.99 },
      { id: `ai_${timestamp}_2`, text: `${cap2}, please.`, sourceIntent: 'ai_choice', relevanceScore: 0.96 },
      { id: `ai_${timestamp}_3`, text: 'Either one is fine with me.', sourceIntent: 'ai_choice', relevanceScore: 0.88 },
      { id: `ai_${timestamp}_4`, text: 'Neither, thank you.', sourceIntent: 'ai_choice', relevanceScore: 0.80 },
    ];
  }

  // Greetings / How are you
  if (/how are you|how('s| is) it going|how do you feel/i.test(lower)) {
    return [
      { id: `ai_${timestamp}_1`, text: 'I am doing well, thank you!', sourceIntent: 'ai_greeting', relevanceScore: 0.99 },
      { id: `ai_${timestamp}_2`, text: 'Doing good! How about you?', sourceIntent: 'ai_greeting', relevanceScore: 0.95 },
      { id: `ai_${timestamp}_3`, text: 'A bit tired, but hanging in there.', sourceIntent: 'ai_greeting', relevanceScore: 0.88 },
      { id: `ai_${timestamp}_4`, text: 'Give me just a second.', sourceIntent: 'ai_greeting', relevanceScore: 0.80 },
    ];
  }

  // Time / Scheduling
  if (/when|what time|schedule|come tomorrow|free today|available/i.test(lower)) {
    return [
      { id: `ai_${timestamp}_1`, text: 'Yes, I am available then.', sourceIntent: 'ai_schedule', relevanceScore: 0.99 },
      { id: `ai_${timestamp}_2`, text: 'Sorry, I am busy at that time.', sourceIntent: 'ai_schedule', relevanceScore: 0.95 },
      { id: `ai_${timestamp}_3`, text: 'Could we reschedule for later?', sourceIntent: 'ai_schedule', relevanceScore: 0.88 },
      { id: `ai_${timestamp}_4`, text: 'Let me double check and let you know.', sourceIntent: 'ai_schedule', relevanceScore: 0.80 },
    ];
  }

  // Payment / billing
  if (/pay|payment|cash|card|cost|how much|bill/i.test(lower)) {
    return [
      { id: `ai_${timestamp}_1`, text: 'Card, please.', sourceIntent: 'ai_payment', relevanceScore: 0.99 },
      { id: `ai_${timestamp}_2`, text: 'Cash, please.', sourceIntent: 'ai_payment', relevanceScore: 0.95 },
      { id: `ai_${timestamp}_3`, text: 'Do you accept UPI or contactless pay?', sourceIntent: 'ai_payment', relevanceScore: 0.88 },
      { id: `ai_${timestamp}_4`, text: 'Could I get a receipt, please?', sourceIntent: 'ai_payment', relevanceScore: 0.80 },
    ];
  }

  // Offer of help
  if (/help|assist|need anything|hand/i.test(lower)) {
    return [
      { id: `ai_${timestamp}_1`, text: 'Yes, please help me with this.', sourceIntent: 'ai_help', relevanceScore: 0.99 },
      { id: `ai_${timestamp}_2`, text: 'No thank you, I am doing fine.', sourceIntent: 'ai_help', relevanceScore: 0.95 },
      { id: `ai_${timestamp}_3`, text: 'Please give me just a moment.', sourceIntent: 'ai_help', relevanceScore: 0.88 },
      { id: `ai_${timestamp}_4`, text: 'Could you point me in the right direction?', sourceIntent: 'ai_help', relevanceScore: 0.80 },
    ];
  }

  // Default context-aware options
  return [
    { id: `ai_${timestamp}_1`, text: 'Yes, that sounds great.', sourceIntent: 'ai_default', relevanceScore: 0.90 },
    { id: `ai_${timestamp}_2`, text: 'No, thank you.', sourceIntent: 'ai_default', relevanceScore: 0.85 },
    { id: `ai_${timestamp}_3`, text: 'Please give me a moment.', sourceIntent: 'ai_default', relevanceScore: 0.80 },
    { id: `ai_${timestamp}_4`, text: 'Could you please repeat that?', sourceIntent: 'ai_default', relevanceScore: 0.75 },
  ];
}
