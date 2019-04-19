var obj = []
var g
var k
let windTravel = 0
let windRange = 0
let windGo = false
function setup() {
  createCanvas(800, 800);
  noStroke();
  for (j = 20; j < height; j += 20) {
    for (i = 20; i < width; i += 20) {
      obj.push(new OBJ(i, j))
    }
  }      //stroke(noise(i/10+t/20,j/10 )*255)

  // o = new OBJ(200, 200)


  g = 0.5
  k = 1000
}
function draw() {
  background(50);
    for (o of obj) {
  let gravity = o.r * o.m * g * sin(HALF_PI - o.th)
  o.applyTorque(gravity);

  if (windRange+windTravel>o.o.x+o.o.y&&windTravel<o.o.x+o.o.y)  {
    // let wind = (o.r * Math.abs(sin(o.th) )  * sin(-o.th)+ (noise(o.o.x/20+windTravel/20,o.o.y/20 )*30))*100
    let wind = (o.r * Math.abs(sin(o.th) )  * sin(-o.th))*100* (1+noise(o.o.x/20+windTravel/20,o.o.y/20 ))
    // let wind = o.r * sin(o.th) * 100 * sin(-o.th)
// console.log(wind)
  o.applyTorque(wind);
}
  let friction = o.w * -k
  o.applyTorque(friction);
  o.update();
  o.render();
  // console.log(o.th)
}
// windTravel+=10
if (mouseIsPressed == true){
  windRange+=10
  windTravel = 0
  }else{
windTravel+=10
}
}


function mousePressed(){
  windRange = 0
}
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
  }
  render() {
    // let l = p5.Vector.fromAngle(this.th, this.r);
    // l.add(this.o);
    // line(this.o.x, this.o.y, l.x, l.y);
    fill(150, 160 - this.th*100)
    ellipse(this.o.x, this.o.y, 10);
  }
}
