import { BrowserRouter, Routes } from "react-router-dom";
import { Provider } from "react-redux";
import { generateRoutes, routes } from "./router";
import AuthInitializer from "./pages/Users/_components/AuthInitializer";
import store from "./pages/store";

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <AuthInitializer>
          <Routes>
            {generateRoutes(routes)}
          </Routes>
        </AuthInitializer>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
