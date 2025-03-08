import { BrowserRouter } from "react-router-dom";
import RouterComponent from "./routes/Router";
import ErrorBoundary from "./routes/ErrorBoundary";
import { Provider } from "react-redux";
import store from "./store/store";
import { ToastContainer } from "react-toastify";

const App = () => {
  console.error = () => {};
  console.warn = () => {};

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

console.error = () => {};
console.warn = () => {};

export default App;
