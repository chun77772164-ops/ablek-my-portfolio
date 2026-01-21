'use client';

import { useState, useEffect } from 'react';
import { getCharacterItems, upsertCharacterItem, initializeDefaultCharacters } from '@/lib/actions';

export default function CharacterManager() {
    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [editItem, setEditItem] = useState<any>(null); // If valid, we are editing this item
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        imageUrl: '',
        order: 0
    });

    useEffect(() => {
        loadItems();
    }, []);

    const loadItems = async () => {
        const data = await getCharacterItems();
        setItems(data);
    };

    const handleInitialize = async () => {
        if (!confirm("기본 데이터로 초기화하시겠습니까? (기존 데이터가 없을 때만 동작합니다)")) return;
        setLoading(true);
        await initializeDefaultCharacters();
        await loadItems();
        setLoading(false);
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const uploadData = new FormData();
        uploadData.append('file', file);

        try {
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: uploadData,
            });
            const data = await res.json();
            if (data.url) {
                setFormData(prev => ({ ...prev, imageUrl: data.url }));
            }
        } catch (err) {
            console.error(err);
            alert('업로드 실패');
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await upsertCharacterItem({
                id: editItem?.id,
                ...formData
            });
            if (res.success) {
                alert('저장되었습니다.');
                setEditItem(null);
                setFormData({ title: '', description: '', imageUrl: '', order: 0 });
                loadItems();
            } else {
                alert('실패했습니다.');
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const startEdit = (item: any) => {
        setEditItem(item);
        setFormData({
            title: item.title,
            description: item.description,
            imageUrl: item.imageUrl,
            order: item.order
        });
    };

    const cancelEdit = () => {
        setEditItem(null);
        setFormData({ title: '', description: '', imageUrl: '', order: 0 });
    };

    return (
        <div className="bg-white p-10 rounded-[40px] shadow-2xl shadow-gray-200/50 border border-gray-100">
            <h2 className="text-2xl font-black mb-10 flex items-center justify-between">
                <span className="flex items-center gap-4">
                    <span className="w-2.5 h-10 bg-luxury-blue bg-blue-900 rounded-full" />
                    Our Character 관리
                </span>
                {items.length === 0 && (
                    <button
                        onClick={handleInitialize}
                        disabled={loading}
                        className="px-6 py-2 bg-gray-100 text-gray-600 rounded-xl text-xs font-bold hover:bg-gray-200"
                    >
                        기본 데이터 생성
                    </button>
                )}
            </h2>

            {/* List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                {items.length === 0 && (
                    <div className="col-span-1 md:col-span-2 text-center py-10 text-gray-400 text-sm font-medium border-2 border-dashed border-gray-100 rounded-3xl">
                        데이터가 없습니다. 새로운 캐릭터를 추가하거나 기본 데이터를 생성하세요.
                    </div>
                )}
                {items.map((item) => (
                    <div key={item.id} className="relative group bg-gray-50 rounded-3xl p-6 border border-transparent hover:border-black/5 transition-all">
                        <div className="flex gap-4">
                            <div className="w-20 h-20 rounded-2xl overflow-hidden bg-gray-200 flex-shrink-0">
                                <img src={item.imageUrl} className="w-full h-full object-cover" />
                            </div>
                            <div>
                                <h3 className="font-black text-lg">{item.title}</h3>
                                <p className="text-xs text-gray-500 line-clamp-2 mt-1">{item.description}</p>
                                <div className="mt-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Order: {item.order}</div>
                            </div>
                        </div>
                        <button
                            onClick={() => startEdit(item)}
                            className="absolute top-4 right-4 p-2 bg-white rounded-xl shadow-sm opacity-0 group-hover:opacity-100 transition-all text-xs font-bold"
                        >
                            Edit
                        </button>
                    </div>
                ))}
            </div>

            {/* Form */}
            <div className="border-t pt-10">
                <h3 className="text-lg font-black mb-6">{editItem ? '캐릭터 수정' : '새 캐릭터 추가'}</h3>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">제목 (키워드)</label>
                            <input
                                required
                                value={formData.title}
                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                                className="w-full p-4 bg-gray-50 border-2 border-transparent focus:border-black/5 rounded-2xl outline-none font-bold"
                                placeholder="예: Total Solution"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">순서 (정렬용)</label>
                            <input
                                type="number"
                                value={formData.order}
                                onChange={e => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                                className="w-full p-4 bg-gray-50 border-2 border-transparent focus:border-black/5 rounded-2xl outline-none font-bold"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">설명</label>
                        <textarea
                            required
                            rows={3}
                            value={formData.description}
                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                            className="w-full p-4 bg-gray-50 border-2 border-transparent focus:border-black/5 rounded-2xl outline-none resize-none font-medium"
                            placeholder="설명을 입력하세요."
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">이미지</label>
                        <div className="flex gap-4">
                            <div className="relative group flex-grow">
                                <input
                                    type="file"
                                    onChange={handleFileUpload}
                                    accept="image/*"
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                />
                                <div className="w-full p-4 bg-black text-white rounded-2xl text-center font-bold text-sm group-hover:bg-gray-800 transition-all">
                                    {uploading ? '업로딩...' : '이미지 변경'}
                                </div>
                            </div>
                            <input
                                value={formData.imageUrl}
                                onChange={e => setFormData({ ...formData, imageUrl: e.target.value })}
                                className="w-full p-4 bg-gray-50 border-2 border-transparent focus:border-black/5 rounded-2xl outline-none text-xs font-medium"
                                placeholder="이미지 URL"
                            />
                        </div>
                    </div>

                    <div className="flex gap-4">
                        {editItem && (
                            <button
                                type="button"
                                onClick={cancelEdit}
                                className="flex-1 py-4 bg-gray-100 text-gray-500 rounded-2xl font-bold hover:bg-gray-200 transition-all"
                            >
                                취소
                            </button>
                        )}
                        <button
                            type="submit"
                            disabled={loading || uploading}
                            className="flex-[2] py-4 bg-blue-900 text-white rounded-2xl font-bold hover:bg-blue-800 transition-all disabled:opacity-50"
                        >
                            {loading ? '저장 중...' : (editItem ? '수정 사항 저장' : '추가하기')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
