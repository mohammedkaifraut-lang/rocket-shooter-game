export interface OopConceptItem {
  id: string;
  name: string;
  shortDesc: string;
  whereInCode: string;
  codeSnippet: string;
  teacherExplanation: string;
}

export interface VivaQuestionItem {
  id: number;
  question: string;
  shortAnswer: string;
  detailedTeacherNotes: string;
  keyPhrases: string[];
}

export const FRONTEND_EXPLANATION = {
  title: "Frontend in Simple Words",
  summary: "The Frontend is everything the player actually SEES and INTERACTS with on the screen.",
  bullets: [
    "Pygame Window & Resolution: Initializing the canvas (600x700 pixels) and setting the title bar.",
    "Drawing Visuals: Drawing the player rocket (cyan rect), bullets (yellow rect), regular enemies (red rects), and boss (purple rect with HP bar).",
    "Heads-Up Display (HUD): Showing the 30-second countdown timer, total enemies shot, and current level at the top of the screen.",
    "Results / Game Over Screen: Rendering the dark overlay, final score, and retrieving the top 5 high scores from SQLite.",
    "Event Loop & Input Listener: Capturing keyboard events (Left/Right arrow keys for navigation, Space for shooting, R for restart, Q for quit).",
    "Frame Rate Controller: Using pygame.time.Clock().tick(60) to keep the animation running at smooth 60 frames per second."
  ]
};

export const BACKEND_EXPLANATION = {
  title: "Backend in Simple Words",
  summary: "The Backend is the unseen 'engine brain' containing the rules, physics, data, and logic.",
  bullets: [
    "30-Second Time Attack: Counting down 30.0s to 0.0s. Enemies passing the bottom do NOT end the game!",
    "Object Movement Physics: Updating coordinates (bullet.y -= speed, enemy.y += speed, boss bouncing horizontally).",
    "Collision Detection Engine: Checking if two rectangular bounding boxes intersect using Pygame's colliderect() algorithm.",
    "Entity Spawning Rules: Deciding when regular enemies appear on timer intervals and when the BossEnemy spawns (every 20 points).",
    "Database Persistence: Connecting to local SQLite3 database ('scores.db'), executing SQL queries (CREATE TABLE, INSERT INTO, SELECT ... ORDER BY score DESC LIMIT 5), and managing the connection safely."
  ]
};

export const OOP_CONCEPTS: OopConceptItem[] = [
  {
    id: "class-object",
    name: "Classes & Objects",
    shortDesc: "Blueprint vs concrete instance created in memory.",
    whereInCode: "Class definitions (GameObject, Player, Bullet, Enemy, BossEnemy, Database, Game). Instantiations inside Game.reset() and Game.spawn_enemy().",
    codeSnippet: `# Class (Blueprint)
class Player(GameObject):
    def __init__(self, x, y): ...

# Object (Instance)
self.player = Player(start_x, start_y)`,
    teacherExplanation: "A Class is a blueprint that defines attributes and methods. An Object is a specific instance of that class loaded in RAM with its own coordinates and state."
  },
  {
    id: "inheritance",
    name: "Single Inheritance",
    shortDesc: "A child class inherits attributes and methods from a parent class.",
    whereInCode: "Player, Bullet, and Enemy all inherit from GameObject (e.g., class Player(GameObject):).",
    codeSnippet: `class GameObject:
    def __init__(self, x, y, width, height, color):
        self.x = x
        self.y = y
        self.width = width
        self.height = height
        self.color = color

class Enemy(GameObject):
    def __init__(self, x, y, speed=3):
        # Reusing parent attributes
        super().__init__(x, y, width=35, height=30, color=(244, 67, 54))
        self.speed = speed`,
    teacherExplanation: "Single inheritance avoids repeating common properties like x, y, width, height, color, and draw() across every game entity. The child classes reuse code from GameObject."
  },
  {
    id: "multi-level",
    name: "Multi-Level Inheritance",
    shortDesc: "A class inherits from a child class that already inherited from another class (A -> B -> C).",
    whereInCode: "GameObject (Grandparent) -> Enemy (Parent) -> BossEnemy (Child). Defined at class BossEnemy(Enemy):",
    codeSnippet: `class GameObject:            # Grandparent
    ...

class Enemy(GameObject):       # Parent inherits GameObject
    ...

class BossEnemy(Enemy):        # Child inherits Enemy
    def __init__(self, x, y, speed=1.5):
        super().__init__(x, y, speed)
        self.width = 70
        self.hp = 5
        self.dx = 2`,
    teacherExplanation: "BossEnemy is an Enemy, and an Enemy is a GameObject. BossEnemy automatically gets everything from Enemy and GameObject while adding its own boss health and zig-zag mechanics."
  },
  {
    id: "polymorphism",
    name: "Polymorphism (Method Overriding)",
    shortDesc: "Same method name behaves differently depending on the object type.",
    whereInCode: "update() in Enemy vs update() in BossEnemy. Both share the update() name, but have different behavior.",
    codeSnippet: `# In Enemy:
def update(self):
    self.y += self.speed  # Only falls down

# In BossEnemy:
def update(self):
    self.y += self.speed
    self.x += self.dx     # Also moves sideways & bounces
    if self.x <= 0 or self.x >= 600 - self.width:
        self.dx *= -1`,
    teacherExplanation: "Polymorphism means 'many forms'. When the Game loop calls enemy.update(), Python dynamically executes the specific version of update() belonging to that exact instance."
  },
  {
    id: "encapsulation",
    name: "Encapsulation",
    shortDesc: "Bundling data (variables) and functions (methods) into a single unit, and hiding internal mechanics.",
    whereInCode: "Database class encapsulates all SQLite cursor operations, query strings, and connection commits inside clean public methods (save_score, get_top_scores).",
    codeSnippet: `class Database:
    def __init__(self, db_name="scores.db"):
        self.conn = sqlite3.connect(db_name)
        self.cursor = self.conn.cursor()

    def save_score(self, player_name, score):
        # Database details are hidden from the game loop
        self.cursor.execute("INSERT INTO high_scores ...", (player_name, score))
        self.conn.commit()`,
    teacherExplanation: "The rest of the game doesn't need to know raw SQL syntax. It simply calls db.save_score() or db.get_top_scores(). This keeps the code modular and protected."
  }
];

export const VIVA_QUESTIONS: VivaQuestionItem[] = [
  {
    id: 1,
    question: "Why did you use super().__init__() in the child classes?",
    shortAnswer: "super().__init__() calls the parent class's constructor so that the child inherits and initializes the parent's attributes without rewriting code.",
    detailedTeacherNotes: "In Python, when a child class defines its own __init__(), it overrides the parent's __init__(). Calling super().__init__() ensures that attributes like position (x, y), dimensions (width, height), and color defined in GameObject are properly initialized for Player, Bullet, and Enemy.",
    keyPhrases: ["Constructor chaining", "Code reuse", "Inherits parent attributes", "DRY principle (Don't Repeat Yourself)"]
  },
  {
    id: 2,
    question: "Where and how does your project demonstrate Polymorphism?",
    shortAnswer: "In the update() method of Enemy and BossEnemy. Both share the exact same method signature, but regular Enemy moves straight down while BossEnemy overrides it to zig-zag horizontally and bounce off walls.",
    detailedTeacherNotes: "This is runtime polymorphism via method overriding. When Game.update() iterates over enemies and calls entity.update(), Python executes the appropriate logic based on the object's dynamic type.",
    keyPhrases: ["Method Overriding", "Runtime Polymorphism", "Same method name, different behavior", "Dynamic binding"]
  },
  {
    id: 3,
    question: "Why did you create a separate Game class instead of putting everything in the main while loop?",
    shortAnswer: "To follow the Single Responsibility Principle and maintain clean OOP architecture. The Game class manages state (lives, score, level), collisions, and entity lists, while the main function only handles window events and rendering.",
    detailedTeacherNotes: "Separating Game from the main loop makes the project testable and clean. If we want to restart the game, we just call game.reset() instead of reinitializing the whole Pygame window. It clearly separates business logic from presentation.",
    keyPhrases: ["Separation of concerns", "Single Responsibility", "Easy restart via game.reset()", "Modularity"]
  },
  {
    id: 4,
    question: "How does the SQLite database work without setting up a server like MySQL or Postgres?",
    shortAnswer: "SQLite is a serverless, file-based embedded database built directly into Python's standard library. It stores tables and rows inside a single local file ('scores.db').",
    detailedTeacherNotes: "No external server, username, or port is needed. The sqlite3 module creates 'scores.db' on disk automatically. We use parameterized queries ('?, ?') to insert data securely and prevent SQL injection.",
    keyPhrases: ["Serverless & embedded", "Built-in python sqlite3", "Single file storage (scores.db)", "Parameterized queries"]
  },
  {
    id: 5,
    question: "How does collision detection work in your game?",
    shortAnswer: "We use Pygame's AABB (Axis-Aligned Bounding Box) collision method colliderect(). Each entity returns a pygame.Rect, and colliderect() checks if two rectangles overlap.",
    detailedTeacherNotes: "Every GameObject implements get_rect(), which returns pygame.Rect(self.x, self.y, self.width, self.height). Pygame then performs mathematical boundary checks: (x1 < x2 + w2 and x1 + w1 > x2 and y1 < y2 + h2 and y1 + h1 > y2). It is fast, efficient, and well-suited for 2D arcade games.",
    keyPhrases: ["pygame.Rect", "colliderect()", "AABB (Axis-Aligned Bounding Box)", "get_rect() encapsulation"]
  }
];

export const RUN_STEPS = [
  {
    step: "1",
    title: "Verify Python 3 is installed",
    cmd: "python --version",
    note: "Python 3.8 or higher is recommended. On macOS/Linux you might use 'python3'."
  },
  {
    step: "2",
    title: "Install the Pygame library",
    cmd: "pip install pygame",
    note: "Downloads and installs Pygame from PyPI. SQLite comes built-in with Python, so no other installs are needed!"
  },
  {
    step: "3",
    title: "Save the file as rocket_shooter.py",
    cmd: "cat rocket_shooter.py",
    note: "Keep the single script file in a clean project folder on your computer."
  },
  {
    step: "4",
    title: "Run the game",
    cmd: "python rocket_shooter.py",
    note: "A 600x700 arcade window will launch immediately. Use Left/Right arrows to steer and Space to fire!"
  }
];
