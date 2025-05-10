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

        if (type === 'getSkillsData') {
            loadSkillsData(data.skills)
        }
    })
    
    /**
     * Berechnet die benötigten Skill-Punkte für das nächste Level
     * @param {number} currentLevel - Das aktuelle Level des Spielers
     * @returns {number} - Die benötigten Skill-Punkte für das nächste Level
     */
    function getRequiredSkillPoints(currentLevel) {
        const nextLevel = Math.min(currentLevel + 1, 10);
        if (nextLevel <= 2) return 1;
        if (nextLevel <= 4) return 2;
        if (nextLevel <= 7) return 3;
        if (nextLevel <= 9) return 4;
        return 5;
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

    function loadSkillsData(skillsData) {
        if (skillsData === "noSkillsData" || !skillsData || (Array.isArray(skillsData) && skillsData.length === 0)) {
            window.showToast({
                type: 'error',
                title: 'Fehler',
                message: 'Keine Daten vorhanden'
            })
            return;
        }

        skillsData.forEach(skills => {
            const level = skills.level
            const nextLvlXP = skills.nextLvlXP
            const currentXP = skills.currentXP
            const skillPoints = skills.skillPoints
            const lkwLvl = skills.lkwLvl
            const distanceLvl = skills.distanceLvl
            const wareLvl = skills.wareLvl

            $('#current-level').text(level)
            $('#skill-points-value').text(skillPoints)
            $('#xp-progress-bar').css('width', `${(currentXP / nextLvlXP) * 100}%`)
            $('#xp-current').text(currentXP)
            $('#xp-required').text(nextLvlXP)

            $('#lkwLvl').text(lkwLvl)
            $('#distanceLvl').text(distanceLvl)
            $('#wareLvl').text(wareLvl)

            // Berechnung und Anzeige der benötigten Skill-Punkte und Farbe für jeden Skill-Tree
            $('.skill-cost').each(function() {
                var skillKey = $(this).data('skill'); // z.B. 'lkwLvl', 'distanceLvl', 'wareLvl'
                var currentLevel = skills[skillKey] || 0;
                var reqPoints = getRequiredSkillPoints(currentLevel);
                var color = getRequiredPointsColor(reqPoints);
                var $pointsEl = $(this).find('.points-value');
                if (currentLevel >= 10) {
                    $pointsEl.text('Max').css('color', '#0066CC');
                } else {
                    $pointsEl.text(reqPoints + ' SP').css('color', color);
                }
                // Fortschritt der Skill-Leiste setzen (1 Level = 10%)
                var percent = currentLevel * 10;
                $(this).closest('.skill-tree').find('.level-progress')
                    .css('width', percent + '%');
                // Aktuelles Level-Text aktualisieren
                $(this).closest('.skill-tree').find('.level-value')
                    .text(currentLevel);
                // Buttons aktivieren/deaktivieren basierend auf Level
                var $tree = $(this).closest('.skill-tree');
                $tree.find('.skill-control.minus').prop('disabled', currentLevel <= 0);
                $tree.find('.skill-control.plus').prop('disabled', currentLevel >= 10);
            });
        })
    }

});
