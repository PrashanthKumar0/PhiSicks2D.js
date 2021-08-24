/*
    !NOTE : THIS IS JUST A PLUGIN TO CORE ENGINE AND RIGID BODY
    Dependencies :
                Engine/Core/Rectangle.js
                Engine/Core/Circle.js
    Just for debugging 
    
*/

Rectangle.prototype.draw = function (ctx, strokeColor = "blue") {
    if (this.selected) {
        ctx.strokeStyle = "RED";
    } else {
        ctx.strokeStyle = strokeColor || "blue";
    }



    // Draw Rectangle
    // ctx.save();
    // ctx.translate(this.vertex[0].x, this.vertex[0].y);
    // ctx.rotate(this.angle);
    // ctx.strokeRect(0, 0, this.width, this.height);
    // ctx.restore();

    ctx.beginPath();
    for (let i = 0; i < 5; i++) {
        let v = this.vertex[i % 4];
        if (i == 0) {
            ctx.moveTo(v.x, v.y);
            continue;
        }
        ctx.lineTo(v.x, v.y);
    }
    ctx.stroke();
    ctx.closePath();

    return;

    {//center
        ctx.fillStyle = "salmon";
        ctx.beginPath();
        ctx.arc(this.center.x, this.center.y, 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
    }

    {   // Draw Normals 
        // COLORS:
        //      UP :  red
        //      Right: Blue
        //      Down: RED
        //      Left: Blue
        let colors = ["RED", "BLUE", "RED", "BLUE"];
        // let reset=ctx.lineWidth;
        ctx.save();
        ctx.lineWidth = 4;
        for (let i = 0; i < 4; i++) {
            let v;
            //mid point 
            v = this.vertex[(1 + i) % 4].copy().add(this.vertex[i]).scale(0.5); //(a+b)/2
            ctx.strokeStyle = colors[i];
            ctx.beginPath();
            if (i == 0) {
                ctx.arc(v.x, v.y, 2, 0, Math.PI * 2);
            }
            ctx.moveTo(v.x, v.y);
            v.add(this.faceNormals[i].copy().scale(10)); //scale by 10 px
            ctx.lineTo(v.x, v.y);
            ctx.stroke();
        }
        ctx.restore();
    }
    // ctx.lineWidth=5;
}

Polygon.prototype.draw = function (ctx, strokeColor = "blue") {
    if (this.selected) {
        ctx.strokeStyle = "RED";
    } else {
        ctx.strokeStyle = strokeColor || "blue";
    }



    // Draw Rectangle
    // ctx.save();
    // ctx.translate(this.vertex[0].x, this.vertex[0].y);
    // ctx.rotate(this.angle);
    // ctx.strokeRect(0, 0, this.width, this.height);
    // ctx.restore();

    ctx.beginPath();
    for (let i = 0; i <= this.vertex.length; i++) {
        let v = this.vertex[i % this.vertex.length];
        if (i == 0) {
            ctx.moveTo(v.x, v.y);
            continue;
        }
        ctx.lineTo(v.x, v.y);
    }
    ctx.stroke();
    ctx.closePath();

    
    return;

    {//center
        ctx.fillStyle = "salmon";
        ctx.beginPath();
        ctx.arc(this.center.x, this.center.y, 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
    }

    // Draw Normals 
    // COLORS:
    //      UP :  red
    //      Right: Blue
    //      Down: RED
    //      Left: Blue

    let colors = ["RED", "BLUE", "RED", "BLUE"];
    // let reset=ctx.lineWidth;
    ctx.save();
    ctx.lineWidth = 4;
    for (let i = 0; i < this.vertex.length; i++) {
        let v;
        //mid point 
        v = this.vertex[(1 + i) % this.vertex.length].copy().add(this.vertex[i]).scale(0.5); //(a+b)/2
        ctx.strokeStyle = colors[i % colors.length];
        ctx.beginPath();
        if (i == 0) {
            ctx.arc(v.x, v.y, 2, 0, Math.PI * 2);
        }
        ctx.moveTo(v.x, v.y);
        v.add(this.faceNormals[i].copy().scale(10)); //scale by 10 px
        ctx.lineTo(v.x, v.y);
        ctx.stroke();
    }

    ctx.restore();
    // ctx.lineWidth=5;
}

Circle.prototype.draw = function (ctx, strokeColor = "blue") {
    if (this.selected) {
        ctx.strokeStyle = "RED";
    } else {
        ctx.strokeStyle = strokeColor || "blue";
    }

    ctx.beginPath();
    ctx.arc(this.center.x, this.center.y, this.radius, 0, Math.PI * 2);
    ctx.stroke();
    ctx.closePath();


    
    // return;
    
    //UP Direction
    ctx.strokeStyle = "OrangeRed";
    ctx.beginPath();
    ctx.moveTo(this.center.x, this.center.y);
    ctx.lineTo(this.start.x, this.start.y);
    ctx.stroke();
    ctx.closePath();

}

Engine.prototype.drawAll = function (ctx) {
    for (let i = 0; i < E_RIGID_BODY_COLLECTION.length; i++) {
        E_RIGID_BODY_COLLECTION[i].draw(ctx);
    }
}
