import Key from "./Key";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";

const KeyBoard = ({ enterWord, cellColor }) => {
  const firstrow = ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"];
  const secondrow = ["a", "s", "d", "f", "g", "h", "j", "k", "l"];
  const thirdrow = ["⏎", "z", "x", "c", "v", "b", "n", "m", "⬅"];

  return (
    <Box id="keyboard-box">
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="strech"
        className="keyboard-row"
        sx={{ mb: 0.5 }}
      >
        {firstrow.map((l, i) => {
          return (
            <Key
              letter={l}
              key={i}
              cellColor={cellColor}
              enterWord={enterWord}
            />
          );
        })}
      </Stack>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="strech"
        className="keyboard-row"
        sx={{ mb: 0.5, width: "92%", ml: "4%" }}
      >
        {secondrow.map((l, i) => {
          return (
            <Key
              letter={l}
              key={i}
              cellColor={cellColor}
              enterWord={enterWord}
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
              cellColor={cellColor}
              enterWord={enterWord}
            />
          );
        })}
      </Stack>
    </Box>
  );
};

export default KeyBoard;
