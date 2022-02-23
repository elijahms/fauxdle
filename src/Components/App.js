import { ThemeProvider, createTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import CssBaseline from "@mui/material/CssBaseline";
import Content from "./Content";

function App() {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  const theme = createTheme(
    {
      palette: {
        type: "light",
        mode: prefersDarkMode ? "dark" : "light",
        primary: {
          main: "#808080",
        },
        secondary: {
          main: "#7558cc",
        },
        background: {
          default: "#7558cc",
        },
      },

      typography: {
        fontFamily: "Raleway, Arial",
      },
      components: {
        MuiButton: {
          styleOverrides: {
            root: { minWidth: 0 },
          },
        },
      },
    },
    [prefersDarkMode]
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Content />
    </ThemeProvider>
  );
}

export default App;
