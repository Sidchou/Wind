void setup() {
  Serial.begin(9600);
    pinMode(6, OUTPUT);

}
void loop() {
  if(Serial.available()){
  byte byteFromSerial = Serial.read();
  int Reading = byteFromSerial;
  Serial.write(Reading);
  if(Reading>=3){
  analogWrite(6, 255);
  } else if(Reading>=2){
  analogWrite(6, 180);
  } else if(Reading>=1){
  analogWrite(6, 80);
  }else{
  analogWrite(6, 0);
  }
  }else{
//    digitalWrite(6,0);
    }


  
}
