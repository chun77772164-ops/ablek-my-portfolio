import React from 'react';
import Image from 'next/image';
import { getCharacterItems } from '@/lib/actions';

const defaultCharacters = [
    {
        title: "Total Solution",
        description: "프로젝트의 시작부터 끝까지, 에이블 케이만의 차별화된 원스톱 솔루션을 제공합니다. 전문적인 컨설팅을 통해 당신의 비전을 현실로 구현합니다.",
        image: "/images/living_room_luxury_1768900871583.png",
    },
    {
        title: "Master Craftsmanship",
        description: "디테일이 완성도를 결정합니다. 엄격한 현장 관리와 타협하지 않는 시공 품질로 완벽한 마감을 약속드립니다.",
        image: "/images/kitchen_detail_modern_1768900969359.png",
    },
    {
        title: "Color Aesthetics",
        description: "공간에 감성을 불어넣는 전문적인 컬러 큐레이션. 당신의 라이프스타일과 취향을 깊이 있게 해석하여 가장 조화로운 색채를 제안합니다.",
        image: "/images/bed_room_cozy_1768901076100.png",
    },
    {
        title: "Spatial Curation",
        description: "단순한 인테리어를 넘어선 공간 예술. 구조적 미학과 기능성을 동시에 고려한 독창적인 연출로 시간이 흘러도 변치 않는 가치를 선사합니다.",
        image: "/images/living_room_luxury_1768900871583.png",
    }
];

export default async function CharacterSection() {
    let characters = await getCharacterItems();

    if (!characters || characters.length === 0) {
        characters = defaultCharacters as any[];
    }

    return (
        <section id="character" className="py-24 px-6 bg-[#f0f0f0]">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-20 animate-fade-in">
                    <h2 className="text-5xl md:text-7xl font-serif font-black tracking-tighter text-black mb-4">
                        OUR CHARACTER
                    </h2>
                    <p className="text-sm md:text-base font-medium text-gray-500 tracking-[0.2em] uppercase">
                        왜 에이블 케이 인지 아세요?
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-20">
                    {characters.map((char: any, index: number) => (
                        <div key={index} className={`flex flex-col ${index % 2 === 1 ? 'md:flex-col-reverse' : ''} gap-8 group`}>
                            <div className="relative aspect-[16/9] overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-700 ease-in-out bg-gray-200">
                                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-700 z-10" />
                                <Image
                                    src={char.image || char.imageUrl}
                                    alt={char.title}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center gap-4">
                                    <h3 className="text-2xl font-serif font-bold text-black">{char.title}</h3>
                                    <div className="h-[1px] flex-grow bg-black/10 transition-all duration-700 group-hover:bg-black group-hover:w-full" />
                                </div>
                                <p className="text-gray-500 text-sm leading-relaxed font-medium transition-colors duration-500 group-hover:text-black">
                                    {char.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
