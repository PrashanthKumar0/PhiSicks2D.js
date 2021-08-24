/* DEPENDENCIES :   Core/Circle.js
                    Core/Polygon.js 
                    Core/Rectangle.js 
                    Math/Vec2.js
*/

// maybe used to select an object

// ! Circle
Circle.prototype.EXT_pt_collision_check = function (vec2Point) {
    if (vec2Point.dist(this.center) <= this.radius ) return true;
    return false;
}
//! Polygon
Polygon.prototype.EXT_pt_collision_check = function (vec2Point) {
    // console.log('hi');
    for (let i = 0; i < this.vertex.length; i++) {
        let norm = this.faceNormals[i];
        let vertex = this.vertex[i];
        let vp = vec2Point.copy().subtract(vertex);
        if (vp.dot(norm) > 0) return false; // if point is outside
    }
    return true;
}

// ! RECTANGLE
Rectangle.prototype.EXT_pt_collision_check = function (vec2Point) {
    // console.log('hi');
    for (let i = 0; i < this.vertex.length; i++) {
        let norm = this.faceNormals[i];
        let vertex = this.vertex[i];
        let vp = vec2Point.copy().subtract(vertex);
        if (vp.dot(norm) > 0) return false; // if point is outside
    }
    return true;
}