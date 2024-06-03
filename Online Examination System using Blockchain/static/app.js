var web3;
var address = "0xE949Acba5335029B5f75f3d2Cd96538D170E3cd9";
var username = "mihika@gmail.com";
async function Connect() {
  await window.web3.currentProvider.enable();
  web3 = new Web3(window.web3.currentProvider);
}

if (typeof web3 !== "undefined") {
  web3 = new Web3(window.web3.currentProvider);
} else {
  web3 = new Web3(new Web3.provider.HttpProvider("HTTP://127.0.0.1:7545"));
}

// Load the ABI (contract interface)
const abi = [
  {
    inputs: [
      {
        components: [
          {
            internalType: "string",
            name: "question",
            type: "string",
          },
          {
            internalType: "string",
            name: "answer",
            type: "string",
          },
          {
            internalType: "string",
            name: "username",
            type: "string",
          },
        ],
        internalType: "struct QuizContract.Question[]",
        name: "_questions",
        type: "tuple[]",
      },
    ],
    name: "storeQuestions",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "questions",
    outputs: [
      {
        internalType: "string",
        name: "question",
        type: "string",
      },
      {
        internalType: "string",
        name: "answer",
        type: "string",
      },
      {
        internalType: "string",
        name: "username",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

// Create a contract instance
const contract = new web3.eth.Contract(abi, address);

// console.log(user[1]);
const questions = [
  {
    question: "What is the capital of France?",
    options: ["London", "Paris", "Berlin", "Rome"],
    answer: "Paris",
  },
  {
    question: "Which planet is known as the Red Planet?",
    options: ["Mars", "Jupiter", "Venus", "Mercury"],
    answer: "Mars",
  },
  {
    question: "What is the chemical symbol for water?",
    options: ["CO2", "NaCl", "H2O", "O2"],
    answer: "H2O",
  },

  {
    question: "Who wrote 'To Kill a Mockingbird'?",
    options: ["J.K. Rowling", "Stephen King", "Charles Dickens", "Harper Lee"],
    answer: "Harper Lee",
  },
  {
    question: "Which country is famous for the Great Wall?",
    options: ["China", "India", "Japan", "Italy"],
    answer: "China",
  },
];

let currentQuestionIndex = 0;
if (currentQuestionIndex === 0) {
  document.getElementById("prevButton").style.display = "none";
  document.getElementById("nextButton").style.display = "block";
}
function prevQuestion() {
  document.getElementById("submitButton").style.display = "none";
  currentQuestionIndex--;
  renderQuestion();

  const prevButton = document.getElementById("prevButton");
  const nextButton = document.getElementById("nextButton");
  if (currentQuestionIndex === 0) {
    prevButton.style.display = "none";
    nextButton.style.display = "block";
  } else {
    prevButton.style.display = "block";
    nextButton.style.display = "block";
  }
}

function renderQuestion() {
  const currentQuestion = questions[currentQuestionIndex];
  document.getElementById("questionTitle").innerText = `Question ${
    currentQuestionIndex + 1
  }:`;
  const questionDiv = document.getElementById("question");
  questionDiv.innerHTML = `
    <p class="q">${currentQuestion.question}</p>
    ${currentQuestion.options
      .map(
        (option, index) => `
          <label>
            <input type="radio" name="question${currentQuestionIndex}" value="${option}" ${
          isSelected(currentQuestionIndex, option) ? "checked" : ""
        }> ${option}
          </label><br>
        `
      )
      .join("")}
  `;
}

function isSelected(questionIndex, optionValue) {
  const selectedOption = questionAnswers.find(
    (item) => item.question === questions[questionIndex].question
  )?.answer;
  return selectedOption === optionValue;
}

window.questionAnswers = [];

let selectedOption;
function nextQuestion() {
  selectedOption = document.querySelector(
    `input[name="question${currentQuestionIndex}"]:checked`
  );
  if (!selectedOption) {
    alert("Please select an option.");
    return;
  }

  const existingQuestionIndex = questionAnswers.findIndex(
    (item) => item.question === questions[currentQuestionIndex].question
  );

  if (existingQuestionIndex !== -1) {
    questionAnswers[existingQuestionIndex].answer = selectedOption.value;
  } else {
    questionAnswers.push({
      username: username,
      question: questions[currentQuestionIndex].question,
      answer: selectedOption ? selectedOption.value : null,
    });
  }

  currentQuestionIndex++;
  if (currentQuestionIndex < questions.length) {
    renderQuestion();
    document.getElementById("prevButton").style.display = "block";
  }
  if (currentQuestionIndex === questions.length - 1) {
    document.getElementById("nextButton").style.display = "none";
    document.getElementById("submitButton").style.display = "block";
    document.getElementById("prevButton").style.display = "block";
  }
}

// function calculateScore() {
//   let score = 0;
//   questionAnswers.forEach((item) => {
//     const question = questions.find((q) => q.question === item.question);
//     if (question && item.answer === question.answer) {
//       score++;
//     }
//   });
//   console.log("User's score:", score);
// }

// Function to calculate and redirect to the score page
function calculateScore() {
  let score = 0;
  questionAnswers.forEach((item) => {
    const question = questions.find((q) => q.question === item.question);
    if (question && item.answer === question.answer) {
      score++;
    }
  });

  // Store score in localStorage
  localStorage.setItem("userScore", score);

  // Redirect to score page
  window.location.href = "/show_score?score=" + score;
}

// Function to add question to smart contract
function sendToSmartContract() {
  console.log("send to smart contract called");

  console.log(questionAnswers);

  if (questionAnswers.length > 0) {
    web3.eth.getAccounts().then(function (account) {
      return contract.methods
        .storeQuestions(questionAnswers)
        .send({ from: account[0] })
        .then(() => {
          // Calculate and log the user's score after storing questions
          calculateScore();
        });
    });
    console.log("Data sent to smart contract!");
  }
}

document.getElementById("examForm").addEventListener("submit", (event) => {
  event.preventDefault();

  const selectedOption = document.querySelector(
    `input[name="question${currentQuestionIndex}"]:checked`
  );
  if (!selectedOption) {
    alert("Please select an option.");
    return;
  }

  const existingQuestionIndex = questionAnswers.findIndex(
    (item) => item.question === questions[currentQuestionIndex].question
  );

  if (existingQuestionIndex !== -1) {
    questionAnswers[existingQuestionIndex].answer = selectedOption
      ? selectedOption.value
      : null;
  } else {
    questionAnswers.push({
      username: username,
      question: questions[currentQuestionIndex].question,
      answer: selectedOption ? selectedOption.value : null,
    });
  }
});

renderQuestion();
