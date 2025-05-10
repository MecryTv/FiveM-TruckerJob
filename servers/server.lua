ESX = exports['es_extended']:getSharedObject()

-- Überprüft, ob ein Spieler bereits in einer Tabelle existiert
function CheckPlayerExists(identifier, table, callback)
    MySQL.Async.fetchScalar("SELECT COUNT(1) FROM " .. table .. " WHERE identifier = @identifier", {
        ['@identifier'] = identifier
    }, function(count)
        -- Rufe das Callback mit dem Ergebnis auf
        callback(count ~= nil and count > 0)
    end)
end

-- Erstellt einen Eintrag in der truckerjob_stats Tabelle
function CreatePlayerStats(identifier, callback)
    MySQL.Async.execute("INSERT INTO truckerjob_stats (identifier) VALUES (@identifier)", {
        ['@identifier'] = identifier
    }, function(rowsChanged)
        print("Datensatz in truckerjob_stats erstellt für: " .. identifier .. ", Zeilen geändert: " .. tostring(rowsChanged))
        if callback then 
            callback(rowsChanged > 0) 
        end
    end)
end

-- Erstellt einen Eintrag in der truckerjob_skills Tabelle
function CreatePlayerSkills(identifier, callback)
    MySQL.Async.execute("INSERT INTO truckerjob_skills (identifier) VALUES (@identifier)", {
        ['@identifier'] = identifier
    }, function(rowsChanged)
        print("Datensatz in truckerjob_skills erstellt für: " .. identifier .. ", Zeilen geändert: " .. tostring(rowsChanged))
        if callback then 
            callback(rowsChanged > 0) 
        end
    end)
end

ESX.RegisterServerCallback('getTruckerData', function(source, cb)
    local xPlayer = ESX.GetPlayerFromId(source)
    local identifier = xPlayer.identifier
    
    MySQL.Async.fetchAll("SELECT * FROM truckerjob_stats WHERE identifier = @identifier", {
        ['@identifier'] = identifier
    }, function(result) 
        cb(result)
    end)
end)

ESX.RegisterServerCallback('getJobsData', function (source, cb)
    local xPlayer = ESX.GetPlayerFromId(source)
    local identifier = xPlayer.identifier

    MySQL.Async.fetchAll("SELECT * FROM truckerjob_jobs WHERE identifier = @identifier", {
        ['@identifier'] = identifier
    }, function(result)
        cb(result)
    end)
end)

-- Leaderboard-Daten für alle Spieler aus der truckerjob_stats Tabelle abrufen
RegisterNetEvent('getLeaderboardData')
AddEventHandler('getLeaderboardData', function()
    local source = source
    local xPlayer = ESX.GetPlayerFromId(source)
    
    if not xPlayer then
        print("Fehler: Spieler nicht gefunden für Leaderboard-Anfrage")
        return
    end
    
    local playerIdentifier = xPlayer.identifier
    
    -- Hole alle Spieler aus der truckerjob_stats-Tabelle für das Leaderboard
    MySQL.Async.fetchAll("SELECT ts.*, COALESCE(users.firstname || ' ' || users.lastname, 'Unbekannt') AS name " ..
                        "FROM truckerjob_stats ts " ..
                        "LEFT JOIN users ON ts.identifier = users.identifier", {}, function(results)
        
        -- Hole die Daten des aktuellen Spielers, um seinen Rang zu bestimmen
        MySQL.Async.fetchAll("SELECT ts.*, COALESCE(users.firstname || ' ' || users.lastname, 'Unbekannt') AS name " ..
                            "FROM truckerjob_stats ts " ..
                            "LEFT JOIN users ON ts.identifier = users.identifier " ..
                            "WHERE ts.identifier = @identifier", {
            ['@identifier'] = playerIdentifier
        }, function(playerResult)
            
            local playerInfo = nil
            if playerResult and #playerResult > 0 then
                playerInfo = {
                    player_id = playerResult[1].identifier,
                    name = playerResult[1].name
                }
            end
            
            -- Wandle die MySQL-Ergebnisse in ein Format um, das für das Frontend geeignet ist
            local stats = {}
            
            for _, row in ipairs(results) do
                local statEntry = {
                    player_id = row.identifier,
                    name = row.name,
                    earnings = row.earnings or 0,
                    distance = row.distance or 0,
                    time = row.time or 0,
                    damage = row.damage or 0,
                    jobs = row.jobs or 0
                }
                
                table.insert(stats, statEntry)
            end
            
            -- Sende die Daten an den Client
            TriggerClientEvent('truckerJob:receiveLeaderboardData', source, {
                stats = stats,
                playerInfo = playerInfo
            })
        end)
    end)
end)

RegisterNetEvent('setIdentFirstTime')
AddEventHandler('setIdentFirstTime', function()
    -- source ist eine globale Variable in FiveM und muss nicht als Parameter übergeben werden
    local src = source
    local xPlayer = ESX.GetPlayerFromId(src)
    
    if xPlayer then
        local identifier = xPlayer.identifier
        
        -- Überprüfe truckerjob_stats und erstelle bei Bedarf einen Eintrag
        CheckPlayerExists(identifier, "truckerjob_stats", function(statsExists)
            if not statsExists then
                CreatePlayerStats(identifier, function(success)
                    if success then
                        print("Neuer Spieler in truckerjob_stats erstellt: " .. identifier)
                    end
                end)
            else
                print("Spieler existiert bereits in truckerjob_stats: " .. identifier)
            end
        end)
        
        -- Überprüfe truckerjob_skills und erstelle bei Bedarf einen Eintrag
        CheckPlayerExists(identifier, "truckerjob_skills", function(skillsExists)
            if not skillsExists then
                CreatePlayerSkills(identifier, function(success)
                    if success then
                        print("Neuer Spieler in truckerjob_skills erstellt: " .. identifier)
                    end
                end)
            else
                print("Spieler existiert bereits in truckerjob_skills: " .. identifier)
            end
        end)
    else
        print("Fehler: Spieler konnte nicht gefunden werden")
    end
end)

ESX.RegisterServerCallback('getSkillsData', function (source, cb)
    local xPlayer = ESX.GetPlayerFromId(source)
    local identifier = xPlayer.identifier

    MySQL.Async.fetchAll("SELECT * FROM truckerjob_skills WHERE identifier = @identifier", {
        ['@identifier'] = identifier
    }, function(result)
        cb(result)
    end)
end)
    