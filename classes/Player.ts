export class Player {
  x: number;
  y: number;
  w: number;
  h: number;
  dx: number;
  dy: number;

  remainingTime: number;

  initialDx: number;
  initialDy: number;

  dxnext: number;
  dynext: number;
  onSolid: boolean;
  col_r: boolean;
  col_l: boolean;
  col_u: boolean;
  col_d: boolean;
  //pos: Vec2;
  //dim: Vec2;
  //vel: Vec2;

  constructor(x: number, y: number, w: number, h: number, dx: number, dy: number, /*pos: Vec2, dim: Vec2, vel: Vec2*/) {
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
}