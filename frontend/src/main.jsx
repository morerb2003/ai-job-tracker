import React from "react";
import ReactDOM from "react-dom/client";
<<<<<<< HEAD
import { QueryClient } from "@tanstack/react-query";
import { QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "./context/ThemeContext";
=======
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./context/AuthContext";
>>>>>>> feature/authentication
import AppRoutes from "./routes/AppRoutes";
import "./index.css";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
<<<<<<< HEAD
      <ThemeProvider>
        <AppRoutes />
      </ThemeProvider>
=======
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
>>>>>>> feature/authentication
    </QueryClientProvider>
  </React.StrictMode>
);
