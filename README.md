# IoT Consumption Monitoring Simulation

A simple IoT project that simulates water and electricity monitoring using:
- **ESP32 (Arduino/C++)**
- **Node.js + Express backend**
- **HTML/CSS/JavaScript frontend**

Values are simulated (random), not read from real sensors.

---

## What the project does

- ESP32 generates simulated consumption values
- ESP32 sends data to backend with HTTP POST over WiFi
- Backend stores latest values
- Frontend shows values only after clicking **Get Consommation**
- Tests validate backend logic and full-system behavior

---

## Architecture

```text
ESP32
  ↓
Node.js Backend
  ↓
Frontend Interface
```

---

## Technologies

- ESP32 / Arduino C++
- WiFi + HTTP requests
- Node.js + Express.js
- HTML/CSS/JavaScript + Fetch API
- Jest (unit tests)
- Selenium WebDriver + Microsoft Edge (system tests)

---

## Backend structure (simple)

- `controller/getConsommation(type)`  
  Receives request and returns consumption result.

- `service/GereConsommation` + `calculerConsommation(type)`  
  Business logic layer.

- `ICapteur`  
  Sensor interface.

- `CapteurEau`, `CapteurElectricite`  
  Sensor simulation classes.

- `TypeCapteur`  
  Enum for sensor types (`eau`, `electricite`).

---

## Frontend behavior

- Inputs:
  - Water consumption
  - Electricity consumption
- Button:
  - **Get Consommation**

Flow:
1. Before click: empty fields
2. On click: `Loading...`
3. After response: displays latest values from backend

---

## ESP32 behavior

- Connects to WiFi
- Simulates water/electricity values
- Sends JSON payload periodically via HTTP POST
- Runs a small web server endpoint for debug

Example JSON:

```json
{
  "eau": 120,
  "electricite": 450
}
```

---

## API routes

### `GET /consommation/latest`
Returns latest ESP32 values.

Example response:

```json
{
  "eau": 124,
  "electricite": 447
}
```

### `GET /consommation/:type`
Returns one value (`eau` or `electricite`).

Example response:

```json
{
  "type": "eau",
  "consommation": 124
}
```

### `POST /esp32/data` *(or current implementation: `POST /data`)*
Receives ESP32 JSON data.

Example request:

```json
{
  "eau": 120,
  "electricite": 450
}
```

---

## Testing

### 1) Backend unit tests (Jest)
Validates business logic:
- valid water/electricity values
- null data
- empty object
- invalid sensor type

Why important: reliability, robustness, safe edge-case handling.

Run:

```bash
cd backend
npm test
```

### 2) ESP32 unit test (embedded logic)

Tested function:

```cpp
calculerConsommationTest(debut, fin)
```

Scenarios:
- `(10, 20)` => `10`
- `(50, 80)` => `30`
- `(30, 10)` => `0`
- `(20, 20)` => `0`
- `(0, 15)` => `15`

These tests check only embedded calculation logic (not WiFi, HTTP, backend, frontend, or real sensors).

**Conclusion:**  
“The ESP32 unit tests ensure that the consumption calculation algorithm behaves correctly under normal, boundary, and invalid conditions before integrating with the backend system.”

### 3) Selenium system test

Selenium (Edge) does:
- open frontend page
- click button
- wait for values
- verify displayed data

Validates frontend/backend communication + user interaction + full integration.

Run:

```bash
node selenium-test/testSystem.js
```

---

## Installation (quick)

### Backend

```bash
cd backend
npm install
npm start
```

### Frontend

Open `frontend/index.html` directly, or serve it:

```bash
cd frontend
npx http-server -p 5400
```

### ESP32

1. Open `smart_consumption_monitor.ino/smart_consumption_monitor.ino.ino` in Arduino IDE
2. Set WiFi + backend URL
3. Select ESP32 board
4. Upload code

---

## Project structure

```text
project/
├── backend/
├── frontend/
├── selenium-test/
├── smart_consumption_monitor.ino/
└── README.md
```

---

## Future improvements

- Real sensors
- MQTT communication
- Database storage
- Authentication
- Live dashboard/charts
- Cloud deployment

---

## Final note

This project is a clean introduction to IoT system design: embedded simulation, backend API, frontend interaction, and testing from unit level to end-to-end.

