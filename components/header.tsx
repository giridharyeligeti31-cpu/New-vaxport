"use client";

import { motion } from "framer-motion";
import { Syringe, LogOut, Globe } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const languages = [
  { code: "en", name: "English (US)", flag: "🇺🇸" },
  { code: "es", name: "Spanish", flag: "🇪🇸" },
  { code: "zh", name: "Chinese (Mandarin)", flag: "🇨🇳" },
  { code: "fr", name: "French", flag: "🇫🇷" },
  { code: "tl", name: "Tagalog", flag: "🇵🇭" },
  { code: "vi", name: "Vietnamese", flag: "🇻🇳" },
  { code: "ar", name: "Arabic", flag: "🇸🇦" },
  { code: "ko", name: "Korean", flag: "🇰🇷" },
  { code: "ru", name: "Russian", flag: "🇷🇺" },
];

interface HeaderProps {
  selectedLanguage: string;
  onLanguageChange: (code: string) => void;
}

export function Header({ selectedLanguage, onLanguageChange }: HeaderProps) {
  const { logout, user } = useAuth();

  const currentLanguage = languages.find((l) => l.code === selectedLanguage);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-50 bg-card border-b border-border shadow-sm"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
              <Syringe className="w-5 h-5 text-primary-foreground" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-card-foreground">
                VaxPort
              </h1>
              <p className="text-xs text-muted-foreground">
                Vaccination Management
              </p>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            {/* User Info - Hidden on mobile */}
            <div className="hidden md:block text-right">
              <p className="text-sm font-medium text-card-foreground">
                {user?.name}
              </p>
              <p className="text-xs text-muted-foreground">
                Healthcare Provider
              </p>
            </div>

            {/* Language Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2 border-primary/20 hover:bg-primary/5">
                  <Globe className="w-4 h-4 text-primary" />
                  <span className="hidden sm:flex items-center gap-2">
                    <span className="text-base leading-none">{currentLanguage?.flag}</span>
                    <span className="font-medium">{currentLanguage?.name}</span>
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 max-h-[300px] overflow-y-auto border-primary/20">
                {languages.map((lang) => (
                  <DropdownMenuItem
                    key={lang.code}
                    onClick={() => onLanguageChange(lang.code)}
                    className={`gap-3 cursor-pointer ${
                      selectedLanguage === lang.code ? "bg-primary/10 text-primary font-medium" : ""
                    }`}
                  >
                    <span className="text-lg leading-none">{lang.flag}</span>
                    <span>{lang.name}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Logout Button */}
            <Button variant="outline" size="sm" onClick={logout} className="gap-2">
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
