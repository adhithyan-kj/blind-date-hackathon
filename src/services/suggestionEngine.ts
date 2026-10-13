import { Suggestion, FastModePair } from '../types';

export interface SuggestionEngineInterface {
  generateSuggestions(utterance: string): Promise<Suggestion[]>;
  generateFastModePair(utterance: string): Promise<FastModePair>;
  providerName: string;
}

interface IntentRule {
  name: string;
  pattern: RegExp;
  optionA: string;
  optionB: string;
  alternativeSuggestions?: string[];
}

export const RULE_BASED_PATTERNS: IntentRule[] = [
  // Choice: Tea or Coffee
  {
    name: 'tea_or_coffee',
    pattern: /\b(tea|coffee)\s+or\s+(coffee|tea)\b/i,
    optionA: 'Tea, please.',
    optionB: 'Coffee, please.',
    alternativeSuggestions: ['Just water is fine, thank you.', 'Neither for me, thanks.'],
  },
  // Choice: Cash or Card
  {
    name: 'cash_or_card',
    pattern: /\b(cash|card)\s+or\s+(card|cash)\b|\bhow (would you like to|are you going to) pay\b/i,
    optionA: 'Card, please.',
    optionB: 'Cash, please.',
    alternativeSuggestions: ['Do you accept contactless pay?', 'Can I get a receipt?'],
  },
  // Scheduling: Can you come / Are you free
  {
    name: 'availability_schedule',
    pattern: /\b(can you|are you free|available)\s+(to\s+)?(come|meet|join|talk)\s*(tomorrow|today|later|now)?\b/i,
    optionA: 'Yes, I can make it.',
    optionB: 'Sorry, I am busy then.',
    alternativeSuggestions: ['Could we do a different time?', 'Let me check and get back to you.'],
  },
  // How are you / Greetings
  {
    name: 'greeting_status',
    pattern: /\bhow (are you|are things|have you been|is it going)\b/i,
    optionA: 'I am doing well, thank you.',
    optionB: 'A bit tired, but hanging in there.',
    alternativeSuggestions: ['Good, how about you?', 'Doing okay, thank you for asking.'],
  },
  // Need help / Can I help you
  {
    name: 'offer_of_help',
    pattern: /\b(can i|may i|do you need|would you like)\s+(help|assistance)\b/i,
    optionA: 'Yes, please help me with this.',
    optionB: 'No thank you, I am doing fine.',
    alternativeSuggestions: ['Please give me just a moment.', 'Could you show me where to go?'],
  },
  // General Yes/No questions (Did you, Are you, Have you, Would you like, Do you want)
  {
    name: 'general_yes_no',
    pattern: /^(do you|did you|are you|is it|would you|could you|have you|will you)\b/i,
    optionA: 'Yes, definitely.',
    optionB: 'No, thank you.',
    alternativeSuggestions: ['I am not quite sure yet.', 'Please give me a moment to think.'],
  },
  // Time questions: What time / When
  {
    name: 'time_inquiry',
    pattern: /\b(what time|when|how soon)\b/i,
    optionA: 'In a few minutes, please.',
    optionB: 'Later today works better.',
    alternativeSuggestions: ['Whenever you are ready.', 'As soon as possible.'],
  },
  // Price / Cost questions
  {
    name: 'price_inquiry',
    pattern: /\b(how much|what does it cost|total|price)\b/i,
    optionA: 'That sounds good, I will take it.',
    optionB: 'Could you give me the total breakdown?',
    alternativeSuggestions: ['That is a bit too high for me.', 'I will pass for now, thank you.'],
  },
  // Waiting / Delay inquiry
  {
    name: 'patience_wait',
    pattern: /\b(can you wait|give me a second|hold on|just a minute)\b/i,
    optionA: 'Take your time, no rush.',
    optionB: 'I am on a tight schedule, unfortunately.',
    alternativeSuggestions: ['Thank you for letting me know.'],
  },
  // Location / Where
  {
    name: 'location_inquiry',
    pattern: /\b(where are you going|which way|where to)\b/i,
    optionA: 'Towards the main exit.',
    optionB: 'I am looking for the front desk.',
    alternativeSuggestions: ['Could you point me in the right direction?'],
  },
];

export class RuleBasedSuggestionEngine implements SuggestionEngineInterface {
  public providerName = 'Rule-based Context Matcher (Local)';

  public async generateSuggestions(utterance: string): Promise<Suggestion[]> {
    const clean = utterance.trim();
    if (!clean) {
      return this.getDefaultSuggestions();
    }

    // Check rules
    for (const rule of RULE_BASED_PATTERNS) {
      if (rule.pattern.test(clean)) {
        const results: Suggestion[] = [
          { id: `sug_${Date.now()}_1`, text: rule.optionA, sourceIntent: rule.name, relevanceScore: 0.95 },
          { id: `sug_${Date.now()}_2`, text: rule.optionB, sourceIntent: rule.name, relevanceScore: 0.90 },
        ];

        if (rule.alternativeSuggestions) {
          rule.alternativeSuggestions.forEach((alt, idx) => {
            results.push({
              id: `sug_${Date.now()}_${idx + 3}`,
              text: alt,
              sourceIntent: rule.name,
              relevanceScore: 0.8 - idx * 0.1,
            });
          });
        }

        return results;
      }
    }

    // Fallback contextual suggestions
    return [
      { id: `sug_${Date.now()}_1`, text: 'Yes, that sounds good.', sourceIntent: 'fallback_positive', relevanceScore: 0.7 },
      { id: `sug_${Date.now()}_2`, text: 'No, thank you.', sourceIntent: 'fallback_negative', relevanceScore: 0.7 },
      { id: `sug_${Date.now()}_3`, text: 'Please give me a moment.', sourceIntent: 'fallback_delay', relevanceScore: 0.65 },
      { id: `sug_${Date.now()}_4`, text: 'Could you please repeat that?', sourceIntent: 'fallback_clarification', relevanceScore: 0.6 },
    ];
  }

  public async generateFastModePair(utterance: string): Promise<FastModePair> {
    const suggestions = await this.generateSuggestions(utterance);
    return {
      optionA: suggestions[0],
      optionB: suggestions[1],
      timestamp: Date.now(),
    };
  }

  private getDefaultSuggestions(): Suggestion[] {
    return [
      { id: 'def_1', text: 'Yes, that sounds great.', sourceIntent: 'default', relevanceScore: 0.9 },
      { id: 'def_2', text: 'No, thank you.', sourceIntent: 'default', relevanceScore: 0.9 },
      { id: 'def_3', text: 'Please give me a moment.', sourceIntent: 'default', relevanceScore: 0.8 },
      { id: 'def_4', text: 'Could you please repeat that?', sourceIntent: 'default', relevanceScore: 0.75 },
    ];
  }
}

// Future AI Engine skeleton ready to be swapped via backend proxy endpoint
export class BackendAISuggestionEngine implements SuggestionEngineInterface {
  public providerName = 'External AI Assistance (Secure Proxy)';
  private apiEndpoint: string;

  constructor(apiEndpoint: string = '/api/suggestions') {
    this.apiEndpoint = apiEndpoint;
  }

  public async generateSuggestions(utterance: string): Promise<Suggestion[]> {
    try {
      const res = await fetch(this.apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ utterance }),
      });
      if (!res.ok) throw new Error('AI suggestion request failed');
      const data = await res.json();
      return data.suggestions || [];
    } catch {
      // Fallback seamlessly to local rule-based engine on network/API failure
      const fallback = new RuleBasedSuggestionEngine();
      return fallback.generateSuggestions(utterance);
    }
  }

  public async generateFastModePair(utterance: string): Promise<FastModePair> {
    const suggestions = await this.generateSuggestions(utterance);
    return {
      optionA: suggestions[0] || { id: 'a', text: 'Yes, please.' },
      optionB: suggestions[1] || { id: 'b', text: 'No, thank you.' },
      timestamp: Date.now(),
    };
  }
}

export const activeSuggestionEngine = new RuleBasedSuggestionEngine();
