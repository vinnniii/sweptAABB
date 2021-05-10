export class Player {
    //pos: Vec2;
    //dim: Vec2;
    //vel: Vec2;
    constructor(nr, x, y, w, h, dx, dy) {
        this.nr = nr;
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.dx = this.initialDx = dx;
        this.dy = this.initialDy = dy;
        this.remainingTime = 1;
        this.dxnext = 0;
        this.dynext = 0;
        this.onSolid = false;
        this.col_d = false;
        this.col_l = false;
        this.col_r = false;
        this.col_u = false;
        //this.pos = pos;
        //this.dim = dim;
        //this.vel = vel;
    }
    log() {
        console.log("Player #" + this.nr, " X=" + this.x + " Y=" + this.y + " DX=" + this.dx + " DY=" + this.dy, this);
    }
}
