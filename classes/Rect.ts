export class Rect
{
    x:number;
    y:number;
    w:number;
    h:number;
    
    constructor(x:number,y:number,w:number,h:number)
    {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }


  log()  {
    console.log("Rect X=" + this.x + " Y=" + this.y + " W=" + this.w + " H=" + this.h, this)
  }
}