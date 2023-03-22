import AppRoutes from "./routes";
import { QueryClient, QueryClientProvider } from "react-query";
import GlobalContext from "./context";

const queryClient = new QueryClient();

function App() {
  return (
    <GlobalContext>
      <QueryClientProvider client={queryClient}>
        <AppRoutes />
      </QueryClientProvider>
    </GlobalContext>
  );
}

export default App;
