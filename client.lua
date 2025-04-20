local uiActive = false

RegisterCommand("truckerjob:toggleUI", function ()
    if uiActive then
        SetDisplay(false)
    else
        SetDisplay(true)
    end
end, false)

RegisterKeyMapping("truckerjob:toggleUI", "Toggle Trucker Job UI", "keyboard", Config.OpenUIKey)

RegisterNUICallback("close", function (data, cb)
    SetDisplay(false)
    cb('ok')
end)

RegisterNUICallback("action", function (data, cb)
    TriggerEvent("chat:addMessage", {
        color = { 255, 255, 255 },
        multiline = true,
        args = {"TruckerJob", "You have selected: " .. data.action}
    })
    cb({ status = "success" })
end)

function SetDisplay(bool) 
    uiActive = bool
    SetNuiFocus(bool, bool)
    SendNUIMessage({
        type = "ui",
        status = bool
    })
end