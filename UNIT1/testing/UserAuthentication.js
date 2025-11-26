function authenticateUser(username, password, callback) {
  setTimeout(() => {
    if (username === "admin" && password === "work") {
      callback(null, { id: 1, username: "admin", role: "admin" });
    } else {
      callback(new Error("Invalid Credentials"), null);
    }
  }, 1000);
}

authenticateUser("admin", "work", (err, data) => {
  if (err) {
    console.log("not valid");
  } else {
    console.log(data);
  }
});