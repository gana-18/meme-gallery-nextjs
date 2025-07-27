import { Inter } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";
import MemeCard from "./components/MemeCard";
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Meme Gallery",
  description: "Explore memes from reddit at one go",
  keywords:'Memes, meme gallery, doge, reddit, reddit memes, reddit top memes, top memes, reddit meme gallery, meme gallery, meme collection, meme feed, meme browser',
};
export const revalidate = 3600 // revalidate at most every hour

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Header />
        {children}
        <MemeCard />
        </body>
    </html>
  );
}
