import AppRoutes from "./routes";
import { QueryClient, QueryClientProvider } from "react-query";
import GlobalContext from "./context";
import { Fragment } from "react";

const queryClient = new QueryClient();

function App() {
  return (
    <Fragment>
      <GlobalContext>
        <QueryClientProvider client={queryClient}>
          <AppRoutes />
        </QueryClientProvider>
      </GlobalContext>
    </Fragment>
  );
}

export default App;
