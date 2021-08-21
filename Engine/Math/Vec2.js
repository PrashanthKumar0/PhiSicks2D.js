const _TO_RADIANS = Math.PI / 180;
function Vec2(x, y) {
    this.x = x;
    this.y = y;
}
Vec2.prototype.magSq = function () {
    return this.x * this.x + this.y * this.y;
}
Vec2.prototype.mag = function () {
    return Math.hypot(this.x, this.y);
}
Vec2.prototype.copy = function () {
    return new Vec2(this.x, this.y);
}
Vec2.prototype.add = function (vec2) {
    this.x += vec2.x;
    this.y += vec2.y;
    return this;
}
Vec2.prototype.subtract = function (vec2) {
    this.x -= vec2.x;
    this.y -= vec2.y;
    return this;
}
Vec2.prototype.scale = function (fac) {
    this.x *= fac;
    this.y *= fac;
    return this;
}
Vec2.prototype.dot = function (vec2) {
    return this.x * vec2.x + this.y * vec2.y;
}
Vec2.prototype.cross = function (vec2) {
    return this.x * vec2.y - this.y * vec2.x;
}
Vec2.prototype.rotate = function (vec2center, angle) {
    // translate space to vec2Center
    this.subtract(vec2center);

    //rotate
    let x = this.x;
    let y = this.y;
    let sin = Math.sin(angle);
    let cos = Math.cos(angle);
    /*
    (c -s) [x]
    (s  c) [y]
    */
    this.x = cos * x - sin * y;
    this.y = sin * x + cos * y;

    // translate space beck to old position
    this.add(vec2center);
    return this;
}
Vec2.prototype.normalize = function () {
    var len = this.mag();
    if (len > 0) {
        len = 1 / len;
    } else {
        // throw "error 0 magnitude";
    }
    this.x *= len;
    this.y *= len;
    return this;
}
Vec2.prototype.distSq = function (vec2) {
    var dx = this.x - vec2.x;
    var dy = this.y - vec2.y;
    return dx * dx + dy * dy;
}
Vec2.prototype.dist = function (vec2) {
    var dx = this.x - vec2.x;
    var dy = this.y - vec2.y;
    return Math.hypot(dx, dy);
}