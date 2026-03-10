class Question {
    constructor( id, text, options, correctAnswerIndex ) {
        this.id = id;
        this.text = text;
        this.options = options;
        this.correctIndex = correctAnswerIndex;
        this.userAnswer = null; 
        this.isMarked = false;
    }

    isCorrect() {
        return this.userAnswer === this.correctIndex;
    }
}