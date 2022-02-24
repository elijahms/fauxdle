import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import Button from "@mui/material/Button";

const DialogS = ({ dialog, openDialog, setOpenDialog, winningText }) => {
  const shareWin = () => {
    if (navigator.share) {
      navigator.share({
        title: "Fauxdle",
        text: `${winningText()}`,
      });
    } else {
      console.log(winningText());
      alert("Sharing is Disabled");
    }
  };

  return (
    <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
      <DialogTitle>{dialog.title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{dialog.content}</DialogContentText>
        <Button variant="contained" sx={{ mt: 3 }} onClick={shareWin}>
          Share
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default DialogS;
