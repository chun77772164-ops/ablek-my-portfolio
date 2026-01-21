'use client';

import { motion } from 'framer-motion';

interface ProjectProps {
    project: {
        id: number;
        title: string;
        description: string;
        imageUrl: string;
        category: string;
        mediaType?: string;
    };
}

export default function ProjectCard({ project }: ProjectProps) {
    const isVideo = project.mediaType === 'VIDEO' || project.imageUrl.endsWith('.mp4');

    return (
        <motion.div
            whileHover={{ y: -10 }}
            transition={{ duration: 0.5 }}
            className="group relative overflow-hidden rounded-2xl bg-white shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100"
        >
            <div className="aspect-[4/5] overflow-hidden bg-gray-100">
                {isVideo ? (
                    <video
                        src={project.imageUrl}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                ) : (
                    <img
                        src={project.imageUrl}
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                )}
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-8 text-white">
                <span className="text-white/60 text-[10px] font-black tracking-[0.3em] uppercase mb-3">
                    {project.category}
                </span>
                <h3 className="text-3xl font-serif font-bold mb-3 tracking-tight">
                    {project.title}
                </h3>
                <p className="text-white/70 text-sm line-clamp-2 leading-relaxed font-light">
                    {project.description}
                </p>
            </div>
        </motion.div>
    );
}
