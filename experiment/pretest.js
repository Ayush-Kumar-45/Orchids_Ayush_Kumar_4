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
    question: "Which of the following is a method of CO₂ capture?",
    answers: {
      a: "Cryogenic distillation",
      b: "Chemical looping",
      c: "Adsorption",
      d: "All of the above"
    },
    correctAnswer: "d",
    explanation: "Various CO₂ capture methods include cryogenic separation, chemical looping combustion, and solid adsorption. These are all valid techniques for capturing CO₂."
  },
  {
    question: "Which phase of CCS involves transporting CO₂ to a storage site?",
    answers: {
      a: "Capture",
      b: "Compression",
      c: "Transport",
      d: "Sequestration"
    },
    correctAnswer: "c",
    explanation: "After capture and compression, CO₂ is transported—often via pipeline or ship—to the sequestration site."
  },
  {
    question: "Which of the following is the most commonly used solvent in post-combustion CO₂ capture?",
    answers: {
      a: "Ammonia",
      b: "Monoethanolamine (MEA)",
      c: "Sodium hydroxide",
      d: "Methanol"
    },
    correctAnswer: "b",
    explanation: "MEA is widely used for chemical absorption in post-combustion CO₂ capture systems due to its high reactivity with CO₂."
  },
  {
    question: "Geological sequestration of CO₂ is typically done in:",
    answers: {
      a: "Ocean trenches",
      b: "Deep saline aquifers",
      c: "Mountaintop reservoirs",
      d: "Arctic permafrost"
    },
    correctAnswer: "b",
    explanation: "Deep saline aquifers are porous rock formations that can store CO₂ under pressure safely over long periods."
  },
  {
    question: "The main environmental goal of CO₂ capture and sequestration is to:",
    answers: {
      a: "Improve fuel efficiency",
      b: "Reduce greenhouse gas emissions",
      c: "Increase oil recovery",
      d: "Produce clean water"
    },
    correctAnswer: "b",
    explanation: "The primary aim of CCS is to mitigate climate change by reducing the release of CO₂ into the atmosphere."
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