import { Link } from "react-router";
import {
  BookOpen,
  Mail,
  Phone,
  MapPin,
  FileText,
  HelpCircle,
  Building2,
  Library,
  Briefcase,
  FileCheck,
  ExternalLink,
  ChevronRight,
  Globe,
  Share2,
} from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-card border-t border-border mt-16">
      {/* Main Footer Content */}
      <div className="container-full mx-auto px-4 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 rounded-lg bg-primary/10">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-foreground">
                  SLU Repository
                </h3>
                <p className="text-xs text-muted-foreground">
                  Sule Lamido University
                </p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Preserving and disseminating academic excellence from Sule Lamido
              University, Kafin Hausa, Jigawa State, Nigeria.
            </p>
            {/* Social Links */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href="#"
                className="p-2 rounded-full bg-muted hover:bg-primary/10 hover:text-primary transition-colors"
                aria-label="Social Media"
              >
                <Share2 className="h-4 w-4" />
              </a>
              <a
                href="https://slu.edu.ng"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-muted hover:bg-primary/10 hover:text-primary transition-colors"
                aria-label="University Website"
              >
                <Globe className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Quick Links
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group"
                >
                  <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  Browse Collections
                </Link>
              </li>
              <li>
                <Link
                  to="/submit"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group"
                >
                  <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  Submit Research
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group"
                >
                  <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  About Repository
                </Link>
              </li>
              <li>
                <Link
                  to="/help"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group"
                >
                  <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  Help & Guidelines
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <Library className="h-5 w-5 text-primary" />
              Resources
            </h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="https://slu.edu.ng"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group"
                >
                  <Building2 className="h-4 w-4" />
                  University Website
                  <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              </li>
              <li>
                <a
                  href="https://library.slu.edu.ng"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group"
                >
                  <Library className="h-4 w-4" />
                  Library Services
                  <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              </li>
              <li>
                <a
                  href="https://research.slu.edu.ng"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group"
                >
                  <Briefcase className="h-4 w-4" />
                  Research Office
                  <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              </li>
              <li>
                <a
                  href="https://nuc.edu.ng"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group"
                >
                  <FileCheck className="h-4 w-4" />
                  NUC Guidelines
                  <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Us */}
          <div>
            <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-primary" />
              Contact Us
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-sm text-muted-foreground">
                <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span className="leading-relaxed">
                  Sule Lamido University, Kafin Hausa, Jigawa State, Nigeria
                </span>
              </li>
              <li>
                <a
                  href="mailto:library@slu.edu.ng"
                  className="flex items-center gap-3 text-sm text-muted-foreground hover:text-primary transition-colors group"
                >
                  <Mail className="h-5 w-5 text-primary shrink-0" />
                  <span className="group-hover:underline">
                    library@slu.edu.ng
                  </span>
                </a>
              </li>
              <li>
                <a
                  href="tel:+234123456789"
                  className="flex items-center gap-3 text-sm text-muted-foreground hover:text-primary transition-colors group"
                >
                  <Phone className="h-5 w-5 text-primary shrink-0" />
                  <span className="group-hover:underline">
                    +234 123 456 789
                  </span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-border bg-muted/30">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground text-center md:text-left">
              © {currentYear} Sule Lamido University Repository. All rights
              reserved.
            </p>
            <div className="flex items-center gap-6">
              <Link
                to="/privacy"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                to="/terms"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Terms of Use
              </Link>
              <Link
                to="/accessibility"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Accessibility
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
