import { Navigate, Route, Routes } from "react-router-dom";
import Home from "../components/layout/Home";
import ProtectedRoute from "../hooks/ProtectedRoutes";
import CategoriesPage from "../pages/Categories";
import SaveCategoryPage from "../pages/Categories/save";
import ClientsPage from "../pages/Clientes";
import SaveClient from "../pages/Clientes/save";
import HomePage from "../pages/Home";
import LoginPage from "../pages/Login";
import ProductsPage from "../pages/Products";
import SaveProduct from "../pages/Products/save";
import SubCategories from "../pages/SubCategories";
import SaveSubCategory from "../pages/SubCategories/save";
import PdvPage from "../pages/Pdv";
import Checkout from "../pages/Checkout";
import Configurations from "../pages/Configurations";
import SalesFinished from "../pages/Pdv/finish";
import SalesSaved from "../pages/Pdv/saved";
import FinishCheckout from "../pages/Checkout/finish";
import Cashier from "../pages/Cashier";
import OpenCashier from "../pages/Cashier/open";
import CashierMoviment from "../pages/Cashier/moviment";
import SavedOrderPage from "../pages/Pdv/savedOrder";
import FinancialMovements from "../pages/Financial/movements";
import SaveFinancial from "../pages/Financial/saveFinancial";
import PaymentsManager from "../pages/Financial/payments";
import Supplier from "../pages/Supplier";
import SaveSupplier from "../pages/Supplier/save";
import CashierReport from "../pages/Cashier/report";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="*" element={<Navigate to={"/dashboard"} />} />
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
            <Route path="editar/:category" element={<SaveCategoryPage />} />
          </Route>
          <Route path="marcas">
            <Route index element={<Supplier />} />
            <Route path="criar" element={<SaveSupplier />} />
            <Route path="editar/:supplier" element={<SaveSupplier />} />
          </Route>
          <Route path="sub-categorias">
            <Route index element={<SubCategories />} />
            <Route path="criar" element={<SaveSubCategory />} />
            <Route path="editar/:collection" element={<SaveSubCategory />} />
          </Route>
          <Route path="produtos">
            <Route index element={<ProductsPage />} />
            <Route path="criar" element={<SaveProduct />} />
            <Route path="editar/:product" element={<SaveProduct />} />
          </Route>
          <Route path="caixa">
            <Route index element={<Cashier />} />
            <Route path="novo" element={<OpenCashier />} />
            <Route path=":cashier" element={<CashierMoviment />} />
            <Route path="resumo/:cashier" element={<CashierReport />} />
          </Route>
          <Route path="vendas">
            <Route index element={<PdvPage />} />
            <Route path=":order" element={<SavedOrderPage />} />
            <Route path="checkout" element={<Checkout />}>
              <Route path=":order" element={<Checkout />} />
            </Route>
            <Route path="pagamento" element={<FinishCheckout />}>
              <Route path=":status" element={<FinishCheckout />} />
            </Route>
            <Route path="finalizadas" element={<SalesFinished />} />
            <Route path="salvas" element={<SalesSaved />} />
          </Route>
          <Route path="configuracoes" element={<Configurations />} />
          <Route path="financeiro">
            <Route path="movimentos">
              <Route index element={<FinancialMovements />} />
              <Route path="criar" element={<SaveFinancial />} />
              <Route path="editar/:moviment" element={<SaveFinancial />} />
            </Route>
            <Route path="pagamentos" element={<PaymentsManager />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
}
