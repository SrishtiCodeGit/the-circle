import { useState, useEffect } from 'react';
import './ActivityTicker.css';

const ACTIVITIES = [
  'Priya Singh posted a new collab request in Bangalore',
  'Aryan Mehta applied to Acoustic Set at The Perch Café',
  'New gig posted: Brand Activation in Delhi — ₹30,000',
  'Kabir Nair joined The Circle from Hyderabad',
  "Sneha Roy's profile was viewed 47 times today",
  'New collab: Sitar Meets Electronic — looking for a flautist',
  'Rohan Pillai earned ₹12,000 from a gig this week',
  '3 new artists joined from Chennai today',
  'Aisha Khan posted: looking for a bassist in Goa',
  'Collaboration formed: Jazz duo in Hyderabad',
];

export default function ActivityTicker() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIndex(i => (i + 1) % ACTIVITIES.length);
        setVisible(true);
      }, 350);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="activity-ticker">
      <span className="ticker-dot" />
      <span className="ticker-live">LIVE</span>
      <div className="ticker-text-wrap">
        <span className={`ticker-text ${visible ? 'ticker-in' : 'ticker-out'}`}>
          {ACTIVITIES[index]}
        </span>
      </div>
    </div>
  );
}
