import "dotenv/config";
import { seedArticles } from "./articles-seed";

seedArticles()
  .then(({ added, skipped }) => {
    console.log(`Articles: ${added} added, ${skipped} already existed (left untouched).`);
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
