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

-- Erstellt einen Eintrag in der truckerjob_jobs Tabelle
function CreatePlayerJobs(identifier, callback)
    MySQL.Async.execute("INSERT INTO truckerjob_jobs (identifier) VALUES (@identifier)", {
        ['@identifier'] = identifier
    }, function(rowsChanged)
        print("Datensatz in truckerjob_jobs erstellt für: " .. identifier .. ", Zeilen geändert: " .. tostring(rowsChanged))
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
        
        -- Überprüfe truckerjob_jobs und erstelle bei Bedarf einen Eintrag
        CheckPlayerExists(identifier, "truckerjob_jobs", function(jobsExists)
            if not jobsExists then
                CreatePlayerJobs(identifier, function(success)
                    if success then
                        print("Neuer Spieler in truckerjob_jobs erstellt: " .. identifier)
                    end
                end)
            else
                print("Spieler existiert bereits in truckerjob_jobs: " .. identifier)
            end
        end)
    else
        print("Fehler: Spieler konnte nicht gefunden werden")
    end
end)