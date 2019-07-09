function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
document.body.style.backgroundColor="#36393F"
let frameCount = function _fc(timeStart){

        let now = performance.now();
        let duration = now - timeStart;

        if(duration < 1000){

            _fc.counter++;

        } else {

            _fc.fps = _fc.counter;
            _fc.counter = 0;
            timeStart = now;
            console.log(_fc.fps);

        }
        requestAnimationFrame(() => frameCount(timeStart));
    }

frameCount.counter = 0;
frameCount.fps = 0;

frameCount(performance.now())
let lose=false
function movePlayer(player){

  leftMove=null
  rightMove=null
  keyA=keyboard("ArrowLeft");
  keyD=keyboard("ArrowRight")
  keyA.press=()=>{
  leftMove=setInterval(()=>{
    if(player.x<10){return}
    player.x-=6
  },40)
  }
  keyA.release=()=>{
    clearInterval(leftMove)
  }
  keyD.press=()=>{
    rightMove=setInterval(()=>{
     if(player.x>500){return}
      player.x+=6
    },40)
  }
  keyD.release=()=>{
    clearInterval(rightMove)
  }
}
function spawnEnemy(enemy,player) {
let size
  if(lose){return}
  if(enemy.clr=="red"||enemy.clr=="rainbow"){size=randomInt(64,128)}else{
    if(enemy.clr=="green"){
   size=randomInt(5,256)
 }
 if(enemy.clr=="blue"){
   size=randomInt(16,64)
 }
}
  enemy.width=size
  enemy.height=size
  enemy.y=-size
  if(["green","rainbow"].includes(enemy.clr)){enemy.x=player.x}else{
  enemy.x=randomInt(1,512)
}
}
function moveBalls(balls,app,player) {
  setInterval(()=>{
    if(lose){return}
    balls.forEach(ball=>{
      if(lose){return}

      if(hitTest(player,ball)){
        alert("You lose!")
        lose=true
      }
      if(ball.y>app.renderer.height+ball.height){
        if(ball.clr=="rainbow"){return}
        spawnEnemy(ball,player)
      }

      else{

        if(ball.clr=="rainbow"){
          if(ball.x>player.x){ball.x-=1}else{ball.x+=1}
          ball.y+=6
          ball.rotation+=0.5
        }
        else{
        if(ball.clr=="red"){ball.y+=5}else{
        if(ball.clr=="blue"){

          if(ball.x>player.x){
            ball.x-=0.4
            ball.rotation-=0.3
          }
          else{
            ball.x+=0.4
            ball.rotation+=0.3
          }
        }
        ball.y+=2
      }
    }
      }
    })
  },20)
}
hitTest=(circle1,circle2)=>{
  circle1.radius=(circle1.height/2)-((circle1.height/2)-(circle1.width/2))
  circle2.radius=(circle2.height/2)-((circle2.height/2)-(circle2.width/2))
  var dx = circle1.x - circle2.x;
var dy = circle1.y - circle2.y;
var distance = Math.sqrt(dx * dx + dy * dy);

if (distance < circle1.radius + circle2.radius) {
    return true
}else{
  return false
}
}
function keyboard(value) {
  let key = {};
  key.value = value;
  key.isDown = false;
  key.isUp = true;
  key.press = undefined;
  key.release = undefined;
  //The `downHandler`
  key.downHandler = event => {
    if (event.key === key.value) {
      if (key.isUp && key.press) key.press();
      key.isDown = true;
      key.isUp = false;
      event.preventDefault();
    }
  };

  //The `upHandler`
  key.upHandler = event => {
    if (event.key === key.value) {
      if (key.isDown && key.release) key.release();
      key.isDown = false;
      key.isUp = true;
      event.preventDefault();
    }
  };


  const downListener = key.downHandler.bind(key);
  const upListener = key.upHandler.bind(key);

  window.addEventListener(
    "keydown", downListener, false
  );
  window.addEventListener(
    "keyup", upListener, false
  );

  // Detach event listeners
  key.unsubscribe = () => {
    window.removeEventListener("keydown", downListener);
    window.removeEventListener("keyup", upListener);
  };

  return key;
}

let app = new PIXI.Application({width: 512, height: 512});
document.body.appendChild(app.view);
app.renderer.view.style.position = "absolute";
app.renderer.view.style.display = "block";
app.renderer.view.style.left="50%"
app.renderer.view.style.top="50%"
app.renderer.view.style["margin-right"]="-50%"
app.renderer.view.style["transform"]="translate(-50%, -50%)"
app.renderer.backgroundColor=0x557aa4
let player
let balls=[]
PIXI.Loader.shared
.add("player","https://i.imgur.com/daIlRyg.png")
.add("blueBall","https://i.imgur.com/WW6iVdO.png")
.add("redBall","https://i.imgur.com/rEmLOqo.png")
.add("greenBall","https://i.imgur.com/JsNjcmS.png")
.add("rainbowBall","https://i.imgur.com/tot88pd.png")
.load(()=>{
  player = new PIXI.Sprite(PIXI.Loader.shared.resources["player"].texture);
  player.width=32
  player.height=32
  player.anchor.set(0.5, 0.5)
  player.y=app.renderer.height-32
    player.x=app.renderer.width/2
  app.stage.addChild(player)
blueBall=new PIXI.Sprite(PIXI.Loader.shared.resources["blueBall"].texture);
blueBall.anchor.set(0.5, 0.5)
blueBall.width=1
blueBall.height=1
app.stage.addChild(blueBall)

redBall=new PIXI.Sprite(PIXI.Loader.shared.resources["redBall"].texture);
redBall.anchor.set(0.5, 0.5)
redBall.width=1
redBall.height=1
app.stage.addChild(redBall)
greenBall=new PIXI.Sprite(PIXI.Loader.shared.resources["greenBall"].texture);
greenBall.anchor.set(0.5, 0.5)
greenBall.width=1
greenBall.height=1
app.stage.addChild(greenBall)
rainbowBall=new PIXI.Sprite(PIXI.Loader.shared.resources["rainbowBall"].texture);
rainbowBall.anchor.set(0.5, 0.5)
rainbowBall.width=1
rainbowBall.height=1
app.stage.addChild(rainbowBall)
blueBall.clr="blue"
greenBall.clr="green"
redBall.clr="red"
rainbowBall.clr="rainbow"
  movePlayer(player)
balls.push(rainbowBall)
balls.push(blueBall)
balls.push(greenBall)
balls.push(redBall)

  moveBalls(balls,app,player)


    spawnEnemy(blueBall)
    spawnEnemy(redBall)
    spawnEnemy(greenBall,player)
    setInterval(()=>{
      if(lose){return}
      player.rotation+=0.3;
      document.getElementById('points').innerHTML=Number(document.getElementById('points').innerHTML)+1
      if([900,1900,2900,3900,4900,5900,6900,7900,8900,9900,10000,10150,10300].includes(Number(document.getElementById('points').innerHTML))){spawnEnemy(rainbowBall,player)}
    },90)


})
