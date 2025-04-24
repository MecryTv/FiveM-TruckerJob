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