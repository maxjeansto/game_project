// declaration de la variable de la cible
var bar = document.getElementById("moving-div");
var img = bar.querySelector("img");
var content = document.getElementById("content");
var seconds = parseInt(counter.innerHTML, 10);
console.log(seconds);
var missedclick = parseInt(missed.innerHTML);
var NextClick = parseInt(click.innerHTML);
var scoreint = parseInt(score.innerHTML);
var scoreDisplay = document.getElementById("score");
var clickcount = 0;
console.log(clickcount);
var levelinit = parseInt(level.innerHTML);
var speed = 0;
var escapeDelay = 300;
var gameOver = false;
let countdownTimeoutId = null;
var gameStarted = false;
const audio = document.getElementById("bo");
const timer = document.getElementById("counter");
const levels = document.getElementById("level");


function playClickSound() {
  // Créer une copie de l'élément audi0
  const clickSound = document.getElementById("click-sound").cloneNode();
  // Jouer le son
  clickSound.play();
  // Supprimer l'élément audio de la page
  clickSound.addEventListener("ended", function () {
    clickSound.remove();
  });
}

function playClickSoundFail() {
  // Créer une copie de l'élément audio
  const clickSoundFail = document.getElementById("click-failed").cloneNode();
  // Jouer le son
  clickSoundFail.play();
  // Supprimer l'élément audio de la page
  clickSoundFail.addEventListener("ended", function () {
    clickSoundFail.remove();
  });
}


// Générer un jeton aléatoire de 10 chiffres
function generateToken() {
  const token = Math.floor(Math.random() * 10000000000);
  return token.toString().padStart(10, "0");
}

let leaderboard = [];

// Vérifier si la clé "leaderboard" existe déjà dans le local storage
if (!localStorage.getItem("leaderboard")) {
  // Si la clé n'existe pas, insérer les cinq meilleurs marqueurs avec des jetons aléatoires
  leaderboard = [
    {
      name: "Maxime",
      score: 30,
      timestamp: Date.now(),
      img: "./img/max.png",
    },
    { name: "Meir", score: 25, timestamp: Date.now(), img: "./img/meir.png" },
    { name: "Lea", score: 22, timestamp: Date.now(), img: "./img/lea.png" },
    {
      name: "Liora",
      score: 18,
      timestamp: Date.now(),
      img: "./img/liora.png",
    },
    { name: "Yoav", score: 18, timestamp: Date.now(), img: "./img/yoav.png" },
  ];

  // Ajouter un jeton aléatoire pour chaque joueur, stocké dans le local storage
  leaderboard.forEach((player) => {
    const token = generateToken();
    player.token = token;
    localStorage.setItem(token, player.name);
  });

  // Stocker le tableau en JSON dans le local storage
  localStorage.setItem("leaderboard", JSON.stringify(leaderboard));
} else {
  // Récupérer le leaderboard depuis le local storage
  leaderboard = JSON.parse(localStorage.getItem("leaderboard"));
}

// Récupérer les éléments HTML pertinents
const PlayersDiv = document.querySelector(".players");

leaderboard.forEach(function (obj) {
  const date = new Date(obj.timestamp);
  const dateString = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  PlayersDiv.innerHTML += `
    <div class="player" data-date="${dateString}">
      <div class="image-container">
        <img src="${obj.img}" class="player-image" />
        <div class="date-overlay">${dateString}</div>
      </div>
      <span class="player-name">${obj.name} <br> <p class = "score">High Score : ${obj.score}</p></span>
    </div>`;
});


// Ajoutez des écouteurs d'événements aux images des joueurs
const playerImages = document.querySelectorAll(".player-image");

playerImages.forEach((image) => {
  image.addEventListener("mouseover", function () {
    image.style.boxShadow = "0px 4px 8px rgba(0, 0, 0, 0.2)";
  });

  image.addEventListener("mouseout", function () {
    image.style.boxShadow = "";
  });
});


function startGame() {
  reset();
  countdown();
  target();
  audio.play();
  gameStarted = true;
  bar.style.pointerEvents = "auto";

}

document.addEventListener("DOMContentLoaded", function () {
  // Obtenir une référence au bouton et au compteur
  const startBtn = document.getElementById("btn");
  const counter = document.getElementById("counter");

  // Ajouter un événement de clic au bouton
  startBtn.addEventListener("click", () => {
    // Démarrer le compteur et la fonction target()
    startGame();
  });
});

// La fonction countdown() reste la même
function countdown() {
  console.log(seconds);
  function click() {
    seconds--;
    counter.innerHTML = (seconds < 10 ? "0" : "") + String(seconds);
    if (seconds > -1) {
      countdownTimeoutId = setTimeout(click, 1000);
    } else {
      endGame();
      gameOver = true;
      console.log(countdownTimeoutId);
    }
  }
  // Renvoyer l'identifiant du délai renvoyé par setTimeout()
  return countdownTimeoutId = setTimeout(click, 1000);
}


function getRandom(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}


function target() {
  bar.classList.add("rotate-level-".concat(levelinit));
  var contentHeight = content.clientHeight;
  var contentWidth = content.clientWidth;
  bar.addEventListener("mouseover", function () {
    if (!gameOver) {
      setTimeout(function () {
        var randomTop = Math.random() * contentHeight;
        var randomLeft = Math.random() * contentWidth;
        bar.style.top = Math.min(randomTop, contentHeight - bar.offsetHeight) + "px";
        bar.style.left = Math.min(randomLeft, contentWidth - bar.offsetWidth) + "px";
      }, escapeDelay);
    }
  });
}


content.addEventListener("click", function (evt) {
  if (!gameOver && gameStarted && evt.target === bar) {
    clickcount++;
    console.log("nombre de click sur la barre" + clickcount);
    scoreint += 10 * levelinit;
    score.innerHTML = scoreint;
    NextClick--;
    click.innerHTML = NextClick;
    playClickSound();
    scoreDisplay.classList.add("score-increase");
    setTimeout(function () {
      scoreDisplay.classList.remove("score-increase");
    }, 3000);
    evt.preventDefault();
  } else if (!gameOver && gameStarted) {
    missedclick++;
    missed.innerHTML = missedclick;
    scoreint -= 1 * levelinit;
    scoreint = Math.max(scoreint, 0);
    score.innerHTML = scoreint;
    playClickSoundFail();
  }

  if (!gameOver && clickcount > 0 && clickcount % 10 === 0) {
    clickcount = 0;
    NextClick = 10;
    click.innerHTML = "10";
    levelinit++;
    level.innerHTML = levelinit;
    levels.classList.add("score-increase");
    setTimeout(function () {
      levels.classList.remove("score-increase");
    }, 3000);
    seconds += 10;
    timer.classList.add("score-increase");
    setTimeout(function () {
      timer.classList.remove("score-increase");
    }, 1000);
    console.log("level en cours" + levelinit);
    bar.classList.replace(
      "rotate-level-" + (levelinit - 1),
      "rotate-level-" + levelinit
    );
    escapeDelay -= 50;
    console.log(escapeDelay);
    if (levelinit === 1) {
      const level1Audio = document.getElementById("level1-audio");
      level1Audio.play();
    } else if (levelinit === 2) {
      const level2Audio = document.getElementById("level2-audio");
      level2Audio.play();
    } else if (levelinit === 3) {
      const level3Audio = document.getElementById("level3-audio");
      level3Audio.play();
    } else if (levelinit === 4) {
      const level4Audio = document.getElementById("level4-audio");
      level4Audio.play();
    } else if (levelinit === 5) {
      const level5Audio = document.getElementById("level5-audio");
      level5Audio.play();}
    if (levelinit === 6) {
      endGame();
      gameOver = true;
    }
  }
});


function reset() {
  // Réinitialiser les variables
  seconds = 60;
  scoreint = 0;
  clickcount = 0;
  missedclick = 0;
  levelinit = 1;
  NextClick = 10;
  escapeDelay = 300;
  gameOver = false;
  clearTimeout(countdownTimeoutId);

  // Réinitialiser les éléments HTML
  counter.innerHTML = "60";
  score.innerHTML = "0";
  missed.innerHTML = "0";
  level.innerHTML = "1";
  click.innerHTML = "10";
  bar.className = "";
  bar.style.top = "0%";
  bar.style.left = "0px";
}


//Changement de text du bouton au survol
function changerTexteBouton(idBouton, texteAuSurvole) {
  const bouton = document.getElementById(idBouton);
  bouton.addEventListener("mouseover", function () {
    this.innerHTML = texteAuSurvole;
  });
  bouton.addEventListener("mouseout", function () {
    this.innerHTML = bouton.dataset.texteInitial;
  });

  bouton.dataset.texteInitial = bouton.innerHTML;
}

changerTexteBouton("btn", "Start the game");

function endGame() {
  // Vérifier si le score de la partie est supérieur à l'un des scores du leaderboard
  const topScores = leaderboard.slice(0, 5);
  const isNewHighScore = topScores.some(score => score.score < scoreint);

  // Afficher un message différent en fonction de si le score de la partie est supérieur à l'un des scores du leaderboard
  if (isNewHighScore) {
    // Demander le nom du joueur avec un prompt
    const playerName = prompt(
      "Bravo ! Entrez votre nom pour enregistrer votre score :"
    );

    if (playerName) {
      // Ajouter le score au leaderboard
      leaderboard.push({
        name: playerName,
        score: scoreint,
        timestamp: Date.now(),
        img: "./img/default.png",
      });

      // Trier le leaderboard en fonction du score (du plus élevé au plus bas)
      leaderboard.sort((a, b) => b.score - a.score);

      // Limiter le leaderboard aux 5 meilleurs scores
      leaderboard = leaderboard.slice(0, 5);

      // Mettre à jour le local storage avec le nouveau leaderboard
      localStorage.setItem("leaderboard", JSON.stringify(leaderboard));
    }

    // Afficher le message de réussite avec le prompt
    alert("Bravo " + playerName + " ! Votre score est dans le top 5 !");
  } else {
    // Afficher le message de game over
    alert("Game over. Votre score n'est pas dans le top 5.");
  }

  // Afficher le leaderboard mis à jour
  PlayersDiv.innerHTML = "";
  leaderboard.forEach(function (obj) {
    PlayersDiv.innerHTML += `
      <div class="player">
        <img src="${obj.img}"/>
        <span class="player-name">${obj.name} <br> <p class = "score">High Score : ${obj.score}</p></span>
      </div>`;
  });

  // Réinitialiser le jeu
  audio.pause();
  reset();
}
