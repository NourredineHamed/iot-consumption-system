// Simulateur simple d'ESP32 en Node.js — envoie périodiquement POST JSON au backend
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3000/data';

async function sendData() {
  try {
    const eau = Math.floor(Math.random() * (140 - 100 + 1)) + 100;
    const electricite = Math.floor(Math.random() * (520 - 380 + 1)) + 380;

    const body = { eau, electricite };

    const res = await fetch(BACKEND_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    const text = await res.text();
    console.log('POST', res.status, text, body);
  } catch (err) {
    console.error('Erreur en envoyant les données:', err.message);
  }
}

setInterval(sendData, 5000);
sendData();
