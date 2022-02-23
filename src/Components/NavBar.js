import QueryStatsIcon from "@mui/icons-material/QueryStats";
import HelpOutlineRoundedIcon from "@mui/icons-material/HelpOutlineRounded";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import React, { useState } from "react";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const NavBar = () => {
  const helpModal = () => {
    setOpen(true);
    console.log("h");
  };

  const statsModal = () => {
    setOpen(true);
    console.log("h");
  };

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Stack
        direction="row"
        spacing={7}
        sx={{ mt: 1, mb: 1 }}
        justifyContent="center"
        alignItems="center"
      >
        <IconButton onClick={helpModal}>
          <HelpOutlineRoundedIcon />
        </IconButton>
        <Typography variant="h4">FAUXDLE</Typography>
        <IconButton onClick={statsModal}>
          <QueryStatsIcon />
        </IconButton>
      </Stack>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>Working on this section...</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Created by Elijah Silverman{" "}
            <br />
            <a href="https://github.com/elijahms/somegame">Github</a>
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default NavBar;
