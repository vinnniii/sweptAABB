import { Vec2d } from "./Vec2d.js";

export class Collision {

    obj_1:any;
    obj_2:any;

    normal:Vec2d;
    
    entryTime:number;

    constructor(obj_1:any, obj_2:any, normal:Vec2d, entryTime:number) {

        this.obj_1 = obj_1;
        this.obj_2 = obj_2;

        this.normal = normal;

        this.entryTime = entryTime;


    }

}