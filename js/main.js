const facts = [
    "Wusstest du? Jingle Bells war ursprünglich ein Thanksgiving-Lied.",
    "Die erste SMS der Welt hieß 'Merry Christmas' und wurde 1992 verschickt.",
    "In Japan isst man traditionell KFC zu Weihnachten.",
    "Spinnen am Weihnachtsbaum gelten in Polen, Deutschland und der Ukraine als Glücksbringer.",
    "Alle Rentiere des Weihnachtsmanns sind weiblich, da männliche Rentiere im Winter ihr Geweih verlieren.",
    "Der größte Schneemann der Welt war über 37 Meter hoch.",
    "Weihnachtsbäume wachsen etwa 7-10 Jahre, bevor sie verkauft werden.",
    "Die Tradition des Weihnachtsbaums startete in Deutschland im 16. Jahrhundert.",
    "Rudolph das Rentier wurde 1939 als Werbefigur für ein Kaufhaus erfunden.",
    "Es gibt eine Insel namens 'Christmas Island' im Indischen Ozean.",
    "In Norwegen versteckt man an Heiligabend alle Besen, damit Hexen sie nicht stehlen.",
    "Der Begriff 'X-mas' kommt aus dem Griechischen, wo X (Chi) für Christus steht."
];

const quotes = [
    { type: 'joke', content: 'Warum hat der Weihnachtsmann keinen Führerschein? Weil er einen Schlitten hat!' },
    { type: 'joke', content: 'Was macht der Weihnachtsmann im Sommer? Ferien in den Tropen!' },
    { type: 'joke', content: 'Welches ist die Lieblingsband der Rentiere? The Be-atles!' },
    { type: 'joke', content: 'Was essen Schneemänner zum Frühstück? Schneeflocken!' },
    { type: 'joke', content: 'Was ist rot, weiß und fliegt durch die Luft? Der Weihnachtsmann, der aus der Kurve geflogen ist!' },
    { type: 'joke', content: 'Warum sind Weihnachtsbäume schlechte Strickerinnen? Weil sie immer ihre Nadeln verlieren!' },
    { type: 'motivation', content: 'Glaube an dich selbst und alles ist möglich. Du schaffst das! 💪' },
    { type: 'motivation', content: 'Jeder Tag ist eine neue Chance, besser zu werden. Nutze sie! ⭐' },
    { type: 'motivation', content: 'Der einzige Weg, großartige Arbeit zu leisten, ist zu lieben, was du tust. 🎯' },
    { type: 'motivation', content: 'Kleine Schritte führen zu großen Veränderungen. Bleib dran! 🚀' },
    { type: 'motivation', content: 'Du bist stärker als du denkst. Gib niemals auf! 💎' },
    { type: 'motivation', content: 'Träume groß, arbeite hart, bleibe fokussiert und umgebe dich mit guten Menschen! ✨' }
];

const TEST_MODE = false; // Set to false for real Advent Calendar behavior (Dec 1-24)

class AdventCalendar {
    constructor() {
        this.doorsContainer = document.getElementById('doors-container');
        this.modal = document.getElementById('modal');
        this.modalBody = document.getElementById('modal-body');
        this.closeBtn = document.querySelector('.close-btn');

        this.state = this.loadState();
        this.init();
    }

    loadState() {
        const saved = localStorage.getItem('adventCalendarState');
        if (saved) {
            return JSON.parse(saved);
        }
        return this.generateInitialState();
    }

    generateInitialState() {
        // Create an array of 24 items (12 facts, 12 quotes)
        let items = [];

        // Add facts
        facts.forEach(fact => items.push({ type: 'fact', content: fact }));

        // Add quotes (jokes + motivational)
        quotes.forEach(quote => items.push({ type: quote.type, content: quote.content }));

        // Shuffle items
        items = this.shuffleArray(items);

        // Assign to days 1-24
        const doorAssignments = {};
        items.forEach((item, index) => {
            doorAssignments[index + 1] = {
                day: index + 1,
                ...item,
                opened: false
            };
        });

        const state = {
            assignments: doorAssignments
        };

        this.saveState(state);
        return state;
    }

    saveState(state) {
        localStorage.setItem('adventCalendarState', JSON.stringify(state));
    }

    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    init() {
        this.renderDoors();
        this.addEventListeners();
    }

    renderDoors() {
        this.doorsContainer.innerHTML = '';
        const days = Object.keys(this.state.assignments).map(Number);

        const shuffledDays = this.shuffleArray([...days]);

        shuffledDays.forEach(day => {
            const data = this.state.assignments[day];
            const door = document.createElement('div');
            door.classList.add('door');
            if (data.opened) {
                door.classList.add('opened');
            }
            door.textContent = day;
            door.dataset.day = day;

            const rotation = (Math.random() * 6 - 3).toFixed(1);
            door.style.transform = `rotate(${rotation}deg)`;

            door.addEventListener('click', () => this.handleDoorClick(day));

            this.doorsContainer.appendChild(door);
        });
    }

    addEventListeners() {
        this.closeBtn.addEventListener('click', () => this.closeModal());
        window.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.closeModal();
            }
        });
    }

    handleDoorClick(day) {
        const today = new Date();
        const currentMonth = today.getMonth();
        const currentDay = today.getDate();

        const doorData = this.state.assignments[day];

        // Allow opening if it's already opened OR if it's the correct date
        if (!doorData.opened && !TEST_MODE) {
            if (currentMonth !== 11) {
                alert("Es ist noch nicht Dezember! Geduld!");
                return;
            }
            if (day > currentDay) {
                alert(`Du kannst dieses Türchen erst am ${day}. Dezember öffnen!`);
                return;
            }
        }

        const doorEl = document.querySelector(`.door[data-day="${day}"]`);

        if (!doorData.opened && doorEl) {
            doorEl.classList.add('shake');
            setTimeout(() => {
                doorEl.classList.remove('shake');
            }, 500);
        }

        this.executeOpening(day);
    }

    executeOpening(day) {
        const doorData = this.state.assignments[day];

        if (!doorData.opened) {
            doorData.opened = true;
            this.state.assignments[day] = doorData;
            this.saveState(this.state);

            const doorEl = document.querySelector(`.door[data-day="${day}"]`);
            if (doorEl) {
                doorEl.classList.add('opened');
            }
        }

        this.showContent(doorData);
        this.createSnowEffect();
    }

    showContent(data) {
        this.modalBody.innerHTML = '';

        const title = document.createElement('h2');
        title.textContent = `Türchen ${data.day}`;
        this.modalBody.appendChild(title);

        const p = document.createElement('p');
        p.textContent = data.content;
        this.modalBody.appendChild(p);

        // Add badge for type
        if (data.type === 'joke' || data.type === 'motivation') {
            const badge = document.createElement('span');
            badge.className = 'quote-type';
            badge.textContent = data.type === 'joke' ? '😄 Witz' : '💪 Motivation';
            this.modalBody.appendChild(badge);
        }

        this.modal.classList.remove('hidden');
        this.modal.classList.add('visible');
    }

    createSnowEffect() {
        const duration = 5000; // 5 seconds
        const snowflakes = 30;
        const confettiCount = 20;

        // Create snowflakes
        for (let i = 0; i < snowflakes; i++) {
            setTimeout(() => {
                const snowflake = document.createElement('div');
                snowflake.className = 'snowflake';
                snowflake.textContent = '❄';
                snowflake.style.left = Math.random() * 100 + '%';
                snowflake.style.setProperty('--drift', (Math.random() * 200 - 100) + 'px');
                snowflake.style.animationDuration = (Math.random() * 3 + 3) + 's';
                document.body.appendChild(snowflake);

                setTimeout(() => snowflake.remove(), 6000);
            }, i * 100);
        }

        // Create confetti
        for (let i = 0; i < confettiCount; i++) {
            setTimeout(() => {
                const confetti = document.createElement('div');
                confetti.className = 'confetti';
                const colors = ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A'];
                confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
                confetti.style.left = Math.random() * 100 + '%';
                confetti.style.setProperty('--drift', (Math.random() * 300 - 150) + 'px');
                confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';
                document.body.appendChild(confetti);

                setTimeout(() => confetti.remove(), 4000);
            }, i * 50);
        }
    }

    closeModal() {
        this.modal.classList.remove('visible');
        this.modal.classList.add('hidden');
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    new AdventCalendar();
});
