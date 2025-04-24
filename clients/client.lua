RegisterNetEvent("truckerjob:hideUI", function()
   SendNUIMessage({ type = "hide" })
end)

RegisterNetEvent("truckerjob:updatePlayerData", function()
    sendPlayerDataToUI()
end)

RegisterNUICallback("getPlayerName", function(data, cb)
    local playerName = getPlayerName()
    cb({ name = playerName })
end)

RegisterCommand("uishow", function()
    SendNUIMessage({ type = "show" })
    SetNuiFocus(true, true)
    Citizen.Wait(100)
    sendPlayerDataToUI()
end)