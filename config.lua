Config = {}

-- Discord Webhook Ayarları
Config.Webhook = {
    url = "https://discord.com/api/webhooks/1340091692539183134/G4t47VO3U0O735qQwNVTnim-TfIJd8OhGJzePzXk3Lf7g7rAYpiR0uLvPi1O4CugUmzo", -- Discord webhook URL'nizi buraya ekleyin
    logoUrl = "https://media.discordapp.net/attachments/1331199943834075186/1337893723484192888/4.png?ex=67b10320&is=67afb1a0&hm=9c70e21c3b25a16fd42b1bf8a8e60dc81e1880e24196ec79f8fc7e6586b8d396&=&format=webp&quality=lossless&width=671&height=671", -- Discord webhook için logo URL'si
    name = "Black Market Logs",
    color = 3447003, -- Mavi renk
    footer = "Black Market System",
    footerIcon = "" -- Footer için ikon URL'si
}

-- NPC Ayarları
Config.NPCLocation = vector4(1240.85, -3168.54, 7.1, 180.0) -- NPC'nin konumu
Config.NPCModel = "g_m_m_armboss_01" -- NPC modeli
Config.NPCScenario = "WORLD_HUMAN_SMOKING" -- NPC animasyonu

-- Kart Gereksinimleri
Config.RequiredCard = "mastercard" -- Gerekli kart item'ı

-- Resim Yolu Ayarları
Config.ImagePath = "nui://coren-black/html/images/" -- Resimlerin ana dizini

-- Market Ürünleri
Config.Items = {
    -- SİLAHLAR
    {
        name = "weapon_pistol",
        label = "Combat Pistol",
        price = 15000,
        amount = 1,
        info = {},
        type = "weapon",
        slot = 1,
        description = "Güvenilir ve etkili bir tabanca. Yakın mesafe çatışmalar için ideal.",
        category = "weapons",
        image = "weapon_pistol" -- Resim yolu
    },
    {
        name = "weapon_smg",
        label = "SMG",
        price = 25000,
        amount = 1,
        info = {},
        type = "weapon",
        slot = 2,
        description = "Yüksek atış hızına sahip hafif makineli tüfek.",
        category = "weapons",
        image = "weapon_smg" -- Resim yolu
    },
    {
        name = "weapon_heavypistol",
        label = "Heavy Pistol",
        price = 17500,
        amount = 1,
        info = {},
        type = "weapon",
        slot = 3,
        description = "Güçlü ve hassas bir tabanca. Yüksek durdurucu güce sahip.",
        category = "weapons",
        image = "weapon_heavypistol" -- Resim yolu
    },

    -- ALETLER
    {
        name = "lockpick",
        label = "Gelişmiş Maymuncuk",
        price = 750,
        amount = 1,
        info = {},
        type = "item",
        slot = 4,
        description = "Profesyonel kalite maymuncuk. Her türlü kilidi açmak için ideal.",
        category = "tools",
        image = "lockpick" -- Resim yolu
    },
    {
        name = "hackerdevice",
        label = "Hack Cihazı",
        price = 4500,
        amount = 1,
        info = {},
        type = "item",
        slot = 5,
        description = "Son teknoloji güvenlik sistemi bypass cihazı.",
        category = "tools",
        image = "hackerdevice" -- Resim yolu
    },
    {
        name = "thermite",
        label = "Termit",
        price = 3000,
        amount = 1,
        info = {},
        type = "item",
        slot = 6,
        description = "Yüksek ısıda metal eritme kapasitesine sahip termit karışımı.",
        category = "tools",
        image = "thermite" -- Resim yolu
    },

    -- ÖZEL EŞYALAR
    {
        name = "armor",
        label = "Ağır Zırh",
        price = 7500,
        amount = 1,
        info = {},
        type = "item",
        slot = 7,
        description = "Maksimum koruma sağlayan gelişmiş zırh sistemi.",
        category = "special",
        image = "armor" -- Resim yolu
    },
    {
        name = "radio",
        label = "Şifreli Telsiz",
        price = 2500,
        amount = 1,
        info = {},
        type = "item",
        slot = 8,
        description = "Güvenli iletişim için özel frekans telsizi.",
        category = "special",
        image = "radio" -- Resim yolu
    },
    {
        name = "laptop",
        label = "Hack Laptopu",
        price = 8500,
        amount = 1,
        info = {},
        type = "item",
        slot = 9,
        description = "Özel yazılımlarla donatılmış güçlü laptop.",
        category = "special",
        image = "laptop" -- Resim yolu
    }
}

-- Menü Ayarları
Config.MenuSettings = {
    title = "⚫ Kara Borsa",
    align = 'top-right',
    elements = {}
}

-- Bildirim Mesajları
Config.Messages = {
    no_card = "Gerekli karta sahip değilsin!",
    not_enough_money = "Yeterli paran yok!",
    purchase_success = "Başarıyla satın aldın:",
    menu_header = "🕶️ Kara Borsa Marketi",
    menu_subheader = "Güvenilir tedarikçiniz",
    close_button = "❌ Kapat"
} 