// Define the stages of the recycling process for the simulation
const simulationPhases = [
    { id: 1, name: "Plastic Detection", message: "1. IR SENSOR: PLASTIC DETECTED. READY TO SHRED." },
    { id: 2, name: "Shredding Simulation", message: "2. SHREDDING IN PROGRESS... MOTORS ENGAGED." },
    { id: 3, name: "Melting and Gas Filtration", message: "3. MELTING PLASTIC & FILTERING GASES (CONCEPTUAL)." },
    { id: 4, name: "Molding Process", message: "4. MOLDING IN PROGRESS... CREATING NEW PRODUCT." },
    { id: 5, name: "Reward System", message: "5. CYCLE COMPLETE! BUZZER REWARD ACTIVATED." }
];

let currentPhase = -1;
let isSimulating = false;
let simulationTimeout = null;

// Get references to DOM elements
const lcdDisplay = document.getElementById('lcd-display');
const simulateBtn = document.getElementById('simulate-btn');
const resetBtn = document.getElementById('reset-btn');
// Map phase IDs to their HTML elements
const phaseSteps = [1, 2, 3, 4, 5].map(id => document.getElementById(`step-${id}`));

/**
 * Updates the text and background color of the simulated LCD display.
 * @param {string} message The text to display.
 * @param {boolean} isFinal If true, uses the green completion color.
 */
function updateDisplay(message, isFinal = false) {
    if (!lcdDisplay) return;

    lcdDisplay.textContent = message;
    
    // Toggle classes to change the LCD's background color
    if (isFinal) {
        lcdDisplay.classList.add('bg-green-500');
        lcdDisplay.classList.remove('bg-blue-500');
    } else {
        lcdDisplay.classList.add('bg-blue-500');
        lcdDisplay.classList.remove('bg-green-500');
    }
}

/**
 * Updates the visual state of the phase steps to highlight the active step.
 * @param {number} phaseIndex The index of the currently active phase.
 */
function updatePhaseVisual(phaseIndex) {
    phaseSteps.forEach((step, index) => {
        if (!step) return;
        step.classList.remove('active');
        if (index === phaseIndex) {
            step.classList.add('active');
        }
    });
}

/**
 * Recursively advances the simulation through the steps.
 * @param {number} index The index of the phase to simulate.
 */
function simulateStep(index) {
    if (!isSimulating || index >= simulationPhases.length) {
        endSimulation();
        return;
    }

    currentPhase = index;
    const phase = simulationPhases[currentPhase];

    updateDisplay(phase.message);
    updatePhaseVisual(currentPhase);

    // Simulate varying processing time (e.g., longer for melting)
    const delay = (currentPhase === 2) ? 4000 : 2000; 
    simulationTimeout = setTimeout(() => {
        simulateStep(index + 1);
    }, delay);
}

/**
 * Starts the simulation cycle.
 */
function startSimulation() {
    if (isSimulating) return;

    isSimulating = true;
    currentPhase = 0;
    
    // Update button states and appearance for "In Progress"
    simulateBtn.disabled = true;
    resetBtn.disabled = false;
    simulateBtn.innerHTML = '<i data-lucide="recycle" class="w-6 h-6 mr-2"></i> Processing...';
    simulateBtn.classList.remove('bg-green-500', 'hover:bg-green-600');
    simulateBtn.classList.add('bg-blue-500', 'hover:bg-blue-600');
    
    // Start the recursive simulation sequence
    simulateStep(0);
}

/**
 * Handles the end of the simulation cycle.
 */
function endSimulation() {
    isSimulating = false;
    clearTimeout(simulationTimeout);
    currentPhase = -1; 
    
    // Final display and button state
    updateDisplay("CYCLE COMPLETE! REWARD DISPENSED.", true);
    simulateBtn.innerHTML = '<i data-lucide="recycle" class="w-6 h-6 mr-2"></i> START NEW CYCLE';
    simulateBtn.disabled = false;
    simulateBtn.classList.add('bg-green-500', 'hover:bg-green-600');
    simulateBtn.classList.remove('bg-blue-500', 'hover:bg-blue-600');
    updatePhaseVisual(simulationPhases.length - 1); 
    
    // Automatically reset the visual steps after a few seconds
    setTimeout(resetSimulation, 5000);
}

/**
 * Resets the entire simulation state back to standby.
 */
function resetSimulation() {
    if(isSimulating) return;
    
    clearTimeout(simulationTimeout);
    currentPhase = -1;
    isSimulating = false;
    
    // Reset buttons
    simulateBtn.innerHTML = '<i data-lucide="recycle" class="w-6 h-6 mr-2"></i> START RECYCLING CYCLE';
    simulateBtn.disabled = false;
    simulateBtn.classList.add('bg-green-500', 'hover:bg-green-600');
    simulateBtn.classList.remove('bg-blue-500', 'hover:bg-blue-600');
    resetBtn.disabled = true;
    
    // Reset visual steps and LCD
    phaseSteps.forEach(step => { if(step) step.classList.remove('active'); });
    updateDisplay("SYSTEM READY", false);
}

/**
 * Initializes the event listeners and sets the initial state.
 */
function initSimulation() {
    if (simulateBtn && resetBtn) {
        simulateBtn.addEventListener('click', startSimulation);
        resetBtn.addEventListener('click', resetSimulation);
        resetSimulation(); // Set the initial state
    }
}

// Run initialization once the DOM is fully loaded and elements are available
document.addEventListener('DOMContentLoaded', initSimulation);
