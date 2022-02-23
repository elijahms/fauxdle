import QueryStatsIcon from "@mui/icons-material/QueryStats";
import HelpOutlineRoundedIcon from "@mui/icons-material/HelpOutlineRounded";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";

const NavBar = () => {
  return (
    <Stack
      direction="row"
      spacing={7}
      sx={{ mt: 1, mb: 1 }}
      justifyContent="center"
      alignItems="center"
    >
      <HelpOutlineRoundedIcon />
      <Typography variant="h4">FAUXDLE</Typography>
      <QueryStatsIcon />
    </Stack>
  );
};

export default NavBar;
