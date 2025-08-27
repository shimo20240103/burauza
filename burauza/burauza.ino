#include <M5StickCPlus.h>
#include "BLESerial.h"

// TX/RXピンは未使用でもダミー（例: 0, 26）
BLESerial bleSerial(0, 26);

float accX = 0.0f;
float accY = 0.0f;
float accZ = 0.0f;
float x = 120.0f;
float v = 0.0f;

void setup() {
  M5.begin();
  M5.IMU.Init();
  M5.Lcd.setRotation(1);

  M5.Lcd.println("Bluetooth init..."); // 初期化開始のメッセージ
  bleSerial.begin();
  M5.Lcd.println("Bluetooth started!"); // 初期化完了のメッセージ
}

void loop() {
  M5.update();
  M5.IMU.getAccelData(&accX, &accY, &accZ);

  v += accY;
  x += v;
  if (x >= 230.0) { v = 0.0; x = 230.0; }
  if (x <= 10.0)  { v = 0.0; x = 10.0; }

  M5.Lcd.fillScreen(BLACK);
  M5.Lcd.fillCircle((int)x, 68, 10, YELLOW);

  String data = String(accX, 3) + "," + String(accY, 3) + "," + String(accZ, 3) + "\n";

  // M5StackのLCDにも送信データの一部を表示
  M5.Lcd.setCursor(0, 0); // カーソルをリセットして上書き
  M5.Lcd.print("AccY: ");
  M5.Lcd.println(accY, 3);


  const char* cstr = data.c_str();
  while (*cstr) {
    bleSerial.write(*cstr++);
  }

  delay(20);
}