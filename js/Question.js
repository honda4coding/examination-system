class Question {
    constructor( id, text, options, correctAnswerIndex ) {
        this.id = id;
        this.text = text;
        this.options = options;
        this.correctIndex = correctAnswerIndex;
        this.userAnswer = undefined;    
    }

    isCorrect() {
        return this.userAnswer === this.correctIndex;
    }
}