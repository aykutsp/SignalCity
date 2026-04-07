import { LocationProvider } from "@/context/LocationContext";
import "./globals.css";

export const metadata = {
  title: "Pulse — Live City Intelligence",
  description: "A lightweight live intelligence layer for cities and everyday conditions. Real-time weather, seismic activity, currency shifts, and urban stress monitoring.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <LocationProvider>
          {children}
        </LocationProvider>
      </body>
    </html>
  );
}
