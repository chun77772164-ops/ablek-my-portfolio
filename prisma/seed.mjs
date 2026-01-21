import pkg from '@prisma/client';
const { PrismaClient } = pkg;

const prisma = new PrismaClient();

async function main() {
    try {
        // Clear existing data
        await prisma.project.deleteMany();

        await prisma.project.createMany({
            data: [
                {
                    title: '모던 럭셔리 리빙룸',
                    description: '글래스모피즘 가구와 대리석 바닥이 어우러진 현대적인 거실 디자인.',
                    imageUrl: '/images/living_room_luxury_1768900871583.png',
                    category: 'Living Room'
                },
                {
                    title: '미니멀리즘 키친',
                    description: '매트 블랙 마감과 조명 연출이 돋보이는 주방 디테일.',
                    imageUrl: '/images/kitchen_detail_modern_1768900969359.png',
                    category: 'Kitchen'
                },
                {
                    title: '프리미엄 침실',
                    description: '따뜻한 톤과 부드러운 텍스처로 완성된 아늑한 침실 공간.',
                    imageUrl: '/images/bed_room_cozy_1768901076100.png',
                    category: 'Bedroom'
                }
            ]
        });
        console.log('Seeding finished.');
    } catch (e) {
        console.error(e);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

main();
