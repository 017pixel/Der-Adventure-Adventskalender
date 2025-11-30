export class GameLogic {
    constructor(container) {
        this.container = container;
    }

    render(gameData) {
        this.container.innerHTML = '';
        const wrapper = document.createElement('div');
        wrapper.className = 'game-wrapper';

        const title = document.createElement('h3');
        title.textContent = gameData.title;
        wrapper.appendChild(title);

        const instruction = document.createElement('p');
        instruction.textContent = gameData.instruction || gameData.question;
        wrapper.appendChild(instruction);

        const gameArea = document.createElement('div');
        gameArea.className = 'game-area';
        wrapper.appendChild(gameArea);

        this.container.appendChild(wrapper);

        switch (gameData.type) {
            case 'clicker': this.initClicker(gameArea); break;
            case 'quiz': this.initQuiz(gameArea, gameData); break;
            case 'find': this.initFind(gameArea); break;
            case 'memory': this.initMemory(gameArea); break;
            case 'catch': this.initCatch(gameArea); break;
            case 'guess': this.initGuess(gameArea); break;
            case 'rps': this.initRPS(gameArea); break;
            case 'reaction': this.initReaction(gameArea); break;
            case 'cookie': this.initCookie(gameArea); break;
            case 'snowball': this.initSnowball(gameArea); break;
            case 'joke': this.initJoke(gameArea); break;
            case 'wish': this.initWish(gameArea); break;
            default: gameArea.textContent = 'Spiel nicht gefunden.';
        }
    }

    // 1. Clicker
    initClicker(area) {
        let clicks = 0;
        const target = 10;
        const btn = document.createElement('button');
        btn.className = 'game-btn';
        btn.textContent = `Klicke mich! (0/${target})`;

        const progress = document.createElement('div');
        progress.className = 'progress-bar';
        const fill = document.createElement('div');
        fill.className = 'progress-fill';
        progress.appendChild(fill);

        btn.onclick = () => {
            clicks++;
            btn.textContent = `Klicke mich! (${clicks}/${target})`;
            fill.style.width = `${(clicks / target) * 100}%`;

            if (clicks >= target) {
                btn.disabled = true;
                btn.textContent = 'Geschafft! 🎁';
                this.showWin();
            }
        };

        area.appendChild(btn);
        area.appendChild(progress);
    }

    // 2. Quiz
    initQuiz(area, data) {
        const options = ['8', '9', '10', '12']; // Hardcoded options for the specific question
        options.forEach(opt => {
            const btn = document.createElement('button');
            btn.className = 'game-btn quiz-btn';
            btn.textContent = opt;
            btn.onclick = () => {
                if (opt === data.answer) {
                    btn.style.background = 'green';
                    this.showWin('Richtig!');
                } else {
                    btn.style.background = 'red';
                    setTimeout(() => btn.style.background = '', 500);
                }
            };
            area.appendChild(btn);
        });
    }

    // 3. Find the Star
    initFind(area) {
        area.style.position = 'relative';
        area.style.height = '200px';
        area.style.background = '#222';
        area.style.overflow = 'hidden';
        area.style.cursor = 'crosshair';

        // Distractions
        for (let i = 0; i < 20; i++) {
            const dot = document.createElement('div');
            dot.className = 'distraction';
            dot.style.left = Math.random() * 90 + '%';
            dot.style.top = Math.random() * 90 + '%';
            area.appendChild(dot);
        }

        // Target
        const star = document.createElement('div');
        star.className = 'hidden-star';
        star.textContent = '⭐';
        star.style.left = Math.random() * 90 + '%';
        star.style.top = Math.random() * 90 + '%';
        star.onclick = (e) => {
            e.stopPropagation();
            star.style.transform = 'scale(2)';
            this.showWin('Gefunden!');
        };
        area.appendChild(star);
    }

    // 4. Memory (Mini)
    initMemory(area) {
        const icons = ['🎅', '🎄',];
        let cards = [...icons, ...icons];
        // Shuffle
        cards.sort(() => Math.random() - 0.5);

        area.className = 'memory-grid';
        let flipped = [];
        let matched = 0;

        cards.forEach((icon, index) => {
            const card = document.createElement('div');
            card.className = 'memory-card';
            card.dataset.icon = icon;
            card.dataset.index = index;
            card.textContent = '?';

            card.onclick = () => {
                if (flipped.length < 2 && !card.classList.contains('flipped') && !card.classList.contains('matched')) {
                    card.classList.add('flipped');
                    card.textContent = icon;
                    flipped.push(card);

                    if (flipped.length === 2) {
                        setTimeout(() => {
                            if (flipped[0].dataset.icon === flipped[1].dataset.icon) {
                                flipped.forEach(c => c.classList.add('matched'));
                                matched++;
                                if (matched === icons.length) this.showWin();
                            } else {
                                flipped.forEach(c => {
                                    c.classList.remove('flipped');
                                    c.textContent = '?';
                                });
                            }
                            flipped = [];
                        }, 800);
                    }
                }
            };
            area.appendChild(card);
        });
    }

    // 5. Catch the Snowflake
    initCatch(area) {
        area.style.position = 'relative';
        area.style.height = '200px';
        area.style.background = '#1a1a1a';

        const flake = document.createElement('div');
        flake.textContent = '❄️';
        flake.className = 'moving-target';

        let caught = false;
        flake.onclick = () => {
            caught = true;
            flake.style.animation = 'none';
            this.showWin('Gefangen!');
        };

        area.appendChild(flake);

        // Simple movement loop
        const move = () => {
            if (caught) return;
            flake.style.left = Math.random() * 90 + '%';
            flake.style.top = Math.random() * 90 + '%';
            setTimeout(move, 800);
        };
        move();
    }

    // 6. Guess Number
    initGuess(area) {
        const target = Math.floor(Math.random() * 10) + 1;
        const input = document.createElement('input');
        input.type = 'number';
        input.placeholder = '1-10';
        input.className = 'game-input';

        const btn = document.createElement('button');
        btn.className = 'game-btn';
        btn.textContent = 'Raten';

        const msg = document.createElement('p');

        btn.onclick = () => {
            const val = parseInt(input.value);
            if (val === target) {
                msg.textContent = 'Richtig!';
                msg.style.color = 'green';
                this.showWin();
            } else if (val < target) {
                msg.textContent = 'Zu niedrig!';
            } else {
                msg.textContent = 'Zu hoch!';
            }
        };

        area.appendChild(input);
        area.appendChild(btn);
        area.appendChild(msg);
    }

    // 7. RPS
    initRPS(area) {
        const choices = ['✂️', '🪨', '📄'];
        const resultDiv = document.createElement('div');
        resultDiv.className = 'rps-result';

        choices.forEach(choice => {
            const btn = document.createElement('button');
            btn.className = 'game-btn rps-btn';
            btn.textContent = choice;
            btn.onclick = () => {
                const botChoice = choices[Math.floor(Math.random() * 3)];
                let result = '';
                if (choice === botChoice) result = 'Unentschieden!';
                else if (
                    (choice === '✂️' && botChoice === '📄') ||
                    (choice === '🪨' && botChoice === '✂️') ||
                    (choice === '📄' && botChoice === '🪨')
                ) {
                    result = 'Gewonnen!';
                    this.showWin();
                } else {
                    result = 'Verloren!';
                }
                resultDiv.innerHTML = `Du: ${choice} vs Bot: ${botChoice}<br><b>${result}</b>`;
            };
            area.appendChild(btn);
        });
        area.appendChild(resultDiv);
    }

    // 8. Reaction
    initReaction(area) {
        const box = document.createElement('div');
        box.className = 'reaction-box';
        box.textContent = 'Warte auf Grün...';

        let startTime = 0;
        let waiting = true;

        const start = () => {
            box.style.background = 'red';
            box.textContent = 'Warte...';
            waiting = true;
            const delay = 1000 + Math.random() * 3000;

            setTimeout(() => {
                if (!box.isConnected) return; // Cleanup check
                box.style.background = 'green';
                box.textContent = 'KLICK!';
                startTime = Date.now();
                waiting = false;
            }, delay);
        };

        box.onclick = () => {
            if (waiting) {
                if (box.style.background === 'red') {
                    box.textContent = 'Zu früh!';
                    setTimeout(start, 1000);
                }
            } else {
                const time = Date.now() - startTime;
                box.textContent = `${time}ms!`;
                this.showWin();
            }
        };

        area.appendChild(box);
        start();
    }

    // 9. Cookie Decorator
    initCookie(area) {
        const cookie = document.createElement('div');
        cookie.className = 'cookie-base';

        const toppings = ['🔴', '🟢', '⚪', '🍫'];
        let currentTopping = 0;

        const palette = document.createElement('div');
        toppings.forEach((t, i) => {
            const btn = document.createElement('button');
            btn.textContent = t;
            btn.className = 'topping-btn';
            btn.onclick = () => currentTopping = i;
            palette.appendChild(btn);
        });

        cookie.onclick = (e) => {
            const rect = cookie.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const drop = document.createElement('div');
            drop.textContent = toppings[currentTopping];
            drop.style.position = 'absolute';
            drop.style.left = x + 'px';
            drop.style.top = y + 'px';
            drop.style.transform = 'translate(-50%, -50%)';
            drop.style.pointerEvents = 'none';
            cookie.appendChild(drop);
        };

        area.appendChild(palette);
        area.appendChild(cookie);
    }

    // 10. Snowball Throw
    initSnowball(area) {
        area.style.position = 'relative';
        area.style.height = '200px';
        area.style.overflow = 'hidden';
        area.style.background = '#333';

        let score = 0;
        const scoreDisplay = document.createElement('div');
        scoreDisplay.textContent = 'Treffer: 0';
        area.appendChild(scoreDisplay);

        const spawnTarget = () => {
            if (!area.isConnected) return;
            const target = document.createElement('div');
            target.textContent = '🎯';
            target.className = 'snowball-target';
            target.style.left = Math.random() * 90 + '%';
            target.style.top = '-30px';

            target.onclick = () => {
                score++;
                scoreDisplay.textContent = `Treffer: ${score}`;
                target.remove();
                if (score >= 5) this.showWin();
            };

            area.appendChild(target);

            // Animate falling
            let pos = -30;
            const fall = setInterval(() => {
                pos += 2;
                target.style.top = pos + 'px';
                if (pos > 200) {
                    clearInterval(fall);
                    if (target.parentNode) target.remove();
                }
            }, 20);

            setTimeout(spawnTarget, 1000);
        };

        spawnTarget();
    }

    // 11. Joke
    initJoke(area) {
        const jokes = [
            "Was macht der Weihnachtsmann im Sommer? - Er macht Ferien in den Tropen.",
            "Welches ist die Lieblingsband der Rentiere? - The Be-atles (Rentier-Laute).",
            "Warum hat der Weihnachtsmann keinen Führerschein? - Weil er einen Schlitten hat.",
            "Was essen Schneemänner zum Frühstück? - Schneeflocken.",
            "Was ist rot, weiß und fliegt durch die Luft? - Der Weihnachtsmann, der aus der Kurve geflogen ist."
        ];
        const p = document.createElement('p');
        p.className = 'joke-text';
        p.textContent = jokes[Math.floor(Math.random() * jokes.length)];
        area.appendChild(p);
    }

    // 12. Wishlist
    initWish(area) {
        const textarea = document.createElement('textarea');
        textarea.className = 'wish-input';
        textarea.placeholder = 'Dein Wunsch...';

        const savedWish = localStorage.getItem('xmas_wish');
        if (savedWish) textarea.value = savedWish;

        const btn = document.createElement('button');
        btn.className = 'game-btn';
        btn.textContent = 'Speichern';
        btn.onclick = () => {
            localStorage.setItem('xmas_wish', textarea.value);
            this.showWin('Gespeichert!');
        };

        area.appendChild(textarea);
        area.appendChild(btn);
    }

    showWin(msg = 'Gut gemacht!') {
        // Simple visual feedback
        const win = document.createElement('div');
        win.className = 'win-overlay';
        win.textContent = msg;
        this.container.appendChild(win);
        setTimeout(() => win.remove(), 2000);
    }
}
w