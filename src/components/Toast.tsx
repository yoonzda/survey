import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store/useStore';
import styles from './Toast.module.css';

export default function Toast() {
  const { toastMessage } = useStore();
  
  return (
    <AnimatePresence>
      {toastMessage && (
        <motion.div 
          className={styles.toast}
          initial={{ opacity: 0, y: 50, x: '-50%' }}
          animate={{ opacity: 1, y: 0, x: '-50%' }}
          exit={{ opacity: 0, y: 20, x: '-50%' }}
        >
          {toastMessage}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
