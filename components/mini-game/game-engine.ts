// Game constants - now dynamic based on canvas size
export let GAME_WIDTH = 800
export let GAME_HEIGHT = 600

// Function to update game dimensions dynamically
export function updateGameDimensions(width: number, height: number) {
  GAME_WIDTH = width
  GAME_HEIGHT = height
}
export const PLAYER_WIDTH = 40
export const PLAYER_HEIGHT = 30
export const BULLET_WIDTH = 4
export const BULLET_HEIGHT = 10
export const ENEMY_WIDTH = 30
export const ENEMY_HEIGHT = 30
export const POWERUP_WIDTH = 20
export const POWERUP_HEIGHT = 20

// Game entities
export interface GameObject {
  x: number
  y: number
  width: number
  height: number
  speed: number
  active: boolean
}

export interface Player extends GameObject {
  lives: number
  powerLevel: number
  invincible: boolean
  invincibleTimer: number
}

export interface Bullet extends GameObject {
  playerBullet: boolean
}

export interface Enemy extends GameObject {
  type: "normal" | "fast" | "tough"
  health: number
  points: number
  shootTimer: number
  shootInterval: number
}

export interface PowerUp extends GameObject {
  type: "life" | "power" | "shield"
}

export interface GameState {
  player: Player
  bullets: Bullet[]
  enemies: Enemy[]
  powerUps: PowerUp[]
  score: number
  level: number
  gameOver: boolean
  paused: boolean
  spawnTimer: number
  spawnInterval: number
  levelTimer: number
  levelInterval: number
}

// Initialize game state
export function initGameState(): GameState {
  return {
    player: {
      x: GAME_WIDTH / 2 - PLAYER_WIDTH / 2,
      y: GAME_HEIGHT - PLAYER_HEIGHT - 20,
      width: PLAYER_WIDTH,
      height: PLAYER_HEIGHT,
      speed: 5,
      active: true,
      lives: 3,
      powerLevel: 1,
      invincible: false,
      invincibleTimer: 0,
    },
    bullets: [],
    enemies: [],
    powerUps: [],
    score: 0,
    level: 1,
    gameOver: false,
    paused: false,
    spawnTimer: 0,
    spawnInterval: 60, // Frames between enemy spawns
    levelTimer: 0,
    levelInterval: 1800, // Frames before level increase (30 seconds at 60fps)
  }
}

// Check collision between two objects
export function checkCollision(obj1: GameObject, obj2: GameObject): boolean {
  return (
    obj1.x < obj2.x + obj2.width &&
    obj1.x + obj1.width > obj2.x &&
    obj1.y < obj2.y + obj2.height &&
    obj1.y + obj1.height > obj2.y
  )
}

// Create a new bullet
export function createBullet(x: number, y: number, playerBullet: boolean): Bullet {
  return {
    x: x - BULLET_WIDTH / 2,
    y: playerBullet ? y - BULLET_HEIGHT : y,
    width: BULLET_WIDTH,
    height: BULLET_HEIGHT,
    speed: playerBullet ? 10 : 5,
    active: true,
    playerBullet,
  }
}

// Create a new enemy
export function createEnemy(level: number): Enemy {
  const types = ["normal", "fast", "tough"] as const
  const typeIndex = Math.floor(Math.random() * 3)
  const type = types[typeIndex]

  let health = 1
  let speed = 2
  let points = 10
  let shootInterval = 120

  if (type === "fast") {
    speed = 3 + Math.floor(level / 3)
    points = 15
    shootInterval = 90
  } else if (type === "tough") {
    health = 2 + Math.floor(level / 5)
    speed = 1
    points = 20
    shootInterval = 150
  }

  // Increase difficulty with level
  speed += Math.floor(level / 5)
  points += level * 2

  return {
    x: Math.random() * (GAME_WIDTH - ENEMY_WIDTH),
    y: -ENEMY_HEIGHT,
    width: ENEMY_WIDTH,
    height: ENEMY_HEIGHT,
    speed,
    active: true,
    type,
    health,
    points,
    shootTimer: Math.floor(Math.random() * shootInterval),
    shootInterval,
  }
}

// Create a power-up
export function createPowerUp(x: number, y: number): PowerUp {
  const types = ["life", "power", "shield"] as const
  const type = types[Math.floor(Math.random() * types.length)]

  return {
    x,
    y,
    width: POWERUP_WIDTH,
    height: POWERUP_HEIGHT,
    speed: 2,
    active: true,
    type,
  }
}

// Update game state
export function updateGameState(
  state: GameState,
  keys: Set<string>,
  deltaTime: number,
  onShoot: () => void,
  onEnemyHit: () => void,
  onPowerUp: () => void,
  onGameOver: () => void,
): GameState {
  if (state.gameOver || state.paused) return state

  // Create a new state to avoid mutating the original
  const newState = { ...state }

  // Update timers
  newState.spawnTimer += 1
  newState.levelTimer += 1

  // Level progression
  if (newState.levelTimer >= newState.levelInterval) {
    newState.level += 1
    newState.levelTimer = 0
    // Increase spawn rate with level
    newState.spawnInterval = Math.max(20, 60 - newState.level * 3)
  }

  // Spawn enemies
  if (newState.spawnTimer >= newState.spawnInterval) {
    newState.enemies.push(createEnemy(newState.level))
    newState.spawnTimer = 0
  }

  // Update player
  updatePlayer(newState, keys, onShoot)

  // Update bullets
  updateBullets(newState)

  // Update enemies
  updateEnemies(newState, onShoot)

  // Update power-ups
  updatePowerUps(newState)

  // Check collisions
  checkCollisions(newState, onEnemyHit, onPowerUp, onGameOver)

  return newState
}

// Update player position and actions
function updatePlayer(state: GameState, keys: Set<string>, onShoot: () => void) {
  const { player } = state

  // Movement
  if (keys.has("ArrowLeft") || keys.has("a")) {
    player.x = Math.max(0, player.x - player.speed)
  }
  if (keys.has("ArrowRight") || keys.has("d")) {
    player.x = Math.min(GAME_WIDTH - player.width, player.x + player.speed)
  }

  // Shooting
  if (keys.has(" ") || keys.has("ArrowUp")) {
    // Only shoot if there are fewer than 5 player bullets
    const playerBullets = state.bullets.filter((b) => b.playerBullet).length
    if (playerBullets < 5) {
      // Create bullets based on power level
      if (player.powerLevel === 1) {
        state.bullets.push(createBullet(player.x + player.width / 2, player.y, true))
      } else if (player.powerLevel === 2) {
        state.bullets.push(createBullet(player.x + player.width / 4, player.y, true))
        state.bullets.push(createBullet(player.x + (player.width * 3) / 4, player.y, true))
      } else {
        state.bullets.push(createBullet(player.x + player.width / 2, player.y, true))
        state.bullets.push(createBullet(player.x + player.width / 4, player.y, true))
        state.bullets.push(createBullet(player.x + (player.width * 3) / 4, player.y, true))
      }
      onShoot()

      // Remove the key to prevent continuous shooting
      keys.delete(" ")
      keys.delete("ArrowUp")
    }
  }

  // Update invincibility
  if (player.invincible) {
    player.invincibleTimer -= 1
    if (player.invincibleTimer <= 0) {
      player.invincible = false
    }
  }
}

// Update bullet positions
function updateBullets(state: GameState) {
  for (let i = 0; i < state.bullets.length; i++) {
    const bullet = state.bullets[i]

    // Move bullet
    bullet.y += bullet.playerBullet ? -bullet.speed : bullet.speed

    // Remove bullets that go off screen
    if (bullet.y < -bullet.height || bullet.y > GAME_HEIGHT) {
      bullet.active = false
    }
  }

  // Remove inactive bullets
  state.bullets = state.bullets.filter((bullet) => bullet.active)
}

// Update enemy positions and actions
function updateEnemies(state: GameState, onShoot: () => void) {
  for (let i = 0; i < state.enemies.length; i++) {
    const enemy = state.enemies[i]

    // Move enemy
    enemy.y += enemy.speed

    // Enemy shooting
    enemy.shootTimer += 1
    if (enemy.shootTimer >= enemy.shootInterval) {
      state.bullets.push(createBullet(enemy.x + enemy.width / 2, enemy.y + enemy.height, false))
      enemy.shootTimer = 0
    }

    // Remove enemies that go off screen
    if (enemy.y > GAME_HEIGHT) {
      enemy.active = false
    }
  }

  // Remove inactive enemies
  state.enemies = state.enemies.filter((enemy) => enemy.active)
}

// Update power-up positions
function updatePowerUps(state: GameState) {
  for (let i = 0; i < state.powerUps.length; i++) {
    const powerUp = state.powerUps[i]

    // Move power-up
    powerUp.y += powerUp.speed

    // Remove power-ups that go off screen
    if (powerUp.y > GAME_HEIGHT) {
      powerUp.active = false
    }
  }

  // Remove inactive power-ups
  state.powerUps = state.powerUps.filter((powerUp) => powerUp.active)
}

// Check for collisions between game objects
function checkCollisions(state: GameState, onEnemyHit: () => void, onPowerUp: () => void, onGameOver: () => void) {
  const { player, bullets, enemies, powerUps } = state

  // Check player bullets vs enemies
  for (let i = 0; i < bullets.length; i++) {
    const bullet = bullets[i]
    if (!bullet.playerBullet) continue

    for (let j = 0; j < enemies.length; j++) {
      const enemy = enemies[j]

      if (checkCollision(bullet, enemy)) {
        bullet.active = false
        enemy.health -= 1

        if (enemy.health <= 0) {
          enemy.active = false
          state.score += enemy.points
          onEnemyHit()

          // Chance to spawn power-up
          if (Math.random() < 0.1) {
            state.powerUps.push(createPowerUp(enemy.x + enemy.width / 2, enemy.y))
          }
        }

        break
      }
    }
  }

  // Skip player collision checks if invincible
  if (!player.invincible) {
    // Check enemy bullets vs player
    for (let i = 0; i < bullets.length; i++) {
      const bullet = bullets[i]
      if (bullet.playerBullet) continue

      if (checkCollision(bullet, player)) {
        bullet.active = false
        player.lives -= 1

        if (player.lives <= 0) {
          state.gameOver = true
          onGameOver()
        } else {
          // Make player invincible briefly
          player.invincible = true
          player.invincibleTimer = 120 // 2 seconds at 60fps
        }

        break
      }
    }

    // Check enemies vs player
    for (let i = 0; i < enemies.length; i++) {
      const enemy = enemies[i]

      if (checkCollision(enemy, player)) {
        enemy.active = false
        player.lives -= 1

        if (player.lives <= 0) {
          state.gameOver = true
          onGameOver()
        } else {
          // Make player invincible briefly
          player.invincible = true
          player.invincibleTimer = 120 // 2 seconds at 60fps
        }
      }
    }
  }

  // Check power-ups vs player
  for (let i = 0; i < powerUps.length; i++) {
    const powerUp = powerUps[i]

    if (checkCollision(powerUp, player)) {
      powerUp.active = false
      onPowerUp()

      if (powerUp.type === "life") {
        player.lives = Math.min(player.lives + 1, 5)
      } else if (powerUp.type === "power") {
        player.powerLevel = Math.min(player.powerLevel + 1, 3)
      } else if (powerUp.type === "shield") {
        player.invincible = true
        player.invincibleTimer = 300 // 5 seconds at 60fps
      }
    }
  }
}

// Render game state to canvas
export function renderGame(ctx: CanvasRenderingContext2D, state: GameState) {
  const { player, bullets, enemies, powerUps, score, level, gameOver } = state

  // Clear canvas
  ctx.fillStyle = "#000"
  ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT)

  // Draw starfield background
  drawStarfield(ctx)

  // Draw player
  if (player.active) {
    // Flash player if invincible
    if (!player.invincible || Math.floor(Date.now() / 100) % 2 === 0) {
      ctx.fillStyle = "#00ffff"
      ctx.fillRect(player.x, player.y, player.width, player.height)

      // Draw player ship details
      ctx.fillStyle = "#004444"
      ctx.fillRect(player.x + player.width / 2 - 2, player.y - 5, 4, 5)

      // Draw power level indicators
      ctx.fillStyle = "#ffff00"
      for (let i = 0; i < player.powerLevel; i++) {
        ctx.fillRect(player.x + 5 + i * 10, player.y + player.height - 3, 5, 3)
      }
    }
  }

  // Draw bullets
  for (const bullet of bullets) {
    ctx.fillStyle = bullet.playerBullet ? "#00ffff" : "#ff0000"
    ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height)
  }

  // Draw enemies
  for (const enemy of enemies) {
    if (enemy.type === "normal") {
      ctx.fillStyle = "#ff0000"
    } else if (enemy.type === "fast") {
      ctx.fillStyle = "#ff00ff"
    } else {
      ctx.fillStyle = "#ff8800"
    }

    ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height)

    // Draw enemy details
    ctx.fillStyle = "#550000"
    ctx.fillRect(enemy.x + 5, enemy.y + 5, enemy.width - 10, enemy.height - 10)
  }

  // Draw power-ups
  for (const powerUp of powerUps) {
    if (powerUp.type === "life") {
      ctx.fillStyle = "#00ff00"
    } else if (powerUp.type === "power") {
      ctx.fillStyle = "#ffff00"
    } else {
      ctx.fillStyle = "#0088ff"
    }

    ctx.fillRect(powerUp.x, powerUp.y, powerUp.width, powerUp.height)

    // Draw power-up symbol
    ctx.fillStyle = "#000"
    if (powerUp.type === "life") {
      ctx.fillRect(powerUp.x + 6, powerUp.y + 4, 8, 12)
      ctx.fillRect(powerUp.x + 4, powerUp.y + 6, 12, 8)
    } else if (powerUp.type === "power") {
      ctx.fillRect(powerUp.x + 6, powerUp.y + 4, 8, 4)
      ctx.fillRect(powerUp.x + 8, powerUp.y + 4, 4, 12)
    } else {
      ctx.beginPath()
      ctx.arc(powerUp.x + 10, powerUp.y + 10, 6, 0, Math.PI * 2)
      ctx.fill()
    }
  }

  // Draw HUD
  drawHUD(ctx, state)

  // Draw game over screen
  if (gameOver) {
    drawGameOver(ctx, score)
  }
}

// Draw starfield background
function drawStarfield(ctx: CanvasRenderingContext2D) {
  // Use a fixed seed for consistent star positions
  const stars = 100
  for (let i = 0; i < stars; i++) {
    const x = (Math.sin(i * 567.8) * 0.5 + 0.5) * GAME_WIDTH
    const y = (Math.cos(i * 789.2) * 0.5 + 0.5) * GAME_HEIGHT
    const size = (Math.sin(i * 123.4) * 0.5 + 0.5) * 2 + 1

    // Twinkle effect
    const brightness = (Math.sin(Date.now() * 0.001 + i * 10) * 0.5 + 0.5) * 155 + 100

    ctx.fillStyle = `rgb(${brightness}, ${brightness}, ${brightness})`
    ctx.fillRect(x, y, size, size)
  }
}

// Draw HUD (score, lives, level)
function drawHUD(ctx: CanvasRenderingContext2D, state: GameState) {
  const { score, player, level } = state

  // Draw score
  ctx.fillStyle = "#ffff00"
  ctx.font = '16px "PressStart2P", monospace'
  ctx.textAlign = "left"
  ctx.fillText(`SCORE: ${score}`, 10, 20)

  // Draw level
  ctx.textAlign = "center"
  ctx.fillText(`LEVEL ${level}`, GAME_WIDTH / 2, 20)

  // Draw lives
  ctx.textAlign = "right"
  ctx.fillText(`LIVES: ${player.lives}`, GAME_WIDTH - 10, 20)
}

// Draw game over screen
function drawGameOver(ctx: CanvasRenderingContext2D, score: number) {
  // Semi-transparent overlay
  ctx.fillStyle = "rgba(0, 0, 0, 0.7)"
  ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT)

  // Game over text
  ctx.fillStyle = "#ff0000"
  ctx.font = '32px "PressStart2P", monospace'
  ctx.textAlign = "center"
  ctx.fillText("GAME OVER", GAME_WIDTH / 2, GAME_HEIGHT / 2 - 40)

  // Score
  ctx.fillStyle = "#ffff00"
  ctx.font = '16px "PressStart2P", monospace'
  ctx.fillText(`FINAL SCORE: ${score}`, GAME_WIDTH / 2, GAME_HEIGHT / 2 + 10)

  // Restart prompt
  ctx.fillStyle = "#00ffff"
  ctx.font = '12px "PressStart2P", monospace'
  ctx.fillText("PRESS SPACE TO RESTART", GAME_WIDTH / 2, GAME_HEIGHT / 2 + 60)
}
