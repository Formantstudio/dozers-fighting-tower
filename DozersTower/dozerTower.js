// dozerTower.js — now a basic 2D side-scrolling fighter setup with enemy and attack
import { Dozer, Particle, Enemy} from '/js/games/DozersTower/dozerPlayers.js';

function initDozersFightingTower(container) {
  const canvas = container.querySelector('canvas');
  const context = canvas.getContext('2d');
  canvas.width = 1024;
  canvas.height = 576;
  const backgroundImage = new Image();
  backgroundImage.src = '/js/games/DozersTower/assets/bg01.png';
  let backgroundLoaded = false;

  backgroundImage.onload = () => {
  backgroundLoaded = true;
  };

  const player = new Dozer({ context });
  const enemy = new Enemy({ context });
  enemy.position = { x: canvas.width - 180, y: canvas.height - 160 }; // start on right side
  enemy.health = 100;
  player.health = 100;
  enemy.velocity.x = -0.01; // face left

  const keys = {
    a: { pressed: false },
    d: { pressed: false },
    j: { pressed: false },
    w: { pressed: false },
    space: { pressed: false } // Jump
  };

  let game = { over: false, active: true };
  let frames = 0;
  const particles = [];

  function createParticles({ object, color = '#BAA0DE', fades = true }) {
    for (let i = 0; i < 10; i++) {
      particles.push(new Particle({
        context,
        position: {
          x: object.position.x + object.width / 2,
          y: object.position.y + object.height / 2
        },
        velocity: {
          x: (Math.random() - 0.5) * 2,
          y: (Math.random() - 0.5) * 2
        },
        radius: Math.random() * 3,
        color,
        fades
      }));
    }
  }

  function animate() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    if (!game.active) return;
    requestAnimationFrame(animate);
    if (backgroundLoaded) {
  context.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
} else {
  context.fillStyle = 'white';
  context.fillRect(0, 0, canvas.width, canvas.height);
}

    player.updateLocation();
    enemy.updateLocation();
    handleCombat();
    handleMovement();
    updateParticles();
    handleCombat();
    drawHealthBar();
    frames++;
  }
  function isColliding(a, b) {
  return (
    a.position.x < b.position.x + b.width &&
    a.position.x + a.width > b.position.x &&
    a.position.y < b.position.y + b.height &&
    a.position.y + a.height > b.position.y
  );
}


  function handleMovement() {
  // Horizontal movement
  let proposedVelocityX = 0;
  if (keys.a.pressed && player.position.x >= 0) {
    proposedVelocityX = -5;
  } else if (keys.d.pressed && player.position.x + player.width <= canvas.width) {
    proposedVelocityX = 5;
  }

  // Predict next horizontal position
  const nextX = player.position.x + proposedVelocityX;
  const futurePlayer = {
    position: { x: nextX, y: player.position.y },
    width: player.width,
    height: player.height
  };

  const isColliding = (
    futurePlayer.position.x < enemy.position.x + enemy.width &&
    futurePlayer.position.x + futurePlayer.width > enemy.position.x &&
    futurePlayer.position.y < enemy.position.y + enemy.height &&
    futurePlayer.position.y + futurePlayer.height > enemy.position.y
  );

  if (isColliding) {
    player.velocity.x = player.position.x < enemy.position.x ? -2 : 2;
  } else {
    player.velocity.x = proposedVelocityX;
  }

  // Apply gravity
  player.velocity.y += 0.5;

  // Ground detection
  const groundY = canvas.height - player.height - 20;
  const isGrounded = player.position.y >= groundY;

  // Jump input
  if (keys.space.pressed && isGrounded) {
    player.velocity.y = -12;
  }

  // Clamp to ground
  if (player.position.y + player.velocity.y > groundY) {
    player.velocity.y = 0;
    player.position.y = groundY;
  } else {
    player.position.y += player.velocity.y;
  }
}


  function handleCombat() {
  if (keys.j.pressed) {
    if (player.isAttacking) return;
    player.triggerAttackAnimation();
    const attackRange = 40;
    const facingLeft = player.velocity.x < 0;
    const attackX = facingLeft
      ? player.position.x - attackRange
      : player.position.x + player.width;

    const attackBox = {
      x: attackX,
      y: player.position.y,
      width: attackRange,
      height: player.height
    };

    const enemyBox = {
      x: enemy.position.x,
      y: enemy.position.y,
      width: enemy.width,
      height: enemy.height
    };

    const isHit =
      attackBox.x < enemyBox.x + enemyBox.width &&
      attackBox.x + attackBox.width > enemyBox.x &&
      attackBox.y < enemyBox.y + enemyBox.height &&
      attackBox.y + attackBox.height > enemyBox.y;

    if (isHit && enemy.health > 0) {
      enemy.health -= 5;
      createParticles({ object: enemy, color: 'red' });

      if (enemy.health <= 0) {
  enemy.position.x = -9999; // Hide enemy off-screen
  enemy.velocity.x = 0;
}

    }
  }
}


  function drawHealthBar() {
    const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;

  // Player Health
  context.fillStyle = 'black';
  context.fillRect(20, 20, 200, 20);
  context.fillStyle = 'green';
  context.fillRect(20, 20, player.health * 2, 20);

  // Enemy Health
  context.fillStyle = 'black';
  context.fillRect(canvas.width - 220, 20, 200, 20);
  context.fillStyle = 'red';
  context.fillRect(canvas.width - 220, 20, enemy.health * 2, 20);
}


  function updateParticles() {
    particles.forEach((particle, i) => {
      if (particle.opacity <= 0) {
        setTimeout(() => particles.splice(i, 1), 0);
      } else {
        particle.update();
      }
    });
  }

  addEventListener('keydown', ({ key }) => {
    if (game.over) return;
    switch (key) {
      case 'a': keys.a.pressed = true; break;
      case 'd': keys.d.pressed = true; break;
      case 'j': keys.j.pressed = true; break;
    case ' ': keys.space.pressed = true; break; // spacebar
    }
  });

  addEventListener('keyup', ({ key }) => {
    switch (key) {
      case 'a': keys.a.pressed = false; break;
      case 'd': keys.d.pressed = false; break;
      case 'j': keys.j.pressed = false; break;
    case ' ': keys.space.pressed = false; break; // spacebar
    }
  });

  function waitForLoad() {
  if (player.isLoaded && enemy.isLoaded) {
    animate();
  } else {
    requestAnimationFrame(waitForLoad);
  }
}
waitForLoad();

}
export { initDozersFightingTower };
