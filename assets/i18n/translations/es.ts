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
      counter: "{{current}} de {{total}}",
      confirm: "Confirmar",
      finish: "Ver resultado",
      error: "No pudimos cargar esta pregunta.",
    },
    results: {
      title: "Tu resultado",
      yourScore: "Tu puntuación",
      percentile: "Por encima del {{percentile}}% de las personas",
      curveCaption: "Distribución estimada en la población",
      accuracy: "Aciertos",
      byCategory: "Rendimiento por área",
      retake: "Repetir test",
      shareMessage: "Saqué {{score}} en el test de CI — por encima del {{percentile}}% de las personas. ¡A ver si me superas!",
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
            question: "¿Cómo son un perro y un león iguales?",
            options: ["Ambos son animales", "Ambos son grandes", "Ambos son domésticos", "Ambos son peligrosos"],
          },
          q2: {
            question: "¿Qué tienen en común el agua y el hielo?",
            options: ["Son del mismo compuesto", "Ambos son fríos", "Ambos son líquidos", "Ambos son transparentes"],
          },
          q3: {
            question: "¿Qué tienen en común un libro y un periódico?",
            options: ["Ambos contienen información", "Ambos son de papel", "Ambos tienen cubiertas", "Ambos son coloridos"],
          },
          q4: {
            question: "¿Qué tienen en común una bicicleta y un coche?",
            options: ["Son medios de transporte", "Tienen motores", "Son del mismo color", "Son del mismo tamaño"],
          },
          q5: {
            question: "¿Qué tienen en común el sol y una lámpara?",
            options: ["Ambos emiten luz", "Ambos son redondos", "Ambos son calientes", "Ambos son amarillos"],
          },
          q6: {
            question: "¿Qué tienen en común la memoria y un ordenador?",
            options: ["Ambos almacenan información", "Ambos usan electricidad", "Ambos son máquinas", "Ambos necesitan energía"],
          },
          q7: {
            question: "¿Qué tienen en común la ansiedad y el miedo?",
            options: ["Ambos son emociones", "Ambos son malos", "Ambos son dañinos", "Ambos son enfermedades"],
          },
          q8: {
            question: "¿Qué tienen en común la música y el arte?",
            options: ["Son formas de expresión artística", "Usan instrumentos", "Son ruidosos", "Son coloridos"],
          },
          q9: {
            question: "¿Qué tienen en común la sabiduría y la experiencia?",
            options: ["Ambos vienen con el tiempo y el aprendizaje", "Ambos son innatos", "Ambos son teóricos", "Ambos son permanentes"],
          },
          q10: {
            question: "¿Qué tienen en común la libertad y la responsabilidad?",
            options: ["Son interdependientes", "Son opuestos", "Son abstractos", "Son simples"],
          },
          q11: {
            question: "¿Qué tienen en común la democracia y la justicia?",
            options: ["Ambos buscan el bien común", "Ambos son sistemas", "Ambos son antiguos", "Ambos son complejos"],
          },
          q12: {
            question: "¿Qué tienen en común la intuición y el razonamiento?",
            options: ["Son formas de conocimiento", "Son emociones", "Son comportamientos", "Son habilidades físicas"],
          },
          q13: {
            question: "¿Qué tienen en común un árbol y una flor?",
            options: ["Ambos son plantas", "Ambos son grandes", "Ambos producen frutos", "Ambos son coloridos"],
          },
          q14: {
            question: "¿Qué tienen en común un avión y un pájaro?",
            options: ["Ambos pueden volar", "Ambos son seres vivos", "Ambos tienen plumas", "Ambos son rápidos"],
          },
          q15: {
            question: "¿Qué tienen en común un coche y una motocicleta?",
            options: ["Ambos tienen ruedas", "Ambos pueden volar", "Ambos tienen alas", "Ambos son acuáticos"],
          },
          q16: {
            question: "¿Qué tienen en común un pez y un tiburón?",
            options: ["Ambos viven en el agua", "Ambos tienen patas", "Ambos pueden volar", "Ambos tienen pelaje"],
          },
          q17: {
            question: "¿Qué tienen en común una lámpara y el sol?",
            options: ["Ambos emiten luz", "Ambos están en el cielo", "Ambos son naturales", "Ambos son fríos"],
          },
          q18: {
            question: "¿Qué tienen en común un árbol y una planta?",
            options: ["Ambos son plantas", "Ambos crecen flores", "Ambos son verdes", "Ambos producen frutos"],
          },
          q19: {
            question: "¿Qué tienen en común una silla y un sofá?",
            options: ["Ambos son muebles", "Ambos son suaves", "Ambos se usan para sentarse", "Ambos se usan para dormir"],
          },
          q20: {
            question: "¿Qué tienen en común un portátil y un teléfono móvil?",
            options: ["Ambos son dispositivos electrónicos", "Ambos se usan para jugar", "Ambos tienen pantallas", "Ambos tienen teclados"],
          },
        },
        vocabulary: {
          q1: {
            question: '¿Qué significa "resiliente"?',
            options: ["Se rinde fácilmente", "Se adapta y supera la adversidad", "Es frágil", "Es impaciente"],
          },
          q2: {
            question: '¿Qué significa "pragmático"?',
            options: ["Actúa sin pensar", "Es teórico", "Es práctico y objetivo", "Es soñador"],
          },
          q3: {
            question: '¿Qué significa "empatía"?',
            options: ["Ser egoísta", "No cuidar de los demás", "Entender las emociones de los demás", "Ser desagradable"],
          },
          q4: {
            question: '¿Qué significa "perceptivo"?',
            options: ["Ser lento", "Ser distraído", "Ser distraído", "Notar cosas rápidamente"],
          },
          q5: {
            question: '¿Qué significa "altruista"?',
            options: ["Ser egoísta", "Ser orgulloso", "Ser preocupado por el bienestar de los demás", "Ser individualista"],
          },
          q6: {
            question: '¿Qué significa "paradojal"?',
            options: ["Ser simple", "Parecer contradictorio", "Ser obvio", "Ser común"],
          },
          q7: {
            question: '¿Qué significa "efímero"?',
            options: ["Que es eterno", "Que es temporal", "Que es importante", "Que es valioso"],
          },
          q8: {
            question: '¿Qué significa "dilema"?',
            options: ["Unión de ideas", "División en dos partes", "Mezcla de conceptos", "Repetición de palabras"],
          },
          q9: {
            question: '¿Qué significa "ubícuo"?',
            options: ["Que es raro", "Que es único", "Que está presente en todas partes", "Que es escaso"],
          },
          q10: {
            question: '¿Qué significa "paradigma"?',
            options: ["Contradicción", "Modelo o patrón", "Problema", "Solución"],
          },
          q11: {
            question: '¿Qué significa "axioma"?',
            options: ["Teoría compleja", "Verdad evidente", "Problema difícil", "Concepto abstracto"],
          },
          q12: {
            question: '¿Qué significa "idiosincrasia"?',
            options: ["Enfermedad rara", "Pensamiento común", "Característica peculiar de un individuo", "Comportamiento normal"],
          },
          q13: {
            question: "¿Qué significa 'tenaz'?",
            options: ["Se rinde fácilmente", "Fuerte y persistente", "Indiferente", "Reacio"],
          },
          q14: {
            question: "¿Qué significa 'meticuloso'?",
            options: ["Cuidado", "Atento a los detalles", "Rápido", "Desorganizado"],
          },
          q15: {
            question: "¿Qué significa 'efímero'?",
            options: ["Duradero", "Temporal", "Invariable", "Importante"],
          },
          q16: {
            question: "¿Qué significa 'prolífico'?",
            options: ["Produce mucho", "Lento", "Productivo", "Raro"],
          },
          q17: {
            question: "¿Qué significa 'antagonista'?",
            options: ["Opuesto", "Igual", "Amigable", "Neutral"],
          },
          q18: {
            question: '¿Qué significa "cogente"?',
            options: ["Débil", "Convencional", "Inseguro", "Falso"],
          },
          q19: {
            question: '¿Qué significa "claro"?',
            options: ["Claro", "Oscuro", "Complicado", "Incomprensible"],
          },
          q20: {
            question: '¿Qué significa "nefario"?',
            options: ["Malo", "Bueno", "Noble", "Valiente"],
          },
        },
        matrix: {
          q1: {
            question: "¿Qué número completa la secuencia: 2, 4, 8, 16, __?",
            options: ["24", "32", "30", "28"],
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
            question: "¿Qué número completa el patrón: 7, 14, 28, 56, __?",
            options: ["96", "102", "112", "98"],
          },
          q5: {
            question: "¿Qué número completa la secuencia: 2, 6, 12, 20, __?",
            options: ["26", "28", "30", "32"],
          },
          q6: {
            question: "¿Qué número completa el patrón: 1, 4, 9, 16, __?",
            options: ["20", "23", "25", "21"],
          },
          q7: {
            question: "¿Qué número completa la secuencia: 5, 10, 20, 35, __?",
            options: ["45", "50", "55", "60"],
          },
          q8: {
            question: "¿Qué número completa la secuencia: A = 1, B = 3, C = 6, entonces D = __?",
            options: ["8", "9", "10", "12"],
          },
          q9: {
            question: "¿Qué número completa la secuencia: 3² = 9, 4² = 16, entonces 5² = __?",
            options: ["20", "21", "23", "25"],
          },
          q10: {
            question: "¿Qué número completa la secuencia: 13, 21, 34, 55, __?",
            options: ["76", "84", "89", "91"],
          },
          q11: {
            question: "¿Qué número completa la secuencia: 2³ = 8, 3³ = 27, entonces 4³ = __?",
            options: ["54", "64", "72", "81"],
          },
          q12: {
            question: "¿Qué número completa la secuencia: 8, 11, 15, 20, 26, __?",
            options: ["31", "32", "33", "35"],
          },
          q13: {
            question: "¿Qué número completa la secuencia: 10, 15, 21, 28, __?",
            options: ["36", "40", "45", "33"],
          },
          q14: {
            question: "¿Qué número completa el patrón: 2, 3, 5, 8, __?",
            options: ["10", "12", "13", "15"],
          },
          q15: {
            question: "¿Qué número completa el patrón: 1, 2, 4, 8, __?",
            options: ["12", "14", "16", "18"],
          },
          q16: {
            question: "¿Qué número completa el patrón: 1, 3, 6, 10, __?",
            options: ["13", "15", "16", "18"],
          },
          q17: {
            question: "¿Qué número completa el patrón: 1, 4, 9, 16, __?",
            options: ["20", "23", "25", "21"],
          },
          q18: {
            question: "¿Qué número completa la secuencia: 1, 5, 9, 13, __?",
            options: ["17", "18", "19", "21"],
          },
          q19: {
            question: "¿Qué número completa la secuencia: 6, 12, 18, 24, __?",
            options: ["30", "32", "36", "40"],
          },
          q20: {
            question: "¿Qué número completa el patrón: 2, 5, 10, 17, __?",
            options: ["26", "28", "30", "35"],
          },
        },
        comprehension: {
          q1: {
            question: "¿Por qué es importante lavarse las manos antes de comer?",
            options: ["Para prevenir enfermedades", "Para mantener las manos limpias", "Porque es una regla", "Para no ensuciar la comida"],
          },
          q2: {
            question: "¿Por qué debemos ahorrar agua?",
            options: ["Para pagar menos", "Para preservar un recurso esencial", "Porque todos lo hacen", "Para agradar a otros"],
          },
          q3: {
            question: "¿Por qué es importante estudiar?",
            options: ["Para adquirir conocimientos y desarrollarse", "Para agradar a los padres", "Para pasar el tiempo", "Porque es obligatorio"],
          },
          q4: {
            question: "¿Por qué debemos respetar las leyes?",
            options: ["Para mantener el orden y la seguridad en la sociedad", "Para evitar la sanción", "Porque todos lo hacen", "Para agradar a las autoridades"],
          },
          q5: {
            question: "¿Por qué es importante hacer ejercicio?",
            options: ["Para mantener la salud física y mental", "Para lucir bien", "Porque el doctor lo dice", "Solo para perder peso"],
          },
          q6: {
            question: "¿Por qué debemos preservar el medio ambiente?",
            options: ["Porque es la ley", "Para asegurar la supervivencia de las futuras generaciones", "Para ahorrar dinero", "Porque todos lo hacen"],
          },
          q7: {
            question: "¿Por qué es importante dormir bien?",
            options: ["Para restaurar el cuerpo y la mente", "Para no sentir sueño durante el día", "Porque es costumbre", "Para no despertar tarde"],
          },
          q8: {
            question: "¿Por qué debemos respetar las diferencias entre las personas?",
            options: ["Para promover una sociedad más justa y armoniosa", "Para evitar conflictos", "Porque es la ley", "Para ser bien visto"],
          },
          q9: {
            question: "¿Por qué es importante desarrollar el pensamiento crítico?",
            options: ["Para analizar información y tomar decisiones informadas", "Para criticar a los demás", "Para parecer inteligente", "Para ganar argumentos"],
          },
          q10: {
            question: "¿Por qué es importante la diversidad cultural?",
            options: ["Solo para el turismo", "Para enriquecer la experiencia humana y promover la innovación", "Para tener diferentes comidas", "Para aprender idiomas"],
          },
          q11: {
            question: "¿Por qué es importante desarrollar la empatía?",
            options: ["Para comprender y conectarse mejor con los demás", "Para obtener lo que queremos", "Para parecer una buena persona", "Para evitar problemas"],
          },
          q12: {
            question: "¿Por qué es fundamental la educación para la sociedad?",
            options: ["Solo para conseguir un trabajo", "Para el desarrollo humano y social", "Para ganar dinero", "Para ganar estatus"],
          },
          q13: {
            question: "¿Por qué debemos reciclar residuos?",
            options: ["Para reducir la contaminación", "Para ahorrar dinero", "Porque es fácil", "Para evitar multas"],
          },
          q14: {
            question: "¿Por qué es importante dormir bien?",
            options: ["Para restaurar la energía y la salud", "Para evitar el aburrimiento", "Porque es costumbre", "Para pasar el tiempo"],
          },
          q15: {
            question: "¿Por qué es importante ahorrar agua?",
            options: ["Para preservar los recursos naturales", "Porque es caro", "Para evitar multas", "Porque es difícil de obtener"],
          },
          q16: {
            question: "¿Por qué es importante hacer ejercicio?",
            options: ["Para mantener la salud", "Para competir", "Para parecer más alto", "Porque es obligatorio"],
          },
          q17: {
            question: "¿Por qué son importantes los insectos para el medio ambiente?",
            options: ["Porque polinizan las plantas", "Porque controlan el clima", "Porque son inofensivos", "Porque son coloridos"],
          },
          q18: {
            question: "¿Por qué necesitan las plantas la luz solar?",
            options: ["Para la fotosíntesis", "Para crecer", "Para la reproducción", "Para la absorción de agua"],
          },
          q19: {
            question: "¿Por qué es importante hacer ejercicio?",
            options: ["Para mantener la salud", "Para perder tiempo", "Para evitar trabajar", "Para socializar"],
          },
          q20: {
            question: "¿Por qué es importante leer libros?",
            options: ["Para adquirir conocimientos", "Para escapar de la realidad", "Para pasar el tiempo", "Para evitar el aburrimiento"],
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
