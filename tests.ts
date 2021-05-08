interface iTest {
  name: string
  players: Array<iTestPlayer>;
  walls: Array<iTestWall>
}
interface iTestPlayer {
  x: number,
  y: number,
  dx: number,
  dy: number
}
interface iTestWall {
  x: number,
  y: number,
  w: number,
  h: number
}

export const borderWalls: Array<iTestWall> = [
  { x: 0, y: 0, w: 600, h: 5 },
  { x: 0, y: 595, w: 600, h: 5 },
  { x: 0, y: 0, w: 5, h: 600 },
  { x: 595, y: 0, w: 5, h: 600 },

]
export const tests: Array<iTest> = [
  {
    name: "ThreeGuysColiding",
    players: [
      { x: 40, y: 250, dx: 0.5, dy: 0 },
      { x: 250, y: 10, dx: 0, dy: 0.5 },
      { x: 580, y: 580, dx: -1, dy: -1 }
    ],
    walls: []
  }
]


/*
 {
    name: "ThreeGuysColiding",
    players: [],
    walls: []
  }
*/