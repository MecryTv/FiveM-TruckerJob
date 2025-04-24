// Skills Component JavaScript

// Datenmodell für Skills
let skillsData = {
    level: 5,
    skillPoints: 3,
    currentXp: 750,
    requiredXp: 1000,
    skills: {
        truck: { value: 4 },
        range: { value: 3 },
        goods: { value: 2 }
    }
};

// Initialisierung, wenn das Dokument geladen ist
document.addEventListener('DOMContentLoaded', function() {
    initializeSkills();
});

// Initialisierungsfunktion für Skills
function initializeSkills() {
    // Event-Listener für Plus- und Minus-Buttons hinzufügen
    setupSkillControls();
}

// Animation-Funktion wurde entfernt

// Event-Listener für Skill-Control-Buttons
function setupSkillControls() {
    // Plus-Buttons
    document.querySelectorAll('.skill-control.plus').forEach(function(button) {
        button.addEventListener('click', function() {
            let skillItem = this.closest('.skill-item');
            let skillType = skillItem.getAttribute('data-skill');
            let currentLevel = parseInt(skillItem.getAttribute('data-level'));
            
            // Prüfen, ob noch Skillpoints verfügbar sind und Level kleiner als 10
            if (skillsData.skillPoints > 0 && currentLevel < 10) {
                // Level erhöhen
                currentLevel++;
                skillItem.setAttribute('data-level', currentLevel);
                
                // SkillPoints reduzieren
                skillsData.skillPoints--;
                document.getElementById('skill-points-value').textContent = skillsData.skillPoints;
                
                // Level-Anzeige aktualisieren
                updateSkillLevel(skillItem, currentLevel);
                
                // Daten an Server senden (falls FiveM-NUI)
                sendDataToNUI('updateSkill', {
                    skill: skillType,
                    level: currentLevel
                });
            }
        });
    });
    
    // Minus-Buttons
    document.querySelectorAll('.skill-control.minus').forEach(function(button) {
        button.addEventListener('click', function() {
            let skillItem = this.closest('.skill-item');
            let skillType = skillItem.getAttribute('data-skill');
            let currentLevel = parseInt(skillItem.getAttribute('data-level'));
            
            // Prüfen, ob Level größer als 1
            if (currentLevel > 1) {
                // Level verringern
                currentLevel--;
                skillItem.setAttribute('data-level', currentLevel);
                
                // SkillPoints erhöhen
                skillsData.skillPoints++;
                document.getElementById('skill-points-value').textContent = skillsData.skillPoints;
                
                // Level-Anzeige aktualisieren
                updateSkillLevel(skillItem, currentLevel);
                
                // Daten an Server senden (falls FiveM-NUI)
                sendDataToNUI('updateSkill', {
                    skill: skillType,
                    level: currentLevel
                });
            }
        });
    });
}

// Hilfsfunktion zum Aktualisieren der Level-Anzeige
function updateSkillLevel(skillItem, level) {
    // Fortschrittsbalken aktualisieren
    let progressBar = skillItem.querySelector('.level-progress');
    progressBar.style.width = (level * 10) + '%';
    
    // Level-Text aktualisieren
    let levelValue = skillItem.querySelector('.level-value');
    levelValue.textContent = level;
}

// Daten an FiveM-NUI senden
function sendDataToNUI(eventName, data) {
    if (window.jQuery) {
        $.post('https://' + GetParentResourceName() + '/' + eventName, JSON.stringify(data));
    } else if (window.fetch) {
        fetch('https://' + GetParentResourceName() + '/' + eventName, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
    }
}

// Hilfsfunktion für FiveM Resource-Name
function GetParentResourceName() {
    try {
        return window.GetParentResourceName();
    } catch(e) {
        return 'trucker-job'; // Fallback für Entwicklung
    }
}

// NUI-Nachrichtenempfänger für FiveM
window.addEventListener('message', function(event) {
    let data = event.data;
    
    if (data.type === 'setSkillsData') {
        // Daten vom Server aktualisieren
        skillsData = data.skillsData;
        
        // UI aktualisieren
        document.getElementById('current-level').textContent = skillsData.level;
        document.getElementById('skill-points-value').textContent = skillsData.skillPoints;
        document.getElementById('current-xp').textContent = skillsData.currentXp;
        document.getElementById('required-xp').textContent = skillsData.requiredXp;
        
        // XP-Fortschrittsbalken aktualisieren
        let progressPercentage = (skillsData.currentXp / skillsData.requiredXp) * 100;
        document.getElementById('xp-progress-bar').style.width = progressPercentage + '%';
    } else if (data.type === 'showSkills') {
        // Funktion zum Anzeigen der Skills
        console.log('Skills werden angezeigt');
    }
});

// Animations-Reset-Funktion wurde entfernt