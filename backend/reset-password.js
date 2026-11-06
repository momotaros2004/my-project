import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import bcrypt from "bcryptjs";
import db from "./database.js";

const prompt = readline.createInterface({ input, output });

try {
  const username = (await prompt.question("Username to reset: ")).trim();
  const password = await prompt.question("New password (minimum 8 characters): ");

  if (!username) throw new Error("Username is required.");
  if (password.length < 8) throw new Error("Password must be at least 8 characters.");

  const passwordHash = await bcrypt.hash(password, 10);
  db.query(
    "UPDATE users SET password = ? WHERE username = ?",
    [passwordHash, username],
    (error, result) => {
      if (error) {
        console.error("Password reset failed:", error.message);
        process.exitCode = 1;
      } else if (result.affectedRows === 0) {
        console.error(`No account found for username "${username}".`);
        process.exitCode = 1;
      } else {
        console.log(`Password reset complete for "${username}".`);
      }

      prompt.close();
      db.end();
    }
  );
} catch (error) {
  console.error(error.message);
  prompt.close();
  db.end();
  process.exitCode = 1;
}
