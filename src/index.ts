import { initServer } from "./app";

async function init() {
  const app = await initServer();
  app.listen(8203, () => {
    console.log(`Server started at PORT: 8203`);
  });
}

init();
