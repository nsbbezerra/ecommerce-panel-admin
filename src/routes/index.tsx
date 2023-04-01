import { Route, Routes } from "react-router-dom";
import Home from "../components/layout/Home";
import ProtectedRoute from "../hooks/ProtectedRoutes";
import CategoriesPage from "../pages/Categories";
import SaveCategoryPage from "../pages/Categories/save";
import ClientsPage from "../pages/Clientes";
import SaveClient from "../pages/Clientes/save";
import HomePage from "../pages/Home";
import LoginPage from "../pages/Login";
import SubCategories from "../pages/SubCategories";
import SaveSubCategory from "../pages/SubCategories/save";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="" element={<ProtectedRoute />}>
        <Route path="dashboard" element={<Home />}>
          <Route path="" element={<HomePage />} />
          <Route path="clientes">
            <Route index element={<ClientsPage />} />
            <Route path="criar" element={<SaveClient />} />
          </Route>
          <Route path="categorias">
            <Route path="" element={<CategoriesPage />} />
            <Route path="criar" element={<SaveCategoryPage />} />
          </Route>
          <Route path="sub-categorias">
            <Route index element={<SubCategories />} />
            <Route path="criar" element={<SaveSubCategory />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
}
