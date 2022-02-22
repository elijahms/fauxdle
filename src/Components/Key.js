import Button from "@mui/material/Button";

const Key = ({ letter, Enterword, notInWord }) => {
  return (
    <Button
      disabled={notInWord.flat().includes(letter) ? true : false}
      variant="contained"
      sx={{ p: 0.5, m: 0.2, minHeight: '50px'}}
      onClick={Enterword}
      value={letter}
    >
      {letter}
    </Button>
  );
};

export default Key;
