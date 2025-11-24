import { Linkedin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bottom-0 w-full bg-background z-50 py-8 border-t-2 border-border">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center gap-4 md:flex-row md:justify-center md:relative">
          {/* Copyright Text */}
          <div className="text-sm text-foreground text-center">
            © {new Date().getFullYear()} Mind Mentor. All rights reserved.
          </div>

          {/* Social Icons - Absolute right on desktop, stacked on mobile */}
          <div className="flex items-center gap-4 md:absolute md:right-0">
            <a
              href="https://www.linkedin.com/in/abhinay-m-v"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground hover:text-[#0077B5] transition-colors duration-200"
              aria-label="Connect on LinkedIn"
            >
              <Linkedin className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
