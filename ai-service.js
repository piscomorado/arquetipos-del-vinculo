// ============================================
// AI SERVICE - VERCEL SERVERLESS INTEGRATION
// ============================================
// This service now calls the secure /api/analyze endpoint
// instead of calling Gemini API directly from the browser.

import { CONFIG } from './config.js';

export class AIService {

    /**
     * Generates the clinical analysis using the secure API endpoint
     * @param {Object} scores - Object with section scores {A: 32, B: 28, ...}
     * @returns {Promise<Object>} - Analysis result with HTML report
     */
    static async analyzeArchetypes(scores) {
        try {
            // Call secure API endpoint
            const response = await this.callAPIEndpoint(scores);

            // Parse and return the analysis
            return this.parseResponse(response.reportHTML, scores);

        } catch (error) {
            console.error('Error in AI analysis:', error);
            throw new Error('No se pudo completar el análisis. Por favor, intenta nuevamente.');
        }
    }

    /**
     * Calls the secure Vercel serverless API endpoint
     * @param {Object} scores - The scores to analyze
     * @returns {Promise<Object>} - API response with reportHTML
     */
    static async callAPIEndpoint(scores) {
        const response = await fetch('/api/analyze', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ scores })
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('API Error:', errorData);
            throw new Error(`Error del servidor: ${errorData.error || 'Desconocido'}`);
        }

        const data = await response.json();

        if (!data.success) {
            throw new Error(data.error || 'Error en el análisis');
        }

        return data;
    }

    /**
     * Parses the AI response and extracts structured data
     */
    static parseResponse(responseText, scores) {
        // Find dominant archetype
        const sortedScores = Object.entries(scores)
            .sort(([, a], [, b]) => b - a);

        const dominantSection = sortedScores[0][0];
        const dominantScore = sortedScores[0][1];

        // Calculate percentage (out of max possible 40)
        const percentage = ((dominantScore / CONFIG.scoring.maxPerSection) * 100).toFixed(1);

        // Determine adequacy level
        const adequacyLevel = this.getAdequacyLevel(dominantScore);

        return {
            dominantArchetype: this.getArchetypeName(dominantSection),
            dominantSection,
            dominantScore,
            percentage,
            adequacyLevel,
            scores,
            reportHTML: responseText
        };
    }

    /**
     * Gets the adequacy level based on score
     */
    static getAdequacyLevel(score) {
        const scale = CONFIG.adequacyScale;

        if (score >= scale.severeHypertrophy.min) {
            return scale.severeHypertrophy;
        } else if (score >= scale.moderateHypertrophy.min) {
            return scale.moderateHypertrophy;
        } else if (score >= scale.flexiblePattern.min) {
            return scale.flexiblePattern;
        } else {
            return scale.fullIntegration;
        }
    }

    /**
     * Gets the archetype name from section letter
     */
    static getArchetypeName(section) {
        const archetypes = {
            'A': 'El Salvador',
            'B': 'El Controlador',
            'C': 'El Fusionado',
            'D': 'El Distante',
            'E': 'El Demandante',
            'F': 'El Crítico'
        };
        return archetypes[section] || `Arquetipo ${section}`;
    }
}
