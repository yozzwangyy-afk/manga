'use client';
import useSWR from 'swr';
import Link from 'next/link';
import { mangaAPI } from '@/lib/api';

const fetcher = () => mangaAPI.getAllManga();

export default function Home() {
  const { data: mangaList, error, isLoading } = useSWR('manga', fetcher);

  if (error) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Failed to load manga</h1>
        <p className="text-gray-600">Please check your connection and try again.</p>
      </div>
    </div>
  );

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading manga...</p>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">Manga Library</h1>
      
      {mangaList && mangaList.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">No manga available at the moment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {mangaList?.map((manga: any) => (
            <Link key={manga.id} href={`/manga/${manga.id}`}>
              <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1">
                <img
                  src={manga.cover}
                  alt={manga.title}
                  className="w-full h-80 object-cover rounded-t-lg"
                />
                <div className="p-4">
                  <h2 className="text-xl font-semibold mb-2 text-gray-800 line-clamp-2">
                    {manga.title}
                  </h2>
                  <p className="text-gray-600 text-sm">
                    {manga.chapters?.length || 0} chapters
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
