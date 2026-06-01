import React from 'react';

/**
 * AudioVisualizer component
 * Renders an elegant set of bouncing bars that visualizes text-to-speech audio playback.
 * 
 * @param {Object} props
 * @param {boolean} props.isPlaying - Whether the audio is currently playing
 */
export default function AudioVisualizer({ isPlaying = false }) {
  if (!isPlaying) return null;

  return (
    <div className="voice-wave" aria-hidden="true" title="Reading aloud">
      <div className="voice-bar" style={{ height: '60%' }}></div>
      <div className="voice-bar" style={{ height: '40%' }}></div>
      <div className="voice-bar" style={{ height: '80%' }}></div>
      <div className="voice-bar" style={{ height: '50%' }}></div>
    </div>
  );
}
