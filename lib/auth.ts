'use server';

import { cookies } from 'next/headers';

import { prisma } from './prisma';

const COOKIE_NAME = 'admin_session';

export async function login(formData: FormData) {
    const id = formData.get('id') as string;
    const password = formData.get('password') as string;

    // 1. Check Database Settings First
    const settings = await prisma.setting.findUnique({
        where: { id: 'site-settings' }
    });

    const dbId = settings?.adminId;
    const dbPw = settings?.adminPassword;

    // 2. Check Environment Variables (Fallback)
    const envId = process.env.ADMIN_ID || 'admin';
    const envPw = process.env.ADMIN_PASSWORD || '1234';

    // Priority: DB > Env
    const finalId = dbId || envId;
    const finalPw = dbPw || envPw;

    if (id === finalId && password === finalPw) {
        // Set cookie manually since we can't use next-auth for simple setup
        // cookie expires in 24 hours
        const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
        (await cookies()).set(COOKIE_NAME, 'true', { expires, httpOnly: true, secure: process.env.NODE_ENV === 'production' });
        return { success: true };
    }

    return { success: false, error: '아이디 또는 비밀번호가 올바르지 않습니다.' };
}

export async function logout() {
    (await cookies()).delete(COOKIE_NAME);
    return { success: true };
}

export async function checkAuth() {
    const cookieStore = await cookies();
    const hasCookie = cookieStore.has(COOKIE_NAME);
    return hasCookie;
}
