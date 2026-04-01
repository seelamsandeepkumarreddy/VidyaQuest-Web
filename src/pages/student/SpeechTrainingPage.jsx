import React, { useState, useEffect, useRef } from 'react';
import { api } from '../../utils/api';
import { sessionManager } from '../../utils/session';

const PHONICS_DATA = [
  { alphabet: "Aa", sound: "ऐ", vocabulary: "APPLE", icon: "🍎", ttsText: "ah" },
  { alphabet: "Bb", sound: "ब", vocabulary: "BALL", icon: "⚽", ttsText: "buh" },
  { alphabet: "Cc", sound: "क", vocabulary: "CAT", icon: "🐱", ttsText: "kuh" },
  { alphabet: "Dd", sound: "ड", vocabulary: "DOG", icon: "🐶", ttsText: "duh" },
  { alphabet: "Ee", sound: "ए", vocabulary: "EGG", icon: "🥚", ttsText: "eh" },
  { alphabet: "Ff", sound: "फ", vocabulary: "FISH", icon: "🐟", ttsText: "fuh" },
  { alphabet: "Gg", sound: "ग", vocabulary: "GOAT", icon: "🐐", ttsText: "guh" },
  { alphabet: "Hh", sound: "ह", vocabulary: "HORSE", icon: "🐎", ttsText: "huh" },
  { alphabet: "Ii", sound: "इ", vocabulary: "INKPOT", icon: "🖋️", ttsText: "ee" },
  { alphabet: "Jj", sound: "ज", vocabulary: "JOKER", icon: "🤡", ttsText: "juh" },
  { alphabet: "Kk", sound: "क", vocabulary: "KITE", icon: "🪁", ttsText: "kuh" },
  { alphabet: "Ll", sound: "ल", vocabulary: "LION", icon: "🦁", ttsText: "ull" },
  { alphabet: "Mm", sound: "म", vocabulary: "MANGO", icon: "🥭", ttsText: "mmm" },
  { alphabet: "Nn", sound: "न", vocabulary: "NEST", icon: "🪺", ttsText: "nnn" },
  { alphabet: "Oo", sound: "ओ", vocabulary: "OWL", icon: "🦉", ttsText: "oh" },
  { alphabet: "Pp", sound: "प", vocabulary: "PARROT", icon: "🦜", ttsText: "puh" },
  { alphabet: "Qq", sound: "क्व", vocabulary: "QUILT", icon: "🛏️", ttsText: "kwuh" },
  { alphabet: "Rr", sound: "र", vocabulary: "ROSE", icon: "🌹", ttsText: "rrr" },
  { alphabet: "Ss", sound: "स", vocabulary: "SUN", icon: "☀️", ttsText: "sss" },
  { alphabet: "Tt", sound: "ट", vocabulary: "TIGER", icon: "🐅", ttsText: "tuh" },
  { alphabet: "Uu", sound: "अ", vocabulary: "URN", icon: "🏺", ttsText: "uh" },
  { alphabet: "Vv", sound: "व", vocabulary: "VAN", icon: "🚐", ttsText: "vuh" },
  { alphabet: "Ww", sound: "व", vocabulary: "WATCH", icon: "⌚", ttsText: "wuh" },
  { alphabet: "Xx", sound: "एक्स", vocabulary: "X-MAS TREE", icon: "🎄", ttsText: "ks" },
  { alphabet: "Yy", sound: "य", vocabulary: "YAK", icon: "🐂", ttsText: "yuh" },
  { alphabet: "Zz", sound: "ज़", vocabulary: "ZEBRA", icon: "🦓", ttsText: "zuh" }
];

const CATEGORIES = [
  {
    id: 'phonics', name: 'Phonics', icon: '🔤', color: '#1976D2', bg: '#E3F2FD',
    description: 'Learn letter sounds and vocabulary',
    items: [], isReference: true
  },
  {
    id: 'vowels', name: 'Basic Vowel Sounds', icon: '🔠', color: '#2196F3', bg: '#E3F2FD',
    description: 'Master the five basic vowel sounds',
    items: ["eat eat eat", "ape ape ape", "ice ice ice", "oak oak oak", "use use use", "egg egg egg", "arm arm arm", "up up up"]
  },
  {
    id: 'words', name: 'Simple Words', icon: '💬', color: '#4CAF50', bg: '#E8F5E9',
    description: 'Practice commonly used basic words',
    items: ["Apple", "Banana", "Cat", "Dog", "Elephant", "Fish", "Goat", "Hat"]
  },
  {
    id: 'numbers', name: 'Numbers 1-10', icon: '🔢', color: '#9C27B0', bg: '#F3E5F5',
    description: 'Learn to pronounce numbers correctly',
    items: ["One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten"]
  },
  {
    id: 'tongue_twisters', name: 'Tongue Twisters', icon: '👅', color: '#F44336', bg: '#FFEBEE',
    description: 'Fun challenges to improve speed and clarity',
    items: [
      "She sells seashells by the seashore.",
      "Peter Piper picked a peck of pickled peppers.",
      "I scream, you scream, we all scream for ice cream.",
      "I saw Susie sitting in a shoeshine shop.",
      "How can a clam cram in a clean cream can?"
    ]
  },
  {
    id: 'reading', name: 'Paragraph Reading', icon: '📖', color: '#009688', bg: '#E0F2F1',
    description: 'Read short paragraphs aloud',
    items: [
      "The quick brown fox jumps over the lazy dog.",
      "It was a beautiful sunny day in the village.",
      "Children were playing near the big mango tree.",
      "The birds were singing early in the morning."
    ]
  }
];

// Practice States matching Android enum
const PracticeState = {
  INTRODUCTION: 'intro',
  READY_TO_PRACTICE: 'ready',
  RECORDING: 'recording',
  ANALYZING: 'analyzing',
  RESULT: 'result'
};

const PHONETIC_ALIASES = {
  "eat": ["it", "it", "eet", "eath", "heat"],
  "ape": ["eight", "ap", "ape", "abe", "ep"],
  "ice": ["eyes", "i", "ice", "ase", "is"],
  "oak": ["ok", "oak", "oaks", "oke"],
  "use": ["you", "as", "ues", "us", "uise"],
  "egg": ["ege", "ag", "egg", "eggs", "ig"],
  "arm": ["am", "aam", "arm", "arms", "ahm"],
  "up": ["ap", "up", "ubs", "ab"],
  "apple": ["apul", "apil", "apl"]
};

const evaluateAccuracy = (target, recognized, isVowel = false) => {
  if (!recognized || recognized.toLowerCase().includes("no speech detected")) return 0;
  
  const cleanTarget = target.replace(/[^a-zA-Z0-9\s]/g, "").toLowerCase().trim();
  const cleanRecognized = recognized.replace(/[^a-zA-Z0-9\s]/g, "").toLowerCase().trim();
  
  if (cleanTarget === cleanRecognized) return 100;

  // Handle repetitions (like "eat eat eat")
  const targetWords = cleanTarget.split(/\s+/);
  const recognizedWords = cleanRecognized.split(/\s+/);
  const isRepetition = targetWords.length > 1 && targetWords.every(w => w === targetWords[0]);
  
  const calculateDist = (t, r) => {
    const n = t.length;
    const m = r.length;
    if (n === 0) return 0;
    const dp = Array(n + 1).fill(null).map(() => Array(m + 1).fill(0));
    for (let i = 0; i <= n; i++) dp[i][0] = i;
    for (let j = 0; j <= m; j++) dp[0][j] = j;
    for (let i = 1; i <= n; i++) {
        for (let j = 1; j <= m; j++) {
            const cost = t[i - 1] === r[j - 1] ? 0 : 1;
            dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost);
        }
    }
    return Math.max(0, Math.round((1.0 - (dp[n][m] / Math.max(n, m))) * 100));
  };

  let charAccuracy = calculateDist(cleanTarget, cleanRecognized);
  if (isRepetition) {
    const singleAcc = calculateDist(targetWords[0], cleanRecognized);
    charAccuracy = Math.max(charAccuracy, singleAcc);
  }
  
  // Word Match Bonus with Phonetic Aliasing
  const wordMatches = targetWords.filter(tw => {
    const isDirectMatch = recognizedWords.includes(tw);
    if (isDirectMatch) return true;
    
    // Check aliases if it's a vowel sound
    const aliases = PHONETIC_ALIASES[tw] || [];
    return recognizedWords.some(rw => aliases.includes(rw));
  }).length;
  
  const wordScore = targetWords.length === 0 ? 0 : (wordMatches / targetWords.length * 100);
  
  // Final score weighted average (Strict for words, Lenient for Vowels 50/50)
  const charWeight = isVowel ? 0.5 : 0.7;
  const wordWeight = isVowel ? 0.5 : 0.3;
  
  const finalScore = Math.round((charAccuracy * charWeight) + (wordScore * wordWeight));
  return Math.min(100, Math.max(0, finalScore));
};

const SpeechTrainingPage = () => {
  const [view, setView] = useState('landing'); // landing, exercises, practice
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [practiceStep, setPracticeStep] = useState(PracticeState.INTRODUCTION);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [recognizedText, setRecognizedText] = useState("");
  const [interimTranscript, setInterimTranscript] = useState("");
  const [accuracy, setAccuracy] = useState(0);
  const [sessionAccuracies, setSessionAccuracies] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [stats, setStats] = useState([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const userId = sessionManager.getUserId();

  // Refs for stable state access in callbacks
  const categoryRef = useRef(selectedCategory);
  const indexRef = useRef(currentIndex);
  const resultReceivedRef = useRef(false);
  const analyzeTimeoutRef = useRef(null);

  useEffect(() => {
    categoryRef.current = selectedCategory;
    indexRef.current = currentIndex;
  }, [selectedCategory, currentIndex]);

  // Speech Recognition Ref
  const recognitionRef = useRef(null);

  useEffect(() => {
    fetchStats();
    // Initialize Web Speech API
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-IN'; // Optimized for Indian English accents
      recognition.interimResults = true;
      recognition.maxAlternatives = 10;

      recognition.onresult = (event) => {
        let interimText = "";
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            resultReceivedRef.current = true;
            const alternatives = event.results[i];
            
            // Best-Path logic
            let bestAcc = -1;
            let bestTranscript = "";
            const targetWord = categoryRef.current.items[indexRef.current];
            const isVowel = categoryRef.current.id === 'vowels';

            for (let j = 0; j < alternatives.length; j++) {
              const transcript = alternatives[j].transcript;
              const currentAcc = evaluateAccuracy(targetWord, transcript, isVowel);
              if (currentAcc > bestAcc) {
                bestAcc = currentAcc;
                bestTranscript = transcript;
              }
            }
            processRecognitionResultWithData(bestTranscript, bestAcc);
          } else {
            interimText += event.results[i][0].transcript;
          }
        }
        if (interimText) setInterimTranscript(interimText.toLowerCase());
      };

      recognition.onerror = (event) => {
        resultReceivedRef.current = true;
        console.error('Speech recognition error:', event.error);
        if (event.error === 'not-allowed') {
          alert("Microphone access is blocked. Please allow microphone permissions in your browser settings to practice speaking.");
          setPracticeStep(PracticeState.READY_TO_PRACTICE);
        } else {
          processRecognitionResultWithData("No speech detected", 0);
        }
      };

      recognition.onend = () => {
        // If we stopped but never got a result/error, fallback
        if (!resultReceivedRef.current && (practiceStep === PracticeState.RECORDING || practiceStep === PracticeState.ANALYZING)) {
          processRecognitionResultWithData("No speech detected", 0);
        }
      };

      recognitionRef.current = recognition;
    }
    return () => {
      if (recognitionRef.current) recognitionRef.current.abort();
    };
  }, []);

  const fetchStats = async () => {
    try {
      const data = await api.getSpeechStats(userId);
      if (Array.isArray(data)) setStats(data);
    } catch (err) {
      console.log('Speech stats not available yet');
    }
  };

  const speak = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.85;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const startPractice = (category) => {
    setSelectedCategory(category);
    if (category.isReference) {
      setView('practice'); // Phonics view
    } else {
      setCurrentIndex(0);
      setSessionAccuracies([]);
      setPracticeStep(PracticeState.INTRODUCTION);
      setView('practice');
    }
  };

  const startRecording = () => {
    if (recognitionRef.current) {
      setPracticeStep(PracticeState.RECORDING);
      setRecognizedText("");
      setInterimTranscript("");
      resultReceivedRef.current = false;
      
      // Update handlers
      recognitionRef.current.onresult = (event) => {
        let interimText = "";
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            resultReceivedRef.current = true;
            const alternatives = event.results[i];
            
            // Best-Path: calculate accuracy for each alternative and pick the best one
            let bestAcc = -1;
            let bestTranscript = "";
            const targetWord = categoryRef.current.items[indexRef.current];
            const isVowel = categoryRef.current.id === 'vowels';

            for (let j = 0; j < alternatives.length; j++) {
              const transcript = alternatives[j].transcript;
              const currentAcc = evaluateAccuracy(targetWord, transcript, isVowel);
              if (currentAcc > bestAcc) {
                bestAcc = currentAcc;
                bestTranscript = transcript;
              }
            }
            processRecognitionResultWithData(bestTranscript, bestAcc);
          } else {
            interimText += event.results[i][0].transcript;
          }
        }
        if (interimText) setInterimTranscript(interimText.toLowerCase());
      };

      recognitionRef.current.onerror = (event) => {
        resultReceivedRef.current = true;
        if (event.error === 'not-allowed') {
          alert("Microphone access is blocked. Please allow microphone permissions in your browser settings to practice speaking.");
          setPracticeStep(PracticeState.READY_TO_PRACTICE);
        } else {
          processRecognitionResultWithData("No speech detected", 0);
        }
      };

      // Proactively check/request permission using MediaDevices API if supported
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ audio: true })
          .then(() => {
            try {
              recognitionRef.current.start();
            } catch (err) {
              console.error('Failed to start recognition:', err);
            }
          })
          .catch((err) => {
            console.error('Microphone permission denied:', err);
            alert("Microphone permission was denied. Please enable it in your browser to continue.");
            setPracticeStep(PracticeState.READY_TO_PRACTICE);
          });
      } else {
        // Fallback for older browsers
        try {
          recognitionRef.current.start();
        } catch (err) {
          console.error('Failed to start recognition:', err);
        }
      }
    } else {
      alert("Speech recognition is not supported in this browser.");
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setPracticeStep(PracticeState.ANALYZING);
    }
  };

  const processRecognitionResultWithData = (transcript, finalAcc) => {
    // Prevent multiple calls
    if (practiceStep === PracticeState.RESULT) return;

    setPracticeStep(PracticeState.ANALYZING);
    
    // Clear timeout
    if (analyzeTimeoutRef.current) clearTimeout(analyzeTimeoutRef.current);

    setTimeout(() => {
      setRecognizedText(transcript);
      setAccuracy(finalAcc);
      if (finalAcc > 0) setSessionAccuracies(prev => [...prev, finalAcc]);
      setPracticeStep(PracticeState.RESULT);
    }, 1200);
  };

  const handleNextWord = () => {
    const nextIdx = currentIndex + 1;
    if (nextIdx < selectedCategory.items.length) {
      setCurrentIndex(nextIdx);
      setPracticeStep(PracticeState.INTRODUCTION);
      setRecognizedText("");
      setInterimTranscript("");
      setAccuracy(0);
    } else {
      saveProgressAndExit();
    }
  };

  const saveProgressAndExit = async () => {
    setIsSaving(true);
    const avgAccuracy = sessionAccuracies.length > 0 
      ? Math.round(sessionAccuracies.reduce((a, b) => a + b, 0) / sessionAccuracies.length) 
      : 0;

    try {
      await api.saveSpeechProgress({
        user_id: userId,
        category: selectedCategory.name,
        accuracy: avgAccuracy,
        words_count: selectedCategory.items.length
      });
      await fetchStats();
    } catch (err) {
      console.error('Failed to save progress:', err);
    } finally {
      setIsSaving(false);
      setView('exercises');
    }
  };

  // LANDING VIEW
  if (view === 'landing') {
    return (
      <div className="speech-page animate-fade">
        <div className="speech-hero vq-card">
          <div className="speech-hero-content">
            <h2>Master Your<br/>Pronunciation</h2>
            <p>Improve your English fluency with our AI-powered speech training modules. Practice sounds, words, and sentences in real-time.</p>
            <button className="vq-button btn-primary" onClick={() => setView('exercises')}>
              Get Started
            </button>
          </div>
          <div className="speech-hero-icon">🎙️</div>
        </div>

        <div className="speech-tips-section">
          <h3>Training Tips</h3>
          <p className="text-secondary">Follow these tips for effective speech rehearsal practice</p>
          <div className="tips-grid">
            {[
              { icon: '🎧', title: 'Practice in a Quiet Place', desc: 'Find a calm environment for better voice analysis.' },
              { icon: '🎙️', title: 'Use Good Microphone', desc: 'Ensure your device microphone is clear.' },
              { icon: '🕒', title: 'Practice Daily', desc: 'Consistent 10-15 minute sessions are most effective.' },
              { icon: '👂', title: 'Listen Carefully', desc: 'Pay attention to examples before speaking.' }
            ].map((tip, i) => (
              <div key={i} className="vq-card tip-card animate-fade" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="tip-icon">{tip.icon}</div>
                <h4>{tip.title}</h4>
                <p>{tip.desc}</p>
              </div>
            ))}
          </div>
        </div>
        <style>{speechStyles}</style>
      </div>
    );
  }

  // EXERCISES SELECTOR
  if (view === 'exercises') {
    return (
      <div className="speech-page animate-fade">
        <div className="speech-nav-bar">
          <button className="back-btn-speech" onClick={() => setView('landing')}>← Back</button>
          <h2>Speech Training</h2>
        </div>
        <p className="sub-header-text">Choose an exercise to practice. AI will analyze your pronunciation in real-time.</p>

        <div className="categories-grid">
          {CATEGORIES.map((cat, i) => {
            const catStat = stats.find(s => s.category === cat.name);
            return (
              <div 
                key={cat.id} 
                className="vq-card category-card animate-fade" 
                style={{ animationDelay: `${i * 0.08}s` }}
                onClick={() => startPractice(cat)}
              >
                <div className="cat-icon-box" style={{ background: cat.bg, color: cat.color }}>{cat.icon}</div>
                <h4>{cat.name}</h4>
                <p className="cat-accuracy" style={{ color: cat.color }}>Avg Accuracy: {catStat ? catStat.avg_accuracy : 0}%</p>
                <p className="cat-words">Words Practiced: {catStat ? catStat.total_words : 0}</p>
                <button className="start-btn-sm" style={{ background: cat.color }}>Start</button>
              </div>
            );
          })}
        </div>
        <style>{speechStyles}</style>
      </div>
    );
  }

  // PRACTICE / REFERENCE VIEW
  if (view === 'practice' && selectedCategory) {
    
    // PHONICS REFERENCE VIEW (Matching Android PhonicsContent)
    if (selectedCategory.id === 'phonics') {
      return (
        <div className="speech-page animate-fade">
          <div className="speech-nav-bar">
            <button className="back-btn-speech" onClick={() => setView('exercises')}>← Back</button>
            <h2>Phonics</h2>
          </div>

          <div className="phonics-table vq-card">
            <div className="phonics-header">
              <span className="col-letter">Letter</span>
              <span className="col-sound">Sound</span>
              <span className="col-word">Word</span>
            </div>
            <div className="phonics-list-scroll">
              {PHONICS_DATA.map((item, idx) => (
                <div key={idx} className="phonics-row">
                  <span className="col-letter clickable" onClick={() => speak(item.ttsText)}>{item.alphabet}</span>
                  <span className="col-sound">{item.sound}</span>
                  <div className="col-word clickable" onClick={() => speak(item.vocabulary)}>
                    <span className="item-voc">{item.vocabulary}</span>
                    <span className="item-icon">{item.icon}</span>
                    <span className="item-speaker">🔊</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <style>{speechStyles}</style>
        </div>
      );
    }

    // MULTI-STEP PRACTICE FLOW (INTRO -> READY -> RECORDING -> ANALYZING -> RESULT)
    const currentWord = selectedCategory.items && selectedCategory.items[currentIndex] ? selectedCategory.items[currentIndex] : "";

    return (
      <div className="speech-page animate-fade">
        {/* Practice Header & Progress */}
        <div className="practice-header-container">
           <div className="header-row">
              <button className="back-btn-speech-mini" onClick={() => setView('exercises')}>←</button>
              <h3>{selectedCategory.name}</h3>
              <div className="empty-spacer"></div>
           </div>
           <div className="progress-section">
              <div className="progress-labels">
                 <span>{currentIndex + 1} / {selectedCategory.items ? selectedCategory.items.length : 0}</span>
                 <span>{selectedCategory.items ? Math.round(((currentIndex + 1) / selectedCategory.items.length) * 100) : 0}%</span>
              </div>
              <div className="progress-bar-wrap">
                 <div className="progress-bar-fill" style={{ width: `${selectedCategory.items ? ((currentIndex + 1) / selectedCategory.items.length) * 100 : 0}%` }}></div>
              </div>
           </div>
        </div>

        <div className="practice-card-box vq-card animate-scale-up">
           {practiceStep === PracticeState.INTRODUCTION && (
             <div className="step-content intro-step">
                <div className="step-icon-lg mic-bg">🎙️</div>
                <h2>Ready to Practice?</h2>
                <p>You'll see a word or phrase. Listen to the example, then record yourself saying it. Our AI will analyze your pronunciation and give you feedback.</p>
                <button className="vq-button btn-primary" onClick={() => setPracticeStep(PracticeState.READY_TO_PRACTICE)}>Let's Begin</button>
             </div>
           )}

           {practiceStep === PracticeState.READY_TO_PRACTICE && (
             <div className="step-content practice-step">
                <span className="label-top">Practice this:</span>
                <h1 className="word-display">{currentWord}</h1>
                <button className="play-btn" onClick={() => speak(currentWord)}>
                   🔊 Play Example
                </button>
                <div className="record-box-trigger" onClick={startRecording}>
                   <div className="mic-circle">🎙️</div>
                   <span>Tap to Record</span>
                </div>
                <p className="mic-hint">Speak clearly into your device's microphone</p>
             </div>
           )}

           {practiceStep === PracticeState.RECORDING && (
              <div className="step-content recording-step">
                 <span className="label-top">Practice this:</span>
                 <h1 className="word-display">{currentWord}</h1>
                 <button className="play-btn" onClick={() => speak(currentWord)}>🔊 Play Example</button>
                 <div className="listening-indicator">
                    <div className="mic-circle-red animate-pulse-red">🎙️</div>
                    <span className="interim-text">{interimTranscript || "Listening..."}</span>
                    <div className="waveform">
                       <div className="wave-bar animate-wave-1"></div>
                       <div className="wave-bar animate-wave-2"></div>
                       <div className="wave-bar animate-wave-3"></div>
                       <div className="wave-bar animate-wave-2"></div>
                       <div className="wave-bar animate-wave-1"></div>
                    </div>
                 </div>
                 <div className="stop-btn-wrap">
                   <button className="stop-btn" onClick={stopRecording}>Stop & Finish</button>
                 </div>
              </div>
           )}

           {practiceStep === PracticeState.ANALYZING && (
              <div className="step-content analyzing-step">
                 <div className="spinner-large"></div>
                 <h2>Analyzing...</h2>
                 <p>AI is evaluating your pronunciation</p>
              </div>
           )}

           {practiceStep === PracticeState.RESULT && (
              <div className="step-content result-step">
                 <div className={`success-icon ${accuracy < 50 ? 'icon-low' : accuracy < 80 ? 'icon-med' : 'icon-high'}`}>
                    {accuracy >= 80 ? '✅' : accuracy >= 50 ? '👍' : '❌'}
                 </div>
                 <h2 className="acc-title" style={{ color: accuracy >= 80 ? '#4CAF50' : accuracy >= 50 ? '#FF9800' : '#F44336' }}>
                    Accuracy: {accuracy}%
                 </h2>
                 <p className="recognized-text">You Said: <span className="highlight-text">{recognizedText || "..."}</span></p>
                 
                 {accuracy < 50 && recognizedText !== "No speech detected" && <p className="acc-hint">Try speaking more clearly or matching the example playback.</p>}
                 {recognizedText === "No speech detected" && <p className="acc-hint text-red">We couldn't hear you. Please check your microphone.</p>}

                 <div className="btn-group-vertical">
                    <button className="btn-next" onClick={handleNextWord}>
                       {selectedCategory.items && currentIndex < selectedCategory.items.length - 1 ? 'Next Word →' : 'Finish Session 🏁'}
                    </button>
                    <button className="btn-retry" onClick={() => setPracticeStep(PracticeState.READY_TO_PRACTICE)}>Try Again</button>
                 </div>
              </div>
           )}
        </div>

        {isSaving && (
          <div className="loading-overlay">
            <div className="spinner"></div>
            <p>Saving Progress...</p>
          </div>
        )}
        <style>{speechStyles}</style>
      </div>
    );
  }

  return null;
};

const speechStyles = `
  .speech-page { padding-bottom: 40px; max-width: 1000px; margin: 0 auto; }
  
  .speech-hero {
    background: linear-gradient(135deg, #1976D2, #1565C0);
    color: white;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 60px 48px;
    border: none;
    margin-bottom: 40px;
    border-radius: 40px;
  }
  .speech-hero h2 { font-size: 36px; font-weight: 800; margin: 0 0 16px; line-height: 1.2; text-align: left; }
  .speech-hero p { font-size: 16px; opacity: 0.9; margin: 0 0 32px; max-width: 500px; text-align: left; }
  .speech-hero .vq-button { background: white; color: #1976D2; border-radius: 16px; font-weight: 800; width: fit-content; padding: 16px 32px; }
  .speech-hero-icon { font-size: 100px; }

  .speech-tips-section h3 { font-size: 24px; font-weight: 800; margin-bottom: 4px; }
  .speech-tips-section .text-secondary { margin-bottom: 24px; font-size: 14px; }

  .tips-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
  .tip-card { padding: 24px; text-align: center; border-radius: 24px; transition: transform 0.2s; }
  .tip-icon { font-size: 32px; margin-bottom: 12px; }
  .tip-card h4 { font-size: 16px; font-weight: 800; margin-bottom: 8px; }
  .tip-card p { margin: 0; font-size: 12px; line-height: 1.4; color: var(--text-secondary); }

  .speech-nav-bar { display: flex; align-items: center; gap: 16px; margin-bottom: 8px; }
  .speech-nav-bar h2 { margin: 0; font-size: 28px; font-weight: 800; }
  .back-btn-speech { background: white; border: 1px solid #e2e8f0; border-radius: 12px; padding: 10px 16px; cursor: pointer; font-weight: 700; }
  .sub-header-text { margin: 0 0 32px; color: var(--text-secondary); font-size: 15px; }

  .categories-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 24px; }
  .category-card { padding: 24px; text-align: center; border-radius: 32px; cursor: pointer; transition: transform 0.2s; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
  .category-card:hover { transform: translateY(-5px); }
  .cat-icon-box { width: 72px; height: 72px; border-radius: 20px; display: flex; align-items: center; justify-content: center; font-size: 32px; margin: 0 auto 20px; }
  .category-card h4 { font-size: 20px; font-weight: 800; margin: 0 0 12px; }
  .cat-accuracy { font-size: 14px; font-weight: 800; margin-bottom: 4px; }
  .cat-words { font-size: 14px; color: var(--text-secondary); margin-bottom: 20px; }
  .start-btn-sm { color: white; padding: 12px 32px; border-radius: 12px; border: none; font-weight: 800; cursor: pointer; }

  /* Phonics View */
  .phonics-table { padding: 0; overflow: hidden; border-radius: 24px; }
  .phonics-header { display: flex; padding: 16px 32px; background: #f8fafc; border-bottom: 1px solid #e2e8f0; font-weight: 800; color: #1976D2; }
  .col-letter { width: 100px; }
  .col-sound { width: 120px; color: #64748b; }
  .col-word { flex: 1; color: #64748b; display: flex; align-items: center; gap: 8px; }
  .phonics-list-scroll { max-height: 600px; overflow-y: auto; }
  .phonics-row { display: flex; padding: 16px 32px; border-bottom: 1px solid #f1f5f9; align-items: center; }
  .phonics-row:last-child { border: none; }
  .phonics-row .col-letter { font-size: 20px; font-weight: 800; color: #1976D2; }
  .phonics-row .col-sound { font-size: 18px; color: var(--text-main); font-weight: 500; }
  .item-voc { font-size: 18px; font-weight: 700; color: var(--text-main); }
  .item-icon { font-size: 20px; }
  .item-speaker { font-size: 14px; opacity: 0.5; }
  .clickable { cursor: pointer; transition: opacity 0.2s; }
  .clickable:hover { opacity: 0.7; }

  /* Practice UI (Process Sync) */
  .practice-header-container { margin-bottom: 32px; }
  .header-row { display: flex; align-items: center; gap: 16px; margin-bottom: 24px; }
  .header-row h3 { margin: 0; font-size: 22px; font-weight: 800; flex: 1; text-align: center; }
  .back-btn-speech-mini { border: 1px solid #e2e8f0; background: white; width: 44px; height: 44px; border-radius: 50%; cursor: pointer; font-size: 18px; font-weight: 800; }
  .empty-spacer { width: 44px; }

  .progress-section { }
  .progress-labels { display: flex; justify-content: space-between; margin-bottom: 8px; font-weight: 800; font-size: 14px; color: #1976D2; }
  .progress-bar-wrap { height: 8px; background: #e2e8f0; border-radius: 4px; overflow: hidden; }
  .progress-bar-fill { height: 100%; background: #1976D2; transition: width 0.3s; }

  .practice-card-box { padding: 48px; border-radius: 40px; min-height: 400px; display: flex; align-items: center; justify-content: center; text-align: center; }
  .step-content { width: 100%; display: flex; flex-direction: column; align-items: center; }
  .step-icon-lg { width: 100px; height: 100px; border-radius: 50%; font-size: 50px; display: flex; align-items: center; justify-content: center; margin-bottom: 24px; }
  .mic-bg { background: #E3F2FD; color: #1976D2; }
  .step-content h2 { font-size: 32px; font-weight: 800; margin-bottom: 16px; }
  .step-content p { color: var(--text-secondary); max-width: 500px; line-height: 1.6; font-size: 16px; }

  .label-top { color: var(--text-secondary); font-size: 14px; margin-bottom: 16px; }
  .word-display { font-size: 56px; font-weight: 800; margin: 0 0 24px; line-height: 1.2; }
  .play-btn { background: none; border: none; color: #1976D2; font-size: 18px; font-weight: 800; cursor: pointer; margin-bottom: 40px; display: flex; align-items: center; gap: 8px; }
  
  .record-box-trigger { width: 100%; max-width: 380px; height: 180px; background: #FF5252; color: white; border-radius: 32px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 12px; cursor: pointer; transition: transform 0.2s; box-shadow: 0 8px 24px rgba(255,82,82,0.3); }
  .record-box-trigger:active { transform: scale(0.98); }
  .mic-circle { font-size: 44px; }
  .record-box-trigger span { font-size: 22px; font-weight: 800; }
  .mic-hint { font-size: 12px; color: var(--text-secondary); margin-top: 16px; }

  .mic-circle-red { width: 64px; height: 64px; background: #FFEBEE; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 28px; margin-bottom: 12px; }
  .listening-indicator { display: flex; flex-direction: column; align-items: center; margin-bottom: 40px; min-height: 120px; }
  .listening-indicator .interim-text { font-size: 22px; font-weight: 800; color: #FF5252; margin-bottom: 16px; min-height: 32px; text-transform: lowercase; }
  .waveform { display: flex; gap: 4px; height: 32px; align-items: center; }
  .wave-bar { width: 4px; background: #1976D2; border-radius: 2px; }
  
  .animate-wave-1 { animation: wave 0.6s infinite ease-in-out; }
  .animate-wave-2 { animation: wave 0.8s infinite ease-in-out; }
  .animate-wave-3 { animation: wave 0.7s infinite ease-in-out; }
  @keyframes wave { 0%, 100% { height: 8px; } 50% { height: 28px; } }
  
  .animate-pulse-red { animation: pulse-red 1.5s infinite; }
  @keyframes pulse-red { 0% { box-shadow: 0 0 0 0 rgba(255, 82, 82, 0.4); } 70% { box-shadow: 0 0 0 20px rgba(255, 82, 82, 0); } 100% { box-shadow: 0 0 0 0 rgba(255, 82, 82, 0); } }

  .stop-btn { background: #FF5252; color: white; padding: 16px 60px; border-radius: 16px; border: none; font-size: 18px; font-weight: 800; cursor: pointer; }

  .spinner-large { width: 80px; height: 80px; border: 8px solid #E3F2FD; border-top: 8px solid #1976D2; border-radius: 50%; animation: spin 1s linear infinite; margin-bottom: 32px; }
  @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }

  .success-icon { width: 100px; height: 100px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 40px; margin-bottom: 24px; }
  .icon-high { background: #E8F5E9; color: #4CAF50; }
  .icon-med { background: #FFF3E0; color: #FF9800; }
  .icon-low { background: #FFEBEE; color: #F44336; }
  
  .acc-title { font-size: 44px; font-weight: 900; margin: 0 0 12px; }
  .recognized-text { font-size: 18px; color: var(--text-secondary); margin-bottom: 8px; }
  .highlight-text { color: var(--text-main); font-weight: 800; }
  .acc-hint { font-size: 14px; color: var(--text-secondary); margin-bottom: 32px; max-width: 300px; }
  .text-red { color: #F44336; font-weight: 600; }

  .btn-group-vertical { display: flex; flex-direction: column; gap: 16px; width: 100%; max-width: 400px; }
  .btn-next { background: #673AB7; color: white; padding: 16px; border-radius: 16px; border: none; font-size: 18px; font-weight: 800; cursor: pointer; }
  .btn-retry { background: none; border: 2px solid #673AB7; color: #673AB7; padding: 16px; border-radius: 16px; font-size: 18px; font-weight: 800; cursor: pointer; }

  .loading-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; flex-direction: column; align-items: center; justify-content: center; color: white; z-index: 1000; }

  @media (max-width: 768px) {
     .speech-hero { padding: 32px; border-radius: 24px; flex-direction: column; text-align: center; }
     .speech-hero h2 { text-align: center; font-size: 28px; }
     .speech-hero-icon { display: none; }
     .tips-grid { grid-template-columns: repeat(2, 1fr); }
     .categories-grid { grid-template-columns: 1fr; }
     .word-display { font-size: 36px; }
     .practice-card-box { padding: 24px; border-radius: 24px; }
  }
`;

export default SpeechTrainingPage;
