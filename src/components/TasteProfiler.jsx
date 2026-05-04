import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Flame, Droplet, Leaf, X } from 'lucide-react';

const TasteProfiler = ({ menu, onSelectDish, onClose }) => {
  const [step, setStep] = useState(0);
  const [preferences, setPreferences] = useState({
    spicy: 50,
    type: null, // 'veg', 'non-veg', 'all'
    mood: null // 'healthy', 'comfort', 'light', 'heavy'
  });

  const moods = [
    { id: 'healthy', label: 'Healthy & Fresh', icon: <Leaf size={24} /> },
    { id: 'comfort', label: 'Comfort Food', icon: <Droplet size={24} /> },
    { id: 'light', label: 'Light Bite', icon: <Sparkles size={24} /> },
    { id: 'heavy', label: 'Famished', icon: <Flame size={24} /> }
  ];

  const types = [
    { id: 'veg', label: 'Vegetarian' },
    { id: 'non-veg', label: 'Non-Vegetarian' },
    { id: 'all', label: 'Surprise Me!' }
  ];

  // Smart recommendation logic based on user preferences
  const recommendations = useMemo(() => {
    let validItems = menu.filter(item => {
      if (preferences.type && preferences.type !== 'all' && item.type !== preferences.type) return false;
      return true;
    });

    validItems = validItems.map(item => {
      let score = 0;
      const name = (item.name || '').toLowerCase();
      const cat = (item.category || '').toLowerCase();

      // Mood Scoring
      if (preferences.mood === 'healthy') {
        if (cat.includes('starter') || name.includes('salad') || name.includes('fresh')) score += 50;
        if (item.type === 'veg') score += 20;
      } else if (preferences.mood === 'comfort') {
        if (cat.includes('main') || name.includes('butter') || name.includes('pizza') || name.includes('masala') || name.includes('rice')) score += 40;
      } else if (preferences.mood === 'light') {
        if (cat.includes('starter') || cat.includes('fast') || name.includes('noodle') || name.includes('soup') || name.includes('wings')) score += 40;
      } else if (preferences.mood === 'heavy') {
        if (cat.includes('main') || name.includes('biryani') || name.includes('pizza') || name.includes('meal')) score += 50;
      }

      // Spice Scoring
      const isSpicy = name.includes('masala') || name.includes('tikka') || name.includes('wings') || name.includes('chilli') || name.includes('spicy') || name.includes('pepper');
      const isMild = name.includes('butter') || name.includes('salad') || name.includes('sweet') || name.includes('plain') || name.includes('white');
      
      let itemSpiceLevel = 50; // Default medium
      if (isSpicy) itemSpiceLevel = 90;
      else if (isMild) itemSpiceLevel = 10;

      // The closer the item's perceived spice level is to the user's preference, the higher the score
      const spiceDiff = Math.abs(itemSpiceLevel - preferences.spicy);
      score += (100 - spiceDiff);

      // Add a small random factor to ensure variety if user selects the same preferences twice
      score += Math.random() * 15;

      return { ...item, score };
    });

    // Sort by score descending
    validItems.sort((a, b) => b.score - a.score);
    return validItems.slice(0, 3);
  }, [menu, preferences, step]);

  const nextStep = () => setStep(prev => prev + 1);

  return (
    <motion.div 
      className="taste-profiler-overlay glass-panel"
      initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
      animate={{ opacity: 1, backdropFilter: 'blur(10px)' }}
      exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
      style={{
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(0,0,0,0.6)'
      }}
    >
      <motion.div 
        className="profiler-card"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        style={{
          background: 'var(--bg-main)',
          padding: '2rem',
          borderRadius: '24px',
          width: 'min(90%, 500px)',
          minHeight: '400px',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          border: '1px solid var(--border-color)'
        }}
      >
        <button 
          onClick={onClose}
          style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
        >
          <X size={24} />
        </button>

        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div 
              key="step0"
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
              style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}
            >
              <div style={{ background: 'var(--accent-primary-glow)', padding: '1rem', borderRadius: '50%', marginBottom: '1.5rem' }}>
                <Sparkles size={48} color="var(--accent-primary)" />
              </div>
              <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Find Your Craving</h2>
              <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
                Let's find the perfect dish for you without any robotic chat. Just a few fun choices!
              </p>
              <button className="btn-primary" onClick={nextStep} style={{ width: '100%', padding: '1rem', fontSize: '1.1rem' }}>
                Start Exploring
              </button>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div 
              key="step1"
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
              style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
            >
              <h3 style={{ fontSize: '1.5rem', marginBottom: '2rem', textAlign: 'center', marginTop: '1rem' }}>What's your mood?</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                {moods.map(mood => (
                  <motion.button
                    key={mood.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => { setPreferences({ ...preferences, mood: mood.id }); nextStep(); }}
                    style={{
                      padding: '1.5rem',
                      borderRadius: '16px',
                      border: '2px solid',
                      borderColor: preferences.mood === mood.id ? 'var(--accent-primary)' : 'var(--border-color)',
                      background: preferences.mood === mood.id ? 'var(--accent-primary-glow)' : 'transparent',
                      color: 'var(--text-main)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '0.75rem',
                      cursor: 'pointer',
                      transition: 'all 0.3s'
                    }}
                  >
                    {mood.icon}
                    <span style={{ fontWeight: 600 }}>{mood.label}</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div 
              key="step2"
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
              style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
            >
              <h3 style={{ fontSize: '1.5rem', marginBottom: '2rem', textAlign: 'center', marginTop: '1rem' }}>Dietary Preference</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {types.map(type => (
                  <motion.button
                    key={type.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => { setPreferences({ ...preferences, type: type.id }); nextStep(); }}
                    style={{
                      padding: '1.25rem',
                      borderRadius: '12px',
                      border: '2px solid',
                      borderColor: preferences.type === type.id ? 'var(--accent-primary)' : 'var(--border-color)',
                      background: preferences.type === type.id ? 'var(--accent-primary-glow)' : 'var(--bg-input)',
                      color: 'var(--text-main)',
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.3s'
                    }}
                  >
                    {type.label}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div 
              key="step3"
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
              style={{ display: 'flex', flexDirection: 'column', height: '100%', alignItems: 'center' }}
            >
              <h3 style={{ fontSize: '1.5rem', marginBottom: '2rem', textAlign: 'center', marginTop: '1rem' }}>Spice Tolerance</h3>
              
              <div style={{ width: '100%', padding: '2rem 1rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <input 
                  type="range" 
                  min="0" max="100" 
                  value={preferences.spicy}
                  onChange={(e) => setPreferences({ ...preferences, spicy: parseInt(e.target.value) })}
                  style={{ width: '100%', accentColor: 'var(--accent-primary)', height: '8px' }}
                />
                
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontWeight: 600 }}>
                  <span>Mild</span>
                  <span>Medium</span>
                  <span style={{ color: 'var(--accent-danger)' }}>Extra Spicy</span>
                </div>
              </div>

              <button className="btn-primary" onClick={nextStep} style={{ width: '100%', padding: '1rem', marginTop: 'auto' }}>
                Reveal My Matches
              </button>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div 
              key="step4"
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
            >
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', textAlign: 'center', marginTop: '0.5rem' }}>Your Curated Matches</h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', overflowY: 'auto', maxHeight: '300px', paddingRight: '0.5rem' }}>
                {recommendations.map(item => (
                  <motion.div
                    key={item.id}
                    whileHover={{ scale: 1.02 }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                      padding: '0.75rem',
                      background: 'var(--bg-input)',
                      borderRadius: '12px',
                      cursor: 'pointer',
                      border: '1px solid var(--border-color)'
                    }}
                    onClick={() => {
                      onSelectDish(item);
                      onClose();
                    }}
                  >
                    <img src={item.image} alt={item.name} style={{ width: '60px', height: '60px', borderRadius: '8px', objectFit: 'cover' }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700 }}>{item.name}</div>
                      <div style={{ color: 'var(--accent-primary)', fontSize: '0.9rem', fontWeight: 600 }}>₹{item.price}</div>
                    </div>
                    <div style={{ padding: '0.5rem', background: 'var(--accent-primary)', color: 'white', borderRadius: '50%' }}>
                      <Sparkles size={16} />
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

export default TasteProfiler;
