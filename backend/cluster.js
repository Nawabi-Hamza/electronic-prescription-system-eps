const cluster = require("cluster");
const os = require("os");
const app = require("./server");


if (cluster.isPrimary) {
  const cpuCount = os.cpus().length;

  console.log(`🔥 Master ${process.pid} running`);
  console.log(`🧠 Starting ${cpuCount} workers...`);

  // Start workers
  for (let i = 0; i < cpuCount; i++) {
    cluster.fork();
  }

  // Auto-restart dead workers
  cluster.on("exit", (worker) => {
    console.error(`❌ Worker ${worker.process.pid} died. Restarting...`);
    cluster.fork();
  });

} else {
  const PORT = process.env.SERVER_PORT || 4000;

  app.listen(PORT, () => {
    console.log(`✔ Worker ${process.pid} running on port ${PORT}`);
  });
}
