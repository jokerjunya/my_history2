'use client';

import { useState, useEffect, useRef } from 'react';
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
  photoUrl: string;
  photoDescription: string;
  story: string;
  title?: string;
};

// カテゴリ付きサンプル写真
type CategoryPhoto = {
  url: string;
  category: 'family' | 'school' | 'leisure' | 'event' | 'retro';
  description: string;
};

// 入力選択肢の定義
type Option = {
  id: string;
  label: string;
  icon?: string;
};

export default function Home() {
  const [selectedPhoto, setSelectedPhoto] = useState<number | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<string, string>>({
    year: new Date().getFullYear().toString(), // 現在の年をデフォルト値に設定
    location: '',
    people: '',
    event: '',
    thoughts: ''
  });
  const [showStoryButton, setShowStoryButton] = useState<boolean>(false);
  const [memories, setMemories] = useState<Memory[]>([]);
  const [displayedPhotos, setDisplayedPhotos] = useState<CategoryPhoto[]>([]);
  const [cannotRemember, setCannotRemember] = useState<Record<string, boolean>>({
    location: false,
    people: false,
    event: false,
    thoughts: false
  });
  const [isFirstVisit, setIsFirstVisit] = useState<boolean>(true);
  
  // 音声入力関連の状態
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordedText, setRecordedText] = useState<string>('');
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  
  // 質問のリスト（リニューアル版）
  const questions = [
    { id: 'location', text: 'この写真はどこで撮影されましたか？' },
    { id: 'people', text: '写真に写っている人は誰ですか？' },
    { id: 'event', text: 'その時何が起こりましたか？' },
    { id: 'thoughts', text: '思い出や感想を教えてください' }
  ];

  // 場所の選択肢
  const locationOptions: Option[] = [
    { id: '自宅', label: '自宅', icon: '🏠' },
    { id: '実家', label: '実家', icon: '🏡' },
    { id: '学校', label: '学校', icon: '🏫' },
    { id: '職場', label: '職場', icon: '🏢' },
    { id: '旅行先', label: '旅行先', icon: '✈️' },
    { id: '公園', label: '公園', icon: '🌳' },
    { id: 'レストラン', label: 'レストラン', icon: '🍽️' },
    { id: '祖父母の家', label: '祖父母の家', icon: '👵' }
  ];

  // 人物の選択肢
  const peopleOptions: Option[] = [
    { id: '家族', label: '家族', icon: '👨‍👩‍👧‍👦' },
    { id: '友人', label: '友人', icon: '👫' },
    { id: '同僚', label: '同僚', icon: '👔' },
    { id: '先生', label: '先生', icon: '👨‍🏫' },
    { id: '子供', label: '子供', icon: '👶' },
    { id: '恋人', label: '恋人', icon: '❤️' },
    { id: '親戚', label: '親戚', icon: '👨‍👩‍👧' },
    { id: '一人', label: '一人', icon: '🧍' }
  ];

  // イベントの選択肢
  const eventOptions: Option[] = [
    { id: '誕生日', label: '誕生日', icon: '🎂' },
    { id: '結婚式', label: '結婚式', icon: '💒' },
    { id: '旅行', label: '旅行', icon: '🧳' },
    { id: '卒業式', label: '卒業式', icon: '🎓' },
    { id: 'パーティー', label: 'パーティー', icon: '🎉' },
    { id: 'スポーツ', label: 'スポーツ', icon: '⚽' },
    { id: '記念日', label: '記念日', icon: '📅' },
    { id: '日常', label: '日常', icon: '☀️' }
  ];

  // サンプル写真の配列（Unsplashの画像を使用）
  const allPhotos: CategoryPhoto[] = [
    {
      url: 'https://images.unsplash.com/photo-1511895426328-dc8714191300',
      category: 'family',
      description: '家族の思い出'
    },
    {
      url: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1',
      category: 'school',
      description: '学校生活'
    },
    {
      url: 'https://images.unsplash.com/photo-1511895426328-dc8714191300',
      category: 'leisure',
      description: '趣味の時間'
    },
    {
      url: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1',
      category: 'event',
      description: '特別な出来事'
    },
    {
      url: 'https://images.unsplash.com/photo-1511895426328-dc8714191300',
      category: 'retro',
      description: '懐かしい思い出'
    },
    {
      url: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1',
      category: 'family',
      description: '家族の思い出'
    },
    {
      url: 'https://images.unsplash.com/photo-1511895426328-dc8714191300',
      category: 'school',
      description: '学校生活'
    },
    {
      url: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1',
      category: 'leisure',
      description: '趣味の時間'
    },
    {
      url: 'https://images.unsplash.com/photo-1511895426328-dc8714191300',
      category: 'event',
      description: '特別な出来事'
    },
    {
      url: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1',
      category: 'retro',
      description: '懐かしい思い出'
    }
  ];

  // コンポーネント初期化時にランダムで3枚の写真を選択
  useEffect(() => {
    const shuffled = [...allPhotos].sort(() => 0.5 - Math.random());
    setDisplayedPhotos(shuffled.slice(0, 3));
  }, []);

  // 音声認識の初期化と後処理
  useEffect(() => {
    return () => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }
    };
  }, []);

  const handlePhotoClick = (index: number) => {
    setSelectedPhoto(index);
    setCurrentQuestion(0);
    setAnswers({
      year: new Date().getFullYear().toString(), // 現在の年をデフォルト値に設定
      location: '',
      people: '',
      event: '',
      thoughts: ''
    });
    setCannotRemember({
      location: false,
      people: false,
      event: false,
      thoughts: false
    });
    setShowStoryButton(false);
    setRecordedText('');
  };

  const handleOptionSelect = (optionId: string) => {
    const currentId = questions[currentQuestion].id;
    setAnswers({
      ...answers,
      [currentId]: optionId
    });
    setCannotRemember({
      ...cannotRemember,
      [currentId]: false
    });
  };

  const handleCannotRemember = () => {
    const currentId = questions[currentQuestion].id;
    setCannotRemember({
      ...cannotRemember,
      [currentId]: true
    });
    setAnswers({
      ...answers,
      [currentId]: ''
    });
    // 思い出せない場合は自動的に次の質問へ
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowStoryButton(true);
    }
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

  // 音声録音の開始
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = async () => {
        // 仮の処理: 録音が終わったら、その場で「音声を認識しました」としてテキスト表示
        const simulatedText = "録音した音声をテキスト化しました。実際のアプリでは音声認識APIと連携します。";
        setRecordedText(simulatedText);
        setAnswers({
          ...answers,
          thoughts: simulatedText
        });
        setCannotRemember({
          ...cannotRemember,
          thoughts: false
        });
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error("音声録音の開始エラー:", error);
      alert("音声録音を開始できませんでした。マイクへのアクセス許可を確認してください。");
    }
  };

  // 音声録音の停止
  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      // すべてのトラックを停止して、リソースを解放
      if (mediaRecorderRef.current.stream) {
        mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      }
    }
  };

  const generateStory = () => {
    // 「思い出せない」場合の対応
    const year = answers.year || '不明な年';
    const location = answers.location ? `${answers.location}で撮った写真です。` : '';
    const people = answers.people ? `一緒に写っているのは${answers.people}です。` : '';
    const event = answers.event ? `このとき${answers.event}がありました。` : '';
    const thoughts = answers.thoughts || '';
    
    return `${year}、${location}${people}${event}${thoughts}`;
  };

  const handleGenerateStory = () => {
    const story = generateStory();
    
    // タイトルを生成（イベントまたは場所ベース）
    const title = answers.event 
      ? `${answers.event}の思い出` 
      : answers.location 
        ? `${answers.location}での思い出` 
        : '思い出';
    
    // 新しいメモリーを作成
    const newMemory: Memory = {
      id: Date.now().toString(),
      year: answers.year,
      location: answers.location,
      people: answers.people,
      event: answers.event,
      thoughts: answers.thoughts,
      photoIndex: selectedPhoto as number,
      photoUrl: displayedPhotos[selectedPhoto as number].url,
      photoDescription: displayedPhotos[selectedPhoto as number].description,
      story: story,
      title: title
    };
    
    // 新しいメモリーを追加し、年順に降順ソート（新しい順）
    const updatedMemories = [...memories, newMemory].sort((a, b) => {
      return parseInt(b.year || '0') - parseInt(a.year || '0');
    });
    
    setMemories(updatedMemories);
    setIsFirstVisit(false);
    
    // 選択状態をリセット
    setSelectedPhoto(null);
    setCurrentQuestion(0);
    setAnswers({
      year: new Date().getFullYear().toString(),
      location: '',
      people: '',
      event: '',
      thoughts: ''
    });
    setCannotRemember({
      location: false,
      people: false,
      event: false,
      thoughts: false
    });
    setShowStoryButton(false);
    setRecordedText('');
  };

  const handleRefreshPhotos = () => {
    const shuffled = [...allPhotos].sort(() => 0.5 - Math.random());
    setDisplayedPhotos(shuffled.slice(0, 3));
  };

  const handleStartWithPhotos = () => {
    const shuffled = [...allPhotos].sort(() => 0.5 - Math.random());
    setDisplayedPhotos(shuffled.slice(0, 3));
    setIsFirstVisit(false);
  };

  // 現在の質問に対応する選択肢を取得
  const getCurrentOptions = () => {
    const currentId = questions[currentQuestion].id;
    
    switch (currentId) {
      case 'location':
        return locationOptions;
      case 'people':
        return peopleOptions;
      case 'event':
        return eventOptions;
      default:
        return [];
    }
  };

  // 質問フォームのレンダリング
  const renderQuestionForm = () => {
    const currentId = questions[currentQuestion].id;
    
    if (cannotRemember[currentId]) {
      return (
        <div className="p-4 bg-gray-100 rounded-md text-center">
          <p className="text-gray-600 text-lg">思い出せないを選択しました</p>
          <button
            onClick={() => setCannotRemember({ ...cannotRemember, [currentId]: false })}
            className="mt-4 px-5 py-3 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors text-lg"
          >
            入力に戻る
          </button>
        </div>
      );
    }

    // 音声入力フォーム（感想の場合）
    if (currentId === 'thoughts') {
      return (
        <div className="space-y-4">
          {isRecording ? (
            <div className="text-center space-y-4">
              <div className="p-6 bg-red-50 border-2 border-red-200 rounded-lg">
                <div className="w-16 h-16 mx-auto mb-4 animate-pulse bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-3xl">🎤</span>
                </div>
                <p className="text-xl font-medium text-red-700">録音中です...</p>
                <p className="text-gray-600">お話しください</p>
              </div>
              <button
                onClick={stopRecording}
                className="px-6 py-3 bg-red-500 text-white rounded-lg text-lg font-medium hover:bg-red-600 transition-colors mx-auto block"
              >
                録音終了
              </button>
            </div>
          ) : recordedText ? (
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <h3 className="font-medium mb-2 text-lg">録音内容：</h3>
                <p className="text-gray-700 text-lg">{recordedText}</p>
              </div>
              <button
                onClick={() => {
                  setRecordedText('');
                  setAnswers({ ...answers, thoughts: '' });
                }}
                className="px-5 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
              >
                録音し直す
              </button>
            </div>
          ) : (
            <div className="text-center space-y-4">
              <button
                onClick={startRecording}
                className="relative w-32 h-32 mx-auto bg-blue-500 hover:bg-blue-600 transition-colors rounded-full flex items-center justify-center"
              >
                <span className="text-5xl text-white">🎤</span>
                <div className="text-white font-medium mt-2 absolute bottom-[-30px]">録音開始</div>
              </button>
            </div>
          )}
        </div>
      );
    }

    // 選択式フォーム（場所、人物、イベントの場合）
    const options = getCurrentOptions();
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          {options.map((option) => (
            <button
              key={option.id}
              onClick={() => handleOptionSelect(option.id)}
              className={`p-4 rounded-lg text-center shadow-sm transition-colors ${
                answers[currentId] === option.id
                  ? 'bg-blue-100 border-2 border-blue-400'
                  : 'bg-white border border-gray-300 hover:bg-gray-50'
              }`}
            >
              <div className="text-3xl mb-2">{option.icon}</div>
              <div className="text-lg font-medium">{option.label}</div>
            </button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <main className="min-h-screen py-8 px-4 bg-gray-50">
      <div className="max-w-xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-center mb-8">思い出アプリ</h1>
        
        {selectedPhoto === null ? (
          <div>
            {memories.length === 0 && isFirstVisit ? (
              <div className="text-center space-y-8 p-8 bg-white rounded-lg shadow-md">
                <div className="space-y-4">
                  <p className="text-xl font-medium text-gray-700">あなたの人生の物語は、まだここから始まります。</p>
                  <p className="text-lg text-gray-600">最初の思い出を残してみましょう。</p>
                </div>
                
                <button 
                  onClick={handleStartWithPhotos}
                  className="px-6 py-3 text-lg font-medium rounded-md bg-blue-500 text-white hover:bg-blue-600 transition-colors"
                >
                  写真を選んで始める
                </button>
              </div>
            ) : (
              <>
                <p className="text-center mb-4 text-lg">写真をタップして思い出を記録しましょう</p>
                <div className="flex flex-wrap justify-center gap-4 mb-8">
                  {displayedPhotos.map((photo, index) => (
                    <div 
                      key={index} 
                      className="w-40 h-40 relative cursor-pointer border-2 border-gray-300 rounded-lg overflow-hidden hover:border-blue-500 transition-all shadow-md"
                      onClick={() => handlePhotoClick(index)}
                    >
                      <img 
                        src={photo.url} 
                        alt={photo.description} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
                
                <div className="flex justify-center">
                  <button 
                    onClick={handleRefreshPhotos}
                    className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors text-lg"
                  >
                    別の写真を見る
                  </button>
                </div>
              </>
            )}

            {/* タイムライン表示 */}
            {memories.length > 0 && (
              <div className="mt-16">
                <h2 className="text-2xl font-bold mb-6 text-center">思い出タイムライン</h2>
                <div className="space-y-6">
                  {memories.map((memory, index) => {
                    // 年代ごとのグループ化（現在のメモリと前のメモリで年が異なる場合にヘッダーを表示）
                    const showYearHeader = index === 0 || memory.year !== memories[index - 1].year;
                    
                    return (
                      <div key={memory.id}>
                        {showYearHeader && (
                          <div className="sticky top-0 p-3 bg-blue-100 rounded-t-lg text-center border-b border-blue-200 font-bold text-blue-800 text-xl mb-2">
                            {memory.year}年
                          </div>
                        )}
                        
                        <div className="bg-white rounded-lg shadow-md overflow-hidden">
                          <div className="p-4">
                            <h3 className="text-xl font-bold text-gray-800 mb-2">{memory.title}</h3>
                            <div className="w-full h-64 mb-4">
                              <img 
                                src={memory.photoUrl} 
                                alt={memory.photoDescription}
                                className="w-full h-full object-cover rounded-md" 
                              />
                            </div>
                            <p className="text-gray-800 text-lg mb-3">{memory.story}</p>
                            <div className="flex justify-between mt-4">
                              <button className="text-blue-500 hover:text-blue-700 text-lg">編集</button>
                              <button className="text-red-500 hover:text-red-700 text-lg">削除</button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-6 bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center">
              <button 
                onClick={() => setSelectedPhoto(null)}
                className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 transition-colors text-lg"
              >
                ← 戻る
              </button>
              <div className="text-center">
                <span className="text-base text-gray-600">{displayedPhotos[selectedPhoto].description}</span>
              </div>
            </div>

            <div className="w-full h-64 relative border-2 border-gray-300 rounded-md overflow-hidden">
              <img 
                src={displayedPhotos[selectedPhoto].url} 
                alt={displayedPhotos[selectedPhoto].description} 
                className="w-full h-full object-cover"
              />
            </div>

            {!showStoryButton ? (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold mb-2">質問 {currentQuestion + 1}/{questions.length}</h2>
                <p className="mb-4 text-lg font-medium">{questions[currentQuestion].text}</p>
                
                {renderQuestionForm()}
                
                <button
                  onClick={handleCannotRemember}
                  className="w-full p-3 bg-gray-100 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-200 transition-colors mt-4 text-lg"
                >
                  思い出せない（スキップ）
                </button>
                
                <div className="flex justify-between mt-6">
                  <button
                    onClick={handlePrevious}
                    disabled={currentQuestion === 0}
                    className={`px-5 py-3 rounded-md text-lg ${
                      currentQuestion === 0
                        ? 'bg-gray-200 cursor-not-allowed'
                        : 'bg-gray-200 hover:bg-gray-300 transition-colors'
                    }`}
                  >
                    戻る
                  </button>
                  {questions[currentQuestion].id !== 'thoughts' || recordedText || cannotRemember.thoughts ? (
                    <button
                      onClick={handleNext}
                      className="px-5 py-3 rounded-md bg-blue-500 text-white hover:bg-blue-600 transition-colors text-lg"
                    >
                      {currentQuestion === questions.length - 1 ? '完了' : '次へ'}
                    </button>
                  ) : (
                    <button
                      disabled
                      className="px-5 py-3 rounded-md bg-blue-300 text-white cursor-not-allowed text-lg"
                    >
                      録音を完了してください
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold mb-4">すべての質問に回答しました</h2>
                <div className="space-y-3">
                  {questions.map((q) => (
                    <div key={q.id} className="mb-4 p-3 bg-gray-50 rounded-lg">
                      <p className="font-medium text-lg mb-1">{q.text}</p>
                      {cannotRemember[q.id] ? (
                        <p className="text-gray-500 italic">思い出せません</p>
                      ) : q.id === 'thoughts' && recordedText ? (
                        <p className="text-gray-700">録音した内容: {answers[q.id]}</p>
                      ) : (
                        <p className="text-gray-700">{answers[q.id]}</p>
                      )}
                    </div>
                  ))}
                </div>
                <div className="mt-6 space-y-4">
                  <div className="p-4 bg-blue-50 rounded-md">
                    <h3 className="font-medium mb-2 text-lg">ストーリープレビュー：</h3>
                    <p className="text-gray-700 text-lg">{generateStory()}</p>
                  </div>
                  <button
                    onClick={handleGenerateStory}
                    className="w-full py-4 rounded-md bg-blue-500 text-white hover:bg-blue-600 transition-colors text-lg font-medium"
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
