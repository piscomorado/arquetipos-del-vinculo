// ============================================
// VERCEL SERVERLESS FUNCTION - GEMINI AI ANALYZE
// ============================================
// This function securely calls Gemini API with the API key
// stored in environment variables, never exposed to the client.

export default async function handler(req, res) {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // CORS headers for local development
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    try {
        const { scores } = req.body;

        if (!scores) {
            return res.status(400).json({ error: 'Scores are required' });
        }

        // Get API key from environment variable (SECURE!)
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            console.error('GEMINI_API_KEY not configured');
            return res.status(500).json({ error: 'API key not configured' });
        }

        // Build the clinical prompt
        const prompt = buildClinicalPrompt(scores);

        // Call Gemini API
        const endpoint = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';
        const url = `${endpoint}?key=${apiKey}`;

        const requestBody = {
            contents: [{
                parts: [{
                    text: prompt
                }]
            }],
            generationConfig: {
                temperature: 0.7,
                topK: 40,
                topP: 0.95,
                maxOutputTokens: 4096,
            },
            safetySettings: [
                {
                    category: "HARM_CATEGORY_HARASSMENT",
                    threshold: "BLOCK_NONE"
                },
                {
                    category: "HARM_CATEGORY_HATE_SPEECH",
                    threshold: "BLOCK_NONE"
                },
                {
                    category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                    threshold: "BLOCK_NONE"
                },
                {
                    category: "HARM_CATEGORY_DANGEROUS_CONTENT",
                    threshold: "BLOCK_NONE"
                }
            ]
        };

        const geminiResponse = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody)
        });

        if (!geminiResponse.ok) {
            const errorData = await geminiResponse.json();
            console.error('Gemini API Error:', errorData);
            return res.status(500).json({
                error: `API Error: ${geminiResponse.status}`,
                details: errorData.error?.message || 'Unknown error'
            });
        }

        const data = await geminiResponse.json();

        if (!data.candidates || data.candidates.length === 0) {
            return res.status(500).json({ error: 'No response from AI model' });
        }

        const responseText = data.candidates[0].content.parts[0].text;

        // Return the analysis
        return res.status(200).json({
            success: true,
            reportHTML: responseText
        });

    } catch (error) {
        console.error('Serverless function error:', error);
        return res.status(500).json({
            error: 'Internal server error',
            details: error.message
        });
    }
}

/**
 * Builds the clinical psychologist prompt
 */
function buildClinicalPrompt(scores) {
    const scoresText = Object.entries(scores)
        .map(([section, score]) => `Sección ${section}: ${score} puntos`)
        .join('\n');

    return `Actúa como un **Psicólogo Clínico experto** y motor de análisis para la aplicación 'Arquetipos del Vínculo'. Tu base teórica son los documentos de Andrés Morales Ángel sobre la Función Materna (Nutrición) y Paterna (Protección).

**DATOS DEL PACIENTE:**
${scoresText}

**ESCALA DE ADECUACIÓN:**
**ESCALA DE ADECUACIÓN:**
- 26-32 pts: Hipertrofia Severa (Estructura rígida/defensiva)
- 20-25 pts: Hipertrofia Moderada (Patrón recurrente)
- 14-19 pts: Patrón Flexible (Conciencia emergente)
- 8-13 pts: Integración Plena (El arquetipo como un don)

**ARQUETIPOS:**
- Arquetipo A: El Salvador (Función Materna)
- Arquetipo B: El Controlador (Función Paterna)
- Arquetipo C: El Fusionado (Función Materna)
- Arquetipo D: El Distante (Función Paterna)
- Arquetipo E: El Demandante (Función Materna)
- Arquetipo F: El Crítico (Función Paterna)

**TU TAREA:**
1. Identifica el **Arquetipo Dominante** (mayor puntaje)
2. Clasifica según la Escala de Adecuación
3. Determina si es subtipo "Fusional" o "Práctico" según la teoría

**GENERA UN REPORTE HTML CON ESTA ESTRUCTURA EXACTA:**

<div class="results__section">
  <h3 class="results__section-title">🔍 El Espejo Clínico</h3>
  <p><strong>Arquetipo Dominante:</strong> [Nombre del arquetipo]</p>
  <p><strong>Nivel de Integración:</strong> [Nivel según escala]</p>
  <p><strong>Subtipo:</strong> [Fusional/Práctico]</p>
  <p>[Descripción de cómo se manifiesta la herida en la Función Materna o Paterna. Sé específico, empático y clínico. 3-4 párrafos.]</p>
</div>

<div class="results__section">
  <h3 class="results__section-title">💡 Comprensión de tu Patrón</h3>
  <p>[Explica el origen y función defensiva de este patrón. Ayuda al paciente a entender POR QUÉ desarrolló este arquetipo. 2-3 párrafos.]</p>
</div>

<div class="results__section">
  <h3 class="results__section-title">🌱 Ruta de Transformación</h3>
  <p>Estos ejercicios prácticos te ayudarán a integrar este arquetipo de forma saludable:</p>
  
  <div style="background: var(--color-secondary-light); padding: 1.5rem; border-radius: 0.5rem; margin: 1rem 0;">
    <h4 style="color: var(--color-accent); margin-top: 0;">Ejercicio 1: [Título]</h4>
    <p>[Descripción detallada del ejercicio basado en la metodología de Andrés Morales Ángel]</p>
  </div>
  
  <div style="background: var(--color-secondary-light); padding: 1.5rem; border-radius: 0.5rem; margin: 1rem 0;">
    <h4 style="color: var(--color-accent); margin-top: 0;">Ejercicio 2: [Título]</h4>
    <p>[Descripción detallada del ejercicio]</p>
  </div>
  
  <div style="background: var(--color-secondary-light); padding: 1.5rem; border-radius: 0.5rem; margin: 1rem 0;">
    <h4 style="color: var(--color-accent); margin-top: 0;">Ejercicio 3: [Título]</h4>
    <p>[Descripción detallada del ejercicio]</p>
  </div>
</div>

<div class="results__section">
  <h3 class="results__section-title">📋 Recomendaciones Clínicas</h3>
  <p>[Recomendaciones profesionales y siguientes pasos. Menciona cuándo sería recomendable buscar apoyo terapéutico profesional.]</p>
</div>

**RESTRICCIONES:**
- Usa un tono profesional, empático y clínico
- NO inventes términos fuera de la nomenclatura de Morales Ángel
- Sé específico y personalizado según los puntajes
- El HTML debe usar las clases CSS ya definidas en el sistema
- NO incluyas <html>, <head> o <body> tags, solo divs internos`;
}
