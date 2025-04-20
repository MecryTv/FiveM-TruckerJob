function SendAngularMessage(action, data)
    SendNUIMessage({
        action = action,
        data = data
    })
end

local currentResName = GetCurrentResourceName()
-- fixed variable name here
local debugIsEnabled = GetConvarInt(('%s-debugMode'):format(currentResName), 0) == 1

function debugLog(...)
    if not debugIsEnabled then return end
    
    local args = {...}     -- dropped '<const>'
    local appendStr = ''
    
    for _, v in ipairs(args) do
        appendStr = appendStr .. ' ' .. tostring(v)
    end

    local msg = ('^3[%s]^0%s'):format(currentResName, appendStr)
    print(msg)
end
