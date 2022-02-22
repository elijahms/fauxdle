import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import { useState } from "react";
import { Button } from "@mui/material";

const DialogS = (props) => {
  const { dialogTitle, dialogContent, handleClickOpenDialog, openDialog, handleCloseDialog, winningText } = props;

  const shareWin = () => {
    if (navigator.share) {
      navigator.share({title: 'Fauxdle', text: winningText})
    } else {
      console.log('not working')
    }
  }

  return (
    <Dialog open={openDialog} onClose={handleCloseDialog}>
      <DialogTitle>{dialogTitle}</DialogTitle>
      <DialogContent>
        <DialogContentText>{dialogContent}</DialogContentText>
      </DialogContent>
      <Button onClick={shareWin}>
        Share
      </Button>
    </Dialog>
  );
};

export default DialogS;
