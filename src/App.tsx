import AppRoutes from "./routes";
import { QueryClient, QueryClientProvider } from "react-query";
import GlobalContext from "./context";
import { Fragment } from "react";
import GlobalAuthenticateContext from "./context/authenticate";

const queryClient = new QueryClient();

function App() {
  return (
    <Fragment>
      <GlobalAuthenticateContext>
        <GlobalContext>
          <QueryClientProvider client={queryClient}>
            <AppRoutes />
          </QueryClientProvider>
        </GlobalContext>
      </GlobalAuthenticateContext>
    </Fragment>
  );
}

export default App;
