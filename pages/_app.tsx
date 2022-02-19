import "../scss/index.scss";
import type { AppProps } from "next/app";
import { store } from "../app/store";
import { Provider } from "react-redux";
import { transitions, positions, Provider as AlertProvider } from "react-alert";
import AlertTemplate from "react-alert-template-basic";

const options = {
  position: positions.BOTTOM_CENTER,
  timeout: 5000,
  offset: "30px",
  transition: transitions.SCALE,
};

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AlertProvider template={AlertTemplate} {...options}>
      <Provider store={store}>
        <Component {...pageProps} />
      </Provider>
    </AlertProvider>
  );
}

export default MyApp;
