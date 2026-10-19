export const en = {
  translation: {
    common: {
      cancel: "Cancel",
      close: "Close",
      share: "Share",
      home: "Home",
      tapToClose: "Tap to close",
    },
    categories: {
      similarities: "Similarities",
      vocabulary: "Vocabulary",
      matrix: "Number logic",
      comprehension: "Comprehension",
      patterns: "Visual reasoning",
    },
    classifications: {
      veryHigh: "Very superior",
      high: "Superior",
      aboveAverage: "Above average",
      average: "Average",
      belowAverage: "Low average",
      borderline: "Below average",
      veryLow: "Well below average",
    },
    home: {
      title: "IQ Test",
      subtitle: "{{count}} questions on logic, visual patterns and vocabulary. No sign-up, no timer.",
      start: "Start test",
      measures: "What the test measures",
      stats: {
        last: "Last",
        best: "Best",
        taken: "Tests",
      },
      pitch: {
        free: "Free and complete — nothing is locked",
        offline: "Works without internet",
        categories: "Detailed results by reasoning area",
      },
      resume: {
        title: "Test in progress",
        message: "You left a test halfway through. Want to pick up where you stopped?",
        continue: "Continue",
        restart: "Start over",
        button: "Continue test",
      },
    },
    test: {
      title: "IQ Test",
      counter: "{{current}} of {{total}}",
      confirm: "Confirm",
      finish: "See result",
      error: "We couldn't load this question.",
    },
    results: {
      title: "Your result",
      overline: "Your estimated IQ",
      betterThan: "You did better than {{percentile}}% of people",
      strongest: "Your strength: {{area}} ({{correct}} of {{total}})",
      strip: {
        correct: "{{correct}}/{{total}} correct",
        minutes: "{{count}} min",
        seconds: "{{count}} s",
        areas: "{{count}} areas",
      },
      whereYouAre: "Where you stand",
      you: "You · {{score}}",
      populationMean: "Population average: 100",
      share: "Share result",
      retake: "Retake with new questions",
      profile: "Your profile",
      strength: "Strength",
      skipReveal: "Skip the animation",
      shareMessage: "I scored {{score}} on the IQ test — above {{percentile}}% of people. Try to beat it!",
      missing: "We couldn't find this result.",
    },
    history: {
      title: "History",
      average: "Average",
      best: "Best",
      count: "Tests",
      allTests: "All tests",
      itemDetail: "{{correct}}/{{total}} correct · {{percentile}}th percentile",
      empty: {
        title: "Nothing here yet",
        message: "Take your first test to start tracking your progress.",
      },
    },
    settings: {
      title: "Settings",
      section: {
        test: "Test",
        appearance: "Appearance",
        language: "Language",
        about: "About",
      },
      age: {
        label: "Age",
        value: "{{age}} years old",
        unset: "Not set",
        hint: "Used for a slight adjustment to the score. Stays on your device.",
      },
      theme: {
        system: "System",
        light: "Light",
        dark: "Dark",
      },
      rate: "Rate on the Play Store",
      privacyOptions: "Ad privacy options",
      clear: {
        button: "Clear history",
        title: "Clear history",
        message: "All saved results will be removed. This cannot be undone.",
        confirm: "Clear",
        done: "History cleared.",
      },
      version: "Version {{version}}",
    },
    about: {
      title: "About the test",
      intro: "A reasoning test inspired by classic intelligence assessments, covering visual patterns, number logic, vocabulary and comprehension.",
      bullets: [
        "Questions are drawn at random each time, so no two runs are alike.",
        "Your score is mapped onto a normal curve with mean 100 and standard deviation 15.",
        "Nothing is sent to a server — results stay on your device.",
      ],
      disclaimerTitle: "This is entertainment",
      disclaimerFull: "This app is not a validated psychometric instrument and does not replace a professional assessment. For a real evaluation, consult a psychologist.",
      disclaimerShort: "For entertainment only — not a psychological assessment.",
      privacy: "Privacy policy",
    },
    questions: {
      patterns: {
        prompt: "Complete the sequence",
        zoom: "Zoom",
        option: "Option {{number}}",
      },
      items: {
        similarities: {
          q1: {
            question: "How are a dog and a lion alike?",
            options: ["Both are animals", "Both are large", "Both are domestic", "Both are dangerous"],
          },
          q2: {
            question: "What do water and ice have in common?",
            options: ["Made of the same substance", "Both are cold", "Both are liquid", "Both are transparent"],
          },
          q3: {
            question: "What do a book and a newspaper have in common?",
            options: ["Both contain information", "Both are made of paper", "Both have covers", "Both are colorful"],
          },
          q4: {
            question: "What do a bicycle and a car have in common?",
            options: ["They are means of transportation", "They have engines", "They are the same color", "They are the same size"],
          },
          q5: {
            question: "What do the sun and a lamp have in common?",
            options: ["Both emit light", "Both are round", "Both are hot", "Both are yellow"],
          },
          q6: {
            question: "What do memory and a computer have in common?",
            options: ["Both store information", "Both use electricity", "Both are machines", "Both need energy"],
          },
          q7: {
            question: "What do anxiety and fear have in common?",
            options: ["Both are emotions", "Both are bad", "Both are harmful", "Both are diseases"],
          },
          q8: {
            question: "What do music and painting have in common?",
            options: ["They are forms of artistic expression", "They use instruments", "They are noisy", "They are colorful"],
          },
          q9: {
            question: "What do wisdom and experience have in common?",
            options: ["Both come with time and learning", "Both are innate", "Both are theoretical", "Both are permanent"],
          },
          q10: {
            question: "What do freedom and responsibility have in common?",
            options: ["They are interdependent", "They are opposites", "They are abstract", "They are simple"],
          },
          q11: {
            question: "What do democracy and justice have in common?",
            options: ["Both aim for common good", "Both are systems", "Both are ancient", "Both are complex"],
          },
          q12: {
            question: "What do intuition and reason have in common?",
            options: ["They are forms of knowledge", "They are feelings", "They are behaviors", "They are physical abilities"],
          },
          q13: {
            question: "What do a tree and a flower have in common?",
            options: ["Both are plants", "Both are large", "Both bear fruit", "Both are colorful"],
          },
          q14: {
            question: "What do a plane and a bird have in common?",
            options: ["Both can fly", "Both are living beings", "Both have feathers", "Both are fast"],
          },
          q15: {
            question: "What do a car and a motorcycle have in common?",
            options: ["Both have wheels", "Both fly", "Both have wings", "Both are aquatic"],
          },
          q16: {
            question: "What do a fish and a shark have in common?",
            options: ["Both live in water", "Both have legs", "Both fly", "Both have fur"],
          },
          q17: {
            question: "What do a lamp and the sun have in common?",
            options: ["Both emit light", "Both are in the sky", "Both are natural", "Both are cold"],
          },
          q18: {
            question: "What do a tree and a bush have in common?",
            options: ["Both are plants", "Both grow flowers", "Both are green", "Both have fruits"],
          },
          q19: {
            question: "What do a chair and a sofa have in common?",
            options: ["Both are furniture", "Both are soft", "Both are used for sitting", "Both are used for sleeping"],
          },
          q20: {
            question: "What do a laptop and a smartphone have in common?",
            options: ["Both are electronic devices", "Both are used for gaming", "Both have screens", "Both have keyboards"],
          },
        },
        vocabulary: {
          q1: {
            question: 'What does "resilient" mean?',
            options: ["Gives up easily", "Adapts and overcomes adversity", "Is fragile", "Is impatient"],
          },
          q2: {
            question: 'What does "pragmatic" mean?',
            options: ["Acts without thinking", "Is theoretical", "Is practical and objective", "Is dreamy"],
          },
          q3: {
            question: 'What does "empathetic" mean?',
            options: ["Being selfish", "Not caring about others", "Understanding others' feelings", "Being unfriendly"],
          },
          q4: {
            question: 'What does "perceptive" mean?',
            options: ["Being slow", "Being distracted", "Being inattentive", "Quickly noticing things"],
          },
          q5: {
            question: 'What does "altruistic" mean?',
            options: ["Being selfish", "Being proud", "Being concerned with others' welfare", "Being individualistic"],
          },
          q6: {
            question: 'What does "paradoxical" mean?',
            options: ["Being simple", "Seeming contradictory", "Being obvious", "Being common"],
          },
          q7: {
            question: 'What does "ephemeral" mean?',
            options: ["That is eternal", "That is temporary", "That is important", "That is valuable"],
          },
          q8: {
            question: 'What does "dichotomy" mean?',
            options: ["Union of ideas", "Division into two parts", "Mixture of concepts", "Repetition of words"],
          },
          q9: {
            question: 'What does "ubiquitous" mean?',
            options: ["That is rare", "That is unique", "That is present everywhere", "That is scarce"],
          },
          q10: {
            question: 'What does "paradigm" mean?',
            options: ["Contradiction", "Model or pattern", "Problem", "Solution"],
          },
          q11: {
            question: 'What does "axiom" mean?',
            options: ["Complex theory", "Self-evident truth", "Difficult problem", "Abstract concept"],
          },
          q12: {
            question: 'What does "idiosyncrasy" mean?',
            options: ["Rare disease", "Common thought", "Peculiar characteristic of an individual", "Normal behavior"],
          },
          q13: {
            question: "What does 'tenacious' mean?",
            options: ["Easily gives up", "Strongly persistent", "Indifferent", "Reluctant"],
          },
          q14: {
            question: "What does 'meticulous' mean?",
            options: ["Careless", "Attentive to details", "Quick", "Unplanned"],
          },
          q15: {
            question: "What does 'ephemeral' mean?",
            options: ["Durable", "Temporary", "Unchanging", "Important"],
          },
          q16: {
            question: "What does 'prolific' mean?",
            options: ["Produces a lot", "Slow", "Unproductive", "Rare"],
          },
          q17: {
            question: "What does 'antagonistic' mean?",
            options: ["Opposite", "Equal", "Friendly", "Neutral"],
          },
          q18: {
            question: 'What does "cogent" mean?',
            options: ["Weak", "Convincing", "Uncertain", "False"],
          },
          q19: {
            question: 'What does "lucid" mean?',
            options: ["Clear", "Obscure", "Complicated", "Unclear"],
          },
          q20: {
            question: 'What does "nefarious" mean?',
            options: ["Evil", "Good", "Noble", "Brave"],
          },
        },
        matrix: {
          q1: {
            question: "What number completes the sequence: 2, 4, 8, 16, __?",
            options: ["24", "32", "30", "28"],
          },
          q2: {
            question: "Complete the sequence: 3, 6, 12, 24, __",
            options: ["30", "36", "42", "48"],
          },
          q3: {
            question: "Complete the sequence: 1, 3, 6, 10, __",
            options: ["13", "15", "16", "18"],
          },
          q4: {
            question: "What number completes the pattern: 7, 14, 28, 56, __?",
            options: ["96", "102", "112", "98"],
          },
          q5: {
            question: "Complete the sequence: 2, 6, 12, 20, __",
            options: ["26", "28", "30", "32"],
          },
          q6: {
            question: "What number completes the pattern: 1, 4, 9, 16, __?",
            options: ["20", "23", "25", "21"],
          },
          q7: {
            question: "Complete the sequence: 5, 10, 20, 35, __",
            options: ["45", "50", "55", "60"],
          },
          q8: {
            question: "If A = 1, B = 3, C = 6, then D = __?",
            options: ["8", "9", "10", "12"],
          },
          q9: {
            question: "If 3² = 9, 4² = 16, then 5² = __?",
            options: ["20", "21", "23", "25"],
          },
          q10: {
            question: "Complete: 13, 21, 34, 55, __",
            options: ["76", "84", "89", "91"],
          },
          q11: {
            question: "If 2³ = 8, 3³ = 27, then 4³ = __?",
            options: ["54", "64", "72", "81"],
          },
          q12: {
            question: "Complete the sequence: 8, 11, 15, 20, 26, __",
            options: ["31", "32", "33", "35"],
          },
          q13: {
            question: "Complete the sequence: 10, 15, 21, 28, __?",
            options: ["36", "40", "45", "33"],
          },
          q14: {
            question: "What number completes the pattern: 2, 3, 5, 8, __?",
            options: ["10", "12", "13", "15"],
          },
          q15: {
            question: "What number completes the pattern: 1, 2, 4, 8, __?",
            options: ["12", "14", "16", "18"],
          },
          q16: {
            question: "What number completes the pattern: 1, 3, 6, 10, __?",
            options: ["13", "15", "16", "18"],
          },
          q17: {
            question: "What number completes the pattern: 1, 4, 9, 16, __?",
            options: ["20", "23", "25", "21"],
          },
          q18: {
            question: "What number completes the sequence: 1, 5, 9, 13, __?",
            options: ["17", "18", "19", "21"],
          },
          q19: {
            question: "Complete the sequence: 6, 12, 18, 24, __",
            options: ["30", "32", "36", "40"],
          },
          q20: {
            question: "What number completes the pattern: 2, 5, 10, 17, __?",
            options: ["26", "28", "30", "35"],
          },
        },
        comprehension: {
          q1: {
            question: "Why is it important to wash hands before eating?",
            options: ["To prevent diseases", "To keep hands clean", "Because it is a rule", "To not dirty the food"],
          },
          q2: {
            question: "Why should we save water?",
            options: ["To pay less", "To preserve an essential resource", "Because everyone does it", "To please others"],
          },
          q3: {
            question: "Why is it important to study?",
            options: ["To gain knowledge and develop", "To please parents", "To pass time", "Because it's mandatory"],
          },
          q4: {
            question: "Why should we respect laws?",
            options: ["To maintain order and safety in society", "To avoid punishment", "Because everyone does", "To please authorities"],
          },
          q5: {
            question: "Why is it important to exercise?",
            options: ["To maintain physical and mental health", "To look good", "Because the doctor says so", "Just to lose weight"],
          },
          q6: {
            question: "Why should we preserve the environment?",
            options: ["Because it's the law", "To ensure the survival of future generations", "To save money", "Because everyone does"],
          },
          q7: {
            question: "Why is it important to sleep well?",
            options: ["To restore body and mind", "To not feel sleepy during the day", "Because it's customary", "To not wake up late"],
          },
          q8: {
            question: "Why should we respect differences between people?",
            options: ["To promote a more just and harmonious society", "To avoid conflicts", "Because it's the law", "To be well regarded"],
          },
          q9: {
            question: "Why is it important to develop critical thinking?",
            options: ["To analyze information and make informed decisions", "To criticize others", "To appear intelligent", "To win arguments"],
          },
          q10: {
            question: "Why is cultural diversity important?",
            options: ["Just for tourism", "To enrich human experience and promote innovation", "To have different foods", "To learn languages"],
          },
          q11: {
            question: "Why is it important to develop empathy?",
            options: ["To better understand and connect with others", "To get what we want", "To appear as a good person", "To avoid problems"],
          },
          q12: {
            question: "Why is education fundamental to society?",
            options: ["Just to get a job", "For human and social development", "To make money", "To gain status"],
          },
          q13: {
            question: "Why should we recycle waste?",
            options: ["To reduce pollution", "To save money", "Because it is easy", "To avoid fines"],
          },
          q14: {
            question: "Why is sleep important?",
            options: ["To restore energy and health", "To avoid boredom", "Because it is a habit", "To pass time"],
          },
          q15: {
            question: "Why is it important to save water?",
            options: ["To preserve natural resources", "Because it is expensive", "To avoid fines", "Because it is hard to obtain"],
          },
          q16: {
            question: "Why should we exercise?",
            options: ["To maintain health", "To compete", "To appear taller", "Because it is mandatory"],
          },
          q17: {
            question: "Why are insects important for the environment?",
            options: ["Because they pollinate plants", "Because they control the weather", "Because they are harmless", "Because they are colorful"],
          },
          q18: {
            question: "Why do plants need sunlight?",
            options: ["For photosynthesis", "For growth", "For reproduction", "For water absorption"],
          },
          q19: {
            question: "Why is exercise important?",
            options: ["To stay healthy", "To waste time", "To avoid work", "To socialize"],
          },
          q20: {
            question: "Why is it important to read books?",
            options: ["To gain knowledge", "To escape reality", "To pass time", "To avoid boredom"],
          },
        },
      },
    },
    notFound: {
      title: "Page not found",
      message: "This screen doesn't exist.",
    },
  },
};
