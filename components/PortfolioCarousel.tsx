'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ProjectType {
    id: number;
    title: string;
    description: string;
    imageUrl: string;
    category: string;
    mediaType?: string;
}

interface PortfolioCarouselProps {
    projects: ProjectType[];
}

export default function PortfolioCarousel({ projects }: PortfolioCarouselProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedCategory, setSelectedCategory] = useState('ALL');
    const [windowWidth, setWindowWidth] = useState(0);

    const categories = ['ALL', '상가', '아파트', '주택', '오피스', '기타'];

    const filteredProjects = selectedCategory === 'ALL'
        ? projects
        : projects.filter(p => p.category === selectedCategory || p.category.includes(selectedCategory));

    useEffect(() => {
        setCurrentIndex(0);
    }, [selectedCategory]);

    useEffect(() => {
        setWindowWidth(window.innerWidth);
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const next = useCallback(() => {
        if (filteredProjects.length === 0) return;
        setCurrentIndex((prev) => (prev + 1) % filteredProjects.length);
    }, [filteredProjects.length]);

    const prev = useCallback(() => {
        if (filteredProjects.length === 0) return;
        setCurrentIndex((prev) => (prev - 1 + filteredProjects.length) % filteredProjects.length);
    }, [filteredProjects.length]);

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowRight') next();
            if (e.key === 'ArrowLeft') prev();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [next, prev]);

    if (projects.length === 0) return null;

    return (
        <div className="w-full py-32 md:py-40 bg-white relative overflow-hidden flex flex-col items-center justify-center min-h-screen">
            {/* Background Atmosphere */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gray-50 via-white to-white opacity-50 pointer-events-none" />

            <div className="relative z-10 w-full max-w-[1920px] mx-auto px-4">
                <div className="text-center mb-20">
                    <motion.span
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="text-[10px] md:text-xs font-bold tracking-[0.6em] text-gray-400 uppercase block mb-6"
                    >
                        Excellence in Design
                    </motion.span>
                    <motion.h2
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                        className="text-5xl md:text-8xl lg:text-9xl font-serif font-black tracking-tighter leading-none mb-12 text-black"
                    >
                        SELECTED WORKS
                    </motion.h2>

                    {/* Category Filter */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="flex flex-wrap justify-center gap-4 md:gap-6 mb-16"
                    >
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`relative px-4 py-2 text-[11px] font-bold tracking-[0.2em] transition-all duration-500 uppercase group ${selectedCategory === cat ? 'text-black' : 'text-gray-300 hover:text-gray-500'}`}
                            >
                                {cat}
                                {/* Underline indicator */}
                                <span className={`absolute bottom-0 left-0 w-full h-[2px] bg-black transform origin-left transition-transform duration-500 ${selectedCategory === cat ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-50'}`} />
                            </button>
                        ))}
                    </motion.div>
                </div>

                {/* 3D Carousel Stage */}
                <div className="relative h-[600px] md:h-[800px] w-full perspective-[2000px] flex items-center justify-center">
                    <div className="relative w-full h-full flex items-center justify-center preserve-3d">
                        {filteredProjects.length > 0 ? (
                            filteredProjects.map((project, index) => {
                                // Calculate offset with circular wraparound
                                let offset = index - currentIndex;
                                const total = filteredProjects.length;

                                // Adjust offset for shortest path
                                if (offset > total / 2) offset -= total;
                                if (offset < -total / 2) offset += total;

                                const isActive = offset === 0;
                                const absOffset = Math.abs(offset);

                                // Only render items that are visible
                                if (absOffset > 3) return null;

                                // Responsive values
                                const isMobile = windowWidth < 768;
                                const spacing = isMobile ? 40 : 150; // Tighter spacing for mobile
                                const xOffset = offset * (isMobile ? 320 : 650); // Distance between cards
                                const zOffset = -absOffset * (isMobile ? 200 : 400); // Depth push
                                const rotateY = offset * (isMobile ? 20 : 15); // Slight rotation
                                const scale = 1 - absOffset * 0.15; // Size reduction for side items
                                const opacity = isActive ? 1 : Math.max(0, 1 - absOffset * 0.4); // Fade out side items

                                return (
                                    <motion.div
                                        key={project.id}
                                        initial={false}
                                        animate={{
                                            x: xOffset,
                                            z: zOffset,
                                            rotateY: rotateY,
                                            scale: scale,
                                            opacity: opacity,
                                        }}
                                        transition={{
                                            type: "spring",
                                            stiffness: 150,
                                            damping: 30, // Heavier damping for premium feel
                                            mass: 1.2
                                        }}
                                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85vw] md:w-[60vw] max-w-[1000px] aspect-[16/10] cursor-pointer"
                                        style={{
                                            transformStyle: 'preserve-3d',
                                            zIndex: 100 - absOffset
                                        }}
                                        onClick={() => {
                                            if (!isActive) setCurrentIndex(index);
                                        }}
                                    >
                                        {/* Card Container with Shadow */}
                                        <div className="relative w-full h-full rounded-[2px] overflow-hidden shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)] bg-black">

                                            {/* Media */}
                                            {project.mediaType === 'VIDEO' || project.imageUrl.endsWith('.mp4') ? (
                                                <video
                                                    src={project.imageUrl}
                                                    autoPlay
                                                    loop
                                                    muted
                                                    playsInline
                                                    className="w-full h-full object-cover opacity-90"
                                                />
                                            ) : (
                                                <img
                                                    src={project.imageUrl}
                                                    alt={project.title}
                                                    className="w-full h-full object-cover opacity-90"
                                                />
                                            )}

                                            {/* Overlay - Only visible on active card */}
                                            <div
                                                className={`absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-8 md:p-16 transition-opacity duration-700 ${isActive ? 'opacity-100' : 'opacity-0'}`}
                                            >
                                                <div className="transform transition-transform duration-700 delay-100 translate-y-0">
                                                    <span className="text-[10px] md:text-xs font-bold tracking-[0.4em] text-white/60 uppercase mb-4 block">
                                                        {project.category}
                                                    </span>
                                                    <h3 className="text-3xl md:text-6xl lg:text-7xl font-serif font-medium text-white mb-6 tracking-tight leading-none">
                                                        {project.title}
                                                    </h3>
                                                    <p className="text-white/60 text-xs md:text-sm font-light max-w-xl leading-relaxed tracking-wide hidden md:block">
                                                        {project.description}
                                                    </p>

                                                    {/* View Project Button */}
                                                    <div className="mt-8 flex items-center gap-4 text-white/80 text-[10px] tracking-[0.2em] uppercase font-bold group-hover:text-white transition-colors cursor-pointer">
                                                        <span>View Project</span>
                                                        <div className="w-12 h-[1px] bg-white/50" />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Dark overlay for inactive cards */}
                                            {!isActive && (
                                                <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px] transition-all duration-500 hover:bg-black/40" />
                                            )}
                                        </div>

                                        {/* Reflection Effect */}
                                        <div className="absolute top-full left-0 right-0 h-full opacity-20 pointer-events-none transform scale-y-[-1] mask-image-linear-to-b"
                                            style={{
                                                maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1), rgba(0,0,0,0))',
                                                WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1), rgba(0,0,0,0))'
                                            }}
                                        >
                                            {project.mediaType === 'VIDEO' || project.imageUrl.endsWith('.mp4') ? (
                                                <video
                                                    src={project.imageUrl}
                                                    muted
                                                    className="w-full h-full object-cover blur-sm"
                                                />
                                            ) : (
                                                <img
                                                    src={project.imageUrl}
                                                    alt={project.title}
                                                    className="w-full h-full object-cover blur-sm"
                                                />
                                            )}
                                        </div>
                                    </motion.div>
                                );
                            })
                        ) : (
                            <div className="text-center text-gray-300 font-serif italic text-2xl">
                                이 카테고리에는 아직 프로젝트가 없습니다.
                            </div>
                        )}
                    </div>

                    {/* Navigation Controls */}
                    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-12 z-50">
                        <button
                            onClick={prev}
                            className="group p-4 hover:scale-110 transition-transform duration-300"
                        >
                            <ChevronLeft size={32} className="text-black/20 group-hover:text-black transition-colors" />
                        </button>

                        {/* Pagination Drops */}
                        <div className="flex items-center gap-3">
                            {filteredProjects.map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setCurrentIndex(idx)}
                                    className={`h-1.5 rounded-full transition-all duration-500 ${idx === currentIndex ? 'w-12 bg-black' : 'w-1.5 bg-black/10 hover:bg-black/30'}`}
                                />
                            ))}
                        </div>

                        <button
                            onClick={next}
                            className="group p-4 hover:scale-110 transition-transform duration-300"
                        >
                            <ChevronRight size={32} className="text-black/20 group-hover:text-black transition-colors" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
