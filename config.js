// ============================================
// CONFIGURATION FILE
// ============================================
// NOTE: API key has been moved to Vercel environment variables
// for security. Configure GEMINI_API_KEY in Vercel dashboard.

export const CONFIG = {
    // ============================================
    // SCORING SYSTEM
    // ============================================
    scoring: {
        minPerQuestion: 1,        // Minimum points per question
        maxPerQuestion: 4,        // Maximum points per question (Likert scale 1-4)
        questionsPerSection: 8,   // 8 questions per archetype
        maxPerSection: 32,        // Maximum score per section (8 × 4)
        totalSections: 6,         // 6 archetypes (A-F)
        tieBreakerThreshold: 2    // Activate tie-breaker if difference ≤ 2 points (adjusted for smaller scale)
    },

    // ============================================
    // ADEQUACY SCALE (from Morales Ángel framework)
    // ============================================
    adequacyScale: {
        severeHypertrophy: {
            min: 26,
            max: 32,
            label: 'Hipertrofia Severa',
            description: 'Estructura rígida/defensiva',
            color: '#e74c3c'
        },
        moderateHypertrophy: {
            min: 20,
            max: 25,
            label: 'Hipertrofia Moderada',
            description: 'Patrón recurrente',
            color: '#f39c12'
        },
        flexiblePattern: {
            min: 14,
            max: 19,
            label: 'Patrón Flexible',
            description: 'Conciencia emergente',
            color: '#3498db'
        },
        fullIntegration: {
            min: 8,
            max: 13,
            label: 'Integración Plena',
            description: 'El arquetipo como un don',
            color: '#27ae60'
        }
    },

    // ============================================
    // ARCHETYPE DEFINITIONS
    // ============================================
    archetypes: {
        A: {
            name: 'Arquetipo A',
            category: 'maternal', // maternal or paternal
            description: 'Descripción del arquetipo A'
        },
        B: {
            name: 'Arquetipo B',
            category: 'paternal',
            description: 'Descripción del arquetipo B'
        },
        C: {
            name: 'Arquetipo C',
            category: 'maternal',
            description: 'Descripción del arquetipo C'
        },
        D: {
            name: 'Arquetipo D',
            category: 'paternal',
            description: 'Descripción del arquetipo D'
        },
        E: {
            name: 'Arquetipo E',
            category: 'maternal',
            description: 'Descripción del arquetipo E'
        },
        F: {
            name: 'Arquetipo F',
            category: 'paternal',
            description: 'Descripción del arquetipo F'
        }
    },

    // ============================================
    // UI CONFIGURATION
    // ============================================
    ui: {
        enableAnimations: true,
        showProgressBar: true,
        allowBackNavigation: true,
        theme: 'clinical' // clinical, light, dark
    }
};
