/**
 ** Dependencies :   * Engine/Core/RigidShape.js  
 *                   * Engine/Math/Vec2.js
 *                   * 
 */


function Rectangle(centerVec2, width, height, fixed = false, density = 0.0001, restitution = 0.75, coeffFriction = 0.2) {
    this.fixed = fixed;
    mass = density * height * width;
    RigidShape.call(this, centerVec2, fixed, mass, restitution, coeffFriction); // inherit
    this.width = width;
    this.height = height; //? useless ? NO , this will give a lil performance optimization
    this.type = "Rectangle";

    this.calculateMOI();
    // vertex of rectangle
    this.vertex = new Array(4);
    let halfW = width / 2;
    let halfH = height / 2;

    this.boundingRadius = Math.hypot(halfH, halfW);


    this.vertex[0] = new Vec2(this.center.x - halfW, this.center.y - halfH);//top right
    this.vertex[1] = new Vec2(this.center.x + halfW, this.center.y - halfH);//top left
    this.vertex[2] = new Vec2(this.center.x + halfW, this.center.y + halfH);//bottom left
    this.vertex[3] = new Vec2(this.center.x - halfW, this.center.y + halfH);//bottom right

    //normals to each edges
    /*          normal (top)
              |---|---|
     normal <-|       |-> normal (right)
     (left)   |---|---|
                 normal (bottom)
    */

    this.faceNormals = [
        new Vec2(0, -1),    //top
        new Vec2(1, 0),    //right
        new Vec2(0, 1),    //bottom
        new Vec2(-1, 0),    //left
    ];

};

{
    let prototype = Object.create(RigidShape.prototype);
    prototype.constructor = Rectangle;
    Rectangle.prototype = prototype;
}


Rectangle.prototype.calculateMOI = function () {
    // this.momentOfInertia = 1;
    // if (this.mass == Infinity) this.momentOfInertia = Infinity;
    this.momentOfInertia = (1 / 12) * this.mass * (this.width * this.width + this.height * this.height);
}

Rectangle.prototype.move = function (vec2Displacement, mustMove = false) {
    if (this.fixed && !mustMove) return;
    this.center.add(vec2Displacement);
    for (let i = 0; i < this.vertex.length; i++) {
        this.vertex[i].add(vec2Displacement);
    }
}

Rectangle.prototype.rotate = function (dAngle, mustMove = false) {
    // if(this.fixed && !mustMove) return;
    this.angle += dAngle;
    for (let i = 0; i < this.vertex.length; i++) {
        this.vertex[i].rotate(this.center, dAngle);
        this.faceNormals[i].rotate(new Vec2(0, 0), dAngle);
    }
};





// Rectangle.prototype.applyForce = function (forceVec2) {
//     //apply it to acceleration
//     // acceleration = Force / mass
//     this.acceleration.add(forceVec2.copy().scale(this.invMass));
// }
