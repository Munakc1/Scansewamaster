module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "rgb(var(--background))",
        foreground: "rgb(var(--foreground))",
        primary: "rgb(var(--primary))",
        lightBlue: "rgb(var(--light-blue))",
        midBlue: "rgb(var(--mid-blue))",
        success: "rgb(var(--success))",
        accent: "rgb(var(--accent))",
        darkText: "rgb(var(--dark-text))"
      }
    }
  }
}