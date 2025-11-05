import axios from 'axios';

const API_BASE_URL = 'https://www.sankavollerei.com/comic';

// Mock data untuk testing (jika API belum ready)
const mockMangaData = [
  {
    id: '1',
    title: 'Sample Manga 1',
    cover: 'https://via.placeholder.com/300x400/4A5568/FFFFFF?text=Manga+Cover',
    description: 'This is a sample manga description',
    chapters: [
      {
        id: '1',
        title: 'Chapter 1: The Beginning',
        number: 1,
        pages: [
          {
            id: '1',
            imageUrl: 'https://via.placeholder.com/800x1200/718096/FFFFFF?text=Page+1',
            pageNumber: 1
          },
          {
            id: '2',
            imageUrl: 'https://via.placeholder.com/800x1200/4A5568/FFFFFF?text=Page+2',
            pageNumber: 2
          },
          {
            id: '3',
            imageUrl: 'https://via.placeholder.com/800x1200/2D3748/FFFFFF?text=Page+3',
            pageNumber: 3
          }
        ]
      },
      {
        id: '2',
        title: 'Chapter 2: The Journey',
        number: 2,
        pages: [
          {
            id: '1',
            imageUrl: 'https://via.placeholder.com/800x1200/718096/FFFFFF?text=Chapter+2+Page+1',
            pageNumber: 1
          },
          {
            id: '2',
            imageUrl: 'https://via.placeholder.com/800x1200/4A5568/FFFFFF?text=Chapter+2+Page+2',
            pageNumber: 2
          }
        ]
      }
    ]
  },
  {
    id: '2',
    title: 'Sample Manga 2',
    cover: 'https://via.placeholder.com/300x400/2D3748/FFFFFF?text=Manga+2',
    description: 'Another exciting manga series',
    chapters: [
      {
        id: '1',
        title: 'First Chapter',
        number: 1,
        pages: [
          {
            id: '1',
            imageUrl: 'https://via.placeholder.com/800x1200/718096/FFFFFF?text=Manga+2+Page+1',
            pageNumber: 1
          }
        ]
      }
    ]
  }
];

export const mangaAPI = {
  // Get all manga
  getAllManga: async (): Promise<any[]> => {
    try {
      // Coba fetch dari API asli
      const response = await axios.get(`${API_BASE_URL}/manga`);
      return response.data;
    } catch (error) {
      console.log('Using mock data due to API error:', error);
      // Fallback ke mock data jika API error
      return mockMangaData;
    }
  },

  // Get manga by ID
  getMangaById: async (id: string): Promise<any> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/manga/${id}`);
      return response.data;
    } catch (error) {
      console.log('Using mock data for manga detail');
      // Cari di mock data
      const manga = mockMangaData.find(m => m.id === id);
      if (manga) return manga;
      throw new Error('Manga not found');
    }
  },

  // Get chapter by ID
  getChapter: async (mangaId: string, chapterId: string): Promise<any> => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/manga/${mangaId}/chapters/${chapterId}`
      );
      return response.data;
    } catch (error) {
      console.log('Using mock data for chapter');
      // Cari di mock data
      const manga = mockMangaData.find(m => m.id === mangaId);
      if (manga) {
        const chapter = manga.chapters.find(c => c.id === chapterId);
        if (chapter) return chapter;
      }
      throw new Error('Chapter not found');
    }
  },
};
