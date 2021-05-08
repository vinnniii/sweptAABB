import { Player } from "./classes/Player.js";
import { Rect } from "./classes/Rect.js";
import { Vec2d } from "./classes/Vec2d.js";
import { CollisionObject } from "./classes/CollisionObject.js";
import { Collision } from "./classes/Collision.js";
/*function signum(x: number): number {
    return x > 0 ? 1 : x < 0 ? -1 : 0
}*/
function aabb_overlap(b1, b2) {
    if (b1.x < b2.x + b2.w && b1.x + b1.w > b2.x && b1.y < b2.y + b2.h && b1.y + b1.h > b2.y)
        return 1;
    return 0;
}
export function create_broadphasebox(player) {
    let broadphasebox = new Rect(0, 0, 0, 0);
    broadphasebox.x = player.dx > 0 ? player.x : player.x + player.dx;
    broadphasebox.y = player.dy > 0 ? player.y : player.y + player.dy;
    broadphasebox.w = player.dx > 0 ? player.dx + player.w : player.w - player.dx;
    broadphasebox.h = player.dy > 0 ? player.dy + player.h : player.h - player.dy;
    return broadphasebox;
}
function swept_AABB(b1, b2) {
    let entry_x, entry_y;
    let exit_x, exit_y;
    // Find the distance between the objects sides on the near and far sides for both x and y 
    if (b1.dx > 0) {
        entry_x = b2.x - (b1.x + b1.w);
        exit_x = (b2.x + b2.w) - b1.x;
    }
    else {
        entry_x = (b2.x + b2.w) - b1.x;
        exit_x = b2.x - (b1.x + b1.w);
    }
    if (b1.dy > 0) {
        entry_y = b2.y - (b1.y + b1.h);
        exit_y = (b2.y + b2.h) - b1.y;
    }
    else {
        entry_y = (b2.y + b2.h) - b1.y;
        exit_y = b2.y - (b1.y + b1.h);
    }
    // Find scalar for collision ("time")
    let entry_scalar_x, entry_scalar_y;
    let exit_scalar_x, exit_scalar_y;
    if (b1.dx === 0) {
        entry_scalar_x = -Infinity;
        exit_scalar_x = Infinity;
    }
    else {
        entry_scalar_x = entry_x / b1.dx;
        exit_scalar_x = exit_x / b1.dx;
    }
    if (b1.dy === 0) {
        entry_scalar_y = -Infinity;
        exit_scalar_y = Infinity;
    }
    else {
        entry_scalar_y = entry_y / b1.dy;
        exit_scalar_y = exit_y / b1.dy;
    }
    if (isNaN(entry_scalar_x) || isNaN(exit_scalar_x) || isNaN(entry_scalar_y) || isNaN(exit_scalar_y))
        return null;
    let entryTime = Math.max(entry_scalar_x, entry_scalar_y);
    let exitTime = Math.min(exit_scalar_x, exit_scalar_y);
    // No collision test
    if (entryTime > exitTime || entry_scalar_x < 0 && entry_scalar_y < 0 || entryTime > 1 || entryTime < 0)
        return null;
    // collision normal
    let normal = new Vec2d(0, 0);
    if (entry_scalar_x > entry_scalar_y) {
        if (entry_x < 0) {
            normal.x = 1;
            normal.y = 0;
        }
        else {
            normal.x = -1;
            normal.y = 0;
        }
    }
    else {
        if (entry_y < 0) {
            normal.x = 0;
            normal.y = 1;
        }
        else {
            normal.x = 0;
            normal.y = -1;
        }
    }
    return { normal: normal, entryTime: entryTime };
}
function swept_AABB_dynamic(p1, p2) {
    let rel_vel_dx = p2.dx - p1.dx;
    let rel_vel_dy = p2.dy - p1.dy;
    let testObjDynamic = new CollisionObject(p2.x, p2.y, p2.w, p2.h, rel_vel_dx, rel_vel_dy);
    let testObjStatic = new CollisionObject(p1.x, p1.y, p1.w, p1.h, 0, 0);
    let collision = swept_AABB(testObjDynamic, testObjStatic);
    return collision;
}
function get_collisions(players, player, rects) {
    let collisions = [];
    let box_i = create_broadphasebox(player);
    for (let i = 0; i < rects.length; i++) {
        if (aabb_overlap(box_i, rects[i])) {
            let collision = swept_AABB(player, rects[i]);
            if (collision) {
                let c = new Collision(player, rects[i], collision.normal, collision.entryTime);
                collisions.push(c);
            }
        }
    }
    for (let j = 0; j < players.length; j++) {
        let box_j = create_broadphasebox(players[j]);
        if (aabb_overlap(box_i, box_j)) {
            let collision = swept_AABB_dynamic(player, players[j]);
            if (collision) {
                let c = new Collision(player, players[j], collision.normal, collision.entryTime);
                collisions.push(c);
            }
        }
    }
    return collisions;
}
function resolve_collision(collision) {
    let r_time = 1 - collision.entryTime;
    if (collision.obj_1 instanceof Player && collision.obj_2 instanceof Player) {
        collision.obj_1.remainingTime -= r_time;
        let dx1 = collision.obj_1.dx;
        let dx2 = collision.obj_2.dx;
        let dy1 = collision.obj_1.dy;
        let dy2 = collision.obj_2.dy;
        collision.obj_1.x -= collision.obj_1.dx * r_time;
        collision.obj_1.y -= collision.obj_1.dy * r_time;
        collision.obj_2.x -= collision.obj_2.dx * r_time;
        collision.obj_2.y -= collision.obj_2.dy * r_time;
        collision.obj_1.dx = dx2;
        collision.obj_1.dy = dy2;
        collision.obj_2.dx = dx1;
        collision.obj_2.dy = dy1;
    }
    else if (collision.obj_1 instanceof Player && collision.obj_2 instanceof Rect) {
        if (collision.normal.x != 0)
            collision.obj_1.dx -= collision.obj_1.dx * r_time;
        if (collision.normal.y != 0)
            collision.obj_1.dy -= collision.obj_1.dy * r_time;
    }
    else {
        throw ("resolve_collision  need to players or a player and a rect");
    }
}
function adjust_velocity(collision) {
    if (collision.obj_1 instanceof Player && collision.obj_2 instanceof Player) {
        let tempx = (collision.obj_1.dx + collision.obj_2.dx) / 2, tempy = (collision.obj_1.dy + collision.obj_2.dy) / 2;
        collision.obj_1.dx = tempx;
        collision.obj_1.dy = tempy;
        collision.obj_2.dx = tempx;
        collision.obj_2.dy = tempy;
    }
}
export function handle_collision(players, player, rects, index) {
    let collisions = get_collisions(players, player, rects);
    if (collisions.length > 0) {
        collisions.sort((a, b) => (a.entryTime < b.entryTime ? -1 : 1));
        resolve_collision(collisions[0]);
        handle_collision(players, player, rects, index);
    }
}
export function handle_collision_recursive(players, player, rects, collider) {
    let collisions = get_collisions(players, player, rects);
    if (collisions.length == 0)
        return;
    collisions.sort((a, b) => (a.entryTime < b.entryTime ? -1 : 1));
    if (collisions[0].obj_2 instanceof Player) {
        // Test Collision with other Dynamic Object first before resolution.
        if (collisions[0].obj_2 === collider)
            resolve_collision(collisions[0]);
        else
            handle_collision_recursive(players, collisions[0].obj_2, rects, player);
    }
    else {
        resolve_collision(collisions[0]);
    }
    handle_collision_recursive(players, player, rects, null);
}
export function game_collision(players, rects) {
    for (let i = 0; i < players.length; i++) {
        //handle_collision(players, players[i], rects, i + 1);
        handle_collision_recursive(players, players[i], rects, null);
    }
}
