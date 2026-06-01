import React, { useState } from 'react';

/**
 * FavoritesDrawer component
 * A sliding drawer overlay displaying saved quotes from localStorage.
 * Offers search filtering, quick loading, tweeting, and deleting.
 */
export default function FavoritesDrawer({
  isOpen = false,
  onClose,
  favorites = [],
  removeFavorite,
  clearAllFavorites,
  loadQuote,
  triggerToast
}) {
  const [searchQuery, setSearchQuery] = useState('');

  // Filter favorites based on search query (checks text & author)
  const filteredFavorites = favorites.filter((fav) => {
    const text = fav.quote.toLowerCase();
    const author = fav.author.toLowerCase();
    const query = searchQuery.toLowerCase();
    return text.includes(query) || author.includes(query);
  });

  const handleShareTweet = (e, quote, author) => {
    e.stopPropagation(); // Avoid loading the quote when sharing
    const tweetText = encodeURIComponent(`"${quote}" — ${author}`);
    const twitterUrl = `https://twitter.com/intent/tweet?text=${tweetText}&hashtags=quotes,inspiration,auraquotes`;
    window.open(twitterUrl, '_blank', 'noopener,noreferrer');
    triggerToast('Opening Twitter to share quote...', 'info');
  };

  const handleCardClick = (quoteObj) => {
    loadQuote(quoteObj);
    onClose(); // Close drawer on selection
  };

  return (
    <>
      {/* Background dimmer overlay */}
      <div 
        className={`drawer-overlay ${isOpen ? 'drawer-open' : ''}`} 
        onClick={onClose}
        id="favorites-drawer-overlay"
      >
        {/* Drawer container */}
        <div 
          className="favorites-drawer" 
          onClick={(e) => e.stopPropagation()} // Stop click bubbling
          id="favorites-drawer-panel"
        >
          {/* Header */}
          <div className="drawer-header">
            <h2 className="drawer-title" id="drawer-headline">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
                stroke="currentColor"
                strokeWidth="1"
                style={{ color: 'var(--accent-color)' }}
              >
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
              Saved Quotes ({favorites.length})
            </h2>
            <button 
              className="btn-icon-close" 
              onClick={onClose} 
              aria-label="Close drawer"
              id="close-drawer-btn"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          {/* Search bar */}
          {favorites.length > 0 && (
            <div className="drawer-search-container">
              <input
                type="text"
                placeholder="Search by keyword or author..."
                className="drawer-search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search saved quotes"
                id="search-favorites-input"
              />
            </div>
          )}

          {/* Quotes list */}
          <div className="drawer-content" id="drawer-favorites-list">
            {favorites.length === 0 ? (
              <div className="drawer-empty-state">
                <svg
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="var(--text-muted)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
                <p>Your saved shelf is empty.</p>
                <p style={{ fontSize: '12px', opacity: 0.7 }}>Heart some quotes to store them here!</p>
              </div>
            ) : filteredFavorites.length === 0 ? (
              <div className="drawer-empty-state">
                <p>No matches found for "{searchQuery}"</p>
              </div>
            ) : (
              filteredFavorites.map((fav) => (
                <div
                  key={fav.id}
                  className="favorite-item-card"
                  onClick={() => handleCardClick(fav)}
                  title="Click to load quote"
                >
                  <p className="fav-item-quote">“{fav.quote}”</p>
                  <div className="fav-item-footer">
                    <span className="fav-item-author">
                      <span style={{ opacity: 0.5, marginRight: '4px' }}>—</span> {fav.author}
                    </span>
                    <div className="fav-item-actions">
                      {/* Tweet Share */}
                      <button
                        className="btn-drawer-action"
                        onClick={(e) => handleShareTweet(e, fav.quote, fav.author)}
                        title="Tweet quote"
                        aria-label="Tweet quote"
                      >
                        <svg
                          width="13"
                          height="13"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                        </svg>
                      </button>

                      {/* Delete Favorite */}
                      <button
                        className="btn-drawer-action btn-drawer-delete"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFavorite(fav.id);
                        }}
                        title="Delete from saved"
                        aria-label="Delete quote"
                      >
                        <svg
                          width="13"
                          height="13"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="3 6 5 6 21 6"></polyline>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Actions */}
          {favorites.length > 0 && (
            <div className="drawer-footer">
              <button
                className="btn-glass"
                style={{ width: '100%', justifyContent: 'center' }}
                onClick={() => {
                  if (window.confirm('Are you sure you want to clear all saved quotes?')) {
                    clearAllFavorites();
                  }
                }}
                id="clear-all-drawer-btn"
              >
                Clear Saved shelf
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
