'use client';

import Spline from '@splinetool/react-spline';
import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export default function Hero({ settings }: { settings: any }) {
    const containerRef = useRef(null);

    useGSAP(() => {
        const tl = gsap.timeline({ defaults: { ease: 'power4.out', duration: 1.5 } });

        tl.fromTo('.hero-mask',
            { clipPath: 'inset(0 100% 0 0)', x: -100, opacity: 0 },
            { clipPath: 'inset(0 0% 0 0)', x: 0, opacity: 1, stagger: 0.15, delay: 0.5 }
        );

        tl.from('.hero-sub', {
            x: 50,
            opacity: 0,
            duration: 1,
            ease: 'back.out(1.7)'
        }, "-=0.8");
    }, { scope: containerRef });

    return (
        <section className="relative w-full h-screen overflow-hidden bg-[#f4f4f4]" ref={containerRef}>
            {/* 3D Scene / Background */}
            <div className="absolute inset-0 z-0">
                {settings?.heroImage ? (
                    <img src={settings.heroImage} alt="Hero Background" className="w-full h-full object-cover" />
                ) : (
                    <Spline scene="https://prod.spline.design/6Wq1Q7YGyM-iab9i/scene.splinecode" />
                )}
            </div>

            {/* Overlay Text */}
            <div className="absolute top-1/2 left-[8%] md:left-[12%] -translate-y-1/2 z-10 pointer-events-none max-w-4xl">
                <h1 className="mb-14 leading-none">
                    <span
                        className="hero-mask block text-luxury-platinum text-3d-soft font-serif tracking-tight filter drop-shadow-2xl mb-8"
                        style={{
                            fontSize: (settings?.heroHeadlineSize || 60) + 'px'
                        }}
                    >
                        {settings?.heroHeadline || 'Habitational Vessel'}
                    </span>
                    <span
                        className="hero-sub block font-sans font-bold uppercase tracking-tight text-gray-400/90 mb-4 ml-1"
                        style={{
                            color: settings?.heroSubtextColor || '#9CA3AF',
                            fontSize: (settings?.heroSubtextSize || 18) + 'px'
                        }}
                    >
                        {settings?.heroSubtext || 'We build spatial interfaces that respond flexibly to your growth.'}
                    </span>
                </h1>

                <div className="hero-mask overflow-hidden">
                    <p
                        className="text-gray-500 max-w-2xl mb-12 leading-relaxed font-medium tracking-tight whitespace-pre-wrap"
                        style={{
                            color: settings?.heroDescColor || '#6B7280',
                            fontSize: (settings?.heroDescSize || 14) + 'px'
                        }}
                    >
                        {settings?.heroDescription || 'Trends fade, but well-designed architecture endures.\nBeyond simple design, we build an artistic foundation that synchronizes with your life.'}
                    </p>
                </div>

                <div className="hero-mask pointer-events-auto">
                    <a
                        href="#portfolio"
                        className="inline-block px-10 py-5 bg-black text-white text-[10px] uppercase font-black tracking-widest rounded-full hover:bg-gray-800 transition-all hover:scale-105 hover:shadow-2xl"
                        style={{ backgroundColor: settings?.mainColor }}
                    >
                        Explore Project
                    </a>
                </div>
            </div>
        </section>
    );
}
