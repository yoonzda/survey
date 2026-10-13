import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Circle, Plus, Settings, X, Trash2 } from 'lucide-react';
import styles from './RoutineDashboard.module.css';
import { useStore } from '../store/useStore';
import BottomNav from '../components/BottomNav';

export default function RoutineDashboard() {
  const { 
    userType, weeklyPlan, currentDay, setCurrentDay, 
    toggleRoutine, addCustomRoutine, deleteRoutine,
    wakeTime, sleepTime, setWakeSleepTime 
  } = useStore();
  
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [localWake, setLocalWake] = useState(wakeTime);
  const [localSleep, setLocalSleep] = useState(sleepTime);
  const [customTime, setCustomTime] = useState('12:00');
  const [customTitle, setCustomTitle] = useState('');

  // If user navigated directly here without weeklyPlan, let's wait or return empty state
  if (weeklyPlan.length === 0) {
    return (
      <div className={styles.container}>
        <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)', margin: 'auto' }}>
          생성된 루틴이 없습니다. 설문을 먼저 진행해주세요.
        </div>
        <BottomNav />
      </div>
    );
  }

  const todayPlan = weeklyPlan.find(p => p.day === currentDay);
  const routines = todayPlan ? todayPlan.routines : [];

  const completedCount = routines.filter(r => r.completed).length;
  const progress = routines.length > 0 ? (completedCount / routines.length) * 100 : 0;

  const handleSaveSettings = () => {
    setWakeSleepTime(localWake, localSleep);
    setIsSettingsOpen(false);
  };

  const handleAddCustom = () => {
    if (!customTitle) return;
    addCustomRoutine(currentDay, customTime, customTitle);
    setCustomTitle('');
    setIsAddOpen(false);
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerInfo}>
          <span className={styles.greeting}>오늘도 무너지지 않게,</span>
          <h1 className={styles.title}>{userType || '오전 멍함형'} 맞춤 루틴</h1>
        </div>
        <button className={styles.iconButton} onClick={() => setIsSettingsOpen(true)}>
          <Settings size={24} />
        </button>
      </header>

      {/* Day Selector */}
      <div className={styles.daySelectorWrapper}>
        <div className={styles.daySelector}>
          {weeklyPlan.map(p => (
            <button 
              key={p.day}
              className={`${styles.dayButton} ${p.day === currentDay ? styles.activeDay : ''}`}
              onClick={() => setCurrentDay(p.day)}
            >
              Day {p.day}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.progressSection}>
        <div className={styles.progressHeader}>
          <span>Day {currentDay} 달성률</span>
          <span className={styles.progressText}>{Math.round(progress)}%</span>
        </div>
        <div className={styles.progressBar}>
          <motion.div 
            className={styles.progressFill}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      <div className={styles.routineList}>
        <div className={styles.listHeader}>
          <h2>나의 회복 루틴</h2>
          <button className={styles.addButton} onClick={() => setIsAddOpen(true)}>
            <Plus size={20} />
          </button>
        </div>
        
        <AnimatePresence>
          {routines.map((routine, index) => (
            <motion.div 
              key={routine.id}
              className={`${styles.routineItem} ${routine.completed ? styles.completed : ''}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => toggleRoutine(currentDay, routine.id)}
            >
              <div className={styles.routineTime}>{routine.time}</div>
              <div className={styles.routineTitle}>
                {routine.title}
                {routine.isCustom && <span className={styles.customBadge}>커스텀</span>}
              </div>
              
              <div className={styles.actionButtons}>
                {routine.isCustom && (
                  <button 
                    className={styles.deleteBtn} 
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteRoutine(currentDay, routine.id);
                    }}
                  >
                    <Trash2 size={18} />
                  </button>
                )}
                <button className={styles.checkButton}>
                  {routine.completed ? 
                    <CheckCircle2 size={24} className={styles.checkedIcon} /> : 
                    <Circle size={24} className={styles.uncheckedIcon} />
                  }
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <BottomNav />

      {/* Add Custom Routine Modal */}
      <AnimatePresence>
        {isAddOpen && (
          <motion.div 
            className={styles.modalOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className={styles.modalContent}
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
            >
              <div className={styles.modalHeader}>
                <h2>Day {currentDay} 루틴 추가</h2>
                <button onClick={() => setIsAddOpen(false)}><X size={24} /></button>
              </div>
              
              <div className={styles.formGroup}>
                <label>수행 시간</label>
                <input 
                  type="time" 
                  value={customTime} 
                  onChange={(e) => setCustomTime(e.target.value)}
                  className={styles.timeInput}
                />
              </div>
              <div className={styles.formGroup}>
                <label>루틴 내용</label>
                <input 
                  type="text" 
                  value={customTitle} 
                  onChange={(e) => setCustomTitle(e.target.value)}
                  className={styles.textInput}
                  placeholder="예: 영양제 챙겨먹기"
                />
              </div>
              
              <button className={`primary-button ${styles.saveButton}`} onClick={handleAddCustom}>
                추가하기
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Settings Modal */}
      <AnimatePresence>
        {isSettingsOpen && (
          <motion.div 
            className={styles.modalOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className={styles.modalContent}
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
            >
              <div className={styles.modalHeader}>
                <h2>기본 시간 설정</h2>
                <button onClick={() => setIsSettingsOpen(false)}><X size={24} /></button>
              </div>
              
              <div className={styles.formGroup}>
                <label>기상 시간</label>
                <input 
                  type="time" 
                  value={localWake} 
                  onChange={(e) => setLocalWake(e.target.value)}
                  className={styles.timeInput}
                />
              </div>
              <div className={styles.formGroup}>
                <label>취침 시간</label>
                <input 
                  type="time" 
                  value={localSleep} 
                  onChange={(e) => setLocalSleep(e.target.value)}
                  className={styles.timeInput}
                />
              </div>
              
              <p className={styles.modalHint}>시간을 변경하면 14일 플랜의 맞춤 루틴 시간들이 전체적으로 재조정됩니다.</p>
              
              <button className={`primary-button ${styles.saveButton}`} onClick={handleSaveSettings}>
                전체 시간 재조정하기
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
