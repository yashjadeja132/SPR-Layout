import { BrowserRouter } from "react-router-dom";
import RouterComponent from "./routes/Router";
import ErrorBoundary from "./routes/ErrorBoundary";
import { Provider } from "react-redux";
import store from "./store/store";

const App = () => {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Provider store={store}>
          <RouterComponent />
        </Provider>
      </BrowserRouter>
    </ErrorBoundary>
  );
};

export default App;
