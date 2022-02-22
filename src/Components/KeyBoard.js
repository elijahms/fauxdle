import Key from "./Key";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";

const KeyBoard = ({ Enterword, notInWord }) => {
  const firstrow = ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"];
  const secondrow = ["a", "s", "d", "f", "g", "h", "j", "k", "l"];
  const thirdrow = ["⏎", "z", "x", "c", "v", "b", "n", "m", "⌫"];

  return (
    <Box id="keyboard-box">
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="strech"
        className="keyboard-row"
      >
        {firstrow.map((l, i) => {
          return (
            <Key
              letter={l}
              key={i}
              Enterword={Enterword}
              notInWord={notInWord}
            />
          );
        })}
      </Stack>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="strech"
        className="keyboard-row"
      >
        {secondrow.map((l, i) => {
          return (
            <Key
              letter={l}
              key={i}
              Enterword={Enterword}
              notInWord={notInWord}
            />
          );
        })}
      </Stack>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="strech"
        className="keyboard-row"
      >
        {thirdrow.map((l, i) => {
          return (
            <Key
              letter={l}
              key={i}
              Enterword={Enterword}
              notInWord={notInWord}
            />
          );
        })}
      </Stack>
    </Box>
  );
};

export default KeyBoard;
