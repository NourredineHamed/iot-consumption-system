#include <WiFi.h>
#include <HTTPClient.h>

// Configurer l'URL du backend (modifier si besoin)
#define BACKEND_URL "http://host.docker.internal:3000/data"

void setup() {
  Serial.begin(115200);
  WiFi.begin("Wokwi-GUEST", "");

  Serial.print("Connexion WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(200);
    Serial.print('.');
  }
  Serial.println("\nWiFi connecté");
}

void loop() {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin(BACKEND_URL);
    http.addHeader("Content-Type", "application/json");

    // Lire valeurs brutes (simulation)
    int rawEau = random(100, 141); // 100..140
    int rawElectricite = random(380, 521); // 380..520

    // Calculer la consommation sur la station (ESP32)
    int eau = calculerConsommation("eau", rawEau);
    int electricite = calculerConsommation("electricite", rawElectricite);

    // Construire le JSON simulé avec les valeurs calculées
    String json = "{";
    json += "\"eau\":" + String(eau) + ",";
    json += "\"electricite\":" + String(electricite);
    json += "}";

    int code = http.POST(json);
    String resp = http.getString();
    Serial.println("POST " + String(code) + ": " + resp);
    http.end();
  } else {
    Serial.println("WiFi non connecté");
  }

  delay(5000);
}

// Fonction de calcul de la consommation — exécutée sur la station (ESP32)
int calculerConsommation(const String &type, int rawValue) {
  
  if (type == "eau") {
    return max(0, rawValue);
  }
  if (type == "electricite") {
    return max(0, rawValue);
  }
  return 0;
}
