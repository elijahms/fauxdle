import Button from "@mui/material/Button";

const Key = ({ letter, Enterword, notInWord }) => {
  return (
    <Button
      disabled={notInWord.flat().includes(letter) ? true : false}
      variant="contained"
      sx={{ p: 0.5, m: 0.2, width: '100%'}}
      onClick={Enterword}
      value={letter}
    >
      {letter}
    </Button>
  );
};

export default Key;
