const operations = ["+", "-"];
let correctAnswers = 0;
let incorrectAnswers = 0;
let selectedButton = null;

const gameInterface = document.getElementById("game-interface");
const resultsInterface = document.getElementById("results-interface");
const questionElement = document.getElementById("question");
const answersElement = document.getElementById("answers");
const messageElement = document.getElementById("message");
const correctAnswersElement = document.getElementById("correct-answers");
const incorrectAnswersElement = document.getElementById("incorrect-answers");
const percentageElement = document.getElementById("percentage");
const nextRoundButton = document.getElementById("next-round");
const endGameButton = document.getElementById("end-game");
const personalizedMessageElement = document.getElementById("personalized-message");

function generateRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function evaluateExpression(expression) {
  return new Function(`return ${expression}`)();
}

function generateQuestion() {
  const num1 = generateRandomNumber(1, 10);
  const num2 = generateRandomNumber(1, 10);
  const operation = operations[generateRandomNumber(0, 1)];
  const expression = `${num1} ${operation} ${num2}`;
  const answer = evaluateExpression(expression);
  return { expression, answer };
}

function generateAnswers(correctAnswer) {
  const answers = [correctAnswer];
  while (answers.length < 3) {
    const invalidAnswer = generateRandomNumber(correctAnswer - 5, correctAnswer + 5);
    if (invalidAnswer !== correctAnswer && !answers.includes(invalidAnswer)) {
      answers.push(invalidAnswer);
    }
  }
  return shuffleArray(answers);
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function startRound() {
  const { expression, answer } = generateQuestion();
  const answers = generateAnswers(answer);

  questionElement.textContent = `What is ${expression}?`;
  answersElement.innerHTML = "";

  answers.forEach((ans) => {
    const answerButton = document.createElement("button");
    answerButton.textContent = ans;
    answerButton.addEventListener("click", () => {
      selectedButton = answerButton;
      checkAnswer(ans, answer);
    });
    answersElement.appendChild(answerButton);
  });

  messageElement.textContent = "";
  nextRoundButton.style.display = "none";
  endGameButton.style.display = "none";
}

function checkAnswer(selectedAnswer, correctAnswer) {
  if (selectedAnswer == correctAnswer) {
    messageElement.textContent = "Correct! Good job!";
    correctAnswers++;
    selectedButton.classList.add("correct");
  } else {
    messageElement.textContent = `Incorrect. The correct answer is ${correctAnswer}.`;
    incorrectAnswers++;
    selectedButton.classList.add("incorrect");
  }

  nextRoundButton.style.display = "block";
  endGameButton.style.display = "block";
  updateResults();
}

function updateResults() {
  correctAnswersElement.textContent = correctAnswers;
  incorrectAnswersElement.textContent = incorrectAnswers;
  const totalAnswers = correctAnswers + incorrectAnswers;
  const percentage = totalAnswers > 0 ? ((correctAnswers / totalAnswers) * 100).toFixed(2) : 0;
  percentageElement.textContent = `${percentage}%`;
}

function getPersonalizedMessage() {
  const totalAnswers = correctAnswers + incorrectAnswers;
  const percentage = totalAnswers > 0 ? ((correctAnswers / totalAnswers) * 100).toFixed(2) : 0;

  if (percentage >= 70) {
    return "Congratulations! You're a math whiz!";
  } else if (percentage >= 50) {
    return "Great job! You're improving!";
  } else {
    return "Keep practicing to improve your math skills!";
  }
}

function showResults() {
  gameInterface.classList.add("hidden");
  resultsInterface.classList.remove("hidden");
  updateResults();

  const personalizedMessage = getPersonalizedMessage();
  personalizedMessageElement.textContent = personalizedMessage;
}

function restartGame() {
  correctAnswers = 0;
  incorrectAnswers = 0;
  startRound();
  resultsInterface.classList.add("hidden");
  gameInterface.classList.remove("hidden");
  nextRoundButton.style.display = "none";
  endGameButton.style.display = "none";
}

function startGame() {
  startRound();
  gameInterface.classList.remove("hidden");
  resultsInterface.classList.add("hidden");
  nextRoundButton.style.display = "none";
  endGameButton.style.display = "none";
}

startRound(); // Start the first round

nextRoundButton.addEventListener("click", startRound);
endGameButton.addEventListener("click", showResults);
