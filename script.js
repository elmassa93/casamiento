const API_URL = 'https://www.vidriera.online/Home';

// Fetch and display the gift list
async function fetchGiftList() {
    try {
        const response = await fetch(`${API_URL}/GetRegalos`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (response.ok) {
            const giftList = await response.json();
            renderGiftList(giftList);
        } else {
            console.error('Failed to fetch gift list:', response.statusText);
        }
    } catch (error) {
        console.error('Error fetching gift list:', error);
    }
}

// Render the gift list
function renderGiftList(giftList) {
    const giftListContainer = document.getElementById('giftList');
    giftListContainer.innerHTML = '';

    giftList.forEach(gift => {
        console.log(gift);
        const giftItem = document.createElement('div');
        giftItem.classList.add('col-12', 'col-md-6', 'col-lg-4', 'gift-item');
        giftItem.innerHTML = `
            <div class="gift-content">
                <a href="${gift.url}" target="_blank">
                    <img src="${gift.imageURL}" alt="${gift.nombre}">
                    <p>${gift.nombre}</p>
                </a>
                <i class="bi ${gift.tachado ? 'bi-check-square' : 'bi-square'}" onclick="toggleComplete(this, ${gift.regaloId})"></i>
            </div>
        `;
        giftListContainer.appendChild(giftItem);
    });
}

// Add a new gift
async function addGift() {
    const name = document.getElementById('giftName').value;
    const link = document.getElementById('giftLink').value;
    const image = document.getElementById('giftImageLink').value || 'default-image.jpg';

    if (name && link) {
        const newGift = {
            nombre: name,
            url: link,
            image: image,
            tachado: false
        };

        try {
            const response = await fetch(`${API_URL}/AddRegalo`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newGift)
            });

            if (response.ok) {
                document.getElementById('giftName').value = '';
                document.getElementById('giftLink').value = '';
                document.getElementById('giftImageLink').value = '';

                const giftModal = bootstrap.Modal.getInstance(document.getElementById('giftModal'));
                giftModal.hide();
                
                fetchGiftList(); // Refresh the gift list
            } else {
                alert('Error adding gift.');
            }
        } catch (error) {
            console.error('Error adding gift:', error);
        }
    } else {
        alert('Por favor complete el nombre y el enlace del regalo.');
    }
}

// Toggle gift completion
async function toggleComplete(element, giftId) {
    try {
        const response = await fetch(`${API_URL}/ToggleRegaloTachado`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: giftId })
        });

        if (response.ok) {
            const gift = await response.json();
            element.classList.toggle('bi-check-square', gift.tachado);
            element.classList.toggle('bi-square', !gift.tachado);
        } else {
            alert('Error toggling gift.');
        }
    } catch (error) {
        console.error('Error toggling gift:', error);
    }
}

// Initialize the gift list on page load
document.addEventListener('DOMContentLoaded', function () {
    fetchGiftList();
});

// Existing code for countdown and map initialization
const countdown = () => {
    const weddingDate = new Date("December 15, 2024 13:00:00").getTime();
    const now = new Date().getTime();
    const difference = weddingDate - now;

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    document.getElementById("days").innerText = days;
    document.getElementById("hours").innerText = hours;
    document.getElementById("minutes").innerText = minutes;
    document.getElementById("seconds").innerText = seconds;

    if (difference < 0) {
        clearInterval(timer);
        document.getElementById("countdown").innerHTML = "¡Nos casamos!";
    }
};

const timer = setInterval(countdown, 1000);
countdown();

document.addEventListener("DOMContentLoaded", function () {
    function initMap() {
        const location = { lat: -43.02766442261236, lng: -71.47020025449234 };
        const map = new google.maps.Map(document.getElementById("map"), {
            zoom: 11,
            center: location,
        });

        const marker = new google.maps.Marker({
            position: location,
            map: map,
            title: 'Salón de eventos Pañil',
        });

        const infoWindowContent = `
            <div>
                <strong>Salón de eventos Pañil</strong><br>
                <a href="https://www.google.com/maps/dir/?api=1&destination=-43.02766442261236,-71.47020025449234" target="_blank">Direcciones</a>
            </div>
        `;

        const infoWindow = new google.maps.InfoWindow({
            content: infoWindowContent,
        });

        marker.addListener('click', function () {
            infoWindow.open(map, marker);
        });

        const controlDiv = document.createElement('div');
        controlDiv.style.margin = '10px';

        const controlUI = document.createElement('button');
        controlUI.style.backgroundColor = '#fff';
        controlUI.style.border = '2px solid #fff';
        controlUI.style.borderRadius = '3px';
        controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
        controlUI.style.cursor = 'pointer';
        controlUI.style.marginBottom = '22px';
        controlUI.style.textAlign = 'center';
        controlUI.style.padding = '10px';
        controlUI.innerText = 'Direcciones';
        controlUI.title = 'Clikeá para obtener direcciones';
        controlDiv.appendChild(controlUI);

        controlUI.addEventListener('click', function () {
            window.open('https://www.google.com/maps/dir/?api=1&destination=-43.02766442261236,-71.47020025449234', '_blank');
        });

        map.controls[google.maps.ControlPosition.TOP_CENTER].push(controlDiv);
    }

    initMap();
});
