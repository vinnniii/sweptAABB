export const borderWalls = [
    { x: 0, y: 0, w: 600, h: 5 },
    { x: 0, y: 595, w: 600, h: 5 },
    { x: 0, y: 0, w: 5, h: 600 },
    { x: 595, y: 0, w: 5, h: 600 },
];
export const tests = [
    {
        name: "ThreeGuysColiding",
        players: [
            { x: 40, y: 250, dx: 0.5, dy: 0 },
            { x: 250, y: 10, dx: 0, dy: 0.5 },
            { x: 580, y: 580, dx: -1, dy: -1 }
        ],
        walls: []
    }
];
/*
 {
    name: "ThreeGuysColiding",
    players: [],
    walls: []
  }
*/ 
