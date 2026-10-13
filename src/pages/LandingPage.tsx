import { useNavigate } from 'react-router-dom';
import { Activity, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import styles from './LandingPage.module.css';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <div className={styles.backgroundGlow} />
      <div className={styles.backgroundGlow2} />
      
      <motion.div 
        className={styles.content}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className={styles.logo}>
          <Activity size={40} color="var(--accent-primary)" strokeWidth={1.5} />
        </div>
        
        <h1 className={styles.title}>
          아프기 전에<br />
          <span className="gradient-text">무너짐을 관리하자</span>
        </h1>
        
        <p className={styles.subtitle}>
          육체적, 정신적 피로도를 분석하고<br />
          나만의 맞춤 회복 루틴을 시작해보세요.
        </p>
      </motion.div>

      <motion.button 
        className={`primary-button ${styles.startButton}`}
        onClick={() => navigate('/survey')}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
      >
        내 컨디션 분석하기 <ArrowRight size={20} />
      </motion.button>
    </div>
  );
}
