import QueryStatsIcon from "@mui/icons-material/QueryStats";
import HelpOutlineRoundedIcon from "@mui/icons-material/HelpOutlineRounded";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import React, { useState } from "react";
import Button from '@mui/material/Button'

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const NavBar = ({ stats, winningText}) => {
  const [open, setOpen] = useState(false);
  const [navDialog, setNavDialog] = useState({ title: "", content: "" });
  let rowAvg = stats.rowWon.reduce(function (a, b) {
    return a + b;
  }, 0);
  let timeAvg = stats.avgDuration.reduce(function (a, b) {
    return a + b;
  }, 0);
    const shareWin = () => {
      if (navigator.share) {
        navigator.share({
          title: "Fauxdle",
          text: `${winningText()}`,
        });
      } else {
        console.log(winningText())
        alert("Sharing is Disabled on Desktop");
      }
    };

  const statsModal = () => {
    setNavDialog({
      ...navDialog,
      title: "Your Stats",
      content: <StatsDialog />,
    });
    setOpen(true);
  };
  const helpModal = () => {
    setNavDialog({
      ...navDialog,
      title: "Fauxdle",
      content: <InfoDialog />,
    });
    setOpen(true);
  };

  const InfoDialog = () => {
    return (
      <DialogContentText>
        Literally the same* rules as{" "}
        <a
          target="_blank"
          href="https://www.nytimes.com/games/wordle/index.html"
        >
          Wordle
        </a>
        .
        <br />
        Created by:{" "}
        <a target="_blank" href="https://elijahsilverman.com">
          Elijah Silverman
        </a>{" "}
        <br />
        <a target="_blank" href="https://github.com/elijahms/somegame">
          Github
        </a>
        <br />
        <br />
        If a user types a guess with two letters such as 'GRILL' and the correct
        answer is 'LINEN' both the 'L's will appear orange unlike in Wordle.
      </DialogContentText>
    );
  };

  const StatsDialog = () => {
    return (
      <DialogContentText>
        Games Won: {stats.wins} <br />
        Games Lost: {stats.losses} <br />
        Average Win Row: {Math.floor(rowAvg / stats.wins)} <br />
        Average Time Playing: {Math.floor(timeAvg / stats.wins)} seconds <br />
        <Button variant="contained" sx={{ mt: 3 }} onClick={shareWin}>
          Share
        </Button>
      </DialogContentText>
    );
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
        onClose={() => setOpen(false)}
        aria-describedby="user-game-stats"
      >
        <DialogTitle>{navDialog.title}</DialogTitle>
        <DialogContent>{navDialog.content}</DialogContent>
      </Dialog>
    </>
  );
};

export default NavBar;
