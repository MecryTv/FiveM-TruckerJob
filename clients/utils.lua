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
            print("Fehler: Keine Spielerdaten gefunden")
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
        print("Sending dashboard data from DB: " .. json.encode(truckerData))
    end)
end