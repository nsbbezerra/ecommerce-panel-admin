import AppRoutes from "./routes";
import { QueryClient, QueryClientProvider } from "react-query";
import GlobalContext from "./context";
import PrimeReact from "primereact/api";

const queryClient = new QueryClient();

function App() {
  PrimeReact.ripple = true;

  return (
    <GlobalContext>
      <QueryClientProvider client={queryClient}>
        <AppRoutes />
      </QueryClientProvider>
    </GlobalContext>
  );
}

export default App;
