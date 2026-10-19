export const pt = {
  translation: {
    common: {
      cancel: "Cancelar",
      close: "Fechar",
      share: "Compartilhar",
      home: "Início",
      tapToClose: "Toque para fechar",
    },
    categories: {
      similarities: "Semelhanças",
      vocabulary: "Vocabulário",
      matrix: "Lógica numérica",
      comprehension: "Compreensão",
      patterns: "Raciocínio visual",
    },
    classifications: {
      veryHigh: "Muito superior",
      high: "Superior",
      aboveAverage: "Acima da média",
      average: "Média",
      belowAverage: "Média baixa",
      borderline: "Abaixo da média",
      veryLow: "Bem abaixo da média",
    },
    home: {
      title: "Teste de QI",
      subtitle: "{{count}} questões de lógica, padrões visuais e vocabulário. Sem cadastro, sem cronômetro.",
      start: "Começar teste",
      measures: "O que o teste mede",
      stats: {
        last: "Último",
        best: "Melhor",
        taken: "Testes",
      },
      pitch: {
        free: "Grátis e completo — nada fica bloqueado",
        offline: "Funciona sem internet",
        categories: "Resultado detalhado por área de raciocínio",
      },
      resume: {
        title: "Teste em andamento",
        message: "Você deixou um teste pela metade. Quer continuar de onde parou?",
        continue: "Continuar",
        restart: "Começar de novo",
        button: "Continuar teste",
      },
    },
    test: {
      title: "Teste de QI",
      counter: "{{current}} de {{total}}",
      confirm: "Confirmar",
      finish: "Ver resultado",
      error: "Não foi possível carregar esta questão.",
    },
    results: {
      title: "Seu resultado",
      yourScore: "Sua pontuação",
      percentile: "Acima de {{percentile}}% das pessoas",
      curveCaption: "Distribuição estimada na população",
      accuracy: "Acertos",
      byCategory: "Desempenho por área",
      retake: "Refazer teste",
      shareMessage: "Fiz {{score}} no teste de QI — acima de {{percentile}}% das pessoas. Tenta bater!",
      missing: "Não encontramos este resultado.",
    },
    history: {
      title: "Histórico",
      average: "Média",
      best: "Melhor",
      count: "Testes",
      allTests: "Todos os testes",
      itemDetail: "{{correct}}/{{total}} acertos · percentil {{percentile}}",
      empty: {
        title: "Nada por aqui ainda",
        message: "Faça seu primeiro teste para começar a acompanhar sua evolução.",
      },
    },
    settings: {
      title: "Ajustes",
      section: {
        test: "Teste",
        appearance: "Aparência",
        language: "Idioma",
        about: "Sobre",
      },
      age: {
        label: "Idade",
        value: "{{age}} anos",
        unset: "Não informada",
        hint: "Usada para ajustar levemente o cálculo. Fica só no seu aparelho.",
      },
      theme: {
        system: "Sistema",
        light: "Claro",
        dark: "Escuro",
      },
      rate: "Avaliar na Play Store",
      privacyOptions: "Opções de privacidade dos anúncios",
      clear: {
        button: "Apagar histórico",
        title: "Apagar histórico",
        message: "Todos os resultados salvos serão removidos. Isso não pode ser desfeito.",
        confirm: "Apagar",
        done: "Histórico apagado.",
      },
      version: "Versão {{version}}",
    },
    about: {
      title: "Sobre o teste",
      intro: "Um teste de raciocínio inspirado em provas clássicas de inteligência, com questões de padrões visuais, lógica numérica, vocabulário e compreensão.",
      bullets: [
        "As questões são sorteadas a cada teste, então nenhuma rodada é igual.",
        "Sua pontuação é comparada a uma curva normal com média 100 e desvio 15.",
        "Nada é enviado para servidores — os resultados ficam no seu aparelho.",
      ],
      disclaimerTitle: "Isto é entretenimento",
      disclaimerFull: "Este app não é um instrumento psicométrico validado e não substitui uma avaliação profissional. Para um laudo real, procure um psicólogo.",
      disclaimerShort: "Apenas entretenimento — não é avaliação psicológica.",
      privacy: "Política de privacidade",
    },
    questions: {
      patterns: {
        prompt: "Qual figura completa a sequência?",
        zoom: "Ampliar",
        option: "Alternativa {{number}}",
      },
      items: {
        similarities: {
          q1: {
            question: "Em que são parecidos um cachorro e um leão?",
            options: ["Ambos são animais", "Ambos são grandes", "Ambos são domésticos", "Ambos são perigosos"],
          },
          q2: {
            question: "O que têm em comum água e gelo?",
            options: ["São feitos da mesma substância", "São frios", "São líquidos", "São transparentes"],
          },
          q3: {
            question: "Qual a semelhança entre um livro e um jornal?",
            options: ["Ambos contêm informações", "Ambos são feitos de papel", "Ambos têm capa", "Ambos são coloridos"],
          },
          q4: {
            question: "O que têm em comum uma bicicleta e um carro?",
            options: ["São meios de transporte", "Têm motor", "São da mesma cor", "São do mesmo tamanho"],
          },
          q5: {
            question: "Qual a semelhança entre o sol e uma lâmpada?",
            options: ["Ambos emitem luz", "Ambos são redondos", "Ambos são quentes", "Ambos são amarelos"],
          },
          q6: {
            question: "O que têm em comum a memória e um computador?",
            options: ["Ambos armazenam informações", "Ambos usam eletricidade", "Ambos são máquinas", "Ambos precisam de energia"],
          },
          q7: {
            question: "Qual a semelhança entre ansiedade e medo?",
            options: ["Ambos são emoções", "Ambos são ruins", "Ambos fazem mal", "Ambos são doenças"],
          },
          q8: {
            question: "O que têm em comum música e pintura?",
            options: ["São formas de expressão artística", "Usam instrumentos", "São barulhentas", "São coloridas"],
          },
          q9: {
            question: "Qual a semelhança entre sabedoria e experiência?",
            options: ["Ambas vêm com o tempo e aprendizado", "Ambas são inatas", "Ambas são teóricas", "Ambas são permanentes"],
          },
          q10: {
            question: "O que têm em comum liberdade e responsabilidade?",
            options: ["São interdependentes", "São opostas", "São abstratas", "São simples"],
          },
          q11: {
            question: "Qual a semelhança entre democracia e justiça?",
            options: ["Ambas visam o bem comum", "Ambas são sistemas", "Ambas são antigas", "Ambas são complexas"],
          },
          q12: {
            question: "O que têm em comum intuição e razão?",
            options: ["São formas de conhecimento", "São sentimentos", "São comportamentos", "São habilidades físicas"],
          },
          q13: {
            question: "O que uma árvore e uma flor têm em comum?",
            options: ["Ambas são plantas", "Ambas são grandes", "Ambas dão frutos", "Ambas são coloridas"],
          },
          q14: {
            question: "O que um avião e um pássaro têm em comum?",
            options: ["Ambos podem voar", "Ambos são seres vivos", "Ambos têm penas", "Ambos são rápidos"],
          },
          q15: {
            question: "O que um carro e uma moto têm em comum?",
            options: ["Ambos têm rodas", "Ambos voam", "Ambos têm asas", "Ambos são aquáticos"],
          },
          q16: {
            question: "O que um peixe e um tubarão têm em comum?",
            options: ["Ambos vivem na água", "Ambos têm pernas", "Ambos voam", "Ambos têm pelos"],
          },
          q17: {
            question: "O que uma lâmpada e o sol têm em comum?",
            options: ["Ambos emitem luz", "Ambos estão no céu", "Ambos são naturais", "Ambos são frios"],
          },
          q18: {
            question: "O que a lua e o sol têm em comum?",
            options: ["Ambos são fontes de luz", "Ambos são planetas", "Ambos são quentes", "Ambos são visíveis de noite"],
          },
          q19: {
            question: "O que uma guitarra e um piano têm em comum?",
            options: ["Ambos são instrumentos musicais", "Ambos são de cordas", "Ambos são eletrônicos", "Ambos são de madeira"],
          },
          q20: {
            question: "O que uma escola e uma biblioteca têm em comum?",
            options: ["Ambos são lugares de aprendizado", "Ambos têm computadores", "Ambos têm salas de aula", "Ambos são públicos"],
          },
        },
        vocabulary: {
          q1: {
            question: 'O que significa a palavra "resiliente"?',
            options: ["Que desiste facilmente", "Que se adapta e supera adversidades", "Que é frágil", "Que é impaciente"],
          },
          q2: {
            question: 'Qual o significado de "pragmático"?',
            options: ["Que age sem pensar", "Que é teórico", "Que é prático e objetivo", "Que é sonhador"],
          },
          q3: {
            question: 'O que significa a palavra "empático"?',
            options: ["Que é egoísta", "Que não se importa com outros", "Que compreende os sentimentos dos outros", "Que é antipático"],
          },
          q4: {
            question: 'Qual o significado de "perspicaz"?',
            options: ["Que é lento", "Que é distraído", "Que é desatento", "Que percebe as coisas rapidamente"],
          },
          q5: {
            question: 'O que significa a palavra "altruísta"?',
            options: ["Que é egoísta", "Que é orgulhoso", "Que se preocupa com o bem dos outros", "Que é individualista"],
          },
          q6: {
            question: 'Qual o significado de "paradoxal"?',
            options: ["Que é simples", "Que parece contraditório", "Que é óbvio", "Que é comum"],
          },
          q7: {
            question: 'O que significa a palavra "efêmero"?',
            options: ["Que é eterno", "Que é passageiro", "Que é importante", "Que é valioso"],
          },
          q8: {
            question: 'Qual o significado de "dicotomia"?',
            options: ["União de ideias", "Divisão em duas partes", "Mistura de conceitos", "Repetição de palavras"],
          },
          q9: {
            question: 'O que significa a palavra "ubíquo"?',
            options: ["Que é raro", "Que é único", "Que está presente em toda parte", "Que é escasso"],
          },
          q10: {
            question: 'Qual o significado de "paradigma"?',
            options: ["Contradição", "Modelo ou padrão", "Problema", "Solução"],
          },
          q11: {
            question: 'O que significa a palavra "axioma"?',
            options: ["Teoria complexa", "Verdade evidente por si mesma", "Problema difícil", "Conceito abstrato"],
          },
          q12: {
            question: 'Qual o significado de "idiossincrasia"?',
            options: ["Doença rara", "Pensamento comum", "Característica peculiar de um indivíduo", "Comportamento normal"],
          },
          q13: {
            question: "O que significa 'tenaz'?",
            options: ["Desiste facilmente", "Persistente e forte", "Indiferente", "Relutante"],
          },
          q14: {
            question: "O que significa 'meticuloso'?",
            options: ["Descuidado", "Atento aos detalhes", "Rápido", "Sem planejamento"],
          },
          q15: {
            question: "O que significa 'efêmero'?",
            options: ["Duradouro", "Passageiro", "Imutável", "Importante"],
          },
          q16: {
            question: "O que significa 'prolífico'?",
            options: ["Produz muito", "Lento", "Improdutivo", "Raro"],
          },
          q17: {
            question: "O que significa 'antagônico'?",
            options: ["Oposto", "Igual", "Amigável", "Neutro"],
          },
          q18: {
            question: 'O que significa "resignado"?',
            options: ["Aceitar sem lutar", "Ter energia", "Ser arrogante", "Ser inovador"],
          },
          q19: {
            question: 'O que significa "indócil"?',
            options: ["Difícil de domesticar", "Facilmente treinável", "Comportamento amigável", "Rápido em aprender"],
          },
          q20: {
            question: 'O que significa "esotérico"?',
            options: ["Compreendido por poucos", "De fácil entendimento", "Comum para todos", "De grande importância"],
          },
        },
        matrix: {
          q1: {
            question: "Qual número completa a sequência: 2, 4, 8, 16, __?",
            options: ["24", "32", "30", "28"],
          },
          q2: {
            question: "Complete a sequência: 3, 6, 12, 24, __",
            options: ["30", "36", "42", "48"],
          },
          q3: {
            question: "Complete a sequência: 1, 3, 6, 10, __",
            options: ["13", "15", "16", "18"],
          },
          q4: {
            question: "Qual número completa o padrão: 7, 14, 28, 56, __?",
            options: ["96", "102", "112", "98"],
          },
          q5: {
            question: "Complete a sequência: 2, 6, 12, 20, __",
            options: ["26", "28", "30", "32"],
          },
          q6: {
            question: "Qual número completa o padrão: 1, 4, 9, 16, __?",
            options: ["20", "23", "25", "21"],
          },
          q7: {
            question: "Complete a sequência: 5, 10, 20, 35, __",
            options: ["45", "50", "55", "60"],
          },
          q8: {
            question: "Se A = 1, B = 3, C = 6, então D = __?",
            options: ["8", "9", "10", "12"],
          },
          q9: {
            question: "Se 3² = 9, 4² = 16, então 5² = __?",
            options: ["20", "21", "23", "25"],
          },
          q10: {
            question: "Complete: 13, 21, 34, 55, __",
            options: ["76", "84", "89", "91"],
          },
          q11: {
            question: "Se 2³ = 8, 3³ = 27, então 4³ = __?",
            options: ["54", "64", "72", "81"],
          },
          q12: {
            question: "Complete a sequência: 8, 11, 15, 20, 26, __",
            options: ["31", "32", "33", "35"],
          },
          q13: {
            question: "Complete a sequência: 10, 15, 21, 28, __?",
            options: ["36", "40", "45", "33"],
          },
          q14: {
            question: "Qual número completa o padrão: 2, 3, 5, 8, __?",
            options: ["10", "12", "13", "15"],
          },
          q15: {
            question: "Complete a sequência: 3, 6, 9, 12, __?",
            options: ["15", "18", "21", "24"],
          },
          q16: {
            question: "Qual número completa o padrão: 1, 1, 2, 3, 5, __?",
            options: ["8", "7", "9", "6"],
          },
          q17: {
            question: "Complete a sequência: 2, 4, 8, 16, __?",
            options: ["32", "20", "24", "40"],
          },
          q18: {
            question: "Complete a sequência: 1, 2, 3, 4, __",
            options: ["5", "6", "7", "8"],
          },
          q19: {
            question: "Complete a sequência: 9, 12, 15, 18, __",
            options: ["21", "20", "19", "22"],
          },
          q20: {
            question: "Qual número completa a sequência: 2, 5, 8, 11, __?",
            options: ["14", "12", "13", "15"],
          },
        },
        comprehension: {
          q1: {
            question: "Por que é importante lavar as mãos antes de comer?",
            options: ["Para evitar doenças", "Para deixar as mãos limpas", "Porque é uma regra", "Para não sujar a comida"],
          },
          q2: {
            question: "Por que devemos economizar água?",
            options: ["Para pagar menos", "Para preservar um recurso essencial", "Porque todos fazem isso", "Para agradar os outros"],
          },
          q3: {
            question: "Por que é importante estudar?",
            options: ["Para adquirir conhecimento e se desenvolver", "Para agradar os pais", "Para passar o tempo", "Porque é obrigatório"],
          },
          q4: {
            question: "Por que devemos respeitar as leis?",
            options: ["Para manter a ordem e segurança na sociedade", "Para não ser punido", "Porque todo mundo respeita", "Para agradar as autoridades"],
          },
          q5: {
            question: "Por que é importante fazer exercícios físicos?",
            options: ["Para manter a saúde física e mental", "Para ficar bonito", "Porque o médico manda", "Para emagrecer apenas"],
          },
          q6: {
            question: "Por que devemos preservar o meio ambiente?",
            options: ["Porque é lei", "Para garantir a sobrevivência das futuras gerações", "Para economizar dinheiro", "Porque todo mundo faz"],
          },
          q7: {
            question: "Por que é importante dormir bem?",
            options: ["Para restaurar o corpo e a mente", "Para não ter sono durante o dia", "Porque é costume", "Para não acordar tarde"],
          },
          q8: {
            question: "Por que devemos respeitar as diferenças entre as pessoas?",
            options: ["Para promover uma sociedade mais justa e harmoniosa", "Para evitar conflitos", "Porque é lei", "Para ser bem visto"],
          },
          q9: {
            question: "Por que é importante desenvolver pensamento crítico?",
            options: ["Para analisar informações e tomar decisões fundamentadas", "Para criticar os outros", "Para parecer inteligente", "Para ganhar discussões"],
          },
          q10: {
            question: "Por que a diversidade cultural é importante?",
            options: ["Apenas para turismo", "Para enriquecer a experiência humana e promover inovação", "Para ter diferentes comidas", "Para aprender línguas"],
          },
          q11: {
            question: "Por que é importante desenvolver empatia?",
            options: ["Para compreender e se conectar melhor com os outros", "Para conseguir o que queremos", "Para parecer uma boa pessoa", "Para evitar problemas"],
          },
          q12: {
            question: "Por que a educação é fundamental para a sociedade?",
            options: ["Apenas para conseguir emprego", "Para o desenvolvimento humano e social", "Para ganhar dinheiro", "Para ter status"],
          },
          q13: {
            question: "Por que devemos reciclar o lixo?",
            options: ["Para reduzir a poluição", "Para economizar dinheiro", "Porque é fácil", "Para evitar multas"],
          },
          q14: {
            question: "Por que o sono é importante?",
            options: ["Para recuperar energia e saúde", "Para evitar o tédio", "Porque é um hábito", "Para passar o tempo"],
          },
          q15: {
            question: "Por que é importante economizar água?",
            options: ["Para preservar recursos naturais", "Porque é caro", "Para evitar multas", "Porque é difícil obtê-la"],
          },
          q16: {
            question: "Por que devemos praticar exercícios físicos?",
            options: ["Para manter a saúde", "Para competir", "Para parecer mais alto", "Porque é obrigatório"],
          },
          q17: {
            question: "Por que os insetos são importantes para o meio ambiente?",
            options: ["Porque polinizam plantas", "Porque controlam o clima", "Porque são inofensivos", "Porque são coloridos"],
          },
          q18: {
            question: "Por que as plantas precisam de luz solar?",
            options: ["Para produzir alimentos", "Para crescer", "Porque é uma regra", "Para ser bonitas"],
          },
          q19: {
            question: "Por que devemos separar o lixo reciclável?",
            options: ["Para preservar o meio ambiente", "Para facilitar o transporte", "Porque é obrigatório", "Para evitar problemas com a cidade"],
          },
          q20: {
            question: "Por que é importante respeitar as diferenças entre as pessoas?",
            options: ["Para promover a convivência pacífica", "Para agradar a todos", "Porque é uma regra", "Para evitar discussões"],
          },
        },
      },
    },
    notFound: {
      title: "Página não encontrada",
      message: "Esta tela não existe.",
    },
  },
};
