import Container from "@mui/material/Container";
import { useState, useEffect } from "react";
import KeyBoard from "./KeyBoard";
import Cell from "./Cell";
import Stack from "@mui/material/Stack";
import Snackbar from "@mui/material/Snackbar";
import { WORDS } from "../Constants/wordlist";
import { useCookies } from "react-cookie";
import Dialog from "./DialogS";
import NavBar from "./NavBar";

function Content() {
  const [cookies, setCookie] = useCookies(["word"]);
  const [word, setWord] = useState("");
  const [guess, setGuess] = useState([]);
  const [boxes, setBoxes] = useState([]);
  const [currentRow, setCurrentRow] = useState(0);
  const [notInWord, setNotInWord] = useState([]);
  const [snackMessage, setSnackMessage] = useState("Not in Word List");
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [wonGame, setWonGame] = useState(false);
  const [answer, setAnswer] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [winningText, setWinningText] = useState("");
  const [dialogContent, setDialogContent] = useState("");
  const [dialogTitle, setDialogTitle] = useState("");
  const [lostGame, setLostGame] = useState(false);
  const [cellColor, setCellColor] = useState([]);
  const [userStats, setUserStats] = useState({
    wins: 0,
    losses: 0,
    rowWon: [],
    avgDuration: [],
    gamesPlayed: 0,
  });
  let gameStart = new Date();

  useEffect(() => {
    if (word !== "" || currentRow !== 0) {
      localStorage.setItem("guess", JSON.stringify(guess));
      localStorage.setItem("boxes", JSON.stringify(boxes));
      localStorage.setItem("word", JSON.stringify(word));
      localStorage.setItem("currentRow", JSON.stringify(currentRow));
      localStorage.setItem("notInWord", JSON.stringify(notInWord));
      localStorage.setItem("gameWon", JSON.stringify(wonGame));
      localStorage.setItem("gameLost", JSON.stringify(lostGame));
      localStorage.setItem("stats", JSON.stringify(userStats));
    }
  }, [word, currentRow, userStats]);

  useEffect(() => {
    if (!cookies.word || localStorage.getItem('nolimitmode')) {
      localStorage.removeItem(
        "guess",
        "boxes",
        "word",
        "currentRow",
        "notInWord",
        "gameWon",
        "gameLost"
      );
      let expiration = new Date();
      expiration.setHours(23, 59, 59, 999);
      let syncedAnswer = dayOfYear(new Date());
      syncedAnswer = WORDS[Math.floor((syncedAnswer / 365) * WORDS.length)];
      if (localStorage.getItem('nolimitmode')) {
        syncedAnswer = WORDS[Math.floor(Math.random() * WORDS.length)];
      }
      //let todaysAnswer = WORDS[Math.floor(Math.random() * WORDS.length)];
      setCookie("word", syncedAnswer, {
        path: "/",
        expires: expiration,
        secure: true,
        sameSite: "strict",
      });
      setAnswer(syncedAnswer);
      localStorage.setItem("guess", JSON.stringify([]));
      localStorage.setItem("boxes", JSON.stringify([]));
      localStorage.setItem("word", JSON.stringify(""));
      localStorage.setItem("currentRow", JSON.stringify(0));
      localStorage.setItem("notInWord", JSON.stringify([]));
      localStorage.setItem("gameWon", "false");
      localStorage.setItem("gameLost", "false");
    } else {
      setAnswer(cookies.word);
      let savedGuess = localStorage.getItem("guess");
      let savedBoxes = localStorage.getItem("boxes");
      let savedWord = localStorage.getItem("word");
      let savedCurrentRow = localStorage.getItem("currentRow");
      let savedNotInWord = localStorage.getItem("notInWord");
      setGuess(JSON.parse(savedGuess));
      setBoxes(JSON.parse(savedBoxes));
      setWord(JSON.parse(savedWord));
      setNotInWord(JSON.parse(savedNotInWord));
      setCurrentRow(JSON.parse(savedCurrentRow));
      if (localStorage.getItem("gameWon") === "true") {
        gameWon();
      }
      if (localStorage.getItem("gameLost") === "true") {
        gameLost();
      }
    }
    if (localStorage.getItem("stats")) {
      let stats = localStorage.getItem("stats");
      setUserStats(JSON.parse(stats));
    } else {
      localStorage.setItem("stats", JSON.stringify({}));
    }
  }, []);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackBar(false);
  };

  const dayOfYear = (date) =>
    Math.floor(
      (date - new Date(date.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24
    );

  const enterWord = (e) => {
    if (e.target.value === "⬅") {
      if (word.length > 0) {
        setWord(() => word.slice(0, -1));
      }
    } else if (e.target.value === "⏎") {
      if (word.length === 5) {
        checkAnswer();
      } else {
        setSnackMessage("Not Long Enough");
        setOpenSnackBar(true);
      }
    } else {
      if (word.length <= 4 && word.length >= 0) {
        setWord(() => word + e.target.value);
      }
    }
  };

  const handleClickOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const shareWin = () => {
    let shareabletext = [
      boxes.flat().map((c) => {
        if (c === "green") {
          return "🟩";
        } else if (c === "orange") {
          return "🟧";
        } else {
          return "⬛";
        }
      }),
      "🟩",
      "🟩",
      "🟩",
      "🟩",
      "🟩",
    ];
    let firstFauxdle = new Date("02/22/2022");
    let today = new Date();
    let daysFromStart = Math.floor((today - firstFauxdle) / (1000 * 3600 * 24));
    shareabletext =
      `Fauxdle #${daysFromStart} | ${currentRow + 1}/6 \n` +
      shareabletext
        .flat()
        .map((m, i) => (i % 5 === 0 ? "\n" + m : m))
        .join("");
    return shareabletext;
  };

  const winOrLose = (currRow, correctCount) => {
    if (correctCount === 5) {
      gameWon(currRow);
    } else if (currRow >= 6) {
      gameLost();
    }
  };

  const gameWon = (currRow) => {
    let now = new Date();
    let timeFromStart = Math.floor((now - gameStart) / 100);
    setUserStats({
      ...userStats,
      wins: userStats.wins + 1,
      gamesPlayed: userStats.gamesPlayed + 1,
      rowWon: [...userStats.rowWon, currRow],
      avgDuration: [...userStats.avgDuration, timeFromStart],
    });
    setWonGame(true);
    setDialogContent("Whoohoo you got it! Keep it up!");
    setDialogTitle("You Won!");
    setWinningText(shareWin());
    handleClickOpenDialog();
  };

  const gameLost = () => {
    setUserStats({
      ...userStats,
      losses: userStats.losses + 1,
      gamesPlayed: userStats.gamesPlayed + 1,
    });
    setLostGame(true);
    setDialogContent("Better luck next time...");
    setDialogTitle("Tomorrows the charm!");
    handleClickOpenDialog();
  };

  const invalidWord = () => {
    setSnackMessage("Not in Word List");
    setOpenSnackBar(true);
  };

  const checkAnswer = () => {
    if (guess[0] === "noxxx" && word === "limit") {
      localStorage.setItem("nolimitmode", "true");
    }
    if (WORDS.includes(word) || word === "noxxx") {
      let currentBoxes = [];
      let charNotInWord = [];
      let correctCount = 0;
      let currCellColor = [];
      word.split("").forEach((letter, i) => {
        if (answer.includes(letter)) {
          if (answer[i] === letter) {
            correctCount++;
            currentBoxes.push("green");
            currCellColor.push([letter, "green"]);
          } else {
            currentBoxes.push("orange");
            currCellColor.push([letter, "orange"]);
          }
        } else {
          currentBoxes.push("gray");
          charNotInWord.push(letter);
        }
      });
      winOrLose(currentRow + 1, correctCount);
      setCurrentRow(() => currentRow + 1);
      setCellColor([...cellColor, currCellColor]);
      setGuess([...guess, word]);
      setBoxes([...boxes, currentBoxes]);
      setNotInWord([...notInWord, charNotInWord]);
      setWord("");
    } else {
      invalidWord();
    }
  };

  function CellLayout() {
    return [...Array(6)].map((stack, s) => {
      return (
        <Stack
          sx={{ mb: 0.5 }}
          key={s}
          justifyContent="center"
          direction="row"
          spacing={1}
        >
          {[...Array(5)].map((cell, c) => {
            let row = Math.floor((c + 5 * s) / 5);
            return (
              <Cell
                key={c}
                row={row}
                guess={guess[row]}
                placement={c}
                currentRow={currentRow}
                word={word}
                boxes={boxes[row]}
              />
            );
          })}
        </Stack>
      );
    });
  }

  return (
    <Container maxWidth="sm">
      <NavBar stats={userStats} />
      <CellLayout />
      <KeyBoard
        enterWord={enterWord}
        notInWord={notInWord}
        wonGame={wonGame}
        lostGame={lostGame}
        cellColor={cellColor}
      />
      <Snackbar
        open={openSnackBar}
        autoHideDuration={1000}
        onClose={handleClose}
        message={snackMessage}
      />
      <Dialog
        dialogTitle={dialogTitle}
        dialogContent={dialogContent}
        openDialog={openDialog}
        handleCloseDialog={handleCloseDialog}
        winningText={winningText}
        wonGame={wonGame}
      />
    </Container>
  );
}

export default Content;
