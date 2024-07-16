function toggleRSVPModal() {
    const rsvpModal = new bootstrap.Modal(document.getElementById('rsvpModal'));
    rsvpModal.show();

    // Add event listener to focus on the input when the modal is fully shown
    document.getElementById('rsvpModal').addEventListener('shown.bs.modal', function () {
        const rsvpNameInput = document.getElementById('rsvpName');
        rsvpNameInput.focus();
    });

    // Add event listener to submit on Enter key press
    document.getElementById('rsvpName').addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            confirmRSVP();
        }
    });
}

function confirmRSVP() {
    const name = document.getElementById('rsvpName').value;

    if (name) {
        const rsvpModal = bootstrap.Modal.getInstance(document.getElementById('rsvpModal'));
        rsvpModal.hide();
        showThankYouAlert(name);
    } else {
        alert('Por favor ingresa tu nombre.');
    }
}

function showThankYouAlert(name) {

    const thankYouAlertLabel = document.getElementById('thankYouAlertLabel');
    if (name.includes(',')) {
        thankYouAlertLabel.innerHTML = '¡Gracias por confirmar! Los esperamos en diciembre';
    } else {
        thankYouAlertLabel.innerHTML = '¡Gracias por confirmar! Te esperamos en diciembre';
    }

    const thankYouAlert = new bootstrap.Modal(document.getElementById('thankYouAlert'));
    thankYouAlert.show();

    setTimeout(() => {
        thankYouAlert.hide();
    }, 5000); // Alert will disappear after 3 seconds
}



function toggleComplete(element) {
    const giftItem = element.closest('.gift-item');
    const giftList = giftItem.parentElement;
    const isCompleted = giftItem.classList.toggle('completed');

    if (isCompleted) {
        element.classList.replace('bi-square', 'bi-check-square');

        const lastItem = giftList.lastElementChild;
        const lastItemRect = lastItem.getBoundingClientRect();
        const giftItemRect = giftItem.getBoundingClientRect();
        const distance = lastItemRect.top - giftItemRect.top + lastItemRect.height;

        giftItem.classList.add('moving');
        giftItem.style.transform = `translateY(${distance}px)`;

        setTimeout(() => {
            giftItem.classList.remove('moving');
            giftItem.style.transform = '';
            giftItem.classList.add('hidden');

            giftList.appendChild(giftItem);
            giftItem.classList.remove('hidden');
        }, 1000);
    } else {
        element.classList.replace('bi-check-square', 'bi-square');
        giftItem.classList.remove('completed');
        giftList.insertBefore(giftItem, giftList.firstChild);
    }
}

function toggleGiftModal() {
    const giftModal = new bootstrap.Modal(document.getElementById('giftModal'));
    giftModal.toggle();
}

function addGift() {
    const name = document.getElementById('giftName').value;
    const link = document.getElementById('giftLink').value;
    const image = document.getElementById('giftImageLink').value || 'default-image.jpg';

    if (name && link) {
        const giftList = document.querySelector('.gift-list');
        const newGiftItem = document.createElement('div');
        newGiftItem.classList.add('gift-item');
        newGiftItem.innerHTML = `
            <div class="gift-content">
                <a href="${link}" target="_blank">
                    <img src="${image}" alt="${name}">
                    <p>${name}</p>
                </a>
                <i class="bi bi-square" onclick="toggleComplete(this)"></i>
            </div>
        `;

        giftList.insertBefore(newGiftItem, giftList.children[2]);

        document.getElementById('giftName').value = '';
        document.getElementById('giftLink').value = '';
        document.getElementById('giftImageLink').value = '';

        const giftModal = bootstrap.Modal.getInstance(document.getElementById('giftModal'));
        giftModal.hide();
    } else {
        alert('Por favor complete el nombre y el enlace del regalo.');
    }
}

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


