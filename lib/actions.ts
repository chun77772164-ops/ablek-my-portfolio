'use server';
import { revalidatePath } from 'next/cache';
import { prisma } from './prisma';

export async function getProjects() {
    try {
        const projects = await prisma.project.findMany({
            orderBy: { createdAt: 'desc' },
        });
        return projects;
    } catch (error) {
        console.error("Failed to fetch projects:", error);
        return [];
    }
}

export async function createProject(formData: FormData) {
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const category = formData.get('category') as string;
    const imageUrl = formData.get('imageUrl') as string;
    const mediaType = (formData.get('mediaType') as string) || 'IMAGE';

    try {
        await prisma.project.create({
            data: {
                title,
                description,
                category,
                imageUrl,
                mediaType,
            },
        });
        revalidatePath('/');
        return { success: true };
    } catch (e) {
        console.error(e);
        return { success: false };
    }
}

export async function deleteProject(id: number) {
    try {
        await prisma.project.delete({ where: { id } });
        revalidatePath('/');
        return { success: true };
    } catch (e) {
        console.error(e);
        return { success: false };
    }
}

export async function createInquiry(formData: FormData) {
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const area = formData.get('area') as string;
    const location = formData.get('location') as string;
    const message = formData.get('message') as string;

    try {
        await prisma.contact.create({
            data: {
                name,
                email,
                phone,
                area,
                location,
                message,
            },
        });
        revalidatePath('/admin');
        return { success: true };
    } catch (e) {
        console.error("Failed to save inquiry:", e);
        return { success: false, error: "데이터를 저장하는 중 오류가 발생했습니다." };
    }
}

export async function getInquiries() {
    try {
        const inquiries = await prisma.contact.findMany({
            orderBy: { createdAt: 'desc' },
        });
        return inquiries;
    } catch (error) {
        console.error("Failed to fetch inquiries:", error);
        return [];
    }
}

export async function deleteInquiry(id: number) {
    try {
        await prisma.contact.delete({ where: { id } });
        revalidatePath('/admin');
        return { success: true };
    } catch (e) {
        console.error(e);
        return { success: false };
    }
}
export async function getSettings() {
    try {
        if (!prisma.setting) {
            console.error("Prisma model 'setting' is not defined. Please run 'npx prisma generate'.");
            return null;
        }
        let settings = await prisma.setting.findUnique({
            where: { id: 'site-settings' }
        });

        if (!settings) {
            settings = await prisma.setting.create({
                data: {
                    id: 'site-settings',
                    adminId: 'admin',
                    adminPassword: '1234'
                }
            });
        }
        return settings;
    } catch (e) {
        console.error("Failed to fetch settings details:", e);
        return null;
    }
}

export async function updateSettings(formData: FormData) {
    const data = {
        title: formData.get('title') as string,
        headline: formData.get('headline') as string,
        subtext: formData.get('subtext') as string,
        address: formData.get('address') as string,
        phone: formData.get('phone') as string,
        email: formData.get('email') as string,
        instagram: formData.get('instagram') as string,
        youtube: formData.get('youtube') as string,
        linkedin: formData.get('linkedin') as string,
        siteUrl: formData.get('siteUrl') as string,

        // Design & Content Control
        mainColor: formData.get('mainColor') as string,

        // Hero
        heroImage: formData.get('heroImage') as string,
        heroHeadline: formData.get('heroHeadline') as string,
        heroHeadlineColor: formData.get('heroHeadlineColor') as string,
        heroHeadlineSize: formData.get('heroHeadlineSize') as string,
        heroSubtext: formData.get('heroSubtext') as string,
        heroSubtextColor: formData.get('heroSubtextColor') as string,
        heroSubtextSize: formData.get('heroSubtextSize') as string,
        heroDescription: formData.get('heroDescription') as string,
        heroDescColor: formData.get('heroDescColor') as string,
        heroDescSize: formData.get('heroDescSize') as string,

        // Contact
        contactImage: formData.get('contactImage') as string,
        contactTitle: formData.get('contactTitle') as string,
        contactTitleColor: formData.get('contactTitleColor') as string,
    };

    try {
        if (!prisma.setting) {
            console.error("Prisma model 'setting' is not defined.");
            return { success: false };
        }
        await prisma.setting.update({
            where: { id: 'site-settings' },
            data
        });
        revalidatePath('/');
        return { success: true };
    } catch (e) {
        console.error("Detailed Update Error:", e);
        return { success: false };
    }
}



export async function resetSettings() {
    try {
        await prisma.setting.update({
            where: { id: 'site-settings' },
            data: {
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
        revalidatePath('/');
        return { success: true };
    } catch (e) {
        console.error("Failed to reset settings:", e);
        return { success: false };
    }
}

export async function getCharacterItems() {
    try {
        const items = await prisma.characterItem.findMany({
            orderBy: { order: 'asc' },
        });
        return items;
    } catch (error) {
        console.error("Failed to fetch character items:", error);
        return [];
    }
}

export async function upsertCharacterItem(data: { id?: number; title: string; description: string; imageUrl: string; order: number }) {
    try {
        if (data.id) {
            await prisma.characterItem.update({
                where: { id: data.id },
                data: {
                    title: data.title,
                    description: data.description,
                    imageUrl: data.imageUrl,
                    order: data.order,
                }
            });
        } else {
            await prisma.characterItem.create({
                data: {
                    title: data.title,
                    description: data.description,
                    imageUrl: data.imageUrl,
                    order: data.order,
                }
            });
        }
        revalidatePath('/');
        return { success: true };
    } catch (e) {
        console.error("Failed to upsert character item:", e);
        return { success: false };
    }
}



export async function updateAdminCredentials(formData: FormData) {
    const adminId = formData.get('adminId') as string;
    const adminPassword = formData.get('adminPassword') as string;

    if (!adminId || !adminPassword) {
        return { success: false, error: "아이디와 비밀번호를 모두 입력해주세요." };
    }

    try {
        await prisma.setting.update({
            where: { id: 'site-settings' },
            data: {
                adminId,
                adminPassword
            }
        });
        revalidatePath('/');
        return { success: true };
    } catch (e) {
        console.error("Failed to update credentials:", e);
        return { success: false, error: "설정 업데이트 실패" };
    }
}

export async function initializeDefaultCharacters() {
    try {
        const count = await prisma.characterItem.count();
        if (count > 0) return { success: false, message: "이미 데이터가 존재합니다." };

        const defaults = [
            {
                title: "Total Solution",
                description: "프로젝트의 시작부터 끝까지, 에이블 케이만의 차별화된 원스톱 솔루션을 제공합니다. 전문적인 컨설팅을 통해 당신의 비전을 현실로 구현합니다. 010.4547.3841",
                imageUrl: "/images/living_room_luxury_1768900871583.png",
                order: 1
            },
            {
                title: "Master Craftsmanship",
                description: "디테일이 완성도를 결정합니다. 엄격한 현장 관리와 타협하지 않는 시공 품질로 완벽한 마감을 약속드립니다.",
                imageUrl: "/images/kitchen_detail_modern_1768900969359.png",
                order: 2
            },
            {
                title: "Color Aesthetics",
                description: "공간에 감성을 불어넣는 전문적인 컬러 큐레이션. 당신의 라이프스타일과 취향을 깊이 있게 해석하여 가장 조화로운 색채를 제안합니다.",
                imageUrl: "/images/bed_room_cozy_1768901076100.png",
                order: 3
            },
            {
                title: "Spatial Curation",
                description: "단순한 인테리어를 넘어선 공간 예술. 구조적 미학과 기능성을 동시에 고려한 독창적인 연출로 시간이 흘러도 변치 않는 가치를 선사합니다.",
                imageUrl: "/images/living_room_luxury_1768900871583.png",
                order: 4
            }
        ];

        for (const item of defaults) {
            await prisma.characterItem.create({ data: item });
        }
        revalidatePath('/');
        return { success: true };
    } catch (error) {
        console.error("Failed to seed characters:", error);
        return { success: false };
    }
}
