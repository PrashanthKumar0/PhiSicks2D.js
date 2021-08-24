let engine, canvas, ctx;

function main() {

    canvas = $('#cnvs');
    ctx = canvas.getContext('2d');
    canvas.width = innerWidth;
    canvas.height = innerHeight;
    engine = new Engine(canvas.width, canvas.height, ctx); //TODO REMOVE CTX AFTER COMPLETING ENGINE
    engine.drawCallback = drawCallback;
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


function drawCallback() {
    engine.drawAll(ctx);    
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    //! PLUGIN
    //apply gravity
    // debug("Previous FPS : "+engine.getFps());
    if (!engine.paused) {

        for (let i = 5; i < E_RIGID_BODY_COLLECTION.length; i++) {
            if(!E_RIGID_BODY_COLLECTION[i].fixed) E_RIGID_BODY_COLLECTION[i].accelerate(GRAVITY);
        }
    }
    engine.update();
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
    let r5 = new Rectangle(new Vec2(100, canvas.height - 20), 40, 20, true);
    r1.setMass(Infinity);
    r2.setMass(Infinity);
    r3.setMass(Infinity);
    r4.setMass(Infinity);
    r5.setMass(Infinity);

    //just for test
    // r5 = new Rectangle(new Vec2(width / 2, height / 2), 10, 10);
    r6 = new Rectangle(new Vec2(width / 2, height / 2), 60, 60);
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
function debugA(msg){
    $('#LOG').innerHTML+="<br>"+msg;
}




function objectDetails() {
    if (E_RIGID_BODY_COLLECTION.length > 0) {
        let ob = E_RIGID_BODY_COLLECTION[CURRENT_BOUND_OBJECT_INDEX];
        let details =
            "<br>" +
            "OBJECT DETAILS</br>" +
            "= = = = = = = = = = = = = =</br>" +
            "TYPE : " + ob.type + "<br>" +
            "INDEX (ID) : " + CURRENT_BOUND_OBJECT_INDEX + "<br>" +
            "RESTITUTION : &lt " + ob.acceleration.x.toFixed(2) + " , " + ob.acceleration.y.toFixed(2) + " &gt; <br>" +
            "COEFFICIENT_OF_FRICTION : &lt " + ob.coeffFriction.toFixed(2) + " &gt; <br>" +
            "MOMENT_OF_INERTIA : &lt " + ob.momentOfInertia.toFixed(2) + " &gt; <br>" +
            "MASS : &lt " + ob.mass.toFixed(2) + "  &gt; <br>" +
            "= = = = = = = = = = = = = =</br>" +
            "KINEMATICS INFO</br>" +
            "= = = = = = = = = = = = = =</br>" +
            "POSITION : &lt " + ob.center.x.toFixed(2) + " , " + ob.center.y.toFixed(2) + " px &gt; <br>" +
            "LINEAR_VELOCITY : &lt " + ob.velocity.x.toFixed(2) + " , " + ob.velocity.y.toFixed(2) + " &gt; <br>" +
            "NET_LINEAR_ACCELERATION : &lt " + ob.acceleration.x.toFixed(2) + " , " + ob.acceleration.y.toFixed(2) + " px/sec<sup>2</sup>&gt; <br>" +
            "ANGLE : " + Number(ob.angle * 180 / Math.PI).toFixed(2) + " deg<br>" +
            "ANGULAR_VELOCITY : " + Number(ob.angularVelocity * 180 / Math.PI).toFixed(2) + " px/sec deg<br>" +
            "NET_ANGULAR_ACCELERATION : " + Number(ob.angularAcceleration * 180 / Math.PI).toFixed(2) + " deg/sec<sup>2</sup><br>" +
            ""
            ;

        return details;
    }
    return "";
}