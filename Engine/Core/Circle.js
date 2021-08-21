/**
 ** Dependencies :   * Engine/Core/RigidShape.js  
 *                   * Engine/Math/Vec2.js
 *                   * 
 */


function Circle(centerVec2, radius, fixed = false, density = 0.0001, restitution = 0.75, coeffFriction = 0.2) {
    mass = density * Math.PI * radius * radius;
    RigidShape.call(this, centerVec2, fixed, mass, restitution, coeffFriction); // inherit
    this.radius = radius;
    this.boundingRadius = radius;
    this.type = "Circle";
    this.calculateMOI();

    this.start = this.center.copy().add(new Vec2(0, -this.radius)); //starting point
};



{
    let prototype = Object.create(RigidShape.prototype);
    prototype.constructor = Circle;
    Circle.prototype = prototype;
}

Circle.prototype.calculateMOI = function () {
    // this.momentOfInertia = 1;
    // if (this.mass == Infinity) this.momentOfInertia = Infinity;
    this.momentOfInertia = (1 / 2) * this.mass * this.radius * this.radius;
}

Circle.prototype.move = function (vec2Displacement, mustMove = false) {
    if (this.fixed && !mustMove) return;
    this.center.add(vec2Displacement);
    this.start.add(vec2Displacement);
}

Circle.prototype.rotate = function (dAngle, mustMove = false) {
    // if(this.fixed && !mustMove) return;
    this.angle += dAngle;
    this.start.rotate(this.center, dAngle);
};



// Circle.prototype.applyForce = function (forceVec2) {
//     //apply it to acceleration
//     // acceleration = Force / mass
//     this.acceleration.add(forceVec2.copy().scale(this.invMass));
// }




