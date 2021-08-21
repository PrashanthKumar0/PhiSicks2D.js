let engine, canvas, ctx;

function main() {

    canvas = $('#cnvs');
    ctx = canvas.getContext('2d');
    canvas.width = 800;
    canvas.height = 450;
    engine = new Engine(canvas.width, canvas.height, ctx); //TODO REMOVE CTX AFTER COMPLETING ENGINE
    debug("loaded");


    initBoundaryScene();

    animate();
}






// const G=0.1;
const G = 0.1;
const MASS_WORLD = 0.7;
const WORLD_RADIUS = 1;
// F=ma=GMm/r2
// a=GM/r2
const GRAVITY = new Vec2(0, G * MASS_WORLD / Math.pow(WORLD_RADIUS, 2));

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    //! PLUGIN
    engine.drawAll(ctx);
    if (!engine.paused) {

        //apply gravity
        for (let i = 4; i < E_RIGID_BODY_COLLECTION.length; i++) {


            E_RIGID_BODY_COLLECTION[i].accelerate(GRAVITY);
            // if(E_RIGID_BODY_COLLECTION[i].center.x<=0){
            //     E_RIGID_BODY_COLLECTION[i].velocity.x=0;
            //     E_RIGID_BODY_COLLECTION[i].move(new Vec2(-E_RIGID_BODY_COLLECTION[i].center.x,0));
            // }
            // if(E_RIGID_BODY_COLLECTION[i].center.x>=canvas.width){
            //     E_RIGID_BODY_COLLECTION[i].velocity.x=0;
            //     E_RIGID_BODY_COLLECTION[i].move(new Vec2(canvas.width-E_RIGID_BODY_COLLECTION[i].center.x,0));
            // }

            // if(E_RIGID_BODY_COLLECTION[i].center.y>=canvas.height){
            //     E_RIGID_BODY_COLLECTION[i].velocity.y=0;
            //     E_RIGID_BODY_COLLECTION[i].move(new Vec2(0,canvas.height-E_RIGID_BODY_COLLECTION[i].center.y));
            // }else{
            //     E_RIGID_BODY_COLLECTION[i].accelerate(GRAVITY);
            // }
        }
        engine.update();
    }
    requestAnimationFrame(animate);
}



function initBoundaryScene() {
    let groundDepth = 100;
    var width = canvas.width;
    var height = canvas.height;
    let r1 = new Rectangle(new Vec2(width / 2, 0), width, 6, true);
    let r2 = new Rectangle(new Vec2(width / 2, height + groundDepth / 2 - 6), width, groundDepth, true);
    let r3 = new Rectangle(new Vec2(0, height / 2), 6, height, true);
    let r4 = new Rectangle(new Vec2(width, height / 2), 6, height, true);
    let r5 = new Rectangle(new Vec2(100, canvas.height - 10), 10, 10, true);
    r1.setMass(Infinity);
    r2.setMass(Infinity);
    r3.setMass(Infinity);
    r4.setMass(Infinity);
    r5.setMass(Infinity)

    //just for test
    // r5 = new Rectangle(new Vec2(width / 2, height / 2), 10, 10);
    r5 = new Rectangle(new Vec2(width / 2, height / 2), 60, 60);
}







onload = main;


// ! UTILS
function $(el) {
    return document.querySelector(el);
}

function rand(min = -1, max = 1) {
    return Number((Math.random() * (max - min) + min).toFixed(4));
}

function debug(msg) {
    $('#LOG').innerHTML = msg;
}
