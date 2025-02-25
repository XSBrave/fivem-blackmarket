let selectedCategory = 'all';
let searchQuery = '';

document.addEventListener('keydown', function(event) {
    if (event.key === "Escape") {
        const modal = document.querySelector('.item-modal');
        if (modal && modal.style.display === 'flex') {
            closeModal();
        } else {
            closeMenu();
        }
    }
});

window.addEventListener('message', function(event) {
    var item = event.data;
    if (item.type === "ui") {
        if (item.display === true) {
            document.querySelector(".container").style.display = "flex";
            document.querySelector(".market-container").classList.add("show");
            setupMarket(item.items, item.money);
        } else {
            closeMenu();
        }
    }
});

function setupMarket(items, money) {
    document.querySelector('.player-money').innerHTML = `
        <i class="fas fa-wallet"></i>
        <span>$${numberWithCommas(money)}</span>
    `;

    const categories = getCategories(items);
    setupCategories(categories);
    displayItems(items);

    // Search functionality
    const searchInput = document.querySelector('.search-bar input');
    searchInput.addEventListener('input', function(e) {
        searchQuery = e.target.value.toLowerCase();
        displayItems(items);
    });
}

function getCategories(items) {
    const categories = new Set();
    items.forEach(item => {
        categories.add(getItemCategory(item.name));
    });
    return ['all', ...Array.from(categories)];
}

function setupCategories(categories) {
    const categoriesContainer = document.querySelector('.sidebar-categories');
    categoriesContainer.innerHTML = categories.map(category => `
        <div class="category ${category === selectedCategory ? 'active' : ''}" data-category="${category}">
            <i class="fas ${getCategoryIcon(category)}"></i>
            <span>${getCategoryLabel(category)}</span>
        </div>
    `).join('');

    document.querySelectorAll('.category').forEach(cat => {
        cat.addEventListener('click', function() {
            selectedCategory = this.dataset.category;
            document.querySelectorAll('.category').forEach(c => c.classList.remove('active'));
            this.classList.add('active');
            displayItems(window.currentItems);
        });
    });
}

function getCategoryIcon(category) {
    const icons = {
        'all': 'fa-th-large',
        'weapons': 'fa-gun',
        'tools': 'fa-tools',
        'special': 'fa-star'
    };
    return icons[category] || 'fa-box';
}

function getCategoryLabel(category) {
    const labels = {
        'all': 'Tüm Ürünler',
        'weapons': 'Silahlar',
        'tools': 'Aletler',
        'special': 'Özel Ürünler'
    };
    return labels[category] || category.charAt(0).toUpperCase() + category.slice(1);
}

function getItemCategory(itemName) {
    if (itemName.toLowerCase().includes('weapon') || itemName.toLowerCase().includes('pistol') || 
        itemName.toLowerCase().includes('gun') || itemName.toLowerCase().includes('rifle')) {
        return 'weapons';
    } else if (itemName.toLowerCase().includes('lockpick') || itemName.toLowerCase().includes('toolkit') ||
               itemName.toLowerCase().includes('hack')) {
        return 'tools';
    } else {
        return 'special';
    }
}

function getItemIcon(itemName) {
    const icons = {
        'weapon': 'fa-gun',
        'pistol': 'fa-gun',
        'rifle': 'fa-gun',
        'smg': 'fa-gun',
        'lockpick': 'fa-key',
        'toolkit': 'fa-tools',
        'hack': 'fa-laptop-code',
        'armor': 'fa-shield',
        'ammo': 'fa-bullets'
    };

    for (const [key, value] of Object.entries(icons)) {
        if (itemName.toLowerCase().includes(key)) {
            return value;
        }
    }
    return 'fa-box';
}

function getItemDescription(itemName) {
    const descriptions = {
        'weapon_pistol': 'Güvenilir ve etkili bir tabanca. Yakın mesafe çatışmalar için ideal.',
        'weapon_smg': 'Yüksek atış hızına sahip hafif makineli tüfek. Orta mesafe çatışmalar için uygun.',
        'weapon_rifle': 'Uzun menzilli ve yüksek hasar veren taarruz tüfeği.',
        'lockpick': 'Profesyonel kalitede maymuncuk. Kilitli kapıları açmak için kullanılır.',
        'toolkit': 'Çeşitli aletler içeren kompakt set. Tamir ve modifikasyon işlemleri için gerekli.',
        'hack_device': 'Gelişmiş güvenlik sistemlerini atlatmak için özel tasarlanmış cihaz.',
        'armor': 'Yüksek kaliteli koruyucu zırh. Çatışmalarda hayat kurtarır.',
        'ammo': 'Yüksek kaliteli mühimmat. Çeşitli silahlar için uyumlu.'
    };

    for (const [key, value] of Object.entries(descriptions)) {
        if (itemName.toLowerCase().includes(key)) {
            return value;
        }
    }
    return 'Özel sipariş ürün. Detaylı bilgi için satıcıyla görüşün.';
}

function displayItems(items) {
    window.currentItems = items;
    const container = document.querySelector('.items-container');
    
    const filteredItems = items.filter(item => {
        const matchesCategory = selectedCategory === 'all' || getItemCategory(item.name) === selectedCategory;
        const matchesSearch = item.label.toLowerCase().includes(searchQuery);
        return matchesCategory && matchesSearch;
    });

    container.innerHTML = filteredItems.map(item => `
        <div class="item-card" data-category="${getItemCategory(item.name)}" onclick="showItemModal('${item.name}', '${item.label}', ${item.price})">
            <div class="item-image">
                <i class="fas ${getItemIcon(item.name)}"></i>
            </div>
            <div class="item-info">
                <h3>${item.label}</h3>
                <p>${numberWithCommas(item.price)}</p>
            </div>
            <div class="item-category">
                <i class="fas ${getCategoryIcon(getItemCategory(item.name))}"></i>
                <span>${getItemCategory(item.name)}</span>
            </div>
        </div>
    `).join('');
}

function showItemModal(name, label, price) {
    const modal = document.createElement('div');
    modal.className = 'item-modal';
    modal.style.display = 'flex';
    
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>Ürün Detayları</h2>
                <i class="fas fa-times modal-close" onclick="closeModal()"></i>
            </div>
            <div class="modal-body">
                <div class="item-preview">
                    <div class="item-image">
                        <i class="fas ${getItemIcon(name)}"></i>
                    </div>
                    <div class="item-details">
                        <h2 class="item-name">${label}</h2>
                        <p class="item-price">$${numberWithCommas(price)}</p>
                        <div class="item-quantity">
                            <button class="qty-btn" onclick="updateQuantity(-1)">-</button>
                            <input type="number" id="buyAmount" value="1" min="1" max="100">
                            <button class="qty-btn" onclick="updateQuantity(1)">+</button>
                        </div>
                        <button class="buy-btn" onclick="buyItem('${name}', ${price})">
                            <i class="fas fa-shopping-cart"></i>
                            Satın Al
                        </button>
                    </div>
                </div>
                <div class="item-description">
                    <h4>Ürün Açıklaması</h4>
                    <p>${getItemDescription(name)}</p>
                </div>
            </div>
        </div>
    `;
    
    document.querySelector('.container').appendChild(modal);
}

function updateQuantity(change) {
    const input = document.querySelector('#buyAmount');
    let value = parseInt(input.value) + change;
    value = Math.max(1, Math.min(100, value));
    input.value = value;
}

function buyItem(name, price) {
    const amount = document.querySelector('#buyAmount').value;
    $.post('https://coren-black/buyItem', JSON.stringify({
        item: name,
        amount: amount,
        price: price
    }));
    closeModal();
}

function closeModal() {
    const modal = document.querySelector('.item-modal');
    if (modal) {
        modal.remove();
    }
}

function closeMenu() {
    document.querySelector(".market-container").classList.remove("show");
    setTimeout(() => {
        document.querySelector(".container").style.display = "none";
    }, 300);
    $.post('https://coren-black/exit', JSON.stringify({}));
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
} 