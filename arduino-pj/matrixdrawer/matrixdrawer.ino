#include "FastLED.h"

#define SERIAL_BAUDRATE 57600
#define SERIAL_TIMEOUT 5
#define NUM_LEDS 36 /* 6x6 matrix */
#define DATA_PIN 2

CRGB leds[NUM_LEDS];

int thex = 0;
int they = 0;
int thePixel = 0;
int thisRED = 0;
int thisGRN = 0;
int thisBLU = 0;
int j = 0;
int i = 0;
int brightness = 190;

void one_color_all(int cred, int cgrn, int cblu) {       //-SET ALL LEDS TO ONE COLOR
    for(int i = 0 ; i < NUM_LEDS; i++ ) {
      leds[i].setRGB( cred, cgrn, cblu);
    }
}

void setup() {
  Serial.begin(SERIAL_BAUDRATE);      // SETUP HARDWARE SERIAL (USB)
  Serial.setTimeout(SERIAL_TIMEOUT);

  delay(2000);
  // For safety (to prevent too high of a power draw), the test case defaults to
  // setting brightness to 25% brightness
  //randomSeed(analogRead(0));

  FastLED.addLeds<NEOPIXEL, DATA_PIN, GRB>(leds, NUM_LEDS); 
  //LEDS.addLeds<SM16716>(leds, LED_COUNT);
  //LEDS.addLeds<UCS1903, 13>(leds, LED_COUNT);
  //LEDS.addLeds<LPD8806, 10, 11 BGR>(leds, LED_COUNT);
  //LEDS.addLeds<TM1809, 13>(leds, LED_COUNT);
  //LEDS.addLeds<WS2801, LED_CK, LED_DT, RBG, DATA_RATE_MHZ(1)>(leds, LED_COUNT);

  LEDS.setBrightness(brightness);

  one_color_all(0,0,0); //-CLEAR STRIP
  LEDS.show();
  Serial.println("---SETUP COMPLETE---");
}


void serialEvent() {
  while (Serial.available()) {
      thex = Serial.parseInt();
      they = Serial.parseInt();
      thisRED = Serial.parseInt();
      thisGRN = Serial.parseInt();
      thisBLU = Serial.parseInt();

      thePixel = ((they)*6)+thex;
      leds[thePixel].setRGB(thisRED, thisGRN, thisBLU);
      LEDS.show();
  }
}


void loop() {
  
}