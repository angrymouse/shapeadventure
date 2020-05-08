function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
let textures = {}
let recordImg
let tf=[]
let app = new PIXI.Application({
    width: window.innerWidth,
    height: window.innerHeight
});

document.body.appendChild(app.view);
app.renderer.view.style.position = "absolute";
app.renderer.view.style.display = "block";

app.renderer.backgroundColor = 0x557aa4
startGame()
function startGame() {
    let menu = new PIXI.Container();
    app.stage.addChild(menu);
    menu.height=window.innerHeight
    menu.width=window.innerWidth
    // menu.pivot.x = menu.width / 2;
    // menu.pivot.y = menu.height / 2;
    // menu.x = app.screen.width / 2;
    // menu.y = app.screen.height / 2;

    if (!window.localStorage.getItem("skin")) {
        window.localStorage.setItem("skin", 0)
    }

    window.skins = [PIXI.Texture.from("img/skins/playerBlue.png"),
        PIXI.Texture.from("img/skins/playerRed.png"),
        PIXI.Texture.from("img/skins/playerwhiteblack.png")]
    let playBtn = new PIXI.Sprite(PIXI.Texture.from("img/play.png"))
    playBtn.anchor.set(0.5, 0.5)
    playBtn.height = 200;
    playBtn.width = 300;
    playBtn.x = window.innerWidth / 2;
    playBtn.y = window.innerHeight
    playBtn.interactive = true;
    playBtn.buttonMode = true;
    playBtn.on("pointerdown", () => {

        app.stage.removeChild(menu)
        delete menu;
        for (var i = app.stage.children.length - 1; i >= 0; i--) {	app.stage.removeChild(app.stage.children[i]);};
        tf.forEach(tfun=>{
            app.ticker.remove(tfun)
        })
        launchGame()

    })
    menu.addChild(playBtn)
    let record = window.localStorage.getItem("recordPoints") || 0
    recordImg = new PIXI.Text("Your record: " + record);
    recordImg.anchor.set(0.5, 0.5)
    recordImg.x = window.innerWidth / 2;
    recordImg.y = window.innerHeight - playBtn.height / 1.5
    menu.addChild(recordImg)
    let logo = new PIXI.Sprite(PIXI.Texture.from("img/game-logo.png"))
    logo.anchor.set(0.5, 0.5)
    logo.width = 300;
    logo.height = 150;
    logo.x = window.innerWidth / 2
    logo.y = logo.height / 2
    menu.addChild(logo)
    let skinSelector = new PIXI.Sprite(skins[window.localStorage.getItem("skin")])
    skinSelector.anchor.set(0.5, 0.5)
    skinSelector.height = 64;
    skinSelector.width = 64;
    skinSelector.x = window.innerWidth / 2;
    skinSelector.y = logo.height+(skinSelector.height/2)
    skinSelector.interactive = true;
    skinSelector.buttonMode = true;
    skinSelector.on("pointerdown", () => {
        if (window.localStorage.getItem("skin") == skins.length - 1) {
            window.localStorage.setItem("skin", 0)
        } else {
            window.localStorage.setItem("skin", Number(window.localStorage.getItem("skin")) + 1)
        }
        skinSelector.texture=skins[Number(window.localStorage.getItem("skin"))]
    })
    menu.addChild(skinSelector)
}
startGame()

function launchGame() {
    let points = 0
    let pointsImg = new PIXI.Text("0");
    pointsImg.position.set(10, 10);

    document.body.style.backgroundColor = "#36393F"

    let lose = false

    function movePlayer(player) {


        let btnLeft = new PIXI.Sprite(textures["btnLeft"])
        btnLeft.width = 125;
        btnLeft.height = 125;
        btnLeft.anchor.set(0.5, 0.5);
        btnLeft.x = 62.5;
        btnLeft.interactive = true;
        btnLeft.buttonMode = true;
        btnLeft.y = window.innerHeight - 62.5
        app.stage.addChild(btnLeft)
        let btnRight = new PIXI.Sprite(textures["btnRight"])
        btnRight.width = 125;
        btnRight.height = 125;
        btnRight.interactive = true;
        btnRight.buttonMode = true;
        btnRight.anchor.set(0.5, 0.5);
        btnRight.x = window.innerWidth - 62.5;
        btnRight.y = window.innerHeight - 62.5;
        app.stage.addChild(btnRight)
        function leftMoveF  () {
            if (player.x > 145) {
                player.x -= 6;

            }
            console.log(player.x)
        }
        function rightMoveF () {
            if (player.x < window.innerWidth - 145) {
                player.x += 6;
            }
            console.log(player.x)
        }

        btnLeft.on("pointerdown", () => {
            app.ticker.add(leftMoveF)

            tf.push(leftMoveF)
        })
        btnLeft.on("pointerup", () => {

            app.ticker.remove(leftMoveF)
            tf.splice(tf.findIndex(el=>{return el==leftMoveF}),1)
        })
        btnRight.on("pointerdown", () => {
            tf.push(rightMoveF)
            app.ticker.add(rightMoveF)
        })
        btnRight.on("pointerup", () => {
            tf.splice(tf.findIndex(el=>{return el==rightMoveF}),1)
            app.ticker.remove(rightMoveF)
        })
    }

    function spawnEnemy(enemy, player) {
        let size
        if (lose) {
            return
        }
        if (enemy.clr == "red" || enemy.clr == "rainbow") {
            size = randomInt(64, 128)
        } else {
            if (enemy.clr == "green") {
                size = randomInt(5, 256)
            }
            if (enemy.clr == "blue") {
                size = randomInt(16, 64)
            }
            if (enemy.clr == "orange") {
                size = randomInt(32, 128)
            }
        }
        enemy.width = size
        enemy.height = size
        enemy.y = -size
        if (["green", "rainbow"].includes(enemy.clr)) {
            enemy.x = player.x
        } else {
            enemy.x = randomInt(125, window.innerWidth - 125)
        }
    }

    function moveBalls(balls, app, player) {
        function move() {
            if (lose) {
                return
            }

            balls.forEach(ball => {
                if (lose) {
                    return
                }
                player.y -= 0.001
                if (hitTest(player, ball)) {
                    if (window.localStorage.getItem("recordPoints") < points) {
                        window.localStorage.setItem("recordPoints", points)
                    }
                    lose = true

                    for (var i = app.stage.children.length - 1; i >= 0; i--) {	app.stage.removeChild(app.stage.children[i]);};
                    tf.forEach(tfun=>{
                        app.ticker.remove(tfun)
                    })
                    points = 0;
                    lose = false
                    startGame()
                }
                if (ball.y > app.renderer.height + (ball.height / 2)) {
                    if (ball.clr == "rainbow") {
                        return
                    }
                    spawnEnemy(ball, player)
                } else {

                    if (ball.clr == "rainbow") {
                        if (ball.x > player.x) {
                            ball.x -= 1.2
                        } else {
                            ball.x += 1.2
                        }
                        ball.y += 6
                        ball.rotation += 0.5
                        ball.width += 0.7
                        ball.height += 0.7
                    } else {
                        if (ball.clr == "red") {
                            ball.y += 5
                        } else {
                            if (ball.clr == "blue") {

                                if (ball.x > player.x) {
                                    ball.x -= 0.5
                                    ball.rotation -= 0.3
                                } else {
                                    ball.x += 0.5
                                    ball.rotation += 0.3
                                }
                            }
                            if (ball.clr == "orange") {

                                ball.width += 0.3
                                ball.height += 0.3
                            }

                            ball.y += 2
                        }
                    }
                }
            })
        }
        app.ticker.add(move);
        tf.push(move)
    }
    hitTest = (circle1, circle2) => {
        circle1.radius = (circle1.height / 2) - ((circle1.height / 2) - (circle1.width / 2))
        circle2.radius = (circle2.height / 2) - ((circle2.height / 2) - (circle2.width / 2))
        var dx = circle1.x - circle2.x;
        var dy = circle1.y - circle2.y;
        var distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < circle1.radius + circle2.radius) {
            return true
        } else {
            return false
        }
    }

    let player
    let balls = []

    textures = {

        "blueBall": PIXI.Texture.from("img/blueBall.png"),
        "redBall": PIXI.Texture.from("img/redBall.png"),
        "greenBall": PIXI.Texture.from("img/greenBall.png"),
        "rainbowBall": PIXI.Texture.from("img/rainbowBall.png"),
        "btnRight": PIXI.Texture.from("img/btnRight.png"),
        "btnLeft": PIXI.Texture.from("img/btnLeft.png"),
        "orangeBall": PIXI.Texture.from("img/orangeBall.png")
    }

    app.stage.addChild(pointsImg);
    player = new PIXI.Sprite(skins[Number(window.localStorage.getItem("skin"))]);
    player.width = 32
    player.height = 32
    player.anchor.set(0.5, 0.5)
    player.y = app.renderer.height - 32
    player.x = app.renderer.width / 2
    app.stage.addChild(player)
    blueBall = new PIXI.Sprite(textures["blueBall"]);
    blueBall.anchor.set(0.5, 0.5)
    blueBall.width = 1
    blueBall.height = 1
    app.stage.addChild(blueBall)

    redBall = new PIXI.Sprite(textures["redBall"]);
    redBall.anchor.set(0.5, 0.5)
    redBall.width = 1
    redBall.height = 1
    app.stage.addChild(redBall)
    redBall2 = new PIXI.Sprite(textures["redBall"]);
    redBall2.anchor.set(0.5, 0.5)
    redBall2.width = 1
    redBall2.height = 1
    app.stage.addChild(redBall2)
    greenBall = new PIXI.Sprite(textures["greenBall"]);
    greenBall.anchor.set(0.5, 0.5)
    greenBall.width = 1
    greenBall.height = 1
    app.stage.addChild(greenBall)
    orangeBall = new PIXI.Sprite(textures["orangeBall"]);
    orangeBall.anchor.set(0.5, 0.5)
    orangeBall.width = 1
    orangeBall.height = 1
    app.stage.addChild(orangeBall)
    rainbowBall = new PIXI.Sprite(textures["rainbowBall"]);
    rainbowBall.anchor.set(0.5, 0.5)
    rainbowBall.width = 1
    rainbowBall.height = 1
    app.stage.addChild(rainbowBall)
    blueBall.clr = "blue"
    greenBall.clr = "green"
    redBall.clr = "red"
    orangeBall.clr = "orange"
    rainbowBall.clr = "rainbow"
    redBall2.clr = "blue"
    movePlayer(player)
    balls.push(rainbowBall)
    balls.push(blueBall)
    balls.push(greenBall)
    balls.push(redBall)
    balls.push(redBall2)
    balls.push(orangeBall)
    moveBalls(balls, app, player)


    spawnEnemy(blueBall)
    spawnEnemy(redBall)
    spawnEnemy(redBall2)
    spawnEnemy(orangeBall)
    spawnEnemy(greenBall, player)
    function pointerTick()  {

        if (lose) {

            return
        }
        player.rotation += 0.3;
        points++;
        app.stage.removeChild(pointsImg)
        pointsImg = new PIXI.Text(String(points));
        pointsImg.position.set(10, 10);
        app.stage.addChild(pointsImg)
        if ([900, 1900, 2900, 3900, 4900, 5900, 6900, 7900, 8900, 9900, 10000, 10150, 10300].includes(points)) {
            spawnEnemy(rainbowBall, player)
        }
    }
    app.ticker.add(pointerTick)
    tf.push(pointerTick)


}
