/**
 ** Dependencies :   * Engine/Core/RigidShape.js  
 *                   * Engine/Math/Vec2.js
 *                   * 
 */


function Polygon(centerVec2, sides, radius, fixed = false, density = 0.0001, restitution = 0.75, coeffFriction = 0.2) { // cyclic polygon
    // TODO : check if area formula is ok
    mass = density * (sides * radius * radius * Math.pow(Math.sin(4 * Math.PI / (sides)), 2)) / 2;

    // mass = density * (sides * radius * radius * Math.pow(Math.sin(4 * Math.PI / (sides)), 2)) / 2;
    RigidShape.call(this, centerVec2, fixed, mass, restitution, coeffFriction); // inherit

    this.radius = radius;
    this.sides = sides; //? actually this is here to eat some memory TODO: remove it (maybe)
    this.type = "Rectangle"; // yeah rectangle (there's a lil story behind it) leme know if you are interested to know


    // vertex of Polygon
    this.vertex = [];
    this.faceNormals = [];
    this.boundingRadius = radius;

    let _tPi = Math.PI * 2;
    let _da = _tPi / sides;
    for (let ang = 0; ang < _tPi; ang += _da) {
        let xa = Math.cos(ang);
        let ya = Math.sin(ang);

        this.faceNormals.push(new Vec2(Math.cos(ang + _da / 2), Math.sin(ang + _da / 2)));
        this.vertex.push(new Vec2(centerVec2.x + radius * xa, centerVec2.y + radius * ya));
    }

    this.calculateMOI();
};



{
    let prototype = Object.create(RigidShape.prototype);
    prototype.constructor = Polygon;
    Polygon.prototype = prototype;
}

//TODO: implement actual formula (MOI of triangle * number of sides)
Polygon.prototype.calculateMOI = function () {
    // this.momentOfInertia = 1;
    // if (this.mass == Infinity) this.momentOfInertia = Infinity;
    this.momentOfInertia = (1 / 2) * this.mass * (this.radius * this.radius); // yeah just a hack (assuming polygon as just a circle)
}

Polygon.prototype.move = function (vec2Displacement, mustMove = false) {
    if (this.fixed && !mustMove) return;
    this.center.add(vec2Displacement);
    for (let i = 0; i < this.vertex.length; i++) {
        this.vertex[i].add(vec2Displacement);
    }
}

Polygon.prototype.rotate = function (dAngle, mustMove = false) {
    // if(this.fixed && !mustMove) return;
    this.angle += dAngle;
    for (let i = 0; i < this.vertex.length; i++) {
        this.vertex[i].rotate(this.center, dAngle);
        this.faceNormals[i].rotate(new Vec2(0, 0), dAngle);
    }
};




