import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle2, Users, ShoppingBag } from 'lucide-react';
import styles from './BottomNav.module.css';

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className={styles.bottomNav}>
      <button 
        className={`${styles.navItem} ${location.pathname === '/dashboard' ? styles.active : ''}`}
        onClick={() => navigate('/dashboard')}
      >
        <CheckCircle2 size={24} />
        <span>루틴</span>
      </button>
      <button 
        className={`${styles.navItem} ${location.pathname === '/friends' ? styles.active : ''}`}
        onClick={() => navigate('/friends')}
      >
        <Users size={24} />
        <span>프렌즈</span>
      </button>
      <button 
        className={`${styles.navItem} ${location.pathname === '/store' ? styles.active : ''}`}
        onClick={() => navigate('/store')}
      >
        <ShoppingBag size={24} />
        <span>스토어</span>
      </button>
    </nav>
  );
}
