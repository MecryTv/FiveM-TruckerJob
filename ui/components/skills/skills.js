$(document).ready(function() {
    // Prevent scrolling with mouse wheel in the skills container
    $('.skills-container').on('wheel', function(e) {
        e.preventDefault();
        e.stopPropagation();
        return false;
    });

    
    window.addEventListener('message', (event) => {
        const data = event.data
        const type = data.type
        // Process NUI message

        if (type === 'skillsData') {
            // Process skills data
            updateSkills(data.skills)
        }
    })
    
    /**
     * Berechnet die benötigten Skill-Punkte für das nächste Level
     * @param {number} currentLevel - Das aktuelle Level des Spielers
     * @returns {number} - Die benötigten Skill-Punkte für das nächste Level
     */
    function getRequiredSkillPoints(currentLevel) {
        // Level 1 & 2: 1 SP
        // Level 3 & 4: 2 SP
        // Level 5 - 7: 3 SP
        // Level 8 & 9: 4 SP
        // Level 10: 5 SP
        if (currentLevel < 1) return 0;  // Level 0 oder ungültig
        if (currentLevel <= 2) return 1; // Level 1 & 2: 1 SP
        if (currentLevel <= 4) return 2; // Level 3 & 4: 2 SP
        if (currentLevel <= 7) return 3; // Level 5 - 7: 3 SP
        if (currentLevel <= 9) return 4; // Level 8 & 9: 4 SP
        if (currentLevel === 10) return 5; // Level 10: 5 SP
        return 0; // Ungültiges Level
    }
    
    /**
     * Liefert die Farbe für die Anzeige der benötigten Skill-Punkte
     * @param {number} requiredPoints - Die benötigten Skill-Punkte
     * @returns {string} - Der CSS-Farbcode
     */
    function getRequiredPointsColor(requiredPoints) {
        switch(requiredPoints) {
            case 1: return '#4CAF50'; // Grün
            case 2: return '#8BC34A'; // Hellgrün
            case 3: return '#FFC107'; // Gelb
            case 4: return '#FF9800'; // Orange
            case 5: return '#F44336'; // Rot
            default: return '#FFFFFF'; // Weiß
        }
    }
    
    /**
     * Aktualisiert die Skills-Anzeige mit den empfangenen Daten
     * @param {Array|Object} skills - Die Skill-Daten des Spielers
     */
    function updateSkills(skills) {
        // Prüfen ob Daten vorhanden sind und konvertieren wenn nötig
        if (!skills) {
            // No skills data received
            return;
        }
        
        // Process skills data
        
        // Daten extrahieren abhängig vom Format
        let playerSkills;
        if (Array.isArray(skills)) {
            if (skills.length === 0) {
                // Empty skills array
                return;
            }
            playerSkills = skills[0];
            // Use first element from skills array
        } else {
            // Wenn skills bereits ein Objekt ist
            playerSkills = skills;
            // Use skills object
        }
        
        // Process extracted player skills
        
        // Header-Informationen aktualisieren
        if (playerSkills.level) {
            const currentLevel = parseInt(playerSkills.level);
            $('.current-level-number').text(currentLevel);
            
            // Benötigte Skill-Points für das nächste Level berechnen und anzeigen
            const requiredPoints = getRequiredSkillPoints(currentLevel);
            const pointsColor = getRequiredPointsColor(requiredPoints);
            
            // Information zur nächsten Stufe anzeigen (falls vorhanden)
            if (requiredPoints > 0) {
                const nextLevel = currentLevel + (currentLevel === 1 ? 1 : 
                                                currentLevel >= 2 && currentLevel < 4 ? 4 - currentLevel : 
                                                currentLevel >= 4 && currentLevel < 7 ? 7 - currentLevel : 
                                                currentLevel >= 7 && currentLevel < 9 ? 9 - currentLevel : 1);
                
                // Wenn die stats-container noch keine next-level-info hat, fügen wir sie hinzu
                if ($('.next-level-info').length === 0) {
                    $('.stats-container').append(`
                        <div class="next-level-info">
                            <span class="next-level-label">Nächstes Level (${currentLevel}→${currentLevel + nextLevel}):</span>
                            <span class="next-level-cost"><span class="points-needed">${requiredPoints}</span> SP</span>
                        </div>
                    `);
                } else {
                    $('.next-level-label').html(`Nächstes Level (${currentLevel}→${currentLevel + nextLevel}):`);
                    $('.points-needed').text(requiredPoints);
                }
                
                // Farbe für die benötigten Punkte setzen
                $('.next-level-cost').css('color', pointsColor);
            }
        }
        
        if (playerSkills.skillPoints) {
            $('.skill-points-value').text(playerSkills.skillPoints);
        }
        
        if (playerSkills.currentXP && playerSkills.nextLvlXP) {
            const xpPercentage = (playerSkills.currentXP / playerSkills.nextLvlXP) * 100;
            $('.xp-progress-bar').css('width', xpPercentage + '%');
            // Setze die XP-Werte in die separaten Elemente
            $('.xp-current').text(playerSkills.currentXP);
            $('.xp-required').text(playerSkills.nextLvlXP);
        }

        // Skills-Level anzeigen, ohne Änderungsfunktionalität
        // Standard-Werte setzen, falls keine Skills vorhanden sind
        const lkwLevel = playerSkills.lkwLvl ? parseInt(playerSkills.lkwLvl) : 0;
        const distanceLevel = playerSkills.distanceLvl ? parseInt(playerSkills.distanceLvl) : 0;
        const wareLevel = playerSkills.wareLvl ? parseInt(playerSkills.wareLvl) : 0;
        
        // Skills anzeigen
        updateSkillDisplay('lkwLvl', lkwLevel);
        updateSkillDisplay('distanceLvl', distanceLevel);
        updateSkillDisplay('wareLvl', wareLevel);
        
        // Skills update functions removed
    }
    
    /**
     * Aktualisiert nur die Anzeige eines Skills, ohne Änderungsfunktionalität
     * @param {string} skillName - Der Name des Skills
     * @param {number} level - Das aktuelle Level des Skills
     */
    function updateSkillDisplay(skillName, level) {
        const skillItem = $(`.skill-item[data-skill="${skillName}"]`);
        if (skillItem.length > 0) {
            // Level anzeigen
            skillItem.attr('data-level', level);
            skillItem.find('.level-value').text(level);
            
            // Progress-Bar aktualisieren
            const progressWidth = (level / 10) * 100;
            skillItem.find('.level-progress').css('width', progressWidth + '%');
            
            // "Benötigt"-Anzeige aktualisieren
            const nextLevel = level < 10 ? level + 1 : 10;
            const requiredPoints = getRequiredSkillPoints(nextLevel - 1);
            const skillCost = $(`.skill-cost[data-skill="${skillName}"]`);
            
            if (skillCost.length > 0) {
                // Kosten-Anzeige aktualisieren
                skillCost.find('.points-value').text(`${requiredPoints} SP`);
                
                // CSS-Klassen für die Farbe basierend auf den benötigten Punkten entfernen
                skillCost.find('.points-value').removeClass('sp-1 sp-2 sp-3 sp-4 sp-5 max-level');
                
                if (level < 10) {
                    // Füge die entsprechende Klasse hinzu
                    skillCost.find('.points-value').addClass(`sp-${requiredPoints}`);
                } else {
                    // Maximales Level erreicht
                    skillCost.find('.points-value').addClass('max-level').text('MAX');
                }
            }
        }
    }

    // Buttons klickbar machen ohne Funktionalität
    $('.skill-control').css('opacity', '1').on('click', function(e) {
        e.preventDefault();
        // Visuelles Feedback beim Klicken
        const button = $(this);
        button.css('transform', 'scale(0.9)');
        setTimeout(() => {
            button.css('transform', 'scale(1)');
        }, 100);
        // Hier keine Funktionalität implementiert
        // Button clicked
    });
    
    // Notification-System
    function showNotification(message) {
        const notification = $('<div class="skill-notification">' + message + '</div>');
        $('.notifications-container').append(notification);
        
        // Animation starten
        setTimeout(() => {
            notification.addClass('show');
        }, 10);
        
        // Nach Anzeigezeit entfernen
        setTimeout(() => {
            notification.removeClass('show');
            setTimeout(() => {
                notification.remove();
            }, 500);
        }, 3000);
    }
});
