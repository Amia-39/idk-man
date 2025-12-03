const express = require('express');
const bodyParser = require('body-parser');
const app = express();

// 1. **CRITICAL FIX:** Use the environment variable $PORT provided by Render,
//    or default to 3000 for local development.
const PORT = process.env.PORT || 3000;

// Middleware to parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

/**
 * CLICKER GAME TEMPLATE
 * We define this as a string to inject into both GET and POST responses.
 * It includes CSS for styling and Client-Side JS for the game logic.
 */
const clickerGameHTML = `
    <style>
        .game-container {
            border: 2px solid #333;
            background-color: #f4f4f4;
            padding: 20px;
            margin: 20px auto;
            max-width: 400px;
            border-radius: 10px;
            text-align: center;
            font-family: Arial, sans-serif;
        }
        .score-board { font-size: 24px; font-weight: bold; margin-bottom: 15px; color: #2c3e50; }
        .btn-game {
            padding: 10px 20px;
            font-size: 16px;
            cursor: pointer;
            background-color: #007bff;
            color: white;
            border: none;
            border-radius: 5px;
            margin: 5px;
        }
        .btn-game:hover { background-color: #0056b3; }
        .btn-upgrade { background-color: #28a745; }
        .btn-upgrade:hover { background-color: #218838; }
        .btn-upgrade:disabled { background-color: #cccccc; cursor: not-allowed; }
    </style>

    <div class="game-container">
        <h3>🚀 Node Clicker</h3>
        <div class="score-board">Score: <span id="score">0</span></div>
        
        <button class="btn-game" onclick="clickBtn()">Click Me (+1)</button>
        <br><br>
        <button class="btn-game btn-upgrade" id="upgradeBtn" onclick="buyAutoClicker()">
            Buy Auto-Clicker (Cost: <span id="cost">10</span>)
        </button>
        <p>Auto-Clickers: <span id="autoCount">0</span></p>
    </div>

    <script>
        // Initialize state
        let score = 0;
        let autoClickers = 0;
        let autoClickerCost = 10;

        // Load from LocalStorage if available (So game saves on refresh!)
        if(localStorage.getItem('clickerSave')) {
            const save = JSON.parse(localStorage.getItem('clickerSave'));
            score = save.score;
            autoClickers = save.autoClickers;
            autoClickerCost = save.autoClickerCost;
        }

        // DOM Elements
        const scoreEl = document.getElementById('score');
        const costEl = document.getElementById('cost');
        const autoCountEl = document.getElementById('autoCount');
        const upgradeBtn = document.getElementById('upgradeBtn');

        // Update UI Function
        function updateUI() {
            scoreEl.innerText = Math.floor(score);
            costEl.innerText = autoClickerCost;
            autoCountEl.innerText = autoClickers;
            
            // Disable button if can't afford
            upgradeBtn.disabled = score < autoClickerCost;
            
            // Save progress
            localStorage.setItem('clickerSave', JSON.stringify({ score, autoClickers, autoClickerCost }));
        }

        // Main Click Action
        function clickBtn() {
            score++;
            updateUI();
        }

        // Upgrade Action
        function buyAutoClicker() {
            if (score >= autoClickerCost) {
                score -= autoClickerCost;
                autoClickers++;
                autoClickerCost = Math.round(autoClickerCost * 1.5); // Increase cost
                updateUI();
            }
        }

        // Game Loop (Runs every second)
        setInterval(() => {
            if (autoClickers > 0) {
                score += autoClickers;
                updateUI();
            }
        }, 1000);

        // Initial render
        updateUI();
    </script>
`;

// Handle GET requests (display the form + game)
app.get('/', (req, res) => {
    const checkResult = `<span style='color:red'> Try the magic word "fred"</span>`;
    
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Node Clicker & Form</title>
        </head>
        <body style="text-align:center;">
            <h3>Render-node-cam</h3>
            
            <form action="/" method="post" style="margin-bottom: 20px; border-bottom: 1px solid #ccc; padding-bottom: 20px;">
                <label for="myText01">Enter Text:</label>
                <input type="text" id="myText01" name="myText01">
                <input type="submit" value="Submit">
                <br><br>
                ${checkResult}
            </form>

            ${clickerGameHTML}

        </body>
        </html>
    `);
});

// Handle POST requests (process form + redisplay game)
app.post('/', (req, res) => {
    const myInputText01 = req.body.myText01;
    let myCheck = false;
    let checkResult = '';

    if (myInputText01 === 'fred') {
        myCheck = true;
    }

    if (myCheck) {
        checkResult = `<b style='color:green'> Cool! You found the magic word. </b>`;
    } else {
        checkResult = `<span style='color:red'> Try the magic word "fred"</span>`;
    }
    
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Node Clicker & Form</title>
        </head>
        <body style="text-align:center;">
            <h3>T2A27-node-cam</h3>
            
            <form action="/" method="post" style="margin-bottom: 20px; border-bottom: 1px solid #ccc; padding-bottom: 20px;">
                <label for="myText01">Enter Text:</label>
                <input type="text" id="myText01" name="myText01">
                <input type="submit" value="Submit">
                <br><br>
                ${checkResult}
            </form>

            ${clickerGameHTML}

        </body>
        </html>
    `);
});

// 2. **CRITICAL FIX:** Listen on the PORT variable.
app.listen(PORT, '0.0.0.0', () => {
    console.log(`App listening on port ${PORT}`);
});
