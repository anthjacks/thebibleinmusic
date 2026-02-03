import { useState, useEffect } from 'react';
import { Book, Play, Globe, ArrowLeft, Check } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { usePlayer } from '../contexts/PlayerContext';
import { useAuth } from '../contexts/AuthContext';

interface BibleContent {
  id: string;
  title: string;
  book_name: string;
  chapter_number: number;
  duration_seconds: number;
  language: 'english' | 'spanish';
  audio_url: string;
  quality_standard: string;
  quality_premium: string | null;
  cover_image_url: string | null;
}

interface BookInfo {
  name: string;
  chapters: number;
}

const OLD_TESTAMENT_BOOKS: BookInfo[] = [
  { name: 'Genesis', chapters: 50 },
  { name: 'Exodus', chapters: 40 },
  { name: 'Leviticus', chapters: 27 },
  { name: 'Numbers', chapters: 36 },
  { name: 'Deuteronomy', chapters: 34 },
  { name: 'Joshua', chapters: 24 },
  { name: 'Judges', chapters: 21 },
  { name: 'Ruth', chapters: 4 },
  { name: '1 Samuel', chapters: 31 },
  { name: '2 Samuel', chapters: 24 },
  { name: '1 Kings', chapters: 22 },
  { name: '2 Kings', chapters: 25 },
  { name: '1 Chronicles', chapters: 29 },
  { name: '2 Chronicles', chapters: 36 },
  { name: 'Ezra', chapters: 10 },
  { name: 'Nehemiah', chapters: 13 },
  { name: 'Esther', chapters: 10 },
  { name: 'Job', chapters: 42 },
  { name: 'Psalms', chapters: 150 },
  { name: 'Proverbs', chapters: 31 },
  { name: 'Ecclesiastes', chapters: 12 },
  { name: 'Song of Solomon', chapters: 8 },
  { name: 'Isaiah', chapters: 66 },
  { name: 'Jeremiah', chapters: 52 },
  { name: 'Lamentations', chapters: 5 },
  { name: 'Ezekiel', chapters: 48 },
  { name: 'Daniel', chapters: 12 },
  { name: 'Hosea', chapters: 14 },
  { name: 'Joel', chapters: 3 },
  { name: 'Amos', chapters: 9 },
  { name: 'Obadiah', chapters: 1 },
  { name: 'Jonah', chapters: 4 },
  { name: 'Micah', chapters: 7 },
  { name: 'Nahum', chapters: 3 },
  { name: 'Habakkuk', chapters: 3 },
  { name: 'Zephaniah', chapters: 3 },
  { name: 'Haggai', chapters: 2 },
  { name: 'Zechariah', chapters: 14 },
  { name: 'Malachi', chapters: 4 },
];

const NEW_TESTAMENT_BOOKS: BookInfo[] = [
  { name: 'Matthew', chapters: 28 },
  { name: 'Mark', chapters: 16 },
  { name: 'Luke', chapters: 24 },
  { name: 'John', chapters: 21 },
  { name: 'Acts', chapters: 28 },
  { name: 'Romans', chapters: 16 },
  { name: '1 Corinthians', chapters: 16 },
  { name: '2 Corinthians', chapters: 13 },
  { name: 'Galatians', chapters: 6 },
  { name: 'Ephesians', chapters: 6 },
  { name: 'Philippians', chapters: 4 },
  { name: 'Colossians', chapters: 4 },
  { name: '1 Thessalonians', chapters: 5 },
  { name: '2 Thessalonians', chapters: 3 },
  { name: '1 Timothy', chapters: 6 },
  { name: '2 Timothy', chapters: 4 },
  { name: 'Titus', chapters: 3 },
  { name: 'Philemon', chapters: 1 },
  { name: 'Hebrews', chapters: 13 },
  { name: 'James', chapters: 5 },
  { name: '1 Peter', chapters: 5 },
  { name: '2 Peter', chapters: 3 },
  { name: '1 John', chapters: 5 },
  { name: '2 John', chapters: 1 },
  { name: '3 John', chapters: 1 },
  { name: 'Jude', chapters: 1 },
  { name: 'Revelation', chapters: 22 },
];

type ViewMode = 'testaments' | 'books' | 'chapters';
type Testament = 'old' | 'new' | null;

export function Bible() {
  const [viewMode, setViewMode] = useState<ViewMode>('testaments');
  const [selectedTestament, setSelectedTestament] = useState<Testament>(null);
  const [selectedBook, setSelectedBook] = useState<BookInfo | null>(null);
  const [chapters, setChapters] = useState<BibleContent[]>([]);
  const [language, setLanguage] = useState<'english' | 'spanish'>('english');
  const [loading, setLoading] = useState(false);
  const { playTrack } = usePlayer();
  const { profile } = useAuth();

  useEffect(() => {
    if (profile?.preferred_language) {
      setLanguage(profile.preferred_language as 'english' | 'spanish');
    }
  }, [profile]);

  useEffect(() => {
    if (selectedBook) {
      loadChapters();
    }
  }, [selectedBook, language]);

  const loadChapters = async () => {
    if (!selectedBook) return;

    setLoading(true);
    const { data, error } = await supabase
      .from('audio_content')
      .select('*')
      .eq('content_type', 'bible')
      .eq('book_name', selectedBook.name)
      .eq('language', language)
      .order('chapter_number');

    if (error) {
      console.error('Error loading chapters:', error);
    } else {
      setChapters(data as BibleContent[]);
    }
    setLoading(false);
  };

  const handleSelectTestament = (testament: Testament) => {
    setSelectedTestament(testament);
    setViewMode('books');
  };

  const handleSelectBook = (book: BookInfo) => {
    setSelectedBook(book);
    setViewMode('chapters');
  };

  const handleBackToTestaments = () => {
    setViewMode('testaments');
    setSelectedTestament(null);
    setSelectedBook(null);
  };

  const handleBackToBooks = () => {
    setViewMode('books');
    setSelectedBook(null);
  };

  const handlePlayChapter = (chapter: BibleContent) => {
    playTrack({
      id: chapter.id,
      title: chapter.title,
      content_type: 'bible',
      language: chapter.language,
      artist: null,
      album: null,
      book_name: chapter.book_name,
      chapter_number: chapter.chapter_number,
      duration_seconds: chapter.duration_seconds,
      audio_url: chapter.audio_url,
      cover_image_url: chapter.cover_image_url,
      quality_standard: chapter.quality_standard,
      quality_premium: chapter.quality_premium,
    });
  };

  const getCurrentBooks = () => {
    return selectedTestament === 'old' ? OLD_TESTAMENT_BOOKS : NEW_TESTAMENT_BOOKS;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center">
            <Book className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Bible Audio Library</h1>
            <p className="text-gray-600">Complete Bible in English & Spanish</p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg p-1 shadow-sm">
          <button
            onClick={() => setLanguage('english')}
            className={`px-4 py-2 rounded-md font-medium transition ${
              language === 'english'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4" />
              English
            </div>
          </button>
          <button
            onClick={() => setLanguage('spanish')}
            className={`px-4 py-2 rounded-md font-medium transition ${
              language === 'spanish'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4" />
              Español
            </div>
          </button>
        </div>
      </div>

      {viewMode === 'testaments' && (
        <div className="grid md:grid-cols-2 gap-6">
          <TestamentCard
            title="Old Testament"
            books={39}
            range="Genesis to Malachi"
            gradient="from-amber-500 to-orange-600"
            onClick={() => handleSelectTestament('old')}
          />
          <TestamentCard
            title="New Testament"
            books={27}
            range="Matthew to Revelation"
            gradient="from-blue-500 to-blue-600"
            onClick={() => handleSelectTestament('new')}
          />
        </div>
      )}

      {viewMode === 'books' && (
        <div>
          <button
            onClick={handleBackToTestaments}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium mb-6 transition"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Bible
          </button>

          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {selectedTestament === 'old' ? 'Old Testament' : 'New Testament'}
            </h2>
            <div className="grid gap-3 max-h-[700px] overflow-y-auto">
              {getCurrentBooks().map((book, index) => (
                <button
                  key={book.name}
                  onClick={() => handleSelectBook(book)}
                  className="flex items-center justify-between px-6 py-4 rounded-lg bg-gray-50 hover:bg-blue-50 border-2 border-transparent hover:border-blue-600 transition text-left group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg">{book.name}</h3>
                      <p className="text-sm text-gray-600">{book.chapters} Chapters</p>
                    </div>
                  </div>
                  <div className="text-blue-600 group-hover:translate-x-1 transition">
                    <Play className="w-5 h-5" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {viewMode === 'chapters' && selectedBook && (
        <div>
          <button
            onClick={handleBackToBooks}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium mb-6 transition"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Books
          </button>

          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">{selectedBook.name}</h2>
            {loading ? (
              <div className="text-center py-12 text-gray-500">Loading chapters...</div>
            ) : chapters.length === 0 ? (
              <div className="text-center py-12">
                <Book className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p className="text-gray-500 mb-2">No chapters available yet</p>
                <p className="text-sm text-gray-400">Content is being added regularly</p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 max-h-[700px] overflow-y-auto">
                {chapters.map((chapter) => (
                  <button
                    key={chapter.id}
                    onClick={() => handlePlayChapter(chapter)}
                    className="flex flex-col items-center justify-center p-6 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 border-2 border-blue-200 hover:border-blue-400 transition group"
                  >
                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white mb-3 group-hover:bg-blue-700 transition">
                      <Play className="w-6 h-6 ml-0.5" />
                    </div>
                    <h3 className="font-bold text-gray-900 mb-1">
                      {selectedBook.name} {chapter.chapter_number}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {Math.floor(chapter.duration_seconds / 60)}:{(chapter.duration_seconds % 60).toString().padStart(2, '0')}
                    </p>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function TestamentCard({
  title,
  books,
  range,
  gradient,
  onClick,
}: {
  title: string;
  books: number;
  range: string;
  gradient: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition group"
    >
      <div className={`h-48 bg-gradient-to-br ${gradient} flex items-center justify-center relative`}>
        <Book className="w-24 h-24 text-white opacity-50" />
        <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition"></div>
      </div>
      <div className="p-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 mb-1">{books} Books</p>
        <p className="text-sm text-gray-500 mb-4">{range}</p>
        <div className="flex items-center gap-2 text-blue-600 font-semibold group-hover:gap-3 transition-all">
          Browse
          <Play className="w-4 h-4" />
        </div>
      </div>
    </button>
  );
}
