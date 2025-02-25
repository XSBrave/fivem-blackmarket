local QBCore = exports['qb-core']:GetCoreObject()
local PlayerData = {}
local blackmarketPed = nil
local display = false

-- Oyuncu verilerini güncelle
RegisterNetEvent('QBCore:Client:OnPlayerLoaded', function()
    PlayerData = QBCore.Functions.GetPlayerData()
end)

RegisterNetEvent('QBCore:Client:OnPlayerUnload', function()
    PlayerData = {}
end)

RegisterNetEvent('QBCore:Client:OnJobUpdate', function(JobInfo)
    PlayerData.job = JobInfo
end)

RegisterNetEvent('QBCore:Player:SetPlayerData', function(val)
    PlayerData = val
end)

-- NPC oluştur
CreateThread(function()
    RequestModel(GetHashKey(Config.NPCModel))
    while not HasModelLoaded(GetHashKey(Config.NPCModel)) do
        Wait(1)
    end
    
    blackmarketPed = CreatePed(4, GetHashKey(Config.NPCModel), Config.NPCLocation.x, Config.NPCLocation.y, Config.NPCLocation.z - 1, Config.NPCLocation.w, false, true)
    SetEntityHeading(blackmarketPed, Config.NPCLocation.w)
    FreezeEntityPosition(blackmarketPed, true)
    SetEntityInvincible(blackmarketPed, true)
    SetBlockingOfNonTemporaryEvents(blackmarketPed, true)
    TaskStartScenarioInPlace(blackmarketPed, Config.NPCScenario, 0, true)

    exports['qb-target']:AddTargetEntity(blackmarketPed, {
        options = {
            {
                type = "client",
                event = "coren-blackmarket:client:openMenu",
                icon = "fas fa-shopping-bag",
                label = "Konuş",
            },
        },
        distance = 2.0
    })
end)

-- Menüyü aç
RegisterNetEvent('coren-blackmarket:client:openMenu', function()
    QBCore.Functions.TriggerCallback('coren-blackmarket:server:hasCard', function(hasCard)
        if hasCard then
            OpenBlackMarketMenu()
        else
            QBCore.Functions.Notify(Config.Messages.no_card, "error")
        end
    end)
end)

function OpenBlackMarketMenu()
    if display then return end
    
    PlayerData = QBCore.Functions.GetPlayerData()
    if not PlayerData then return end
    
    display = true
    SetNuiFocus(true, true)
    TriggerServerEvent('coren-blackmarket:server:menuOpened')
    
    local playerMoney = 0
    if PlayerData.money and PlayerData.money.cash then
        playerMoney = PlayerData.money.cash
    end
    
    SendNUIMessage({
        type = "open",
        items = Config.Items,
        playerMoney = playerMoney
    })
end

-- NUI Callbacks
RegisterNUICallback('close', function()
    SetNuiFocus(false, false)
    display = false
    TriggerServerEvent('coren-blackmarket:server:menuClosed')
end)

RegisterNUICallback('buyItem', function(data, cb)
    TriggerServerEvent('coren-blackmarket:server:buyItem', data)
    if cb then cb('ok') end
end)

-- Para güncellemesi için event
RegisterNetEvent('coren-blackmarket:client:updateMoney', function()
    if display then
        PlayerData = QBCore.Functions.GetPlayerData()
        local playerMoney = PlayerData.money and PlayerData.money.cash or 0
        
        SendNUIMessage({
            type = "update",
            playerMoney = playerMoney
        })
    end
end)

-- NPC'yi sil
AddEventHandler('onResourceStop', function(resourceName)
    if (GetCurrentResourceName() ~= resourceName) then return end
    if blackmarketPed then
        DeletePed(blackmarketPed)
    end
    if display then
        display = false
        SetNuiFocus(false, false)
    end
end)

-- Menü açma fonksiyonunda
RegisterNetEvent('coren-black:client:openMenu')
AddEventHandler('coren-black:client:openMenu', function()
    if display then return end
    
    display = true
    SetNuiFocus(true, true)
    TriggerServerEvent('coren-black:server:menuOpened')
    SendNUIMessage({
        type = 'open',
        items = Config.Items,
        playerMoney = QBCore.Functions.GetPlayerData().money['cash']
    })
end) 