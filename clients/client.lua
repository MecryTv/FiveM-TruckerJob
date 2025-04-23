Citizen.CreateThread(function()
   Wait(500)
   TriggerEvent("showLogo")
   Wait(2500)
   TriggerEvent("hideLogo")
end)

RegisterNetEvent("showLogo", function()
   SendNUIMessage({ type = "show" })
end)

RegisterNetEvent("hideLogo", function()
   SendNUIMessage({ type = "hide" })
end)