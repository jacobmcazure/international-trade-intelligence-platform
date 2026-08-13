'use client';

import Link from 'next/link';

const authorName = 'Jacob McEwen';
const emailAddress = 'jacob@aethru.dev';

export default function Footer() {
  const copyEmail = async () => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(emailAddress);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = emailAddress;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
    } catch (error) {
      console.error('Failed to copy email address:', error);
    }
  };

  return (
    <footer className="relative z-10 mt-auto border-t border-slate-800/80 bg-slate-950/90 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-8 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm text-slate-400">
            © {new Date().getFullYear()} {authorName}. All rights reserved.
          </p>
          <p className="mt-1 text-sm text-slate-500">Global trade insights and policy intelligence.</p>
        </div>

        <nav aria-label="Footer navigation" className="flex flex-wrap items-center gap-3 text-sm text-slate-300">
          <Link href="/about" className="transition hover:text-white">
            About
          </Link>

          <button
            type="button"
            onClick={copyEmail}
            aria-label="Copy email address to clipboard"
            className="text-sm text-slate-300 transition hover:text-white"
          >
            Contact
          </button>

          <a
            href="https://www.aethru.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-slate-300 transition hover:text-white"
          >
            Website
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <a
            href="https://github.com/jacobmcazure"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="text-sm text-slate-300 transition hover:text-white"
          >
            GitHub
          </a>

          <a
            href="https://www.linkedin.com/in/jacobmcewen/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="text-sm text-slate-300 transition hover:text-white"
          >
            LinkedIn
          </a>
        </div>
      </div>
    </footer>
  );
}
