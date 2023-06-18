import "@/styles/globals.css";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div data-theme="dracula">
      <Component {...pageProps} />
    </div>
  );
}