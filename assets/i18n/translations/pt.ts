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
      counter: "{{current}}/{{total}}",
      counterA11y: "Questão {{current}} de {{total}}",
      remaining: "faltam {{count}}",
      remainingOne: "falta 1",
      lastQuestion: "última",
      confirm: "Confirmar",
      finish: "Ver meu resultado",
      error: "Não foi possível carregar esta questão.",
      pause: {
        open: "Pausar o teste",
        title: "Pausar o teste?",
        message: "Seu progresso fica salvo.",
        resume: "Continuar o teste",
        leave: "Sair e continuar depois",
      },
      milestones: {
        start: "Bom começo!",
        blockOne: "1 de {{total}} blocos concluído",
        block: "{{done}} de {{total}} blocos concluídos",
        blockLast: "{{done}} de {{total}} — falta pouco",
      },
    },
    results: {
      title: "Seu resultado",
      overline: "Seu QI estimado",
      betterThan: "Você foi melhor que {{percentile}}% das pessoas",
      strongest: "Seu ponto forte: {{area}} ({{correct}} de {{total}})",
      strip: {
        correct: "{{correct}}/{{total}} acertos",
        minutes: "{{count}} min",
        seconds: "{{count}} s",
        areas: "{{count}} áreas",
      },
      whereYouAre: "Onde você está",
      you: "Você · {{score}}",
      populationMean: "Média da população: 100",
      share: "Compartilhar resultado",
      retake: "Refazer com novas questões",
      profile: "Seu perfil",
      strength: "Ponto forte",
      skipReveal: "Pular a animação",
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
        prompt: "Complete a sequência",
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
            options: ["São feitos da mesma substância", "São frios", "São líquidos", "São gasosos"],
          },
          q3: {
            question: "Qual a semelhança entre um livro e um jornal?",
            options: ["Ambos contêm informações", "Ambos saem todos os dias", "Ambos são escritos à mão", "Ambos são coloridos"],
          },
          q4: {
            question: "O que têm em comum uma bicicleta e um carro?",
            options: ["São meios de transporte", "Têm motor", "São da mesma cor", "São do mesmo tamanho"],
          },
          q5: {
            question: "Qual a semelhança entre o sol e uma lâmpada?",
            options: ["Ambos emitem luz", "Ambos são redondos", "Ambos funcionam com eletricidade", "Ambos são amarelos"],
          },
          q6: {
            question: "O que têm em comum a memória humana e um computador?",
            options: ["Ambos armazenam informações", "Ambos são feitos de silício", "Ambos são máquinas", "Ambos foram inventados pelo homem"],
          },
          q7: {
            question: "Qual a semelhança entre ansiedade e medo?",
            options: ["Ambos são emoções", "Ambos são ruins", "Ambos fazem mal", "Ambos são doenças"],
          },
          q8: {
            question: "O que têm em comum música e pintura?",
            options: ["São formas de expressão artística", "Usam tinta", "São barulhentas", "São coloridas"],
          },
          q9: {
            question: "Qual a semelhança entre sabedoria e experiência?",
            options: ["Ambas vêm com o tempo e aprendizado", "Ambas são inatas", "Ambas são teóricas", "Ambas são permanentes"],
          },
          q10: {
            question: "O que têm em comum liberdade e responsabilidade?",
            options: ["São interdependentes", "São opostas", "São sinônimas", "São simples"],
          },
          q11: {
            question: "Qual a semelhança entre democracia e justiça?",
            options: ["Ambas visam ao bem comum", "Ambas são objetos físicos", "Ambas são invenções recentes", "Ambas são leis escritas"],
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
            options: ["Ambos são corpos celestes", "Ambos são planetas", "Ambos emitem luz própria", "Ambos aparecem só de dia"],
          },
          q19: {
            question: "O que uma guitarra e um piano têm em comum?",
            options: ["Ambos são instrumentos musicais", "Ambos são de sopro", "Ambos têm teclas", "Ambos são tocados com arco"],
          },
          q20: {
            question: "O que uma escola e uma biblioteca têm em comum?",
            options: ["Ambas são lugares de aprendizado", "Ambas vendem livros", "Ambas têm salas de aula", "Ambas cobram ingresso"],
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
            question: "Se o 1º termo é 1, o 2º é 3 e o 3º é 6, qual é o 4º?",
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
            options: ["10", "11", "13", "15"],
          },
          q15: {
            question: "Complete a sequência: 3, 6, 9, 12, __",
            options: ["15", "18", "21", "24"],
          },
          q16: {
            question: "Qual número completa o padrão: 1, 1, 2, 3, 5, __?",
            options: ["8", "7", "9", "6"],
          },
          q17: {
            question: "Complete a sequência: 2, 4, 8, 16, __",
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
            options: ["Para não levar à boca os germes das mãos", "Para demonstrar respeito por quem preparou a comida", "Para tirar das mãos o cheiro de tempero", "Para manter a pele das mãos macia e bonita"],
          },
          q2: {
            question: "Por que devemos economizar água?",
            options: ["Porque a água parada nos canos se estraga", "Porque a água própria para consumo é limitada", "Para que a água das torneiras saia com mais pressão", "Porque a água que usamos nunca mais volta à natureza"],
          },
          q3: {
            question: "Por que é importante estudar?",
            options: ["Para aprender e ampliar nossas capacidades", "Para que as escolas não fiquem sem alunos", "Para manter a mente ocupada e longe de problemas", "Para provar aos outros que somos capazes"],
          },
          q4: {
            question: "Por que devemos respeitar as leis?",
            options: ["Para haver ordem e segurança na vida em sociedade", "Porque as leis sempre refletem o que é justo", "Porque quem escreveu as leis sabe mais do que nós", "Para preservar a tradição jurídica do nosso país"],
          },
          q5: {
            question: "Por que é importante fazer exercícios físicos?",
            options: ["Para manter o corpo e a mente saudáveis", "Para poder comer de tudo sem engordar", "Para cansar o corpo e dormir mais cedo à noite", "Para ficar com a aparência que a moda valoriza"],
          },
          q6: {
            question: "Por que devemos preservar o meio ambiente?",
            options: ["Para que as cidades parem de crescer e de se espalhar", "Porque dependemos dele para viver, hoje e no futuro", "Para que o país tenha uma boa imagem no exterior", "Para que o clima do planeta volte a ser como era antes"],
          },
          q7: {
            question: "Por que é importante dormir bem?",
            options: ["Para o corpo e a mente se recuperarem do cansaço", "Para gastar menos energia elétrica durante a noite", "Para sonhar e entender o que o inconsciente quer dizer", "Para não incomodar quem divide a casa conosco"],
          },
          q8: {
            question: "Por que devemos respeitar as diferenças entre as pessoas?",
            options: ["Porque ninguém vale menos por ser diferente de nós", "Porque quem é diferente de nós costuma ter razão", "Porque as diferenças desaparecem quando são respeitadas", "Para não sermos acusados de preconceito"],
          },
          q9: {
            question: "Por que é importante desenvolver pensamento crítico?",
            options: ["Para avaliar uma informação antes de aceitá-la", "Para ter sempre uma opinião diferente da maioria", "Para memorizar mais conteúdo em menos tempo", "Para defender nossas opiniões sem precisar mudá-las"],
          },
          q10: {
            question: "Por que a diversidade cultural é importante?",
            options: ["Porque garante que as tradições nunca mudem com o tempo", "Porque culturas diferentes geram ideias e soluções novas", "Porque facilita a venda de produtos em outros países", "Porque povos de culturas diferentes nunca entram em conflito"],
          },
          q11: {
            question: "Por que é importante desenvolver empatia?",
            options: ["Para entender o que o outro sente e tratá-lo melhor", "Para convencer as pessoas com mais facilidade", "Para carregar os problemas dos outros como se fossem nossos", "Para ser lembrado como alguém gentil e agradável"],
          },
          q12: {
            question: "Por que a educação é fundamental para a sociedade?",
            options: ["Porque ocupa as crianças enquanto os pais trabalham", "Porque forma pessoas que pensam e melhoram a sociedade", "Porque sem diplomas as empresas não saberiam quem contratar", "Porque assim o país sobe nos rankings internacionais"],
          },
          q13: {
            question: "Por que devemos reciclar o lixo?",
            options: ["Para que menos lixo vá parar nos aterros e nos rios", "Para que o lixo da casa pare de cheirar mal", "Para que a prefeitura cobre uma taxa de lixo menor", "Para dar o exemplo de consciência ambiental aos vizinhos"],
          },
          q14: {
            question: "Por que o sono é importante?",
            options: ["Porque o corpo se repara e a memória se fixa no sono", "Porque a noite é escura demais para fazer qualquer coisa", "Para que os dias não pareçam tão longos", "Porque passamos cerca de um terço da vida dormindo"],
          },
          q15: {
            question: "Por que é importante economizar água?",
            options: ["Para que não falte água nos períodos de seca", "Porque a água da torneira custa mais a cada ano", "Para que o nível do mar não continue subindo", "Para que as chuvas voltem a cair com regularidade"],
          },
          q16: {
            question: "Por que devemos praticar exercícios físicos?",
            options: ["Para fortalecer o coração, os músculos e os ossos", "Para ter um motivo para sair de casa no fim de semana", "Para que o médico não nos chame a atenção na consulta", "Para ganhar medalhas e troféus em competições"],
          },
          q17: {
            question: "Por que os insetos são importantes para o meio ambiente?",
            options: ["Porque polinizam plantas e são comida de muitos animais", "Porque regulam a temperatura e o regime de chuvas", "Porque afastam animais maiores das plantações", "Porque servem de modelo para a engenharia e para a robótica"],
          },
          q18: {
            question: "Por que as plantas precisam de luz solar?",
            options: ["Porque usam a luz para fabricar o próprio alimento", "Para se aquecerem e não congelarem nas noites frias", "Para absorverem pelas folhas a água de que precisam", "Para que as flores ganhem cores mais vivas"],
          },
          q19: {
            question: "Por que devemos separar o lixo reciclável?",
            options: ["Para que esses materiais possam ser reaproveitados", "Para que o caminhão de lixo passe com menos frequência", "Para que as sacolas de lixo fiquem mais leves", "Para que a prefeitura saiba quanto cada casa consome"],
          },
          q20: {
            question: "Por que é importante respeitar as diferenças entre as pessoas?",
            options: ["Para que pessoas diferentes consigam conviver em paz", "Para que todos acabem pensando da mesma forma", "Para parecer uma pessoa moderna e bem informada", "Porque discordar de alguém é sempre falta de educação"],
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
