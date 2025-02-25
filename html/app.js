let items = [];
let playerMoney = 0;
let selectedCategory = 'all';
let searchQuery = '';

$(document).ready(function() {
    window.addEventListener('message', function(event) {
        let data = event.data;

        if (data.type === 'open') {
            $('.container').fadeIn(300);
            setTimeout(() => {
                $('.market-container').addClass('show');
            }, 100);
            items = data.items;
            playerMoney = data.playerMoney;
            updateUI();
        } else if (data.type === 'close') {
            closeMenu();
        } else if (data.type === 'update') {
            playerMoney = data.playerMoney;
            updatePlayerMoney();
        }
    });

    // Event Listeners
    $('.close-btn, .modal-close').on('click', function() {
        closeMenu();
    });

    $(document).keyup(function(e) {
        if (e.key === "Escape") {
            if ($('.item-modal').is(':visible')) {
                closeModal();
            } else {
                closeMenu();
            }
        }
    });

    // Category click
    $('.category').on('click', function() {
        $('.category').removeClass('active');
        $(this).addClass('active');
        selectedCategory = $(this).data('category');
        updateItems();
    });

    // Search input
    $('.search-bar input').on('input', function() {
        searchQuery = $(this).val().toLowerCase();
        updateItems();
    });

    // Quantity buttons
    $('.qty-btn.minus').on('click', function() {
        let input = $('.item-quantity input');
        let value = parseInt(input.val());
        if (value > 1) input.val(value - 1);
    });

    $('.qty-btn.plus').on('click', function() {
        let input = $('.item-quantity input');
        let value = parseInt(input.val());
        if (value < 100) input.val(value + 1);
    });

    // Buy button
    $('.buy-btn').on('click', function() {
        const itemName = $(this).data('item');
        const item = items.find(i => i.name === itemName);
        const quantity = parseInt($('.item-quantity input').val());
        
        if (item) {
            const purchaseData = {
                item: item.name,
                price: item.price * quantity,
                label: item.label,
                amount: quantity,
                info: item.info,
                category: item.category || getItemCategory(item.name)
            };
            
            $.post('https://coren-black/buyItem', JSON.stringify(purchaseData));
            closeModal();
        }
    });
});

function updateUI() {
    updatePlayerMoney();
    updateItems();
}

function updatePlayerMoney() {
    $('.player-money span').text('$' + numberWithCommas(playerMoney));
}

function updateItems() {
    const container = $('.items-container');
    container.empty();

    const filteredItems = items.filter(item => {
        const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
        const matchesSearch = item.label.toLowerCase().includes(searchQuery) || 
                            item.name.toLowerCase().includes(searchQuery);
        return matchesCategory && matchesSearch;
    });

    filteredItems.forEach(item => {
        const itemCategory = item.category;
        const categoryLabel = getCategoryLabel(itemCategory).toUpperCase();
        const categoryIcon = getCategoryIcon(itemCategory);
        let imagePath;
        
        // Özel durumlar için resim yolu kontrolü
        if (item.name.toLowerCase() === 'hackerdevice') {
            imagePath = 'nui://ox_inventory/web/images/HACKING_DEVICE.png';
        } else {
            imagePath = `nui://ox_inventory/web/images/${item.name.toUpperCase()}.png`;
        }
        
        const itemCard = `
            <div class="item-card" data-item="${item.name}" data-category="${itemCategory}">
                <div class="item-category-tag ${itemCategory}">
                    <i class="fas ${categoryIcon}"></i>
                    <span>${categoryLabel}</span>
                </div>
                <div class="item-image">
                    <img src="${imagePath}" alt="${item.label}" onerror="this.src='nui://ox_inventory/web/images/default.png'">
                </div>
                <div class="item-info">
                    <h3>${item.label}</h3>
                    <p>${numberWithCommas(item.price)}</p>
                </div>
            </div>
        `;
        container.append(itemCard);
    });

    // Item click event
    $('.item-card').on('click', function() {
        const itemName = $(this).data('item');
        const item = items.find(i => i.name === itemName);
        if (item) {
            openItemModal(item);
        }
    });
}

function getItemCategory(itemName) {
    if (!itemName) return 'default';
    
    if (itemName.includes('weapon_') || itemName.toLowerCase().includes('pistol') || 
        itemName.toLowerCase().includes('gun')) return 'weapons';
    if (['lockpick', 'hackerdevice', 'thermite', 'laptop'].includes(itemName.toLowerCase())) return 'tools';
    if (['armor', 'radio'].includes(itemName.toLowerCase())) return 'special';
    return 'default';
}

function getItemIcon(itemName) {
    const icons = {
        // Silahlar
        'weapon_pistol': 'fa-gun',
        'weapon_smg': 'fa-gun',
        'weapon_heavypistol': 'fa-gun',
        'weapon_combatpistol': 'fa-gun',
        
        // Aletler
        'lockpick': 'fa-key',
        'hackerdevice': 'fa-microchip',
        'hackingdevice': 'fa-microchip',
        'hackerlaptop': 'fa-laptop-code',
        'thermite': 'fa-fire',
        
        // Özel Eşyalar
        'armor': 'fa-shield-halved',
        'radio': 'fa-walkie-talkie',
        'laptop': 'fa-laptop-code',
        
        'default': 'fa-box'
    };
    return icons[itemName.toLowerCase()] || icons.default;
}

function getItemDescription(itemName) {
    const item = items.find(i => i.name === itemName);
    if (item && item.description) {
        return item.description;
    }
    
    const descriptions = {
        // Silahlar
        'weapon_pistol': 'Güvenilir ve etkili bir tabanca. Yakın mesafe çatışmalar için ideal.',
        'weapon_smg': 'Yüksek atış hızına sahip hafif makineli tüfek.',
        'weapon_heavypistol': 'Güçlü ve hassas bir tabanca. Yüksek durdurucu güce sahip.',
        
        // Aletler
        'lockpick': 'Profesyonel kalite maymuncuk. Her türlü kilidi açmak için ideal.',
        'hackerdevice': 'Son teknoloji güvenlik sistemi bypass cihazı.',
        'thermite': 'Yüksek ısıda metal eritme kapasitesine sahip termit karışımı.',
        
        // Özel Eşyalar
        'armor': 'Maksimum koruma sağlayan gelişmiş zırh sistemi.',
        'radio': 'Güvenli iletişim için özel frekans telsizi.',
        'laptop': 'Özel yazılımlarla donatılmış güçlü laptop.',
        
        'default': 'Bu ürün hakkında detaylı bilgi bulunmuyor.'
    };
    return descriptions[itemName] || descriptions.default;
}

function openItemModal(item) {
    if (!item) return;
    
    $('.item-modal').fadeIn(200);
    let imagePath;
    
    // Özel durumlar için resim yolu kontrolü
    if (item.name.toLowerCase() === 'hackerdevice') {
        imagePath = 'nui://ox_inventory/web/images/HACKING_DEVICE.png';
    } else {
        imagePath = `nui://ox_inventory/web/images/${item.name.toUpperCase()}.png`;
    }
    
    const modalContent = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>Ürün Detayları</h2>
                <i class="fas fa-times modal-close"></i>
            </div>
            <div class="modal-body">
                <div class="item-preview">
                    <div class="item-image">
                        <img src="${imagePath}" alt="${item.label}" onerror="this.src='nui://ox_inventory/web/images/default.png'">
                    </div>
                    <div class="item-details">
                        <h2 class="item-name">${item.label}</h2>
                        <p class="item-price">$${numberWithCommas(item.price)}</p>
                        <div class="item-quantity">
                            <button class="qty-btn minus">-</button>
                            <input type="number" value="1" min="1" max="100">
                            <button class="qty-btn plus">+</button>
                        </div>
                        <button class="buy-btn" data-item="${item.name}">
                            <i class="fas fa-shopping-cart"></i>
                            Satın Al
                        </button>
                    </div>
                </div>
                <div class="item-description">
                    <h4>Ürün Açıklaması</h4>
                    <p>${item.description}</p>
                </div>
            </div>
        </div>
    `;
    
    $('.item-modal').html(modalContent);
    setupModalEvents();
}

function setupModalEvents() {
    $('.modal-close').on('click', closeModal);
    $('.qty-btn.minus').on('click', function() {
        let input = $(this).siblings('input');
        let value = parseInt(input.val());
        if (value > 1) input.val(value - 1);
    });
    
    $('.qty-btn.plus').on('click', function() {
        let input = $(this).siblings('input');
        let value = parseInt(input.val());
        if (value < 100) input.val(value + 1);
    });
    
    $('.buy-btn').on('click', function() {
        const itemName = $(this).data('item');
        const item = items.find(i => i.name === itemName);
        const quantity = parseInt($('.item-quantity input').val());
        
        if (item) {
            const purchaseData = {
                item: item.name,
                price: item.price * quantity,
                label: item.label,
                amount: quantity,
                info: item.info,
                category: item.category || getItemCategory(item.name)
            };
            
            $.post('https://coren-black/buyItem', JSON.stringify(purchaseData));
            closeModal();
        }
    });
}

function closeModal() {
    $('.item-modal').fadeOut(200);
}

function closeMenu() {
    $('.market-container').removeClass('show');
    setTimeout(() => {
        $('.container').fadeOut(300);
        $('.item-modal').fadeOut(200);
    }, 200);
    $.post('https://coren-black/close');
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function getCategoryIcon(category) {
    const icons = {
        'weapons': 'fa-gun',
        'tools': 'fa-screwdriver-wrench',
        'special': 'fa-sparkles',
        'default': 'fa-box'
    };
    return icons[category] || icons.default;
}

function getCategoryLabel(category) {
    const labels = {
        'weapons': 'SİLAH',
        'tools': 'ALET',
        'special': 'ÖZEL',
        'all': 'TÜM ÜRÜNLER',
        'default': 'DİĞER'
    };
    return labels[category] || labels.default;
} 