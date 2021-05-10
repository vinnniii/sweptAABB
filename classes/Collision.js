export class Collision {
    constructor(obj_1, obj_2, normal, entryTime) {
        this.obj_1 = obj_1;
        this.obj_2 = obj_2;
        this.normal = normal;
        this.entryTime = entryTime;
    }
    log() {
        console.log("COLLISION Entry-Time=" + this.entryTime);
        this.obj_1.log();
        this.obj_2.log();
    }
}
