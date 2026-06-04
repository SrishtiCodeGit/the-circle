import { useState, useEffect } from 'react';
import './ActivityTicker.css';

const ACTIVITIES = [
  'Priya Singh posted a new collab request in Berlin',
  'Aryan Mehta applied to Acoustic Set at The Loft, Brooklyn',
  'New gig posted: Brand Activation in Berlin — €1,500',
  'Kabir Nair joined The Circle from New York',
  "Sneha Roy's profile was viewed 47 times today",
  'New collab: Strings Meets Electronic — looking for a violinist',
  'Rohan Pillai earned $800 from a gig this week',
  '3 new artists joined from Lagos today',
  'Aisha Khan posted: looking for a bassist in Los Angeles',
  'Collaboration formed: Jazz duo in New York',
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
