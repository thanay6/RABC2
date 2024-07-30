import express from "express";
import "dotenv/config";
import "./database/db_connection";
import registrationRoutes from "./services/registration/routers/registrationRouters";
import taskRoutes from "./services/tasks/routers/taskRouter";

const app = express();
app.use(express.json());
console.log(process.env.PORT, "port");

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send(`hello world`);
});

app.use("/api", registrationRoutes);
app.use("/api", taskRoutes);

app.listen(PORT, () => {
  console.log(`server connected to ${PORT}`);
});
