RegisterNetEvent("hideUI", function()
   SendNUIMessage({ type = "hide" })
   SetNuiFocus(false, false)
end)

RegisterNUICallback("getPlayerName", function(data, cb)
    local playerName = getPlayerName()
    cb({ name = playerName })
end)

RegisterCommand("uishow", function()
    -- TriggerServerEvent ohne Parameter, da die Server-ID automatisch übertragen wird
    TriggerServerEvent('setIdentFirstTime')
    SendNUIMessage({ type = "show" })
    SetNuiFocus(true, true)
    Citizen.Wait(100)
    sendPlayerDataToUI()
    
    -- Lade auch die Trucker-Daten
    sendTruckerDataToUI()
end)