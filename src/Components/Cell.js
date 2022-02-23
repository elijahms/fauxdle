import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

const Cell = ({ word, boxes, currentRow, row, placement, guess }) => {
  const cellContent = () => {
    if (row !== currentRow) {
      return guess ? guess.charAt(placement) : "";
    } else {
      return word.charAt(placement);
    }
  };

  const cellBackGround = () => {
    if (row === currentRow) {
      return "";
    } else {
      return boxes ? boxes[placement] : "";
    }
  };

  return (
    <Box
      sx={{
        backgroundColor: `${cellBackGround()}`,
        border: `2px solid #B2BEB5`,
        fontSize: "2rem",
        width: "63px",
        height: "63px",
        color: "white",
      }}
    >
      <Typography variant="h3" align="center" justify="center">
        {cellContent()}
      </Typography>
    </Box>
  );
  // }
};

export default Cell;
