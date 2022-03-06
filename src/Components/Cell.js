import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

const Cell = ({ word, box, currentRow, row, placement, guess, triggerAn }) => {
  const cellContent = () => {
    if (row !== currentRow) {
      return guess ? guess.charAt(placement).toUpperCase() : "";
    } else {
      return word.charAt(placement).toUpperCase();
    }
  };

  const cellBackGround = () => {
    if (row === currentRow) {
      return "";
    } else {
      return box ? box[placement] : "";
    }
  };

  return (
    <Box
      className={
        row === currentRow - 1 && triggerAn === true
          ? `cell animate__animated animate__fadeIn animate__delay-${placement + 1}s`
          : "cell"
      }
      sx={{ backgroundColor: `${cellBackGround()}` }}
    >
      <Typography variant="h3" align="center" justify="center">
        {cellContent()}
      </Typography>
    </Box>
  );
  // }
};

export default Cell;
