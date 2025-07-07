import { Component } from '@angular/core';

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  userAnswer?: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  quiz: QuizQuestion[] = [];
  currentQuestionIndex = 0;
  showExplanation = false;

  get currentQuestion(): QuizQuestion | undefined {
    return this.quiz[this.currentQuestionIndex];
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e: any) => {
      const text = e.target.result as string;
      this.quiz = this.parseCSV(text);
      this.currentQuestionIndex = 0;
      this.showExplanation = false;
    };
    reader.readAsText(file);
  }

  parseCSV(text: string): QuizQuestion[] {
    const lines = text.trim().split(/\r?\n/);
    return lines.map(line => {
      const [q, a, b, c, d, correct, exp] = line.split(',');
      return {
        question: q,
        options: [a, b, c, d],
        correctAnswer: correct,
        explanation: exp
      } as QuizQuestion;
    });
  }

  selectOption(option: string) {
    if (this.currentQuestion) {
      this.currentQuestion.userAnswer = option;
    }
  }

  checkAnswer() {
    this.showExplanation = true;
  }

  nextQuestion() {
    this.showExplanation = false;
    if (this.currentQuestionIndex < this.quiz.length - 1) {
      this.currentQuestionIndex++;
    }
  }
}
