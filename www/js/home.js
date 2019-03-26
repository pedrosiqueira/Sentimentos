var gColorRed = "#CF0F0F";
var gColorYellow = "#fcc21b";
var gColorBlue = "#3764d5"; // "#095595";
var gColorDarkYellow = "#f0a20b";
var gColorBrown = "#463502";
var gColorTear = '#77CCEE';

var gEmojiCenterX;
var gEmojiCenterY;
var gEmojiR;

var gEmojiEyeHeight;
var gEmojiEyeWidth;

var gLineWidth;

function init_home() {
    let c = document.getElementById("myCanvas");
    let ctx = c.getContext("2d");
    let menor = window.innerWidth < window.innerHeight ? window.innerWidth : window.innerHeight;

    ctx.canvas.width = menor / 2;
    ctx.canvas.height = menor / 2;

    gEmojiCenterX = ctx.canvas.width / 2;
    gEmojiCenterY = ctx.canvas.height / 2;
    gEmojiR = ctx.canvas.width / 2;
    gEmojiEyeHeight = gEmojiR / 7;
    gEmojiEyeWidth = gEmojiEyeHeight * 2 / 3;
    gLineWidth = gEmojiEyeHeight / 2;

    $(document).on('input', '#myRange', function () {
        draw_emoji("myCanvas", $(this).val());
        document.getElementById("myCanvas").style.backgroundColor = getColorForPercentage($(this).val() / 200 + 0.5);
    });

    draw_emoji("myCanvas", 100);
}

function draw_emoji(id, joy)
{
    var c = document.getElementById(id);
    var ctx = c.getContext("2d");
    ctx.beginPath();
    ctx.fillStyle = gColorYellow;
    ctx.arc(gEmojiCenterX, gEmojiCenterY, gEmojiR, 0, 2 * Math.PI);
    ctx.fill();

    ctx.fillStyle = gColorBrown;
    draw_eyes(ctx);
    draw_joyful_lips(ctx, joy);
    if (joy <= -75)
    {
        draw_tear(ctx);
    }
}

function draw_eyes(ctx)
{
    var height = 20;
    var width = height * 2 / 3;

    var left_x = gEmojiCenterX - gEmojiR * 2 / 5;
    var right_x = gEmojiCenterX + gEmojiR * 2 / 5;

    var y = gEmojiCenterY - gEmojiR / 10;

    ctx.save();
    ellipse(ctx, left_x, y, gEmojiEyeWidth, gEmojiEyeHeight);
    ellipse(ctx, right_x, y, gEmojiEyeWidth, gEmojiEyeHeight);
    ctx.restore();
}

function draw_drop(ctx, x, y)
{
    var height = gEmojiEyeHeight * 2;
    var arc = gEmojiR / 7;

    ctx.beginPath();
    ctx.lineJoin = 'miter';
    ctx.moveTo(x, y);
    ctx.arc(x, y + height, arc, 5.75, 3.66, false);
    ctx.closePath();
    ctx.lineWidth = 0;
    ctx.fillStyle = gColorTear;
    ctx.fill();
}

function draw_tear(ctx)
{
    var x = gEmojiCenterX - gEmojiR * 2 / 5 - gEmojiEyeWidth;
    var y = gEmojiCenterY;

    draw_drop(ctx, x, y);
}

function draw_joyful_lips(ctx, joy)
{
    console.log("draw_joyful_lips with joy: ", joy);
    ctx.save();
    ctx.beginPath();

    var offset = (joy * gEmojiR + 0.0) / 3 / 100;
//    console.log("offset: ", offset);

    var startX = gEmojiCenterX - gEmojiR * 3 / 5;
    var startY = gEmojiCenterY + gEmojiR * 2 / 5;

    var arcX1 = startX + gEmojiR / 5;
    var arcY1 = gEmojiCenterY + gEmojiR * 2 / 5;

    if (offset > 0)
    {
        offset *= 1.5;
        arcY1 += offset;
    } else
    {
        offset *= 0.75;
        startY -= offset;
    }


    var endX = gEmojiCenterX + gEmojiR * 3 / 5;
    var endY = startY;

    var arcX2 = endX - gEmojiR / 5;
    var arcY2 = arcY1;

//    console.log("start: ", startX, startY);
//    console.log("end:   ", endX, endY);
//    console.log("arc1: ", arcX1, arcY1);
//    console.log("arc2: ", arcX2, arcY2);

//    console.log("offset: ", offset);

    ctx.moveTo(startX, startY);
    ctx.lineWidth = gLineWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = gColorBrown;

    ctx.bezierCurveTo(arcX1, arcY1, arcX2, arcY2, endX, endY);

    if (joy > 75)
    {
        ctx.lineTo(startX, startY);
        ctx.fillStyle = gColorDarkYellow;
        ctx.fill();
    }

    ctx.stroke();
    ctx.closePath();

    ctx.restore();
}

function ellipse(ctx, cx, cy, rx, ry)
{
    ctx.save();
    ctx.strokeStyle = null;
    ctx.beginPath();
    ctx.translate(cx - rx, cy - ry);
    ctx.scale(rx, ry);
    ctx.arc(1, 1, 1, 0, 2 * Math.PI, false);
    ctx.fill();
    ctx.closePath();
    ctx.restore();
}
