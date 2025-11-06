import "./globals.css";
import { SWRProvider } from '@/components/provider/swr-provider';

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className="light">
            <body suppressHydrationWarning>
              <SWRProvider> {children}</SWRProvider>
            </body>
        </html>
    );
}
