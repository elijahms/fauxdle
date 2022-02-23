import Button from "@mui/material/Button";

const Key = ({ letter, Enterword, notInWord, wonGame, lostGame }) => {
  const keyColor = () => {
    if (letter === "⏎" || letter === "⬅") {
      return "black";
    } else if (notInWord.flat().includes(letter)) {
      return "gray";
    }
  };

  return (
    <Button
      disabled={wonGame || lostGame ? true : false}
      variant="contained"
      sx={{
        ml: 0.2,
        lr: 0.2,
        width: "100%",
        backgroundColor: `${keyColor()}`,
      }}
      onClick={Enterword}
      value={letter}
    >
      {letter}
    </Button>
  );
};

export default Key;
