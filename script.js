// script.js
let watchID;
let totalDistance = 0; // Total distance in meters
let lastPosition = null;
let startTime = null;
const latitudeValue = document.getElementById('latitude');
const longitudeValue = document.getElementById('longitude');
const speedValue = document.getElementById('speedValue');
const distanceValue = document.getElementById('distanceValue');
const timeValue = document.getElementById('timeValue');
const startButton = document.getElementById('startButton');
const stopButton = document.getElementById('stopButton');

const MIN_SPEED_THRESHOLD = 0.1; // Minimum speed in m/s to consider valid
const MIN_DISTANCE_THRESHOLD = 1; // Minimum distance in meters to consider valid

function startTracking() {
    if (navigator.geolocation) {
        watchID = navigator.geolocation.watchPosition(updateLocationAndSpeed, handleError, {
            enableHighAccuracy: true,
            maximumAge: 0,
            timeout: 5000
        });
        startButton.disabled = true;
        stopButton.disabled = false;
        startTime = Date.now();
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

function stopTracking() {
    if (watchID) {
        navigator.geolocation.clearWatch(watchID);
        watchID = null;
        startButton.disabled = false;
        stopButton.disabled = true;
        resetValues();
    }
}

function updateLocationAndSpeed(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    const speed = position.coords.speed; // Speed in meters/second

    // Validate latitude and longitude
    if (!isNaN(latitude) && !isNaN(longitude)) {
        latitudeValue.textContent = latitude.toFixed(6);
        longitudeValue.textContent = longitude.toFixed(6);
    }

    // Validate speed
    if (speed !== null && !isNaN(speed) && speed >= MIN_SPEED_THRESHOLD) {
        const speedMps = speed; // Speed is already in m/s
        speedValue.textContent = speedMps.toFixed(2);

        // Calculate distance if last position is available
        if (lastPosition) {
            const distance = calculateDistance(lastPosition.latitude, lastPosition.longitude, latitude, longitude);
            if (distance >= MIN_DISTANCE_THRESHOLD) {
                totalDistance += distance;
                distanceValue.textContent = totalDistance.toFixed(2);
            }
        }
        lastPosition = position;
    }

    // Calculate time elapsed
    const currentTime = Date.now();
    if (startTime) {
        const timeElapsed = (currentTime - startTime) / 1000; // Convert to seconds
        timeValue.textContent = timeElapsed.toFixed(2);
    }
}

function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const lat1Rad = lat1 * Math.PI / 180;
    const lat2Rad = lat2 * Math.PI / 180;

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1Rad) * Math.cos(lat2Rad);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c * 1000; // Convert to meters

    return distance;
}

function handleError(error) {
    alert("Error occurred while getting your location: " + error.message);
}

function resetValues() {
    totalDistance = 0;
    lastPosition = null;
    startTime = null;
    latitudeValue.textContent = '0';
    longitudeValue.textContent = '0';
    speedValue.textContent = '0';
    distanceValue.textContent = '0';
    timeValue.textContent = '0';
}

startButton.addEventListener('click', startTracking);
stopButton.addEventListener('click', stopTracking);