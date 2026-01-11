// Глобальные переменные для управления
let currentGame = null;
let activeKeys = {};
let gameInterval = null;
let gameRunning = false;

// Переключение темы
const themeToggle = document.getElementById('themeToggle');
const mobileThemeToggle = document.getElementById('mobileThemeToggle');
const themeIcon = themeToggle.querySelector('i');
const mobileThemeIcon = mobileThemeToggle ? mobileThemeToggle.querySelector('i') : null;

// Проверяем сохраненную тему
const savedTheme = localStorage.getItem('theme') || 'light';
document.documentElement.setAttribute('data-theme', savedTheme);
updateThemeIcon(savedTheme);

function updateThemeIcon(theme) {
    const icon = theme === 'light' ? 'fa-moon' : 'fa-sun';
    if (themeIcon) themeIcon.className = `fas ${icon}`;
    if (mobileThemeIcon) mobileThemeIcon.className = `fas ${icon}`;
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
}

if (themeToggle) themeToggle.addEventListener('click', toggleTheme);
if (mobileThemeToggle) mobileThemeToggle.addEventListener('click', toggleTheme);

// Мобильное меню
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileMenu = document.getElementById('mobileMenu');
const closeMobileMenu = document.getElementById('closeMobileMenu');
const mobileMenuLinks = document.querySelectorAll('.mobile-menu-link');

if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.add('open');
        document.body.style.overflow = 'hidden';
    });
}

if (closeMobileMenu) {
    closeMobileMenu.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
    });
}

mobileMenuLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const section = link.getAttribute('data-section');
        
        // Обновляем активную ссылку
        mobileMenuLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
        
        // Закрываем меню
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
        
        // Прокручиваем к секции
        const targetSection = document.getElementById(section);
        if (targetSection) {
            window.scrollTo({
                top: targetSection.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// Навигация
document.querySelectorAll('nav a:not(.telegram-btn-small)').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
            
            // Обновляем активную ссылку
            document.querySelectorAll('nav a').forEach(a => a.classList.remove('active'));
            this.classList.add('active');
            
            // Обновляем активную ссылку в мобильном меню
            mobileMenuLinks.forEach(l => {
                if (l.getAttribute('data-section') === targetId) {
                    l.classList.add('active');
                } else {
                    l.classList.remove('active');
                }
            });
        }
    });
});

// Кнопка "Начать играть"
document.querySelector('#home .btn').addEventListener('click', function(e) {
    e.preventDefault();
    loadGame('snake');
    window.scrollTo({
        top: document.getElementById('gameContainer').offsetTop - 80,
        behavior: 'smooth'
    });
    
    // Обновляем активную ссылку
    document.querySelectorAll('nav a').forEach(a => a.classList.remove('active'));
    document.querySelector('nav a[href="#games"]').classList.add('active');
});

// Игры
const playButtons = document.querySelectorAll('.play-btn');
const gameContainer = document.getElementById('gameContainer');
const gameTitle = document.getElementById('gameTitle');
const gameFrame = document.getElementById('gameFrame');
const closeGameBtn = document.getElementById('closeGame');
const controlsInfo = document.getElementById('controlsInfo');
const mobileControls = document.getElementById('mobileControls');

// Обработчики клавиатуры для WASD
document.addEventListener('keydown', (e) => {
    // Сохраняем нажатую клавишу
    activeKeys[e.key.toLowerCase()] = true;
    activeKeys[e.code] = true;
    
    // Обрабатываем управление в зависимости от текущей игры
    if (currentGame === 'snake') {
        handleSnakeInput(e);
    } else if (currentGame === '2048') {
        handle2048Input(e);
    } else if (currentGame === 'superfighters') {
        handleSuperfightersInput(e);
    }
});

document.addEventListener('keyup', (e) => {
    // Удаляем отпущенную клавишу
    delete activeKeys[e.key.toLowerCase()];
    delete activeKeys[e.code];
});

// Загружаем игру при загрузке страницы
window.addEventListener('DOMContentLoaded', () => {
    // Инициализируем мобильные кнопки управления
    initMobileControls();
});

playButtons.forEach(button => {
    button.addEventListener('click', function() {
        const game = this.getAttribute('data-game');
        loadGame(game);
        
        // Прокручиваем к игре
        window.scrollTo({
            top: gameContainer.offsetTop - 80,
            behavior: 'smooth'
        });
        
        // Фокусируем игровое поле для обработки клавиатуры
        setTimeout(() => {
            gameFrame.focus();
        }, 100);
    });
});

function loadGame(game) {
    currentGame = game;
    
    // Показываем контейнер с игрой
    gameContainer.style.display = 'block';
    
    // Останавливаем предыдущую игру
    stopCurrentGame();
    
    // Обновляем заголовок
    switch(game) {
        case 'snake':
            gameTitle.textContent = 'Змейка';
            controlsInfo.textContent = 'Управление: WASD или стрелки для движения змейки';
            loadSnakeGame();
            break;
            
        case '2048':
            gameTitle.textContent = '2048';
            controlsInfo.textContent = 'Управление: WASD или стрелки для перемещения плиток';
            load2048Game();
            break;
            
        case 'superfighters':
            gameTitle.textContent = 'Супербойцы';
            controlsInfo.textContent = 'Управление: WASD для движения, пробел для прыжка, J/K для атаки';
            loadSuperfightersGame();
            break;
    }
    
    // Показываем мобильные контролы
    mobileControls.style.display = 'block';
}

// Инициализация мобильных контролов
function initMobileControls() {
    const mobileControlBtns = document.querySelectorAll('.mobile-control-btn');
    
    mobileControlBtns.forEach(btn => {
        // Обработка касаний
        btn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            const key = btn.getAttribute('data-key');
            const keyAlt = btn.getAttribute('data-key-alt');
            
            // Симулируем нажатие клавиши
            simulateKeyPress(key, true);
            if (keyAlt) simulateKeyPress(keyAlt, true);
            
            btn.classList.add('active');
        });
        
        btn.addEventListener('touchend', (e) => {
            e.preventDefault();
            const key = btn.getAttribute('data-key');
            const keyAlt = btn.getAttribute('data-key-alt');
            
            // Симулируем отпускание клавиши
            simulateKeyPress(key, false);
            if (keyAlt) simulateKeyPress(keyAlt, false);
            
            btn.classList.remove('active');
        });
        
        // Обработка кликов мышью (для десктопа)
        btn.addEventListener('mousedown', (e) => {
            e.preventDefault();
            const key = btn.getAttribute('data-key');
            const keyAlt = btn.getAttribute('data-key-alt');
            
            simulateKeyPress(key, true);
            if (keyAlt) simulateKeyPress(keyAlt, true);
            
            btn.classList.add('active');
        });
        
        btn.addEventListener('mouseup', (e) => {
            e.preventDefault();
            const key = btn.getAttribute('data-key');
            const keyAlt = btn.getAttribute('data-key-alt');
            
            simulateKeyPress(key, false);
            if (keyAlt) simulateKeyPress(keyAlt, false);
            
            btn.classList.remove('active');
        });
        
        btn.addEventListener('mouseleave', () => {
            const key = btn.getAttribute('data-key');
            const keyAlt = btn.getAttribute('data-key-alt');
            
            simulateKeyPress(key, false);
            if (keyAlt) simulateKeyPress(keyAlt, false);
            
            btn.classList.remove('active');
        });
    });
}

function simulateKeyPress(key, isPressed) {
    // Обновляем глобальный объект активных клавиш
    if (isPressed) {
        activeKeys[key.toLowerCase()] = true;
        
        // Также симулируем событие клавиатуры для текущей игры
        if (currentGame === 'snake') {
            handleSnakeInput({key: key, preventDefault: () => {}});
        } else if (currentGame === '2048') {
            handle2048Input({key: key, preventDefault: () => {}});
        } else if (currentGame === 'superfighters') {
            handleSuperfightersInput({key: key, preventDefault: () => {}});
        }
    } else {
        delete activeKeys[key.toLowerCase()];
    }
}

// Закрытие игры
closeGameBtn.addEventListener('click', () => {
    gameContainer.style.display = 'none';
    mobileControls.style.display = 'none';
    
    // Останавливаем текущую игру
    stopCurrentGame();
});

function stopCurrentGame() {
    if (gameInterval) {
        clearInterval(gameInterval);
        gameInterval = null;
    }
    gameRunning = false;
}

// === ИГРА ЗМЕЙКА ===
let snakeGameState = {
    snake: [],
    food: {},
    direction: 'right',
    nextDirection: 'right',
    score: 0,
    highScore: 0,
    gridSize: 20
};

function loadSnakeGame() {
    gameFrame.innerHTML = `
        <div class="game-canvas-container">
            <canvas id="snakeCanvas" class="game-canvas" width="600" height="400"></canvas>
            <div class="game-instructions">
                <p>Счет: <span id="score">0</span> | Лучший счет: <span id="highScore">0</span></p>
                <p>Управление: <span class="key">W</span> <span class="key">A</span> <span class="key">S</span> <span class="key">D</span> или стрелки</p>
                <button id="startSnake" class="btn" style="margin-top: 10px;">Начать игру</button>
                <button id="pauseSnake" class="btn" style="margin-top: 10px; margin-left: 10px;">Пауза</button>
            </div>
        </div>
    `;
    
    initSnakeGame();
}

function initSnakeGame() {
    const canvas = document.getElementById('snakeCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const scoreElement = document.getElementById('score');
    const highScoreElement = document.getElementById('highScore');
    const startButton = document.getElementById('startSnake');
    const pauseButton = document.getElementById('pauseSnake');
    
    if (!ctx || !scoreElement || !startButton) return;
    
    // Инициализация игры
    snakeGameState = {
        snake: [
            {x: 5, y: 10},
            {x: 4, y: 10},
            {x: 3, y: 10}
        ],
        food: {},
        direction: 'right',
        nextDirection: 'right',
        score: 0,
        highScore: localStorage.getItem('snakeHighScore') || 0,
        gridSize: 20
    };
    
    highScoreElement.textContent = snakeGameState.highScore;
    
    function generateFood() {
        let newFood;
        let onSnake;
        
        do {
            onSnake = false;
            newFood = {
                x: Math.floor(Math.random() * (canvas.width / snakeGameState.gridSize)),
                y: Math.floor(Math.random() * (canvas.height / snakeGameState.gridSize))
            };
            
            for (let segment of snakeGameState.snake) {
                if (segment.x === newFood.x && segment.y === newFood.y) {
                    onSnake = true;
                    break;
                }
            }
        } while (onSnake);
        
        return newFood;
    }
    
    snakeGameState.food = generateFood();
    
    function drawGame() {
        // Очистка холста
        ctx.fillStyle = '#1a1a1a';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Отрисовка змейки
        snakeGameState.snake.forEach((segment, index) => {
            ctx.fillStyle = index === 0 ? '#4CAF50' : '#8BC34A';
            ctx.fillRect(
                segment.x * snakeGameState.gridSize, 
                segment.y * snakeGameState.gridSize, 
                snakeGameState.gridSize - 1, 
                snakeGameState.gridSize - 1
            );
        });
        
        // Отрисовка еды
        ctx.fillStyle = '#FF5252';
        ctx.beginPath();
        ctx.arc(
            snakeGameState.food.x * snakeGameState.gridSize + snakeGameState.gridSize / 2,
            snakeGameState.food.y * snakeGameState.gridSize + snakeGameState.gridSize / 2,
            snakeGameState.gridSize / 2 - 1,
            0,
            Math.PI * 2
        );
        ctx.fill();
    }
    
    function gameLoop() {
        if (!gameRunning) return;
        
        // Обновление направления
        snakeGameState.direction = snakeGameState.nextDirection;
        
        // Движение головы змейки
        const head = {...snakeGameState.snake[0]};
        
        switch(snakeGameState.direction) {
            case 'up': head.y--; break;
            case 'down': head.y++; break;
            case 'left': head.x--; break;
            case 'right': head.x++; break;
        }
        
        // Проверка столкновения со стенами
        if (head.x < 0 || head.x >= canvas.width / snakeGameState.gridSize || 
            head.y < 0 || head.y >= canvas.height / snakeGameState.gridSize) {
            gameOver();
            return;
        }
        
        // Проверка столкновения с собой
        for (let segment of snakeGameState.snake) {
            if (head.x === segment.x && head.y === segment.y) {
                gameOver();
                return;
            }
        }
        
        snakeGameState.snake.unshift(head);
        
        // Проверка съедания еды
        if (head.x === snakeGameState.food.x && head.y === snakeGameState.food.y) {
            snakeGameState.score += 10;
            scoreElement.textContent = snakeGameState.score;
            
            if (snakeGameState.score > snakeGameState.highScore) {
                snakeGameState.highScore = snakeGameState.score;
                highScoreElement.textContent = snakeGameState.highScore;
                localStorage.setItem('snakeHighScore', snakeGameState.highScore);
            }
            
            snakeGameState.food = generateFood();
        } else {
            snakeGameState.snake.pop();
        }
        
        drawGame();
    }
    
    function gameOver() {
        gameRunning = false;
        if (gameInterval) {
            clearInterval(gameInterval);
            gameInterval = null;
        }
        alert(`Игра окончена! Ваш счет: ${snakeGameState.score}`);
    }
    
    startButton.addEventListener('click', () => {
        // Сброс игры
        snakeGameState = {
            snake: [
                {x: 5, y: 10},
                {x: 4, y: 10},
                {x: 3, y: 10}
            ],
            food: generateFood(),
            direction: 'right',
            nextDirection: 'right',
            score: 0,
            highScore: snakeGameState.highScore,
            gridSize: 20
        };
        
        scoreElement.textContent = snakeGameState.score;
        
        if (gameInterval) {
            clearInterval(gameInterval);
        }
        
        gameRunning = true;
        if (pauseButton) pauseButton.textContent = 'Пауза';
        
        gameInterval = setInterval(gameLoop, 150);
        drawGame();
    });
    
    if (pauseButton) {
        pauseButton.addEventListener('click', () => {
            if (!gameRunning) return;
            
            gameRunning = !gameRunning;
            pauseButton.textContent = gameRunning ? 'Пауза' : 'Продолжить';
        });
    }
    
    // Начальная отрисовка
    drawGame();
}

function handleSnakeInput(e) {
    if (!gameRunning) return;
    
    const key = e.key.toLowerCase();
    
    switch(key) {
        case 'w':
        case 'arrowup':
            if (snakeGameState.direction !== 'down') snakeGameState.nextDirection = 'up';
            break;
        case 's':
        case 'arrowdown':
            if (snakeGameState.direction !== 'up') snakeGameState.nextDirection = 'down';
            break;
        case 'a':
        case 'arrowleft':
            if (snakeGameState.direction !== 'right') snakeGameState.nextDirection = 'left';
            break;
        case 'd':
        case 'arrowright':
            if (snakeGameState.direction !== 'left') snakeGameState.nextDirection = 'right';
            break;
    }
}

// === ИГРА 2048 ===
let game2048State = {
    board: [],
    score: 0,
    bestScore: 0,
    size: 4
};

function load2048Game() {
    gameFrame.innerHTML = `
        <div class="game-2048-container">
            <div class="game-2048-header">
                <h3>2048</h3>
                <div class="game-2048-scores">
                    <div class="score-box">
                        <div>Счет</div>
                        <span id="score2048">0</span>
                    </div>
                    <div class="score-box">
                        <div>Лучший</div>
                        <span id="best2048">0</span>
                    </div>
                </div>
            </div>
            <div id="gameBoard2048" class="game-2048-board"></div>
            <div class="game-instructions">
                <p>Управление: <span class="key">W</span> <span class="key">A</span> <span class="key">S</span> <span class="key">D</span> или стрелки</p>
                <button id="newGame2048" class="btn" style="margin-top: 10px;">Новая игра</button>
            </div>
        </div>
    `;
    
    init2048Game();
}

function init2048Game() {
    const gameBoard = document.getElementById('gameBoard2048');
    const scoreElement = document.getElementById('score2048');
    const bestElement = document.getElementById('best2048');
    const newGameButton = document.getElementById('newGame2048');
    
    if (!gameBoard) return;
    
    // Инициализация состояния игры
    game2048State = {
        board: [],
        score: 0,
        bestScore: localStorage.getItem('2048BestScore') || 0,
        size: 4
    };
    
    bestElement.textContent = game2048State.bestScore;
    
    function initBoard() {
        // Создаем пустую доску
        game2048State.board = [];
        for (let i = 0; i < game2048State.size; i++) {
            game2048State.board[i] = [];
            for (let j = 0; j < game2048State.size; j++) {
                game2048State.board[i][j] = 0;
            }
        }
        
        game2048State.score = 0;
        if (scoreElement) scoreElement.textContent = game2048State.score;
        
        // Добавляем два начальных тайла
        addRandomTile();
        addRandomTile();
        renderBoard();
    }
    
    function addRandomTile() {
        const emptyCells = [];
        
        for (let i = 0; i < game2048State.size; i++) {
            for (let j = 0; j < game2048State.size; j++) {
                if (game2048State.board[i][j] === 0) {
                    emptyCells.push({x: i, y: j});
                }
            }
        }
        
        if (emptyCells.length > 0) {
            const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
            game2048State.board[randomCell.x][randomCell.y] = Math.random() < 0.9 ? 2 : 4;
        }
    }
    
    function getTileColor(value) {
        const colors = {
            0: '#cdc1b4',
            2: '#eee4da',
            4: '#ede0c8',
            8: '#f2b179',
            16: '#f59563',
            32: '#f67c5f',
            64: '#f65e3b',
            128: '#edcf72',
            256: '#edcc61',
            512: '#edc850',
            1024: '#edc53f',
            2048: '#edc22e'
        };
        
        return colors[value] || '#3c3a32';
    }
    
    function renderBoard() {
        if (!gameBoard) return;
        
        gameBoard.innerHTML = '';
        
        for (let i = 0; i < game2048State.size; i++) {
            for (let j = 0; j < game2048State.size; j++) {
                const tile = document.createElement('div');
                const value = game2048State.board[i][j];
                
                tile.className = 'tile';
                tile.textContent = value !== 0 ? value : '';
                tile.style.backgroundColor = getTileColor(value);
                tile.style.color = value > 4 ? '#f9f6f2' : '#776e65';
                tile.style.fontSize = value < 100 ? '24px' : value < 1000 ? '20px' : '16px';
                
                gameBoard.appendChild(tile);
            }
        }
    }
    
    function move(direction) {
        let moved = false;
        const oldBoard = JSON.parse(JSON.stringify(game2048State.board));
        
        // Функция для сдвига и объединения строки/столбца
        function slideAndMerge(line) {
            // Удаляем нули
            let filtered = line.filter(val => val !== 0);
            
            // Объединяем одинаковые соседние числа
            for (let i = 0; i < filtered.length - 1; i++) {
                if (filtered[i] === filtered[i + 1]) {
                    filtered[i] *= 2;
                    game2048State.score += filtered[i];
                    filtered.splice(i + 1, 1);
                }
            }
            
            // Добавляем нули в конец
            while (filtered.length < game2048State.size) {
                filtered.push(0);
            }
            
            return filtered;
        }
        
        switch(direction) {
            case 'up':
                for (let j = 0; j < game2048State.size; j++) {
                    let column = [];
                    for (let i = 0; i < game2048State.size; i++) {
                        column.push(game2048State.board[i][j]);
                    }
                    
                    column = slideAndMerge(column);
                    
                    for (let i = 0; i < game2048State.size; i++) {
                        game2048State.board[i][j] = column[i];
                    }
                }
                break;
                
            case 'down':
                for (let j = 0; j < game2048State.size; j++) {
                    let column = [];
                    for (let i = game2048State.size - 1; i >= 0; i--) {
                        column.push(game2048State.board[i][j]);
                    }
                    
                    column = slideAndMerge(column);
                    
                    for (let i = game2048State.size - 1; i >= 0; i--) {
                        game2048State.board[i][j] = column[game2048State.size - 1 - i];
                    }
                }
                break;
                
            case 'left':
                for (let i = 0; i < game2048State.size; i++) {
                    game2048State.board[i] = slideAndMerge(game2048State.board[i]);
                }
                break;
                
            case 'right':
                for (let i = 0; i < game2048State.size; i++) {
                    let row = game2048State.board[i].slice().reverse();
                    row = slideAndMerge(row);
                    game2048State.board[i] = row.reverse();
                }
                break;
        }
        
        // Проверяем, изменилась ли доска
        moved = JSON.stringify(oldBoard) !== JSON.stringify(game2048State.board);
        
        if (moved) {
            addRandomTile();
            if (scoreElement) scoreElement.textContent = game2048State.score;
            
            if (game2048State.score > game2048State.bestScore) {
                game2048State.bestScore = game2048State.score;
                if (bestElement) bestElement.textContent = game2048State.bestScore;
                localStorage.setItem('2048BestScore', game2048State.bestScore);
            }
            
            renderBoard();
            
            // Проверка на окончание игры
            if (isGameOver()) {
                setTimeout(() => {
                    alert(`Игра окончена! Ваш счет: ${game2048State.score}`);
                }, 100);
            }
        }
    }
    
    function isGameOver() {
        // Проверка на пустые клетки
        for (let i = 0; i < game2048State.size; i++) {
            for (let j = 0; j < game2048State.size; j++) {
                if (game2048State.board[i][j] === 0) return false;
            }
        }
        
        // Проверка на возможные объединения
        for (let i = 0; i < game2048State.size; i++) {
            for (let j = 0; j < game2048State.size; j++) {
                const value = game2048State.board[i][j];
                
                // Проверка справа
                if (j < game2048State.size - 1 && game2048State.board[i][j + 1] === value) return false;
                
                // Проверка снизу
                if (i < game2048State.size - 1 && game2048State.board[i + 1][j] === value) return false;
            }
        }
        
        return true;
    }
    
    newGameButton.addEventListener('click', initBoard);
    
    // Инициализация игры
    initBoard();
}

function handle2048Input(e) {
    if (currentGame !== '2048') return;
    
    const key = e.key.toLowerCase();
    
    switch(key) {
        case 'w':
        case 'arrowup':
            e.preventDefault();
            move('up');
            break;
        case 's':
        case 'arrowdown':
            e.preventDefault();
            move('down');
            break;
        case 'a':
        case 'arrowleft':
            e.preventDefault();
            move('left');
            break;
        case 'd':
        case 'arrowright':
            e.preventDefault();
            move('right');
            break;
    }
}

// === ИГРА СУПЕРБОЙЦЫ ===
let superfightersState = {
    player: null,
    enemies: [],
    gameRunning: false
};

function loadSuperfightersGame() {
    gameFrame.innerHTML = `
        <div class="game-canvas-container">
            <canvas id="superfightersCanvas" class="game-canvas" width="800" height="500"></canvas>
            <div class="game-instructions">
                <p>Здоровье: <span id="health">100</span> | Убито врагов: <span id="kills">0</span></p>
                <p>Управление: <span class="key">W</span><span class="key">A</span><span class="key">S</span><span class="key">D</span> для движения, 
                <span class="key">Пробел</span> для прыжка, <span class="key">J</span> и <span class="key">K</span> для атаки</p>
                <button id="startSuperfighters" class="btn" style="margin-top: 10px;">Начать игру</button>
                <button id="pauseSuperfighters" class="btn" style="margin-top: 10px; margin-left: 10px;">Пауза</button>
            </div>
        </div>
    `;
    
    initSuperfightersGame();
}

function initSuperfightersGame() {
    const canvas = document.getElementById('superfightersCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const startButton = document.getElementById('startSuperfighters');
    const pauseButton = document.getElementById('pauseSuperfighters');
    const healthElement = document.getElementById('health');
    const killsElement = document.getElementById('kills');
    
    if (!ctx || !startButton) return;
    
    // Инициализация состояния игры
    superfightersState = {
        player: {
            x: 100,
            y: 300,
            width: 50,
            height: 80,
            speed: 5,
            health: 100,
            isJumping: false,
            jumpForce: 15,
            gravity: 0.8,
            velocityY: 0,
            direction: 1,
            isAttacking: false,
            attackTimer: 0,
            attackType: 0
        },
        enemies: [],
        gameRunning: false,
        kills: 0
    };
    
    function initEnemies() {
        superfightersState.enemies = [];
        for (let i = 0; i < 3; i++) {
            superfightersState.enemies.push({
                x: 400 + i * 150,
                y: 300,
                width: 50,
                height: 80,
                speed: 2,
                health: 50,
                direction: Math.random() > 0.5 ? 1 : -1,
                type: i % 3
            });
        }
    }
    
    function gameLoop() {
        if (!superfightersState.gameRunning) return;
        
        // Очистка холста
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Отрисовка фона
        ctx.fillStyle = '#2c3e50';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Отрисовка земли
        ctx.fillStyle = '#27ae60';
        ctx.fillRect(0, 380, canvas.width, 120);
        
        // Обновление и отрисовка игрока
        updatePlayer();
        drawPlayer();
        
        // Обновление и отрисовка врагов
        updateEnemies();
        drawEnemies();
        
        // Проверка столкновений
        checkCollisions();
        
        // Обновление интерфейса
        if (healthElement) healthElement.textContent = Math.max(0, superfightersState.player.health);
        if (killsElement) killsElement.textContent = superfightersState.kills;
        
        // Проверка конца игры
        if (superfightersState.player.health <= 0) {
            superfightersState.gameRunning = false;
            ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = 'white';
            ctx.font = '40px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('Игра окончена!', canvas.width / 2, canvas.height / 2);
            ctx.font = '20px Arial';
            ctx.fillText(`Убито врагов: ${superfightersState.kills}`, canvas.width / 2, canvas.height / 2 + 40);
        } else if (superfightersState.enemies.length === 0) {
            superfightersState.gameRunning = false;
            ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = 'white';
            ctx.font = '40px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('Победа!', canvas.width / 2, canvas.height / 2);
            ctx.font = '20px Arial';
            ctx.fillText(`Убито врагов: ${superfightersState.kills}`, canvas.width / 2, canvas.height / 2 + 40);
        }
        
        if (superfightersState.gameRunning) {
            requestAnimationFrame(gameLoop);
        }
    }
    
    function updatePlayer() {
        const player = superfightersState.player;
        
        // Движение влево
        if (activeKeys['a'] || activeKeys['arrowleft']) {
            player.x -= player.speed;
            player.direction = -1;
        }
        
        // Движение вправо
        if (activeKeys['d'] || activeKeys['arrowright']) {
            player.x += player.speed;
            player.direction = 1;
        }
        
        // Прыжок
        if ((activeKeys['w'] || activeKeys['arrowup'] || activeKeys[' ']) && !player.isJumping) {
            player.isJumping = true;
            player.velocityY = -player.jumpForce;
        }
        
        // Гравитация
        if (player.isJumping) {
            player.y += player.velocityY;
            player.velocityY += player.gravity;
            
            if (player.y >= 300) {
                player.y = 300;
                player.isJumping = false;
                player.velocityY = 0;
            }
        }
        
        // Атака
        if (activeKeys['j'] || activeKeys['k']) {
            player.isAttacking = true;
            player.attackTimer = 10;
            player.attackType = activeKeys['j'] ? 1 : 2;
        }
        
        if (player.attackTimer > 0) {
            player.attackTimer--;
        } else {
            player.isAttacking = false;
        }
        
        // Границы
        if (player.x < 0) player.x = 0;
        if (player.x > canvas.width - player.width) player.x = canvas.width - player.width;
    }
    
    function drawPlayer() {
        const player = superfightersState.player;
        
        // Тело
        ctx.fillStyle = player.isAttacking ? '#e74c3c' : '#3498db';
        ctx.fillRect(player.x, player.y, player.width, player.height);
        
        // Голова
        ctx.fillStyle = '#ecf0f1';
        ctx.fillRect(player.x + 10, player.y - 20, 30, 20);
        
        // Глаза
        ctx.fillStyle = '#2c3e50';
        const eyeX = player.direction > 0 ? player.x + 25 : player.x + 15;
        ctx.fillRect(eyeX, player.y - 15, 5, 5);
        
        // Рука для атаки
        if (player.isAttacking) {
            ctx.fillStyle = player.attackType === 1 ? '#e74c3c' : '#f39c12';
            const attackX = player.direction > 0 ? player.x + player.width : player.x - 30;
            const attackWidth = player.attackType === 1 ? 30 : 40;
            ctx.fillRect(attackX, player.y + 20, attackWidth * player.direction, 15);
        }
        
        // Здоровье
        ctx.fillStyle = '#2ecc71';
        ctx.fillRect(player.x, player.y - 30, player.width * (player.health / 100), 5);
    }
    
    function updateEnemies() {
        superfightersState.enemies.forEach(enemy => {
            // Движение
            enemy.x += enemy.speed * enemy.direction;
            
            // Изменение направления при достижении границ
            if (enemy.x < 50 || enemy.x > canvas.width - 50 - enemy.width) {
                enemy.direction *= -1;
            }
            
            // Случайное изменение направления
            if (Math.random() < 0.01) {
                enemy.direction *= -1;
            }
            
            // Случайная атака
            if (Math.random() < 0.02) {
                enemy.attacking = true;
                enemy.attackTimer = 15;
            }
            
            if (enemy.attackTimer > 0) {
                enemy.attackTimer--;
            } else {
                enemy.attacking = false;
            }
        });
    }
    
    function drawEnemies() {
        superfightersState.enemies.forEach(enemy => {
            // Цвет в зависимости от типа
            const colors = ['#e74c3c', '#9b59b6', '#f39c12'];
            ctx.fillStyle = colors[enemy.type] || '#e74c3c';
            ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
            
            // Голова
            ctx.fillStyle = '#ecf0f1';
            ctx.fillRect(enemy.x + 10, enemy.y - 20, 30, 20);
            
            // Рука для атаки
            if (enemy.attacking) {
                ctx.fillStyle = '#c0392b';
                const attackX = enemy.direction > 0 ? enemy.x + enemy.width : enemy.x - 30;
                ctx.fillRect(attackX, enemy.y + 20, 30 * enemy.direction, 15);
            }
            
            // Здоровье
            ctx.fillStyle = '#2ecc71';
            ctx.fillRect(enemy.x, enemy.y - 30, enemy.width * (enemy.health / 50), 5);
        });
    }
    
    function checkCollisions() {
        const player = superfightersState.player;
        
        superfightersState.enemies.forEach((enemy, index) => {
            // Столкновение с игроком
            if (player.x < enemy.x + enemy.width &&
                player.x + player.width > enemy.x &&
                player.y < enemy.y + enemy.height &&
                player.y + player.height > enemy.y) {
                
                if (player.isAttacking) {
                    enemy.health -= player.attackType === 1 ? 10 : 15;
                    if (enemy.health <= 0) {
                        superfightersState.enemies.splice(index, 1);
                        superfightersState.kills++;
                    }
                } else if (enemy.attacking) {
                    player.health -= 5;
                }
            }
        });
    }
    
    startButton.addEventListener('click', () => {
        // Сброс игры
        superfightersState.player = {
            x: 100,
            y: 300,
            width: 50,
            height: 80,
            speed: 5,
            health: 100,
            isJumping: false,
            jumpForce: 15,
            gravity: 0.8,
            velocityY: 0,
            direction: 1,
            isAttacking: false,
            attackTimer: 0,
            attackType: 0
        };
        
        superfightersState.kills = 0;
        initEnemies();
        superfightersState.gameRunning = true;
        
        if (pauseButton) pauseButton.textContent = 'Пауза';
        
        gameLoop();
    });
    
    if (pauseButton) {
        pauseButton.addEventListener('click', () => {
            if (!superfightersState.gameRunning) return;
            
            superfightersState.gameRunning = !superfightersState.gameRunning;
            pauseButton.textContent = superfightersState.gameRunning ? 'Пауза' : 'Продолжить';
            
            if (superfightersState.gameRunning) {
                gameLoop();
            }
        });
    }
    
    // Начальная отрисовка
    initEnemies();
    drawPlayer();
    drawEnemies();
}

function handleSuperfightersInput(e) {
    // Для супербойцев управление уже обрабатывается через activeKeys
    // Ничего дополнительного не нужно
}

// Обнаружение мобильного устройства
function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// Автоматическое отображение мобильных контролов на мобильных устройствах
if (isMobileDevice()) {
    document.body.classList.add('mobile-device');
}