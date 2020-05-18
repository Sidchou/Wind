var obj = []
var g
var wk
var fk
let windTravel = 0
let windRange = -1200
let windGo = false

let windArray = new Array(9);
let windDirArray = new Array(9);
let dataStepper = 0;

let serial
function preload(){
  data = loadJSON('datas.json');
}
function setup() {
//serial comm
serial = new p5.SerialPort(); // make a new instance of  serialport librar
serial.on('list', printList); // callback function for serialport list event
serial.on('data', serialEvent); // callback for new data coming in
serial.list(); // list the serial ports
serial.open("/dev/tty.usbmodem14601"); // open a port
//

  createCanvas(800, 800);
  noStroke();
  for (j = 20; j < height; j += 20) {
    for (i = 20; i < width; i += 20) {
      obj.push(new OBJ(i, j))
    }
    for (var i = 0; i < windArray.length; i++) {
      windArray[i] = new Array();
    }
  }      //stroke(noise(i/10+t/20,j/10 )*255)

  // o = new OBJ(200, 200)

  g = 1
  wk = 10000
  fk = 5000;
}
function draw() {

  background(50);
    for (o of obj) {
  let gravity = o.r * o.m * g * sin(HALF_PI - o.th)

  o.applyTorque(gravity);
  // if ((2*PI+o.th)%(2*PI)>PI){
  //   gravity = 10000
  //   o.applyTorque(gravity);
  //  console.log("gravity")
  // }

  windblow(o);


  let friction = o.w * -fk* (noise(o.o.x/10,o.o.y/10)*.5+.5);
  o.applyTorque(friction);
  o.update();
  o.render();
  // console.log(o.th)
}
// if (mouseIsPressed == true){
//   windRange+=10
//   windTravel = 0
//   }else{
// windTravel+=10
// }

//graphics
textSize(32);
fill(10, 152, 243);
try {
  data[dataStepper].recorded_at
} catch (error) {
  //console.log(error);
dataStepper=0;
for (var i = 0; i < windArray.length; i++) {
  windArray[i] = new Array();
}
}

let date =  new Date(data[dataStepper].recorded_at)
clock = date.toLocaleTimeString()//.slice(0,-3)
day = date.toLocaleDateString()
text(day, 10, 30);
text(clock, 10, 60);
if (frameCount%120==0){
//console.log(data[dataStepper].wind_dir)
addwind(data[dataStepper].wind_dir)

let sendData = data[dataStepper].windspeedmph;
serial.write(sendData);   // sends as byte unles its a string
console.log(sendData);


dataStepper++;

}
}
function windDirLogic(o,w){
  // |315| 0 | 45|
  // |270|   | 90|
  // |225|180|135|
  let windSpeed = 10
  let windRange =100
windDirArray[0] =(frameCount-w)*windSpeed>o.o.x+o.o.y&&(frameCount-w-windRange)*windSpeed<o.o.x+o.o.y;
windDirArray[1] =(frameCount-w)*windSpeed>o.o.y&&(frameCount-w-windRange)*windSpeed<o.o.y;
windDirArray[2] =(frameCount-w)*windSpeed>o.o.y-o.o.x+width&&(frameCount-w-windRange)*windSpeed<o.o.y-o.o.x+width;
windDirArray[3] =(frameCount-w)*windSpeed>width-o.o.x&&(frameCount-w-windRange)*windSpeed<width-o.o.x;
windDirArray[4] =(frameCount-w)*windSpeed>width+height-o.o.x-o.o.y&&(frameCount-w-windRange)*windSpeed<width+height-o.o.x-o.o.y;
windDirArray[5] =(frameCount-w)*windSpeed>height-o.o.y&&(frameCount-w-windRange)*windSpeed<height-o.o.y;

windDirArray[6] =(frameCount-w)*windSpeed>o.o.x-o.o.y+height&&(frameCount-w-windRange)*windSpeed<o.o.x-o.o.y+height;
windDirArray[7] =(frameCount-w)*windSpeed>o.o.x&&(frameCount-w-windRange)*windSpeed<o.o.x;


}

function addwind(dir){
// |315| 0 | 45|
// |270|   | 90|
// |225|180|135|

let i = floor(dir/45+1)%8
windArray[i].push(frameCount)

}
function windblow(o){
  let wind = 0;

  //top left
  for (var i = 0; i < windArray.length; i++) {
    for (var j = 0; j < windArray[i].length; j++) {

      windDirLogic(o,windArray[i][j]);

    if(windDirArray[i]){
      let fade = 1/((frameCount - windArray[i][j])/10);
      //fade*=fade;
      wind = sin(o.th)*-wk*(noise((o.o.x+windTravel)/20,(o.o.y+windTravel)/20)*.5+.5)*fade;

    }

  }
}


// console.log(wind)


o.applyTorque(wind);
delWind();
}

function delWind (){
  for (var i = 0; i < windArray.length; i++) {
    for (var j = 0; j < windArray[i].length; j++) {
      if (frameCount-windArray[0][0]>1200){
      windArray[i].slice(1);

      }
    }
  }
if (frameCount-windArray[0][0]>1200){
windArray[0].slice(1);

}
}


function printList(portList) {
  for (var i = 0; i < portList.length; i++) {
    // Display the list the console:
    print(i + " " + portList[i]);
  }
}
function serialEvent() {
  // this is called when data is recieved
}

// function mousePressed(){
// addwind(0)
//   // windRange = frameCount
// }
class OBJ {
  constructor(x, y) {
    this.o = createVector(x, y);
    this.th = HALF_PI
    this.r = 100
    this.w = 0
    this.a = 0
    this.m = 100
  }
  applyTorque(t) {
    // console.log(t)
    //t = rfsinth
    //l = iw
    //i = 0.5rm^2
    //t = ia
    let a = t/(0.5 * this.r * this.m * this.m)
    this.a += a
  }
  update() {
    this.w += this.a
    this.th += this.w
    this.a = 0
    this.th += 2*PI
    this.th %= 2*PI
  }
  render() {
    // let l = p5.Vector.fromAngle(this.th, this.r);
    // l.add(this.o);
    // line(this.o.x, this.o.y, l.x, l.y);
    let c = abs(cos(this.th));
    fill(150, c*150)
    ellipse(this.o.x, this.o.y, 10);
  }
}
