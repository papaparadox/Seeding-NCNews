const app = require("./app");

app.listen(2309, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("listening 2309...");
  }
});
