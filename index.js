const canvas = document.querySelector("canvas");

const c = canvas.getContext("2d");

console.log(gsap);
canvas.width = innerWidth;
canvas.height = innerHeight;

const scoreNumber = document.getElementById("scoreNumber");
const startGame = document.getElementById("startGame");
const startWindow = document.getElementById("startWindow");
const endScore = document.getElementById("endScore");

// here I define the player class *****************

class Player {
  constructor(x, y, radius, color) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
  }

  render() {
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.fillStyle = this.color;
    c.fill();
  }
}
// In here I define the projectiles

class Projectile {
  constructor(x, y, radius, color, velocity) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = velocity;
  }
  render() {
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.fillStyle = this.color;
    c.fill();
  }

  update() {
    this.render();
    this.x = this.x + this.velocity.x;
    this.y = this.y + this.velocity.y;
  }
}

//  In here I define the Enemyes

class Enemy {
  constructor(x, y, radius, color, velocity) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = velocity;
  }
  render() {
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.fillStyle = this.color;
    c.fill();
  }

  update() {
    this.render();
    this.x = this.x + this.velocity.x;
    this.y = this.y + this.velocity.y;
  }
}
// particle constructor
const friction = 0.98;
class Particle {
  constructor(x, y, radius, color, velocity) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = velocity;
    this.alpha = 1;
  }
  render() {
    c.save();
    c.globalAlpha = this.alpha;
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.fillStyle = this.color;
    c.fill();
    c.restore();
  }

  update() {
    this.render();
    this.velocity.x *= friction;
    this.velocity.y *= friction;
    this.x = this.x + this.velocity.x;
    this.y = this.y + this.velocity.y;
    this.alpha -= 0.01;
  }
}

// Here I assign the propieties to the player******************************

const x = canvas.width / 2;
const y = canvas.height / 2;

const projectile = new Projectile(
  canvas.width / 2,
  canvas.height / 2,
  5,
  "white",
  { x: 1, y: 1 }
);
// creation of the projectiles

const projectile2 = new Projectile(
  canvas.width / 2,
  canvas.height / 2,
  5,
  "green",
  { x: -1, y: -1 }
);

//arrays of entities*********************************************
let player = new Player(x, y, 30, "white");
let projectiles = [];
let enemies = [];
let particles = [];

function init() {
  player = new Player(x, y, 30, "white");
  projectiles = [];
  enemies = [];
  particles = [];
  score = 0;
  scoreNumber.innerHTML = score;
  endScore.innerHTML = score;
}

function spawnEnemies() {
  setInterval(() => {
    const radius = Math.random() * (50 - 8) + 8;

    let x;
    let y;

    if (Math.random() < 0.5) {
      x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius;
      y = Math.random() * canvas.height;
    } else {
      x = Math.random() * canvas.width;
      y = Math.random() < 0.5 ? 0 - radius : canvas.width + radius;
    }

    const color = `rgb(${Math.random() * 264},${Math.random() * 264},${
      Math.random() * 264
    })`;

    const angle = Math.atan2(canvas.height / 2 - y, canvas.width / 2 - x);

    const velocity = {
      x: Math.cos(angle),
      y: Math.sin(angle),
    };
    enemies.push(new Enemy(x, y, radius, color, velocity));
    console.log(color);
  }, 1000);
}

let animationID;
let score = 0;

function animate() {
  animationID = requestAnimationFrame(animate);
  c.fillStyle = "rgb(0,0,0,0.35)";
  c.fillRect(0, 0, canvas.width, canvas.height);
  player.render();
  particles.forEach((particle, index) => {
    if (particle.alpha <= 0) {
      particles.splice(index, 1);
    } else {
      Particle.update;
    }
    particle.update();
  });
  projectiles.forEach((projectile, index3) => {
    projectile.update();

    if (
      projectile.x + projectile.radius < 0 ||
      projectile.x - projectile.radius > canvas.width ||
      projectile.y + projectile.radius < 0 ||
      projectile.y - projectile.radius > canvas.height
    ) {
      setTimeout(() => {
        projectiles.splice(index3, 1);
      });
    }
  });
  enemies.forEach((enemy, index) => {
    enemy.update();

    //end game set********************************************************************

    const dist = Math.hypot(player.x - enemy.x, player.y - enemy.y);
    if (dist - enemy.radius - player.radius < 1) {
      console.log("game over");
      cancelAnimationFrame(animationID);
      startWindow.style.display = "flex";
      endScore.innerHTML = score;
    }

    projectiles.forEach((projectile, index2) => {
      const dist = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y);

      //PARTICLE effect ************************************************************

      if (dist - projectile.radius - enemy.radius < 1) {
        const particleSize = Math.random() * 2;
        for (let i = 0; i < 30; i++) {
          particles.push(
            new Particle(
              projectile.x,
              projectile.y,
              particleSize,
              enemy.color,
              {
                x: Math.random() - 0.5 * (Math.random() * 5),
                y: Math.random() - 0.5 * (Math.random() * 10),
              }
            )
          );
        }

        if (enemy.radius > 30) {
          score += 100;
          scoreNumber.innerHTML = score;
          gsap.to(enemy, {
            radius: enemy.radius - 10,
          });

          setTimeout(() => {
            projectiles.splice(index2, 1);
          });
        } else {
          score += 300;
          scoreNumber.innerHTML = score;
          setTimeout(() => {
            enemies.splice(index, 1);
            projectiles.splice(index2, 1);
          });
          console.log("touched");
        }
      }
    });
  });
}

window.addEventListener("click", (e) => {
  console.log(projectiles);
  const angle = Math.atan2(
    e.clientY - canvas.height / 2,
    e.clientX - canvas.width / 2
  );

  const velocity = { x: Math.cos(angle) * 4, y: Math.sin(angle) * 4 };
  console.log(angle);
  projectiles.push(
    new Projectile(canvas.width / 2, canvas.height / 2, 5, "white", velocity)
  );
});

startGame.addEventListener("click", () => {
  init();
  animate();
  spawnEnemies();
  startWindow.style.display = "none";
});
