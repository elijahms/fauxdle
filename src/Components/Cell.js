import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

const Cell = ({ word, box, currentRow, row, placement, guess }) => {
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
      return box ? box[placement] : "";
    }
  };

  return (
    <Box className="cell" sx={{ backgroundColor: `${cellBackGround()}` }}>
      <Typography variant="h3" align="center" justify="center">
        {cellContent()}
      </Typography>
    </Box>
  );
  // }
};

export default Cell;
