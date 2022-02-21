import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { useState, useEffect } from "react";
import KeyBoard from "./KeyBoard";
import Typography from "@mui/material/Typography";
import Cell from "./Cell";
import Stack from "@mui/material/Stack";
import Snackbar from "@mui/material/Snackbar";
import { WORDS } from "../Constants/wordlist";
import { useCookies } from "react-cookie";

function App() {
  const [cookies, setCookie] = useCookies(["word", "guesses"]);

  const [word, setWord] = useState("");
  const [guess, setGuess] = useState([]);
  const [boxes, setBoxes] = useState([]);
  const [currentRow, setCurrentRow] = useState(0);
  const [notInWord, setNotInWord] = useState([]);

  const [snackMessage, setSnackMessage] = useState("Not in Word List");
  const [openSnackBar, setOpenSnackBar] = useState(false);

  const [wonGame, setWonGame] = useState(false);

  const [falseWord, setFalseWord] = useState(false);
  const [answer, setAnswer] = useState("");

  const [guessObj, setGuessObj] = useState({
    boxes: [],
    guesses: [],
    currentRow: 0,
    notInWord: [],
    word: "",
  });

  window.addEventListener("beforeunload", function (e) {
    e.preventDefault();
    localStorage.setItem("guess", JSON.stringify(guess));
    localStorage.setItem("boxes", JSON.stringify(boxes));
    localStorage.setItem("word", JSON.stringify(word));
    localStorage.setItem("currentRow", JSON.stringify(currentRow));
    localStorage.setItem("notInWord", JSON.stringify(notInWord));
  });

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackBar(false);
  };

  useEffect(() => {
    if (!cookies.word) {
      localStorage.clear();
      let expiration = new Date();
      expiration.setHours(23, 59, 59, 999);
      console.log(expiration);
      setCookie("word", WORDS[Math.floor(Math.random() * WORDS.length)], {
        path: "/",
        expires: expiration,
        secure: true,
        sameSite: "strict",
      });
      console.log(cookies.word);
    } else {
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
    }
    setAnswer(cookies.word);
  }, []);

  function Enterword(e) {
    if (e.target.value === "DELETE") {
      if (word.length > 0) {
        setWord(() => word.slice(0, -1));
        setGuessObj({ ...guessObj, word: word.slice(0, -1) });
      }
    } else if (e.target.value === "ENTER") {
      if (word.length === 5) {
        checkAnswer();
      } else {
        setSnackMessage("Not Long Enough");
        setOpenSnackBar(true);
      }
    } else {
      if (word.length <= 4 && word.length >= 0) {
        setWord(() => word + e.target.value);
        setGuessObj({ ...guessObj, word: word + e.target.value });
      }
    }
  }

  const gameWon = () => {
    setOpenSnackBar(true);
    setWonGame(true);
  };

  const gameLost = () => {
    console.log("you lost");
  };

  const checkAnswer = () => {
    setFalseWord(false);
    if (WORDS.includes(word)) {
      setCurrentRow(currentRow + 1);
      setGuess([...guess, word]);
      if (word === answer) {
        setSnackMessage("You Won!");
        let currentBoxes = [];
        word.split("").map(() => currentBoxes.push("green"));
        setBoxes([...boxes, currentBoxes]);
        setWord("");
        gameWon();
      } else {
        let currentBoxes = [];
        let letnotinword = [];
        word.split("").map((letter, index) => {
          if (answer.includes(letter)) {
            if (answer[index] === letter) {
              return currentBoxes.push("green");
            } else {
              return currentBoxes.push("orange");
            }
          } else {
            return currentBoxes.push("grey"), letnotinword.push(letter);
          }
        });
        setBoxes([...boxes, currentBoxes]);
        setNotInWord([...notInWord, letnotinword]);
      }
      setWord("");
    } else {
      setSnackMessage("Not in Word List");
      setOpenSnackBar(true);
      setFalseWord(true);
    }
  };

  return (
    <Container
      maxWidth="md"
      component="main"
      sx={{
        marginTop: "8vh",
        marginBottom: 3,
        display: "column",
      }}
    >
      <Box sx={{ display: "flex", mb: 3 }}>
        <Typography sx={{ margin: "auto" }} variant="h4">
          WOOOOOORDLE
        </Typography>
      </Box>
      <Box sx={{ mb: 3 }}>
        {[...Array(6)].map((stack, s) => {
          return (
            <Stack
              sx={{ mb: 0.5, justifyContent: "center" }}
              key={s}
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
        })}
      </Box>
      <Box sx={{ display: "flex" }}>
        {!wonGame && <KeyBoard Enterword={Enterword} notInWord={notInWord} />}
      </Box>
      <Snackbar
        open={openSnackBar}
        autoHideDuration={6000}
        onClose={handleClose}
        message={snackMessage}
      />
    </Container>
  );
}

export default App;
