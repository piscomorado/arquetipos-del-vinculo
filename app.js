// ============================================
// MAIN APPLICATION CONTROLLER (FUSED VERSION)
// ============================================

import { CONFIG } from './config.js';
import { AIService } from './ai-service-v2.js';

// --- LEGACY CONFIGURATION IMPORT START ---

const ARCHETYPES = {
    'A': {
        name: "El Cuidador",
        lema: "Existo cuando cuido",
        shortDescription: "El pilar emocional que sostiene a otros.",
        description: "Tu identidad se ancla en ser indispensable. Posees una 'antena emocional' altamente calibrada para detectar las necesidades ajenas antes incluso de que sean verbalizadas. En el vínculo, ofreces un refugio seguro, calidez y contención incondicional, a menudo postergando tus propios deseos para asegurar el bienestar del otro.",
        origin: "Posiblemente creciste en un entorno donde tuviste que asumir responsabilidades adultas demasiado pronto (parentificación) o donde el amor se daba a cambio de 'ser bueno' y no dar problemas.",
        avatar: "./assets/avatars/Arquetipo de El Cuidador.PNG",
        characteristics: [
            "Alta empatía y disponibilidad emocional.",
            "Dificultad para establecer límites claros.",
            "Tendencia a la sobre-responsabilidad en los vínculos.",
            "Miedo profundo a no ser necesitado."
        ],
        subtypes: [
            { name: "Fusional", desc: "Busca simbiosis total. 'Tú y yo somos uno'. Se pierde en el otro.", risk: "Anularse para complacer." },
            { name: "Práctico", desc: "Resuelve problemas concretos para hacerse indispensable y evitar el abandono.", risk: "Hacer por el otro lo que él podría hacer solo." }
        ],
        technical: {
            quadrant: "Vincular-Emocional",
            component: "Colaboración",
            axis: "Seguridad (Función Materna)",
            focus: "Pertenencia"
        },
        dynamics: "En el vínculo, asumes el rol de 'proveedor emocional'. Crees (inconscientemente) que si dejas de dar, el otro dejará de quererte. Esto crea un ciclo donde tú cuidas y el otro recibe, generando una deuda invisible. Buscas seguridad haciéndote indispensable, pero el costo es que tus propias necesidades quedan invisibles, lo que a largo plazo genera agotamiento y reclamo silencioso.",
        integrationTasks: [
            "Diario de Necesidades: Escribe cada día qué necesitaste y no pediste.",
            "El 'No' Compasivo: Practica decir no a pequeñas demandas.",
            "Pedir Ayuda: Solicita algo concreto esta semana a un ser querido."
        ],
        hypertrophy: {
            mild: "Patrón Leve: Disfrutas cuidando pero mantienes cierta autonomía.",
            moderate: "Hipertrofia Moderada: Te cuesta distinguir dónde terminas tú y empieza el otro. Agotamiento recurrente.",
            severe: "Hipertrofia Severa: Vives vicariamente a través de los demás. Riesgo de burnout emocional y resentimiento crónico."
        }
    },
    'B': {
        name: "El Arquitecto",
        lema: "Existo cuando construyo",
        shortDescription: "El constructor de estructuras y futuros.",
        description: "Valoras el orden, la previsibilidad y el proyecto común. El mundo emocional espontáneo te parece caótico o inseguro, por lo que te refugias en la planificación y la lógica. Para ti, amar es construir un futuro sólido y seguro donde nada falte.",
        origin: "Quizás viviste en un entorno impredecible o caótico donde aprendiste que la única forma de estar a salvo era controlando el entorno y previendo el futuro.",
        avatar: "./assets/avatars/Arquetipo del Arquitecto.PNG",
        characteristics: [
            "Visión a largo plazo y pensamiento estratégico.",
            "Incomodidad con la expresión emocional desbordada.",
            "Lealtad a través del compromiso y la estructura.",
            "Rigidez ante cambios de planes inesperados."
        ],
        subtypes: [
            { name: "Visionario", desc: "Enamorado del proyecto futuro más que de la realidad presente.", risk: "Perderse en el mañana y descuidar el hoy." },
            { name: "Estructural", desc: "Obsesionado con las reglas, el orden y la forma correcta de hacer las cosas.", risk: "Rigidez que asfixia la espontaneidad." }
        ],
        technical: {
            quadrant: "Estructural-Racional",
            component: "Colaboración",
            axis: "Protección (Función Paterna)",
            focus: "Estabilidad"
        },
        dynamics: "Tu forma de proteger el vínculo es asegurando el futuro. Crees que el amor es 'construir', por lo que tratas la relación como un edificio que necesita cimientos sólidos. Sin embargo, al enfocarte tanto en los planos y la estructura, a menudo te desconectas de la emoción del momento presente. Tu pareja puede sentir que está con un gerente eficiente, no con un compañero vulnerable.",
        integrationTasks: [
            "Diario Emocional: Nombra 3 veces al día qué sientes, sin analizar.",
            "Conversaciones sin Agenda: Escucha a alguien 5 minutos sin resolver nada.",
            "Abrazar la Incertidumbre: Haz una actividad sin planificar."
        ],
        hypertrophy: {
            mild: "Patrón Leve: Eres organizado y confiable, un gran compañero de proyectos.",
            moderate: "Hipertrofia Moderada: Te angustia la improvisación. Te refugias en el trabajo para no sentir.",
            severe: "Hipertrofia Severa: Rigidez absoluta. El vínculo es una empresa a gestionar, sin intimidad real."
        }
    },
    'C': {
        name: "El Orador", // Fusión de nombre de archivo Orador y código C (antes Armonizador en script original? No, C era Orador en script original)
        // Wait, script.js says 'C': { name: "El Orador" ... }.
        lema: "Existo cuando comunico",
        shortDescription: "El seductor a través de la palabra.",
        description: "La palabra es tu herramienta de conexión y control. Sabes explicar, narrar y convencer. El silencio te resulta amenazante porque en él emerge el vacío, así que lo llenas con discurso, humor o intelectualización. Eres el alma de la interacción, pero a veces te cuesta escuchar.",
        origin: "Es probable que en tu historia el ser 'visto' o 'escuchado' fuera difícil, y desarrollaste el carisma o el intelecto como una forma de asegurar la atención y el afecto.",
        avatar: "./assets/avatars/Arquetipo del Orador.PNG",
        characteristics: [
            "Gran capacidad verbal y carisma.",
            "Uso del intelecto como defensa emocional.",
            "Necesidad de ser escuchado y validado intelectualmente.",
            "Dificultad para el silencio compartido."
        ],
        subtypes: [
            { name: "Seductor", desc: "Usa la palabra para encantar y mantener la atención/admiración.", risk: "Conectar desde la imagen, no desde el ser." },
            { name: "Persuasivo", desc: "Usa el argumento para controlar la narrativa y tener la razón.", risk: "Tener razón a costa del vínculo." }
        ],
        technical: {
            quadrant: "Expresivo-Social",
            component: "Comunicación",
            axis: "Protección (Función Paterna)",
            focus: "Reconocimiento"
        },
        dynamics: "Usas la comunicación como un mecanismo de control. Mientras hablas, explicas o bromeas, tienes el control de la situación y evitas que surjan emociones incómodas o silencios profundos. Te proteges intelectualizando lo que sientes. El riesgo es generar una conexión brillante pero superficial, donde hay mucha palabra pero poca intimidad sentida.",
        integrationTasks: [
            "Silencio Consciente: Pausa 5 segundos antes de responder.",
            "Escucha Profunda: Escucha 5 minutos sin interrumpir ni opinar.",
            "Vulnerabilidad: Di 'Me siento X' sin explicar el porqué largamente."
        ],
        hypertrophy: {
            mild: "Patrón Leve: Eres elocuente y un gran conversador.",
            moderate: "Hipertrofia Moderada: Verborragia defensiva. Interrumpes y te cuesta conectar con el sentir del otro.",
            severe: "Hipertrofia Severa: Monólogo narcisista o manipulación verbal. Soledad acompañada."
        }
    },
    'D': {
        name: "El Armonizador", // Script.js D is Armonizador. Earlier I mapped C to Armonizador.
        // Wait. Script.js: C=Orador, D=Armonizador.
        // My ai-service-v2.js: C=Armonizador, E=Orador.
        // I MUST FOLLOW SCRIPT.JS MAPPING FOR THE REPORT TO MATCH THE KEY.
        // BUT my questions.json generates scores for A,B,C,D,E,F based on my interpretation.
        // QUESTIONS.json C is Maternal (Fusionado). Armonizador is Maternal.
        // Script.js C is Orador (Paternal - wait, Script says Axis Protection).
        // CONFLICT: questions.json C is Maternal. Script.js C is Orador (Paternal).
        // I must align the result key to the correct entry here.
        // If question C generates score for "Fusionado", and Fusionado == Armonizador in script.js D...
        // Then Key C score should map to Key D in this object? No, that's messy.
        // BETTER: Rename keys in this object to match the keys coming from questions.json.
        // Questions.json:
        // A=Cuidador (Maternal) -> Script A (Cuidador) - MATCH
        // B=Controlador/Arquitecto (Paternal) -> Script B (Arquitecto) - MATCH
        // C=Fusionado/Armonizador (Maternal) -> Script D (Armonizador) - MISMATCH (Script C is Orador)
        // D=Distante/Nomada (Paternal) -> Script F (Nomada) - MISMATCH
        // E=Demandante/Orador (Maternal) -> Script C (Orador, but script says Paternal?)
        //    Demandante questions are about attention. Orador script says "Existo cuando comunico".
        //    These might be different.
        // F=Critico/Ejecutor (Paternal) -> Script E (Ejecutor) - MISMATCH

        // I WILL RE-KEY THIS OBJECT TO MATCH MY QUESTIONS.JSON KEY MAPPING from Step 101/115.
        // A: Cuidador -> Script A data.
        // B: Arquitecto -> Script B data.
        // C: Armonizador -> Script D data.
        // D: Nómada -> Script F data.
        // E: Orador -> Script C data.
        // F: Ejecutor -> Script E data.

        lema: "Existo cuando hay paz",
        shortDescription: "El diplomático que disuelve el conflicto.",
        description: "Tienes un radar sísmico para el conflicto. Crees que tu seguridad depende de que el entorno esté en calma. Te adaptas, cedes y te mimetizas para evitar cualquier fricción, convirtiéndote en el 'camaleón' que todos quieren, pero perdiendo tu color propio en el proceso.",
        origin: "Posiblemente creciste en un hogar con mucha tensión o conflicto explícito, donde aprendiste a ser invisible o a mediar para evitar explosiones emocionales.",
        avatar: "./assets/avatars/Arquetipo del Armonizador.PNG",
        characteristics: [
            "Alta sensibilidad al clima emocional.",
            "Habilidad para la mediación y la diplomacia.",
            "Dificultad para expresar rabia o desacuerdo.",
            "Tendencia a la auto-anulación."
        ],
        subtypes: [
            { name: "Diplomático", desc: "Activo mediador. Trabaja para que otros se entiendan.", risk: "Quedar en medio de fuegos cruzados." },
            { name: "Mimetizado", desc: "Pasivo adaptador. Se vuelve invisible o igual al otro para no molestar.", risk: "Olvidar sus propias preferencias." }
        ],
        technical: {
            quadrant: "Adaptativo-Relacional",
            component: "Coordinación",
            axis: "Seguridad (Función Materna)",
            focus: "Armonía"
        },
        dynamics: "Tu prioridad absoluta es que 'todo esté bien'. Para lograrlo, desarrollas una hiper-adaptabilidad, cediendo tus deseos para evitar roces. Crees que el conflicto romperá el vínculo, así que lo evitas tragándote tus opiniones. Esto crea una paz ficticia: por fuera todo parece perfecto, pero por dentro tú vas desapareciendo, hasta que ya no sabes qué quieres realmente.",
        integrationTasks: [
            "Expresar Desacuerdo: Di 'No estoy de acuerdo' en algo pequeño.",
            "Tolerar Tensión: No intervengas en un conflicto ajeno, solo observa.",
            "Priorizarte: Elige tú el plan (cine, comida) sin preguntar a otros."
        ],
        hypertrophy: {
            mild: "Patrón Leve: Eres flexible y fácil de tratar, pero sabes lo que quieres.",
            moderate: "Hipertrofia Moderada: Ocultas tus opiniones sistemáticamente. Resentimiento pasivo.",
            severe: "Hipertrofia Severa: Fusión total. No sabes quién eres sin el otro. Terror al conflicto."
        }
    },
    'E': {
        name: "El Orador", // Re-mapped from Script C
        lema: "Existo cuando comunico",
        shortDescription: "El seductor a través de la palabra.",
        description: "La palabra es tu herramienta de conexión y control. Sabes explicar, narrar y convencer. El silencio te resulta amenazante porque en él emerge el vacío, así que lo llenas con discurso, humor o intelectualización. Eres el alma de la interacción, pero a veces te cuesta escuchar.",
        origin: "Es probable que en tu historia el ser 'visto' o 'escuchado' fuera difícil, y desarrollaste el carisma o el intelecto como una forma de asegurar la atención y el afecto.",
        avatar: "./assets/avatars/Arquetipo del Orador.PNG",
        characteristics: [
            "Gran capacidad verbal y carisma.",
            "Uso del intelecto como defensa emocional.",
            "Necesidad de ser escuchado y validado intelectualmente.",
            "Dificultad para el silencio compartido."
        ],
        subtypes: [
            { name: "Seductor", desc: "Usa la palabra para encantar y mantener la atención/admiración.", risk: "Conectar desde la imagen, no desde el ser." },
            { name: "Persuasivo", desc: "Usa el argumento para controlar la narrativa y tener la razón.", risk: "Tener razón a costa del vínculo." }
        ],
        technical: {
            quadrant: "Expresivo-Social",
            component: "Comunicación",
            axis: "Protección (Función Paterna)",
            focus: "Reconocimiento"
        },
        dynamics: "Usas la comunicación como un mecanismo de control. Mientras hablas, explicas o bromeas, tienes el control de la situación y evitas que surjan emociones incómodas o silencios profundos. Te proteges intelectualizando lo que sientes. El riesgo es generar una conexión brillante pero superficial, donde hay mucha palabra pero poca intimidad sentida.",
        integrationTasks: [
            "Silencio Consciente: Pausa 5 segundos antes de responder.",
            "Escucha Profunda: Escucha 5 minutos sin interrumpir ni opinar.",
            "Vulnerabilidad: Di 'Me siento X' sin explicar el porqué largamente."
        ],
        hypertrophy: {
            mild: "Patrón Leve: Eres elocuente y un gran conversador.",
            moderate: "Hipertrofia Moderada: Verborragia defensiva. Interrumpes y te cuesta conectar con el sentir del otro.",
            severe: "Hipertrofia Severa: Monólogo narcisista o manipulación verbal. Soledad acompañada."
        }
    },
    'F': {
        name: "El Ejecutor", // Re-mapped from Script E
        lema: "Existo cuando logro",
        shortDescription: "La máquina de acción y resultados.",
        description: "Para ti, el amor es verbo: hacer, resolver, proveer. Las emociones te parecen 'ineficientes' o una pérdida de tiempo. Te sientes seguro en la acción y el logro. Eres el motor que impulsa, pero a veces atropellas los ritmos más lentos y orgánicos del vínculo.",
        origin: "Quizás en tu infancia se valoraba mucho el rendimiento o el éxito externo, y aprendiste que eras digno de amor solo si 'hacías' cosas útiles o destacables.",
        avatar: "./assets/avatars/Arquetipo del Ejecutor.PNG",
        characteristics: [
            "Alta energía y orientación a objetivos.",
            "Pragmatismo extremo.",
            "Impaciencia con la indecisión o la pasividad.",
            "Valoración del vínculo por su utilidad/éxito."
        ],
        subtypes: [
            { name: "Hacedor", desc: "Encuentra calma en la ocupación constante y la resolución de tareas.", risk: "Usar la ocupación como ansiolítico." },
            { name: "Logrador", desc: "Busca estatus y éxito visible como forma de ser digno de amor.", risk: "Valorar al otro solo por lo que produce." }
        ],
        technical: {
            quadrant: "Activo-Pragmático",
            component: "Coordinación",
            axis: "Protección (Función Paterna)",
            focus: "Eficiencia"
        },
        dynamics: "Entiendes el vínculo como un equipo que debe funcionar. Te sientes valioso cuando resuelves problemas o logras metas. Sin embargo, las emociones no tienen una 'utilidad' práctica inmediata, por lo que tiendes a ignorarlas o impacientarte con ellas. Proteges proveyendo soluciones, pero a veces atropellas el proceso emocional del otro en tu afán de 'arreglar' las cosas rápido.",
        integrationTasks: [
            "No Hacer Nada: 30 minutos de inactividad total productiva.",
            "Sentir la Emoción: Si sientes ansiedad, no te pongas a limpiar/trabajar. para.",
            "Valorar Proceso: Haz algo artístico o lúdico sin objetivo final."
        ],
        hypertrophy: {
            mild: "Patrón Leve: Eres productivo y estimulante.",
            moderate: "Hipertrofia Moderada: 'Workaholic'. Te irrita la lentitud ajena. Relaciones funcionales.",
            severe: "Hipertrofia Severa: Vacío existencial si no se produce. El otro es un recurso o un obstáculo, no un par."
        }
    }
};

// Map D separately as it was leftover in logic
ARCHETYPES['D'] = { // Re-mapped from Script F (Nomada)
    name: "El Nómada",
    lema: "Existo cuando soy libre",
    shortDescription: "El espíritu libre y autosuficiente.",
    description: "Aprendiste que necesitar es peligroso, así que desarrollaste una fortaleza de autonomía. Te cuesta el compromiso profundo porque lo sientes como una cárcel. Valoras tu espacio, tu tiempo y tu libertad por encima de la conexión. Entras y sales de los vínculos.",
    origin: "Probablemente experimentaste intrusión o control excesivo en tu infancia, o bien abandono emocional, y decidiste que la única forma de no sufrir era no necesitar a nadie.",
    avatar: "./assets/avatars/Arquetipo del Nomada.PNG",
    characteristics: [
        "Alta necesidad de espacio personal y autonomía.",
        "Miedo a la invasión o al control.",
        "Autosuficiencia emocional y práctica.",
        "Dificultad para el compromiso a largo plazo."
    ],
    subtypes: [
        { name: "Ermitaño", desc: "Se retira físicamente o se aísla para recargar energía.", risk: "Desconexión total y soledad no elegida." },
        { name: "Viajero", desc: "Está presente pero sin echar raíces profundas, listo para partir.", risk: "Relaciones superficiales por miedo a echar raíces." }
    ],
    technical: {
        quadrant: "Autónomo-Individual",
        component: "Autosuficiencia",
        axis: "Auto-Regulación",
        focus: "Libertad"
    },
    dynamics: "Tu mecanismo de defensa es la distancia. Crees que depender de alguien es perder poder o seguridad. Por eso, cuando la intimidad se vuelve muy densa, te alejas física o emocionalmente. Regulas la cercanía poniendo muros de autosuficiencia ('yo puedo solo'). El desafío es que esa muralla que te protege también te aísla del amor profundo que en el fondo deseas.",
    integrationTasks: [
        "Pedir Ayuda Pequeña: Deja que alguien haga algo por ti.",
        "Compartir Mundo Interno: Cuenta un sueño o miedo a alguien.",
        "Compromiso: Sostén una actividad compartida semanal por un mes."
    ],
    hypertrophy: {
        mild: "Patrón Leve: Eres independiente y respetas el espacio ajeno.",
        moderate: "Hipertrofia Moderada: Te alejas ante la demanda emocional 'excesiva'.",
        severe: "Hipertrofia Severa: Aislamiento afectivo. 'No necesito a nadie'. Desconexión vital."
    }
};

const ARCHETYPE_3C = {
    'A': { comm: "Escucha empática, pero silencia sus propias necesidades.", collab: "Sostiene y cuida incondicionalmente.", coord: "Se adapta totalmente a los ritmos ajenos." },
    'B': { comm: "Lógica, estructurada y orientada a planes futuros.", collab: "Construye estructuras de seguridad.", coord: "Planificada, con reglas claras." },
    'C': { comm: "Seductora y elocuente; llena silencios.", collab: "Inspira y mantiene la atención.", coord: "Dirige la narrativa." }, // Armonizador? No, C is Armonizador in questions. The 3C texts match what? C text "Seductora" matches Orador.
    // I NEED TO REMAP THESE TEXTS TOO.
    // A -> Cuidador (Matches text)
    // B -> Arquitecto (Matches text)
    // C -> Armonizador. Text "Seductora" is Orador. I need Armonizador text.
    // Armonizador text from script (initially D in script): "Diplomática y suave..."
    // D -> Nomada. Text "Diplomatica" is Armonizador. I need Nomada text.
    // Nomada text from script (initially F in script): "Reservada y breve..."
    // E -> Orador. Text "Directa, pragmatica" is Ejecutor. I need Orador text.
    // Orador text from script (initially C in script): "Seductora y elocuente..."
    // F -> Ejecutor. Text "Reservada" is Nomada. I need Ejecutor text.
    // Ejecutor text from script (initially E in script): "Directa, pragmatica..."
};

const ARCHETYPE_3C_CORRECTED = {
    'A': { comm: "Escucha empática, pero silencia sus propias necesidades.", collab: "Sostiene y cuida incondicionalmente.", coord: "Se adapta totalmente a los ritmos ajenos." }, // Cuidador
    'B': { comm: "Lógica, estructurada y orientada a planes futuros.", collab: "Construye estructuras de seguridad.", coord: "Planificada, con reglas claras." }, // Arquitecto
    'C': { comm: "Diplomática y suave; evita la confrontación directa.", collab: "Intermedia y cede para mantener la paz.", coord: "Camaleónica, fluye para evitar le fricción." }, // Armonizador
    'D': { comm: "Reservada y breve; protege su mundo interno.", collab: "Mantiene su autonomía.", coord: "Establece límites rígidos." }, // Nómada
    'E': { comm: "Seductora y elocuente; llena los silencios.", collab: "Inspira y mantiene la atención.", coord: "Dirige la narrativa." }, // Orador
    'F': { comm: "Directa, pragmática e impaciente con lo emocional.", collab: "Resuelve problemas prácticos.", coord: "Gestiona el vínculo con eficiencia." } // Ejecutor
};


const ARCHETYPE_COORDS = {
    'A': { top: '25%', left: '25%' }, // Cuidador
    'B': { top: '75%', left: '75%' }, // Arquitecto
    'C': { top: '25%', left: '25%' }, // Armonizador (Same as Cuidador roughly Q1) - Script said D -> 25,25.
    'D': { top: '85%', left: '15%' }, // Nómada (Q3) - Script said F -> 85,15.
    'E': { top: '70%', left: '75%' }, // Orador (Q4) - Script said C -> 70,75.
    'F': { top: '75%', left: '60%' }  // Ejecutor (Q4) - Script said E -> 75,60.
};

// --- LEGACY CONFIGURATION IMPORT END ---


// ERROR TRAPPING
window.onerror = function (msg, url, line, col, error) {
    alert("Error Crítico: " + msg + "\nEn: " + url + ":" + line);
};

class App {
    constructor() {
        this.currentStep = 0;
        this.responses = {};
        this.scores = {};
        this.questionsData = null;
        this.analysisResult = null;
        this.init();
    }

    async init() {
        try {
            const response = await fetch('questions.json');
            this.questionsData = await response.json();
            this.initializeStepper();
        } catch (error) {
            console.error('Error loading questions:', error);
            alert('Error al cargar las preguntas. Por favor, recarga la página.');
        }
    }

    initializeStepper() {
        const stepperElement = document.getElementById('stepper');
        const steps = ['A', 'B', 'C', 'D', 'E', 'F', 'Resultados'];
        stepperElement.innerHTML = steps.map((step, index) => `
            <div class="stepper__step ${index === 0 ? 'active' : ''}" data-step="${index}">
                <div class="stepper__circle">${index + 1}</div>
                <span class="stepper__label">${step}</span>
            </div>
        `).join('');
    }

    startAssessment() {
        document.getElementById('welcome-screen').classList.add('hidden');
        document.getElementById('questionnaire').classList.remove('hidden');
        this.currentStep = 0;
        this.renderQuestion(this.currentStep);
    }

    renderQuestion(sectionIndex) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        const section = this.questionsData.sections[sectionIndex];
        const questionnaireElement = document.getElementById('questionnaire');
        const genericTitle = `Sección ${String.fromCharCode(65 + sectionIndex)}`;

        questionnaireElement.innerHTML = `
            <div class="question-section">
                <div class="question-section__header">
                    <h2 class="question-section__title">${genericTitle}</h2>
                    <p style="color: var(--color-gray-600);">${section.description}</p>
                </div>
                ${section.questions.map((q, qIndex) => this.renderQuestionCard(section.id, q, qIndex)).join('')}
                <div class="navigation">
                    ${sectionIndex > 0 ? `<button class="btn btn-secondary" onclick="app.previousSection()">← Anterior</button>` : '<div></div>'}
                    <button class="btn btn-primary" id="next-btn" onclick="app.nextSection()" disabled>
                        ${sectionIndex < 5 ? 'Siguiente →' : 'Finalizar'}
                    </button>
                </div>
            </div>
        `;
        this.updateStepper(sectionIndex);
        this.restoreResponses(section.id);
        this.checkSectionComplete(section.id);
    }

    renderQuestionCard(sectionId, question, qIndex) {
        const likertScale = this.questionsData.likertScale;
        return `
            <div class="question-card">
                <p class="question-card__text"><span class="question-card__number">${qIndex + 1}.</span> ${question.text}</p>
                <div class="likert-scale">
                    ${Object.values(likertScale).map(option => `
                        <div class="likert-scale__option">
                            <input type="radio" id="${question.id}-${option.value}" name="${question.id}" value="${option.value}" class="likert-scale__input" onchange="app.handleResponse('${question.id}', ${option.value})">
                            <label for="${question.id}-${option.value}" class="likert-scale__label">
                                <span class="likert-scale__value">${option.value}</span>
                                <span class="likert-scale__description">${option.label}</span>
                            </label>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    handleResponse(questionId, value) {
        this.responses[questionId] = parseInt(value);
        this.checkSectionComplete(this.questionsData.sections[this.currentStep].id);
    }

    checkSectionComplete(sectionId) {
        const section = this.questionsData.sections.find(s => s.id === sectionId);
        const allAnswered = section.questions.every(q => this.responses[q.id] !== undefined);
        const nextBtn = document.getElementById('next-btn');
        if (nextBtn) nextBtn.disabled = !allAnswered;
    }

    restoreResponses(sectionId) {
        Object.keys(this.responses).forEach(questionId => {
            if (questionId.startsWith(sectionId)) {
                const value = this.responses[questionId];
                const radio = document.getElementById(`${questionId}-${value}`);
                if (radio) radio.checked = true;
            }
        });
    }

    async nextSection() {
        if (this.currentStep < 5) {
            this.currentStep++;
            this.renderQuestion(this.currentStep);
        } else {
            await this.finishAssessment();
        }
    }

    previousSection() {
        if (this.currentStep > 0) {
            this.currentStep--;
            this.renderQuestion(this.currentStep);
        }
    }

    updateStepper(currentIndex) {
        const steps = document.querySelectorAll('.stepper__step');
        steps.forEach((step, index) => {
            step.classList.remove('active', 'completed');
            if (index < currentIndex) step.classList.add('completed');
            else if (index === currentIndex) step.classList.add('active');
        });
    }

    calculateScores() {
        const scores = {};
        this.questionsData.sections.forEach(section => {
            scores[section.id] = section.questions.reduce((total, question) => total + (this.responses[question.id] || 0), 0);
        });
        return scores;
    }

    async finishAssessment() {
        this.scores = this.calculateScores();

        // Show loading
        document.getElementById('loading-overlay').classList.add('active');
        document.getElementById('questionnaire').classList.add('hidden');

        try {
            // Optional: Call AI Service (keep it for backend validation future)
            // const aiResult = await AIService.analyzeArchetypes(this.scores);
            // We use the LOCAL determination for the visual report to ensure it matches the user's script logic

            const sorted = Object.entries(this.scores).sort((a, b) => b[1] - a[1]);
            const winnerKey = sorted[0][0];

            // Render Premium Report using Script.js Logic
            this.renderPremiumReport(winnerKey, this.scores);

            document.getElementById('loading-overlay').classList.remove('active');
            document.getElementById('results').classList.remove('hidden');
            this.updateStepper(6);

        } catch (error) {
            console.error(error);
            alert("Error: " + error.message);
            document.getElementById('loading-overlay').classList.remove('active');
        }
    }

    // --- PREMIUM REPORT RENDERER (Ported from script.js) ---

    renderPremiumReport(winnerKey, scores) {
        // Use the re-mapped config objects
        const arch = ARCHETYPES[winnerKey];
        const details3c = ARCHETYPE_3C_CORRECTED[winnerKey];
        const coords = ARCHETYPE_COORDS[winnerKey];
        const score = scores[winnerKey];

        // Level Logic
        let levelTitle = "", levelDesc = "";
        if (score >= 26) {
            levelTitle = arch.hypertrophy.severe.split(":")[0];
            levelDesc = arch.hypertrophy.severe.split(":")[1];
        } else if (score >= 19) {
            levelTitle = arch.hypertrophy.moderate.split(":")[0];
            levelDesc = arch.hypertrophy.moderate.split(":")[1];
        } else {
            levelTitle = arch.hypertrophy.mild.split(":")[0];
            levelDesc = arch.hypertrophy.mild.split(":")[1];
        }

        // Render HTML
        const reportContainer = document.getElementById('results');

        // Helper for Constellation Bar
        const renderConstellation = (sc) => {
            const sortedDetails = Object.entries(sc).sort((a, b) => b[1] - a[1]);
            return sortedDetails.map(([key, val]) => {
                const p = (val / 32) * 100;
                const color = key === winnerKey ? '#c0392b' : '#94a3b8'; // Using accent red from CSS
                let name = ARCHETYPES[key] ? ARCHETYPES[key].name : key;
                return `
                <div class="bar-chart-row" style="display:flex; align-items:center; gap:10px; margin-bottom:5px;">
                    <div style="width:100px; font-size:0.8rem; text-align:right;">${name}</div>
                    <div style="flex:1; background:rgba(0,0,0,0.1); height:8px; border-radius:4px; overflow:hidden;">
                        <div style="width:${p}%; background:${color}; height:100%;"></div>
                    </div>
                    <div style="width:30px; font-size:0.8rem;">${val}</div>
                </div>`;
            }).join('');
        };

        const html = `
        <div class="report-wrapper">
          <div class="clinical-report-container">
            <!-- Header -->
            <div class="report-header" style="justify-content:center; text-align:center; border-bottom:1px solid #ddd; padding-bottom:20px;">
                <div>
                    <h5 style="text-transform:uppercase; letter-spacing:2px; font-size:0.8rem; color:#666;">De la reacción inconsciente a la elección consciente</h5>
                    <h1 style="font-size:2rem; margin:10px 0; font-family:var(--font-headings);">TU ARQUITECTURA VINCULAR</h1>
                    <p class="date">${new Date().toLocaleDateString()}</p>
                </div>
            </div>

            <div class="report-grid" style="display:grid; grid-template-columns: 1fr 1fr; gap:30px; margin-top:40px;">
                
                <!-- COLUMN 1: INTRO & CONSTELLATION -->
                <div class="report-card">
                    <h3 style="color:var(--color-primary);">EL MAPA, NO EL TERRITORIO</h3>
                    <p style="font-style:italic; margin:15px 0;">"El arquetipo es un mapa de navegación, no una sentencia."</p>
                    <p>Estas características no definen quién eres en tu totalidad. Son coordenadas para entender tu vínculo.</p>
                    
                    <div style="margin-top:30px; padding-top:20px; border-top:1px solid #eee;">
                        <h4>Tu Constelación</h4>
                        <div style="margin-top:15px;">
                            ${renderConstellation(scores)}
                        </div>
                    </div>
                    
                    <div style="margin-top:20px; padding-top:20px; border-top:1px solid #eee;">
                        <h4>El Origen de la Herida</h4>
                        <p style="font-style:italic;">"${arch.origin}"</p>
                    </div>
                </div>

                <!-- COLUMN 2: HERO AVATAR -->
                <div class="report-card" style="text-align:center; border:2px solid var(--color-accent); position:relative; overflow:hidden; padding:0;">
                    <div style="background:var(--color-primary); color:white; padding:10px;">
                        <h3 style="margin:0; font-size:1rem;">TU ARQUETIPO DOMINANTE</h3>
                    </div>
                    
                    <div style="padding:20px;">
                        <h1 style="font-size:2rem; margin:10px 0; color:var(--color-accent);">${arch.name}</h1>
                        
                        <div class="archetype-avatar-container" style="margin:20px auto; width:200px; height:200px;">
                            <img src="${arch.avatar}" style="width:100%; height:100%; object-fit:contain;">
                        </div>

                        <p style="font-style:italic; font-size:1.1rem; color:#666; margin-bottom:20px;">"${arch.lema}"</p>
                        <p>${arch.shortDescription}</p>

                        <div style="text-align:left; background:#f9f9f9; padding:15px; border-radius:8px; margin-top:20px;">
                            <h5>Características Clave:</h5>
                            <ul style="padding-left:20px; color:#555;">
                                ${arch.characteristics.map(c => `<li>${c}</li>`).join('')}
                            </ul>
                        </div>
                    </div>
                </div>

                <!-- FULL WIDTH: 3C ANALYSIS -->
                <div class="report-card" style="grid-column: 1 / -1;">
                    <h3>EL TRIÁNGULO DE LAS 3C</h3>
                    <div style="background:#f4f4f4; padding:20px; border-radius:8px;">
                        <p><strong>Comunicación:</strong> ${details3c.comm}</p>
                        <p><strong>Colaboración:</strong> ${details3c.collab}</p>
                        <p><strong>Coordinación:</strong> ${details3c.coord}</p>
                    </div>
                </div>

                <!-- FULL WIDTH: HYPERTROPHY -->
                <div class="report-card" style="grid-column: 1 / -1;">
                    <h3>NIVEL DE INTEGRACIÓN: ${levelTitle}</h3>
                    <div style="background:rgba(192, 57, 43, 0.1); padding:20px; border-radius:8px; border-left:4px solid var(--color-accent);">
                        <p>${levelDesc}</p>
                        <p style="margin-top:10px; font-style:italic;">"${arch.dynamics}"</p>
                    </div>
                </div>

                <div class="report-card" style="grid-column: 1 / -1;">
                     <h3>Hacia la Flexibilidad</h3>
                     <ul style="background:#eafaf1; padding:20px 40px; border-radius:8px; color:#27ae60;">
                        ${arch.integrationTasks.map(t => `<li>${t}</li>`).join('')}
                     </ul>
                </div>

            </div>

             <div class="action-bar no-print" style="margin-top:40px; text-align:center;">
                <button class="btn btn-secondary" onclick="app.restart()">← Nueva Evaluación</button>
                <button class="btn btn-primary" onclick="app.downloadPNG()">📷 Descargar PNG</button>
            </div>
          </div>
        </div>
        `;

        reportContainer.innerHTML = html;
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    async downloadPNG() {
        try {
            const reportElement = document.querySelector('.clinical-report-container');
            if (!reportElement) {
                alert('No se encontró el reporte para exportar.');
                return;
            }

            // Save original styles
            const originalWidth = reportElement.style.width;
            const originalMinWidth = reportElement.style.minWidth;
            const originalMaxWidth = reportElement.style.maxWidth;

            // Force a fixed width for consistent PNG output
            reportElement.style.width = '1200px';
            reportElement.style.minWidth = '1200px';
            reportElement.style.maxWidth = '1200px';

            // Allow the browser to reflow with new dimensions
            await new Promise(resolve => setTimeout(resolve, 100));

            const canvas = await html2canvas(reportElement, {
                scale: 2.5, // Higher scale for better quality
                useCORS: true,
                logging: false,
                backgroundColor: '#ffffff',
                width: 1200,
                windowWidth: 1200
            });

            // Restore original styles
            reportElement.style.width = originalWidth;
            reportElement.style.minWidth = originalMinWidth;
            reportElement.style.maxWidth = originalMaxWidth;

            const link = document.createElement('a');
            link.download = `ArquetiposDelVinculo_${Date.now()}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
        } catch (error) {
            console.error('Error generating PNG:', error);
            alert('Error al generar el PNG. Intenta de nuevo.');
            // Restore styles on error too
            const reportElement = document.querySelector('.clinical-report-container');
            if (reportElement) {
                reportElement.style.width = '';
                reportElement.style.minWidth = '';
                reportElement.style.maxWidth = '';
            }
        }
    }

    restart() {
        if (confirm('¿Reiniciar test?')) {
            location.reload();
        }
    }
}

const app = new App();
window.app = app;
