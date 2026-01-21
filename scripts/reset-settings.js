
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        console.log('Resetting settings to English defaults...');
        await prisma.setting.upsert({
            where: { id: 'site-settings' },
            update: {
                heroHeadline: "Space is not a fixed box, but a physical embodiment that expands with life.",
                heroHeadlineColor: "#E5E4E2",
                heroHeadlineSize: "60",
                heroSubtext: "We build spatial interfaces that respond flexibly to your growth.",
                heroSubtextColor: "#9CA3AF",
                heroSubtextSize: "18",
                heroDescription: "Trends fade, but well-designed architecture endures.\nBeyond simple design, we build an artistic foundation that synchronizes with your life.",
                heroDescColor: "#6B7280",
                heroDescSize: "14",
                contactTitle: "Collaborate with ABLE K",
                contactTitleColor: "#FFFFFF"
            },
            create: {
                id: 'site-settings',
                heroHeadline: "Space is not a fixed box, but a physical embodiment that expands with life.",
                heroHeadlineColor: "#E5E4E2",
                heroHeadlineSize: "60",
                heroSubtext: "We build spatial interfaces that respond flexibly to your growth.",
                heroSubtextColor: "#9CA3AF",
                heroSubtextSize: "18",
                heroDescription: "Trends fade, but well-designed architecture endures.\nBeyond simple design, we build an artistic foundation that synchronizes with your life.",
                heroDescColor: "#6B7280",
                heroDescSize: "14",
                contactTitle: "Collaborate with ABLE K",
                contactTitleColor: "#FFFFFF"
            }
        });
        console.log('Settings reset successfully.');
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
