'use client';

import { useState } from 'react';
import Image from 'next/image';

// メモリーのタイプを定義
type Memory = {
  id: string;
  year: string;
  location: string;
  people: string;
  event: string;
  thoughts: string;
  photoIndex: number;
  story: string;
};

export default function Home() {
  const [selectedPhoto, setSelectedPhoto] = useState<number | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<string, string>>({
    year: '',
    location: '',
    people: '',
    event: '',
    thoughts: ''
  });
  const [showStoryButton, setShowStoryButton] = useState<boolean>(false);
  const [memories, setMemories] = useState<Memory[]>([]);

  // サンプル写真の配列（プレースホルダー画像を使用）
  const photos = [
    'https://via.placeholder.com/400x300?text=Photo+1',
    'https://via.placeholder.com/400x300?text=Photo+2',
    'https://via.placeholder.com/400x300?text=Photo+3',
    'https://via.placeholder.com/400x300?text=Photo+4',
    'https://via.placeholder.com/400x300?text=Photo+5'
  ];

  // 質問のリスト
  const questions = [
    { id: 'year', text: 'この写真は何年に撮影されましたか？' },
    { id: 'location', text: 'どこで撮影されましたか？' },
    { id: 'people', text: '写真に写っている人は誰ですか？' },
    { id: 'event', text: 'その時何が起こりましたか？' },
    { id: 'thoughts', text: '思い出や感想を共有したいことはありますか？' }
  ];

  const handlePhotoClick = (index: number) => {
    setSelectedPhoto(index);
    setCurrentQuestion(0);
    setAnswers({
      year: '',
      location: '',
      people: '',
      event: '',
      thoughts: ''
    });
    setShowStoryButton(false);
  };

  const handleAnswerChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setAnswers({
      ...answers,
      [questions[currentQuestion].id]: e.target.value
    });
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowStoryButton(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const generateStory = () => {
    // 入力された回答から自然な文章を生成
    return `${answers.year}、${answers.location}で撮った写真です。一緒に写っているのは${answers.people}で、このとき${answers.event}がありました。${answers.thoughts}`;
  };

  const handleGenerateStory = () => {
    const story = generateStory();
    
    // 新しいメモリーを作成
    const newMemory: Memory = {
      id: Date.now().toString(), // ユニークIDとして現在のタイムスタンプを使用
      year: answers.year,
      location: answers.location,
      people: answers.people,
      event: answers.event,
      thoughts: answers.thoughts,
      photoIndex: selectedPhoto as number,
      story: story
    };
    
    // 新しいメモリーを追加し、年順にソート
    const updatedMemories = [...memories, newMemory].sort((a, b) => {
      return parseInt(a.year) - parseInt(b.year);
    });
    
    setMemories(updatedMemories);
    
    // 選択状態をリセット
    setSelectedPhoto(null);
    setCurrentQuestion(0);
    setAnswers({
      year: '',
      location: '',
      people: '',
      event: '',
      thoughts: ''
    });
    setShowStoryButton(false);
  };

  return (
    <main className="min-h-screen py-8 px-4">
      <div className="max-w-xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-center mb-8">思い出アプリ</h1>
        
        {selectedPhoto === null ? (
          <div>
            <p className="text-center mb-4">写真をクリックして思い出を記録しましょう</p>
            <div className="flex flex-wrap justify-center gap-4">
              {photos.map((photo, index) => (
                <div 
                  key={index} 
                  className="w-40 h-40 relative cursor-pointer border-2 border-gray-300 rounded-md overflow-hidden hover:border-blue-500 transition-all"
                  onClick={() => handlePhotoClick(index)}
                >
                  <img 
                    src={photo} 
                    alt={`写真 ${index + 1}`} 
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>

            {/* タイムライン表示 */}
            {memories.length > 0 && (
              <div className="mt-16">
                <h2 className="text-2xl font-bold mb-6 text-center">思い出タイムライン</h2>
                <div className="space-y-6">
                  {memories.map((memory) => (
                    <div key={memory.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                      <div className="p-4 bg-blue-50 border-b border-blue-100">
                        <h3 className="text-xl font-bold text-blue-800">{memory.year}年</h3>
                      </div>
                      <div className="p-4 flex gap-4">
                        <div className="w-24 h-24 flex-shrink-0">
                          <img 
                            src={photos[memory.photoIndex]} 
                            alt={`写真 ${memory.photoIndex + 1}`}
                            className="w-full h-full object-cover rounded-md" 
                          />
                        </div>
                        <div className="flex-grow">
                          <p className="text-gray-800">{memory.story}</p>
                          <div className="mt-2 text-sm text-gray-500">
                            <span className="inline-block mr-4">
                              <span className="font-medium">場所:</span> {memory.location}
                            </span>
                            <span className="inline-block">
                              <span className="font-medium">人物:</span> {memory.people}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <button 
                onClick={() => setSelectedPhoto(null)}
                className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 transition-colors"
              >
                ← 戻る
              </button>
              <div className="text-center">
                <span className="text-sm text-gray-500">写真 {selectedPhoto + 1}</span>
              </div>
            </div>

            <div className="w-full h-56 relative border-2 border-gray-300 rounded-md overflow-hidden">
              <img 
                src={photos[selectedPhoto]} 
                alt={`写真 ${selectedPhoto + 1}`} 
                className="w-full h-full object-cover"
              />
            </div>

            {!showStoryButton ? (
              <div className="space-y-4 p-6 bg-white rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">質問 {currentQuestion + 1}/{questions.length}</h2>
                <p className="mb-3">{questions[currentQuestion].text}</p>
                
                {questions[currentQuestion].id === 'thoughts' ? (
                  <textarea
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={4}
                    value={answers[questions[currentQuestion].id]}
                    onChange={handleAnswerChange}
                    placeholder="ここに入力してください..."
                  />
                ) : (
                  <input
                    type="text"
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={answers[questions[currentQuestion].id]}
                    onChange={handleAnswerChange}
                    placeholder="ここに入力してください..."
                  />
                )}
                
                <div className="flex justify-between mt-6">
                  <button
                    onClick={handlePrevious}
                    disabled={currentQuestion === 0}
                    className={`px-4 py-2 rounded-md ${
                      currentQuestion === 0
                        ? 'bg-gray-200 cursor-not-allowed'
                        : 'bg-gray-200 hover:bg-gray-300 transition-colors'
                    }`}
                  >
                    戻る
                  </button>
                  <button
                    onClick={handleNext}
                    className="px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600 transition-colors"
                  >
                    {currentQuestion === questions.length - 1 ? '完了' : '次へ'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4 p-6 bg-white rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">すべての質問に回答しました</h2>
                <div className="space-y-3">
                  {questions.map((q) => (
                    <div key={q.id} className="mb-2">
                      <p className="font-medium">{q.text}</p>
                      <p className="text-gray-700 ml-2">{answers[q.id]}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-6 space-y-4">
                  <div className="p-3 bg-gray-50 rounded-md">
                    <h3 className="font-medium mb-2">プレビュー：</h3>
                    <p className="text-gray-700">{generateStory()}</p>
                  </div>
                  <button
                    onClick={handleGenerateStory}
                    className="w-full py-3 rounded-md bg-blue-500 text-white hover:bg-blue-600 transition-colors"
                  >
                    ストーリーを追加する
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
