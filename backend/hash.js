import bcrypt from "bcryptjs";

const run = async () => {
  console.log("1234 →", await bcrypt.hash("1234", 10)); // student01
  console.log("5678 →", await bcrypt.hash("5678", 10)); // student02
};

run();
