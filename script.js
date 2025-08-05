class MemoryGame {
    constructor() {
        this.cards = [];
        this.flippedCards = [];
        this.matchedPairs = 0;
        this.moves = 0;
        this.score = 0;
        this.gameStarted = false;
        this.timer = null;
        this.seconds = 0;
        this.isProcessing = false;
        
        // Emoji pairs for the game
        this.emojiPairs = [
            '🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼',
            '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🐔'
        ];
        
        this.initializeGame();
        this.setupEventListeners();
    }
    
    initializeGame() {
        this.createCards();
        this.shuffleCards();
        this.renderCards();
        this.updateDisplay();
    }
    
    createCards() {
        this.cards = [];
        const gameEmojis = this.emojiPairs.slice(0, 8); // Use 8 pairs for 16 cards
        
        // Create pairs of cards
        gameEmojis.forEach(emoji => {
            this.cards.push({ emoji, id: Math.random(), isFlipped: false, isMatched: false });
            this.cards.push({ emoji, id: Math.random(), isFlipped: false, isMatched: false });
        });
    }
    
    shuffleCards() {
        for (let i = this.cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
        }
    }
    
    renderCards() {
        const gameBoard = document.getElementById('game-board');
        gameBoard.innerHTML = '';
        
        this.cards.forEach((card, index) => {
            const cardElement = document.createElement('div');
            cardElement.className = 'card';
            cardElement.dataset.index = index;
            
            if (card.isFlipped || card.isMatched) {
                cardElement.classList.add('flipped');
            }
            
            if (card.isMatched) {
                cardElement.classList.add('matched');
            }
            
            cardElement.innerHTML = `
                <div class="card-front">?</div>
                <div class="card-back">${card.emoji}</div>
            `;
            
            gameBoard.appendChild(cardElement);
        });
    }
    
    setupEventListeners() {
        const gameBoard = document.getElementById('game-board');
        const resetBtn = document.getElementById('reset-btn');
        const playAgainBtn = document.getElementById('play-again-btn');
        
        gameBoard.addEventListener('click', (e) => {
            const card = e.target.closest('.card');
            if (card && !this.isProcessing) {
                this.flipCard(parseInt(card.dataset.index));
            }
        });
        
        resetBtn.addEventListener('click', () => {
            this.resetGame();
        });
        
        playAgainBtn.addEventListener('click', () => {
            this.hideGameOver();
            this.resetGame();
        });
    }
    
    flipCard(index) {
        const card = this.cards[index];
        
        if (card.isFlipped || card.isMatched || this.flippedCards.length >= 2) {
            return;
        }
        
        // Start timer on first card flip
        if (!this.gameStarted) {
            this.startTimer();
            this.gameStarted = true;
        }
        
        card.isFlipped = true;
        this.flippedCards.push(index);
        
        this.renderCards();
        
        if (this.flippedCards.length === 2) {
            this.moves++;
            this.checkMatch();
        }
        
        this.updateDisplay();
    }
    
    checkMatch() {
        this.isProcessing = true;
        
        const [index1, index2] = this.flippedCards;
        const card1 = this.cards[index1];
        const card2 = this.cards[index2];
        
        setTimeout(() => {
            if (card1.emoji === card2.emoji) {
                // Match found
                card1.isMatched = true;
                card2.isMatched = true;
                this.matchedPairs++;
                this.score += 10;
                
                if (this.matchedPairs === 8) { // All pairs matched
                    this.endGame();
                }
            } else {
                // No match
                card1.isFlipped = false;
                card2.isFlipped = false;
            }
            
            this.flippedCards = [];
            this.isProcessing = false;
            this.renderCards();
            this.updateDisplay();
        }, 1000);
    }
    
    startTimer() {
        this.timer = setInterval(() => {
            this.seconds++;
            this.updateTimer();
        }, 1000);
    }
    
    updateTimer() {
        const minutes = Math.floor(this.seconds / 60);
        const seconds = this.seconds % 60;
        const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        document.getElementById('timer').textContent = timeString;
    }
    
    updateDisplay() {
        document.getElementById('score').textContent = this.score;
        document.getElementById('moves').textContent = this.moves;
    }
    
    endGame() {
        clearInterval(this.timer);
        
        const minutes = Math.floor(this.seconds / 60);
        const seconds = this.seconds % 60;
        const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        document.getElementById('final-time').textContent = timeString;
        document.getElementById('final-moves').textContent = this.moves;
        document.getElementById('final-score').textContent = this.score;
        
        document.getElementById('game-over').style.display = 'flex';
    }
    
    hideGameOver() {
        document.getElementById('game-over').style.display = 'none';
    }
    
    resetGame() {
        clearInterval(this.timer);
        this.cards = [];
        this.flippedCards = [];
        this.matchedPairs = 0;
        this.moves = 0;
        this.score = 0;
        this.gameStarted = false;
        this.seconds = 0;
        this.isProcessing = false;
        
        this.initializeGame();
        this.updateTimer();
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new MemoryGame();
});