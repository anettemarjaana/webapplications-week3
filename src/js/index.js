import "../css/styles.css";

/* Global variables used in the game functions: */
var timerID = false;
var checker = 1;

if (document.readyState !== "loading") {
  // Document ready, executing:
  console.log("Document ready, executing");
  initializeCode();
} else {
  // Document was not ready, executing when loaded
  document.addEventListener("DOMContentLoaded", function () {
    console.log("Document ready, executing after a wait");
    initializeCode();
  });
}

function initializeCode() {
  console.log("Initializing");
  var firstgame = 0;
  console.log("First game!");
  renderCells(); // finish the table
  moveProgressBar();
  firstgame++;

  // Button to start a new game.
  const button = document.getElementById("rematch");

  button.addEventListener("mousedown", (event) => {
    console.log("Button activated.");

    /* The board is only rendered once - on the first
    time that the game is played. */
    if (firstgame !== 0) {
      /* When the button is clicked, the old table is emptied and the game
      can be started over. */
      emptyCells();
    }
    /* When a new game is started, the clock starts ticking right away.
    If the time passes, the player first in turn will lose their turn
    (the global variable checker becomes -1) */
    if (timerID !== false) {
      // if in the middle of the interval
      clearInterval(timerID);
      timerID = false;
    }
    moveProgressBar();
    /* A click on any cell of the board will stop the last player's turn
    and start the next one's. This is handled in the renderCells 
    onclick-eventListener. */

    event.stopPropagation();
  });
}

/* The function below finds the grid initialized in index.html and fills it
 with 5*5 cells. The final grid will be of size 5x5. 
 This function is also responsible for the onclick-eventListener, so it
 responds to the players' clicks on the board. */
function renderCells() {
  /* INITIALIZE PLAYER DETAILS
  The player 1 has symbol X, the player 2 has symbol O.
  Player 1 starts the game.*/

  /* FILL THE TABLE WITH CELLS (only once per page refresh) */
  var tbl = document.getElementById("board");

  for (var i = 0; i < 25; i++) {
    // Creating 5 rows & columns (CSS set)
    var td = document.createElement("grid-td");
    td.className = "neutral";
    tbl.appendChild(td);

    /* Make each rendered cell clickable */
    td.addEventListener("click", function () {
      var lastround = document.getElementById("samplepar").innerHTML;
      gameFunction(this, lastround);
    });
  }
}

/* The function checkTurns should be run after each turn! */
function checkTurns(lastround) {
  /* When the cell is clicked -> turn switches, progressBar
  should start running again. */
  /* if checker < 0, the time ended -> the last one's turn
  should be skipped. */

  if (checker < 0) {
    if (lastround == 1) {
      alert("Player 1 lost their turn!");
      lastround = 2;
    } else if (lastround == 2) {
      alert("Player 2 lost their turn!");
      lastround = 1;
    }
    /* Set the next turn's player symbol: */
    document.getElementById("samplepar").innerHTML = lastround;
    checker++; // becomes neutral again as new turn starts.
  }

  /* Check the global variable timerID: it's either keeping up
  with the interval or it is false. */

  if (timerID !== false) {
    // if in the middle of the interval
    clearInterval(timerID);
    timerID = false;
  }
  // or it's a new turn starting:
  moveProgressBar(); // starts ticking for the next player
  console.log("Returning player ID " + lastround);

  return lastround;
}

/* This function is run AFTER the click on a cell.
It calculates the win condition and fills the cell with the turn's
player symbol.
It also fetches the next turn's player symbol and sets it on the page.*/
function gameFunction(td, lastround) {
  /* checkTurns returns the ID of the player of this beginning turn. */
  console.log("Checking turns. Now the turn is: " + lastround);
  lastround = checkTurns(lastround);
  console.log("This comes after checkTurns. Now the turn is: " + lastround);

  /* Fill the cell with the old player's symbol and retrieve the next
  turn's player's symbol: */
  var playerno = fillCell(td, lastround); // when a cell is clicked -> fill it
  // fillCell returns the player symbol of the next player in turn.
  console.log(
    "The cell is filled! Last round: " + lastround + " New round: " + playerno
  );

  /* Check whether there's been a win or a tie after the new click */
  console.log("Go to calculate if last round player won: " + lastround);
  var win = calculateWinCondition(lastround);
  if (win === 1) {
    document.getElementById("winnertext").innerHTML =
      "Player " + lastround + " won!";
    alert("Player " + lastround + " won!");
    emptyCells();
  } else if (win === 2) {
    document.getElementById("winnertext").innerHTML = "It's a tie!";
    alert("It's a tie!");
    emptyCells();
  }
  // if win === 0 ---> no one won or lost yet ---> the game goes on

  // The player symbol, whose turn it is next, is shown on the page
  console.log("Setting new player's ID on the page: " + playerno);
  document.getElementById("samplepar").innerHTML = playerno;
}

function fillCell(cell, playerno) {
  var cellA = cell.getAttribute("class");
  console.log("CELL ATTRIBUTE " + cellA);
  if (cellA === "neutral") {
    // If the on-clicked cell is empty, the cell is filled with the symbol
    // of the current player.
    console.log("Player " + playerno + " is getting a cell filled!");
    const att = document.createAttribute("class");
    if (playerno == 1) {
      att.value = "x";
      cell.setAttributeNode(att);
      playerno = 2;
      console.log("New playerno " + playerno);
    } else if (playerno == 2) {
      att.value = "o";
      console.log("The cell is filled with: " + att.value);
      cell.setAttributeNode(att);
      playerno = 1;
      console.log("New playerno " + playerno);
    }
  } else {
    alert("Select another cell!");
    /* The playerno does not switch */
  }
  /* The symbol of the next player is returned. */
  return playerno;
}

function calculateWinCondition(playerno) {
  /* We use the symbols in checking the winning
    conditions as they are the names of the classes
    of the cells, too. */
  if (playerno == 1) {
    player = "x";
  } else if (playerno == 2) {
    player = "o";
  }

  console.log("Calculating the winning condition");

  var tbl = document.getElementById("board");

  var i,
    j,
    player,
    k1 = 0,
    k2 = 0,
    t = 0,
    counter = 0,
    cell,
    result = true,
    win = 0,
    diagonal1 = [],
    diagonal2 = [];

  /* Get the children of our grid layout: */
  var children = tbl.children;

  // CHECK THE WINNING CONDITIONS.
  for (var i = 0; i < 5; i++) {
    // Check 5 elements a row at a time
    result = true;
    // CHECKING FOR THE RESULT OF EACH ROW:
    for (var j = 0; j < children.length; j++) {
      cell = children[j];
      result = result && cell.className === player;
      // if any of the cells in the row is not equal to the player symbol, this Boolean value will be false.

      /* PREPARING THE DIAGONAL CHECK IN THE SAME LOOP
       Filling the arrays for the diagonals in the same loop for bettering the efficiency: */
      if (
        (i === 0 && j === 0) ||
        (i === 1 && j === 6) ||
        (i === 2 && j === 12) ||
        (i === 3 && j === 18) ||
        (i === 4 && j === 24)
      ) {
        // From up-left to down-right diagonal
        diagonal1[k1] = cell.className;
        k1++;
      }
      if (
        (i === 0 && j === 4) ||
        (i === 1 && j === 8) ||
        (i === 2 && j === 12) ||
        (i === 3 && j === 16) ||
        (i === 4 && j === 20)
      ) {
        // From up-right to down-left diagonal
        diagonal2[k2] = cell.className;
        k2++;
      }

      /* PREPARING THE TIE CHECK IN THE SAME LOOP */
      // All the non-null values are counted to see if all the cells in the table
      // are filled:
      if (cell.className === "x" || cell.className === "o") {
        t++;
      }
      // Later it's checked if t === counter
      // --> if true --> tie
      counter++;
    }
    // Checking if the result is true after each row
    if (result === true) {
      win++;
      return win;
    }
  }
  console.log("Iterated through rows successfully.");
  console.log(
    "Count of cells in the grid: " + counter + " | Count of marked cells: " + t
  );

  /* CHECK EACH COLUMN: */
  // As many rounds i as there are rows
  for (i = 0; i < 5; i++) {
    result = true;
    var idx = i;
    cell = children[idx];
    // j = the column index
    for (j = 0; j < 5; j++) {
      result = result && cell.className === player;
      idx = idx + 5;
      cell = children[idx];
    }
    // Checking if the result is true after each column
    if (result === true) {
      win++;
      return win;
    }
  }
  console.log("Iterated through columns successfully.");

  /* GO THROUGH THE ARRAYS FILLED WITH THE DIAGONAL VALUES: */

  result = true;
  // From up-left to down-right:
  // Iterate through the whole diagonal1 array checking if all the symbols equal to the current player symbol
  for (j = 0; j < k1; j++) {
    result = result && diagonal1[j] === player;
  }
  // After iteration, check if the result is true <=> if all the symbols = player symbol

  if (result === true) {
    win++;
    return win;
  }

  // From up-right to down-left:
  result = true;
  for (j = 0; j < k2; j++) {
    result = result && diagonal2[j] === player;
  }
  // After iteration, check if the result is true <=> if all the symbols = player symbol
  if (result === true) {
    win++;
    return win;
  }

  // Check if all the cells are full -> a tie
  if (t === counter) {
    win = 2;
    return win;
  }

  // If none of the cases were true, the function returns 0
  return win;
}

/* The progress bar moves forward as the time moves forward.
Each turn is max. 10 seconds by length.
When the length exceeds 10 sec, the turn will be automatically switched.

If the table is clicked while there's still time left in the interval,
the moveProgressBar starts from the 10 seconds again. */

function moveProgressBar() {
  var bar = document.getElementById("gamebar");
  var time = 10; // time of a turn: 10 seconds
  var width = 100; // the width of the green is first at 100%
  bar.style.width = width + "%";
  document.getElementById("timeleft").innerHTML = time;
  /* If the progress bar has reached 0 sec, it will return 0.
  Otherwise it returns 1. */
  /* if the function is running already, abort and start over.
  if the function is NOT running yet, start as normal. */

  /* the interval time is 1000 milliseconds = 1 second  */
  timerID = setInterval(timerFunction, 1000);
  function timerFunction() {
    /* 10 seconds have passed:
    - alert: time has passed
    - force switch the playerno
    - start moveProgressBar over */
    if (time <= 0) {
      clearInterval(timerID);
      alert("Time ended!");
      checker = -1;
      var lastround = document.getElementById("samplepar").innerHTML;
      checkTurns(lastround);
    } else {
      /* In each interval, there's one second less time which
    is shown on the bar. */
      time--;
      width = time * 10;
      bar.style.width = width + "%";
      document.getElementById("timeleft").innerHTML = time;
    }
  }
}

function emptyCells() {
  console.log("Emptying the table cells");

  var tbl = document.getElementById("board");
  var children = tbl.children;
  var i, cell;
  // As many rounds i as there are rows:
  for (i = 0; i < children.length; i++) {
    cell = children[i];
    cell.innerHTML = ""; // fill each cell with empty
    cell.className = "neutral"; // colour each cell back to neutral
  }
  console.log("All cells emptied.");
}
