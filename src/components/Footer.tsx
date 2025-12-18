export function Footer() {
  return (
    <footer className="w-full bg-gray-100 py-12 text-sm text-gray-500 mt-auto">
      <div className="mx-auto max-w-5xl px-4 flex flex-col md:flex-row justify-between gap-8">
        <div>
            <h3 className="text-xl font-black text-primary mb-4 tracking-tighter">KOMIK KITO</h3>
            <p className="max-w-xs leading-relaxed">
                Read your favorite webtoons, manga, and manhwa anytime, anywhere. 
                Free and high quality for everyone.
            </p>
        </div>
        <div className="flex gap-12">
            <div className="flex flex-col gap-3">
                <h4 className="font-bold text-gray-900">Discover</h4>
                <a href="/list?tipe=manhwa" className="hover:text-primary transition-colors">Manhwa</a>
                <a href="/list?tipe=manga" className="hover:text-primary transition-colors">Manga</a>
                <a href="/list?tipe=manhua" className="hover:text-primary transition-colors">Manhua</a>
            </div>
            <div className="flex flex-col gap-3">
                <h4 className="font-bold text-gray-900">Support</h4>
                <a href="#" className="hover:text-primary transition-colors">Discord</a>
                <a href="#" className="hover:text-primary transition-colors">Contact</a>
            </div>
        </div>
      </div>
      <div className="mx-auto max-w-5xl px-4 mt-12 pt-8 text-center md:text-left text-xs opacity-60">
        &copy; {new Date().getFullYear()} Komik Kito. All rights reserved.
      </div>
    </footer>
  );
}
