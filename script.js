class MemoryGame {
    constructor() {
        this.gameBoard = document.getElementById('game-board');
        this.movesElement = document.getElementById('moves');
        this.matchesElement = document.getElementById('matches');
        this.timerElement = document.getElementById('timer');
        this.resetBtn = document.getElementById('reset-btn');
        this.gameOverModal = document.getElementById('game-over-modal');
        this.playAgainBtn = document.getElementById('play-again-btn');
        this.finalMovesElement = document.getElementById('final-moves');
        this.finalTimeElement = document.getElementById('final-time');
        
        // Game state
        this.cards = [];
        this.flippedCards = [];
        this.matchedPairs = 0;
        this.moves = 0;
        this.gameStarted = false;
        this.gameStartTime = null;
        this.timerInterval = null;
        
        // Emoji pairs for the cards
        this.emojis = [
            '🐶', '🐱', '🐭', '🐹', 
            '🐰', '🦊', '🐻', '🐼',
            '🐨', '🐯', '🦁', '🐮',
            '🐷', '🐸', '🐵', '🐧'
        ];
        
        this.init();
    }
    
    init() {
        this.createGameBoard();
        this.attachEventListeners();
    }
    
    createGameBoard() {
        // Clear the board
        this.gameBoard.innerHTML = '';
        
        // Select 8 random emojis and duplicate them for pairs
        const selectedEmojis = this.emojis.slice(0, 8);
        const cardEmojis = [...selectedEmojis, ...selectedEmojis];
        
        // Shuffle the cards
        this.shuffleArray(cardEmojis);
        
        // Create card elements
        this.cards = [];
        cardEmojis.forEach((emoji, index) => {
            const card = this.createCard(emoji, index);
            this.cards.push(card);
            this.gameBoard.appendChild(card.element);
        });
    }
    
    createCard(emoji, index) {
        const cardElement = document.createElement('div');
        cardElement.className = 'card';
        cardElement.dataset.index = index;
        
        cardElement.innerHTML = `
            <div class="card-face card-front">${emoji}</div>
            <div class="card-face card-back">❓</div>
        `;
        
        const card = {
            element: cardElement,
            emoji: emoji,
            index: index,
            isFlipped: false,
            isMatched: false
        };
        
        cardElement.addEventListener('click', () => this.flipCard(card));
        
        return card;
    }
    
    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }
    
    flipCard(card) {
        // Don't flip if card is already flipped, matched, or we have 2 cards flipped
        if (card.isFlipped || card.isMatched || this.flippedCards.length === 2) {
            return;
        }
        
        // Start the game timer on first move
        if (!this.gameStarted) {
            this.startGame();
        }
        
        // Flip the card
        card.isFlipped = true;
        card.element.classList.add('flipped');
        this.flippedCards.push(card);
        
        // Check for match when 2 cards are flipped
        if (this.flippedCards.length === 2) {
            this.moves++;
            this.updateMoves();
            
            setTimeout(() => {
                this.checkForMatch();
            }, 1000);
        }
    }
    
    checkForMatch() {
        const [card1, card2] = this.flippedCards;
        
        if (card1.emoji === card2.emoji) {
            // Match found
            card1.isMatched = true;
            card2.isMatched = true;
            card1.element.classList.add('matched');
            card2.element.classList.add('matched');
            
            this.matchedPairs++;
            this.updateMatches();
            
            // Check for game completion
            if (this.matchedPairs === 8) {
                this.endGame();
            }
        } else {
            // No match - flip cards back
            card1.isFlipped = false;
            card2.isFlipped = false;
            card1.element.classList.remove('flipped');
            card2.element.classList.remove('flipped');
        }
        
        // Clear flipped cards array
        this.flippedCards = [];
    }
    
    startGame() {
        this.gameStarted = true;
        this.gameStartTime = Date.now();
        this.startTimer();
    }
    
    startTimer() {
        this.timerInterval = setInterval(() => {
            const elapsed = Date.now() - this.gameStartTime;
            const minutes = Math.floor(elapsed / 60000);
            const seconds = Math.floor((elapsed % 60000) / 1000);
            this.timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }, 1000);
    }
    
    endGame() {
        clearInterval(this.timerInterval);
        
        // Show completion modal
        this.finalMovesElement.textContent = this.moves;
        this.finalTimeElement.textContent = this.timerElement.textContent;
        this.gameOverModal.classList.add('show');
    }
    
    resetGame() {
        // Clear game state
        this.flippedCards = [];
        this.matchedPairs = 0;
        this.moves = 0;
        this.gameStarted = false;
        this.gameStartTime = null;
        
        // Clear timer
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
        
        // Reset UI
        this.updateMoves();
        this.updateMatches();
        this.timerElement.textContent = '00:00';
        this.gameOverModal.classList.remove('show');
        
        // Create new game board
        this.createGameBoard();
    }
    
    updateMoves() {
        this.movesElement.textContent = this.moves;
    }
    
    updateMatches() {
        this.matchesElement.textContent = this.matchedPairs;
    }
    
    attachEventListeners() {
        this.resetBtn.addEventListener('click', () => this.resetGame());
        this.playAgainBtn.addEventListener('click', () => this.resetGame());
        
        // Close modal when clicking outside
        this.gameOverModal.addEventListener('click', (e) => {
            if (e.target === this.gameOverModal) {
                this.gameOverModal.classList.remove('show');
            }
        });
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new MemoryGame();
});