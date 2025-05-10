ESX = exports['es_extended']:getSharedObject()


function getPlayerName()
    local firstName = ESX.GetPlayerData().firstName
    local lastName = ESX.GetPlayerData().lastName

    local playerName = firstName .. " " .. lastName

    return playerName
end

function sendPlayerDataToUI()
    local playerName = getPlayerName()
    
    local playerData = {
        type = "playerData",
        name = playerName
    }
    
    SendNUIMessage(playerData)
end

function sendTruckerDataToUI()
    ESX.TriggerServerCallback('getTruckerData', function(data)
        -- Daten aus dem ersten Ergebnis der Datenbankabfrage holen
        local playerStats = data[1]
        
        if not playerStats then
            -- Keine Spielerdaten gefunden
            return
        end
        
        -- Direktes Auslesen der Werte aus der Datenbank
        local earnings = playerStats.earnings or 0
        local distance = playerStats.distance or "0.00"
        local damage = playerStats.damage or 0
        local jobs = playerStats.completed_jobs or 0
        
        -- Zeit formatieren, falls als Sekunden gespeichert
        local formattedTime = "0 Min 0 Sek"
        if playerStats.time then
            local timeInSeconds = playerStats.time
            local minutes = math.floor(timeInSeconds / 60)
            local seconds = timeInSeconds % 60
            formattedTime = string.format("%d Min %d Sek", minutes, seconds)
        end
        
        -- Daten an die UI senden
        local truckerData = {
            type = "truckerData",
            earnings = earnings,
            distance = distance,
            time = formattedTime,
            damage = damage,
            jobs = jobs
        }
        
        SendNUIMessage(truckerData)
        -- Dashboard data sent
    end)
end

function loadJobsData()
    ESX.TriggerServerCallback('getJobsData', function (data) 
        -- Wenn keine Daten vorhanden sind oder die Daten leer sind
        if not data or #data == 0 then
            SendNUIMessage({
                type = "jobData",
                jobs = "noJobData"
            })
            return
        end
        
        -- Daten in das richtige Format umwandeln
        local formattedJobs = {}
        for _, jobsData in ipairs(data) do
            -- Erstelle das formatierte Job-Objekt mit entsprechenden Feldern
            local jobObject = {
                icon = "fas fa-building", -- Verwende immer ein Standard-Icon
                title = jobsData.title,
                description = jobsData.description,
                earnings = jobsData.verdienst,
                startLocation = jobsData.von,
                endLocation = jobsData.bis,
                distance = jobsData.distanz,
                requirements = jobsData.anforderungen,
                type = jobsData.type
            }
            
            table.insert(formattedJobs, jobObject)
        end
        
        -- Formatierte Daten senden mit "type" und dem Array unter "jobs"
        SendNUIMessage({
            type = "jobData",
            jobs = formattedJobs
        })
    end)
end

-- Leaderboard-Daten vom Server empfangen und an die UI senden
RegisterNetEvent('truckerJob:receiveLeaderboardData')
AddEventHandler('truckerJob:receiveLeaderboardData', function(data)
    -- Leite die empfangenen Daten an die UI weiter
    SendNUIMessage({
        type = "leaderboardData",
        stats = data.stats,
        playerInfo = data.playerInfo
    })
end)

-- Leaderboard-Daten anfordern, wenn der entsprechende NUI-Callback empfangen wird
RegisterNUICallback('getLeaderboardData', function(data, cb)
    -- Sende eine Anfrage an den Server
    TriggerServerEvent('getLeaderboardData')
    
    -- Bestätige den Empfang des Callbacks
    cb('ok')
end)

function getSkillsData()
    ESX.TriggerServerCallback('getSkillsData', function (data) 
        if not data then 
            SendNUIMessage({
                type = "getSkillsData",
                skills = "noSkillsData"
            })
            return
        end

        local formattedSkills = {}
        for _, skillData in ipairs(data) do
            local skillObject = {
                level = skillData.level,
                nextLvlXP = skillData.nextLvlXP,
                currentXP = skillData.currentXP,
                skillPoints = skillData.skillPoints,
                lkwLvl = skillData.lkwLvl,
                distanceLvl = skillData.distanceLvl,
                wareLvl = skillData.wareLvl
            }
            table.insert(formattedSkills, skillObject)
        end

        SendNUIMessage({
            type = "getSkillsData",
            skills = formattedSkills
        })
    end)
end