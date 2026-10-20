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
            options: ["Ambos son animales", "Ambos son grandes", "Ambos son domésticos", "Ambos son peligrosos"],
          },
          q2: {
            question: "¿Qué tienen en común el agua y el hielo?",
            options: ["Son del mismo compuesto", "Son fríos", "Son líquidos", "Son gaseosos"],
          },
          q3: {
            question: "¿Qué tienen en común un libro y un periódico?",
            options: ["Ambos contienen información", "Ambos salen todos los días", "Ambos se escriben a mano", "Ambos son coloridos"],
          },
          q4: {
            question: "¿Qué tienen en común una bicicleta y un coche?",
            options: ["Son medios de transporte", "Tienen motores", "Son del mismo color", "Son del mismo tamaño"],
          },
          q5: {
            question: "¿Qué tienen en común el sol y una lámpara?",
            options: ["Ambos emiten luz", "Ambos son redondos", "Ambos funcionan con electricidad", "Ambos son amarillos"],
          },
          q6: {
            question: "¿Qué tienen en común la memoria humana y un ordenador?",
            options: ["Ambos almacenan información", "Ambos están hechos de silicio", "Ambos son máquinas", "Ambos fueron inventados por el ser humano"],
          },
          q7: {
            question: "¿Qué tienen en común la ansiedad y el miedo?",
            options: ["Ambos son emociones", "Ambos son malos", "Ambos son dañinos", "Ambos son enfermedades"],
          },
          q8: {
            question: "¿Qué tienen en común la música y la pintura?",
            options: ["Son formas de expresión artística", "Usan pintura", "Son ruidosas", "Son coloridas"],
          },
          q9: {
            question: "¿Qué tienen en común la sabiduría y la experiencia?",
            options: ["Ambas vienen con el tiempo y el aprendizaje", "Ambas son innatas", "Ambas son teóricas", "Ambas son permanentes"],
          },
          q10: {
            question: "¿Qué tienen en común la libertad y la responsabilidad?",
            options: ["Son interdependientes", "Son opuestas", "Son sinónimas", "Son simples"],
          },
          q11: {
            question: "¿Qué tienen en común la democracia y la justicia?",
            options: ["Ambas buscan el bien común", "Ambas son objetos físicos", "Ambas son inventos recientes", "Ambas son leyes escritas"],
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
            question: "¿Qué tienen en común la luna y el sol?",
            options: ["Ambos son cuerpos celestes", "Ambos son planetas", "Ambos emiten luz propia", "Ambos aparecen solo de día"],
          },
          q19: {
            question: "¿Qué tienen en común una guitarra y un piano?",
            options: ["Ambos son instrumentos musicales", "Ambos son de viento", "Ambos tienen teclas", "Ambos se tocan con arco"],
          },
          q20: {
            question: "¿Qué tienen en común una escuela y una biblioteca?",
            options: ["Ambas son lugares de aprendizaje", "Ambas venden libros", "Ambas tienen aulas", "Ambas cobran entrada"],
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
            question: '¿Qué significa "empático"?',
            options: ["Ser egoísta", "No cuidar de los demás", "Entender las emociones de los demás", "Ser desagradable"],
          },
          q4: {
            question: '¿Qué significa "perspicaz"?',
            options: ["Ser lento", "Ser distraído", "Ser desatento", "Notar cosas rápidamente"],
          },
          q5: {
            question: '¿Qué significa "altruista"?',
            options: ["Ser egoísta", "Ser orgulloso", "Ser alguien que se preocupa por los demás", "Ser individualista"],
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
            question: '¿Qué significa "dicotomía"?',
            options: ["Unión de ideas", "División en dos partes", "Mezcla de conceptos", "Repetición de palabras"],
          },
          q9: {
            question: '¿Qué significa "ubicuo"?',
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
            options: ["Descuidado", "Atento a los detalles", "Rápido", "Sin planificación"],
          },
          q15: {
            question: "¿Qué significa 'efímero'?",
            options: ["Duradero", "Temporal", "Invariable", "Importante"],
          },
          q16: {
            question: "¿Qué significa 'prolífico'?",
            options: ["Produce mucho", "Lento", "Improductivo", "Raro"],
          },
          q17: {
            question: "¿Qué significa 'antagonista'?",
            options: ["Opuesto", "Igual", "Amigable", "Neutral"],
          },
          q18: {
            question: '¿Qué significa "resignado"?',
            options: ["Aceptar sin luchar", "Tener energía", "Ser arrogante", "Ser innovador"],
          },
          q19: {
            question: '¿Qué significa "indócil"?',
            options: ["Difícil de domesticar", "Fácil de entrenar", "De comportamiento amistoso", "Rápido para aprender"],
          },
          q20: {
            question: '¿Qué significa "esotérico"?',
            options: ["Comprendido por pocos", "De fácil comprensión", "Común para todos", "De gran importancia"],
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
            question: "Si el 1.º término es 1, el 2.º es 3 y el 3.º es 6, ¿cuál es el 4.º?",
            options: ["8", "9", "10", "12"],
          },
          q9: {
            question: "Si 3² = 9 y 4² = 16, ¿cuánto es 5²?",
            options: ["20", "21", "23", "25"],
          },
          q10: {
            question: "¿Qué número completa la secuencia: 13, 21, 34, 55, __?",
            options: ["76", "84", "89", "91"],
          },
          q11: {
            question: "Si 2³ = 8 y 3³ = 27, ¿cuánto es 4³?",
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
            options: ["10", "11", "13", "15"],
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
            question: "Completa la secuencia: 9, 12, 15, 18, __",
            options: ["21", "20", "19", "22"],
          },
          q20: {
            question: "¿Qué número completa la secuencia: 2, 5, 8, 11, __?",
            options: ["14", "12", "13", "15"],
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
        },
      },
    },
    notFound: {
      title: "Página no encontrada",
      message: "Esta pantalla no existe.",
    },
  },
};
