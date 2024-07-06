const app = require("./app");
require("@dotenvx/dotenvx").config("config.env");

const port = process.env.PORT || 3500;
const host = process.env.HOST || "localhost";

app.listen(port, host, () => {
  console.log(
    `${Date.now()} > Server start up on host:port ${host}/${port}...`
  );
});
