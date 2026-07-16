import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes";
import disciplinasRoutes from "./routes/DisciplinasRoutes";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/disciplinas", disciplinasRoutes);


app.get("/", (req, res) => {
  res.json({ mensagem: "API do Dashboard da Faculdade no ar" });
});

const PORTA = process.env.PORT || 3000;

app.listen(PORTA, () => {
  console.log(`Servidor rodando na porta ${PORTA}`);
});