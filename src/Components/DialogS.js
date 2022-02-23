import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import Button from "@mui/material/Button";

const DialogS = ({
  dialogTitle,
  dialogContent,
  openDialog,
  handleCloseDialog,
  winningText,
  wonGame,
}) => {
  const shareWin = () => {
    if (navigator.share) {
      navigator.share({
        title: "Fauxdle",
        text: `${winningText}`,
      });
    } else {
      alert("Sharing is Disabled");
    }
  };

  return (
    <Dialog open={openDialog} onClose={handleCloseDialog}>
      <DialogTitle>{dialogTitle}</DialogTitle>
      <DialogContent>
        <DialogContentText>{dialogContent}</DialogContentText>
        {wonGame && (
          <Button variant="contained" sx={{mt:3}} onClick={shareWin}>
            Share
          </Button>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default DialogS;
