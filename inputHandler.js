let CURRENT_BOUND_OBJECT_INDEX = 0;
addEventListener('keydown', function (e) {
    let msg = " <b class='event'> [ KEY_PRESS : ] </b> " + e.key.toLocaleLowerCase() + "  . <br>"
    msg += handleCommand(e.key);
    msg += objectDetails();
    debug(msg)

});




















// Seperared as a function to enable also touch and mouse support
function handleCommand(keyCode, msg = '') {
    if (E_RIGID_BODY_COLLECTION.length > 0) {
        E_RIGID_BODY_COLLECTION[CURRENT_BOUND_OBJECT_INDEX].selected = true;
    }
    ctx.strokeStyle = "blue";

    let x, y;


    if (E_RIGID_BODY_COLLECTION.length > 0) {
        x = E_RIGID_BODY_COLLECTION[CURRENT_BOUND_OBJECT_INDEX].center.x;
        y = E_RIGID_BODY_COLLECTION[CURRENT_BOUND_OBJECT_INDEX].center.y;
    } else {
        x = rand(0, canvas.width);
        y = rand(0, canvas.height);
    }

    let w = rand(25, 70);
    let h = rand(25, 70);
    let move = new Vec2(0, 0);
    let dAngle = 0;
    switch (keyCode.toLowerCase()) {
        case 'r':
            // CURRENT_BOUND_OBJECT_INDEX++;
            let r = new Rectangle(new Vec2(x, y), w, h);
            r.draw(ctx);
            msg += "[New Rectangle]: &lt; " + x + " , " + y + " &gt; [ID:" + E_RIGID_BODY_COLLECTION.length + "]";
            // msg += "[New Rectangle]: &lt; " + x + " , " + y + " &gt; [ID:0]";
            // ctx.strokeRect(x, y, w, h)
            break;
        case 'p':
            let p = new Polygon(new Vec2(x, y), Math.floor(Math.random() * 8) + 3, w / 2);
            p.draw(ctx);
            msg += "[New Polygon]: &lt; " + x + " , " + y + " &gt; [ID:" + E_RIGID_BODY_COLLECTION.length + "]";

            break;
        case 'c':
            // CURRENT_BOUND_OBJECT_INDEX++;
            // ctx.beginPath();
            // ctx.arc(x, y, w / 2, 0, Math.PI * 2);
            // ctx.stroke();
            // ctx.closePath();
            let c = new Circle(new Vec2(x, y), w);
            msg += "[New Circle]: &lt; " + x + " , " + y + " , " + w + "  &gt; [ID:" + E_RIGID_BODY_COLLECTION.length + "]";
            // msg += "[New Circle]: &lt; " + x + " , " + y + " , " + w + "  &gt; [ID:0]";
            break;
        case 'arrowup':
            if ((CURRENT_BOUND_OBJECT_INDEX + 1) < E_RIGID_BODY_COLLECTION.length) {
                E_RIGID_BODY_COLLECTION[CURRENT_BOUND_OBJECT_INDEX].selected = false;
                E_RIGID_BODY_COLLECTION[++CURRENT_BOUND_OBJECT_INDEX].selected = true;
            }
            break;
        case 'arrowdown':
            if ((CURRENT_BOUND_OBJECT_INDEX) > 0) {
                E_RIGID_BODY_COLLECTION[CURRENT_BOUND_OBJECT_INDEX].selected = false;
                E_RIGID_BODY_COLLECTION[--CURRENT_BOUND_OBJECT_INDEX].selected = true;
            }
            break;
        case 'w':
            move.y = -1;
            break;
        case 'a':
            move.x = -1;
            break;
        case 's':
            move.y = 1;
            break;
        case 'd':
            move.x = 1;
            break;
        case 'q':
            dAngle = -0.1;
            break;
        case 'e':
            dAngle = 0.1;
            break;

        case 'z':
            engine.paused = !engine.paused;
            break;
    }
    if (E_RIGID_BODY_COLLECTION.length > 0) {
        E_RIGID_BODY_COLLECTION[CURRENT_BOUND_OBJECT_INDEX].move(move, true);
        E_RIGID_BODY_COLLECTION[CURRENT_BOUND_OBJECT_INDEX].rotate(dAngle, true);
    }

    return msg;
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
            "POSITION : &lt " + ob.center.x.toFixed(2) + " , " + ob.center.y.toFixed(2) + " &gt; <br>" +
            "ANGLE : " + Number(ob.angle * 180 / Math.PI).toFixed(2) + " deg<br>" +
            ""
            ;

        return details;
    }
    return "";
}