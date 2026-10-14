import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import FloatingSocials from './FloatingSocials';
import InstallPrompt from './InstallPrompt';

export default function Layout({ children, isHome = false, fullWidth = false }) {
  return (
    <div className="min-h-screen w-full max-w-full flex flex-col bg-[#ffffff] text-[#0f172a] font-sans selection:bg-emerald-600 selection:text-white">
      <Navbar />

      {/* Global layout grid wrapper. On very narrow screens this stays full-bleed
          so fixed toolbar chrome does not trap the page inside a too-narrow column. */}
      <main className={fullWidth ? 'flex-grow w-full overflow-x-hidden' : 'flex-grow w-full max-w-7xl overflow-x-hidden mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-10 lg:py-12'}>
        {children}
      </main>

      <Footer />
      <InstallPrompt />

      {/* Sticky Socials dock only renders on the Home screen */}
      {isHome && <FloatingSocials />}
    </div>
  );
}

