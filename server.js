const dotenv = require("dotenv");
dotenv.config();

const app = require("./api/index");

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running locally on port ${PORT}`);
});
