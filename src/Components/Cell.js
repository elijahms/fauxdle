import React from "react";
import Box from "@mui/material/Box";
import { Typography } from "@mui/material";

const Cell = ({ word, boxes, currentRow, row, placement, guess }) => {
  if (row === currentRow) {
    return (
      <Box
        sx={{
          backgroundColor: "gray",
          border: "2px solid gray",
          fontSize: "2rem",
          width: "50px",
          height: "50px",
          color: "white",
        }}
      >
        <Typography variant="h4" align="center" justify="center">
          {word.charAt(placement)}
        </Typography>
      </Box>
    );
  } else {
    return (
      <Box
        sx={{
          backgroundColor: `${boxes ? boxes[placement] : "gray"}`,
          border: `2px solid gray`,
          fontSize: "2rem",
          width: "50px",
          height: "50px",
          color: "gray",
        }}
      >
        <Typography variant="h4" align="center" justify="center">
          {guess ? guess.charAt(placement) : ""}
        </Typography>
      </Box>
    );
  }
};

export default Cell;
