export class Vec2 {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    add(v) {
        let u = this;
        u.x += v.x;
        u.y += v.y;
        return u;
    }
    sub(v) {
        let u = this;
        u.x -= v.x;
        u.y -= v.y;
        return u;
    }
    length() {
        return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
    }
    mult(v) {
        let u = this;
        u.x *= v.x;
        u.y *= v.y;
        return u;
    }
    scalar(l) {
        let u = this;
        u.x *= l;
        u.y *= l;
        return u;
    }
    normalize() {
        let u = this;
        let l = u.length();
        u = u.scalar(l);
        return u;
    }
}
