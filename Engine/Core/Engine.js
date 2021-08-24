/**
 * Dependencies: 
 *                  Engine/Core/RigidShape.js  ,
 *                  Engine/Core/Collision.js 
 *              
 */

//TODO REMOVE THE CTX AND OTHER DRAW STUFF FROM ENGINE AS ITS NONE OF ENGINE'S BUSINESS

function Engine(width, height, ctx) {
    this.width = width;
    this.height = height;
    this.ctx = ctx;
    this.previousUpdateTime = 0;
    this.fps = 60;
    this.invFps = 1 / this.fps;
    this.fpsDt = 1000 * this.invFps; //actually milli seconds
    this.paused = false;

    this.drawCallback = null;

    this.positionalCorrectionPercentage = 0.8; //objects are resolved by 80%
    this.relaxIterations = 15;
}

Engine.prototype.update = function () { //TODO : CORRECT THE MISTAKE THIS IN FIXED TIMESTEP UPDATE METHOD
    if (this.drawCallback) this.drawCallback(); // TODO : check type to be function

    if (this.paused) {
        this.previousUpdateTime = performance.now(); //  also update time here so that after playing it never messes up
        return;
    }

    let now = performance.now(); //? milli seconds
    if (this.previousUpdateTime == 0) {
        this.previousUpdateTime = now;
    }
    let timeElapsed = now - this.previousUpdateTime;
    // debugger;
    this.droppedFrames = -1;
    while (timeElapsed > this.fpsDt) {
        this.step();
        this.droppedFrames++;
        timeElapsed -= this.fpsDt;
        this.previousUpdateTime = now;
    }

    // debugger;
}

Engine.prototype.getFps = function () {
    let fps = this.fps - this.droppedFrames;
    return fps < 0 ? 0 : fps;
}


//TODO: REMOVE ALL DRAW COMMANDS AS ITS NOT PART OF ENGINE AND ITS ONLY FOR DEBUGGING PURPOSE

Engine.prototype.step = function () {
    //TODO : all physics stuff (rotation, collision , collosion resolution , etc)

    if (this.paused) return;


    //  update all bodies (2d)
    // TODO : add dt term
    for (let i = 0; i < E_RIGID_BODY_COLLECTION.length; i++) {
        E_RIGID_BODY_COLLECTION[i].update(1);
    }

    // ! Collision DETECTION / Resolution
    // Broad phase (bounding circle) collision test 
    for (let r = 0; r < this.relaxIterations; r++) {

        let _colliding = false;
        for (let i = 0; i < E_RIGID_BODY_COLLECTION.length; i++) {
            for (let j = i + 1; j < E_RIGID_BODY_COLLECTION.length; j++) {
                // TODO REMOVE THIS (skip collision for first 4 boundries)

                //! DRAW
                //! Bounding Circle Test (broad phase)
                if (E_RIGID_BODY_COLLECTION[i].boundTest(E_RIGID_BODY_COLLECTION[j])) { //TODO WE CAN OPTIMIZE THIS AND USE ThIS INFO FOR CIRLE CIRCLE NARROW PHASE TOO

                    //! NARROW PHASE
                    let sameType = E_RIGID_BODY_COLLECTION[i].type == E_RIGID_BODY_COLLECTION[j].type;
                    //! CIRCLE - CIRCLE
                    if (sameType && E_RIGID_BODY_COLLECTION[j].type == "Circle") {
                        let collisionInfo = CircleCircle(E_RIGID_BODY_COLLECTION[i], E_RIGID_BODY_COLLECTION[j]);
                        if (!collisionInfo) continue; //! not colliding
                        _colliding = true;

                        resolveCollision(E_RIGID_BODY_COLLECTION[i], E_RIGID_BODY_COLLECTION[j], collisionInfo, this.positionalCorrectionPercentage, this.ctx);


                        continue;

                        // //! CURRENTLY JUST DRAW A LINE
                        // ! JUST FOR DEBUGGING
                        {
                            this.ctx.fillStyle = "RED";
                            this.ctx.beginPath();
                            this.ctx.arc(collisionInfo.start.x, collisionInfo.start.y, 4, 0, Math.PI * 2);
                            this.ctx.fill();
                            this.ctx.closePath();

                            this.ctx.fillStyle = "YELLOW";
                            this.ctx.beginPath();
                            this.ctx.arc(collisionInfo.end.x, collisionInfo.end.y, 4, 0, Math.PI * 2);
                            this.ctx.fill();
                            this.ctx.closePath();


                            this.ctx.strokeStyle = "#660";
                            this.ctx.beginPath();
                            this.ctx.moveTo(collisionInfo.start.x, collisionInfo.start.y);
                            this.ctx.lineTo(collisionInfo.end.x, collisionInfo.end.y);
                            this.ctx.stroke();
                            this.ctx.closePath();
                        }
                        continue; //!to avoid else if;
                    }
                    //! Rectangle - Rectangle 
                    if (sameType && E_RIGID_BODY_COLLECTION[j].type == "Rectangle") {
                        let collisionInfo = SatPolygon(E_RIGID_BODY_COLLECTION[i], E_RIGID_BODY_COLLECTION[j]);
                        if (!collisionInfo) continue;
                        _colliding = true;
                        // debugger;
                        
                        resolveCollision(E_RIGID_BODY_COLLECTION[i], E_RIGID_BODY_COLLECTION[j], collisionInfo, this.positionalCorrectionPercentage, this.ctx);

                        continue;

                        // E_RIGID_BODY_COLLECTION[i].draw(this.ctx, "GREEN");
                        // E_RIGID_BODY_COLLECTION[j].draw(this.ctx, "GREEN");
                        //! DEBUGGING INFO:
                        if (collisionInfo.normal !== null) {
                            this.ctx.fillStyle = "RED";
                            this.ctx.beginPath();
                            this.ctx.arc(collisionInfo.start.x, collisionInfo.start.y, 4, 0, Math.PI * 2);
                            this.ctx.fill();
                            this.ctx.closePath();

                            this.ctx.fillStyle = "YELLOW";
                            this.ctx.beginPath();
                            this.ctx.arc(collisionInfo.end.x, collisionInfo.end.y, 4, 0, Math.PI * 2);
                            this.ctx.fill();
                            this.ctx.closePath();


                            this.ctx.strokeStyle = "#660";
                            this.ctx.beginPath();
                            this.ctx.moveTo(collisionInfo.start.x, collisionInfo.start.y);
                            this.ctx.lineTo(collisionInfo.end.x, collisionInfo.end.y);
                            this.ctx.stroke();
                            this.ctx.closePath();
                        }
                        // debugger;
                        continue; //!to avoid else if;
                    }
                    //! both are of different types (possibility)
                    //! circle Rectangle
                    if (E_RIGID_BODY_COLLECTION[i].type == "Circle") {
                        let collisionInfo = CirclePolygon(E_RIGID_BODY_COLLECTION[i], E_RIGID_BODY_COLLECTION[j], this.ctx);
                        if (!collisionInfo) continue;
                        _colliding = true;

                        resolveCollision(E_RIGID_BODY_COLLECTION[i], E_RIGID_BODY_COLLECTION[j], collisionInfo, this.positionalCorrectionPercentage, this.ctx);

                        continue;
                        // E_RIGID_BODY_COLLECTION[i].draw(this.ctx, "GREEN");
                        // E_RIGID_BODY_COLLECTION[j].draw(this.ctx, "GREEN");

                        //! DEBUGGING INFO:
                        if (collisionInfo.normal !== null) {
                            this.ctx.fillStyle = "RED";
                            this.ctx.beginPath();
                            this.ctx.arc(collisionInfo.start.x, collisionInfo.start.y, 4, 0, Math.PI * 2);
                            this.ctx.fill();
                            this.ctx.closePath();

                            this.ctx.fillStyle = "YELLOW";
                            this.ctx.beginPath();
                            this.ctx.arc(collisionInfo.end.x, collisionInfo.end.y, 4, 0, Math.PI * 2);
                            this.ctx.fill();
                            this.ctx.closePath();


                            this.ctx.strokeStyle = "#660";
                            this.ctx.beginPath();
                            this.ctx.moveTo(collisionInfo.start.x, collisionInfo.start.y);
                            this.ctx.lineTo(collisionInfo.end.x, collisionInfo.end.y);
                            this.ctx.stroke();
                            this.ctx.closePath();
                        }

                        continue;
                    }
                    // //!Rectangle Circle 
                    if (E_RIGID_BODY_COLLECTION[i].type == "Rectangle") {
                        let collisionInfo = CirclePolygon(E_RIGID_BODY_COLLECTION[j], E_RIGID_BODY_COLLECTION[i]);
                        if (!collisionInfo) continue;
                        _colliding = true;

                        reverseCollisionInformation(collisionInfo);
                        resolveCollision(E_RIGID_BODY_COLLECTION[i], E_RIGID_BODY_COLLECTION[j], collisionInfo, this.positionalCorrectionPercentage, this.ctx);

                        continue;
                        // E_RIGID_BODY_COLLECTION[i].draw(this.ctx, "GREEN");
                        // E_RIGID_BODY_COLLECTION[j].draw(this.ctx, "GREEN");

                        //! DEBUGGING INFO:
                        if (collisionInfo.normal !== null) {
                            this.ctx.fillStyle = "RED";
                            this.ctx.beginPath();
                            this.ctx.arc(collisionInfo.start.x, collisionInfo.start.y, 4, 0, Math.PI * 2);
                            this.ctx.fill();
                            this.ctx.closePath();

                            this.ctx.fillStyle = "YELLOW";
                            this.ctx.beginPath();
                            this.ctx.arc(collisionInfo.end.x, collisionInfo.end.y, 4, 0, Math.PI * 2);
                            this.ctx.fill();
                            this.ctx.closePath();


                            this.ctx.strokeStyle = "#660";
                            this.ctx.beginPath();
                            this.ctx.moveTo(collisionInfo.start.x, collisionInfo.start.y);
                            this.ctx.lineTo(collisionInfo.end.x, collisionInfo.end.y);
                            this.ctx.stroke();
                            this.ctx.closePath();
                        }

                        continue;
                    }
                    else { // some other stuff for future (this wont be executed for now)
                        _colliding = true;
                        E_RIGID_BODY_COLLECTION[i].draw(this.ctx, "GREEN");
                        E_RIGID_BODY_COLLECTION[j].draw(this.ctx, "GREEN");
                    }
                }
            }
        }
        if (!_colliding) {
            //console log just for getting best relaxationIteration with trial and error
            // console.log((this.relaxIterations - r) + " iterations");
            break;
        }
    }





}


