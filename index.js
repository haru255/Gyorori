const app = new PIXI.Application({
    width: window.innerWidth,
    height: window.innerHeight,
    backgroundColor: 0x000000,
});

let el = document.getElementById('app');
el.appendChild(app.view);
app.renderer.autoDensity = true;

window.addEventListener("resize", function () {
    app.renderer.resize(window.innerWidth, window.innerHeight);
});


var Eye = class extends PIXI.Container {
    constructor(whiteSize, blackSize) {
        super();
        this.whiteSize = whiteSize;
        this.blackSize = blackSize;
        this.back = new PIXI.Graphics()
        .beginFill(0xffffff)
        .drawCircle(0,0,whiteSize+1)
        .endFill();
        this.back.tint = 0x000000;
        this.whiteEye = new PIXI.Graphics()
        .beginFill(0xffffff)
        .drawCircle(0,0,whiteSize)
        .endFill();
        this.blackEye = new PIXI.Graphics()
        .beginFill(0xffffff)
        .drawCircle(0,0,blackSize)
        .endFill();
        this.blackEye.tint = 0x000000;
        this.addChild(this.back);
        this.addChild(this.whiteEye);
        this.addChild(this.blackEye);
    }
    moveBlackEye(e) {
        let pos = e.data.getLocalPosition(app.stage);
        pos.x -= this.parent.x;
        pos.y -= this.parent.y;
        let cx = 0;
        let cy = 0;
        let s = this.parent.whiteSize-this.parent.blackSize;

        if (distance(pos.x,pos.y, cx,cy) > s) {
            let theta = Math.atan2(pos.y - cy, pos.x - cx);
            let x = s*Math.cos(theta);
            let y = s*Math.sin(theta);
            this.parent.blackEye.x = x;
            this.parent.blackEye.y = y;
        } else {
            this.parent.blackEye.x = pos.x;
            this.parent.blackEye.y = pos.y;
        }
    }
}

function randInt(min,max) {
    return Math.floor(Math.random() * (max-min)) + min;
}
function distance(x1,y1,x2,y2) {
    return Math.sqrt(Math.pow(Math.abs(x1-x2),2)+Math.pow(Math.abs(y1-y2),2))
}
function createEye(x, y, whiteSize, blackSize) {
    let eye = new Eye(whiteSize, blackSize);
    eye.x = app.screen.width / 2;
    eye.y = app.screen.height / 2;
    eye.blackEye.interactive = true;
    eye.blackEye.on('pointermove', eye.moveBlackEye)
    eye.x = x;
    eye.y = y;
    return eye;
}

function addEye(e) {
    let whiteSize = randInt(16,64);
    let blackSize = randInt(12, whiteSize); 
    eyes.push(createEye(e.offsetX, e.offsetY, whiteSize, blackSize));
    app.stage.addChild(eyes[eyes.length-1]);
}


let eyes = []
let cx = app.screen.width/2;
let cy = app.screen.height/2;
eyes.push(createEye(cx,cy,40,20));
app.stage.addChild(eyes[0]);
window.addEventListener("click", addEye)
