import { Playfair_Display, Jost, Poppins } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import { CartProvider } from './lib/CartContext';
import { AuthProvider } from './lib/AuthContext';
import CartDrawer from './Components/CartDrawer';
import WhatsAppWidget from './Components/WhatsAppWidget';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  weight: ['400', '500', '600', '700', '800', '900'],
  style: ['normal', 'italic'],
});

const jost = Jost({
  subsets: ['latin'],
  variable: '--font-jost',
  weight: ['300', '400', '500', '600', '700'],
});

const poppins = Poppins({
  subsets: ['latin'],
  variable: '--font-poppins',
  weight: ['400', '500', '600', '700'],
});

export const metadata = {
  title: 'Luxéor — Fine Jewellery',
  description: 'Exquisite fine jewellery, made with rare stones and exceptional craftsmanship.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${playfair.variable} ${jost.variable} ${poppins.variable}`}>
      <body className="bg-[#f5efe8] text-[#2a1a0e] antialiased">
        <AuthProvider>
          <CartProvider>
            {children}
            <WhatsAppWidget />

            <CartDrawer />
          </CartProvider>
        </AuthProvider>
        <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}