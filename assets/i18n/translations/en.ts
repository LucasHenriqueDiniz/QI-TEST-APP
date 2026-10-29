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
      subtitle: "{{count}} questions on logic, visual patterns and vocabulary.",
      start: "Start test",
      resume: {
        title: "Test in progress",
        message: "You left a test halfway through. Want to pick up where you stopped?",
        continue: "Continue",
        restart: "Start over",
        button: "Continue test",
      },
      tagline: "Discover your IQ",
      newTest: "Take a new test",
      newQuestions: "New questions every round",
      howItWorks: "How it works",
      trust: {
        complete: "Full result, nothing locked",
        noSignup: "No sign-up",
        untimed: "No timer",
      },
      record: {
        overline: "Your record",
        summary: "Last: {{last}} · Tests taken: {{count}}",
      },
      progress: {
        label: "Test in progress — pick up where you left off",
        a11y: "{{done}} of {{total}} questions answered",
        restart: "Start over",
        confirm: {
          title: "Start the test over?",
          message: "The answers of the test in progress will be discarded.",
          confirm: "Start over",
          cancel: "Keep the test",
        },
      },
      modes: {
        count: "{{count}} questions",
        rapido: {
          label: "Quick",
          description: "A quick estimate, with the widest range.",
          a11y: "Quick, {{count}} questions",
        },
        normal: {
          label: "Normal",
          description: "A balance of time and precision. Includes an optional speed test.",
          a11y: "Normal, {{count}} questions",
        },
        detalhado: {
          label: "Detailed",
          description: "The narrowest range and the Verbal and Reasoning indices. Includes an optional speed test.",
          a11y: "Detailed, {{count}} questions",
        },
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
    speed: {
      overline: "Optional · 90 seconds",
      offer: {
        title: "Speed test",
        body: "Tell, as fast as you can, whether the two rows of symbols are the same or different. It is scored separately and does not change your IQ.",
        start: "Take the speed test",
      },
      ready: {
        title: "Now for real",
        body: "You have 90 seconds. Answer fast, but don't guess: each mistake takes away one correct answer.",
        start: "Start",
      },
      skip: "Skip",
      restarted: "The app left the screen during the countdown, so the block started over.",
      practice: "Practice {{current}} of {{total}}",
      timeLeft: "{{seconds}} s",
      question: "Are the rows the same?",
      same: "Same",
      different: "Different",
      right: "Right!",
      wrong: "Not that one",
    },
    share: {
      overline: "My estimated IQ",
      betterThan: "Better than {{percentile}}% of people",
      strength: "Strongest area: {{area}}",
      cta: "Take yours free on Google Play",
    },
    finishing: {
      title: "Test complete!",
      adNotice: "A quick ad and then we'll show your result.",
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
      band: "Likely range: {{lower}}–{{upper}}",
      indices: {
        title: "Indices",
        reasoning: "Reasoning",
        verbal: "Verbal",
        value: "range {{lower}}–{{upper}}",
      },
      speed: {
        title: "Speed (experimental)",
        counts: "{{correct}} right and {{wrong}} wrong in {{seconds}} s",
        note: "Not part of your IQ: there is no population reference for it yet.",
      },
      shareMessageBand: "I scored {{score}} on the IQ test (range {{lower}}–{{upper}}), above {{percentile}}% of people. Can you beat it?",
      missing: "We couldn't find this result.",
    },
    history: {
      title: "History",
      average: "Average",
      count: "Tests",
      allTests: "All tests",
      itemDetail: "{{correct}}/{{total}} right · better than {{percentile}}%",
      empty: {
        title: "No tests yet",
        message: "Take your first test to start tracking your progress.",
      },
      mean: "average",
      oneTest: "Take another test to see your progress.",
      averageTime: "Average time",
      rowA11y: "IQ {{score}}, {{date}}, {{detail}}",
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
      haptics: {
        label: "Vibration",
        hint: "A light tap when you pick and confirm answers.",
      },
      rate: "Rate on the Play Store",
      privacyOptions: "Ad privacy options",
      clear: {
        button: "Clear history",
        title: "Delete your history?",
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
      measures: "What the test measures",
      areas: {
        patterns: "Finding the rule of a matrix of figures.",
        matrix: "Working out the next number in a sequence.",
        similarities: "Saying what two things have in common.",
        vocabulary: "Knowing what a word means.",
        comprehension: "Explaining why we do certain things.",
      },
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
            options: ["Both are animals", "Both roar", "Both are domestic", "Both live in the savanna"],
          },
          q2: {
            question: "What do water and ice have in common?",
            options: ["They are made of the same substance", "They keep a fixed shape of their own", "They flow when they are poured", "They are compounds of carbon"],
          },
          q3: {
            question: "What do a book and a newspaper have in common?",
            options: ["Both contain information", "Both come out every day", "Both have a hard cover", "Both are written by hand"],
          },
          q4: {
            question: "What do a bicycle and a car have in common?",
            options: ["They are means of transport", "They need fuel to run", "They have four wheels", "They are powered by pedals"],
          },
          q5: {
            question: "What do the sun and a lamp have in common?",
            options: ["Both are sources of light", "Both are stars in the sky", "Both can be switched off", "Both run on electricity"],
          },
          q6: {
            question: "What do human memory and a computer have in common?",
            options: ["Both store information", "Both are made of silicon", "Both get tired after heavy use", "Both are sold in stores"],
          },
          q7: {
            question: "What do anxiety and fear have in common?",
            options: ["Both are emotional states", "Both are diseases", "Both are conscious choices", "Both are exclusive to humans"],
          },
          q8: {
            question: "What do music and painting have in common?",
            options: ["Both are forms of artistic expression", "Both need a canvas and brushes to exist", "Both are perceived through the ears", "Both rely on wind instruments"],
          },
          q9: {
            question: "What do wisdom and experience have in common?",
            options: ["Both are acquired over time", "Both are present from birth", "Both are learned only from books", "Both are used up when applied"],
          },
          q10: {
            question: "What do freedom and responsibility have in common?",
            options: ["They are interdependent", "One rules out the other", "They mean exactly the same thing", "They apply only to adults"],
          },
          q11: {
            question: "What do democracy and justice have in common?",
            options: ["Both aim for the common good", "Both have an owner", "Both arose in the twentieth century", "Both depend on a single ruler"],
          },
          q12: {
            question: "What do intuition and reason have in common?",
            options: ["They are forms of knowledge", "They are organs of the human body", "They follow explicit logical steps", "They work only during sleep"],
          },
          q13: {
            question: "What do praise and punishment have in common?",
            options: ["They are ways of influencing behavior", "They cause pain to whoever receives them", "Only parents and teachers can give them", "They make a person more confident"],
          },
          q14: {
            question: "What do an echo and a mirror have in common?",
            options: ["Both send back what reaches them", "Both are made of polished glass", "Both exist only near mountains", "Both produce their own light and sound"],
          },
          q15: {
            question: "What do a virus and a rumor have in common?",
            options: ["Both can spread from person to person", "Both can be seen by anyone with the naked eye", "Both are cured with antibiotics", "Both travel only over the internet"],
          },
          q16: {
            question: "What do a bridge and an interpreter have in common?",
            options: ["Both link two sides that would otherwise be apart", "Both are built of concrete, iron and steel", "Both speak more than one language", "Both charge a toll to everyone who goes across them"],
          },
          q17: {
            question: "What do a map and a compass have in common?",
            options: ["Both help you find your way", "Both show the names of streets", "Both have a needle that points north", "Both need batteries to work"],
          },
          q18: {
            question: "What do the moon and the sun have in common?",
            options: ["Both are celestial bodies", "Both are planets", "Both give off their own light", "Both orbit the Earth"],
          },
          q19: {
            question: "What do a guitar and a piano have in common?",
            options: ["Both are musical instruments", "Both are played by blowing", "Both have black and white keys", "Both are played with a bow"],
          },
          q20: {
            question: "What do a school and a library have in common?",
            options: ["Both are places of learning", "Both sell books to the public", "Both have teachers giving lessons", "Both charge an admission fee"],
          },
          q21: {
            question: "What do an apple and an orange have in common?",
            options: ["Both are the same color", "Both are fruits", "Both grow underground", "Both are bitter"],
          },
          q22: {
            question: "What do a hammer and a saw have in common?",
            options: ["Both cut wood", "Both have a blade", "Both are tools", "Both are made of plastic"],
          },
          q23: {
            question: "What do a shirt and a pair of pants have in common?",
            options: ["Both are items of clothing", "Both have pockets", "Both cover the legs", "Both are made of leather"],
          },
          q24: {
            question: "What do milk and juice have in common?",
            options: ["Both contain caffeine", "Both come from fruit", "Both are sweet", "Both are drinks"],
          },
          q25: {
            question: "What do a spoon and a fork have in common?",
            options: ["Both are used for cutting", "Both are eating utensils", "Both are sharp", "Both are made of wood"],
          },
          q26: {
            question: "What do Monday and Friday have in common?",
            options: ["Both are weekend days", "Both come right after Sunday", "Both are holidays", "Both are weekdays"],
          },
          q27: {
            question: "What do an eye and an ear have in common?",
            options: ["Both pick up sounds around us", "Both are bones of the skull", "Both are sense organs", "Both produce tears"],
          },
          q28: {
            question: "What do a clock and a calendar have in common?",
            options: ["Both show the twelve months of the year", "Both are used to keep track of time", "Both have hands that turn around a dial", "Both show the room temperature"],
          },
          q29: {
            question: "What do a seed and an egg have in common?",
            options: ["Both have a yolk and a white inside", "Both need to be buried in soil to sprout", "Both come from flowering plants", "Both give rise to a new living being"],
          },
          q30: {
            question: "What do a thermometer and a ruler have in common?",
            options: ["Both are measuring instruments", "Both are used to draw straight lines", "Both measure the weight of an object", "Both measure fever"],
          },
        },
        vocabulary: {
          q1: {
            question: 'What does "resilient" mean?',
            options: ["Resists any kind of change", "Bounces back from adversity", "Says little and watches a lot", "Avoids conflict at all costs"],
          },
          q2: {
            question: 'What does "pragmatic" mean?',
            options: ["Follows the rules to the letter", "Thinks long and hard before acting", "Acts in a practical, objective way", "Changes mood very easily"],
          },
          q3: {
            question: 'What does "empathetic" mean?',
            options: ["Agrees with everything they hear", "Manages their own time very well", "Understands what others are feeling", "Strikes up a chat with anyone easily"],
          },
          q4: {
            question: 'What does "perceptive" mean?',
            options: ["Speaks in a clear, direct way", "Memorizes anything with ease", "Worries too much about the future", "Notices things very quickly"],
          },
          q5: {
            question: 'What does "altruistic" mean?',
            options: ["Thinks only of their own interest", "Likes to always have company", "Concerned with the good of others", "Plans everything in advance"],
          },
          q6: {
            question: 'What does "paradoxical" mean?',
            options: ["Serves as a model to follow", "Seems to contradict itself", "Happens all of a sudden", "Was copied from another work"],
          },
          q7: {
            question: 'What does "ephemeral" mean?',
            options: ["Never comes to an end", "Lasts only a short time", "Comes back from time to time", "Costs a great deal of money"],
          },
          q8: {
            question: 'What does "dichotomy" mean?',
            options: ["Conversation between two people", "Division into two parts", "Repetition of words", "Mixture of concepts"],
          },
          q9: {
            question: 'What does "ubiquitous" mean?',
            options: ["Changes location frequently", "Has no definite shape", "Present everywhere at once", "Has existed for a very long time"],
          },
          q10: {
            question: 'What does "paradigm" mean?',
            options: ["Contradictory statement", "Model to be followed", "Opening speech", "Contagious disease"],
          },
          q11: {
            question: 'What does "axiom" mean?',
            options: ["Statement that still needs proof", "Truth that is evident by itself", "Highest point of a mountain", "Exaggerated figure of speech"],
          },
          q12: {
            question: 'What does "idiosyncrasy" mean?',
            options: ["Word that exists in only one language", "Set of rules for a game", "Peculiar trait of an individual", "Belief shared by a whole people"],
          },
          q13: {
            question: "What does 'tenacious' mean?",
            options: ["Gets irritated easily", "Persists until they succeed", "Makes friends easily", "Changes their mind all the time"],
          },
          q14: {
            question: "What does 'meticulous' mean?",
            options: ["Does everything any old way", "Takes care over every detail", "Finishes everything quickly", "Likes giving orders"],
          },
          q15: {
            question: "What does 'vehement' mean?",
            options: ["Gets angry over the smallest thing", "Expresses views with great force", "Always speaks calmly and slowly", "Is always in a hurry"],
          },
          q16: {
            question: "What does 'prolific' mean?",
            options: ["Produces a great deal", "Talks for a long time", "Lives far from the city", "Makes money easily"],
          },
          q17: {
            question: "What does 'antagonistic' mean?",
            options: ["Opposed to something else", "Is the main character", "Comes from ancient times", "Was made entirely by hand"],
          },
          q18: {
            question: 'What does "resigned" mean?',
            options: ["Accepts things without a fight", "Stays calm no matter what happens", "Was appointed to a position", "Writes with the left hand"],
          },
          q19: {
            question: 'What does "indocile" mean?',
            options: ["Cannot be tamed or controlled", "Was born and raised in another country", "Falls ill very frequently", "Cannot stand to be left alone at home"],
          },
          q20: {
            question: 'What does "esoteric" mean?',
            options: ["Understood by only a few", "Comes from a foreign country", "Frightens people", "Was written many centuries ago"],
          },
          q21: {
            question: 'What does "generous" mean?',
            options: ["Spending without a thought for tomorrow", "Giving and helping willingly", "Chatting and smiling with everyone", "Fond of receiving presents"],
          },
          q22: {
            question: 'What does "swift" mean?',
            options: ["Slow", "Heavy", "Fast", "Strong"],
          },
          q23: {
            question: 'What does "sincere" mean?',
            options: ["Trusting everyone", "Being well-mannered", "Talking more than listening", "Telling the truth"],
          },
          q24: {
            question: 'What does "enormous" mean?',
            options: ["Very large", "Very small", "Very light", "Very old"],
          },
          q25: {
            question: 'What does "brave" mean?',
            options: ["Fond of adventure and travel", "Facing danger", "Very loud", "Getting flustered easily"],
          },
          q26: {
            question: 'What does "fragile" mean?',
            options: ["Made of glass", "Weighing more than it looks", "Easily broken", "Very cheap"],
          },
          q27: {
            question: 'What does "rare" mean?',
            options: ["Famous", "Valuable", "Old", "Uncommon"],
          },
          q28: {
            question: 'What does "humble" mean?',
            options: ["Obeying without ever questioning", "Not seeing oneself as superior to others", "Too embarrassed to speak in front of other people", "Avoiding any kind of effort"],
          },
          q29: {
            question: 'What does "cautious" mean?',
            options: ["Afraid of almost everything", "Planning every detail in advance", "Acting carefully to avoid risks", "Delaying and putting off whatever possible"],
          },
          q30: {
            question: 'What does "naive" mean?',
            options: ["Kind to everyone", "Believing things too easily", "Solving any problem cleverly", "Treating others rudely"],
          },
          q31: {
            question: 'What does "skeptical" mean?',
            options: ["Doubting and demanding evidence", "Criticizing everything in sight", "Expecting the best and trusting the future", "Never changing one's mind"],
          },
          q32: {
            question: 'What does "ambiguous" mean?',
            options: ["Using words that are hard to understand", "Stating something that is not true", "Going on too long", "Open to more than one meaning"],
          },
          q33: {
            question: 'What does "obsolete" mean?',
            options: ["Modern", "Broken", "Outdated", "Costly"],
          },
          q34: {
            question: 'What does "concise" mean?',
            options: ["Easy to read", "Confusing and hard to follow", "Formal and full of ceremony", "Brief and to the point"],
          },
          q35: {
            question: 'What does "hostile" mean?',
            options: ["Friendly", "Aggressive", "Indifferent", "Shy"],
          },
          q36: {
            question: 'What does "arduous" mean?',
            options: ["Easy", "Time-consuming", "Difficult", "Dangerous"],
          },
          q37: {
            question: 'What does "serene" mean?',
            options: ["Peaceful", "Restless", "Sorrowful", "Noisy"],
          },
          q38: {
            question: 'What does "noxious" mean?',
            options: ["Harmful", "Noisy", "Bitter", "Useless"],
          },
        },
        matrix: {
          q1: {
            question: "What number completes the sequence: 1, 3, 6, 11, 18, 29, __?",
            options: ["40", "42", "39", "47"],
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
            question: "What number completes the pattern: 2, 6, 3, 9, 6, 18, __?",
            options: ["12", "9", "15", "21"],
          },
          q5: {
            question: "Complete the sequence: 2, 6, 12, 20, __",
            options: ["26", "28", "30", "32"],
          },
          q6: {
            question: "What number completes the pattern: 1, 4, 13, 40, __?",
            options: ["80", "120", "121", "160"],
          },
          q7: {
            question: "Complete the sequence: 5, 10, 20, 35, __",
            options: ["45", "50", "55", "60"],
          },
          q8: {
            question: "Complete the sequence: 1, 1, 2, 4, 7, 13, __",
            options: ["20", "22", "24", "26"],
          },
          q9: {
            question: "Complete the sequence: 1, 8, 27, 64, __",
            options: ["96", "100", "128", "125"],
          },
          q10: {
            question: "Complete: 13, 21, 34, 55, __",
            options: ["76", "84", "89", "91"],
          },
          q11: {
            question: "What number completes the sequence: 3, 4, 8, 17, 33, __?",
            options: ["49", "58", "66", "54"],
          },
          q12: {
            question: "Complete the sequence: 8, 11, 15, 20, 26, __",
            options: ["31", "32", "33", "35"],
          },
          q13: {
            question: "Complete the sequence: 1, 4, 16, 64, __",
            options: ["256", "128", "192", "320"],
          },
          q14: {
            question: "What number completes the pattern: 2, 5, 10, 17, 26, __?",
            options: ["35", "36", "37", "39"],
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
            question: "Complete the sequence: 4, 8, 12, 16, __",
            options: ["20", "24", "18", "32"],
          },
          q20: {
            question: "What number completes the sequence: 2, 5, 8, 11, __?",
            options: ["14", "12", "13", "15"],
          },
          q21: {
            question: "Complete the sequence: 30, 25, 20, 15, __",
            options: ["5", "10", "12", "14"],
          },
          q22: {
            question: "What number completes the sequence: 80, 40, 20, 10, __?",
            options: ["0", "2", "5", "8"],
          },
          q23: {
            question: "Complete the sequence: 1, 10, 100, 1000, __",
            options: ["1900", "2000", "11000", "10000"],
          },
          q24: {
            question: "What number completes the sequence: 1, 3, 5, 7, 9, __?",
            options: ["11", "10", "12", "13"],
          },
          q25: {
            question: "Complete the sequence: 2, 7, 2, 7, 2, __",
            options: ["2", "5", "7", "9"],
          },
          q26: {
            question: "What number completes the sequence: 1, 1, 2, 2, 3, 3, 4, __?",
            options: ["3", "4", "5", "6"],
          },
          q27: {
            question: "Complete the sequence: 7, 14, 21, 28, __",
            options: ["35", "30", "32", "42"],
          },
          q28: {
            question: "What number completes the sequence: 2, 6, 18, 54, __?",
            options: ["108", "144", "150", "162"],
          },
          q29: {
            question: "Complete the sequence: 3, 5, 10, 12, 24, __",
            options: ["26", "28", "36", "48"],
          },
          q30: {
            question: "What number completes the sequence: 2, 50, 4, 40, 6, 30, 8, __?",
            options: ["10", "20", "25", "28"],
          },
          q31: {
            question: "Complete the sequence: 50, 49, 47, 44, 40, __",
            options: ["30", "34", "35", "36"],
          },
          q32: {
            question: "What number completes the sequence: 1, 2, 6, 24, __?",
            options: ["48", "72", "96", "120"],
          },
          q33: {
            question: "Complete the sequence: 2, 3, 5, 7, 11, 13, __",
            options: ["14", "15", "16", "17"],
          },
          q34: {
            question: "What number completes the sequence: 1, 3, 7, 15, 31, __?",
            options: ["63", "62", "64", "47"],
          },
          q35: {
            question: "Complete the sequence: 5, 9, 8, 12, 11, 15, __",
            options: ["12", "13", "14", "16"],
          },
          q36: {
            question: "What number completes the sequence: 4, 9, 25, 49, 121, __?",
            options: ["144", "169", "196", "225"],
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
          q21: {
            question: "Why should we look both ways before crossing the street?",
            options: ["Because it is a rule", "To check whether a vehicle is coming", "To set an example for people nearby", "To choose the best spot to cross the street"],
          },
          q22: {
            question: "Why do we keep perishable food in the refrigerator?",
            options: ["To make it taste better", "So it takes up less space in the kitchen", "To keep it from spoiling quickly", "Because it is the custom in most homes"],
          },
          q23: {
            question: "Why is it useful to make a list before going grocery shopping?",
            options: ["So as not to forget what you need to buy", "To get a discount at checkout for bringing a list", "So that the store restocks the products that ran out", "So that the store delivers the groceries home"],
          },
          q24: {
            question: "Why do we wear a seat belt in the car?",
            options: ["To be able to drive at higher speeds", "Because the car does not start if the belt is unfastened", "Because the seat feels more comfortable", "To reduce injuries in case of an accident"],
          },
          q25: {
            question: "Why is it important to arrive on time for an appointment?",
            options: ["To look important", "To respect other people's time", "To be able to leave the appointment earlier", "Because the clock dictates what we do"],
          },
          q26: {
            question: "Why should we keep the receipt after buying something?",
            options: ["To keep it as a souvenir of the purchase", "Because the store requires every customer to keep it", "To be able to exchange the product if it is faulty", "To show friends what we bought"],
          },
          q27: {
            question: "Why should we read the instructions before assembling a piece of furniture?",
            options: ["To assemble it correctly and avoid mistakes", "To find out what wood the furniture is made of", "Because the manual comes inside the product box", "To find out how much the furniture cost in the store"],
          },
          q28: {
            question: "Why should we apologize when we make a mistake?",
            options: ["To end an unpleasant conversation quickly", "To shift the blame for what happened onto the other person", "To look well-mannered and be praised", "To take responsibility and preserve the relationship"],
          },
          q29: {
            question: "Why should promises be kept?",
            options: ["Because keeping promises makes people smarter", "Because trust between people depends on it", "Because it is what parents teach from an early age", "Because anyone who breaks a promise goes to jail"],
          },
          q30: {
            question: "Why does working as a team often achieve more than working alone?",
            options: ["Because it combines different skills and shares the effort", "Because in a group nobody really has to make an effort", "Because in a group everyone thinks exactly the same way", "Because in a group each person only does the part they like"],
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
