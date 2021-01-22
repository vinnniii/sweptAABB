export class CollisionObject
{
    x:number;
    y:number;
    w:number;
    h:number;
    dx:number;
    dy:number;

    constructor(x:number,y:number,w:number,h:number,dx:number,dy:number)
    {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.dx = dx;
        this.dy = dy;
    }
}
