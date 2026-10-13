import { Phrase, PhraseCategory } from '../types';

export const DEFAULT_CATEGORIES: PhraseCategory[] = [
  { id: 'everyday', name: 'Everyday', icon: 'MessageCircle', description: 'Day-to-day general remarks' },
  { id: 'greetings', name: 'Greetings & Introductions', icon: 'Hand', description: 'Meeting people & polite small talk' },
  { id: 'college', name: 'College & Education', icon: 'GraduationCap', description: 'Classrooms, professors & campus life' },
  { id: 'shopping', name: 'Shops & Shopping', icon: 'ShoppingBag', description: 'Stores, prices, checkouts' },
  { id: 'dining', name: 'Restaurants & Food', icon: 'UtensilsCrossed', description: 'Ordering meals, drinks & bills' },
  { id: 'transport', name: 'Public Transport', icon: 'Bus', description: 'Tickets, routes, bus & train' },
  { id: 'healthcare', name: 'Hospitals & Healthcare', icon: 'HeartPulse', description: 'Clinics, doctors, pharmacy' },
  { id: 'phone', name: 'Phone Calls', icon: 'Phone', description: 'Answering & managing calls' },
  { id: 'help', name: 'Asking for Help', icon: 'HelpCircle', description: 'Requesting guidance or assistance' },
  { id: 'emergency', name: 'Emergencies', icon: 'AlertTriangle', description: 'Urgent medical or safety alerts' },
  { id: 'custom', name: 'Custom Phrases', icon: 'Bookmark', description: 'Your personal saved phrases', isCustom: true },
];

export const DEFAULT_PHRASES: Phrase[] = [
  // Everyday
  { id: 'e1', categoryId: 'everyday', text: 'Please give me a moment.', isPinned: true, createdAt: 1 },
  { id: 'e2', categoryId: 'everyday', text: 'Thank you for waiting.', isPinned: true, createdAt: 2 },
  { id: 'e3', categoryId: 'everyday', text: 'Could you please repeat that?', isPinned: true, createdAt: 3 },
  { id: 'e4', categoryId: 'everyday', text: 'Yes, that sounds good.', createdAt: 4 },
  { id: 'e5', categoryId: 'everyday', text: 'No, thank you.', createdAt: 5 },
  { id: 'e6', categoryId: 'everyday', text: 'I understand, thank you.', createdAt: 6 },
  { id: 'e7', categoryId: 'everyday', text: 'I am using this assistive device to speak.', isPinned: true, createdAt: 7 },

  // Greetings
  { id: 'g1', categoryId: 'greetings', text: 'Hi, how are you?', createdAt: 10 },
  { id: 'g2', categoryId: 'greetings', text: 'Nice to meet you.', createdAt: 11 },
  { id: 'g3', categoryId: 'greetings', text: 'Good morning!', createdAt: 12 },
  { id: 'g4', categoryId: 'greetings', text: 'Good afternoon!', createdAt: 13 },
  { id: 'g5', categoryId: 'greetings', text: 'Have a great day ahead.', createdAt: 14 },
  { id: 'g6', categoryId: 'greetings', text: 'Goodbye, take care.', createdAt: 15 },

  // College & Education
  { id: 'c1', categoryId: 'college', text: 'Excuse me professor, could I ask a question?', createdAt: 20 },
  { id: 'c2', categoryId: 'college', text: 'Here is my assignment submission.', createdAt: 21 },
  { id: 'c3', categoryId: 'college', text: 'Could you please give me a moment to present my point?', isPinned: true, createdAt: 22 },
  { id: 'c4', categoryId: 'college', text: 'Could you share the lecture notes or slides with me?', createdAt: 23 },
  { id: 'c5', categoryId: 'college', text: 'I am part of this study group.', createdAt: 24 },
  { id: 'c6', categoryId: 'college', text: 'Which room is this class scheduled in?', createdAt: 25 },

  // Shopping
  { id: 's1', categoryId: 'shopping', text: 'Could you tell me the price of this item?', isPinned: true, createdAt: 30 },
  { id: 's2', categoryId: 'shopping', text: 'Do you have this in a different size or color?', createdAt: 31 },
  { id: 's3', categoryId: 'shopping', text: 'I would like to pay by card, please.', createdAt: 32 },
  { id: 's4', categoryId: 'shopping', text: 'Can I have a receipt, please?', createdAt: 33 },
  { id: 's5', categoryId: 'shopping', text: 'Where can I find the checkout counter?', createdAt: 34 },
  { id: 's6', categoryId: 'shopping', text: 'I am just browsing, thank you.', createdAt: 35 },

  // Dining
  { id: 'd1', categoryId: 'dining', text: 'I would like to order this, please.', isPinned: true, createdAt: 40 },
  { id: 'd2', categoryId: 'dining', text: 'A table for one, please.', createdAt: 41 },
  { id: 'd3', categoryId: 'dining', text: 'A table for two, please.', createdAt: 42 },
  { id: 'd4', categoryId: 'dining', text: 'Could I please have a glass of water?', createdAt: 43 },
  { id: 'd5', categoryId: 'dining', text: 'Can we get the bill, please?', isPinned: true, createdAt: 44 },
  { id: 'd6', categoryId: 'dining', text: 'Is this dish vegetarian or vegan?', createdAt: 45 },
  { id: 'd7', categoryId: 'dining', text: 'Please make it non-spicy if possible.', createdAt: 46 },

  // Transport
  { id: 't1', categoryId: 'transport', text: 'One ticket to downtown, please.', createdAt: 50 },
  { id: 't2', categoryId: 'transport', text: 'Does this bus stop near the central station?', createdAt: 51 },
  { id: 't3', categoryId: 'transport', text: 'Could you tell me which platform my train leaves from?', createdAt: 52 },
  { id: 't4', categoryId: 'transport', text: 'Please let me know when we arrive at my stop.', createdAt: 53 },
  { id: 't5', categoryId: 'transport', text: 'I need to step off here, excuse me.', createdAt: 54 },

  // Healthcare
  { id: 'h1', categoryId: 'healthcare', text: 'I have an appointment at this time.', createdAt: 60 },
  { id: 'h2', categoryId: 'healthcare', text: 'I stammer and communicate through this speech app.', isPinned: true, createdAt: 61 },
  { id: 'h3', categoryId: 'healthcare', text: 'I need a refill for this prescription.', createdAt: 62 },
  { id: 'h4', categoryId: 'healthcare', text: 'I am experiencing some pain here.', createdAt: 63 },
  { id: 'h5', categoryId: 'healthcare', text: 'Could you please write down the instructions for me?', createdAt: 64 },

  // Phone
  { id: 'p1', categoryId: 'phone', text: 'Hello, I am using an assistive speech device for this call.', isPinned: true, createdAt: 70 },
  { id: 'p2', categoryId: 'phone', text: 'Please bear with me while I type my responses.', createdAt: 71 },
  { id: 'p3', categoryId: 'phone', text: 'Could you please speak a little slower?', createdAt: 72 },
  { id: 'p4', categoryId: 'phone', text: 'Could you please send that information by text or email?', createdAt: 73 },
  { id: 'p5', categoryId: 'phone', text: 'Thank you for your patience. Goodbye.', createdAt: 74 },

  // Help
  { id: 'hl1', categoryId: 'help', text: 'Could you help me with this?', isPinned: true, createdAt: 80 },
  { id: 'hl2', categoryId: 'help', text: 'I need some assistance finding directions.', createdAt: 81 },
  { id: 'hl3', categoryId: 'help', text: 'Could someone guide me to the nearest exit?', createdAt: 82 },
  { id: 'hl4', categoryId: 'help', text: 'I am having trouble with this machine.', createdAt: 83 },

  // Emergency
  { id: 'em1', categoryId: 'emergency', text: 'I need emergency assistance. Please call for help.', isPinned: true, createdAt: 90 },
  { id: 'em2', categoryId: 'emergency', text: 'I am having a medical emergency.', isPinned: true, createdAt: 91 },
  { id: 'em3', categoryId: 'emergency', text: 'Please call an ambulance immediately.', createdAt: 92 },
  { id: 'em4', categoryId: 'emergency', text: 'My emergency contact phone number is on my card.', createdAt: 93 },
];

export const DEFAULT_SETTINGS = {
  language: 'en-US',
  voiceURI: '',
  rate: 0.95, // comfortable pace
  pitch: 1.0,
  theme: 'dark' as const,
  highContrast: false,
  largeText: false,
  reducedMotion: false,
  tapToSpeak: true, // tap speaks directly
  confirmBeforeSpeak: false,
  autoModeStabilityDelayMs: 2500, // 2.5 seconds minimum freeze time
  quickMomentPhrase: 'Please give me a moment.',
  emergencyPhrase: 'I need emergency assistance. Please help.',
  saveTranscriptsLocally: false,
};
