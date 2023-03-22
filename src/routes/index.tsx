import { Route, Routes } from "react-router-dom";
import Home from "../components/layout/Home";
import ProtectedRoute from "../hooks/ProtectedRoutes";
import CategoriesPage from "../pages/Categories";
import SaveCategoryPage from "../pages/Categories/save";
import ClientsPage from "../pages/Clientes";
import HomePage from "../pages/Home";
import LoginPage from "../pages/Login";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="" element={<ProtectedRoute />}>
        <Route path="dashboard" element={<Home />}>
          <Route path="" element={<HomePage />} />
          <Route path="clientes" element={<ClientsPage />} />
          <Route path="categorias">
            <Route path="" element={<CategoriesPage />} />
            <Route path="criar" element={<SaveCategoryPage />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
}
