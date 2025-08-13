"use client";

import { ReactNode } from "react";
import { Provider } from "react-redux";
import { store } from "@/store/store";
import SessionProviderWrapper from "./SessionProviderWrapper";
import { Toaster } from "sonner";

interface Props {
  children: ReactNode;
}

export default function ClientWrapper({ children }: Props) {
  return (
    <SessionProviderWrapper>
      <Provider store={store}>
        {children}
      </Provider>
      <Toaster />
    </SessionProviderWrapper>
  );
}
