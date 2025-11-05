'use client';
import useSWR from 'swr';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { mangaAPI } from '@/lib/api';

const fetcher = (id: string) => mangaAPI.getMangaById(id);

export default function MangaDetail() {
  const params = useParams();
  const mangaId = params.id as string;
  
  const { data: manga, error, isLoading } = useSWR(
    mangaId ? `manga-${mangaId}` : null,
    () => fetcher(mangaId)
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Failed to load manga</h1>
        <Link href="/" className="text-blue-600 hover:text-blue-800">
          ← Back to Home
        </Link>
      </div>
    </div>
  );

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading manga details...</p>
      </div>
    </div>
  );

  if (!manga) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Manga not found</h1>
        <Link href="/" className="text-blue-600 hover:text-blue-800">
          ← Back to Home
        </Link>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6">
        ← Back to Home
      </Link>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Manga Cover */}
        <div className="md:w-1/3">
          <img
            src={manga.cover}
            alt={manga.title}
            className="w-full rounded-lg shadow-lg"
          />
        </div>

        {/* Manga Info */}
        <div className="md:w-2/3">
          <h1 className="text-4xl font-bold mb-4 text-gray-800">{manga.title}</h1>
          {manga.description && (
            <p className="text-gray-700 mb-6 text-lg leading-relaxed">{manga.description}</p>
          )}

          {/* Chapters List */}
          <div className="mt-8">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Chapters</h2>
            {manga.chapters?.length === 0 ? (
              <p className="text-gray-600">No chapters available yet.</p>
            ) : (
              <div className="space-y-3">
                {manga.chapters?.map((chapter: any) => (
                  <Link
                    key={chapter.id}
                    href={`/manga/${mangaId}/chapter/${chapter.id}`}
                  >
                    <div className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-all duration-200 cursor-pointer border border-gray-200">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-gray-800">
                          Chapter {chapter.number}: {chapter.title}
                        </span>
                        <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                          {chapter.pages?.length || 0} pages
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
