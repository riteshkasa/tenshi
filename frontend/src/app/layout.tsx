import './globals.css';
import 'leaflet/dist/leaflet.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Add non-CSS imports here if needed */}
      </head>
      <body className="font-sans">
        {children}
      </body>
    </html>
  );
}
