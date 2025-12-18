"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function Navbar() {
  const pathname = usePathname();
  const isReaderPage = pathname?.includes("/read/");

  if (isReaderPage) return null;

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md text-sm font-medium transition-all animate-fade-in-down shadow-sm">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-2xl font-black text-primary tracking-tighter hover:opacity-80 transition-opacity">
            KOMIK KITO
          </Link>
          <div className="hidden md:flex items-center gap-6 text-gray-600">
            <Link href="/" className="hover:text-primary transition-colors font-bold tracking-wide">
              HOME
            </Link>
            <Link href="/list" className="hover:text-primary transition-colors font-bold tracking-wide">
              GENRES
            </Link>
            <Link href="/bookmark" className="hover:text-primary transition-colors font-bold tracking-wide">
              LIBRARY
            </Link>
          </div>
        </div>
        <div className="flex items-center gap-3">
           {/* Search Icon */}
          <Link href="/search" className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100/80 cursor-pointer transition-colors text-gray-600 hover:text-primary">
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
          </Link>
          <div className="h-6 w-px bg-gray-200 hidden md:block"></div>
          {/* Mobile Menu Button  */}
          <div className="md:hidden flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 cursor-pointer transition-colors text-gray-600">
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </div>
        </div>
      </div>
    </nav>
  );
}
