import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";

import "./app.css";

import { AuthProvider } from "./contexts/AuthContext";
import { EquipmentProvider } from "./contexts/EquipmentContext";
import { DarkModeProvider } from "./contexts/DarkmodeContext";
import { RentalProvider } from './contexts/RentalContext';
import { MaintenanceProvider } from './contexts/MaintenanceContext';
import { NotificationProvider } from "./contexts/NotificationContext";
export function Layout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <NotificationProvider>
      <DarkModeProvider>
        <AuthProvider>
          <EquipmentProvider>
            <RentalProvider>
              <MaintenanceProvider>
                <Outlet />
              </MaintenanceProvider>
            </RentalProvider>    
          </EquipmentProvider>
        </AuthProvider>
      </DarkModeProvider>
    </NotificationProvider>
  );
}

export function ErrorBoundary({ error }) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? " page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}