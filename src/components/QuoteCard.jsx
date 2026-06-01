import React from 'react';
import AudioVisualizer from './AudioVisualizer';

/**
 * QuoteCard component
 * Displays the current quote with glassmorphic styling, category badge, and interactive tools.
 */
export default function QuoteCard({
  quote = '',
  author = '',
  category = 'wisdom',
  source = 'API',
  isSpeechPlaying = false,
  isFavorited = false,
  isTransitioning = false,
  onNextQuote,
  onToggleFavorite,
  onToggleSpeech,
  onCopyText,
  onShareTwitter,
  onShareWhatsApp
}) {
  return (
    <main className="quote-card glass-panel" id="main-quote-card">
      {/* Decorative large serif quote marks */}
      <span className="quote-mark quote-mark-open" aria-hidden="true">“</span>

      {/* Top Header Section */}
      <div className="card-top">
        {/* Source Badge (API or Offline Fallback) */}
        <span className="source-badge" title={`Quote loaded from ${source}`}>
          <span className="badge-pulse"></span>
          {source} Source
        </span>

        {/* Category Tag */}
        <span className="quote-category-tag" id="quote-category-badge">
          {category}
        </span>
      </div>

      {/* Quote text body */}
      <div className="quote-body-container">
        <blockquote
          className={`quote-text ${isTransitioning ? 'animating-text' : ''}`}
          id="quote-text-content"
        >
          “{quote}”
        </blockquote>
        <cite
          className={`quote-author ${isTransitioning ? 'animating-text' : ''}`}
          id="quote-author-content"
        >
          <span className="author-line"></span>
          {author}
        </cite>
      </div>

      {/* Action Buttons Toolbar */}
      <div className="card-actions">
        {/* Left Side: Interaction Tools */}
        <div className="action-group">
          {/* TTS Speech Trigger */}
          <button
            className={`btn-glass ${isSpeechPlaying ? 'btn-active' : ''}`}
            onClick={onToggleSpeech}
            title={isSpeechPlaying ? 'Stop listening' : 'Listen to quote'}
            aria-label={isSpeechPlaying ? 'Stop reading' : 'Read quote aloud'}
            id="speak-quote-btn"
          >
            {isSpeechPlaying ? (
              // Pause Icon SVG
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
                <rect x="6" y="4" width="4" height="16"></rect>
                <rect x="14" y="4" width="4" height="16"></rect>
              </svg>
            ) : (
              // Speaker Icon SVG
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
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
              </svg>
            )}
            <span>{isSpeechPlaying ? 'Stop' : 'Listen'}</span>
            <AudioVisualizer isPlaying={isSpeechPlaying} />
          </button>

          {/* Favorites Heart Toggle */}
          <button
            className="btn-glass"
            onClick={onToggleFavorite}
            title={isFavorited ? 'Remove from saved' : 'Save to shelf'}
            aria-label={isFavorited ? 'Remove quote from favorites' : 'Save quote to favorites'}
            id="favorite-quote-btn"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill={isFavorited ? 'oklch(0.6 0.18 20)' : 'none'}
              stroke={isFavorited ? 'oklch(0.6 0.18 20)' : 'currentColor'}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ transition: 'fill 0.3s ease, stroke 0.3s ease' }}
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
            <span>{isFavorited ? 'Saved' : 'Save'}</span>
          </button>

          {/* Copy to Clipboard */}
          <button
            className="btn-glass"
            onClick={onCopyText}
            title="Copy quote text"
            aria-label="Copy quote text to clipboard"
            id="copy-quote-btn"
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
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
            <span>Copy</span>
          </button>

          {/* Share Dropdown/Buttons */}
          <button
            className="btn-glass"
            onClick={onShareTwitter}
            title="Share on Twitter"
            aria-label="Share quote on Twitter"
            id="share-twitter-btn"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </button>

          <button
            className="btn-glass"
            onClick={onShareWhatsApp}
            title="Share on WhatsApp"
            aria-label="Share quote on WhatsApp"
            id="share-whatsapp-btn"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
            </svg>
          </button>
        </div>

        {/* Right Side: Refresh Discover Action */}
        <button
          className="btn-glass btn-accent"
          onClick={onNextQuote}
          title="Discover another quote"
          aria-label="Generate a new random quote"
          id="discover-quote-btn"
        >
          <span>Discover Quote</span>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
          </svg>
        </button>
      </div>
    </main>
  );
}
