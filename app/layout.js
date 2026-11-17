import "./globals.css";
import ActiveTripHUD from "@/components/ActiveTripHUD";
import { TripProvider } from "@/context/TripContext";
export const metadata = { title: "TallyGo", description: "Track, split, and settle group trip expenses" };
export default function RootLayout({ children }) {
  return (<html lang="en"><body className="min-h-screen"><TripProvider><ActiveTripHUD>{children}</ActiveTripHUD></TripProvider></body></html>);
}