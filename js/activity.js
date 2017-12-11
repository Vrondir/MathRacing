define(["sugar-web/activity/activity", "webL10n", "sugar-web/datastore", "sugar-web/env"], function(activity, l10n, datastore, env) {

  var _ = l10n.get;

  var first = true;

  l10n.ready(function() {
    if (first) {
      first = false;
      datastore.localStorage.load(function() {
        getSugarSettings(function(settings) {
          l10n.language.code = settings.language;
          var refreshTime = setTimeout(function() {
            clearTimeout(refreshTime);
            retry();
          }, 50);
        });
      });
    }
  });


  function getSugarSettings(callback) {
    var defaultSettings = {
      name: "",
      language: (typeof chrome != 'undefined' && chrome.app && chrome.app.runtime) ? chrome.i18n.getUILanguage() : navigator.language
    };
    if (!env.isSugarizer()) {
      callback(defaultSettings);
      return;
    }
    var loadedSettings = datastore.localStorage.getValue('sugar_settings');
    callback(loadedSettings);
  }

  var gameFinished = true;

  var playerMoved = 0;
  var aiMoved = 0;
  var wrongAnswers = 0;
  var correctResult;
  var aiTimeout = undefined;

  function retry() {
    gameFinished = false;
    playerMoved = 0;
    aiMoved = 0;
    wrongAnswers = 0;

    document.getElementById('win-screen').style.display = "none";
    document.querySelector("#player-car .move-right").style.left = "0%";
    document.querySelector("#ai-car .move-right").style.left = "0%";

    document.getElementById("wrong-answers").innerHTML = _("wrong") + ": 0 / 3";
    document.getElementById("answer").placeholder = _("field-text");
    document.getElementById("check").value = _("button-text");
    document.querySelector("#player-car h1").innerHTML = _("your-car");
    document.querySelector("#ai-car h1").innerHTML = _("ai-car");
    document.getElementById("button-reload").innerHTML = _("retry");
    aiTimeout = setTimeout(aiMove, Math.floor((Math.random() * 5000) + 1000));
    generateNewTask();
  }

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
    if (aiTimeout !== undefined) {
      clearTimeout(aiTimeout);
      aiTimeout = undefined;
    }
  }


  function aiMove() {
    if (!gameFinished) {
      aiMoved += 10;
      document.querySelector("#ai-car .move-right").style.left = aiMoved + "%";
      if (aiMoved >= 100) {
        showWinLoseScreen(_("game-lost"));
      }
      else {
        aiTimeout = setTimeout(aiMove, Math.floor((Math.random() * 5000) + 1000));
      }
    }
  }

  function playerMove() {
    if (!gameFinished) {
      playerMoved += 10;
      document.querySelector("#player-car .move-right").style.left = playerMoved + "%";
      if (playerMoved >= 100) {
        showWinLoseScreen(_("game-won"));
      }
    }
  }

  function checkResult() {
    var inputCheck = document.getElementById('answer').value;
    document.getElementById("answer").value = '';
    if (inputCheck == "") {} else if (inputCheck == correctResult) {
      playerMove();
      generateNewTask();
    } else {
      wrongAnswers++;
      document.getElementById("wrong-answers").innerHTML = _("wrong") + ": " + wrongAnswers + " / 3";
      if (wrongAnswers == 3) {
        showWinLoseScreen(_("blow-up"));
      }
    }
  }

  // Manipulate the DOM only when it is ready.
  require(['domReady!'], function(doc) {

    retry();
    // Initialize the activity.
    activity.setup();

    document.getElementById("button-reload").addEventListener("click", retry);
    document.getElementById("check").addEventListener("click", checkResult);

    document.getElementById('answer').addEventListener("keyup", function(event) {
      if (event.keyCode == 13 || event.key == "Enter") {
        checkResult();
        document.getElementById("answer").value = '';
      }
    });
  });

});
