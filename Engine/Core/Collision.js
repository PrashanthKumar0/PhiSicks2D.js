/**
 * Dependencies :   Engine/Math/Vec2.js
 */

/**
 * 
 * @param  start    -> the normal starts from here 
 * @param  end      -> the normal ends here
 * @param  normal   -> normal isnt a unit vector
 *  in short vec(end)-vec(start)=vec(normal)
 */
function CollisionInformation(start = null, end = null, normal = null) { // just a data structure
    this.start = start;
    this.end = end;
    this.normal = normal;
}

// to reduce memory usage we just make a seperate function
function reverseCollisionInformation(collisionInformationObj) {
    let end = collisionInformationObj.end.copy();
    collisionInformationObj.end = collisionInformationObj.start;
    collisionInformationObj.start = end;
    collisionInformationObj.normal.scale(-1);
}


//returns false on non colliding objects and CollsionInformation object on collision
function CircleCircle(c1, c2) { // resolve for c1
    let dist = c1.center.dist(c2.center);
    let sumR = (c1.radius + c2.radius);
    if (dist == 0) {
        // for this case normal vector is in -y direction with depth=max(r1,r2)
        let depth = Math.max(c1.radius, c2.radius);
        let normal = new Vec2(0, -depth);
        let start = c1.center.copy();
        let end = start.copy().add(normal);
        return new CollisionInformation(start, end, normal);
    }
    if (sumR > dist) {
        let depth = sumR - dist;
        let normal = c2.center.copy().subtract(c1.center).normalize(); //REVERSE THIS AFTER WE ARE DONE
        let end = c1.center.copy().add(normal.copy().scale(c1.radius));
        normal.scale(-depth);
        let start = end.copy().add(normal);
        // debugger;
        return new CollisionInformation(start, end, normal);
    }
    return false;
}



// returns false on non colliding objects and  CollisionInformation object on collision
function SatPolygon(polygon1, polygon2) {
    // for collision information
    //TODO : reduce Variables and hardCoded Infinity ?
    let collisionInfo = new CollisionInformation();
    let leastPenetrationDist = Infinity; // a positive quantity

    // i know about DRY principle but lets repeat it to make simple and efficient

    // my faceNormal
    for (let i = 0; i < polygon1.faceNormals.length; i++) {
        let normal = polygon1.faceNormals[i];
        let vertex = polygon1.vertex[i];
        let LargestSupportDist = -1; //since supportDistance is positive this (-1) will be nice place to start with
        let LargestSupportPt = null;
        let hasSupportPoint = false;
        for (let j = 0; j < polygon2.vertex.length; j++) {
            let supportPoint = polygon2.vertex[j];
            let supportDistance = vertex.copy().subtract(supportPoint).dot(normal); //this must be greater than 0 to be inside geometry
            if (supportDistance > 0) {
                hasSupportPoint = true;
                if (supportDistance > LargestSupportDist) {
                    LargestSupportDist = supportDistance;
                    LargestSupportPt = supportPoint.copy();
                }
            }
        }
        if (!hasSupportPoint) return false; //if no support point for faceNormal is found

        if (LargestSupportDist < leastPenetrationDist) {
            leastPenetrationDist = LargestSupportDist;
            // nomal should be from 2 to 1 
            collisionInfo.end = LargestSupportPt;
            collisionInfo.normal = normal.copy().scale(-leastPenetrationDist);
            collisionInfo.start = collisionInfo.end.copy().subtract(collisionInfo.normal);
        }
    }


    // your faceNormal
    for (let i = 0; i < polygon2.faceNormals.length; i++) {
        let normal = polygon2.faceNormals[i];
        let vertex = polygon2.vertex[i];
        let LargestSupportDist = -1; //since supportDistance is positive this (-1) will be nice place to start with
        let LargestSupportPt = null;
        let hasSupportPoint = false;
        for (let j = 0; j < polygon1.vertex.length; j++) {
            let supportPoint = polygon1.vertex[j];
            let supportDistance = vertex.copy().subtract(supportPoint).dot(normal); //this must be greater than 0 to be inside geometry
            if (supportDistance > 0) {
                hasSupportPoint = true;
                if (supportDistance > LargestSupportDist) {
                    LargestSupportDist = supportDistance;
                    LargestSupportPt = supportPoint.copy();
                }
            }
        }
        if (!hasSupportPoint) return false; //if no support point for faceNormal is found

        if (LargestSupportDist < leastPenetrationDist) {
            leastPenetrationDist = LargestSupportDist;
            // nomal should be from 2 to 1 
            collisionInfo.start = LargestSupportPt;
            collisionInfo.normal = normal.copy().scale(leastPenetrationDist);
            collisionInfo.end = collisionInfo.start.copy().add(collisionInfo.normal);
        }
    }


    return collisionInfo;
}

// returns false on non colliding objects and  CollisionInformation object on collision
function CirclePolygon(circle, polygon, ctx) {
    // // calculate nearest edge

    let collisionInfo = new CollisionInformation();

    // is center of circle inside of our polygon
    let inside = true;
    let nearestEdge = [null, null];
    let nearestNormal = null;
    let nearestProjectionDist = -Infinity;
    //calculate nearest edge
    for (let i = 0; i < polygon.vertex.length; i++) {
        let normal = polygon.faceNormals[i].copy();
        let proj = circle.center.copy().subtract(polygon.vertex[i]).dot(normal);
        if (proj > 0) {
            inside = false;
        }
        if (proj > nearestProjectionDist) {
            nearestProjectionDist = proj;
            nearestEdge[0] = polygon.vertex[i].copy();
            nearestEdge[1] = polygon.vertex[(i + 1) % polygon.vertex.length].copy();
            nearestNormal = normal; //normal is already copied
        }
    }

    // // ! Just for DEBUGGING
    // if (inside) {
    //     ctx.strokeStyle = "red";
    // } else {
    //     ctx.strokeStyle = "green";
    // }
    // circ(nearestEdge[0].x, nearestEdge[0].y, 8, ctx);
    // circ(nearestEdge[1].x, nearestEdge[1].y, 8, ctx);



    if (inside) { // if circle center lie inside of polygon
        let depth = circle.radius - nearestProjectionDist; // nearestProjectionDist is negative so its same as addition
        collisionInfo.end = circle.center.copy().subtract(nearestNormal.copy().scale(nearestProjectionDist));
        collisionInfo.normal = nearestNormal.scale(depth); //no need copy cuz its already copied (and we just scale it)
        collisionInfo.start = collisionInfo.end.copy().subtract(collisionInfo.normal);
        return collisionInfo;
    } else { // if circle center lie outside of polygon 
        let tangent = nearestEdge[1].copy().subtract(nearestEdge[0]); // tangent (parallel to nearest edge)

        /*           ------(COLLISION REGIONS)----
         *  A region (center above edge nearestEdge[0])
         *  B region (center between edge nearestEdge[0] and nearestEdge[1])
         *  C region (center below edge nearestEdge[1])
         */

        //! A region
        let v0toCenter = circle.center.copy().subtract(nearestEdge[0]);
        let proj = v0toCenter.dot(tangent);
        if (proj < 0) { // opposite in direction
            // ctx.strokeStyle = "red";
            // circ(circle.center.x, circle.center.y, 10, ctx);
            let dist = v0toCenter.mag();
            let depth = circle.radius - dist;
            let normal = v0toCenter.scale(1 / dist);

            if (depth > 0) {
                collisionInfo.start = circle.center.copy().subtract(normal.copy().scale(circle.radius));
                collisionInfo.normal = normal.scale(depth);
                collisionInfo.end = collisionInfo.start.copy().add(collisionInfo.normal);
                return collisionInfo;
            }

            return false;
        }

        //! C region
        let v1toCenter = circle.center.copy().subtract(nearestEdge[1]);
        proj = v1toCenter.dot(tangent.scale(-1));
        if (proj < 0) { // opposite in direction
            // ctx.strokeStyle = "green";
            // circ(circle.center.x, circle.center.y, 10, ctx);

            let dist = v1toCenter.mag();
            let depth = circle.radius - dist;
            let normal = v1toCenter.scale(1 / dist);

            if (depth > 0) {
                collisionInfo.start = circle.center.copy().subtract(normal.copy().scale(circle.radius));
                collisionInfo.normal = normal.scale(depth);
                collisionInfo.end = collisionInfo.start.copy().add(collisionInfo.normal);
                return collisionInfo;
            }

            return false;
        }

        //! B region
        let penetrationDepth = circle.radius - nearestProjectionDist;
        if (penetrationDepth > 0) {
            // ctx.strokeStyle = "blue";
            // circ(circle.center.x, circle.center.y, 10, ctx);
            collisionInfo.normal = nearestNormal.copy().scale(penetrationDepth);
            collisionInfo.start = circle.center.copy().add(nearestNormal.scale(-circle.radius));
            collisionInfo.end = collisionInfo.start.copy().add(collisionInfo.normal);
            return collisionInfo;
        }
    }
    return false;
}





// simple resolution (projection method)
// larger mass moves by smaller factor while smaller mass moves by larger factor
function applyPositionalCorrection(shape1, shape2, collisionInfo, positionalCorrectionPercentage) {

    let mi1 = shape1.invMass;
    let mi2 = shape2.invMass;

    let fac = (1 / (mi1 + mi2)) * positionalCorrectionPercentage; // m2 at infinity yields as (1/m2 =  mi2 = 0) ,  same follows for m1
    let n1 = collisionInfo.normal.copy().scale(fac * mi1); //! depth * fac * mi1 (normal's magnitude is already = depth)
    let n2 = collisionInfo.normal.copy().scale(-fac * mi2); //! depth * fac * mi2 (normal's magnitude is already = depth)
    shape1.move(n1);
    shape2.move(n2);
}

// const _90_DEGREES_IN_RADIANS = 90 * _TO_RADIANS;



function resolveCollision(shape1, shape2, collisionInfo, positionalCorrectionPercentage = 0.8, ctx) {
    if (shape1.invMass == 0 && shape2.invMass == 0) return;

    applyPositionalCorrection(shape1, shape2, collisionInfo, positionalCorrectionPercentage);



    let normal = collisionInfo.normal.normalize().copy(); // ? we dont need to copy
    let tangent = normal.copy();
    tangent.x = normal.y; // Efficient way to rotate 90 degree :P linear algebra on play
    tangent.y = -normal.x;

    //TODO: see right formula for combination of restitution and friction
    let effectiveRestitution = Math.min(shape1.restitution, shape2.restitution);  //we just  pick dominant one for now ()
    let effectiveFriction = Math.max(shape1.coeffFriction, shape2.coeffFriction); //we just  pick dominant one for now ()
    let relativeVelocity = shape2.velocity.copy().subtract(shape1.velocity); // relative velocity ( from 1 to 2 ) // TODO : see if we actually need .copy()


    if ((relativeVelocity.dot(normal) < 0)) { //both are moving in opposite direction
        return;
    }


    // ! JUST LINEAR IMPULSE
    // let impulseFactor = -((1 + effectiveRestitution) / (shape1.invMass + shape2.invMass));

    // let normalImpulse = impulseFactor * relativeVelocity.dot(normal);
    // let tangentImpulse = impulseFactor * relativeVelocity.dot(tangent) * effectiveFriction;

    // normal.scale(normalImpulse);
    // tangent.scale(tangentImpulse);

    // shape1.velocity.add(normal.copy().scale(-shape1.invMass));
    // shape2.velocity.add(normal.copy().scale(shape2.invMass));
    // debugger;
    // shape1.velocity.add(tangent.copy().scale(-shape1.invMass));
    // shape2.velocity.add(tangent.copy().scale(shape2.invMass));





    //! angular velocity 
    // // ANCHOR : BUGGY PART
    // RESOLVED BUG :)
    // normal.normalize();
    // tangent = normal.copy();
    // tangent.x = normal.y;
    // tangent.y = -normal.x;

    
    let p = collisionInfo.end.copy();
    //!just for debugging
    // ctx.strokeStyle = "green";
    // circ(p.x, p.y, 5, ctx);
    // debugger;

    let _pow = Math.pow;

    let Rap = p.copy().subtract(shape1.center);
    let Rbp = p.copy().subtract(shape2.center);

    let Va1 = shape1.velocity.copy().add(new Vec2(-1 * shape1.angularVelocity * Rap.y, shape1.angularVelocity * Rap.x));
    let Vb1 = shape2.velocity.copy().add(new Vec2(-1 * shape2.angularVelocity * Rbp.y, shape2.angularVelocity * Rbp.x));

    relativeVelocity = Vb1.subtract(Va1); // ? TODO : remove previous calculations
    

    
    let normalAngularImpulse = relativeVelocity.dot(normal) * (-(1 + effectiveRestitution));
    normalAngularImpulse /= (shape1.invMass + shape2.invMass) + _pow(Rap.cross(normal), 2) / shape1.momentOfInertia + _pow(Rbp.cross(normal), 2) / shape2.momentOfInertia;

    let tangentAngularImpulse = relativeVelocity.dot(tangent) * (-(1 + effectiveRestitution)) * effectiveFriction;
    tangentAngularImpulse /= (shape1.invMass + shape2.invMass) + _pow(Rap.cross(tangent), 2) / shape1.momentOfInertia + _pow(Rbp.cross(tangent), 2) / shape2.momentOfInertia;

    shape1.angularVelocity -= Rap.cross(normal) * normalAngularImpulse / shape1.momentOfInertia;
    shape2.angularVelocity += Rbp.cross(normal) * normalAngularImpulse / shape2.momentOfInertia;



    normal.scale(normalAngularImpulse);
    tangent.scale(tangentAngularImpulse);

    shape1.velocity.add(normal.copy().scale(-shape1.invMass));
    shape2.velocity.add(normal.copy().scale(shape2.invMass));
    // debugger;
    shape1.velocity.add(tangent.copy().scale(-shape1.invMass));
    shape2.velocity.add(tangent.copy().scale(shape2.invMass));



    // let tangentAngularImpulse = relativeVelocity.dot(tangent) * (-(1 + effectiveRestitution));
    // tangentAngularImpulse /= (shape1.invMass + shape2.invMass) + _pow(Rap.cross(tangent), 2) / shape1.momentOfInertia + _pow(Rbp.cross(tangent), 2) / shape2.momentOfInertia;
    // ? WTH 
    // shape1.angularVelocity += effectiveFriction * Rap.cross(normal) * tangentAngularImpulse / shape1.momentOfInertia;
    // shape2.angularVelocity -= effectiveFriction * Rbp.cross(normal) * tangentAngularImpulse / shape2.momentOfInertia;

    //TODO : remove this
    if ((isNaN(shape1.angularVelocity) || isNaN(shape2.angularVelocity))) {
        debugger;
    }
}



// function resolveCollision(shape1, shape2, collisionInfo, positionalCorrectionPercentage = 0.8, ctx) {
//     if (shape1.invMass == 0 && shape2.invMass == 0) return;

//     applyPositionalCorrection(shape1, shape2, collisionInfo, positionalCorrectionPercentage);



//     //! apply impulses after collision
//     //! LINEAR IMPULSE
//     // let normal = collisionInfo.normal.copy().normalize();
//     let normal = collisionInfo.normal.normalize().copy(); // ? we dont need to copy
//     let tangent = normal.copy();
//     tangent.x = normal.y;
//     tangent.y = -normal.x;
//     // console.log(normal.dot(tangent));
//     // debugger;

//     //TODO: see right formula for combination of restitution and friction
//     let effectiveRestitution = Math.min(shape1.restitution, shape2.restitution);  //we just  pick dominant one for now ()
//     let effectiveFriction = Math.max(shape1.coeffFriction, shape2.coeffFriction); //we just  pick dominant one for now ()
//     let relativeVelocity = shape2.velocity.copy().subtract(shape1.velocity); // relative velocity ( from 1 to 2 ) // TODO : see if we actually need .copy()


//     if ((relativeVelocity.dot(normal) < 0)) { //both are moving in opposite direction
//         return;
//     }

//     let impulseFactor = -((1 + effectiveRestitution) / (shape1.invMass + shape2.invMass));

//     let normalImpulse = impulseFactor * relativeVelocity.dot(normal);
//     let tangentImpulse = impulseFactor * relativeVelocity.dot(tangent) * effectiveFriction;

//     normal.scale(normalImpulse);
//     tangent.scale(tangentImpulse);

//     // shape1.velocity.add(normal.copy().scale(-shape1.invMass));
//     // shape2.velocity.add(normal.copy().scale(shape2.invMass));
//     // debugger;
//     // shape1.velocity.add(tangent.copy().scale(-shape1.invMass));
//     // shape2.velocity.add(tangent.copy().scale(shape2.invMass));





//     //! angular velocity 
//     // ANCHOR : BUGGY PART
//     normal.normalize();
//     tangent = normal.copy();
//     tangent.x = normal.y;
//     tangent.y = -normal.x;

//     // TODO: understand this nonsense (actually the point p calculation i have directly copied from author's code [no other part is copied and everything else than these 3 lines are genuinely my hand written code])
//     //? we could have directly pick p as end point of collision informatio
//     // var start = collisionInfo.start.scale(shape2.invMass / (shape1.invMass + shape2.invMass));
//     // var end = collisionInfo.end.scale(shape1.invMass / (shape1.invMass + shape2.invMass));
//     // var p = start.add(end);
//     let p = collisionInfo.end.copy();
//     //!just for debugging

//     // ctx.strokeStyle = "green";
//     // circ(p.x, p.y, 5, ctx);
//     // debugger;
//     let _pow = Math.pow;

//     let Rap = p.copy().subtract(shape1.center);
//     let Rbp = p.copy().subtract(shape2.center);

//     let Va1 = shape1.velocity.copy().add(new Vec2(-1 * shape1.angularVelocity * Rap.y, shape1.angularVelocity * Rap.x));
//     let Vb1 = shape2.velocity.copy().add(new Vec2(-1 * shape2.angularVelocity * Rbp.y, shape2.angularVelocity * Rbp.x));

//     relativeVelocity = Vb1.subtract(Va1);
//     // if (relativeVelocity.dot(normal) <= 0.2) {
//     //     // console.log('beep');
//     //     return;
//     // }
    

//     // ctx.strokeStyle = "red";
//     // let n = p.copy().add(normal.copy().scale(10));
//     // circ(p.x, p.y, 5, ctx);
//     // ctx.strokeStyle = "green";
//     // circ(n.x, n.y, 5, ctx);

//     let normalAngularImpulse = relativeVelocity.dot(normal) * (-(1 + effectiveRestitution));
//     normalAngularImpulse /= (shape1.invMass + shape2.invMass) + _pow(Rap.cross(normal), 2) / shape1.momentOfInertia + _pow(Rbp.cross(normal), 2) / shape2.momentOfInertia;

//     let tangentAngularImpulse = relativeVelocity.dot(tangent) * (-(1 + effectiveRestitution)) * effectiveFriction;
//     tangentAngularImpulse /= (shape1.invMass + shape2.invMass) + _pow(Rap.cross(tangent), 2) / shape1.momentOfInertia + _pow(Rbp.cross(tangent), 2) / shape2.momentOfInertia;

//     shape1.angularVelocity -= Rap.cross(normal) * normalAngularImpulse / shape1.momentOfInertia;
//     shape2.angularVelocity += Rbp.cross(normal) * normalAngularImpulse / shape2.momentOfInertia;



//     normal.scale(normalAngularImpulse);
//     tangent.scale(tangentAngularImpulse);

//     shape1.velocity.add(normal.copy().scale(-shape1.invMass));
//     shape2.velocity.add(normal.copy().scale(shape2.invMass));
//     // debugger;
//     shape1.velocity.add(tangent.copy().scale(-shape1.invMass));
//     shape2.velocity.add(tangent.copy().scale(shape2.invMass));



//     // let tangentAngularImpulse = relativeVelocity.dot(tangent) * (-(1 + effectiveRestitution));
//     // tangentAngularImpulse /= (shape1.invMass + shape2.invMass) + _pow(Rap.cross(tangent), 2) / shape1.momentOfInertia + _pow(Rbp.cross(tangent), 2) / shape2.momentOfInertia;

//     // shape1.angularVelocity += effectiveFriction * Rap.cross(normal) * tangentAngularImpulse / shape1.momentOfInertia;
//     // shape2.angularVelocity -= effectiveFriction * Rbp.cross(normal) * tangentAngularImpulse / shape2.momentOfInertia;

//     //TODO : remove this
//     if ((isNaN(shape1.angularVelocity) || isNaN(shape2.angularVelocity))) {
//         debugger;
//     }
// }








// ! TEMP
function circ(x, y, r, ctx) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.stroke();
    ctx.closePath();
}