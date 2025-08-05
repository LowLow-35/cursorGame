class MemoryGame {
    constructor() {
        this.cards = [];
        this.flippedCards = [];
        this.matchedPairs = 0;
        this.moves = 0;
        this.gameStarted = false;
        this.startTime = null;
        this.timerInterval = null;
        this.totalPairs = 8; // 4x4 grid = 16 cards = 8 pairs
        
        // Emoji array for the cards
        this.emojiList = [
            '🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼',
            '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🐔',
            '🐧', '🐦', '🦆', '🦅', '🦉', '🦇', '🐺', '🐗',
            '🐴', '🦄', '🐝', '🐛', '🐌', '🐞', '🐜', '🦗'
        ];
        
        this.init();
    }
    
    init() {
        this.createCards();
        this.setupEventListeners();
        this.updateDisplay();
    }
    
    createCards() {
        const gameBoard = document.getElementById('game-board');
        gameBoard.innerHTML = '';
        
        // Select random emojis for this game
        const selectedEmojis = this.getRandomEmojis(this.totalPairs);
        this.cards = [];
        
        // Create pairs of cards
        for (let i = 0; i < this.totalPairs; i++) {
            const emoji = selectedEmojis[i];
            
            // Create two cards with the same emoji
            for (let j = 0; j < 2; j++) {
                const card = this.createCard(emoji);
                this.cards.push(card);
                gameBoard.appendChild(card.element);
            }
        }
        
        // Shuffle the cards
        this.shuffleCards();
    }
    
    getRandomEmojis(count) {
        const shuffled = [...this.emojiList].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    }
    
    createCard(emoji) {
        const cardElement = document.createElement('div');
        cardElement.className = 'card';
        cardElement.innerHTML = `
            <div class="card-front">❓</div>
            <div class="card-back">${emoji}</div>
        `;
        
        const card = {
            element: cardElement,
            emoji: emoji,
            isFlipped: false,
            isMatched: false
        };
        
        return card;
    }
    
    shuffleCards() {
        const gameBoard = document.getElementById('game-board');
        const cards = Array.from(gameBoard.children);
        
        // Fisher-Yates shuffle
        for (let i = cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            gameBoard.appendChild(cards[j]);
        }
    }
    
    setupEventListeners() {
        // Card click events
        document.addEventListener('click', (e) => {
            if (e.target.closest('.card')) {
                const cardElement = e.target.closest('.card');
                const card = this.cards.find(c => c.element === cardElement);
                
                if (card && !card.isFlipped && !card.isMatched && this.flippedCards.length < 2) {
                    this.flipCard(card);
                }
            }
        });
        
        // Reset button
        document.getElementById('reset-btn').addEventListener('click', () => {
            this.resetGame();
        });
        
        // Play again button
        document.getElementById('play-again-btn').addEventListener('click', () => {
            this.resetGame();
            document.getElementById('game-over').style.display = 'none';
        });
    }
    
    flipCard(card) {
        if (!this.gameStarted) {
            this.startGame();
        }
        
        card.isFlipped = true;
        card.element.classList.add('flipped');
        this.flippedCards.push(card);
        
        if (this.flippedCards.length === 2) {
            this.moves++;
            this.updateDisplay();
            this.checkMatch();
        }
    }
    
    checkMatch() {
        const [card1, card2] = this.flippedCards;
        
        if (card1.emoji === card2.emoji) {
            // Match found
            card1.isMatched = true;
            card2.isMatched = true;
            card1.element.classList.add('matched');
            card2.element.classList.add('matched');
            
            this.matchedPairs++;
            this.flippedCards = [];
            
            if (this.matchedPairs === this.totalPairs) {
                this.endGame();
            }
        } else {
            // No match, flip cards back
            setTimeout(() => {
                card1.isFlipped = false;
                card2.isFlipped = false;
                card1.element.classList.remove('flipped');
                card2.element.classList.remove('flipped');
                this.flippedCards = [];
            }, 1000);
        }
    }
    
    startGame() {
        this.gameStarted = true;
        this.startTime = Date.now();
        this.startTimer();
    }
    
    startTimer() {
        this.timerInterval = setInterval(() => {
            this.updateTimer();
        }, 1000);
    }
    
    updateTimer() {
        if (this.startTime) {
            const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
            const minutes = Math.floor(elapsed / 60);
            const seconds = elapsed % 60;
            const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            document.getElementById('timer').textContent = timeString;
        }
    }
    
    endGame() {
        clearInterval(this.timerInterval);
        
        // Update final stats
        document.getElementById('final-moves').textContent = this.moves;
        document.getElementById('final-time').textContent = document.getElementById('timer').textContent;
        
        // Show game over screen
        setTimeout(() => {
            document.getElementById('game-over').style.display = 'flex';
        }, 500);
    }
    
    resetGame() {
        // Reset game state
        this.matchedPairs = 0;
        this.moves = 0;
        this.gameStarted = false;
        this.flippedCards = [];
        
        // Clear timer
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
        
        // Reset display
        document.getElementById('moves').textContent = '0';
        document.getElementById('timer').textContent = '00:00';
        
        // Create new cards
        this.createCards();
    }
    
    updateDisplay() {
        document.getElementById('moves').textContent = this.moves;
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new MemoryGame();
});