const app = require("./app");

const { PORT = 2309 } = process.env;

app.listen(PORT, () => console.log(`Listening on ${PORT}...`));
