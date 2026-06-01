import React, { useState, useEffect, useCallback } from 'react';
import QuoteCard from './components/QuoteCard';
import FavoritesDrawer from './components/FavoritesDrawer';
import ToastContainer from './components/Toast';
import { fallbackQuotes } from './data/fallbackQuotes';

// Categories mapping to beautiful semantic names
const MOOD_CATEGORIES = ['all', 'wisdom', 'courage', 'success', 'peace', 'joy', 'love'];

export default function App() {
  // Main Quote states
  const [currentQuote, setCurrentQuote] = useState({
    id: 101,
    quote: "The only true wisdom is in knowing you know nothing.",
    author: "Socrates",
    category: "wisdom",
    source: "Offline Library"
  });
  
  const [source, setSource] = useState('Offline Library');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');

  // Interactive Action states
  const [isSpeechPlaying, setIsSpeechPlaying] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem('auraquotes_favorites');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Stackable Toasts states
  const [toasts, setToasts] = useState([]);

  // Trigger Toast Notification helper
  const triggerToast = useCallback((message, type = 'success') => {
    const id = Date.now() + Math.random().toString(36).substr(2, 5);
    setToasts((prev) => [...prev, { id, message, type }]);

    // Auto dismiss after 3.5 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 3500);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  // Text-To-Speech (TTS) cancellation
  const cancelSpeech = useCallback(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setIsSpeechPlaying(false);
  }, []);

  // Hybrid Fetch Quote function
  const fetchNewQuote = useCallback(async (forcedCategory = null) => {
    const targetCategory = forcedCategory !== null ? forcedCategory : activeCategory;

    // Trigger card exit animation
    setIsTransitioning(true);
    cancelSpeech();

    // Small delay to allow exit slide-out animation to complete (350ms)
    await new Promise((resolve) => setTimeout(resolve, 350));

    // Hybrid Delivery Logic:
    // If a specific mood category is selected, we pull from our premium fallback database.
    // This is because standard free quote APIs do not support specific semantic moods reliably
    // and this ensures 100% curation standard.
    // If "all" is selected, we attempt to fetch from the public API.
    if (targetCategory !== 'all') {
      const filtered = fallbackQuotes.filter((q) => q.category === targetCategory);
      if (filtered.length > 0) {
        const randomIndex = Math.floor(Math.random() * filtered.length);
        const quoteObj = filtered[randomIndex];
        setCurrentQuote({
          id: quoteObj.id,
          quote: quoteObj.quote,
          author: quoteObj.author,
          category: quoteObj.category,
          source: 'Offline Library'
        });
        setSource('Offline Library');
      }
      setIsTransitioning(false);
      return;
    }

    // "All" selected: Try public API first
    try {
      const response = await fetch('https://dummyjson.com/quotes/random');
      
      if (!response.ok) {
        throw new Error('API Response not ok');
      }

      const data = await response.json();

      // Randomize an aura category since standard API has generic tags
      const randomCategory = MOOD_CATEGORIES[Math.floor(Math.random() * (MOOD_CATEGORIES.length - 1)) + 1];

      setCurrentQuote({
        id: data.id,
        quote: data.quote,
        author: data.author,
        category: randomCategory, // Map to a beautiful aura mood
        source: 'API'
      });
      setSource('API');

    } catch (error) {
      console.warn("Public API failed or offline. Fallback library engaged:", error);
      
      // Seamlessly fall back to premium offline quotes
      const randomIndex = Math.floor(Math.random() * fallbackQuotes.length);
      const quoteObj = fallbackQuotes[randomIndex];
      
      setCurrentQuote({
        id: quoteObj.id,
        quote: quoteObj.quote,
        author: quoteObj.author,
        category: quoteObj.category,
        source: 'Offline Library'
      });
      setSource('Offline Library');
      triggerToast('Using resilient offline library quotes.', 'info');
    } finally {
      // Trigger card entrance animation
      setIsTransitioning(false);
    }
  }, [activeCategory, cancelSpeech, triggerToast]);

  // Fetch initial quote on mount
  useEffect(() => {
    fetchNewQuote('all');
    
    // Cleanup speech on unmount
    return () => {
      cancelSpeech();
    };
  }, []);

  // Sync favorites list to localStorage
  const updateFavoritesList = (newList) => {
    setFavorites(newList);
    localStorage.setItem('auraquotes_favorites', JSON.stringify(newList));
  };

  // Toggle favorite trigger
  const handleToggleFavorite = () => {
    const isAlreadyFavorited = favorites.some((fav) => fav.quote === currentQuote.quote);

    if (isAlreadyFavorited) {
      const filtered = favorites.filter((fav) => fav.quote !== currentQuote.quote);
      updateFavoritesList(filtered);
      triggerToast('Quote removed from saved shelf.', 'info');
    } else {
      const newFav = {
        id: currentQuote.id || Date.now(),
        quote: currentQuote.quote,
        author: currentQuote.author,
        category: currentQuote.category,
        source: currentQuote.source
      };
      updateFavoritesList([...favorites, newFav]);
      triggerToast('Quote added to saved shelf!', 'success');
    }
  };

  // Remove single favorite from drawer
  const handleRemoveFavorite = (id) => {
    const filtered = favorites.filter((fav) => fav.id !== id);
    updateFavoritesList(filtered);
    triggerToast('Quote deleted from saved shelf.', 'info');
  };

  // Clear all favorites
  const handleClearAllFavorites = () => {
    updateFavoritesList([]);
    triggerToast('All saved quotes cleared.', 'info');
  };

  // Direct load quote from Drawer back into main panel
  const handleLoadQuote = (quoteObj) => {
    cancelSpeech();
    setIsTransitioning(true);

    setTimeout(() => {
      setCurrentQuote({
        id: quoteObj.id,
        quote: quoteObj.quote,
        author: quoteObj.author,
        category: quoteObj.category,
        source: quoteObj.source || 'Offline Library'
      });
      setSource(quoteObj.source || 'Offline Library');
      setIsTransitioning(false);
      triggerToast('Saved quote loaded into view.', 'success');
    }, 350);
  };

  // Web Speech API text-to-speech implementation
  const handleToggleSpeech = () => {
    if (!('speechSynthesis' in window)) {
      triggerToast('Text-to-speech not supported in this browser.', 'info');
      return;
    }

    if (isSpeechPlaying) {
      cancelSpeech();
      return;
    }

    // Cancel any current speaking processes
    window.speechSynthesis.cancel();

    // Prepare speech parameters
    const utterance = new SpeechSynthesisUtterance(currentQuote.quote);
    
    // Append the author for a polished completion
    utterance.text += `. By ${currentQuote.author}`;

    // Elegant voice selection
    const voices = window.speechSynthesis.getVoices();
    // Prefer high quality English voices (Google US English, Apple Samantha, etc.)
    const elegantVoice = voices.find(
      (v) => 
        (v.lang.includes('en-US') || v.lang.includes('en-GB')) && 
        (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Premium'))
    ) || voices.find((v) => v.lang.startsWith('en'));

    if (elegantVoice) {
      utterance.voice = elegantVoice;
    }

    // Calm reading speed for reflective effect
    utterance.rate = 0.92;
    utterance.pitch = 1.0;

    utterance.onend = () => {
      setIsSpeechPlaying(false);
    };

    utterance.onerror = (e) => {
      console.error("Speech synthesis error:", e);
      setIsSpeechPlaying(false);
    };

    window.speechSynthesis.speak(utterance);
    setIsSpeechPlaying(true);
  };

  // Copy to clipboard utility
  const handleCopyText = () => {
    const textToCopy = `"${currentQuote.quote}" — ${currentQuote.author}`;
    navigator.clipboard.writeText(textToCopy)
      .then(() => {
        triggerToast('Quote copied to clipboard!', 'success');
      })
      .catch((err) => {
        console.error('Copy failed:', err);
        triggerToast('Failed to copy quote.', 'error');
      });
  };

  // Tweet quote share
  const handleShareTwitter = () => {
    const tweetText = encodeURIComponent(`"${currentQuote.quote}" — ${currentQuote.author}`);
    const twitterUrl = `https://twitter.com/intent/tweet?text=${tweetText}&hashtags=quotes,inspiration,auraquotes`;
    window.open(twitterUrl, '_blank', 'noopener,noreferrer');
    triggerToast('Opening Twitter to share...', 'info');
  };

  // WhatsApp quote share
  const handleShareWhatsApp = () => {
    const waText = encodeURIComponent(`"${currentQuote.quote}" — ${currentQuote.author}`);
    const waUrl = `https://api.whatsapp.com/send?text=${waText}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
    triggerToast('Opening WhatsApp to share...', 'info');
  };

  // Check if current quote is favorited
  const isFavorited = favorites.some((fav) => fav.quote === currentQuote.quote);

  return (
    <div className={`app-container mood-${currentQuote.category}`}>
      {/* Absolute canvas for color-shifting blurry gradients */}
      <div className="bg-canvas" aria-hidden="true" id="gradient-aura-canvas">
        <div className="aura-blob aura-1" id="aura-blob-left"></div>
        <div className="aura-blob aura-2" id="aura-blob-right"></div>
        <div className="aura-blob aura-3" id="aura-blob-center"></div>
      </div>

      {/* Navigation Header */}
      <header className="app-header" id="app-header-navigation">
        <div className="app-logo" onClick={() => fetchNewQuote('all')} title="Refresh to all">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent-color)" strokeWidth="2.5">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
          </svg>
          AuraQuotes
        </div>

        {/* Saved Shelf Drawer Toggle Button */}
        <button
          className="btn-glass"
          onClick={() => setIsDrawerOpen(true)}
          title="Open saved quotes list"
          id="toggle-drawer-btn"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
            <polyline points="17 21 17 13 7 13 7 21"></polyline>
            <polyline points="7 3 7 8 15 8"></polyline>
          </svg>
          <span>Shelf ({favorites.length})</span>
        </button>
      </header>

      {/* Interactive Main Body */}
      <div className="app-main">
        <QuoteCard
          quote={currentQuote.quote}
          author={currentQuote.author}
          category={currentQuote.category}
          source={source}
          isSpeechPlaying={isSpeechPlaying}
          isFavorited={isFavorited}
          isTransitioning={isTransitioning}
          onNextQuote={() => fetchNewQuote()}
          onToggleFavorite={handleToggleFavorite}
          onToggleSpeech={handleToggleSpeech}
          onCopyText={handleCopyText}
          onShareTwitter={handleShareTwitter}
          onShareWhatsApp={handleShareWhatsApp}
        />
      </div>

      {/* Mood/Category Quick Selection Filter Tray */}
      <nav className="category-filter-tray" aria-label="Quote categories selection" id="category-filter-nav">
        {MOOD_CATEGORIES.map((cat) => (
          <button
            key={cat}
            className={`category-tab ${activeCategory === cat ? 'active-tab' : ''}`}
            onClick={() => {
              setActiveCategory(cat);
              fetchNewQuote(cat);
            }}
            id={`category-tab-${cat}`}
          >
            {cat === 'all' ? 'All Moods' : cat}
          </button>
        ))}
      </nav>

      {/* Accessible Footer */}
      <footer className="app-footer" id="app-footer-credits">
        <span>AuraQuotes © 2026. Made with React & Web APIs.</span>
      </footer>

      {/* Slide-out Favorites Drawer Panel */}
      <FavoritesDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        favorites={favorites}
        removeFavorite={handleRemoveFavorite}
        clearAllFavorites={handleClearAllFavorites}
        loadQuote={handleLoadQuote}
        triggerToast={triggerToast}
      />

      {/* Custom Stackable Toast Popup Alerts */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
}
