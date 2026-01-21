"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import Link from "next/link";

export default function Navigation() {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const isScrolled = window.scrollY > 20;
            setScrolled(isScrolled);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const toggleMenu = () => setIsOpen(!isOpen);

    const navLinks = [
        { href: "#portfolio", label: "Projects" },
        { href: "#character", label: "Character" },
        { href: "#", label: "About" },
        { href: "#contact", label: "Consultation" },
    ];

    return (
        <>
            <nav className={`fixed top-0 w-full p-6 md:p-8 flex justify-between items-center z-50 transition-all duration-300 ${scrolled || isOpen ? "bg-black/80 backdrop-blur-md border-b border-white/5 py-4" : "bg-transparent py-6 md:py-8"
                }`}>
                <div className="text-white text-3xl font-serif font-black tracking-tighter relative z-50">
                    <Link href="/">ABLE K</Link>
                </div>

                {/* Desktop Menu */}
                <div className="hidden md:flex gap-10 text-[10px] font-black uppercase tracking-[0.4em] text-white/50">
                    {navLinks.map((link) => (
                        <a
                            key={link.label}
                            href={link.href}
                            className="hover:text-white transition-all transform hover:translate-y-[-1px]"
                        >
                            {link.label}
                        </a>
                    ))}
                </div>

                {/* Mobile Hamburger */}
                <button
                    onClick={toggleMenu}
                    className="md:hidden text-white z-50 p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </nav>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="fixed inset-0 z-40 bg-black/95 backdrop-blur-xl flex flex-col justify-center items-center md:hidden"
                    >
                        <div className="flex flex-col gap-8 text-center">
                            {navLinks.map((link, index) => (
                                <motion.a
                                    key={link.label}
                                    href={link.href}
                                    onClick={() => setIsOpen(false)}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 + index * 0.1 }}
                                    className="text-2xl font-serif font-bold text-white/80 hover:text-white transition-colors tracking-widest uppercase"
                                >
                                    {link.label}
                                </motion.a>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
