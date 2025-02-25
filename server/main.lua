local QBCore = exports['qb-core']:GetCoreObject()

-- Kart kontrolü
QBCore.Functions.CreateCallback('coren-blackmarket:server:hasCard', function(source, cb)
    local Player = QBCore.Functions.GetPlayer(source)
    if not Player then return cb(false) end
    
    local hasCard = Player.Functions.GetItemByName(Config.RequiredCard)
    cb(hasCard ~= nil)
end)

-- Ürün satın alma
RegisterNetEvent('coren-blackmarket:server:buyItem', function(data)
    local src = source
    local Player = QBCore.Functions.GetPlayer(src)
    if not Player then return end
    
    -- Kart kontrolü
    local hasCard = Player.Functions.GetItemByName(Config.RequiredCard)
    if not hasCard then
        TriggerClientEvent('QBCore:Notify', src, Config.Messages.no_card, 'error')
        return
    end
    
    -- Para kontrolü
    if Player.PlayerData.money['cash'] < data.price then
        TriggerClientEvent('QBCore:Notify', src, Config.Messages.not_enough_money, 'error')
        return
    end
    
    -- Para kesintisi ve item verme
    if Player.Functions.RemoveMoney('cash', data.price) then
        -- Item bilgilerini al
        local itemData = QBCore.Shared.Items[data.item]
        if not itemData then return end
        
        Player.Functions.AddItem(data.item, data.amount, false, data.info)
        TriggerClientEvent('inventory:client:ItemBox', src, QBCore.Shared.Items[data.item], "add")
        TriggerClientEvent('QBCore:Notify', src, Config.Messages.purchase_success .. " " .. data.label, 'success')
        -- Para güncellemesini gönder
        TriggerClientEvent('coren-blackmarket:client:updateMoney', src)
        
        -- Discord log gönder (detaylı bilgilerle)
        SendDiscordLog(src, "Satın Alma", {
            item = data.item,
            label = data.label or itemData.label,
            amount = data.amount,
            price = data.price,
            category = data.category or "Belirtilmemiş",
            type = itemData.type or "Belirtilmemiş",
            weight = itemData.weight or 0,
            info = data.info or {}
        })
    end
end)

-- Discord'a log gönderme fonksiyonu
function SendDiscordLog(player, action, data)
    if Config.Webhook.url == "" then return end -- Webhook URL boşsa gönderme
    
    local Player = QBCore.Functions.GetPlayer(player)
    if not Player then return end

    local playerName = GetPlayerName(player)
    local playerIdentifier = GetPlayerIdentifiers(player)[1]
    local timestamp = os.date("%Y-%m-%d %H:%M:%S")
    
    local embedData = {
        {
            ["title"] = "Black Market - " .. action,
            ["color"] = Config.Webhook.color,
            ["author"] = {
                ["name"] = "Black Market Logs",
                ["icon_url"] = Config.Webhook.logoUrl
            },
            ["footer"] = {
                ["text"] = "Black Market System • " .. timestamp,
                ["icon_url"] = Config.Webhook.footerIcon
            },
            ["thumbnail"] = {
                ["url"] = Config.Webhook.logoUrl
            },
            ["fields"] = {
                {
                    ["name"] = "👤 Oyuncu Bilgileri",
                    ["value"] = string.format("```\nİsim: %s\nID: %s\nTelefon: %s```", 
                        playerName, 
                        playerIdentifier,
                        Player.PlayerData.charinfo.phone or "Bilinmiyor"
                    ),
                    ["inline"] = true
                }
            },
            ["timestamp"] = os.date("!%Y-%m-%dT%H:%M:%SZ")
        }
    }

    -- Satın alma işlemi için özel alanlar
    if action == "Satın Alma" and data then
        -- Ürün detayları alanı
        table.insert(embedData[1]["fields"], {
            ["name"] = "🛍️ Ürün Detayları",
            ["value"] = string.format("```\nÜrün Kodu: %s\nÜrün Adı: %s\nKategori: %s\nTür: %s\nMiktar: %d adet\nBirim Fiyat: $%s\nToplam: $%s```", 
                data.item,
                data.label,
                data.category,
                data.type,
                data.amount,
                numberWithCommas(data.price / data.amount),
                numberWithCommas(data.price)
            ),
            ["inline"] = false
        })
        
        -- Envanter durumu
        table.insert(embedData[1]["fields"], {
            ["name"] = "📦 Envanter Durumu",
            ["value"] = string.format("```\nKalan Para: $%s```",
                numberWithCommas(Player.PlayerData.money["cash"])
            ),
            ["inline"] = false
        })
        
        -- Konum bilgisi
        local ped = GetPlayerPed(player)
        local coords = GetEntityCoords(ped)
        table.insert(embedData[1]["fields"], {
            ["name"] = "📍 Konum Bilgisi",
            ["value"] = string.format("```\nX: %.2f\nY: %.2f\nZ: %.2f```", 
                coords.x, coords.y, coords.z
            ),
            ["inline"] = true
        })
    end

    -- Menü açma/kapama için özel alanlar
    if action == "Menü Açıldı" or action == "Menü Kapandı" then
        table.insert(embedData[1]["fields"], {
            ["name"] = "📋 İşlem Detayı",
            ["value"] = string.format("```\nİşlem: %s\nTarih: %s```", action, timestamp),
            ["inline"] = true
        })
    end

    -- Debug için log
    print("Discord Log Gönderiliyor:")
    print("Action:", action)
    if data then
        print("Data:", json.encode(data))
    end

    PerformHttpRequest(Config.Webhook.url, function(err, text, headers) 
        if err then
            print("Discord Log Hatası:", err)
        else
            print("Discord Log Başarıyla Gönderildi")
        end
    end, 'POST', json.encode({
        username = "Black Market Logs",
        avatar_url = Config.Webhook.logoUrl,
        embeds = embedData
    }), { ['Content-Type'] = 'application/json' })
end

-- Menü açma/kapama logları için eventler
RegisterNetEvent('coren-blackmarket:server:menuOpened')
AddEventHandler('coren-blackmarket:server:menuOpened', function()
    SendDiscordLog(source, "Menü Açıldı")
end)

RegisterNetEvent('coren-blackmarket:server:menuClosed')
AddEventHandler('coren-blackmarket:server:menuClosed', function()
    SendDiscordLog(source, "Menü Kapandı")
end) 