function Goal(name) {
  this.o = document.getElementById(name);
}
Goal.blue = new Goal("bluegoal");
Goal.red = new Goal("redgoal");
function Robot(name) {
  this.o = document.getElementById(name);
  this.robots.push(this);
}
Robot.prototype.robots = [];
// returns true if the boxes intersect
function BoxesIntersect(b1, b2) {
  if (b2.x > b1.x + b1.width - 1) {
    return false;
  }
  if (b2.x + b2.width - 1 < b1.x) {
    return false;
  }
  if (b2.y > b1.y + b1.height - 1) {
    return false;
  }
  if (b2.y + b2.height - 1 < b1.y) {
    return false;
  }
  return true;
}
// returns true if the boxes touch but don't necessarily overlap
function BoxesTouching(b1, b2) {
  if (b2.x - 1 > b1.x + b1.width - 1) {
    return false;
  }
  if (b2.x + b2.width < b1.x) {
    return false;
  }
  if (b2.y - 1 > b1.y + b1.height - 1) {
    return false;
  }
  if (b2.y + b2.height < b1.y) {
    return false;
  }
  return true;
}
// returns the first robot that intersects box
// only robots other than "exclude" are considered
// returns null if not found
function HitsRobotExcluding(box, exclude) {
  var robots = Robot.prototype.robots;
  for (var i = 0; i < robots.length; i++) {
    var robot = robots[i];
    if (robot == exclude) {
      continue;
    }
    var b2 = robot.o.getBBox();
    if (!BoxesIntersect(b2, box)) {
      continue;
    }
    return robot;
  }
  return null;
}
// returns the first bounding box of any robot that intersects box
// only robots other than "this" are considered
// returns null if not found
Robot.prototype.HitsRobot = function(box) {
  var r = HitsRobotExcluding(box, this);
  if (r == null) {
    return null;
  }
  console.log(this.o.getAttribute('id') + ' hit ' + 
              r.o.getAttribute('id'));
  return r.o.getBBox();
}
// returns true if the top of this Robot is touching other.
Robot.prototype.touchingUp = function(other) {
  var myBox = this.o.getBBox();
  var otherBox = other.o.getBBox();
  if (myBox.y == otherBox.y + otherBox.height) {
    if (myBox.x > otherBox.x + otherBox.width) {
      return false;
    }
    if (myBox.x < otherBox.x - myBox.width) {
      return false;
    }
    return true;
  }
  return false;
}
// returns true if the left of this Robot is touching other.
Robot.prototype.touchingleft = function(other) {
  var myBox = this.o.getBBox();
  var otherBox = other.o.getBBox();
  if (myBox.x == otherBox.x + otherBox.width) {
    if (myBox.y > otherBox.y + otherBox.height) {
      return false;
    }
    if (myBox.y < otherBox.y - myBox.height) {
      return false;
    }
    return true;
  }
  return false;
}
// returns true if the bottom of this Robot is touching other.
Robot.prototype.touchingDown = function(other) {
  var myBox = this.o.getBBox();
  var otherBox = other.o.getBBox();
  if (myBox.y == otherBox.y - myBox.height) {
    if (myBox.x > otherBox.x + otherBox.width) {
      return false;
    }
    if (myBox.x < otherBox.x - myBox.width) {
      return false;
    }
    return true;
  }
  return false;
}
// returns true if the right of this Robot is touching other.
Robot.prototype.touchingRight = function(other) {
  var myBox = this.o.getBBox();
  var otherBox = other.o.getBBox();
  if (myBox.x == otherBox.x - myBox.width) {
    if (myBox.y > otherBox.y + otherBox.height) {
      return false;
    }
    if (myBox.y < otherBox.y - myBox.height) {
      return false;
    }
    return true;
  }
  return false;
}
Robot.prototype.up = function() {
  var amount_to_move = 10;
  var myBox = this.o.getBBox();
  var baseline_correction = parseInt(this.o.getAttribute('y')) - myBox.y;
  myBox.y -= amount_to_move;
  if (myBox.y < 0) {
    myBox.y = 0;
  }
  var b2 = this.HitsRobot(myBox);
  if (b2 != null) {
    myBox.y = b2.y + b2.height;
  }
  var ballBox = BALL.up(this, myBox);
  if (ballBox != null) {
    myBox.y = ballBox.y + ballBox.height;
  }
  this.o.setAttribute('y', myBox.y + baseline_correction);
}
Robot.prototype.down = function() {
  var amount_to_move = 10;
  var myBox = this.o.getBBox();
  var baseline_correction = parseInt(this.o.getAttribute('y')) - myBox.y;
  myBox.y += amount_to_move;
  if (myBox.y + myBox.height > {{ game_height }}) {
    myBox.y = {{ game_height }} - myBox.height;
  }
  b2 = this.HitsRobot(myBox);
  if (b2 != null) {
    myBox.y = b2.y - myBox.height;
  }
  var ballBox = BALL.down(this, myBox);
  if (ballBox != null) {
    myBox.y = ballBox.y - myBox.height;
  }
  this.o.setAttribute('y', myBox.y + baseline_correction);
}
Robot.prototype.left = function() {
  var amount_to_move = 10;
  var myBox = this.o.getBBox();
  myBox.x -= amount_to_move;
  if (myBox.x < 0) {
    myBox.x = 0;
  }
  b2 = this.HitsRobot(myBox);
  if (b2 != null) {
    myBox.x = b2.x + b2.width;
  }
  var ballBox = BALL.left(this, myBox);
  if (ballBox != null) {
    myBox.x = ballBox.x + ballBox.width;
  }
  this.o.setAttribute('x', myBox.x);
}
Robot.prototype.right = function() {
  var amount_to_move = 10;
  var myBox = this.o.getBBox();
  myBox.x += amount_to_move;
  if (myBox.x + myBox.width > {{ game_width }}) {
    myBox.x = {{ game_width }} - myBox.width;
  }
  b2 = this.HitsRobot(myBox);
  if (b2 != null) {
    myBox.x = b2.x - myBox.width;
  }
  var ballBox = BALL.right(this, myBox);
  if (ballBox != null) {
    myBox.x = ballBox.x - myBox.width;
  }
  this.o.setAttribute('x', myBox.x);
}
// Note: this works because we never set the position with the values
// returned from here (otherwise it would be missing baseline_correction.
// This is only for comparison to other locations.
Robot.prototype.getLocation = function() {
  return this.o.getBBox();
}
function Ball() {
  this.o = document.getElementById('O');
}
Ball.prototype.getLocation = function() {
  return this.o.getBBox();
}
var BALL = new Ball();
// Tell the ball robot wants to move to newRobotBox so the ball can move.
// returns the (possibly new) bounding box of the ball if it blocks motion.
// returns null if the ball is not in the way or moves freely.
Ball.prototype.up = function(robot, newRobotBox) {
  var ballBox = this.o.getBBox();
  var baseline_correction = parseInt(this.o.getAttribute('y')) - ballBox.y;
  if (!BoxesIntersect(ballBox, newRobotBox)) {
    return null;
  }
  console.log(robot.o.getAttribute('id') + ' hit the ball');
  // move ballBox up
  ballBox.y = newRobotBox.y - ballBox.height;
  if (ballBox.y < 0) {
    ballBox.y = 0;
  }
  var r2 = HitsRobotExcluding(ballBox, robot);
  if (r2 != null) {
    ballBox.y = r2.o.getBBox().y + r2.o.getBBox().height;
  }
  this.o.setAttribute('y', ballBox.y + baseline_correction)
  if (ballBox.y != newRobotBox.y - ballBox.height) {
    return ballBox;
  }
  return null;
}
// Tell the ball robot wants to move to newRobotBox so the ball can move.
// returns the (possibly new) bounding box of the ball if it blocks motion.
// returns null if the ball is not in the way or moves freely.
Ball.prototype.down = function(robot, newRobotBox) {
  var ballBox = this.o.getBBox();
  var baseline_correction = parseInt(this.o.getAttribute('y')) - ballBox.y;
  if (!BoxesIntersect(ballBox, newRobotBox)) {
    return null;
  }
  console.log(robot.o.getAttribute('id') + ' hit the ball');
  // move ballBox down
  ballBox.y = newRobotBox.y + newRobotBox.height;
  if (ballBox.y + ballBox.height > {{ game_height }}) {
    ballBox.y = {{ game_height }} - ballBox.height;
  }
  var r2 = HitsRobotExcluding(ballBox, robot);
  if (r2 != null) {
    ballBox.y = r2.o.getBBox().y - ballBox.height;
  }
  this.o.setAttribute('y', ballBox.y + baseline_correction)
  if (ballBox.y != newRobotBox.y + newRobotBox.height) {
    return ballBox;
  }
  return null;
}
// Tell the ball robot wants to move to newRobotBox so the ball can move.
// returns the (possibly new) bounding box of the ball if it blocks motion.
// returns null if the ball is not in the way or moves freely.
Ball.prototype.left = function(robot, newRobotBox) {
  var ballBox = this.o.getBBox();
  if (!BoxesIntersect(ballBox, newRobotBox)) {
    return null;
  }
  console.log(robot.o.getAttribute('id') + ' hit the ball');
  // move ballBox left
  ballBox.x = newRobotBox.x - ballBox.width;
  if (ballBox.x < 0) {
    ballBox.x = 0;
  }
  var r2 = HitsRobotExcluding(ballBox, robot);
  if (r2 != null) {
    ballBox.x = r2.o.getBBox().x + r2.o.getBBox().width;
  }
  this.o.setAttribute('x', ballBox.x)
  if (ballBox.x != newRobotBox.x - ballBox.width) {
    return ballBox;
  }
  return null;
}
// Tell the ball robot wants to move to newRobotBox so the ball can move.
// returns the (possibly new) bounding box of the ball if it blocks motion.
// returns null if the ball is not in the way or moves freely.
Ball.prototype.right = function(robot, newRobotBox) {
  var ballBox = this.o.getBBox();
  if (!BoxesIntersect(ballBox, newRobotBox)) {
    return null;
  }
  console.log(robot.o.getAttribute('id') + ' hit the ball');
  // move ballBox right
  ballBox.x = newRobotBox.x + newRobotBox.width;
  if (ballBox.x + ballBox.width > {{ game_width }}) {
    ballBox.x = {{ game_width }} - ballBox.width;
  }
  var r2 = HitsRobotExcluding(ballBox, robot);
  if (r2 != null) {
    ballBox.x = r2.o.getBBox().x - ballBox.width;
  }
  this.o.setAttribute('x', ballBox.x)
  if (ballBox.x != newRobotBox.x + newRobotBox.width) {
    return ballBox;
  }
  return null;
}

var humanMoveQueue = [];

document.onkeydown = function (e) {
  e = e || window.event;
  humanMoveQueue[0] = e['keyIdentifier'];
  return false;
};
function humanUpdate() {
  var move = humanMoveQueue.shift();
  if (move == "Up") {
    this.up();
  }
  if (move == "Down") {
    this.down();
  }
  if (move == "Left") {
    this.left();
  }
  if (move == "Right") {
    this.right();
  }
}
