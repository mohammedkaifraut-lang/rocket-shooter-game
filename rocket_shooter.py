"""
=============================================================================
Project Title: Rocket Shooter - 30-Second Rapid Fire Challenge
Author: College Mini Project
Language: Python 3 with Pygame & SQLite3
Description: A beginner-friendly 2D shooter demonstrating Object-Oriented
             Programming (OOP) principles, inheritance, polymorphism, and
             database storage. Players compete to shoot as many enemies as
             possible in a 30-second time trial.
=============================================================================
"""

import pygame
import random
import sqlite3
import sys

# =============================================================================
# [BACKEND SECTION] - Database, OOP Hierarchy, and Game Logic
# =============================================================================

# --- DATABASE CLASS ---
class Database:
    """Handles SQLite database connection to save and fetch high scores."""

    def __init__(self, db_name="scores.db"):
        """Connect to database and create the high_scores table if it does not exist."""
        self.conn = sqlite3.connect(db_name)
        self.cursor = self.conn.cursor()
        self.create_table()

    def create_table(self):
        """Create a table for storing player names and enemies shot in 30 seconds."""
        query = """
        CREATE TABLE IF NOT EXISTS high_scores (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            player_name TEXT,
            score INTEGER
        )
        """
        self.cursor.execute(query)
        self.conn.commit()

    def save_score(self, player_name, score):
        """Insert a player's score record into the database."""
        query = "INSERT INTO high_scores (player_name, score) VALUES (?, ?)"
        self.cursor.execute(query, (player_name, score))
        self.conn.commit()

    def get_top_scores(self, limit=5):
        """Fetch the top 5 highest scores in descending order to compare among players."""
        query = "SELECT player_name, score FROM high_scores ORDER BY score DESC LIMIT ?"
        self.cursor.execute(query, (limit,))
        return self.cursor.fetchall()

    def close(self):
        """Close the database connection safely."""
        self.conn.close()


# --- OOP HIERARCHY ---

# 1. Base / Parent Class
class GameObject:
    """Base class for all visual objects in the game."""

    def __init__(self, x, y, width, height, color):
        """Initialize position, size, and color."""
        self.x = x
        self.y = y
        self.width = width
        self.height = height
        self.color = color

    def get_rect(self):
        """Return a Pygame Rect used for collision detection."""
        return pygame.Rect(self.x, self.y, self.width, self.height)

    def draw(self, screen):
        """Draw the object as a rectangle on the screen."""
        pygame.draw.rect(screen, self.color, (self.x, self.y, self.width, self.height))


# 2. Child Class: Player (Single Inheritance from GameObject)
class Player(GameObject):
    """The player rocket controlled by the user."""

    def __init__(self, x, y):
        """Initialize the player rocket with blue color and movement speed."""
        super().__init__(x, y, width=40, height=40, color=(0, 200, 255))
        self.speed = 6

    def move(self, direction, screen_width):
        """Move the rocket horizontally while keeping it inside the screen."""
        self.x += direction * self.speed
        # Boundary check
        if self.x < 0:
            self.x = 0
        elif self.x > screen_width - self.width:
            self.x = screen_width - self.width


# 3. Child Class: Bullet (Single Inheritance from GameObject)
class Bullet(GameObject):
    """Projectiles fired upwards from the player's rocket."""

    def __init__(self, x, y):
        """Initialize a small yellow bullet that moves upward."""
        super().__init__(x, y, width=6, height=14, color=(255, 235, 59))
        self.speed = 8

    def update(self):
        """Move the bullet up towards the top of the screen."""
        self.y -= self.speed


# 4. Child Class: Enemy (Single Inheritance from GameObject)
class Enemy(GameObject):
    """Standard enemy ship falling from the top."""

    def __init__(self, x, y, speed=3):
        """Initialize a red enemy rectangle with falling speed."""
        super().__init__(x, y, width=35, height=30, color=(244, 67, 54))
        self.speed = speed

    def update(self):
        """Move the regular enemy straight down (Polymorphic method)."""
        self.y += self.speed


# 5. Child Class: BossEnemy (Multi-Level Inheritance: GameObject -> Enemy -> BossEnemy)
class BossEnemy(Enemy):
    """Tough boss enemy appearing every 20 points, requiring multiple hits."""

    def __init__(self, x, y, speed=1.5):
        """Initialize a bigger purple boss with health points and horizontal motion."""
        super().__init__(x, y, speed)
        self.width = 70
        self.height = 50
        self.color = (156, 39, 176)  # Purple
        self.max_hp = 5
        self.hp = 5
        self.dx = 2  # Horizontal zig-zag speed

    def update(self):
        """Override update: Moves down AND bounces left/right (Polymorphism)."""
        self.y += self.speed
        self.x += self.dx

        # Bounce off screen walls
        if self.x <= 0 or self.x >= 600 - self.width:
            self.dx *= -1

    def draw(self, screen):
        """Draw boss body plus a small green/red health bar above it."""
        super().draw(screen)
        # Health bar background (red)
        bar_x = self.x
        bar_y = self.y - 10
        pygame.draw.rect(screen, (200, 0, 0), (bar_x, bar_y, self.width, 6))
        # Health bar current fill (green)
        fill_width = int(self.width * (self.hp / self.max_hp))
        if fill_width > 0:
            pygame.draw.rect(screen, (76, 175, 80), (bar_x, bar_y, fill_width, 6))


# --- GAME LOGIC CLASS ---
class Game:
    """Manages the 30-second challenge rules, entities, score, levels, and states."""

    def __init__(self, screen_width=600, screen_height=700):
        """Set up game configuration, collections, and database."""
        self.screen_width = screen_width
        self.screen_height = screen_height
        self.db = Database("scores.db")
        self.total_time = 30.0  # 30 seconds time trial
        self.reset()

    def reset(self):
        """Reset or initialize all gameplay attributes."""
        self.score = 0          # Number of enemies shot
        self.level = 1
        self.time_left = self.total_time
        self.is_game_over = False
        self.score_saved = False

        # Create player near bottom center
        start_x = (self.screen_width - 40) // 2
        start_y = self.screen_height - 70
        self.player = Player(start_x, start_y)

        # Entity lists
        self.bullets = []
        self.enemies = []
        self.boss = None

        # Tracking boss triggers (triggers every 20 points)
        self.last_boss_score = 0

        # Spawning timer counter
        self.spawn_delay = 35
        self.spawn_counter = 0

    def shoot(self):
        """Create a bullet at the front tip of the player's rocket."""
        if not self.is_game_over:
            bullet_x = self.player.x + (self.player.width // 2) - 3
            bullet_y = self.player.y - 10
            self.bullets.append(Bullet(bullet_x, bullet_y))

    def spawn_enemy(self):
        """Spawn standard falling enemies across random horizontal positions."""
        # Enemy speed increases by 0.5 per level
        current_speed = 2.5 + (self.level - 1) * 0.5
        rand_x = random.randint(0, self.screen_width - 35)
        self.enemies.append(Enemy(rand_x, -35, speed=current_speed))

    def check_boss_spawn(self):
        """Spawn a boss every 20 points if no boss is currently active."""
        if self.score >= self.last_boss_score + 20 and self.boss is None:
            self.last_boss_score = self.score
            boss_x = (self.screen_width - 70) // 2
            self.boss = BossEnemy(boss_x, -60, speed=1.2 + (self.level * 0.2))

    def update(self, dt=1/60):
        """Update timer, positions, and collisions. Game ends only when 30s timer reaches 0."""
        if self.is_game_over:
            return

        # 1. Update 30-Second Countdown Timer
        self.time_left -= dt
        if self.time_left <= 0:
            self.time_left = 0
            self.trigger_game_over()
            return

        # 2. Update level (every 10 points enemies get faster)
        self.level = (self.score // 10) + 1

        # 3. Check for boss spawn every 20 points
        self.check_boss_spawn()

        # 4. Spawn regular enemies on interval
        self.spawn_counter += 1
        if self.spawn_counter >= max(18, self.spawn_delay - (self.level * 2)):
            self.spawn_counter = 0
            self.spawn_enemy()

        # 5. Update bullets (move up and remove off-screen)
        for bullet in self.bullets[:]:
            bullet.update()
            if bullet.y < -20:
                self.bullets.remove(bullet)

        # 6. Update regular enemies (move down)
        # NOTE: When enemies reach the bottom, the game does NOT end!
        for enemy in self.enemies[:]:
            enemy.update()  # Polymorphic call
            if enemy.y > self.screen_height:
                self.enemies.remove(enemy)
                # Enemies going down do NOT cause game over!

        # 7. Update boss if present
        if self.boss:
            self.boss.update()  # Polymorphic call
            if self.boss.y > self.screen_height:
                self.boss = None  # Boss leaves screen without ending game

        # 8. Check collisions
        self.handle_collisions()

    def handle_collisions(self):
        """Detect and handle bullet hits to count enemies shot."""
        player_rect = self.player.get_rect()

        # Bullet vs Regular Enemies
        for bullet in self.bullets[:]:
            bullet_rect = bullet.get_rect()
            for enemy in self.enemies[:]:
                if bullet_rect.colliderect(enemy.get_rect()):
                    if bullet in self.bullets:
                        self.bullets.remove(bullet)
                    if enemy in self.enemies:
                        self.enemies.remove(enemy)
                    self.score += 1  # 1 enemy shot
                    break

        # Bullet vs Boss
        if self.boss:
            boss_rect = self.boss.get_rect()
            for bullet in self.bullets[:]:
                if bullet.get_rect().colliderect(boss_rect):
                    if bullet in self.bullets:
                        self.bullets.remove(bullet)
                    self.boss.hp -= 1
                    if self.boss.hp <= 0:
                        self.boss = None
                        self.score += 5  # Bonus 5 enemies shot for boss
                    break

        # Player vs Regular Enemies (clears enemy, but game continues for full 30s)
        for enemy in self.enemies[:]:
            if player_rect.colliderect(enemy.get_rect()):
                self.enemies.remove(enemy)

        # Player vs Boss (bounces boss, game continues for full 30s)
        if self.boss and player_rect.colliderect(self.boss.get_rect()):
            self.boss.dx *= -1

    def trigger_game_over(self):
        """End game when 30 seconds expire and save score to SQLite."""
        self.is_game_over = True
        if not self.score_saved:
            self.db.save_score("Player 1", self.score)
            self.score_saved = True


# =============================================================================
# [FRONTEND SECTION] - Window Setup, Drawing, and Main Loop
# =============================================================================

# Colors
COLOR_BG = (15, 20, 35)        # Deep space dark blue
COLOR_WHITE = (255, 255, 255)
COLOR_YELLOW = (255, 215, 0)
COLOR_RED = (244, 67, 54)
COLOR_GREEN = (76, 175, 80)
COLOR_CYAN = (0, 229, 255)
COLOR_GRAY = (120, 130, 150)


def draw_hud(screen, game, font):
    """Draw top HUD: 30-second timer, enemies shot, current level, and boss alert."""
    # Top status bar background
    pygame.draw.rect(screen, (25, 30, 50), (0, 0, game.screen_width, 45))
    pygame.draw.line(screen, (50, 60, 90), (0, 45), (game.screen_width, 45), 2)

    # 30-Second Countdown Timer (Turns red when under 5 seconds)
    time_color = COLOR_RED if game.time_left <= 5.0 else COLOR_YELLOW
    time_surf = font.render(f"Time: {game.time_left:.1f}s", True, time_color)

    # Enemies shot counter
    score_surf = font.render(f"Enemies Shot: {game.score}", True, COLOR_CYAN)

    # Level
    level_surf = font.render(f"Level: {game.level}", True, COLOR_GREEN)

    screen.blit(time_surf, (15, 12))
    screen.blit(score_surf, (200, 12))
    screen.blit(level_surf, (470, 12))

    # Boss warning if boss is alive
    if game.boss:
        boss_warning = font.render("! BOSS BATTLE (+5 KILLS) !", True, (255, 60, 100))
        screen.blit(boss_warning, ((game.screen_width - boss_warning.get_width()) // 2, 55))


def draw_game_over(screen, game, font_large, font_normal, font_small):
    """Draw 30-second results screen and top 5 scores from SQLite to compare players."""
    # Semi-transparent dark overlay
    overlay = pygame.Surface((game.screen_width, game.screen_height))
    overlay.set_alpha(225)
    overlay.fill((10, 12, 25))
    screen.blit(overlay, (0, 0))

    # Title: TIME'S UP!
    title = font_large.render("TIME'S UP!", True, COLOR_YELLOW)
    screen.blit(title, ((game.screen_width - title.get_width()) // 2, 70))

    # Final count of enemies shot
    score_text = font_normal.render(f"Enemies Shot in 30 Seconds: {game.score}", True, COLOR_WHITE)
    screen.blit(score_text, ((game.screen_width - score_text.get_width()) // 2, 130))

    # Leaderboard Header (Comparing scores among people)
    hs_header = font_normal.render("--- TOP 5 LEADERBOARD (SQLite) ---", True, COLOR_CYAN)
    screen.blit(hs_header, ((game.screen_width - hs_header.get_width()) // 2, 195))

    # Fetch top 5 scores from Database class
    top_scores = game.db.get_top_scores(5)
    start_y = 245
    if not top_scores:
        no_scores = font_small.render("No scores saved yet", True, COLOR_GRAY)
        screen.blit(no_scores, ((game.screen_width - no_scores.get_width()) // 2, start_y))
    else:
        for index, (p_name, p_score) in enumerate(top_scores, 1):
            entry_text = f"#{index}  {p_name.ljust(12)} : {p_score} enemies shot"
            entry_surf = font_small.render(entry_text, True, COLOR_YELLOW if index == 1 else COLOR_WHITE)
            screen.blit(entry_surf, ((game.screen_width - entry_surf.get_width()) // 2, start_y))
            start_y += 35

    # Instruction box
    hint_rect = pygame.Rect(100, 520, 400, 70)
    pygame.draw.rect(screen, (30, 40, 70), hint_rect, border_radius=8)
    pygame.draw.rect(screen, COLOR_CYAN, hint_rect, 2, border_radius=8)

    restart_surf = font_normal.render("Press  [R]  to Try 30s Again", True, COLOR_GREEN)
    quit_surf = font_normal.render("Press  [Q]  to Quit", True, (255, 100, 100))

    screen.blit(restart_surf, ((game.screen_width - restart_surf.get_width()) // 2, 532))
    screen.blit(quit_surf, ((game.screen_width - quit_surf.get_width()) // 2, 560))


def main():
    """Main program entry point: creates window and runs 60 FPS loop."""
    pygame.init()
    pygame.display.set_caption("Rocket Shooter - 30s Challenge")

    # Window settings
    width, height = 600, 700
    screen = pygame.display.set_mode((width, height))
    clock = pygame.time.Clock()

    # Fonts
    font_large = pygame.font.SysFont("arial", 46, bold=True)
    font_normal = pygame.font.SysFont("arial", 21, bold=True)
    font_small = pygame.font.SysFont("arial", 18)

    # Initialize backend game engine
    game = Game(width, height)

    running = True
    while running:
        # Get delta time in seconds
        dt = clock.tick(60) / 1000.0

        # --- EVENT HANDLING ---
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                running = False

            elif event.type == pygame.KEYDOWN:
                if game.is_game_over:
                    # Restart on R key
                    if event.key == pygame.K_r:
                        game.reset()
                    # Quit on Q key
                    elif event.key == pygame.K_q:
                        running = False
                else:
                    # Shoot on Space key
                    if event.key == pygame.K_SPACE:
                        game.shoot()

        # --- CONTINUOUS KEY INPUT (SMOOTH MOVEMENT) ---
        if not game.is_game_over:
            keys = pygame.key.get_pressed()
            if keys[pygame.K_LEFT]:
                game.player.move(-1, width)
            if keys[pygame.K_RIGHT]:
                game.player.move(1, width)

            # Update backend physics, 30s timer & entities
            game.update(dt)

        # --- DRAWING (FRONTEND RENDERING) ---
        screen.fill(COLOR_BG)

        # Draw decorative stars in background
        random.seed(42)
        for _ in range(35):
            sx = random.randint(0, width)
            sy = random.randint(0, height)
            pygame.draw.circle(screen, (80, 95, 120), (sx, sy), 1)

        # Draw game entities
        game.player.draw(screen)

        for bullet in game.bullets:
            bullet.draw(screen)

        for enemy in game.enemies:
            enemy.draw(screen)

        if game.boss:
            game.boss.draw(screen)

        # Draw Heads-Up Display (30s timer & enemies shot)
        draw_hud(screen, game, font_normal)

        # Draw 30s Challenge Results screen if finished
        if game.is_game_over:
            draw_game_over(screen, game, font_large, font_normal, font_small)

        # Push frame to display
        pygame.display.flip()

    # Clean exit
    game.db.close()
    pygame.quit()
    sys.exit()


if __name__ == "__main__":
    main()
