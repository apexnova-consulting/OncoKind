export type QuietRoomMood =
  | 'exhausted'
  | 'anxious'
  | 'sad'
  | 'numb'
  | 'okay'
  | 'grateful'
  | 'strong';

export const QUIET_ROOM_PROMPTS = [
  "What's on your mind today?",
  'What do you wish someone would ask you?',
  'What did you do today that took strength?',
  'What are you grateful for, even in all of this?',
];

export const QUIET_ROOM_MESSAGES: Record<QuietRoomMood, string> = {
  exhausted:
    "Thank you for being honest with yourself. That takes courage. You'll find a few things below that might help right now.",
  anxious:
    "Thank you for being honest with yourself. That takes courage. You'll find a few things below that might help right now.",
  sad: "Thank you for being honest with yourself. That takes courage. You'll find a few things below that might help right now.",
  numb: "Thank you for being honest with yourself. That takes courage. You'll find a few things below that might help right now.",
  okay: "Hold onto that. You're doing more than you know.",
  grateful: "Hold onto that. You're doing more than you know.",
  strong: "Hold onto that. You're doing more than you know.",
};

export const COPING_CARDS = [
  {
    id: '478-breath',
    title: 'The 4-7-8 Breath',
    category: 'When you are exhausted',
    moods: ['exhausted', 'anxious'] as QuietRoomMood[],
    body: 'Sit back if you can. Breathe in through your nose for 4. Hold for 7. Exhale slowly for 8. Do it four times. The goal is not to feel amazing. The goal is to give your body one small signal that you are safe in this moment.',
  },
  {
    id: 'empty-cup',
    title: 'You Cannot Pour From an Empty Cup',
    category: 'When you are exhausted',
    moods: ['exhausted'] as QuietRoomMood[],
    body: 'Rest is not something you earn after you break. Pick one version of rest that fits today: 5 minutes with your eyes closed, 15 minutes without your phone, or one hour where somebody else carries one task for you.',
  },
  {
    id: 'accepting-help',
    title: 'What to Say When Someone Offers Help',
    category: 'When you are exhausted',
    moods: ['exhausted', 'strong'] as QuietRoomMood[],
    body: 'You do not need to invent the perfect answer. Try: "Yes, thank you. Could you bring dinner on Thursday?" or "Would you mind driving us next week?" Let people help with one concrete thing.',
  },
  {
    id: 'grounding-54321',
    title: 'Grounding: The 5-4-3-2-1 Method',
    category: 'When you are anxious',
    moods: ['anxious', 'numb'] as QuietRoomMood[],
    body: 'Name 5 things you can see, 4 things you can touch, 3 things you can hear, 2 things you can smell, and 1 thing you can taste. It gives your mind something real to hold.',
  },
  {
    id: 'control-columns',
    title: 'Separate What You Can and Cannot Control',
    category: 'When you are anxious',
    moods: ['anxious'] as QuietRoomMood[],
    body: 'Draw two quick columns. In one, write what you cannot control: scan timing, phone calls, pathology wording. In the other, write what you can do today: eat, shower, text a friend, ask one question, rest for ten minutes.',
  },
  {
    id: 'waiting-is-hard',
    title: 'When the Waiting Is the Hardest Part',
    category: 'When you are anxious',
    moods: ['anxious', 'sad'] as QuietRoomMood[],
    body: 'Waiting can feel like a full-body emergency. Pick a temporary anchor: a walk around the block, one short show, a shower, a puzzle, folding laundry, or texting someone who will not ask you to explain everything.',
  },
  {
    id: 'anticipatory-grief',
    title: "Grief Doesn't Wait for the End",
    category: 'When you are sad',
    moods: ['sad'] as QuietRoomMood[],
    body: 'It is normal to grieve while your loved one is still here and still fighting. Anticipatory grief does not mean giving up. It means your heart knows something big is happening.',
  },
  {
    id: 'bad-day',
    title: 'You Are Allowed to Have a Bad Day',
    category: 'When you are sad',
    moods: ['sad', 'numb'] as QuietRoomMood[],
    body: 'A bad day is not failure. If today is heavy, lower the bar. Drink water. Answer one message. Eat something with protein. Put one thing back in its place. That is enough.',
  },
  {
    id: 'not-invisible',
    title: 'You Are Not Invisible',
    category: 'When you feel alone',
    moods: ['numb', 'sad'] as QuietRoomMood[],
    body: 'Caregivers are often the ones holding everything together while feeling unseen. What you are carrying matters. You matter, even when nobody remembers to ask how you are doing.',
  },
  {
    id: 'finding-your-people',
    title: 'Finding Your People',
    category: 'When you feel alone',
    moods: ['numb', 'okay'] as QuietRoomMood[],
    body: 'Look for caregiver-specific support groups through your cancer center social worker, CancerCare, Family Caregiver Alliance, or disease-specific groups. You do not need a huge village. One or two people who understand is enough to start.',
  },
  {
    id: 'bill-of-rights',
    title: "The Caregiver's Bill of Rights",
    category: 'For everyone',
    moods: ['okay', 'grateful', 'strong', 'exhausted'] as QuietRoomMood[],
    body: 'You have the right to rest. The right to ask questions. The right to say "I need help." The right to laugh. The right to leave the room and breathe. The right to be both devoted and tired at the same time.',
  },
  {
    id: 'joy-is-not-betrayal',
    title: 'Small Moments of Joy Are Not Betrayal',
    category: 'For everyone',
    moods: ['grateful', 'strong', 'sad'] as QuietRoomMood[],
    body: 'A good meal, a joke, a quiet cup of coffee, or ten minutes of sunlight does not mean you are forgetting what is happening. It means your nervous system is finding a little oxygen.',
  },
];
