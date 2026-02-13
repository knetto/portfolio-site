    (function() {
      const colors = [
        { black: "#0A0A0A", white: "#EEEBE0" },
        { black: "#0D0D0D", white: "#B9E6FF" },
        { black: "#0B0B0C", white: "#FFC8DD" },
        { black: "#101011", white: "#E4FF8D" },
        { black: "#0E0F10", white: "#FFDBA4" },
        { black: "#111111", white: "#C5BFF9" },
        { black: "#0E0D0F", white: "#F9AFAE" },
        { black: "#131415", white: "#C2FBD7" },
        { black: "#0F0F10", white: "#FF4E4E" },
        { black: "#121214", white: "#00FFCA" },
        { black: "#131316", white: "#FFD700" },
        { black: "#151618", white: "#40E0D0" },
        { black: "#0C0C0C", white: "#FF7EDB" },
        { black: "#171819", white: "#8AFF00" },
        { black: "#101010", white: "#FF9F1C" },
        { black: "#18191A", white: "#89C2D9" },
        { black: "#0D0E0F", white: "#FF5F00" },
        { black: "#1A1A1B", white: "#B983FF" },
        { black: "#0B0C0D", white: "#82FF9E" },
        { black: "#1C1C1D", white: "#FFE5B4" }
      ];
      
      // Pick random theme immediately
      const randomIndex = Math.floor(Math.random() * colors.length);
      const theme = colors[randomIndex];
      
      // Apply instantly to documentElement before render
      const root = document.documentElement;
      root.style.setProperty("--black", theme.black);
      root.style.setProperty("--white", theme.white);
      root.style.setProperty("--navBackground", theme.white);
      root.style.setProperty("--navText", theme.black);
      root.style.setProperty("--scrollbarTrack", theme.black);
      root.style.setProperty("--scrollbar", theme.black);
      root.style.setProperty("--scrollbarThumb", theme.white);
      root.style.setProperty("--bg", theme.white);
      root.style.setProperty("--navBarText", theme.white);
      
      // Store for JS to pick up later
      window.__initialThemeIndex = randomIndex;
    })();
