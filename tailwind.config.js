const withMT = require("@material-tailwind/react/utils/withMT"); //using tailwind
 
module.exports = withMT({
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
});
