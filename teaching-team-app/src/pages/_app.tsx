import "@/styles/globals.css";
import Header from '@/components/Header';
import type { AppProps } from "next/app";
import { ChakraProvider } from '@chakra-ui/react'
import { AuthProvider } from "@/components/Auth";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <ChakraProvider>
      <Header />
        <Component {...pageProps} />
      </ChakraProvider>
    </AuthProvider>
);
}
