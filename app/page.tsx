import Hero from '@/components/Hero';
import CharacterSection from '@/components/CharacterSection';
import PortfolioGrid from '@/components/PortfolioGrid';
import ContactForm from '@/components/ContactForm';
import { getSettings } from '@/lib/actions';

export default async function Home() {
    const settings = await getSettings();

    return (
        <main className="min-h-screen">
            <Hero settings={settings} />
            <CharacterSection />
            <PortfolioGrid />
            <ContactForm settings={settings} />

            {/* Footer */}
            <footer className="bg-black text-white pt-24 pb-12 px-6 border-t border-white/5">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-24">
                        {/* Column 1: Brand */}
                        <div className="space-y-6">
                            <h3 className="text-luxury-platinum text-4xl font-serif font-black tracking-tighter">
                                {settings?.title || 'ABLE K'}
                            </h3>
                            <p className="text-gray-500 text-[11px] leading-relaxed max-w-xs uppercase tracking-widest font-bold">
                                High-End Interior Solution <br />
                                {settings?.headline || '공간은 삶을 기록하는 물리적 구현체입니다.'}
                            </p>
                        </div>

                        {/* Column 2: Office */}
                        <div className="space-y-6">
                            <h4 className="text-xs font-bold text-white/30 tracking-[0.3em] uppercase">Headquarter</h4>
                            <p className="text-gray-400 text-sm leading-loose">
                                {settings?.address || '서울특별시 강남구 테헤란로 123 ABLE 빌딩 15층'}
                            </p>
                        </div>

                        {/* Column 3: Contact */}
                        <div className="space-y-6">
                            <h4 className="text-xs font-bold text-white/30 tracking-[0.3em] uppercase">Contact</h4>
                            <div className="text-gray-400 text-sm space-y-2">
                                <p className="hover:text-white transition-colors">T. {settings?.phone || '+82 02-123-4567'}</p>
                                <p className="hover:text-white transition-colors">M. {settings?.email || 'hello@ablek.com'}</p>
                            </div>
                        </div>

                        {/* Column 4: Links */}
                        <div className="space-y-6">
                            <h4 className="text-xs font-bold text-white/30 tracking-[0.3em] uppercase">Digital</h4>
                            <div className="flex gap-6 text-gray-500">
                                <a href={settings?.instagram || '#'} className="hover:text-white transition-all transform hover:scale-110">Instagram</a>
                                <a href={settings?.youtube || '#'} className="hover:text-white transition-all transform hover:scale-110">Youtube</a>
                                <a href={settings?.linkedin || '#'} className="hover:text-white transition-all transform hover:scale-110">LinkedIn</a>
                            </div>
                        </div>
                    </div>

                    <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-medium text-white/20 tracking-widest uppercase">
                        <p>© 2026 {settings?.title || 'ABLE K'} STUDIO. ALL RIGHTS RESERVED.</p>
                        <div className="flex gap-8">
                            <a href="#" className="hover:text-white transition-colors">Terms of Use</a>
                            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                        </div>
                    </div>
                </div>
            </footer>
        </main>
    );
}
