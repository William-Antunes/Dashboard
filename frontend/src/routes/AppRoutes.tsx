import { Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Home from "../pages/Home";
import Disciplinas from "../pages/Disciplinas";
import Cadastro from "../pages/Cadastro";
import RotaProtegida from "../components/RotaProtegida";
import DisciplinaDetalhes from "../pages/DisciplinasDetalhes";
import Trabalhos from "../pages/Trabalhos";
import Provas from "../pages/Provas";
import NovaProva from "../pages/NovaProva";
import NovoTrabalho from "../pages/NovoTrabalho";



export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/cadastro" element={<Cadastro />} />
            <Route element={<RotaProtegida />}>
                <Route path="/" element={<Home />} />
                <Route path="/disciplinas" element={<Disciplinas />} />
                <Route path="/disciplinas/:id" element={<DisciplinaDetalhes />} />
                <Route path="/disciplinas/:id/prova" element={<NovaProva />} />
                <Route path="/disciplinas/:id/trabalhos/novo" element={<NovoTrabalho />} />
                <Route path="/disciplinas/:id/provas/novo" element={<NovaProva />} />
                <Route path="/trabalhos" element={<Trabalhos />} />
                <Route path="/provas" element={<Provas />} />
            </Route>
        </Routes>
    )
}