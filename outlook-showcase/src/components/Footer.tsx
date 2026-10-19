export function Footer() {
  return (
    <footer className="py-10 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-8 border-t border-zinc-200/50 bg-[#FBFBFD] safe-area-inset">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-10 lg:gap-12 mb-8 sm:mb-10 lg:mb-12">
          {/* Brand */}
          <div className="col-span-2">
            <div className="flex items-center gap-2 font-semibold text-base sm:text-lg text-zinc-900 mb-3 sm:mb-4">
              <svg className="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="M22 7L12 13L2 7" />
              </svg>
              <span>Outlook Packages</span>
            </div>
            <p className="text-zinc-500 text-sm sm:text-base max-w-sm leading-relaxed">
              Professional TypeScript packages for parsing and displaying Microsoft Outlook email files.
            </p>
          </div>

          {/* Packages */}
          <div>
            <h4 className="font-semibold text-zinc-900 text-sm sm:text-base mb-3 sm:mb-4">Packages</h4>
            <ul className="space-y-2 text-zinc-500 text-sm">
              <li>
                <a href="https://www.npmjs.com/package/outlook-email-parser" className="hover:text-zinc-900 active:text-zinc-700 transition-colors">
                  outlook-email-parser
                </a>
              </li>
              <li>
                <a href="https://www.npmjs.com/package/outlook-reader-ui" className="hover:text-zinc-900 active:text-zinc-700 transition-colors">
                  outlook-reader-ui
                </a>
              </li>
              <li>
                <a href="https://www.npmjs.com/package/outlook-mcp-server" className="hover:text-zinc-900 active:text-zinc-700 transition-colors">
                  outlook-mcp-server
                </a>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold text-zinc-900 text-sm sm:text-base mb-3 sm:mb-4">Resources</h4>
            <ul className="space-y-2 text-zinc-500 text-sm">
              <li>
                <a href="#quickstart" className="hover:text-zinc-900 active:text-zinc-700 transition-colors">
                  Documentation
                </a>
              </li>
              <li>
                <a href="https://github.com" className="hover:text-zinc-900 active:text-zinc-700 transition-colors">
                  GitHub
                </a>
              </li>
              <li>
                <a href="#mcp" className="hover:text-zinc-900 active:text-zinc-700 transition-colors">
                  MCP Server
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 sm:pt-8 border-t border-zinc-200/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs sm:text-sm text-zinc-500 text-center sm:text-left">
            © {new Date().getFullYear()} Outlook Packages. MIT License.
          </p>
          <div className="flex items-center gap-5 sm:gap-6">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-400 hover:text-zinc-600 active:text-zinc-500 transition-colors p-1"
              aria-label="GitHub"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
            </a>
            <a
              href="https://www.npmjs.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-400 hover:text-zinc-600 active:text-zinc-500 transition-colors p-1"
              aria-label="npm"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M0 7.334v8h6.666v1.332H12v-1.332h12v-8H0zm6.666 6.664H5.334v-4H3.999v4H1.335V8.667h5.331v5.331zm4 0v1.336H8.001V8.667h5.334v5.332h-2.669v-.001zm12.001 0h-1.33v-4h-1.336v4h-1.335v-4h-1.33v4h-2.671V8.667h8.002v5.331z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
