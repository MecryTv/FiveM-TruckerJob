local function toggleUI(toggle)
    SetNuiFocus(toggle, toggle)
    SendAngularMessage("setVisible", toggle)
end

RegisterCommand("showUI", function()
    toggleUI(true)
    debugLog("UI toggled to true")
end)

RegisterNUICallback("truckerjob:hideUI", function(_, cb)
    toggleUI(false)          -- call the correct function
    debugLog("Hide NUI frame")
    cb({})
end)

RegisterNUICallback("truckerjob:getClientData", function(data, cb)
    debugLog("Data sent by Angular", json.encode(data))

    -- Send back client coords to the Angular app for use
    local curCoords = GetEntityCoords(PlayerPedId())
    local retData = {      -- dropped the '<const>' annotation
        x = curCoords.x,
        y = curCoords.y,
        z = curCoords.z
    }
    cb(retData)
end)
