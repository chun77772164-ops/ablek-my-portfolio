'use client';

import { getProjects, createProject, deleteProject, getSettings, updateSettings, getInquiries, deleteInquiry, resetSettings } from '@/lib/actions';
import { login, logout, checkAuth } from '@/lib/auth';
import { useEffect, useState } from 'react';
import CharacterManager from '@/components/admin/CharacterManager';

export default function AdminPage() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoadingAuth, setIsLoadingAuth] = useState(true);
    const [projects, setProjects] = useState<any[]>([]);
    const [inquiries, setInquiries] = useState<any[]>([]);
    const [settings, setSettings] = useState<any>(null);
    const [uploading, setUploading] = useState(false);
    const [imageUrl, setImageUrl] = useState('');

    useEffect(() => {
        checkSession();
    }, []);

    const checkSession = async () => {
        const isAuth = await checkAuth();
        setIsAuthenticated(isAuth);
        if (isAuth) {
            refreshData();
        }
        setIsLoadingAuth(false);
    };

    const handleLogin = async (formData: FormData) => {
        const res = await login(formData);
        if (res.success) {
            setIsAuthenticated(true);
            refreshData();
        } else {
            alert(res.error);
        }
    };

    const handleLogout = async () => {
        await logout();
        setIsAuthenticated(false);
    };

    const refreshData = async () => {
        const [p, s, i] = await Promise.all([
            getProjects(),
            getSettings(),
            getInquiries()
        ]);
        setProjects(p as any[]);
        setSettings(s);
        setInquiries(i as any[]);
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });
            const data = await res.json();
            if (data.url) {
                setImageUrl(data.url);
                alert('파일 업로드 완료!');
            }
        } catch (err) {
            console.error(err);
            alert('업로드 실패');
        } finally {
            setUploading(false);
        }
    };

    const onSubmitProject = async (formData: FormData) => {
        if (imageUrl) formData.set('imageUrl', imageUrl);
        const res = await createProject(formData);
        if (res.success) {
            alert('프로젝트가 등록되었습니다.');
            setImageUrl('');
            refreshData();
        } else {
            alert('등록에 실패했습니다.');
        }
    };

    const onDeleteProject = async (id: number) => {
        if (confirm('정말 삭제하시겠습니까?')) {
            const res = await deleteProject(id);
            if (res.success) {
                refreshData();
            } else {
                alert('삭제에 실패했습니다.');
            }
        }
    };

    const onDeleteInquiry = async (id: number) => {
        if (confirm('이 문의를 삭제하시겠습니까?')) {
            const res = await deleteInquiry(id);
            if (res.success) {
                refreshData();
            } else {
                alert('삭제에 실패했습니다.');
            }
        }
    };

    const onUpdateSettings = async (formData: FormData) => {
        const res = await updateSettings(formData);
        if (res.success) {
            alert('설정이 저장되었습니다.');
            refreshData();
        } else {
            alert('설정 저장에 실패했습니다. 서버 로그를 확인하세요.');
        }
    };

    if (isLoadingAuth) {
        return <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-400 font-bold tracking-widest uppercase">Loading Admin Access...</div>;
    }

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
                <div className="w-full max-w-md bg-white p-12 rounded-[40px] shadow-2xl shadow-gray-200 border border-gray-100">
                    <div className="text-center mb-10">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] mb-4 block">Security Check</span>
                        <h1 className="text-3xl font-serif font-black text-gray-900">관리자 접속</h1>
                    </div>
                    <form action={handleLogin} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">Access ID</label>
                            <input name="id" type="text" required className="w-full p-4 bg-gray-50 border-2 border-transparent focus:border-black/10 rounded-2xl outline-none font-bold transition-all" placeholder="Enter Admin ID" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">Password</label>
                            <input name="password" type="password" required className="w-full p-4 bg-gray-50 border-2 border-transparent focus:border-black/10 rounded-2xl outline-none font-bold transition-all" placeholder="••••••••" />
                        </div>
                        <button type="submit" className="w-full py-5 bg-black text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-gray-800 transition-all shadow-xl shadow-black/10 mt-4">
                            Connect to Dashboard
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    if (isLoadingAuth) {
        return <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-400 font-bold tracking-widest uppercase">Loading Admin Access...</div>;
    }

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
                <div className="w-full max-w-md bg-white p-12 rounded-[40px] shadow-2xl shadow-gray-200 border border-gray-100">
                    <div className="text-center mb-10">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] mb-4 block">Security Check</span>
                        <h1 className="text-3xl font-serif font-black text-gray-900">관리자 접속</h1>
                    </div>
                    <form action={handleLogin} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">Access ID</label>
                            <input name="id" type="text" required className="w-full p-4 bg-gray-50 border-2 border-transparent focus:border-black/10 rounded-2xl outline-none font-bold transition-all" placeholder="Enter Admin ID" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">Password</label>
                            <input name="password" type="password" required className="w-full p-4 bg-gray-50 border-2 border-transparent focus:border-black/10 rounded-2xl outline-none font-bold transition-all" placeholder="••••••••" />
                        </div>
                        <button type="submit" className="w-full py-5 bg-black text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-gray-800 transition-all shadow-xl shadow-black/10 mt-4">
                            Connect to Dashboard
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-24 pb-12 px-6 bg-gray-50">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-end mb-12 border-b pb-6">
                    <div>
                        <h1 className="text-5xl font-serif font-black text-gray-900 tracking-tighter">에이블 케이 관리자</h1>
                        <p className="text-gray-400 mt-2 font-medium">ABLE K Portfolio & Inquiry Management</p>
                    </div>
                    <button onClick={handleLogout} className="px-6 py-3 bg-white border border-gray-200 hover:border-black hover:bg-black hover:text-white rounded-full text-xs font-bold uppercase tracking-widest transition-all">
                        Logout
                    </button>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-4 gap-12">
                    {/* Main Management Area */}
                    <div className="xl:col-span-3 space-y-12">

                        {/* Character Manager Section */}
                        <CharacterManager />

                        {/* Registration Section */}
                        <div className="bg-white p-10 rounded-[40px] shadow-2xl shadow-gray-200/50 border border-gray-100">
                            <h2 className="text-2xl font-black mb-10 flex items-center gap-4">
                                <span className="w-2.5 h-10 bg-black rounded-full" />
                                프로젝트 및 미디어 등록
                            </h2>
                            <form action={onSubmitProject} className="space-y-10">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">프로젝트 제목</label>
                                        <input name="title" required className="w-full p-5 bg-gray-50 border-2 border-transparent focus:border-black/5 rounded-3xl transition-all outline-none text-lg font-bold" placeholder="프로젝트 이름 입력" />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">공간 유형 (카테고리)</label>
                                        <select name="category" required className="w-full p-5 bg-gray-50 border-2 border-transparent focus:border-black/5 rounded-3xl transition-all outline-none font-bold">
                                            <option value="상가">상가 (Commercial)</option>
                                            <option value="아파트">아파트 (Apartment)</option>
                                            <option value="주택">주택 (Residential)</option>
                                            <option value="오피스">오피스 (Office)</option>
                                            <option value="기타">기타 (Others)</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">미디어 타입</label>
                                        <select name="mediaType" className="w-full p-5 bg-gray-50 border-2 border-transparent focus:border-black/5 rounded-3xl transition-all outline-none font-bold">
                                            <option value="IMAGE">이미지 (사진)</option>
                                            <option value="VIDEO">동영상 (MP4)</option>
                                        </select>
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">파일 업로드</label>
                                        <div className="relative group">
                                            <input
                                                type="file"
                                                onChange={handleFileUpload}
                                                accept="image/*,video/*"
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                            />
                                            <div className="w-full p-5 bg-black text-white rounded-3xl text-center font-black group-hover:bg-gray-800 transition-all shadow-xl shadow-black/10">
                                                {uploading ? '업로딩...' : '정품 미디어 파일 선택'}
                                            </div>
                                        </div>
                                        {imageUrl && (
                                            <p className="text-[10px] text-blue-600 font-black mt-2 bg-blue-50 p-2 rounded-lg inline-block">✓ 파일이 캐시되었습니다: {imageUrl}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">이미지/영상 URL 또는 로컬 경로</label>
                                    <input
                                        name="imageUrl"
                                        value={imageUrl}
                                        onChange={(e) => setImageUrl(e.target.value)}
                                        className="w-full p-5 bg-gray-50 border-2 border-transparent focus:border-black/5 rounded-3xl transition-all outline-none font-medium"
                                        placeholder="http://... 또는 업로드된 경로"
                                    />
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">프로젝트 설명 (Description)</label>
                                    <textarea name="description" required rows={4} className="w-full p-5 bg-gray-50 border-2 border-transparent focus:border-black/5 rounded-3xl transition-all outline-none resize-none font-medium leading-relaxed" placeholder="공간에 대한 철학과 설명을 입력하세요." />
                                </div>

                                <button type="submit" className="w-full py-6 bg-black text-white rounded-[30px] font-black text-xl hover:bg-gray-900 transition-all shadow-2xl shadow-black/20 transform hover:-translate-y-1">
                                    새로운 프로젝트 발행하기
                                </button>
                            </form>
                        </div>

                        {/* Inquiry Section */}
                        <div className="bg-white p-10 rounded-[40px] shadow-2xl shadow-gray-200/50 border border-gray-100">
                            <h2 className="text-2xl font-black mb-8 flex items-center justify-between">
                                <span className="flex items-center gap-4">
                                    <span className="w-2.5 h-10 bg-luxury-gold bg-amber-500 rounded-full" />
                                    고객 문의 내역 ({inquiries.length})
                                </span>
                            </h2>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="border-b border-gray-100">
                                            <th className="py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest pl-4">이름</th>
                                            <th className="py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">연락처/이메일</th>
                                            <th className="py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">내용</th>
                                            <th className="py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right pr-4">관리</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {inquiries.length === 0 ? (
                                            <tr>
                                                <td colSpan={4} className="py-20 text-center text-gray-300 font-serif italic text-xl">접수된 문의가 없습니다.</td>
                                            </tr>
                                        ) : inquiries.map((iq: any) => (
                                            <tr key={iq.id} className="hover:bg-gray-50 transition-colors group">
                                                <td className="py-6 pl-4 font-black text-gray-900 uppercase">{iq.name}</td>
                                                <td className="py-6">
                                                    <div className="text-sm font-bold text-gray-700">{iq.phone}</div>
                                                    <div className="text-xs text-gray-400">{iq.email}</div>
                                                    <div className="mt-1 flex flex-wrap gap-1">
                                                        {iq.location && <span className="px-2 py-0.5 bg-gray-100 text-[9px] font-bold text-gray-500 rounded-md">📍 {iq.location}</span>}
                                                        {iq.area && <span className="px-2 py-0.5 bg-amber-50 text-[9px] font-bold text-amber-600 rounded-md ring-1 ring-amber-100 italic">{iq.area}</span>}
                                                    </div>
                                                </td>
                                                <td className="py-6">
                                                    <p className="text-sm text-gray-500 line-clamp-2 max-w-md leading-relaxed">{iq.message}</p>
                                                    <span className="text-[10px] text-gray-300 font-medium">{new Date(iq.createdAt).toLocaleString()}</span>
                                                </td>
                                                <td className="py-6 text-right pr-4">
                                                    <button onClick={() => onDeleteInquiry(iq.id)} className="p-3 text-gray-300 hover:text-red-500 transition-colors bg-white rounded-xl shadow-sm border border-gray-50 opacity-0 group-hover:opacity-100">
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar: Projects & Settings */}
                    <div className="space-y-12">
                        {/* Settings */}
                        <div className="bg-white p-8 rounded-[40px] shadow-2xl shadow-gray-200/50 border border-gray-100">
                            <h2 className="text-xl font-black mb-8 text-gray-900">환경 설정</h2>

                            {/* Security Settings */}
                            <div className="mb-8 p-6 bg-red-50 rounded-3xl border border-red-100">
                                <h3 className="text-xs font-black text-red-500 uppercase tracking-widest mb-4">🔐 관리자 보안 설정</h3>
                                <form action={async (formData) => {
                                    if (!confirm('로그인 정보를 변경하시겠습니까? 변경 후 다시 로그인해야 할 수 있습니다.')) return;
                                    const { updateAdminCredentials } = await import('@/lib/actions');
                                    const res = await updateAdminCredentials(formData);
                                    if (res.success) {
                                        alert('관리자 정보가 변경되었습니다.');
                                    } else {
                                        alert('변경 실패: ' + res.error);
                                    }
                                }} className="space-y-4">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">새로운 관리자 ID</label>
                                        <input name="adminId" defaultValue={settings?.adminId || 'admin'} className="w-full p-3 bg-white border-0 rounded-xl text-sm font-bold focus:ring-2 focus:ring-red-500/20 transition-all" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">새로운 비밀번호</label>
                                        <input name="adminPassword" type="text" defaultValue={settings?.adminPassword || '1234'} className="w-full p-3 bg-white border-0 rounded-xl text-sm font-bold focus:ring-2 focus:ring-red-500/20 transition-all" />
                                    </div>
                                    <button type="submit" className="w-full py-3 bg-red-500 text-white rounded-xl text-xs font-black hover:bg-red-600 transition-all shadow-lg shadow-red-500/30">
                                        로그인 정보 변경
                                    </button>
                                </form>
                            </div>

                            <form action={onUpdateSettings} className="space-y-6">
                                <div className="space-y-4">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-gray-300 uppercase tracking-widest">회사 명칭</label>
                                        <input name="title" defaultValue={settings?.title || ''} className="w-full p-4 bg-gray-50 border-0 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-black/5 transition-all" />
                                    </div>
                                    <div className="space-y-1 p-1 bg-amber-50/30 rounded-3xl border border-amber-100/50">
                                        <label className="text-[10px] font-black text-amber-600 uppercase tracking-widest px-4">📍 사무실 주소 (웹사이트 하단 표시)</label>
                                        <input name="address" defaultValue={settings?.address || ''} className="w-full p-4 bg-white border-0 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-amber-500/20 transition-all" placeholder="예: 서울특별시 강남구..." />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-gray-300 uppercase tracking-widest">메인 타이틀</label>
                                        <input name="headline" defaultValue={settings?.headline || ''} className="w-full p-4 bg-gray-50 border-0 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-black/5 transition-all" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-blue-500 uppercase tracking-widest">🌐 도메인 주소 (URL - SEO용)</label>
                                        <input name="siteUrl" defaultValue={settings?.siteUrl || ''} className="w-full p-4 bg-blue-50/50 border-2 border-blue-100/20 rounded-2xl text-sm font-bold focus:border-blue-500/50 transition-all" placeholder="https://your-domain.com" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-gray-300 uppercase tracking-widest">연락처</label>
                                        <input name="phone" defaultValue={settings?.phone || ''} className="w-full p-4 bg-gray-50 border-0 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-black/5 transition-all" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-gray-300 uppercase tracking-widest">이메일</label>
                                        <input name="email" defaultValue={settings?.email || ''} className="w-full p-4 bg-gray-50 border-0 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-black/5 transition-all" />
                                    </div>
                                    <div className="pt-4 space-y-4">
                                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b pb-1">Social Links</h4>
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Instagram URL</label>
                                            <input name="instagram" defaultValue={settings?.instagram || ''} className="w-full p-4 bg-gray-50 border-0 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-black/5 transition-all" placeholder="https://instagram.com/..." />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-black text-gray-300 uppercase tracking-widest">YouTube URL</label>
                                            <input name="youtube" defaultValue={settings?.youtube || ''} className="w-full p-4 bg-gray-50 border-0 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-black/5 transition-all" placeholder="https://youtube.com/..." />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-black text-gray-300 uppercase tracking-widest">LinkedIn URL</label>
                                            <input name="linkedin" defaultValue={settings?.linkedin || ''} className="w-full p-4 bg-gray-50 border-0 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-black/5 transition-all" placeholder="https://linkedin.com/..." />
                                        </div>
                                    </div>
                                </div>
                                <button type="submit" className="w-full py-5 bg-gray-100 text-black rounded-2xl text-xs font-black hover:bg-black hover:text-white transition-all">
                                    환경 설정 업데이트
                                </button>
                            </form>
                        </div>

                        {/* Design & Content Settings */}
                        <div className="bg-white p-8 rounded-[40px] shadow-2xl shadow-gray-200/50 border border-gray-100">
                            <h2 className="text-xl font-black mb-8 text-gray-900 flex items-center gap-2">
                                🎨 디자인 & 콘텐츠 커스텀
                            </h2>
                            <form action={onUpdateSettings} className="space-y-8">
                                <input type="hidden" name="title" value={settings?.title || ''} />
                                <input type="hidden" name="headline" value={settings?.headline || ''} />
                                <input type="hidden" name="subtext" value={settings?.subtext || ''} />
                                <input type="hidden" name="address" value={settings?.address || ''} />
                                <input type="hidden" name="phone" value={settings?.phone || ''} />
                                <input type="hidden" name="email" value={settings?.email || ''} />
                                <input type="hidden" name="siteUrl" value={settings?.siteUrl || ''} />
                                <input type="hidden" name="instagram" value={settings?.instagram || ''} />
                                <input type="hidden" name="youtube" value={settings?.youtube || ''} />
                                <input type="hidden" name="linkedin" value={settings?.linkedin || ''} />

                                {/* Global Brand */}
                                <div className="space-y-4 border-b border-gray-100 pb-8">
                                    <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest">Global Brand</h3>
                                    <div className="flex items-center gap-4">
                                        <div className="space-y-1 flex-1">
                                            <label className="text-[10px] font-bold text-gray-400">Main Theme Color</label>
                                            <div className="flex gap-2">
                                                <input name="mainColor" type="color" defaultValue={settings?.mainColor || '#000000'} className="h-10 w-20 rounded cursor-pointer" />
                                                <input name="mainColor_text" defaultValue={settings?.mainColor || '#000000'} className="flex-1 p-2 bg-gray-50 rounded text-xs" />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Hero Section */}
                                <div className="space-y-4 border-b border-gray-100 pb-8">
                                    <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest">Hero Section (Main)</h3>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-gray-400">Background Image URL (Rec: 1920x1080px)</label>
                                        <input name="heroImage" defaultValue={settings?.heroImage || ''} className="w-full p-3 bg-gray-50 rounded-xl text-xs" placeholder="https://..." />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-bold text-gray-400">Headline Text</label>
                                            <textarea name="heroHeadline" rows={2} defaultValue={settings?.heroHeadline || ''} className="w-full p-2 bg-gray-50 rounded-lg text-xs" />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-bold text-gray-400">Headline Style</label>
                                            <div className="flex gap-2">
                                                <input name="heroHeadlineColor" type="color" defaultValue={settings?.heroHeadlineColor || '#E5E4E2'} className="h-8 w-1/3 rounded cursor-pointer" />
                                                <input name="heroHeadlineSize" type="number" defaultValue={settings?.heroHeadlineSize || '60'} className="w-full p-2 bg-gray-50 rounded-lg text-xs" placeholder="Size (px)" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-bold text-gray-400">Subtext</label>
                                            <textarea name="heroSubtext" rows={2} defaultValue={settings?.heroSubtext || ''} className="w-full p-2 bg-gray-50 rounded-lg text-xs" />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-bold text-gray-400">Subtext Style</label>
                                            <div className="flex gap-2">
                                                <input name="heroSubtextColor" type="color" defaultValue={settings?.heroSubtextColor || '#9CA3AF'} className="h-8 w-1/3 rounded cursor-pointer" />
                                                <input name="heroSubtextSize" type="number" defaultValue={settings?.heroSubtextSize || '18'} className="w-full p-2 bg-gray-50 rounded-lg text-xs" placeholder="Size (px)" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-bold text-gray-400">Description</label>
                                            <textarea name="heroDescription" rows={3} defaultValue={settings?.heroDescription || ''} className="w-full p-2 bg-gray-50 rounded-lg text-xs" />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-bold text-gray-400">Desc Style</label>
                                            <div className="flex gap-2">
                                                <input name="heroDescColor" type="color" defaultValue={settings?.heroDescColor || '#6B7280'} className="h-8 w-1/3 rounded cursor-pointer" />
                                                <input name="heroDescSize" type="number" defaultValue={settings?.heroDescSize || '14'} className="w-full p-2 bg-gray-50 rounded-lg text-xs" placeholder="Size (px)" />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Contact Section */}
                                <div className="space-y-4">
                                    <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest">Contact Section</h3>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-gray-400">Background Image URL</label>
                                        <input name="contactImage" defaultValue={settings?.contactImage || ''} className="w-full p-3 bg-gray-50 rounded-xl text-xs" placeholder="https://..." />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-bold text-gray-400">Title Text</label>
                                            <input name="contactTitle" defaultValue={settings?.contactTitle || ''} className="w-full p-2 bg-gray-50 rounded-lg text-xs" />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-bold text-gray-400">Title Color</label>
                                            <input name="contactTitleColor" type="color" defaultValue={settings?.contactTitleColor || '#FFFFFF'} className="h-8 w-full rounded cursor-pointer" />
                                        </div>
                                    </div>
                                </div>

                                <button type="submit" className="w-full py-5 bg-black text-white rounded-2xl text-xs font-black hover:bg-gray-800 transition-all">
                                    디자인 설정 저장하기
                                </button>
                            </form>
                        </div>

                        {/* Project List */}
                        <div className="bg-white p-8 rounded-[40px] shadow-2xl shadow-gray-200/50 border border-gray-100">
                            <h2 className="text-xl font-black mb-8">게시된 프로젝트 ({projects.length})</h2>
                            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 scrollbar-hide">
                                {projects.map((project: any) => (
                                    <div key={project.id} className="group relative bg-gray-50 rounded-2xl p-4 overflow-hidden border border-transparent hover:border-black/5 transition-all flex items-center gap-4">
                                        <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-200 flex-shrink-0">
                                            {(project.mediaType === 'VIDEO' || project.imageUrl.endsWith('.mp4')) ? (
                                                <div className="w-full h-full flex items-center justify-center bg-gray-900 text-[10px] text-white font-black">MP4</div>
                                            ) : (
                                                <img src={project.imageUrl} className="w-full h-full object-cover" />
                                            )}
                                        </div>
                                        <div className="flex-grow min-w-0">
                                            <h3 className="font-black text-xs truncate">{project.title}</h3>
                                            <p className="text-[9px] text-gray-400 font-bold uppercase">{project.category}</p>
                                        </div>
                                        <button onClick={() => onDeleteProject(project.id)} className="p-2 text-gray-300 hover:text-red-500 transition-colors">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
