// ============================================
// MAIN APPLICATION CONTROLLER
// ============================================

import { CONFIG } from './config.js';
import { AIService } from './ai-service.js';

class App {
    constructor() {
        this.currentStep = 0;
        this.responses = {};
        this.scores = {};
        this.questionsData = null;
        this.tieBreakerData = null;
        this.analysisResult = null;

        this.init();
    }

    async init() {
        // Load questions from JSON
        try {
            const response = await fetch('questions.json');
            this.questionsData = await response.json();
            this.initializeStepper();
        } catch (error) {
            console.error('Error loading questions:', error);
            alert('Error al cargar las preguntas. Por favor, recarga la página.');
        }
    }

    /**
     * Initialize the stepper component
     */
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

    /**
     * Start the assessment
     */
    startAssessment() {
        document.getElementById('welcome-screen').classList.add('hidden');
        document.getElementById('questionnaire').classList.remove('hidden');
        this.currentStep = 0;
        this.renderQuestion(this.currentStep);
    }

    /**
     * Render a question section
     */
    renderQuestion(sectionIndex) {
        // Scroll to top when rendering new question
        window.scrollTo({ top: 0, behavior: 'smooth' });

        const section = this.questionsData.sections[sectionIndex];
        const questionnaireElement = document.getElementById('questionnaire');

        // Generic title to prevent confirmation bias
        const genericTitle = `Sección ${String.fromCharCode(65 + sectionIndex)}`; // Sección A, B, C...

        questionnaireElement.innerHTML = `
      <div class="question-section">
        <div class="question-section__header">
          <h2 class="question-section__title">${genericTitle}</h2>
          <p style="color: var(--color-gray-600);">${section.description}</p>
        </div>
        
        ${section.questions.map((q, qIndex) => this.renderQuestionCard(section.id, q, qIndex)).join('')}
        
        <div class="navigation">
          ${sectionIndex > 0 ? `
            <button class="btn btn-secondary" onclick="app.previousSection()">
              ← Anterior
            </button>
          ` : '<div></div>'}
          
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

    /**
     * Render a single question card
     */
    renderQuestionCard(sectionId, question, qIndex) {
        const likertScale = this.questionsData.likertScale;

        return `
      <div class="question-card">
        <p class="question-card__text">
          <span class="question-card__number">${qIndex + 1}.</span>
          ${question.text}
        </p>
        
        <div class="likert-scale">
          ${Object.values(likertScale).map(option => `
            <div class="likert-scale__option">
              <input 
                type="radio" 
                id="${question.id}-${option.value}" 
                name="${question.id}" 
                value="${option.value}"
                class="likert-scale__input"
                onchange="app.handleResponse('${question.id}', ${option.value})"
              >
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

    /**
     * Handle user response to a question
     */
    handleResponse(questionId, value) {
        this.responses[questionId] = parseInt(value);

        // Check if current section is complete
        const section = this.questionsData.sections[this.currentStep];
        this.checkSectionComplete(section.id);
    }

    /**
     * Check if all questions in current section are answered
     */
    checkSectionComplete(sectionId) {
        const section = this.questionsData.sections.find(s => s.id === sectionId);
        const allAnswered = section.questions.every(q => this.responses[q.id] !== undefined);

        const nextBtn = document.getElementById('next-btn');
        if (nextBtn) {
            nextBtn.disabled = !allAnswered;
        }
    }

    /**
     * Restore saved responses when navigating back
     */
    restoreResponses(sectionId) {
        Object.keys(this.responses).forEach(questionId => {
            if (questionId.startsWith(sectionId)) {
                const value = this.responses[questionId];
                const radio = document.getElementById(`${questionId}-${value}`);
                if (radio) radio.checked = true;
            }
        });
    }

    /**
     * Go to next section
     */
    async nextSection() {
        if (this.currentStep < 5) {
            this.currentStep++;
            this.renderQuestion(this.currentStep);
        } else {
            // Calculate scores and finish
            await this.finishAssessment();
        }
    }

    /**
     * Go to previous section
     */
    previousSection() {
        if (this.currentStep > 0) {
            this.currentStep--;
            this.renderQuestion(this.currentStep);
        }
    }

    /**
     * Update stepper visual state
     */
    updateStepper(currentIndex) {
        const steps = document.querySelectorAll('.stepper__step');
        steps.forEach((step, index) => {
            step.classList.remove('active', 'completed');
            if (index < currentIndex) {
                step.classList.add('completed');
            } else if (index === currentIndex) {
                step.classList.add('active');
            }
        });
    }

    /**
     * Calculate section scores
     */
    calculateScores() {
        const scores = {};

        this.questionsData.sections.forEach(section => {
            const sectionScore = section.questions.reduce((total, question) => {
                return total + (this.responses[question.id] || 0);
            }, 0);
            scores[section.id] = sectionScore;
        });

        return scores;
    }

    /**
     * Check for tie-breaker scenario
     */
    checkTieBreaker(scores) {
        const sortedScores = Object.entries(scores).sort(([, a], [, b]) => b - a);
        const topScore = sortedScores[0][1];
        const secondScore = sortedScores[1][1];

        if (Math.abs(topScore - secondScore) <= CONFIG.scoring.tieBreakerThreshold) {
            return {
                needsTieBreaker: true,
                archetype1: sortedScores[0][0],
                archetype2: sortedScores[1][0]
            };
        }

        return { needsTieBreaker: false };
    }

    /**
     * Show tie-breaker modal
     */
    showTieBreaker(archetype1, archetype2) {
        const questionKey = archetype1 + archetype2;
        const tieBreakerQuestion = this.questionsData.tieBreakerQuestions[questionKey];

        if (!tieBreakerQuestion) {
            console.warn('No tie-breaker question found for:', questionKey);
            return false;
        }

        this.tieBreakerData = { archetype1, archetype2 };

        const modal = document.getElementById('tie-breaker-modal');
        const questionElement = document.getElementById('tie-breaker-question');
        const scaleElement = document.getElementById('tie-breaker-scale');

        questionElement.textContent = tieBreakerQuestion;

        const likertScale = this.questionsData.likertScale;
        scaleElement.innerHTML = Object.values(likertScale).map(option => `
      <div class="likert-scale__option">
        <input 
          type="radio" 
          id="tiebreaker-${option.value}" 
          name="tiebreaker" 
          value="${option.value}"
          class="likert-scale__input"
        >
        <label for="tiebreaker-${option.value}" class="likert-scale__label">
          <span class="likert-scale__value">${option.value}</span>
          <span class="likert-scale__description">${option.label}</span>
        </label>
      </div>
    `).join('');

        modal.classList.add('active');
        return true;
    }

    /**
     * Submit tie-breaker response
     */
    submitTieBreaker() {
        const selectedValue = document.querySelector('input[name="tiebreaker"]:checked');

        if (!selectedValue) {
            alert('Por favor, selecciona una respuesta');
            return;
        }

        const value = parseInt(selectedValue.value);

        // Adjust scores based on tie-breaker
        // If value >= 4, favor archetype1; if value <= 2, favor archetype2
        if (value >= 4) {
            this.scores[this.tieBreakerData.archetype1] += 2;
        } else if (value <= 2) {
            this.scores[this.tieBreakerData.archetype2] += 2;
        }

        // Close modal and proceed with analysis
        document.getElementById('tie-breaker-modal').classList.remove('active');
        this.performAIAnalysis();
    }

    /**
     * Finish assessment
     */
    async finishAssessment() {
        // Calculate scores
        this.scores = this.calculateScores();

        // Check for tie-breaker
        const tieBreaker = this.checkTieBreaker(this.scores);

        if (tieBreaker.needsTieBreaker) {
            this.showTieBreaker(tieBreaker.archetype1, tieBreaker.archetype2);
        } else {
            await this.performAIAnalysis();
        }
    }

    /**
     * Perform AI analysis
     */
    async performAIAnalysis() {
        // Show loading overlay
        document.getElementById('loading-overlay').classList.add('active');
        document.getElementById('questionnaire').classList.add('hidden');

        try {
            // Call AI service
            this.analysisResult = await AIService.analyzeArchetypes(this.scores);

            // Hide loading, show results
            setTimeout(() => {
                document.getElementById('loading-overlay').classList.remove('active');
                this.displayResults();
            }, 1500); // Small delay for UX

        } catch (error) {
            document.getElementById('loading-overlay').classList.remove('active');
            alert('Error en el análisis: ' + error.message);
            console.error(error);
        }
    }

    /**
     * Display results
     */
    displayResults() {
        const result = this.analysisResult;

        // Update stepper
        this.updateStepper(6);

        // Show results section
        document.getElementById('results').classList.remove('hidden');

        // Set header
        document.getElementById('dominant-archetype').textContent = result.dominantArchetype;
        document.getElementById('dominance-percentage').textContent =
            `${result.percentage}% de dominancia (${result.dominantScore}/40 puntos)`;

        // Set integration level
        const integrationLabel = document.getElementById('integration-label');
        const integrationScore = document.getElementById('integration-score');
        const integrationFill = document.getElementById('integration-fill');

        integrationLabel.textContent = result.adequacyLevel.label;
        integrationScore.textContent = `${result.dominantScore}/40 puntos`;

        const fillPercentage = (result.dominantScore / CONFIG.scoring.maxPerSection) * 100;
        integrationFill.style.width = fillPercentage + '%';
        integrationFill.style.background = `linear-gradient(90deg, ${result.adequacyLevel.color} 0%, ${result.adequacyLevel.color} 100%)`;

        // Insert AI-generated report
        document.getElementById('clinical-report').innerHTML = result.reportHTML;

        // Create radar chart
        this.createRadarChart(result.scores);

        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    /**
     * Create radar chart with Chart.js
     */
    createRadarChart(scores) {
        const ctx = document.getElementById('radar-chart').getContext('2d');

        // Destroy previous chart if exists
        if (this.radarChart) {
            this.radarChart.destroy();
        }

        const labels = this.questionsData.sections.map(s => s.archetype.split(' - ')[1] || s.archetype);
        const data = this.questionsData.sections.map(s => scores[s.id]);

        this.radarChart = new Chart(ctx, {
            type: 'radar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Puntaje por Arquetipo',
                    data: data,
                    fill: true,
                    backgroundColor: 'rgba(52, 152, 219, 0.2)',
                    borderColor: 'rgba(52, 152, 219, 1)',
                    pointBackgroundColor: 'rgba(52, 152, 219, 1)',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'rgba(52, 152, 219, 1)',
                    pointRadius: 5,
                    pointHoverRadius: 7
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                scales: {
                    r: {
                        beginAtZero: true,
                        max: 40,
                        ticks: {
                            stepSize: 10,
                            font: {
                                size: 12
                            }
                        },
                        pointLabels: {
                            font: {
                                size: 13,
                                weight: 'bold'
                            }
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function (context) {
                                return context.label + ': ' + context.parsed.r + '/40 puntos';
                            }
                        }
                    }
                }
            }
        });
    }

    /**
     * Download PDF report
     */
    async downloadPDF() {
        try {
            const { jsPDF } = window.jspdf;

            // Create new PDF
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pageWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.getHeight();

            // Add header
            pdf.setFontSize(20);
            pdf.setTextColor(44, 62, 80);
            pdf.text('Arquetipos del Vínculo', pageWidth / 2, 20, { align: 'center' });

            pdf.setFontSize(12);
            pdf.setTextColor(108, 117, 125);
            pdf.text('Reporte de Evaluación Clínica', pageWidth / 2, 28, { align: 'center' });
            pdf.text(new Date().toLocaleDateString('es-ES'), pageWidth / 2, 34, { align: 'center' });

            // Add dominant archetype
            pdf.setFontSize(16);
            pdf.setTextColor(52, 152, 219);
            pdf.text(`Arquetipo Dominante: ${this.analysisResult.dominantArchetype}`, 20, 50);

            pdf.setFontSize(12);
            pdf.setTextColor(0, 0, 0);
            pdf.text(`Puntaje: ${this.analysisResult.dominantScore}/40 (${this.analysisResult.percentage}%)`, 20, 58);
            pdf.text(`Nivel: ${this.analysisResult.adequacyLevel.label}`, 20, 65);

            // Export radar chart as image
            const canvas = document.getElementById('radar-chart');
            const chartImage = canvas.toDataURL('image/png');
            pdf.addImage(chartImage, 'PNG', 20, 75, 170, 100);

            // Add clinical report text (simplified - HTML to text conversion)
            pdf.addPage();
            pdf.setFontSize(14);
            pdf.setTextColor(44, 62, 80);
            pdf.text('Análisis Clínico', 20, 20);

            // Extract text from HTML (simplified)
            const reportElement = document.getElementById('clinical-report');
            const reportText = reportElement.innerText || reportElement.textContent;

            pdf.setFontSize(10);
            pdf.setTextColor(0, 0, 0);
            const textLines = pdf.splitTextToSize(reportText, pageWidth - 40);
            pdf.text(textLines, 20, 30);

            // Save PDF
            const filename = `ArquetiposDelVinculo_${this.analysisResult.dominantArchetype.replace(/ /g, '_')}_${Date.now()}.pdf`;
            pdf.save(filename);

        } catch (error) {
            console.error('Error generating PDF:', error);
            alert('Error al generar el PDF. Intenta usar la función de imprimir del navegador.');
        }
    }

    /**
     * Restart assessment
     */
    restart() {
        if (confirm('¿Estás seguro de que deseas realizar un nuevo test? Se perderán los resultados actuales.')) {
            this.currentStep = 0;
            this.responses = {};
            this.scores = {};
            this.analysisResult = null;

            document.getElementById('results').classList.add('hidden');
            document.getElementById('welcome-screen').classList.remove('hidden');

            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }
}

// Initialize app when DOM is loaded
const app = new App();

// Export for onclick handlers
window.app = app;
