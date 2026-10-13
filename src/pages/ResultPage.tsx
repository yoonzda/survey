import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BatteryWarning, ArrowRight, Brain, Moon, Coffee, HeartPulse } from 'lucide-react';
import styles from './ResultPage.module.css';
import { useStore } from '../store/useStore';

export default function ResultPage() {
  const navigate = useNavigate();
  const { userType, scores } = useStore();

  const scoreData = [
    { label: '수면', score: scores.sleep, icon: <Moon size={16} /> },
    { label: '집중', score: scores.focus, icon: <Brain size={16} /> },
    { label: '피로', score: scores.fatigue, icon: <BatteryWarning size={16} /> },
    { label: '감정', score: scores.emotion, icon: <HeartPulse size={16} /> },
    { label: '카페인', score: scores.caffeine, icon: <Coffee size={16} /> }
  ];

  const getTypeDescription = (type: string | null) => {
    switch (type) {
      case '오전 멍함형': return '아침에 깨기 힘들고 오전 내내 뇌가 제대로 깨어나지 않는 상태입니다.';
      case '오후 방전형': return '오후만 되면 급격히 에너지가 고갈되어 능률이 떨어지는 상태입니다.';
      case '밤 각성형': return '밤이 될수록 오히려 눈이 번쩍 뜨이고 수면을 취하기 어려운 상태입니다.';
      case '식후 졸림형': return '식사 후 혈당 스파이크 등으로 심한 식곤증을 겪는 상태입니다.';
      case '긴장 과부하형': return '스트레스와 긴장도가 높아 항상 몸이 뻣뻣하고 예민한 상태입니다.';
      default: return '전반적인 컨디션 관리가 필요한 상태입니다.';
    }
  };

  return (
    <div className={styles.container}>
      <motion.div
        className={styles.header}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <span className={styles.label}>당신의 컨디션 유형은</span>
        <h1 className={styles.title}>{userType || '오전 멍함형'}</h1>
        <p className={styles.description}>
          {getTypeDescription(userType)}
        </p>
      </motion.div>

      <motion.div 
        className={styles.scoreBoard}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h3 className={styles.boardTitle}>현재 회복 점수 (높을수록 좋음)</h3>
        <div className={styles.scoreGrid}>
          {scoreData.map((item, index) => (
            <div key={index} className={styles.scoreItem}>
              <div className={styles.scoreHeader}>
                <span className={styles.scoreIcon}>{item.icon}</span>
                <span>{item.label}</span>
              </div>
              <div className={styles.scoreBarContainer}>
                <div 
                  className={styles.scoreBar} 
                  style={{ 
                    width: `${item.score}%`,
                    background: item.score < 50 ? 'var(--error)' : item.score < 75 ? 'var(--warning)' : 'var(--success)'
                  }} 
                />
              </div>
              <div className={styles.scoreValue}>{item.score}점</div>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div
        className={styles.actionContainer}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <button 
          className={`primary-button ${styles.continueButton}`}
          onClick={() => navigate('/preview')}
        >
          2주 플랜 확인하기 <ArrowRight size={20} />
        </button>
      </motion.div>
    </div>
  );
}
