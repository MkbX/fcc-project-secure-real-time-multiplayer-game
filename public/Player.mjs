class Player {
  constructor({x, y, score, id, figure = "😈", speed = 5}) {
    this.x = x;
    this.y = y;
    this.score = score;
    this. id = id;
    this.figure = figure;
    this.speed = speed;

  }

  movePlayer(dir, speed, upPressed, downPressed, leftPressed, rightPressed) {    
    if(upPressed || dir =='up') {
      this.y = this.y - speed;
    }
     if(downPressed || dir =='down') {
      this.y = this.y + speed;
    }
     if(leftPressed || dir =='left') {
      this.x = this.x - speed;
    }
     if(rightPressed || dir =='right') {
      this.x = this.x + speed;
      
    }
    if(this.x < 0) {
      this.x = 0;
    }
    if(this.x > 605) {
      this.x = 605;
    }
    
    if(this.y < 47) {
      this.y = 47;
    }
    if(this.y > 470) {
      this.y = 470;
    } 

  }

   randNum(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  collision(item) {
    if(Math.abs(this.x -item.x) < 15 && Math.abs(this.y -item.y) < 15) {
      this.score += item.points;
      item.x = this.randNum(20, 605);
      item.y = this.randNum(42, 470);
      let sun = this.randNum(2,8);
      if(sun == 7) {
        item.figure = '🌞';
        item.points = 20;
      }
      else {
        item.figure = '🔥';
        item.points = 10;
      }
      return true;    
    }

  }

  calculateRank(arr) {
    console.log(arr);
    let playersSize = arr.length;
    arr.sort((a,b)=>b.score > a.score);
    let rank = arr.map(e=>e.id).indexOf(this.id) + 1;
    return `Rank: ${rank}/${playersSize}`;

  }
}

export default Player;
