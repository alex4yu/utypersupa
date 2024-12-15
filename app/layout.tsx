import { SettingsProvider } from "@/utils/settingsContext";
import Navbar from "@/components/Navbar";
import "@styles/global.css"
export const metadata = {
  title: "Utyper",
  description: "The typing practice platform built around you",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <SettingsProvider>
          <div className="content">
            <Navbar/>
            {children}
          </div>
        </SettingsProvider>
      </body>
    </html>
  );
}
