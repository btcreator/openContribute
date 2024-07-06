const mongoose = require("mongoose");
const app = require("./app");
const { logDate } = require("./utils/helpers");
require("@dotenvx/dotenvx").config({ path: "./config.env" });

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);
mongoose
  .connect(DB)
  .then(() => {
    console.log(`${logDate()} > Connection to database established...`);
  })
  .catch((err) =>
    console.log(`${logDate()} > Connection to database is terminated...`)
  );

const port = process.env.PORT || 3500;
const host = process.env.HOST || "localhost";
app.listen(port, host, () => {
  console.log(`${logDate()} > Server start up on host:port ${host}/${port}...`);
});
