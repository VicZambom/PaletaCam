if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js')
            .then(registration => {
                console.log('Service Worker registrado com sucesso:', registration);
            })
            .catch(error => {
                console.log('Falha ao registrar o Service Worker:', error);
            });
    });
}

const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const captureBtn = document.getElementById('capture-btn');
const paletteContainer = document.getElementById('palette-container');
const loader = document.getElementById('loader');
const context = canvas.getContext('2d', { willReadFrequently: true });

async function setupCamera() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: {
                facingMode: 'environment'
            }
        });
        video.srcObject = stream;
        video.addEventListener('loadedmetadata', () => {
            loader.style.display = 'none';
            video.play();
        });
    } catch (err) {
        console.error("Erro ao acessar a câmera: ", err);
        alert("Não foi possível acessar a câmera. Verifique as permissões.");
        loader.style.display = 'none';
    }
}

function getDominantColors(imageData, colorCount = 5) {
    const pixels = imageData.data;
    const colorMap = {};
    const step = 4 * 5;

    for (let i = 0; i < pixels.length; i += step) {
        const r = pixels[i];
        const g = pixels[i + 1];
        const b = pixels[i + 2];
        const key = `${r},${g},${b}`;
        colorMap[key] = (colorMap[key] || 0) + 1;
    }

    const sortedColors = Object.keys(colorMap).sort((a, b) => colorMap[b] - colorMap[a]);
    return sortedColors.slice(0, colorCount).map(colorStr => {
        const [r, g, b] = colorStr.split(',').map(Number);
        const hex = ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
        return `#${hex}`;
    });
}

async function fetchColorName(hex) {
    try {
        const response = await fetch(`https://www.thecolorapi.com/id?hex=${hex.substring(1)}`);
        const data = await response.json();
        return data.name.value;
    } catch (error) {
        console.error("Erro ao buscar nome da cor:", error);
        return hex;
    }
}

function getContrastColor(hexcolor) {
    hexcolor = hexcolor.replace("#", "");
    const r = parseInt(hexcolor.substr(0, 2), 16);
    const g = parseInt(hexcolor.substr(2, 2), 16);
    const b = parseInt(hexcolor.substr(4, 2), 16);
    const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    return (yiq >= 128) ? 'black' : 'white';
}


captureBtn.addEventListener('click', async () => {
    paletteContainer.innerHTML = '';
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const colors = getDominantColors(imageData);

    for (const color of colors) {
        const colorDiv = document.createElement('div');
        colorDiv.style.backgroundColor = color;
        colorDiv.className = 'w-full h-full rounded-lg flex flex-col items-center justify-center text-xs p-1 text-center';
        
        const colorName = await fetchColorName(color);
        const textColor = getContrastColor(color);

        colorDiv.innerHTML = `
            <span style="color: ${textColor};">${colorName}</span>
            <span style="color: ${textColor}; opacity: 0.7;">${color.toUpperCase()}</span>
        `;
        paletteContainer.appendChild(colorDiv);
    }
});

setupCamera();