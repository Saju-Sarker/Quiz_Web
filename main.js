const url =
  "https://opentdb.com/api.php?amount=10&category=9&difficulty=medium&type=multiple";
const question = document.querySelector(".question");
const mSize = document.querySelector(".mobile-size");
const steps = document.querySelector(".steps");
const options = document.querySelectorAll(".optBox p");
const optionBox = document.querySelectorAll(".optBox");
const stBtn = document.querySelector(".start button");
const start = document.querySelector(".start");
const stepsSpan = document.querySelector(".steps pre span");
const nextBtn = document.querySelector(".next button");
const task = document.querySelector(".task");
const results = document.querySelector(".result");
const resNum = document.querySelector(".result div span");
let q = 0;
let n = 1;
let data;

let correctAns;
let point = 0;
let selected = false; // Flag to check if an option is selected

const startFunc = () => {
  stBtn.addEventListener("click", async () => {
    start.style.display = "none";
    mSize.style.display = "flex";
    const response = await fetch(url);
    data = await response.json();
    questionChanger();
  });
};

const nextFunc = () => {
  nextBtn.addEventListener("click", (evt) => {
    evt.preventDefault();
    if (!selected) {
      return;
    }
    if (n <= 9) {
      n += 1;
      let n2 = n * 10;
      stepsSpan.innerText = n;
      task.style.setProperty("--scroll-go", n2);
      q += 1;
      questionChanger();
    }
    if (n >= 9) {
      nextBtn.innerText = "Finish";
    }
    if (n == 10) {
      mSize.style.display = "none";
      results.style.display = "flex";
      resNum.innerText = point;
    }
  });
};

const questionChanger = () => {
  question.innerText = data.results[q].question;
  const shuffle = (arr) => arr.sort(() => Math.random() - 0.5);
  const origOpt = data.results[q].incorrect_answers;
  correctAns = data.results[q].correct_answer;
  origOpt.push(correctAns);
  const newOpts = shuffle([...origOpt]).slice(0, 4);
  for (let i = 0; i < newOpts.length; i++) {
    options[i].innerText = newOpts[i];
  }
  for (let opB of optionBox) {
    opB.disabled = false;
    opB.style.backgroundColor = "transparent";
  }
  selected = false; // Reset selected flag
  ansCheck();
};

const ansCheck = () => {
  optionBox.forEach((optB) => {
    optB.addEventListener("click", () => {
      if (selected) return;
      selected = true;
      let chooseAns = optB.children[1].innerText;

      if (chooseAns == correctAns) {
        optB.style.backgroundColor = "#61ffddba";
        point += 1;
      } else {
        optB.style.backgroundColor = "#ff6792d8";
        for (const opB of optionBox) {
          if (opB.children[1].innerText == correctAns) {
            opB.style.backgroundColor = "#61ffddba";
          }
        }
      }
      for (let opB of optionBox) {
        opB.disabled = true;
      }
      nextFunc();
    });
  });
};

startFunc();
