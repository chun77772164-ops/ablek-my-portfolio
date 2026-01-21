import { MetadataRoute } from 'next';
import { getSettings } from '@/lib/actions';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const settings = await getSettings();
    const baseUrl = (settings as any)?.siteUrl || 'https://your-domain.com';

    return [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        },
    ];
}
