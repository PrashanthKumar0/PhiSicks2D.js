/**
 * Dependencies : Engine/Math/Vec2.js
 */

const E_RIGID_BODY_COLLECTION = []; // this contains a reference to all the rigid bodies

function RigidShape(centerVec2, isFixed = false, mass = 1, restitution = 0.8, mu = 0.004) {

    //Some kinematic props

    this.boundingRadius = 0;

    //linear
    this.velocity = new Vec2(0, 0);
    this.acceleration = new Vec2(0, 0);
    this.mass = mass || 1;
    this.invMass = 1 / this.mass; //this will hold simply ( 1/mass ) (to optimize things)
    this.center = centerVec2; //?or position

    //angular
    this.angle = 0;
    this.angularVelocity = 0;
    this.angularAcceleration = 0;
    this.momentOfInertia = 0;


    //some other properties
    this.coeffFriction = mu || 0.8; // coefficient of friction (MU)
    // this.coeffFriction = 0.001; // coefficient of friction (MU)
    // this.coeffFriction = 0.8; // coefficient of friction (MU)
    // frictional force = MU * NormalForce 
    // (direction is tangent to NormalForce opposite to velocity)

    this.restitution = restitution || 0.5;   // restitution (e) = -v/u 
    // this.restitution = 0.9;   // restitution (e) = -v/u 
    // this.restitution = 0.6;   // restitution (e) = -v/u 
    // this.restitution = 1.0001;   // restitution (e) = -v/u 
    // v=final velocity ; u=initial velocity 
    // or bounciness so to say

    this.fixed = isFixed;

    // E_RIGID_BODY_COLLECTION.unshift(this);
    E_RIGID_BODY_COLLECTION.push(this);
    // Push Every Object bring created into the collection array
    // every rigid body will be identified by a unique id 
    // (this id is nothing but) index of the body in E_RIGID_BODY_COLLECTION array
}

RigidShape.prototype.setMass = function (mass = 1) {
    this.mass = mass;
    this.invMass = 1 / mass;
    this.calculateMOI();
}



//! VIRTUAL FUNCTIONS
RigidShape.prototype.move = function (displacementVec) { //? Virtual function
    throw "Inheriting object must override move() method";
}
RigidShape.prototype.rotate = function (angularDisplacement) { //? Virtual function
    throw "Inheriting object must override rotate() method";
}
RigidShape.prototype.calculateMOI = function () {
    throw "Inheriting object must override calcuateMOI() method";
}





//! update functions
RigidShape.prototype.update = function (dt = 0.1) {
    if (!this.move) throw "Inheriting object must implement move() function";

    //linear
    this.velocity.add(this.acceleration.scale(dt));
    this.move(this.velocity.copy().scale(dt));
    this.acceleration.scale(0);

    //angular
    this.angularVelocity += this.angularAcceleration * dt;
    this.rotate(this.angularVelocity * dt);
    this.angularAcceleration = 0;
}

RigidShape.prototype.accelerate = function (vec2Acceleration) {
    this.acceleration.add(vec2Acceleration);
    // this.velocity.add(this.acceleration);
    // this.acceleration.scale(0);
}

//todo: add apply torque etc
RigidShape.prototype.applyForce = function (forceVec2) {
    //apply it to acceleration
    // acceleration = Force / mass
    this.acceleration.add(forceVec2.copy().scale(this.invMass));
    //Linear 
    //  v=u+at; t=1 :P
    this.velocity.add(this.acceleration);

    this.acceleration.scale(0);
}


RigidShape.prototype.stop = function () {
    this.velocity = new Vec2(0, 0);
    this.acceleration = new Vec2(0, 0);

    this.angularVelocity = 0;
    this.angularAcceleration = 0;
}

// Broad phase collision test (bounding circles)
RigidShape.prototype.boundTest = function (otherRigidBody) {
    let radSq = (this.boundingRadius + otherRigidBody.boundingRadius); radSq *= radSq;

    return (
        radSq > this.center.distSq(otherRigidBody.center)
    );
}



