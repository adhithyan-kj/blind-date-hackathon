import { Suggestion, FastModePair, SuggestionGroup } from '../types';

export interface SuggestionEngineInterface {
  generateSuggestions(utterance: string): Promise<Suggestion[]>;
  generateFastModeGroup(utterance: string): Promise<SuggestionGroup>;
  providerName: string;
}

interface IntentRule {
  name: string;
  pattern: RegExp;
  options: [string, string, string, string];
}

export const RULE_BASED_PATTERNS: IntentRule[] = [
  // Specific: Tea or Coffee
  {
    name: 'tea_or_coffee',
    pattern: /\b(tea|coffee)\s+or\s+(coffee|tea)\b/i,
    options: [
      'Tea, please.',
      'Coffee, please.',
      'Just water is fine, thank you.',
      'Neither for me right now.',
    ],
  },
  // Choice: Cash or Card / Payment
  {
    name: 'cash_or_card',
    pattern: /\b(cash|card)\s+or\s+(card|cash)\b|\bhow (would you like to|are you going to) pay\b|\bpayment\b/i,
    options: [
      'Card, please.',
      'Cash, please.',
      'Do you accept UPI or contactless pay?',
      'Can I get a receipt, please?',
    ],
  },
  // Scheduling: Can you come / Are you free
  {
    name: 'availability_schedule',
    pattern: /\b(can you|are you free|available)\s+(to\s+)?(come|meet|join|talk|visit)\s*(tomorrow|today|later|now)?\b/i,
    options: [
      'Yes, I can come.',
      'Sorry, I am busy then.',
      'Could we reschedule for later?',
      'Let me check and get back to you.',
    ],
  },
  // How are you / Greetings
  {
    name: 'greeting_status',
    pattern: /\b(how are you|how is it going|how have you been|how do you feel)\b/i,
    options: [
      'I am doing well, thank you!',
      'A bit tired, but hanging in there.',
      'Doing good! How about you?',
      'Please give me a moment to respond.',
    ],
  },
  // Offer of help: Can I help you / Do you need assistance
  {
    name: 'offer_of_help',
    pattern: /\b(can i|may i|do you need|would you like)\s+(help|assistance|hand)\b/i,
    options: [
      'Yes, please help me with this.',
      'No thank you, I am doing fine.',
      'Please give me just a moment.',
      'Could you point me in the right direction?',
    ],
  },
  // Time inquiry
  {
    name: 'time_inquiry',
    pattern: /\b(what time|when|how soon|what hour)\b/i,
    options: [
      'In a few minutes, please.',
      'Later today works better for me.',
      'Whenever you are ready.',
      'Could you please decide the time?',
    ],
  },
  // Price / Cost inquiry
  {
    name: 'price_inquiry',
    pattern: /\b(how much|what does it cost|total amount|price|bill)\b/i,
    options: [
      'That sounds good, I will take it.',
      'Could you tell me the total amount?',
      'That is a bit too high for me.',
      'I will pass for now, thank you.',
    ],
  },
  // Waiting / Delay inquiry
  {
    name: 'patience_wait',
    pattern: /\b(can you wait|give me a second|hold on|just a minute|hurry)\b/i,
    options: [
      'Take your time, no rush at all.',
      'I am on a tight schedule, unfortunately.',
      'Thank you for letting me know.',
      'Please take as long as you need.',
    ],
  },
  // Location / Where
  {
    name: 'location_inquiry',
    pattern: /\b(where are you going|which way|where to|where is)\b/i,
    options: [
      'Towards the main exit.',
      'I am looking for the front desk.',
      'Could you guide me there, please?',
      'Just looking around, thank you.',
    ],
  },
  // General Yes/No questions (Did you, Are you, Have you, Would you like, Do you want)
  {
    name: 'general_yes_no',
    pattern: /^(do you|did you|are you|is it|would you|could you|have you|will you|should we)\b/i,
    options: [
      'Yes, definitely.',
      'No, thank you.',
      'Please give me a moment to think.',
      'Could you please repeat that?',
    ],
  },
];

export class RuleBasedSuggestionEngine implements SuggestionEngineInterface {
  public providerName = 'Rule-based Context Matcher (Local)';

  public async generateSuggestions(utterance: string): Promise<Suggestion[]> {
    const clean = utterance.trim();
    if (!clean) {
      return this.getDefaultSuggestions();
    }

    // 1. Dynamic "A or B" extractor (e.g. "Do you prefer red or blue?", "Large or small?")
    const choiceMatch = clean.match(/\b([a-zA-Z]+)\s+or\s+([a-zA-Z]+)\b/i);
    if (choiceMatch && !clean.match(/\b(tea|coffee|cash|card)\b/i)) {
      const firstOpt = choiceMatch[1].charAt(0).toUpperCase() + choiceMatch[1].slice(1).toLowerCase();
      const secondOpt = choiceMatch[2].charAt(0).toUpperCase() + choiceMatch[2].slice(1).toLowerCase();
      return [
        { id: `sug_${Date.now()}_1`, text: `${firstOpt}, please.`, sourceIntent: 'dynamic_choice', relevanceScore: 0.95 },
        { id: `sug_${Date.now()}_2`, text: `${secondOpt}, please.`, sourceIntent: 'dynamic_choice', relevanceScore: 0.92 },
        { id: `sug_${Date.now()}_3`, text: 'Either one is fine with me.', sourceIntent: 'dynamic_choice', relevanceScore: 0.85 },
        { id: `sug_${Date.now()}_4`, text: 'Neither, thank you.', sourceIntent: 'dynamic_choice', relevanceScore: 0.80 },
      ];
    }

    // 2. Check predefined rules
    for (const rule of RULE_BASED_PATTERNS) {
      if (rule.pattern.test(clean)) {
        return rule.options.map((optText, index) => ({
          id: `sug_${Date.now()}_${index + 1}`,
          text: optText,
          sourceIntent: rule.name,
          relevanceScore: 0.95 - index * 0.05,
        }));
      }
    }

    // 3. Fallback contextual suggestions
    return [
      { id: `sug_${Date.now()}_1`, text: 'Yes, that sounds good.', sourceIntent: 'fallback_positive', relevanceScore: 0.8 },
      { id: `sug_${Date.now()}_2`, text: 'No, thank you.', sourceIntent: 'fallback_negative', relevanceScore: 0.8 },
      { id: `sug_${Date.now()}_3`, text: 'Please give me a moment.', sourceIntent: 'fallback_delay', relevanceScore: 0.75 },
      { id: `sug_${Date.now()}_4`, text: 'Could you please repeat that?', sourceIntent: 'fallback_clarification', relevanceScore: 0.7 },
    ];
  }

  public async generateFastModeGroup(utterance: string): Promise<SuggestionGroup> {
    const suggestions = await this.generateSuggestions(utterance);
    return {
      optionA: suggestions[0],
      optionB: suggestions[1],
      optionC: suggestions[2] || { id: 'c', text: 'Please give me a moment.' },
      optionD: suggestions[3] || { id: 'd', text: 'Could you please repeat that?' },
      timestamp: Date.now(),
    };
  }

  // Alias for backward compatibility
  public async generateFastModePair(utterance: string): Promise<SuggestionGroup> {
    return this.generateFastModeGroup(utterance);
  }

  private getDefaultSuggestions(): Suggestion[] {
    return [
      { id: 'def_1', text: 'Yes, that sounds great.', sourceIntent: 'default', relevanceScore: 0.95 },
      { id: 'def_2', text: 'No, thank you.', sourceIntent: 'default', relevanceScore: 0.9 },
      { id: 'def_3', text: 'Please give me a moment.', sourceIntent: 'default', relevanceScore: 0.85 },
      { id: 'def_4', text: 'Could you please repeat that?', sourceIntent: 'default', relevanceScore: 0.8 },
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

  public async generateFastModeGroup(utterance: string): Promise<SuggestionGroup> {
    const suggestions = await this.generateSuggestions(utterance);
    return {
      optionA: suggestions[0] || { id: 'a', text: 'Yes, please.' },
      optionB: suggestions[1] || { id: 'b', text: 'No, thank you.' },
      optionC: suggestions[2] || { id: 'c', text: 'Please give me a moment.' },
      optionD: suggestions[3] || { id: 'd', text: 'Could you please repeat that?' },
      timestamp: Date.now(),
    };
  }

  public async generateFastModePair(utterance: string): Promise<SuggestionGroup> {
    return this.generateFastModeGroup(utterance);
  }
}

export const activeSuggestionEngine = new RuleBasedSuggestionEngine();
