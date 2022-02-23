import Button from "@mui/material/Button";

const Key = ({
  letter,
  enterWord,
  notInWord,
  wonGame,
  lostGame,
  cellColor,
}) => {
  const keyColor = () => {
    if (letter === "⏎" || letter === "⬅") {
      return "green";
    } else if (notInWord.flat().includes(letter)) {
      return "#404744";
    } else {
      let cellArr = [...cellColor].flat().filter((s) => s[0] === letter);
      if (cellArr.length > 0) {
        console.log(cellArr.flat()[cellArr.flat().length - 1]);
        return cellArr.flat()[cellArr.flat().length - 1];
      } else {
        return "";
      }
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
        "&:hover": {
          backgroundColor: `${keyColor()}`,
        },
      }}
      onClick={enterWord}
      value={letter}
    >
      {letter}
    </Button>
  );
};

export default Key;
