import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, ArrowRight, Plus, Trash2, X } from 'lucide-react';
import styles from './RoutinePreviewPage.module.css';
import { useStore } from '../store/useStore';

export default function RoutinePreviewPage() {
  const navigate = useNavigate();
  const { weeklyPlan, addCustomRoutine, deleteRoutine } = useStore();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [targetDay, setTargetDay] = useState<number>(1);
  const [customTime, setCustomTime] = useState('12:00');
  const [customTitle, setCustomTitle] = useState('');

  const handleOpenAdd = (day: number) => {
    setTargetDay(day);
    setIsAddOpen(true);
  };

  const handleAddCustom = () => {
    if (!customTitle) return;
    addCustomRoutine(targetDay, customTime, customTitle);
    setCustomTitle('');
    setIsAddOpen(false);
  };

  return (
    <div className={styles.container}>
      <motion.div
        className={styles.header}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className={styles.iconWrapper}>
          <Calendar size={32} color="var(--accent-primary)" />
        </div>
        <h1 className={styles.title}>14일 집중 회복 플랜</h1>
        <p className={styles.description}>
          시간이 지날수록 점진적으로 발전하는 맞춤 플랜입니다.<br/>
          필요한 루틴을 지금 바로 추가/수정해보세요.
        </p>
      </motion.div>

      <motion.div 
        className={styles.previewList}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {weeklyPlan.map((plan) => (
          <div key={plan.day} className={styles.dayBlock}>
            <div className={styles.dayHeader}>
              <h3 className={styles.dayTitle}>Day {plan.day}</h3>
              <button className={styles.addBtn} onClick={() => handleOpenAdd(plan.day)}>
                <Plus size={16} /> 추가
              </button>
            </div>
            <div className={styles.routinesWrapper}>
              {plan.routines.map((routine) => (
                <div key={routine.id} className={styles.previewItem}>
                  <div className={styles.dot} />
                  <div className={styles.content}>
                    <span className={styles.time}>{routine.time}</span>
                    <span className={styles.routineTitle}>
                      {routine.title}
                      {routine.isCustom && <span className={styles.customBadge}>커스텀</span>}
                    </span>
                  </div>
                  {routine.isCustom && (
                    <button 
                      className={styles.deleteBtn} 
                      onClick={() => deleteRoutine(plan.day, routine.id)}
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </motion.div>

      <motion.div
        className={styles.actionContainer}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <button 
          className={`primary-button ${styles.startButton}`}
          onClick={() => navigate('/dashboard')}
        >
          확인 및 메인으로 이동 <ArrowRight size={20} />
        </button>
      </motion.div>

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
                <h2>Day {targetDay} 루틴 추가</h2>
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
    </div>
  );
}
