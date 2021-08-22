# PhiSicks2D.js

A 2D physics engine written in JS xD

[Live Demo](https://prashanthkumar0.github.io/PhiSicks2D.js/)
<br/><br/>

If you are on mobile then better see a [demo video here](https://youtu.be/1wv_1Bd-YrE)

Currently works only on PC
> use ```WASD``` keys to move blocks and ```Up and Down arrow``` keys to switch between them
> ```P``` spwans a polygon ```R``` spawns a rectangle ```C``` spwans a circle 
> hit ```Z``` to pause/play simulation 

<img src="./Ref/VideoCapture_20210821-233213.jpg" alt="a screenshot" />


    CAUTION:
        This is just made for fun not a serious project. 
        " all my projects are for fun :) "
        and as the name suggests its a sick engine :P
        doesnt work very well  
        
&nbsp;

    Well first ever engine made by me.
    and as its name suggests it a little buggy (not ment to be used in any practical game)

    Although its quite buggy You may use its parts like SAT-collision detection

# BUG 
The part which is buggy is : 
```javascript
// in
function resolveCollision();
// after the comment 
// ANCHOR : BUGGY PART
```

I will be very thankful if anyone help me resolving this issue 😊


While every other thing in this engine is perfect. (i probably need to work on it but i am going to prepare for JEE exam so i will pause the work).

# REFERENCE 

> you can use the book given in [Reference directory](./Ref/2d%20Physics%20Engine%20With%20js.pdf) for tring to make your own and there are also other reference material available that i used when i was stuck and it helped a lot.

# My lil story

> The most difficult part was to derive and understand the angular impulse (as mentioned earlier I still have no idea how to correctly implement angular impulse part but i believe that its collision information thats causing that weird artifact)

> It was quite tedious work and took me more than a week to complete this book just because maybe i was lazy . I sometimes felt like giving up but i didn't and now i am glad that i didnt gave up and tried hard. Understanding and deriving the angular impulse formula took me 3 day alone. I was quite frustrated and helpless then i found Chris Hecker's "Behind The Screen" which was really helpful. Physics lab also does a really great job in explaining the formula and its derivation (i actually understood from physics lab only after going back and forth between both).

> Enough history i dont think someone will be reading this but if you are then i really wanna know your name :)

Overall it was really nice expreience and "Dont ever give up in anything , Do it again and again untill you get it".

> ok enough philosophy. bye bye xD
