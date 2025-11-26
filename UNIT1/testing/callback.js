function fetchUser(userId, callback) {
  if (!userId) {
    callback(new Error("User ID is required"), null);
    return;
  }

  // Simulate fetching user
  setTimeout(() => {
    const user = { id: userId, name: "Ronak" };
    callback(null, user);
  }, 1000);
}

fetchUser(101, (err, user) => {
  if (err) {
    console.error("Error:", err.message);
  } else {
    console.log("User:", user.id);
  }
});