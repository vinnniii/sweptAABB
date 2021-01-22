import { Player } from "./classes/Player.js";
import { Rect } from "./classes/Rect.js";
import { Vec2d } from "./classes/Vec2d.js";
import { CollisionObject } from "./classes/CollisionObject.js";
import { players } from "./script.js"; 


interface iStaticCollisonObj
{
    x:number;
    y:number;
    w:number;
    h:number;
    //dx ? : number;
}

interface iDynamicCollisonObj extends iStaticCollisonObj
{
    dx:number;
    dy:number; 
}

function signum(x: number): number {
    return x > 0 ? 1 : x < 0 ? -1 : 0
}

function GetSweptBroadphaseBox(player: iDynamicCollisonObj): Rect 
{ 
    let broadphasebox:Rect = new Rect(0,0,0,0); 

    broadphasebox.x = player.dx > 0 ? player.x : player.x + player.dx;  
    broadphasebox.y = player.dy > 0 ? player.y : player.y + player.dy;  
    broadphasebox.w = player.dx > 0 ? player.dx + player.w : player.w - player.dx;  
    broadphasebox.h = player.dy > 0 ? player.dy + player.h : player.h - player.dy;  

    return broadphasebox; 
}

function sweptAABB(b1: iDynamicCollisonObj, b2: iStaticCollisonObj): {normal: Vec2d, entryTime: number} | null
{
    let entry_x:number, entry_y:number; 
    let exit_x:number, exit_y:number; 

    // Find the distance between the objects sides on the near and far sides for both x and y 
    if (b1.dx > 0) 
    { 
        entry_x = b2.x - (b1.x + b1.w);  
        exit_x = (b2.x + b2.w) - b1.x;
    }
    else 
    { 
        entry_x = (b2.x + b2.w) - b1.x;  
        exit_x = b2.x - (b1.x + b1.w);  
    } 

    if (b1.dy > 0) 
    { 
        entry_y = b2.y - (b1.y + b1.h);  
        exit_y = (b2.y + b2.h) - b1.y;  
    }
    else 
    { 
        entry_y = (b2.y + b2.h) - b1.y;  
        exit_y = b2.y - (b1.y + b1.h);  
    }

    // Find scalar for collision ("time")
    let entry_scalar_x:number, entry_scalar_y:number;
    let exit_scalar_x:number, exit_scalar_y:number;

    if(b1.dx === 0)
    {
        entry_scalar_x = - Infinity;
        exit_scalar_x = Infinity;
    }
    else
    {
        entry_scalar_x = entry_x / b1.dx;
        exit_scalar_x = exit_x / b1.dx;
    }

    if(b1.dy === 0)
    {
        entry_scalar_y = -Infinity;
        exit_scalar_y = Infinity;
    }
    else
    {
        entry_scalar_y = entry_y / b1.dy;
        exit_scalar_y = exit_y / b1.dy;
    }

    if(isNaN(entry_scalar_x) || isNaN(exit_scalar_x) || isNaN(entry_scalar_y) || isNaN(exit_scalar_y)) return null;
    

    let entryTime = Math.max(entry_scalar_x, entry_scalar_y);
    let exitTime = Math.min(exit_scalar_x, exit_scalar_y);

    // No collision test
    if (entryTime > exitTime || entry_scalar_x < 0 && entry_scalar_y < 0 || entryTime  > 1 || entryTime < 0) 
        return null;


    // collision normal
    let normal: Vec2d = new Vec2d(0, 0);



    
    if(entry_scalar_x > entry_scalar_y)
    {
        if(entry_x < 0)
        {
            normal.x = 1;
            normal.y = 0;
        }
        else
        {
            normal.x = -1;
            normal.y = 0;
        }
    }
    else
    {
        if(entry_y < 0)
        { 
            normal.x = 0;
            normal.y = 1;
        }
        else
        {
            normal.x = 0;
            normal.y = -1;
        }
    }
    
    return {normal: normal, entryTime: entryTime};

}

function resolveCollision(player: Player, normal: Vec2d, entryTime: number)
{

    if(normal.x != 0) player.dx -= player.dx * (1 - entryTime);
    if(normal.y != 0) player.dy -= player.dy * (1 - entryTime);

    //player.dx += normal.x * Math.abs(player.dx) * (1 - entryTime);
    //player.dy += normal.y * Math.abs(player.dy) * (1 - entryTime);
    
    
}

export function collisionHandlerStatic(player: Player, rects: Array<Rect>)
{
    // Optimization
    let rects_to_check: Array<Rect> = [];
    
    let check_box = GetSweptBroadphaseBox(player);

    for(const rect of rects)
    {
        if(check_box.x < rect.x + rect.w && check_box.x + check_box.w > rect.x && 
            check_box.y < rect.y + rect.h && check_box.y + check_box.h > rect.y)
        {
            rects_to_check.push(rect);
        }
    }
    
    // No collisions possible
    if(rects_to_check.length === 0) return;

    // Add collision to array
    let arr: Array<{index: number, entryTime: number}> = [];
    let index = 0;

    for(const rect of rects_to_check)
    {
        let collision = sweptAABB(player, rect);

        if(collision) arr.push({index: index, entryTime: collision.entryTime});

        index++;
    }

    // No collisions
    if(arr.length === 0) return;

    // Sort by distance
    arr.sort(function(a, b)
    {
        return a.entryTime - b.entryTime;
    });

    if(arr.length > 1) console.log(rects_to_check[arr[0].index], rects_to_check[arr[1].index]);
    
    // resolve 

    if(arr)
    {
        console.log(arr.length);
        
        for(let i = 0; i < arr.length; i++)
        {
            let collision = sweptAABB(player, rects_to_check[arr[i].index]);

            if(collision) 
            {   
                resolveCollision(player, collision.normal, collision.entryTime); 
                
                if(collision.normal.x === 0 && collision.normal.y === -1) player.onSolid = true;
            }

        };


    }

    return;

}

function resolveCollisionDynamic(p1: Player, p2: Player, normal: Vec2d, entryTime: number)
{
    let rTime:number = 1 - entryTime;
 
    // Update location

    p1.x -= p1.dx * rTime; p1.y -= p1.dy * rTime;

    p2.y -= p2.dy * rTime; p2.x -= p2.dx * rTime;

    
    // New velocity

    let tempx = (p1.dx + p2.dx) / 2, tempy = (p1.dy + p2.dy) / 2;

    p1.dx = tempx; p1.dy = tempy;

    p2.dx = tempx; p2.dy = tempy;
    

}

export function sweptAABBDynamic(p1: Player, p2: Player)
{
    let rel_vel_dx = p2.dx - p1.dx;
    let rel_vel_dy = p2.dy - p1.dy;

    let testObjDynamic = new CollisionObject(p2.x, p2.y, p2.w, p2.h, rel_vel_dx, rel_vel_dy);

    let testObjStatic = new CollisionObject(p1.x, p1.y, p1.w, p1.h,0,0);

    let collision = sweptAABB(testObjDynamic, testObjStatic);

    if(collision)
        resolveCollisionDynamic(p1, p2, collision.normal, collision.entryTime);
}

function collisionHandlerDynamic(p1: any)
{
    let check_box = GetSweptBroadphaseBox(p1);
    // Player player collisions

    for(const p2 of players)
    {
        if(p1 == p2) continue;

        let check_box2 = GetSweptBroadphaseBox(p2);

        if(check_box.x < check_box2.x + check_box2.w && check_box.x + check_box.w > check_box2.x && 
            check_box.y < check_box2.y + check_box2.h && check_box.y + check_box.h > check_box2.y)
        {
            console.log("AAAA");
            let rel_vel_dx = p2.dx - p1.dx;
            let rel_vel_dy = p2.dy - p1.dy;
        
            let testObjDynamic = new CollisionObject(p2.x, p2.y, p2.w, p2.h, rel_vel_dx, rel_vel_dy);

            let collision = sweptAABB(testObjDynamic, p2);

            if(collision) console.log("aa");

            if(collision)
                resolveCollisionDynamic(p1, p2, collision.normal, collision.entryTime);
        }
    }
}