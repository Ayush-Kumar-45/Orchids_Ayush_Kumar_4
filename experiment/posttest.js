/////////////////////////////////////////////////////////////////////////////

/////////////////////// Do not modify the below code ////////////////////////

/////////////////////////////////////////////////////////////////////////////

(function() {
  function buildQuiz() {
    // we'll need a place to store the HTML output
    const output = [];

    // for each question...
    myQuestions.forEach((currentQuestion, questionNumber) => {
      // we'll want to store the list of answer choices
      const answers = [];

      // and for each available answer...
      for (letter in currentQuestion.answers) {
        // ...add an HTML radio button
        answers.push(
          `<label>
            <input type="radio" name="question${questionNumber}" value="${letter}">
            ${letter} :
            ${currentQuestion.answers[letter]}
          </label>`
        );
      }

      // add this question and its answers to the output
      output.push(
        `<div class="question"> ${currentQuestion.question} </div>
        <div class="answers"> ${answers.join("")} </div>`
      );
    });

    // finally combine our output list into one string of HTML and put it on the page
    quizContainer.innerHTML = output.join("");
  }

  function showResults() {
    // gather answer containers from our quiz
    const answerContainers = quizContainer.querySelectorAll(".answers");

    // keep track of user's answers
    let numCorrect = 0;

    // for each question...
    myQuestions.forEach((currentQuestion, questionNumber) => {
      // find selected answer
      const answerContainer = answerContainers[questionNumber];
      const selector = `input[name=question${questionNumber}]:checked`;
      const userAnswer = (answerContainer.querySelector(selector) || {}).value;

      // if answer is correct
      if (userAnswer === currentQuestion.correctAnswer) {
        // add to the number of correct answers
        numCorrect++;

        // color the answers green
        //answerContainers[questionNumber].style.color = "lightgreen";
      } else {
        // if answer is wrong or blank
        // color the answers red
        answerContainers[questionNumber].style.color = "red";
      }
    });

    // show number of correct answers out of total
    resultsContainer.innerHTML = `${numCorrect} out of ${myQuestions.length}`;
  }

  const quizContainer = document.getElementById("quiz");
  const resultsContainer = document.getElementById("results");
  const submitButton = document.getElementById("submit");
 

/////////////////////////////////////////////////////////////////////////////

/////////////////////// Do not modify the above code ////////////////////////

/////////////////////////////////////////////////////////////////////////////






/////////////// Write the MCQ below in the exactly same described format ///////////////


 const myQuestions = [
  {
    question: "What is the primary purpose of CO₂ capture and sequestration (CCS)?",
    answers: {
      a: "Increase fossil fuel usage",
      b: "Reduce global temperatures immediately",
      c: "Minimize CO₂ emissions from industrial sources",
      d: "Produce more carbon for energy generation"
    },
    correctAnswer: "c",
    explanation: "CCS aims to minimize CO₂ emissions from industrial sources to mitigate climate change."
  },
  {
    question: "Which of the following is a commonly used simulation tool for modeling CCS systems?",
    answers: {
      a: "AutoCAD",
      b: "MATLAB/Simulink",
      c: "Aspen Plus",
      d: "MS Word"
    },
    correctAnswer: "c",
    explanation: "Aspen Plus is widely used for process simulation including CCS system modeling."
  },
  {
    question: "In post-combustion CO₂ capture, CO₂ is removed:",
    answers: {
      a: "Before fuel is burned",
      b: "After combustion of the fuel",
      c: "During the fuel refining stage",
      d: "While mining the fuel"
    },
    correctAnswer: "b",
    explanation: "Post-combustion capture removes CO₂ after fuel combustion, typically from flue gases."
  },
  {
    question: "What is a key risk associated with geological CO₂ sequestration?",
    answers: {
      a: "CO₂ converting to oxygen",
      b: "Earthquake generation",
      c: "Leakage of CO₂ back to the atmosphere",
      d: "Production of fossil fuels"
    },
    correctAnswer: "c",
    explanation: "Leakage from storage sites is a significant concern for long-term sequestration."
  },
  {
    question: "Which of the following formations is most suitable for long-term CO₂ storage?",
    answers: {
      a: "Riverbeds",
      b: "Saline aquifers",
      c: "Forest soils",
      d: "Volcano chambers"
    },
    correctAnswer: "b",
    explanation: "Saline aquifers provide large porous rock formations ideal for secure CO₂ storage."
  },
                                 ///// To add more questions, copy the section below 
    									                  ///// this line


    /* To add more MCQ's, copy the below section, starting from open curly braces ( { )
        till closing curly braces comma ( }, )

        and paste it below the curly braces comma ( below correct answer }, ) of above 
        question

    Copy below section

    {
      question: "This is question n?",
      answers: {
        a: "Option 1",
        b: "Option 2",
        c: "Option 3",
        d: "Option 4"
      },
      correctAnswer: "c"
    },

    Copy above section

    */




  ];




/////////////////////////////////////////////////////////////////////////////

/////////////////////// Do not modify the below code ////////////////////////

/////////////////////////////////////////////////////////////////////////////


  // display quiz right away
  buildQuiz();

  // on submit, show results
  submitButton.addEventListener("click", showResults);
})();


/////////////////////////////////////////////////////////////////////////////

/////////////////////// Do not modify the above code ////////////////////////

/////////////////////////////////////////////////////////////////////////////