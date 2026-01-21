'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Phone, User, Send, CheckCircle, MapPin, Instagram, Youtube, Linkedin } from 'lucide-react';
import { createInquiry } from '@/lib/actions';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

export default function ContactForm({ settings }: { settings?: any }) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const sectionRef = useRef<HTMLElement>(null);
    const formRef = useRef<HTMLDivElement>(null);
    const infoRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!sectionRef.current) return;

        const ctx = gsap.context(() => {
            gsap.from(infoRef.current, {
                x: -50,
                opacity: 0,
                duration: 1.2,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 80%",
                }
            });

            gsap.from(formRef.current, {
                x: 50,
                opacity: 0,
                duration: 1.2,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 80%",
                }
            });
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        const formData = new FormData(e.currentTarget);
        const result = await createInquiry(formData);

        if (result.success) {
            setSubmitted(true);
        } else {
            setError(result.error || "제출에 실패했습니다.");
        }
        setIsSubmitting(false);
    }

    return (
        <section
            id="contact"
            ref={sectionRef}
            className="py-32 px-6 relative overflow-hidden bg-black"
        >
            {settings?.contactImage && (
                <div
                    className="absolute inset-0 z-0 opacity-50"
                    style={{
                        backgroundImage: `url(${settings.contactImage})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                    }}
                />
            )}

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-center">

                    {/* Left: Heading (4 columns) */}
                    <div ref={infoRef} className="lg:col-span-5 space-y-8">
                        <div className="space-y-4">
                            <motion.span
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                className="text-xs font-bold tracking-[0.4em] text-white/40 uppercase"
                            >
                                Contact Inquiry
                            </motion.span>
                            <h2
                                className="text-5xl md:text-6xl font-serif font-light text-white leading-tight"
                                style={{ color: settings?.contactTitleColor }}
                            >
                                <span className="italic">{settings?.contactTitle?.split(' ')[0] || 'Collaborate'}</span> <br />
                                {settings?.contactTitle?.split(' ').slice(1).join(' ') || 'with ABLE K'}
                            </h2>
                            <p className="text-lg text-gray-500 max-w-sm leading-relaxed">
                                당신의 비전을 현실로 만드는 첫 걸음입니다. <br />
                                프로젝트에 대한 당신의 생각을 자유롭게 공유해 주세요.
                            </p>
                        </div>
                    </div>

                    {/* Right: Premium Form (7 columns) */}
                    <div ref={formRef} className="lg:col-span-7 relative">
                        <AnimatePresence mode="wait">
                            {submitted ? (
                                <motion.div
                                    key="success"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    className="glass-dark p-12 text-center rounded-[3rem] border border-white/10"
                                >
                                    <div className="w-20 h-20 bg-white/5 border border-white/10 rounded-full flex items-center justify-center mx-auto mb-8">
                                        <CheckCircle className="w-10 h-10 text-white" />
                                    </div>
                                    <h3 className="text-3xl font-serif font-light text-white mb-4">Request Successful</h3>
                                    <p className="text-gray-400 mb-8 leading-relaxed">
                                        문의가 정상적으로 접수되었습니다. <br />
                                        전문가가 확인 후 곧 연락드리겠습니다.
                                    </p>
                                    <button
                                        onClick={() => setSubmitted(false)}
                                        className="px-10 py-3 glass hover:bg-white text-white hover:text-black font-medium rounded-full transition-all duration-500"
                                    >
                                        Back to Form
                                    </button>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="form"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="glass-dark p-8 md:p-12 rounded-[3.5rem] border border-white/5 backdrop-blur-3xl shadow-2xl relative"
                                    style={{ backdropFilter: 'blur(20px)', backgroundColor: 'rgba(0,0,0,0.6)' }}
                                >
                                    <form onSubmit={handleSubmit} className="space-y-10">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                            <div className="group relative">
                                                <input
                                                    required
                                                    name="name"
                                                    type="text"
                                                    placeholder=" "
                                                    className="peer w-full bg-transparent border-b border-white/10 py-3 text-white focus:border-white focus:outline-none transition-colors duration-500"
                                                />
                                                <label className="absolute left-0 top-3 text-gray-600 transition-all duration-500 pointer-events-none peer-focus:-top-4 peer-focus:text-[10px] peer-focus:text-white/40 peer-[:not(:placeholder-shown)]:-top-4 peer-[:not(:placeholder-shown)]:text-[10px]">
                                                    Project Name / Organization
                                                </label>
                                            </div>

                                            <div className="group relative">
                                                <input
                                                    required
                                                    name="email"
                                                    type="email"
                                                    placeholder=" "
                                                    className="peer w-full bg-transparent border-b border-white/10 py-3 text-white focus:border-white focus:outline-none transition-colors duration-500"
                                                />
                                                <label className="absolute left-0 top-3 text-gray-600 transition-all duration-500 pointer-events-none peer-focus:-top-4 peer-focus:text-[10px] peer-focus:text-white/40 peer-[:not(:placeholder-shown)]:-top-4 peer-[:not(:placeholder-shown)]:text-[10px]">
                                                    Official Email
                                                </label>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                            <div className="group relative">
                                                <input
                                                    required
                                                    name="location"
                                                    type="text"
                                                    placeholder=" "
                                                    className="peer w-full bg-transparent border-b border-white/10 py-3 text-white focus:border-white focus:outline-none transition-colors duration-500"
                                                />
                                                <label className="absolute left-0 top-3 text-gray-600 transition-all duration-500 pointer-events-none peer-focus:-top-4 peer-focus:text-[10px] peer-focus:text-white/40 peer-[:not(:placeholder-shown)]:-top-4 peer-[:not(:placeholder-shown)]:text-[10px]">
                                                    Project Location (City/Region)
                                                </label>
                                            </div>

                                            <div className="group relative">
                                                <div className="flex flex-wrap gap-2 py-3">
                                                    {['10평 이하', '20평대', '30평대', '40평대', '50평 이상'].map((item) => (
                                                        <label key={item} className="cursor-pointer">
                                                            <input type="radio" name="area" value={item} className="hidden peer" defaultChecked={item === '20평대'} />
                                                            <span className="inline-block px-4 py-2 rounded-xl border border-white/5 bg-white/5 text-[10px] text-gray-400 peer-checked:bg-white peer-checked:text-black peer-checked:border-white transition-all duration-500 hover:bg-white/10 whitespace-nowrap">
                                                                {item}
                                                            </span>
                                                        </label>
                                                    ))}
                                                </div>
                                                <label className="absolute left-0 -top-4 text-[10px] font-bold text-white/40 uppercase tracking-widest bg-transparent">
                                                    Space Area (평수)
                                                </label>
                                            </div>
                                        </div>

                                        <div className="group relative">
                                            <textarea
                                                required
                                                name="message"
                                                rows={4}
                                                placeholder=" "
                                                className="peer w-full bg-transparent border-b border-white/10 py-3 text-white focus:border-white focus:outline-none transition-colors duration-500 resize-none"
                                            ></textarea>
                                            <label className="absolute left-0 top-3 text-gray-600 transition-all duration-500 pointer-events-none peer-focus:-top-4 peer-focus:text-[10px] peer-focus:text-white/40 peer-[:not(:placeholder-shown)]:-top-4 peer-[:not(:placeholder-shown)]:text-[10px]">
                                                Describe your vision and space
                                            </label>
                                        </div>

                                        {error && (
                                            <p className="text-red-400 text-sm">{error}</p>
                                        )}

                                        <button
                                            disabled={isSubmitting}
                                            type="submit"
                                            className="w-full bg-white text-black font-bold py-5 rounded-2xl hover:scale-[1.01] active:scale-[0.99] transition-all duration-500 flex items-center justify-center gap-3 disabled:opacity-50 overflow-hidden relative group"
                                            style={{ backgroundColor: settings?.mainColor }}
                                        >
                                            <span className="relative z-10 text-base">{isSubmitting ? "Submitting..." : "Send Request"}</span>
                                            {!isSubmitting && <Send className="w-4 h-4 relative z-10 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />}
                                        </button>
                                    </form>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                </div>
            </div>
        </section>
    );
}


function ContactItem({ icon, title, content }: { icon: React.ReactNode, title: string, content: string }) {
    return (
        <div className="flex gap-6 items-start group">
            <div className="w-12 h-12 glass border border-white/10 rounded-2xl flex items-center justify-center text-white/50 group-hover:text-white group-hover:border-white/30 transition-all duration-500">
                {icon}
            </div>
            <div className="space-y-1">
                <p className="text-xs font-bold text-white/20 tracking-widest uppercase">{title}</p>
                <p className="text-lg text-white group-hover:text-white/80 transition-all duration-500">{content}</p>
            </div>
        </div>
    );
}

function SocialIcon({ icon, href }: { icon: React.ReactNode, href: string }) {
    return (
        <a
            href={href}
            className="w-10 h-10 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 rounded-full border border-white/5 transition-all duration-500 hover:scale-110"
        >
            {icon}
        </a>
    );
}
