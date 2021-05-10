export class Rect {
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }
    log() {
        console.log("Rect X=" + this.x + " Y=" + this.y + " W=" + this.w + " H=" + this.h, this);
    }
}
