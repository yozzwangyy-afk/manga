'use client';
import { useState, useEffect } from 'react';
import useSWR from 'swr';
import { useParams, useRouter } from 'next/navigation';
import { mangaAPI } from '@/lib/api';

const fetcher = ([mangaId, chapterId]: [string, string]) =>
  mangaAPI.getChapter(mangaId, chapterId);

export default function ChapterReader() {
  const params = useParams();
  const router = useRouter();
  const mangaId = params.id as string;
  const chapterId = params.chapterId as string;

  const [currentPage, setCurrentPage] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const { data: chapter, error, isLoading } = useSWR(
    mangaId && chapterId ? [mangaId, chapterId] : null,
    fetcher
  );

  // Navigation functions
  const nextPage = () => {
    if (chapter && currentPage < chapter.pages.length - 1) {
      setCurrentPage(currentPage + 1);
    } else if (chapter) {
      // Last page, go back to manga detail
      router.push(`/manga/${mangaId}`);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') nextPage();
      if (e.key === 'ArrowLeft') prevPage();
      if (e.key === 'Escape') setIsFullscreen(false);
      if (e.key === 'f') setIsFullscreen(!isFullscreen);
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentPage, chapter, isFullscreen]);

  // Fullscreen change
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = async () => {
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen();
    } else {
      await document.exitFullscreen();
    }
  };

  if (error) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Failed to load chapter</h1>
        <button 
          onClick={() => router.push(`/manga/${mangaId}`)}
          className="text-blue-600 hover:text-blue-800"
        >
          ← Back to Manga
        </button>
      </div>
    </div>
  );

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading chapter...</p>
      </div>
    </div>
  );

  if (!chapter) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Chapter not found</h1>
        <button 
          onClick={() => router.push(`/manga/${mangaId}`)}
          className="text-blue-600 hover:text-blue-800"
        >
          ← Back to Manga
        </button>
      </div>
    </div>
  );

  const currentPageData = chapter.pages[currentPage];

  return (
    <div className={`min-h-screen bg-gray-900 ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      {/* Header */}
      {!isFullscreen && (
        <div className="bg-gray-800 shadow-sm border-b border-gray-700">
          <div className="container mx-auto px-4 py-4">
            <div className="flex justify-between items-center">
              <button
                onClick={() => router.push(`/manga/${mangaId}`)}
                className="text-blue-400 hover:text-blue-300 font-medium flex items-center"
              >
                ← Back to Manga
              </button>
              
              <div className="text-center">
                <h1 className="text-xl font-bold text-white">{chapter.title}</h1>
                <p className="text-gray-400">
                  Page {currentPage + 1} of {chapter.pages.length}
                </p>
              </div>

              <button
                onClick={toggleFullscreen}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
              >
                {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reader */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center">
          <div className="max-w-4xl w-full">
            {/* Navigation Controls */}
            {!isFullscreen && (
              <div className="flex justify-between items-center mb-6">
                <button
                  onClick={prevPage}
                  disabled={currentPage === 0}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  Previous Page
                </button>

                <button
                  onClick={nextPage}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
                >
                  {currentPage === chapter.pages.length - 1 ? 'Finish Chapter' : 'Next Page'}
                </button>
              </div>
            )}

            {/* Manga Page */}
            <div className="bg-black rounded-lg shadow-2xl overflow-hidden">
              <img
                src={currentPageData.imageUrl}
                alt={`Page ${currentPage + 1}`}
                className="w-full h-auto max-h-screen object-contain cursor-pointer"
                onClick={nextPage}
              />
            </div>

            {/* Page Indicator */}
            {!isFullscreen && (
              <div className="flex justify-center mt-6">
                <div className="flex space-x-2">
                  {chapter.pages.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentPage(index)}
                      className={`w-3 h-3 rounded-full transition-colors ${
                        index === currentPage ? 'bg-blue-600' : 'bg-gray-600 hover:bg-gray-500'
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Instructions */}
            {!isFullscreen && (
              <div className="text-center mt-6 text-gray-400 text-sm">
                <p>Use ← → arrow keys or click on the image to navigate • Press F for fullscreen • Press ESC to exit fullscreen</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
