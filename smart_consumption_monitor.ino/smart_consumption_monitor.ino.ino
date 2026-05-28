#include <WiFi.h>
#include <WebServer.h>
#include <HTTPClient.h>

//////////////////////////////
// WIFI CONFIG
//////////////////////////////
const char* ssid = "Airbox-0118";
const char* password = "6SL5FsAtWAjh";

//////////////////////////////
// NODE SERVER
//////////////////////////////
const char* nodeServer = "http://192.168.1.64:3000/data";

//////////////////////////////
// INTERFACE
//////////////////////////////
class ICapteur {
  public:
    virtual int compter() = 0;
};

//////////////////////////////
// CAPTEURS
//////////////////////////////
class CapteurEau : public ICapteur {
  private:
    int value = 100;

  public:
    int compter() override {
      value += random(1, 5);
      return value;
    }
};

class CapteurElectricite : public ICapteur {
  private:
    int value = 50;

  public:
    int compter() override {
      value += random(1, 3);
      return value;
    }
};

//////////////////////////////
// SERVICE LAYER
//////////////////////////////
class GereConsommation {
  private:
    ICapteur* capteur;

  public:
    GereConsommation(ICapteur* c) {
      capteur = c;
    }

    int calculerConsommation() {
      return capteur->compter();
    }
};

//////////////////////////////
// WEB SERVER
//////////////////////////////
WebServer server(80);

CapteurEau capteurEau;
CapteurElectricite capteurElec;

GereConsommation serviceEau(&capteurEau);
GereConsommation serviceElec(&capteurElec);

//////////////////////////////
// FUNCTION TO TEST
//////////////////////////////
int calculerConsommationTest(int debut, int fin)
{
  if (debut < 0 || fin < 0) return 0;
  if (fin < debut) return 0;

  return fin - debut;
}

//////////////////////////////
// ASSERT FUNCTION
//////////////////////////////
void assertEqual(int expected, int actual, const char* testName)
{
  Serial.print(testName);
  Serial.print(" => ");

  if (expected == actual)
  {
    Serial.println("PASS");
  }
  else
  {
    Serial.print("FAIL (expected ");
    Serial.print(expected);
    Serial.print(", got ");
    Serial.print(actual);
    Serial.println(")");
  }
}

//////////////////////////////
// RUN TESTS
//////////////////////////////
void runTests()
{
  Serial.println("===== UNIT TESTS START =====");

  assertEqual(10, calculerConsommationTest(10, 20), "Test 1 normal");
  assertEqual(30, calculerConsommationTest(50, 80), "Test 2 normal");
  assertEqual(0, calculerConsommationTest(30, 10), "Test 3 invalid");
  assertEqual(0, calculerConsommationTest(20, 20), "Test 4 equal");
  assertEqual(15, calculerConsommationTest(0, 15), "Test 5 zero start");

  Serial.println("===== UNIT TESTS END =====");
}

//////////////////////////////
// SEND TO NODE
//////////////////////////////
void sendToNode(int water, int electricity) {

  if (WiFi.status() != WL_CONNECTED) return;

  HTTPClient http;

  http.begin(nodeServer);
  http.addHeader("Content-Type", "application/json");

  String json = "{";
  json += "\"eau\":" + String(water) + ",";
  json += "\"electricite\":" + String(electricity);
  json += "}";

  http.POST(json);
  http.end();
}

//////////////////////////////
// DEBUG ENDPOINT
//////////////////////////////
void handleGetConsommation() {

  int water = serviceEau.calculerConsommation();
  int electricity = serviceElec.calculerConsommation();

  String json = "{";
  json += "\"water\":" + String(water) + ",";
  json += "\"electricity\":" + String(electricity);
  json += "}";

  server.send(200, "application/json", json);
}

//////////////////////////////
// SETUP
//////////////////////////////
void setup() {

  Serial.begin(115200);

  WiFi.begin(ssid, password);

  Serial.print("Connecting");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("\nConnected!");

  server.on("/getconsommation", handleGetConsommation);
  server.begin();

  // 🔥 RUN UNIT TESTS HERE
  runTests();
}

//////////////////////////////
// LOOP
//////////////////////////////
void loop() {

  server.handleClient();

  static unsigned long lastTime = 0;

  if (millis() - lastTime > 5000) {

    int water = serviceEau.calculerConsommation();
    int electricity = serviceElec.calculerConsommation();

    Serial.print("Water: ");
    Serial.println(water);

    Serial.print("Electricity: ");
    Serial.println(electricity);

    sendToNode(water, electricity);

    lastTime = millis();
  }
}