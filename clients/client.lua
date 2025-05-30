RegisterNUICallback("hideUI", function(data, cb)
   SendNUIMessage({ type = "hide" })
   SetNuiFocus(false, false)
   cb({})
end)

RegisterNUICallback("getPlayerName", function(data, cb)
    local playerName = getPlayerName()
    cb({ name = playerName })
end)

RegisterCommand("uishow", function()
    TriggerServerEvent('setIdentFirstTime')
    SendNUIMessage({ type = "show" })
    SetNuiFocus(true, true)
    Citizen.Wait(100)

    sendPlayerDataToUI()
    sendTruckerDataToUI()
    loadJobsData()
    getSkillsData()
end)

RegisterNUICallback("upgradeSkill", function (data, cb)
    print("NUI CALLBACK: upgradeSkill")
    cb({})
end)