class Collectible {
  constructor({x, y, points, figure = "🔥", id}) {
    this.x = x;
    this.y = y;
    this.points = points;
    this.figure = figure;
    this.id = id;

  }

}

/*
  Note: Attempt to export this for use
  in server.js
*/
try {
  module.exports = Collectible;
} catch(e) {}

export default Collectible;
