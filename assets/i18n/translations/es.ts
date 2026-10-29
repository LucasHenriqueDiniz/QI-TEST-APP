export const es = {
  translation: {
    common: {
      cancel: "Cancelar",
      close: "Cerrar",
      share: "Compartir",
      home: "Inicio",
      tapToClose: "Toca para cerrar",
    },
    categories: {
      similarities: "Semejanzas",
      vocabulary: "Vocabulario",
      matrix: "Lógica numérica",
      comprehension: "Comprensión",
      patterns: "Razonamiento visual",
    },
    classifications: {
      veryHigh: "Muy superior",
      high: "Superior",
      aboveAverage: "Por encima de la media",
      average: "Media",
      belowAverage: "Media baja",
      borderline: "Por debajo de la media",
      veryLow: "Muy por debajo de la media",
    },
    home: {
      title: "Test de CI",
      subtitle: "{{count}} preguntas de lógica, patrones visuales y vocabulario. Sin registro, sin cronómetro.",
      start: "Empezar test",
      measures: "Qué mide el test",
      stats: {
        last: "Último",
        best: "Mejor",
        taken: "Tests",
      },
      pitch: {
        free: "Gratis y completo — nada queda bloqueado",
        offline: "Funciona sin internet",
        categories: "Resultado detallado por área de razonamiento",
      },
      resume: {
        title: "Test en curso",
        message: "Dejaste un test a medias. ¿Quieres continuar donde lo dejaste?",
        continue: "Continuar",
        restart: "Empezar de nuevo",
        button: "Continuar test",
      },
    },
    test: {
      title: "Test de CI",
      counter: "{{current}}/{{total}}",
      counterA11y: "Pregunta {{current}} de {{total}}",
      remaining: "faltan {{count}}",
      remainingOne: "falta 1",
      lastQuestion: "última",
      confirm: "Confirmar",
      finish: "Ver mi resultado",
      error: "No pudimos cargar esta pregunta.",
      pause: {
        open: "Pausar el test",
        title: "¿Pausar el test?",
        message: "Tu progreso queda guardado.",
        resume: "Seguir con el test",
        leave: "Salir y continuar después",
      },
      milestones: {
        start: "¡Buen comienzo!",
        blockOne: "1 de {{total}} bloques completado",
        block: "{{done}} de {{total}} bloques completados",
        blockLast: "{{done}} de {{total}} — falta poco",
      },
    },
    speed: {
      overline: "Opcional · 90 segundos",
      offer: {
        title: "Test de velocidad",
        body: "Indica, lo más rápido que puedas, si las dos secuencias de símbolos son iguales o diferentes. Cuenta aparte y no cambia tu CI.",
        start: "Hacer el test de velocidad",
      },
      ready: {
        title: "Ahora en serio",
        body: "Son 90 segundos. Responde rápido, pero sin adivinar: cada error descuenta un acierto.",
        start: "Empezar",
      },
      skip: "Omitir",
      restarted: "La app salió de la pantalla durante la cuenta, así que el bloque empezó de nuevo.",
      practice: "Práctica {{current}} de {{total}}",
      timeLeft: "{{seconds}} s",
      question: "¿Las secuencias son iguales?",
      same: "Iguales",
      different: "Diferentes",
      right: "¡Bien!",
      wrong: "No era esa",
    },
    finishing: {
      title: "¡Test completado!",
      adNotice: "Un anuncio rápido y enseguida te mostramos tu resultado.",
    },
    results: {
      title: "Tu resultado",
      overline: "Tu CI estimado",
      betterThan: "Lo hiciste mejor que el {{percentile}}% de las personas",
      strongest: "Tu punto fuerte: {{area}} ({{correct}} de {{total}})",
      strip: {
        correct: "{{correct}}/{{total}} aciertos",
        minutes: "{{count}} min",
        seconds: "{{count}} s",
        areas: "{{count}} áreas",
      },
      whereYouAre: "Dónde estás",
      you: "Tú · {{score}}",
      populationMean: "Media de la población: 100",
      share: "Compartir resultado",
      retake: "Repetir con preguntas nuevas",
      profile: "Tu perfil",
      strength: "Punto fuerte",
      skipReveal: "Saltar la animación",
      shareMessage: "Saqué {{score}} en el test de CI — por encima del {{percentile}}% de las personas. ¡A ver si me superas!",
      band: "Rango probable: {{lower}}–{{upper}}",
      indices: {
        title: "Índices",
        reasoning: "Razonamiento",
        verbal: "Verbal",
        value: "rango {{lower}}–{{upper}}",
      },
      speed: {
        title: "Velocidad (experimental)",
        counts: "{{correct}} aciertos y {{wrong}} errores en {{seconds}} s",
        note: "Queda fuera de tu CI: todavía no hay una referencia de población para ella.",
      },
      shareMessageBand: "Saqué {{score}} en el test de CI (rango {{lower}}–{{upper}}): por encima del {{percentile}}% de las personas. ¿Me superas?",
      missing: "No encontramos este resultado.",
    },
    history: {
      title: "Historial",
      average: "Media",
      best: "Mejor",
      count: "Tests",
      allTests: "Todos los tests",
      itemDetail: "{{correct}}/{{total}} aciertos · percentil {{percentile}}",
      empty: {
        title: "Aún no hay nada",
        message: "Haz tu primer test para empezar a seguir tu evolución.",
      },
    },
    settings: {
      title: "Ajustes",
      section: {
        test: "Test",
        appearance: "Apariencia",
        language: "Idioma",
        about: "Acerca de",
      },
      age: {
        label: "Edad",
        value: "{{age}} años",
        unset: "Sin indicar",
        hint: "Se usa para un ajuste leve del cálculo. Queda solo en tu dispositivo.",
      },
      theme: {
        system: "Sistema",
        light: "Claro",
        dark: "Oscuro",
      },
      rate: "Valorar en Play Store",
      privacyOptions: "Opciones de privacidad de anuncios",
      clear: {
        button: "Borrar historial",
        title: "Borrar historial",
        message: "Se eliminarán todos los resultados guardados. Esto no se puede deshacer.",
        confirm: "Borrar",
        done: "Historial borrado.",
      },
      version: "Versión {{version}}",
    },
    about: {
      title: "Sobre el test",
      intro: "Un test de razonamiento inspirado en pruebas clásicas de inteligencia, con preguntas de patrones visuales, lógica numérica, vocabulario y comprensión.",
      bullets: [
        "Las preguntas se sortean en cada test, así que ninguna ronda es igual.",
        "Tu puntuación se compara con una curva normal de media 100 y desviación 15.",
        "No se envía nada a ningún servidor — los resultados quedan en tu dispositivo.",
      ],
      disclaimerTitle: "Esto es entretenimiento",
      disclaimerFull: "Esta app no es un instrumento psicométrico validado y no sustituye una evaluación profesional. Para un informe real, consulta a un psicólogo.",
      disclaimerShort: "Solo entretenimiento — no es una evaluación psicológica.",
      privacy: "Política de privacidad",
    },
    questions: {
      patterns: {
        prompt: "Completa la secuencia",
        zoom: "Ampliar",
        option: "Opción {{number}}",
      },
      items: {
        similarities: {
          q1: {
            question: "¿En qué se parecen un perro y un león?",
            options: ["Ambos son animales", "Ambos rugen", "Ambos son domésticos", "Ambos viven en la sabana"],
          },
          q2: {
            question: "¿Qué tienen en común el agua y el hielo?",
            options: ["Son de la misma sustancia", "Mantienen una forma propia y fija", "Fluyen cuando se derraman", "Son compuestos de carbono"],
          },
          q3: {
            question: "¿Qué tienen en común un libro y un periódico?",
            options: ["Ambos contienen información", "Ambos salen todos los días", "Ambos tienen tapa dura", "Ambos se escriben a mano"],
          },
          q4: {
            question: "¿Qué tienen en común una bicicleta y un coche?",
            options: ["Son medios de transporte", "Necesitan combustible", "Tienen cuatro ruedas", "Se impulsan con pedales"],
          },
          q5: {
            question: "¿Qué tienen en común el sol y una lámpara?",
            options: ["Ambos son fuentes de luz", "Ambos son estrellas del cielo", "Ambos se pueden apagar", "Ambos usan electricidad"],
          },
          q6: {
            question: "¿Qué tienen en común la memoria humana y un ordenador?",
            options: ["Ambos almacenan información", "Ambos están hechos de silicio", "Ambos se cansan tras mucho uso", "Ambos se venden en tiendas"],
          },
          q7: {
            question: "¿Qué tienen en común la ansiedad y el miedo?",
            options: ["Ambos son estados emocionales", "Ambos son enfermedades", "Ambos son elecciones conscientes", "Ambos son exclusivos de los humanos"],
          },
          q8: {
            question: "¿Qué tienen en común la música y la pintura?",
            options: ["Son formas de expresión artística", "Necesitan lienzo y pincel para existir", "Se perciben por los oídos", "Dependen de instrumentos de viento"],
          },
          q9: {
            question: "¿Qué tienen en común la sabiduría y la experiencia?",
            options: ["Ambas se adquieren con el tiempo", "Ambas vienen desde el nacimiento", "Ambas se aprenden solo en los libros", "Ambas se agotan al usarse"],
          },
          q10: {
            question: "¿Qué tienen en común la libertad y la responsabilidad?",
            options: ["Son interdependientes", "Una excluye a la otra", "Significan exactamente lo mismo", "Solo se aplican a adultos"],
          },
          q11: {
            question: "¿Qué tienen en común la democracia y la justicia?",
            options: ["Ambas buscan el bien común", "Ambas tienen dueño", "Ambas surgieron en el siglo XX", "Ambas dependen de un solo gobernante"],
          },
          q12: {
            question: "¿Qué tienen en común la intuición y el razonamiento?",
            options: ["Son formas de conocimiento", "Son órganos del cuerpo humano", "Siguen pasos lógicos explícitos", "Solo funcionan al dormir"],
          },
          q13: {
            question: "¿Qué tienen en común el elogio y el castigo?",
            options: ["Son formas de influir en el comportamiento", "Causan dolor a quien los recibe", "Solo pueden darlos los padres o los profesores", "Hacen que la persona tenga más confianza"],
          },
          q14: {
            question: "¿Qué tienen en común un eco y un espejo?",
            options: ["Ambos devuelven lo que les llega", "Ambos están hechos de vidrio pulido", "Ambos solo existen cerca de las montañas", "Ambos producen luz y sonido por sí mismos"],
          },
          q15: {
            question: "¿Qué tienen en común un virus y un rumor?",
            options: ["Ambos pueden pasar de persona a persona", "Ambos se pueden ver a simple vista por cualquiera", "Ambos se curan con antibióticos", "Ambos circulan solo por internet"],
          },
          q16: {
            question: "¿Qué tienen en común un puente y un intérprete?",
            options: ["Ambos unen dos lados que estarían separados", "Ambos están construidos con hormigón, hierro y acero", "Ambos hablan más de un idioma", "Ambos cobran peaje a quien pasa por ellos"],
          },
          q17: {
            question: "¿Qué tienen en común un mapa y una brújula?",
            options: ["Ambos ayudan a encontrar el camino", "Ambos muestran los nombres de las calles", "Ambos tienen una aguja que apunta al norte", "Ambos necesitan pilas para funcionar"],
          },
          q18: {
            question: "¿Qué tienen en común la luna y el sol?",
            options: ["Ambos son cuerpos celestes", "Ambos son planetas", "Ambos emiten luz propia", "Ambos giran alrededor de la Tierra"],
          },
          q19: {
            question: "¿Qué tienen en común una guitarra y un piano?",
            options: ["Ambos son instrumentos musicales", "Ambos se tocan soplando", "Ambos tienen teclas blancas y negras", "Ambos se tocan con arco"],
          },
          q20: {
            question: "¿Qué tienen en común una escuela y una biblioteca?",
            options: ["Ambas son lugares de aprendizaje", "Ambas venden libros al público", "Ambas tienen profesores dando clase", "Ambas cobran entrada para ingresar"],
          },
          q21: {
            question: "¿Qué tienen en común una manzana y una naranja?",
            options: ["Ambas tienen el mismo color", "Ambas son frutas", "Ambas crecen bajo tierra", "Ambas son amargas"],
          },
          q22: {
            question: "¿Qué tienen en común un martillo y un serrucho?",
            options: ["Ambos cortan madera", "Ambos tienen una hoja de corte", "Ambos son herramientas", "Ambos están hechos de plástico"],
          },
          q23: {
            question: "¿Qué tienen en común una camisa y un pantalón?",
            options: ["Son prendas de vestir", "Tienen bolsillos", "Cubren las piernas", "Son de cuero"],
          },
          q24: {
            question: "¿Qué tienen en común la leche y el jugo?",
            options: ["Ambos contienen cafeína", "Ambos vienen de frutas", "Ambos son dulces", "Ambos son bebidas"],
          },
          q25: {
            question: "¿Qué tienen en común una cuchara y un tenedor?",
            options: ["Ambos sirven para cortar", "Ambos son cubiertos", "Ambos son afilados", "Ambos son de madera"],
          },
          q26: {
            question: "¿Qué tienen en común el lunes y el viernes?",
            options: ["Ambos son días del fin de semana", "Ambos vienen justo después del domingo", "Ambos son feriados", "Ambos son días hábiles"],
          },
          q27: {
            question: "¿Qué tienen en común el ojo y el oído?",
            options: ["Ambos captan los sonidos del entorno", "Ambos son huesos del cráneo", "Ambos son órganos de los sentidos", "Ambos producen lágrimas"],
          },
          q28: {
            question: "¿Qué tienen en común un reloj y un calendario?",
            options: ["Ambos muestran los doce meses del año", "Ambos sirven para medir el paso del tiempo", "Ambos tienen manecillas que giran sobre la esfera", "Ambos muestran la temperatura del ambiente"],
          },
          q29: {
            question: "¿Qué tienen en común una semilla y un huevo?",
            options: ["Ambos tienen yema y clara por dentro", "Ambos necesitan enterrarse en la tierra para brotar", "Ambos vienen de plantas con flores", "Ambos dan origen a un nuevo ser vivo"],
          },
          q30: {
            question: "¿Qué tienen en común un termómetro y una regla?",
            options: ["Ambos son instrumentos de medición", "Ambos sirven para trazar líneas rectas", "Ambos miden el peso de un objeto", "Ambos miden la fiebre"],
          },
        },
        vocabulary: {
          q1: {
            question: '¿Qué significa "resiliente"?',
            options: ["Que se resiste a cualquier cambio", "Que se recupera de la adversidad", "Que habla poco y observa mucho", "Que evita el conflicto a toda costa"],
          },
          q2: {
            question: '¿Qué significa "pragmático"?',
            options: ["Que sigue las reglas al pie de la letra", "Que piensa mucho antes de actuar", "Que actúa de modo práctico y objetivo", "Que cambia de humor con facilidad"],
          },
          q3: {
            question: '¿Qué significa "empático"?',
            options: ["Que está de acuerdo con todo lo que oye", "Que organiza bien su propio tiempo", "Que entiende lo que sienten los demás", "Que conversa con cualquiera con facilidad"],
          },
          q4: {
            question: '¿Qué significa "perspicaz"?',
            options: ["Que habla de forma clara y directa", "Que memoriza todo con facilidad", "Que se preocupa demasiado por el futuro", "Que nota las cosas rápidamente"],
          },
          q5: {
            question: '¿Qué significa "altruista"?',
            options: ["Que solo piensa en su propio interés", "Que le gusta estar siempre acompañado", "Que se preocupa por el bien de los demás", "Que planea todo con anticipación"],
          },
          q6: {
            question: '¿Qué significa "paradójico"?',
            options: ["Que sirve de ejemplo a seguir", "Que parece contradecirse a sí mismo", "Que ocurre de manera repentina", "Que fue copiado de otra obra"],
          },
          q7: {
            question: '¿Qué significa "efímero"?',
            options: ["Que nunca llega a su fin", "Que dura poco tiempo", "Que vuelve de vez en cuando", "Que cuesta mucho dinero"],
          },
          q8: {
            question: '¿Qué significa "dicotomía"?',
            options: ["Conversación entre dos personas", "División en dos partes", "Repetición de palabras", "Mezcla de conceptos"],
          },
          q9: {
            question: '¿Qué significa "ubicuo"?',
            options: ["Que cambia de lugar con frecuencia", "Que no tiene forma definida", "Que está presente en todas partes", "Que existe desde hace mucho tiempo"],
          },
          q10: {
            question: '¿Qué significa "paradigma"?',
            options: ["Afirmación contradictoria", "Modelo que se debe seguir", "Discurso de apertura", "Enfermedad contagiosa"],
          },
          q11: {
            question: '¿Qué significa "axioma"?',
            options: ["Afirmación que aún necesita prueba", "Verdad evidente por sí misma", "Punto más alto de una montaña", "Figura retórica exagerada"],
          },
          q12: {
            question: '¿Qué significa "idiosincrasia"?',
            options: ["Palabra que solo existe en un idioma", "Conjunto de reglas de un juego", "Rasgo peculiar de un individuo", "Creencia compartida por un pueblo"],
          },
          q13: {
            question: "¿Qué significa 'tenaz'?",
            options: ["Que se irrita con facilidad", "Que insiste hasta conseguirlo", "Que hace amigos con facilidad", "Que cambia de opinión a cada rato"],
          },
          q14: {
            question: "¿Qué significa 'meticuloso'?",
            options: ["Que hace todo de cualquier manera", "Que cuida hasta el último detalle", "Que termina todo con rapidez", "Que le gusta dar órdenes"],
          },
          q15: {
            question: "¿Qué significa 'vehemente'?",
            options: ["Que se enoja por cualquier motivo", "Que se expresa con fuerza e intensidad", "Que habla siempre de forma tranquila y pausada", "Que tiene prisa en todo lo que hace"],
          },
          q16: {
            question: "¿Qué significa 'prolífico'?",
            options: ["Que produce en gran cantidad", "Que habla durante mucho tiempo", "Que vive lejos de la ciudad", "Que gana dinero con facilidad"],
          },
          q17: {
            question: "¿Qué significa 'antagónico'?",
            options: ["Que está en oposición a algo", "Que es el personaje principal", "Que viene de tiempos antiguos", "Que fue hecho a mano"],
          },
          q18: {
            question: '¿Qué significa "resignado"?',
            options: ["Que acepta la situación sin luchar", "Que se mantiene calmado ante todo", "Que fue nombrado para un cargo", "Que escribe con la mano izquierda"],
          },
          q19: {
            question: '¿Qué significa "indócil"?',
            options: ["Que no se deja domar ni controlar", "Que nació y creció en otro país", "Que se enferma con frecuencia", "Que no soporta quedarse solo en casa"],
          },
          q20: {
            question: '¿Qué significa "esotérico"?',
            options: ["Que solo unos pocos comprenden", "Que viene de un país extranjero", "Que provoca miedo en la gente", "Que fue escrito hace muchos siglos"],
          },
          q21: {
            question: '¿Qué significa "generoso"?',
            options: ["Que gasta sin pensar en el mañana", "Que da y ayuda de buena gana", "Que conversa y sonríe con todo el mundo", "A quien le gusta recibir regalos"],
          },
          q22: {
            question: '¿Qué significa "veloz"?',
            options: ["Lento", "Pesado", "Rápido", "Fuerte"],
          },
          q23: {
            question: '¿Qué significa "sincero"?',
            options: ["Que confía en todo el mundo", "Que es educado", "Que habla más de lo que escucha", "Que dice la verdad"],
          },
          q24: {
            question: '¿Qué significa "enorme"?',
            options: ["Muy grande", "Muy pequeño", "Muy liviano", "Muy viejo"],
          },
          q25: {
            question: '¿Qué significa "valiente"?',
            options: ["Que le gustan las aventuras y los viajes", "Que enfrenta el peligro", "Que habla muy fuerte", "Que se confunde con facilidad"],
          },
          q26: {
            question: '¿Qué significa "frágil"?',
            options: ["Que está hecho de vidrio", "Que pesa más de lo que parece", "Que se rompe fácilmente", "Que cuesta poco dinero"],
          },
          q27: {
            question: '¿Qué significa "raro"?',
            options: ["Muy conocido", "De gran valor", "De otra época", "Poco común"],
          },
          q28: {
            question: '¿Qué significa "humilde"?',
            options: ["Que obedece sin cuestionar nada", "Que no se cree superior a los demás", "Que tiene vergüenza de hablar en público", "Que evita cualquier tipo de esfuerzo"],
          },
          q29: {
            question: '¿Qué significa "cauteloso"?',
            options: ["Que le teme a casi todo", "Que planea cada detalle con anticipación", "Que actúa con cuidado y evita riesgos", "Que tarda y aplaza todo lo que puede"],
          },
          q30: {
            question: '¿Qué significa "ingenuo"?',
            options: ["Que es bondadoso con todo el mundo", "Que cree todo con facilidad", "Que resuelve cualquier problema con astucia", "Que trata mal a los demás"],
          },
          q31: {
            question: '¿Qué significa "escéptico"?',
            options: ["Que duda y exige pruebas", "Que critica todo lo que ve", "Que espera lo mejor y confía en el futuro", "Que nunca cambia de idea"],
          },
          q32: {
            question: '¿Qué significa "ambiguo"?',
            options: ["Que usa palabras difíciles de entender", "Que afirma algo que no es verdad", "Que se extiende más de lo necesario", "Que puede tener más de un sentido"],
          },
          q33: {
            question: '¿Qué significa "obsoleto"?',
            options: ["Moderno", "Roto", "Anticuado", "Carísimo"],
          },
          q34: {
            question: '¿Qué significa "conciso"?',
            options: ["Simple y fácil de leer", "Confuso y difícil de seguir", "Formal y lleno de ceremonia", "Breve y directo al punto"],
          },
          q35: {
            question: '¿Qué significa "hostil"?',
            options: ["Amigable", "Agresivo", "Indiferente", "Tímido"],
          },
          q36: {
            question: '¿Qué significa "arduo"?',
            options: ["Fácil", "Demorado", "Difícil", "Peligroso"],
          },
          q37: {
            question: '¿Qué significa "sereno"?',
            options: ["Tranquilo", "Agitado", "Triste", "Bullicioso"],
          },
          q38: {
            question: '¿Qué significa "nocivo"?',
            options: ["Perjudicial", "Ruidoso", "Amargo", "Inútil"],
          },
        },
        matrix: {
          q1: {
            question: "¿Qué número completa la secuencia: 1, 3, 6, 11, 18, 29, __?",
            options: ["40", "42", "39", "47"],
          },
          q2: {
            question: "¿Qué número completa la secuencia: 3, 6, 12, 24, __?",
            options: ["30", "36", "42", "48"],
          },
          q3: {
            question: "¿Qué número completa la secuencia: 1, 3, 6, 10, __?",
            options: ["13", "15", "16", "18"],
          },
          q4: {
            question: "¿Qué número completa el patrón: 2, 6, 3, 9, 6, 18, __?",
            options: ["12", "9", "15", "21"],
          },
          q5: {
            question: "¿Qué número completa la secuencia: 2, 6, 12, 20, __?",
            options: ["26", "28", "30", "32"],
          },
          q6: {
            question: "¿Qué número completa el patrón: 1, 4, 13, 40, __?",
            options: ["80", "120", "121", "160"],
          },
          q7: {
            question: "¿Qué número completa la secuencia: 5, 10, 20, 35, __?",
            options: ["45", "50", "55", "60"],
          },
          q8: {
            question: "Completa la secuencia: 1, 1, 2, 4, 7, 13, __",
            options: ["20", "22", "24", "26"],
          },
          q9: {
            question: "Completa la secuencia: 1, 8, 27, 64, __",
            options: ["96", "100", "128", "125"],
          },
          q10: {
            question: "¿Qué número completa la secuencia: 13, 21, 34, 55, __?",
            options: ["76", "84", "89", "91"],
          },
          q11: {
            question: "¿Qué número completa la secuencia: 3, 4, 8, 17, 33, __?",
            options: ["49", "58", "66", "54"],
          },
          q12: {
            question: "¿Qué número completa la secuencia: 8, 11, 15, 20, 26, __?",
            options: ["31", "32", "33", "35"],
          },
          q13: {
            question: "Completa la secuencia: 1, 4, 16, 64, __",
            options: ["256", "128", "192", "320"],
          },
          q14: {
            question: "¿Qué número completa el patrón: 2, 5, 10, 17, 26, __?",
            options: ["35", "36", "37", "39"],
          },
          q15: {
            question: "Completa la secuencia: 3, 6, 9, 12, __",
            options: ["15", "18", "21", "24"],
          },
          q16: {
            question: "¿Qué número completa el patrón: 1, 1, 2, 3, 5, __?",
            options: ["8", "7", "9", "6"],
          },
          q17: {
            question: "Completa la secuencia: 2, 4, 8, 16, __",
            options: ["32", "20", "24", "40"],
          },
          q18: {
            question: "Completa la secuencia: 1, 2, 3, 4, __",
            options: ["5", "6", "7", "8"],
          },
          q19: {
            question: "Completa la secuencia: 4, 8, 12, 16, __",
            options: ["20", "24", "18", "32"],
          },
          q20: {
            question: "¿Qué número completa la secuencia: 2, 5, 8, 11, __?",
            options: ["14", "12", "13", "15"],
          },
          q21: {
            question: "¿Qué número completa la secuencia: 30, 25, 20, 15, __?",
            options: ["5", "10", "12", "14"],
          },
          q22: {
            question: "¿Qué número completa la secuencia: 80, 40, 20, 10, __?",
            options: ["0", "2", "5", "8"],
          },
          q23: {
            question: "¿Qué número completa la secuencia: 1, 10, 100, 1000, __?",
            options: ["1900", "2000", "11000", "10000"],
          },
          q24: {
            question: "¿Qué número completa la secuencia: 1, 3, 5, 7, 9, __?",
            options: ["11", "10", "12", "13"],
          },
          q25: {
            question: "¿Qué número completa la secuencia: 2, 7, 2, 7, 2, __?",
            options: ["2", "5", "7", "9"],
          },
          q26: {
            question: "¿Qué número completa la secuencia: 1, 1, 2, 2, 3, 3, 4, __?",
            options: ["3", "4", "5", "6"],
          },
          q27: {
            question: "¿Qué número completa la secuencia: 7, 14, 21, 28, __?",
            options: ["35", "30", "32", "42"],
          },
          q28: {
            question: "¿Qué número completa la secuencia: 2, 6, 18, 54, __?",
            options: ["108", "144", "150", "162"],
          },
          q29: {
            question: "¿Qué número completa la secuencia: 3, 5, 10, 12, 24, __?",
            options: ["26", "28", "36", "48"],
          },
          q30: {
            question: "¿Qué número completa la secuencia: 2, 50, 4, 40, 6, 30, 8, __?",
            options: ["10", "20", "25", "28"],
          },
          q31: {
            question: "¿Qué número completa la secuencia: 50, 49, 47, 44, 40, __?",
            options: ["30", "34", "35", "36"],
          },
          q32: {
            question: "¿Qué número completa la secuencia: 1, 2, 6, 24, __?",
            options: ["48", "72", "96", "120"],
          },
          q33: {
            question: "¿Qué número completa la secuencia: 2, 3, 5, 7, 11, 13, __?",
            options: ["14", "15", "16", "17"],
          },
          q34: {
            question: "¿Qué número completa la secuencia: 1, 3, 7, 15, 31, __?",
            options: ["63", "62", "64", "47"],
          },
          q35: {
            question: "¿Qué número completa la secuencia: 5, 9, 8, 12, 11, 15, __?",
            options: ["12", "13", "14", "16"],
          },
          q36: {
            question: "¿Qué número completa la secuencia: 4, 9, 25, 49, 121, __?",
            options: ["144", "169", "196", "225"],
          },
        },
        comprehension: {
          q1: {
            question: "¿Por qué es importante lavarse las manos antes de comer?",
            options: ["Para no pasar gérmenes de las manos a la boca", "Para mostrar respeto a quien preparó la comida", "Para quitar el olor a condimento de las manos", "Para mantener la piel de las manos suave y bonita"],
          },
          q2: {
            question: "¿Por qué debemos ahorrar agua?",
            options: ["Porque el agua estancada en las tuberías se echa a perder", "Porque el agua apta para el consumo es limitada", "Para que el agua salga del grifo con más presión", "Porque el agua que usamos nunca vuelve a la naturaleza"],
          },
          q3: {
            question: "¿Por qué es importante estudiar?",
            options: ["Para aprender y ampliar nuestras capacidades", "Para que las escuelas no se queden sin alumnos", "Para mantener la mente ocupada y lejos de problemas", "Para demostrar a los demás que somos capaces"],
          },
          q4: {
            question: "¿Por qué debemos respetar las leyes?",
            options: ["Para que haya orden y seguridad en la vida en sociedad", "Porque las leyes siempre reflejan lo que es justo", "Porque quienes escribieron las leyes saben más que nosotros", "Para preservar la tradición jurídica de nuestro país"],
          },
          q5: {
            question: "¿Por qué es importante hacer ejercicio?",
            options: ["Para mantener el cuerpo y la mente sanos", "Para poder comer de todo sin engordar", "Para cansar el cuerpo y dormir más temprano", "Para tener la apariencia que la moda valora"],
          },
          q6: {
            question: "¿Por qué debemos preservar el medio ambiente?",
            options: ["Para que las ciudades dejen de crecer y extenderse", "Porque dependemos de él para vivir, hoy y en el futuro", "Para que el país tenga buena imagen en el exterior", "Para que el clima del planeta vuelva a ser como era antes"],
          },
          q7: {
            question: "¿Por qué es importante dormir bien?",
            options: ["Para que el cuerpo y la mente se recuperen del cansancio", "Para gastar menos electricidad durante la noche", "Para soñar y entender lo que el inconsciente quiere decir", "Para no molestar a quienes viven con nosotros"],
          },
          q8: {
            question: "¿Por qué debemos respetar las diferencias entre las personas?",
            options: ["Porque nadie vale menos por ser distinto a nosotros", "Porque quien es distinto a nosotros suele tener razón", "Porque las diferencias desaparecen cuando se respetan", "Para que no nos acusen de tener prejuicios"],
          },
          q9: {
            question: "¿Por qué es importante desarrollar el pensamiento crítico?",
            options: ["Para evaluar una información antes de aceptarla", "Para tener siempre una opinión distinta a la mayoría", "Para memorizar más contenido en menos tiempo", "Para defender nuestras opiniones sin tener que cambiarlas"],
          },
          q10: {
            question: "¿Por qué es importante la diversidad cultural?",
            options: ["Porque garantiza que las tradiciones nunca cambien", "Porque culturas distintas dan ideas y soluciones nuevas", "Porque facilita la venta de productos en otros países", "Porque pueblos de distintas culturas nunca chocan entre sí"],
          },
          q11: {
            question: "¿Por qué es importante desarrollar la empatía?",
            options: ["Para entender lo que siente el otro y tratarlo mejor", "Para convencer a la gente con más facilidad", "Para cargar con los problemas ajenos como si fueran nuestros", "Para que nos recuerden como alguien amable y agradable"],
          },
          q12: {
            question: "¿Por qué es fundamental la educación para la sociedad?",
            options: ["Porque ocupa a los niños mientras los padres trabajan", "Porque forma personas que piensan y mejoran la sociedad", "Porque sin títulos las empresas no sabrían a quién contratar", "Porque así el país sube en los rankings internacionales"],
          },
          q13: {
            question: "¿Por qué debemos reciclar residuos?",
            options: ["Para que menos basura acabe en vertederos y ríos", "Para que la basura de la casa deje de oler mal", "Para que el municipio cobre una tasa de basura menor", "Para dar ejemplo de conciencia ambiental a los vecinos"],
          },
          q14: {
            question: "¿Por qué es importante el sueño?",
            options: ["Porque el cuerpo se repara y la memoria se fija al dormir", "Porque la noche es muy oscura para hacer cualquier cosa", "Para que los días no se nos hagan tan largos", "Porque pasamos cerca de un tercio de nuestra vida durmiendo"],
          },
          q15: {
            question: "¿Por qué es importante ahorrar agua?",
            options: ["Para que no falte agua en las épocas de sequía", "Porque el agua del grifo cuesta más cada año", "Para que el nivel del mar no siga subiendo", "Para que las lluvias vuelvan a caer con regularidad"],
          },
          q16: {
            question: "¿Por qué debemos hacer ejercicio físico?",
            options: ["Para fortalecer el corazón, los músculos y los huesos", "Para tener un motivo para salir de casa el fin de semana", "Para que el médico no nos regañe en la consulta", "Para ganar medallas y trofeos en competencias"],
          },
          q17: {
            question: "¿Por qué son importantes los insectos para el medio ambiente?",
            options: ["Porque polinizan y son alimento de muchos animales", "Porque regulan la temperatura y el régimen de lluvias", "Porque alejan a los animales grandes de los cultivos", "Porque sirven de modelo para la ingeniería y la robótica"],
          },
          q18: {
            question: "¿Por qué necesitan las plantas la luz solar?",
            options: ["Porque usan la luz para fabricar su propio alimento", "Para calentarse y no congelarse en las noches frías", "Para absorber por las hojas el agua que necesitan", "Para que las flores tengan colores más vivos"],
          },
          q19: {
            question: "¿Por qué debemos separar la basura reciclable?",
            options: ["Para que esos materiales puedan reaprovecharse", "Para que el camión de la basura pase con menos frecuencia", "Para que las bolsas de basura pesen menos", "Para que el municipio sepa cuánto consume cada casa"],
          },
          q20: {
            question: "¿Por qué es importante respetar las diferencias entre las personas?",
            options: ["Para que personas distintas puedan convivir en paz", "Para que todos terminen pensando de la misma forma", "Para parecer una persona moderna y bien informada", "Porque discrepar de alguien es siempre de mala educación"],
          },
          q21: {
            question: "¿Por qué debemos mirar a ambos lados antes de cruzar la calle?",
            options: ["Porque es una regla", "Para ver si viene algún vehículo", "Para dar el ejemplo a quienes están cerca", "Para elegir el mejor punto para cruzar"],
          },
          q22: {
            question: "¿Por qué guardamos los alimentos perecederos en el refrigerador?",
            options: ["Para que tengan más sabor", "Para que ocupen menos espacio en la cocina", "Para que tarden más en echarse a perder", "Porque es la costumbre en la mayoría de las casas"],
          },
          q23: {
            question: "¿Por qué es útil hacer una lista antes de ir al supermercado?",
            options: ["Para no olvidar lo que hay que comprar", "Para recibir un descuento en caja por llevar la lista", "Para que el supermercado reponga los productos que faltan", "Para que el supermercado entregue la compra en casa"],
          },
          q24: {
            question: "¿Por qué usamos cinturón de seguridad en el auto?",
            options: ["Para poder manejar a mayor velocidad", "Porque el auto no arranca si el cinturón no está abrochado", "Porque el asiento resulta más cómodo", "Para reducir lesiones en caso de accidente"],
          },
          q25: {
            question: "¿Por qué es importante llegar a tiempo a un compromiso?",
            options: ["Para parecer una persona importante", "Para respetar el tiempo de los demás", "Para poder irse más temprano del compromiso", "Porque el reloj determina lo que hacemos"],
          },
          q26: {
            question: "¿Por qué conviene guardar el recibo después de una compra?",
            options: ["Para guardarlo como recuerdo de la compra", "Porque la tienda exige que todo cliente lo guarde", "Para poder cambiar el producto si hay un problema", "Para mostrarles a los amigos lo que compramos"],
          },
          q27: {
            question: "¿Por qué debemos leer las instrucciones antes de armar un mueble?",
            options: ["Para armarlo correctamente y evitar errores", "Para saber de qué madera está hecho el mueble", "Porque el manual viene dentro de la caja del producto", "Para saber cuánto costó el mueble en la tienda"],
          },
          q28: {
            question: "¿Por qué debemos pedir disculpas cuando nos equivocamos?",
            options: ["Para terminar pronto una conversación incómoda", "Para pasarle la culpa del error a la otra persona", "Para parecer bien educado y recibir elogios", "Para asumir lo que hicimos y cuidar la relación"],
          },
          q29: {
            question: "¿Por qué deben cumplirse las promesas?",
            options: ["Porque cumplir promesas vuelve más inteligente a la gente", "Porque la confianza entre las personas depende de ello", "Porque es lo que los padres enseñan desde pequeños", "Porque quien no cumple lo prometido termina en la cárcel"],
          },
          q30: {
            question: "¿Por qué el trabajo en equipo suele lograr más que el trabajo individual?",
            options: ["Porque combina habilidades distintas y reparte el esfuerzo", "Porque en grupo nadie tiene que esforzarse de verdad", "Porque en grupo todos piensan exactamente de la misma manera", "Porque en grupo cada uno hace solo la parte que le gusta"],
          },
        },
      },
    },
    notFound: {
      title: "Página no encontrada",
      message: "Esta pantalla no existe.",
    },
  },
};
