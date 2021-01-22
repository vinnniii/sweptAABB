export class Player {
    //pos: Vec2;
    //dim: Vec2;
    //vel: Vec2;
    constructor(x, y, w, h, dx, dy) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.dx = dx;
        this.dy = dy;
        this.dxnext = 0;
        this.dynext = 0;
        this.onSolid = false;
        //this.pos = pos;
        //this.dim = dim;
        //this.vel = vel;
    }
}
