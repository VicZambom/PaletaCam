const video = document.getElementById('video');
const captureBtn = document.getElementById('capture-btn');
const paletteDisplay = document.getElementById('palette-display');
const statusText = document.getElementById('status-text');
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d', { willReadFrequently: true });

let stream;

async function initCamera() {
    try {
        const constraints = {
            video: {
                facingMode: 'environment',
                width: { ideal: 1280 },
                height: { ideal: 720 }
            },
            audio: false
        };
        stream = await navigator.mediaDevices.getUserMedia(constraints);
        video.srcObject = stream;
        video.onloadedmetadata = () => {
            statusText.style.display = 'none';
            captureBtn.disabled = false;
        };
    } catch (err) {
        console.error("Erro ao aceder à câmara: ", err);
        statusText.textContent = 'Erro ao aceder à câmara. Verifique as permissões.';
    }
}

async function captureAndProcess() {
    captureBtn.disabled = true;
    paletteDisplay.innerHTML = '<p class="col-span-full text-center">A analisar cores...</p>';

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const colors = getDominantColors(imageData, 5);

    displayPalette(colors);
    
    captureBtn.disabled = false;
}

function getDominantColors(imageData, count) {
    const colorMap = {};
    const pixels = imageData.data;
    const step = 4 * 10;

    for (let i = 0; i < pixels.length; i += step) {
        const r = pixels[i];
        const g = pixels[i + 1];
        const b = pixels[i + 2];
        
        const key = `${Math.round(r / 10) * 10},${Math.round(g / 10) * 10},${Math.round(b / 10) * 10}`;

        if (!colorMap[key]) {
            colorMap[key] = { count: 0, r, g, b };
        }
        colorMap[key].count++;
    }

    const sortedColors = Object.values(colorMap).sort((a, b) => b.count - a.count);
    
    return sortedColors.slice(0, count).map(color => {
        const toHex = c => ('0' + c.toString(16)).slice(-2);
        return `#${toHex(color.r)}${toHex(color.g)}${toHex(color.b)}`;
    });
}

async function displayPalette(colors) {
    paletteDisplay.innerHTML = '';
    for (const color of colors) {
        const colorName = await getColorName(color.substring(1));
        const textColor = getTextColor(color);

        const colorEl = document.createElement('div');
        colorEl.className = 'color-card p-4 rounded-lg flex flex-col justify-between h-24 sm:h-32 text-center shadow-md';
        colorEl.style.backgroundColor = color;
        colorEl.style.color = textColor;
        colorEl.innerHTML = `
            <span class="font-bold text-sm">${colorName}</span>
            <span class="font-mono text-xs uppercase">${color}</span>
        `;
        paletteDisplay.appendChild(colorEl);
    }
}

async function getColorName(hex) {
    try {
        const response = await fetch(`https://www.thecolorapi.com/id?hex=${hex}`);
        const data = await response.json();
        return data.name.value;
    } catch (err) {
        console.error("Erro ao buscar nome da cor: ", err);
        return "Desconhecido";
    }
}

function getTextColor(hex) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5 ? 'black' : 'white';
}

captureBtn.addEventListener('click', captureAndProcess);

window.addEventListener('load', () => {
    initCamera();

    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js')
            .then(reg => console.log('Service Worker registado com sucesso.', reg))
            .catch(err => console.error('Erro ao registar Service Worker.', err));
    }
});