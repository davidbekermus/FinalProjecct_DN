import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../Css/NotFound.css';

const NotFound = () => {
  const [audio, setAudio] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    // Try to load the audio file first
    const audioFile = new Audio('/404-sound.mp3');
    
    audioFile.addEventListener('canplaythrough', () => {
      setAudio(audioFile);
    });
    
    audioFile.addEventListener('error', () => {
      // If audio file fails to load, create a fallback sound
      console.log('Audio file not found, creating fallback sound...');
      createFallbackSound();
    });

    // Cleanup function
    return () => {
      if (audioFile) {
        audioFile.pause();
        audioFile.currentTime = 0;
      }
    };
  }, []);

  const createFallbackSound = () => {
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      // Create a long error sound (5 seconds)
      oscillator.frequency.setValueAtTime(200, audioContext.currentTime); // Low frequency
      oscillator.frequency.setValueAtTime(150, audioContext.currentTime + 1); // Lower
      oscillator.frequency.setValueAtTime(100, audioContext.currentTime + 2); // Even lower
      oscillator.frequency.setValueAtTime(80, audioContext.currentTime + 3); // Very low
      oscillator.frequency.setValueAtTime(60, audioContext.currentTime + 4); // Lowest
      
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime); // Start quiet
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime + 0.5); // Increase
      gainNode.gain.setValueAtTime(0.2, audioContext.currentTime + 3); // Decrease
      gainNode.gain.setValueAtTime(0, audioContext.currentTime + 5); // Fade out
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 5);
      
      setIsPlaying(true);
      setTimeout(() => setIsPlaying(false), 5000);
      
    } catch (error) {
      console.log('Web Audio API not supported:', error);
    }
  };

  useEffect(() => {
    // Play the long sound when component mounts
    const playSound = async () => {
      if (!audio) return;
      
      try {
        audio.volume = 0.3; // Set volume to 30%
        audio.loop = false; // Don't loop the sound
        await audio.play();
        setIsPlaying(true);
        
        // Stop playing after 5 seconds
        setTimeout(() => {
          audio.pause();
          audio.currentTime = 0;
          setIsPlaying(false);
        }, 5000);
      } catch (error) {
        console.log('Audio playback failed:', error);
        // Fallback to generated sound
        createFallbackSound();
      }
    };

    if (audio) {
      playSound();
    } else {
      // If no audio file loaded, use fallback
      setTimeout(createFallbackSound, 1000);
    }

    // Cleanup function
    return () => {
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
    };
  }, [audio]);

  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <div className="error-code">404</div>
        <h1 className="error-title">Oops! Page Not Found</h1>
        <p className="error-message">
          The page you're looking for seems to have taken a detour.
          <br />
          Maybe it's waiting at a different bus stop?
        </p>
        
        <div className="sound-indicator">
          {isPlaying ? (
            <span className="playing-indicator">🔊 Playing error sound...</span>
          ) : (
            <span className="stopped-indicator">🔇 Sound finished</span>
          )}
        </div>

        <div className="action-buttons">
          <Link to="/" className="home-button">
            🏠 Go Home
          </Link>
          <Link to="/plan-journey" className="plan-button">
            🚌 Plan Journey
          </Link>
        </div>

        <div className="fun-fact">
          <p>💡 Fun Fact: In Israel, bus routes are numbered and color-coded for easy navigation!</p>
        </div>
      </div>
    </div>
  );
};

export default NotFound; 