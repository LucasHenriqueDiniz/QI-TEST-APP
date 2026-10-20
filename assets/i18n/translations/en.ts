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
      counter: "{{current}}/{{total}}",
      counterA11y: "Question {{current}} of {{total}}",
      remaining: "{{count}} left",
      remainingOne: "1 left",
      lastQuestion: "last one",
      confirm: "Confirm",
      finish: "See my result",
      error: "We couldn't load this question.",
      pause: {
        open: "Pause the test",
        title: "Pause the test?",
        message: "Your progress is saved.",
        resume: "Keep going",
        leave: "Leave and continue later",
      },
      milestones: {
        start: "Good start!",
        blockOne: "1 of {{total}} blocks done",
        block: "{{done}} of {{total}} blocks done",
        blockLast: "{{done}} of {{total}} — almost there",
      },
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
            options: ["Made of the same substance", "They are cold", "They are liquid", "They are gases"],
          },
          q3: {
            question: "What do a book and a newspaper have in common?",
            options: ["Both contain information", "Both come out every day", "Both are handwritten", "Both are colorful"],
          },
          q4: {
            question: "What do a bicycle and a car have in common?",
            options: ["They are means of transportation", "They have engines", "They are the same color", "They are the same size"],
          },
          q5: {
            question: "What do the sun and a lamp have in common?",
            options: ["Both emit light", "Both are round", "Both run on electricity", "Both are yellow"],
          },
          q6: {
            question: "What do human memory and a computer have in common?",
            options: ["Both store information", "Both are made of silicon", "Both are machines", "Both were invented by people"],
          },
          q7: {
            question: "What do anxiety and fear have in common?",
            options: ["Both are emotions", "Both are bad", "Both are harmful", "Both are diseases"],
          },
          q8: {
            question: "What do music and painting have in common?",
            options: ["They are forms of artistic expression", "They use paint", "They are noisy", "They are colorful"],
          },
          q9: {
            question: "What do wisdom and experience have in common?",
            options: ["Both come with time and learning", "Both are innate", "Both are theoretical", "Both are permanent"],
          },
          q10: {
            question: "What do freedom and responsibility have in common?",
            options: ["They are interdependent", "They are opposites", "They are synonyms", "They are simple"],
          },
          q11: {
            question: "What do democracy and justice have in common?",
            options: ["Both aim for the common good", "Both are physical objects", "Both are recent inventions", "Both are written laws"],
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
            question: "What do the moon and the sun have in common?",
            options: ["Both are celestial bodies", "Both are planets", "Both give off their own light", "Both appear only by day"],
          },
          q19: {
            question: "What do a guitar and a piano have in common?",
            options: ["Both are musical instruments", "Both are wind instruments", "Both have keys", "Both are played with a bow"],
          },
          q20: {
            question: "What do a school and a library have in common?",
            options: ["Both are places of learning", "Both sell books", "Both have classrooms", "Both charge admission"],
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
            question: 'What does "resigned" mean?',
            options: ["Accepting without a fight", "Having energy", "Being arrogant", "Being innovative"],
          },
          q19: {
            question: 'What does "indocile" mean?',
            options: ["Hard to tame", "Easily trained", "Friendly in behavior", "Quick to learn"],
          },
          q20: {
            question: 'What does "esoteric" mean?',
            options: ["Understood by few", "Easy to understand", "Common to everyone", "Of great importance"],
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
            question: "If the 1st term is 1, the 2nd is 3 and the 3rd is 6, what is the 4th?",
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
            options: ["10", "11", "13", "15"],
          },
          q15: {
            question: "Complete the sequence: 3, 6, 9, 12, __",
            options: ["15", "18", "21", "24"],
          },
          q16: {
            question: "What number completes the pattern: 1, 1, 2, 3, 5, __?",
            options: ["8", "7", "9", "6"],
          },
          q17: {
            question: "Complete the sequence: 2, 4, 8, 16, __",
            options: ["32", "20", "24", "40"],
          },
          q18: {
            question: "Complete the sequence: 1, 2, 3, 4, __",
            options: ["5", "6", "7", "8"],
          },
          q19: {
            question: "Complete the sequence: 9, 12, 15, 18, __",
            options: ["21", "20", "19", "22"],
          },
          q20: {
            question: "What number completes the sequence: 2, 5, 8, 11, __?",
            options: ["14", "12", "13", "15"],
          },
        },
        comprehension: {
          q1: {
            question: "Why is it important to wash hands before eating?",
            options: ["So germs on the hands don't reach the mouth", "To show respect for whoever prepared the meal", "To get the smell of spices off the hands", "To keep the skin of the hands soft and nice"],
          },
          q2: {
            question: "Why should we save water?",
            options: ["Because water sitting in the pipes goes bad", "Because water fit for drinking is a limited resource", "So that water comes out of the tap with more pressure", "Because the water we use never returns to nature"],
          },
          q3: {
            question: "Why is it important to study?",
            options: ["To learn and expand what we are able to do", "So that schools don't run out of students", "To keep the mind busy and away from trouble", "To prove to others that we are capable"],
          },
          q4: {
            question: "Why should we respect laws?",
            options: ["So that life in society has order and safety", "Because laws always reflect what is fair", "Because those who wrote the laws know more than we do", "To preserve our country's legal tradition"],
          },
          q5: {
            question: "Why is it important to exercise?",
            options: ["To keep both the body and the mind healthy", "To be able to eat anything without gaining weight", "To tire the body out and fall asleep earlier", "To get the look that is in fashion"],
          },
          q6: {
            question: "Why should we preserve the environment?",
            options: ["So that cities stop growing and spreading out", "Because our lives, now and in the future, depend on it", "So that the country has a good image abroad", "So that the planet's climate goes back to how it used to be"],
          },
          q7: {
            question: "Why is it important to sleep well?",
            options: ["So that body and mind recover from fatigue", "To use less electricity during the night", "To dream and understand what the unconscious means", "So as not to disturb the people we live with"],
          },
          q8: {
            question: "Why should we respect differences between people?",
            options: ["Because no one is worth less for being different", "Because people who differ from us are usually right", "Because differences disappear once they are respected", "So that we are not accused of prejudice"],
          },
          q9: {
            question: "Why is it important to develop critical thinking?",
            options: ["To weigh information before accepting it", "To always hold an opinion different from the majority", "To memorize more content in less time", "To defend our opinions without having to change them"],
          },
          q10: {
            question: "Why is cultural diversity important?",
            options: ["Because it guarantees that traditions never change over time", "Because different cultures yield new ideas and solutions", "Because it makes selling products abroad easier", "Because people from different cultures never clash"],
          },
          q11: {
            question: "Why is it important to develop empathy?",
            options: ["To understand what others feel and treat them better", "To talk people into things more easily", "To carry other people's problems as if they were ours", "To be remembered as a kind and pleasant person"],
          },
          q12: {
            question: "Why is education fundamental to society?",
            options: ["Because it keeps children busy while their parents work", "Because it forms people who think and improve society", "Because without degrees firms wouldn't know whom to hire", "Because it moves the country up world rankings"],
          },
          q13: {
            question: "Why should we recycle waste?",
            options: ["So that less waste ends up in landfills and rivers", "So that the household trash stops smelling bad", "So that the city charges a lower waste collection fee", "To set an example of environmental awareness to neighbors"],
          },
          q14: {
            question: "Why is sleep important?",
            options: ["Because in sleep the body repairs and memory settles", "Because the night is too dark to get anything done", "So that the days don't seem to drag on so long", "Because humans spend about a third of their lives asleep"],
          },
          q15: {
            question: "Why is it important to save water?",
            options: ["So that water doesn't run out in dry periods", "Because the price of tap water goes up every year", "So that the sea level doesn't keep on rising", "So that the rains start falling regularly again"],
          },
          q16: {
            question: "Why should we exercise?",
            options: ["To strengthen the heart, muscles and bones", "To have a reason to leave the house on weekends", "So the doctor doesn't scold us at the next check-up", "To win medals and trophies in competitions"],
          },
          q17: {
            question: "Why are insects important for the environment?",
            options: ["Because they pollinate plants and are food for many animals", "Because they regulate the temperature and the rainfall", "Because they keep larger animals away from crops", "Because engineers and roboticists use them as design models"],
          },
          q18: {
            question: "Why do plants need sunlight?",
            options: ["Because they use light to make their own food", "To warm up and not freeze on cold nights", "To absorb the water they need through the leaves", "So that the flowers get brighter colors"],
          },
          q19: {
            question: "Why should we separate recyclable waste?",
            options: ["So that those materials can be reused", "So that the garbage truck comes by less often", "So that the trash bags are lighter", "So that the city knows how much each household consumes"],
          },
          q20: {
            question: "Why is it important to respect differences between people?",
            options: ["So that different people can live together in peace", "So that everyone ends up thinking the same way", "To seem like a modern, well-informed person", "Because disagreeing with someone is always bad manners"],
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
