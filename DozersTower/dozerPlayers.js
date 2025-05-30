// dozerPlayers.js — cleaned and fixed fully

class Dozer {
  constructor({ context }) {
    this.context = context;
    this.velocity = { x: 0, y: 0 };
    this.rotation = 0;
    this.opacity = 1;
    this.isLoaded = false;
    const image = new Image();
    image.src = '/js/games/DozersTower/assets/dozeyNorm.png';

    const atkImg = new Image();
    atkImg.src = '/js/games/DozersTower/assets/dozeyAttack.png';

this.image = image;
this.defaultImage = image;
this.attackImage = atkImg;


    image.onload = () => {
      const c = this.context.canvas;
      const scale = 0.15;
      this.image = image;
      this.width = image.width * scale;
      this.height = image.height * scale;
      if (!this.position) {
        this.position = {
          x: 20, // bottom left start
          y: c.height - this.height - 20
        };
      }
      this.isLoaded = true;
    };
  }

  rotateImage() {
    const c = this.context;
    c.translate(this.position.x + this.width / 2, this.position.y + this.height / 2);
    c.rotate(this.rotation);
    c.translate(-this.position.x - this.width / 2, -this.position.y - this.height / 2);
  }
  triggerAttackAnimation() {
  if (this.isAttacking) return; // prevent re-triggering during cooldown

  this.isAttacking = true;
  this.image = this.attackImage;

  setTimeout(() => {
    this.image = this.defaultImage;
    this.isAttacking = false;
  }, 250); // 3 seconds
}


  draw() {
    if (!this.isLoaded) return;
    const c = this.context;
    c.save();
    c.globalAlpha = this.opacity;

    const facingLeft = this.velocity.x < 0;
    const scaleX = facingLeft ? 1 : -1;

    // Flip horizontally based on direction
    c.translate(this.position.x + this.width / 2, this.position.y + this.height / 2);
    c.scale(scaleX, 1);
    c.globalAlpha = this.opacity;
    this.rotateImage();
    c.drawImage(this.image, -this.width / 2, -this.height / 2, this.width, this.height);
    c.restore();
  }

  updateLocation() {
    if (!this.isLoaded) return;
    this.draw();
    this.position.x += this.velocity.x;
  }
}
class Enemy {
  constructor({ context }) {
    this.context = context;
    this.velocity = { x: 0, y: 0 };
    this.rotation = 0;
    this.opacity = 1;
    this.isLoaded = false;
    const image = new Image();
    image.src = '/js/games/hemisHunt/assets/kawaii_chick.png';
    image.onload = () => {
      const c = this.context.canvas;
      const scale = 0.15;
      this.image = image;
      this.width = image.width * scale;
      this.height = image.height * scale;
      if (!this.position) {
        this.position = {
          x: 20, // bottom left start
          y: c.height - this.height - 20
        };
      }
      this.isLoaded = true;
    };
  }

  rotateImage() {
    const c = this.context;
    c.translate(this.position.x + this.width / 2, this.position.y + this.height / 2);
    c.rotate(this.rotation);
    c.translate(-this.position.x - this.width / 2, -this.position.y - this.height / 2);
  }

  draw() {
    if (!this.isLoaded) return;
    const c = this.context;
    c.save();
    c.globalAlpha = this.opacity;

    const facingLeft = this.velocity.x < 0;
    const scaleX = facingLeft ? 1 : -1;

    // Flip horizontally based on direction
    c.translate(this.position.x + this.width / 2, this.position.y + this.height / 2);
    c.scale(scaleX, 1);
    c.globalAlpha = this.opacity;
    this.rotateImage();
    c.drawImage(this.image, -this.width / 2, -this.height / 2, this.width, this.height);
    c.restore();
  }

  updateLocation() {
    if (!this.isLoaded) return;
    this.draw();
    this.position.x += this.velocity.x;
  }
}
class Particle {
  constructor({ context, position, velocity, radius, color, fades }) {
    this.context = context;
    this.position = position;
    this.velocity = velocity;
    this.radius = radius;
    this.color = color;
    this.opacity = 1;
    this.fades = fades;
  }

  draw() {
    const c = this.context;
    c.save();
    c.globalAlpha = this.opacity;
    c.beginPath();
    c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
    c.fillStyle = this.color;
    c.fill();
    c.closePath();
    c.restore();
  }

  update() {
    this.draw();
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
    if (this.fades) this.opacity -= 0.01;
  }
}

class projectile {
  constructor({ context, position, velocity }) {
    this.context = context;
    this.position = position;
    this.velocity = velocity;
    this.radius = 4;
  }

  draw() {
    const c = this.context;
    c.beginPath();
    c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
    c.fillStyle = 'red';
    c.fill();
    c.closePath();
  }

  update() {
    this.draw();
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
  }
}

class invaderProjectile {
  constructor({ context, position, velocity }) {
    this.context = context;
    this.position = position;
    this.velocity = velocity;
    this.width = 3;
    this.height = 10;
  }

  draw() {
    const c = this.context;
    c.fillStyle = 'orange';
    c.fillRect(this.position.x, this.position.y, this.width, this.height);
  }

  update() {
    this.draw();
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
  }
}

class Invader {
  constructor({ context, position }) {
    this.context = context;
    this.velocity = { x: 0, y: 0 };
    this.rotation = 0;
    const image = new Image();
    image.src = '/js/games/hemisHunt/assets/chick.png';
    image.onload = () => {
      const scale = 1;
      this.image = image;
      this.width = image.width * scale;
      this.height = image.height * scale;
      this.position = { x: position.x, y: position.y };
    };
  }

  rotateImage() {
    const c = this.context;
    c.translate(this.position.x + this.width / 2, this.position.y + this.height / 2);
    c.rotate(this.rotation);
    c.translate(-this.position.x - this.width / 2, -this.position.y - this.height / 2);
  }

  draw() {
    const c = this.context;
    c.save();
    this.rotateImage();
    c.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);
    c.restore();
  }

  updateLocation({ velocity }) {
    if (this.image) {
      this.draw();
      this.position.x += velocity.x;
      this.position.y += velocity.y;
    }
  }

  shoot(invaderProjectiles) {
    invaderProjectiles.push(
      new invaderProjectile({
        context: this.context,
        position: {
          x: this.position.x + this.width / 2,
          y: this.position.y + this.height
        },
        velocity: { x: 0, y: 5 }
      })
    );
  }
}

class Grid {
  constructor({ context }) {
    this.context = context;
    this.position = { x: 0, y: 0 };
    this.velocity = { x: 3, y: 0 };
    this.invaders = [];
    const columns = Math.floor(Math.random() * 10 + 5);
    const rows = Math.floor(Math.random() * 5 + 2);
    this.width = columns * 30;
    for (let x = 0; x < columns; x++) {
      for (let y = 0; y < rows; y++) {
        this.invaders.push(
          new Invader({ position: { x: x * 30, y: y * 30 }, context: this.context })
        );
      }
    }
  }

  updateLocation() {
    const c = this.context.canvas;
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
    this.velocity.y = 0;
    if (this.position.x + this.width >= c.width || this.position.x <= 0) {
      this.velocity.x = -this.velocity.x;
      this.velocity.y = 30;
    }
  }
}

export { Dozer, Particle, Enemy, projectile, invaderProjectile, Grid };
