import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

const Cell = ({ word, boxes, currentRow, row, placement, guess }) => {
  if (row === currentRow) {
    return (
      <Box
        sx={{
          backgroundColor: "#B2BEB5",
          border: "2px solid #B2BEB5",
          fontSize: "2rem",
          width: "60px",
          height: "60px",
          color: "black",
        }}
      >
        <Typography variant="h3" align="center" justify="center">
          {word.charAt(placement)}
        </Typography>
      </Box>
    );
  } else {
    return (
      <Box
        sx={{
          backgroundColor: `${boxes ? boxes[placement] : "#B2BEB5"}`,
          border: `2px solid #B2BEB5`,
          fontSize: "2rem",
          width: "60px",
          height: "60px",
          color: "white",
        }}
      >
        <Typography variant="h3" align="center" justify="center">
          {guess ? guess.charAt(placement) : ""}
        </Typography>
      </Box>
    );
  }
};

export default Cell;
