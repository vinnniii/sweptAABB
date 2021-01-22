export class Player
{
    x:number;
    y:number;
    w:number;
    h:number;
    dx:number;
    dy:number;
    dxnext:number;
    dynext:number;
    onSolid: boolean;
    //pos: Vec2;
    //dim: Vec2;
    //vel: Vec2;

    constructor(x:number,y:number,w:number,h:number,dx:number,dy:number, /*pos: Vec2, dim: Vec2, vel: Vec2*/)
    {
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