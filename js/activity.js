define(["sugar-web/activity/activity"], function(activity) {

  // Manipulate the DOM only when it is ready.
  require(['domReady!'], function(doc) {

    // Initialize the activity.
    activity.setup();

    var gameFinished = false;

    var playerMoved = 0;
    var aiMoved = 0;
    var wrongAnswers = 0;
    var correctResult;

    function generateNewTask() {
      var question = document.getElementById("question");

      var nm1 = Math.floor(Math.random() * 11);
      var nm2 = Math.floor(Math.random() * 11);

      correctResult = nm1 + nm2;

      question.innerText = nm1 + " + " + nm2 + " = ";
    }

    function showWinLoseScreen(message) {
      gameFinished = true;
      document.getElementById('win-screen').style.display = "block";
      document.getElementById('text-win-lose').innerHTML = message;
    }

    function retry() {
      document.getElementById('win-screen').style.display = "none";
      document.getElementById("wrong-answers").innerHTML = "Wrong answers: 0 / 3";
      document.querySelector("#player-car .move-right").style.left = "0%";
      document.querySelector("#ai-car .move-right").style.left = "0%";
      gameFinished = false;

      playerMoved = 0;
      aiMoved = 0;
      wrongAnswers = 0;
      correctResult;
      setTimeout(aiMove, Math.floor((Math.random() * 5000) + 1000));
      generateNewTask();
    }

    function aiMove() {
      if (!gameFinished) {
        aiMoved += 10;
        document.querySelector("#ai-car .move-right").style.left = aiMoved + "%";
        setTimeout(aiMove, Math.floor((Math.random() * 5000) + 1000));
        if (aiMoved >= 100) {
          showWinLoseScreen("You Lost!");
        }
      }
    }

    function playerMove() {
      if (!gameFinished) {
        playerMoved += 10;
        document.querySelector("#player-car .move-right").style.left = playerMoved + "%";
        if (playerMoved >= 100) {
          showWinLoseScreen("You Won!");
        }

      }
    }

    function checkResult() {

      var inputCheck = document.getElementById('answer').value;
      document.getElementById("answer").value = '';
      if (inputCheck == "") {
      } else if (inputCheck == correctResult) {
        playerMove();
        generateNewTask();
      }
      else {
        wrongAnswers++;
        document.getElementById("wrong-answers").innerHTML = "Wrong answers: " + wrongAnswers + " / 3";
        if (wrongAnswers == 3) {
          showWinLoseScreen(" Ouch! Too many mistakes. Your engine has blown up!");
        }
      }
    }


    document.getElementById('button-reload').addEventListener("click", retry);
    document.getElementById("check").addEventListener("click", checkResult);

    document.getElementById('answer').addEventListener("keyup", function(event) {

      if (event.keyCode == 13 || event.key == "Enter") {
        checkResult();
        document.getElementById("answer").value = '';
      }

    });

    retry();
  });

});
