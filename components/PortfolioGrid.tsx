import { getProjects } from '@/lib/actions';
import PortfolioCarousel from './PortfolioCarousel';

export default async function PortfolioGrid() {
    const dbProjects = await getProjects();

    const projects = dbProjects.length > 0 ? dbProjects : [
        {
            id: 1,
            title: 'Modern Living Room',
            description: 'Ultra-modern luxury living room with glassmorphism elements.',
            imageUrl: '/images/living_room_luxury_1768900871583.png',
            category: 'Living Room'
        },
        {
            id: 2,
            title: 'Minimalist Kitchen',
            description: 'Matte black cabinets with focused lighting.',
            imageUrl: '/images/kitchen_detail_modern_1768900969359.png',
            category: 'Kitchen'
        },
        {
            id: 3,
            title: 'Cozy Bedroom',
            description: 'High-end bedroom with neutral tones.',
            imageUrl: '/images/bed_room_cozy_1768901076100.png',
            category: 'Bedroom'
        }
    ];

    return (
        <section id="portfolio" className="bg-white overflow-hidden">
            <PortfolioCarousel projects={projects as any} />
        </section>
    );
}
