import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserPlus, Heart, Search, Trophy } from 'lucide-react';
import BottomNav from '../components/BottomNav';
import styles from './FriendsPage.module.css';
import { useStore } from '../store/useStore';

const MOCK_FRIENDS = [
  { id: '1', name: '김건강', type: '오전 멍함형', progress: 85, isCheered: false },
  { id: '2', name: '박루틴', type: '긴장 과부하형', progress: 60, isCheered: false },
  { id: '3', name: '이회복', type: '식후 졸림형', progress: 100, isCheered: true },
  { id: '4', name: '최수면', type: '밤 각성형', progress: 30, isCheered: false },
];

export default function FriendsPage() {
  const { userType, weeklyPlan, currentDay, showToast } = useStore();
  const [friends, setFriends] = useState(MOCK_FRIENDS);
  
  const todayPlan = weeklyPlan.find(p => p.day === currentDay);
  const routines = todayPlan ? todayPlan.routines : [];
  
  const myCompleted = routines.filter(r => r.completed).length;
  const myProgress = routines.length > 0 ? (myCompleted / routines.length) * 100 : 0;

  const handleCheer = (id: string, name: string) => {
    setFriends(friends.map(f => f.id === id ? { ...f, isCheered: true } : f));
    showToast(`${name}님에게 응원을 보냈습니다!`);
  };

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      showToast('검색 기능을 준비 중입니다.');
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>프렌즈 랭킹</h1>
        <button 
          className={styles.addFriendButton}
          onClick={() => showToast('기기 연락처 연동 기능을 준비 중입니다.')}
        >
          <UserPlus size={20} />
          <span>추가</span>
        </button>
      </header>

      <div className={styles.searchBar}>
        <Search size={20} className={styles.searchIcon} />
        <input 
          type="text" 
          placeholder="친구 아이디 또는 연락처 검색" 
          className={styles.searchInput} 
          onKeyDown={handleSearch}
        />
      </div>

      <div className={styles.myProfile}>
        <div className={styles.myInfo}>
          <div className={styles.myAvatar}>나</div>
          <div>
            <span className={styles.myName}>나의 달성률</span>
            <span className={styles.myType}>{userType || '유형 미지정'}</span>
          </div>
        </div>
        <div className={styles.myProgressWrapper}>
          <span className={styles.myProgressText}>{Math.round(myProgress)}%</span>
          <div className={styles.progressBar}>
            <div className={styles.progressFill} style={{ width: `${myProgress}%` }} />
          </div>
        </div>
      </div>

      <div className={styles.friendsList}>
        <h2 className={styles.listTitle}>오늘의 랭킹 <Trophy size={16} color="var(--warning)" /></h2>
        
        <AnimatePresence>
          {friends.sort((a,b) => b.progress - a.progress).map((friend, index) => (
            <motion.div 
              key={friend.id}
              className={styles.friendCard}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className={styles.rank}>{index + 1}</div>
              <div className={styles.friendInfo}>
                <div className={styles.friendHeader}>
                  <span className={styles.friendName}>{friend.name}</span>
                  <span className={styles.friendType}>{friend.type}</span>
                </div>
                <div className={styles.friendProgressWrapper}>
                  <div className={styles.progressBar}>
                    <div 
                      className={styles.progressFill} 
                      style={{ 
                        width: `${friend.progress}%`,
                        background: friend.progress === 100 ? 'var(--accent-primary)' : 'var(--text-muted)'
                      }} 
                    />
                  </div>
                  <span className={styles.friendProgressText}>{friend.progress}%</span>
                </div>
              </div>
              <button 
                className={`${styles.cheerButton} ${friend.isCheered ? styles.cheered : ''}`}
                onClick={() => handleCheer(friend.id, friend.name)}
                disabled={friend.isCheered}
              >
                <Heart size={20} fill={friend.isCheered ? "var(--error)" : "none"} color={friend.isCheered ? "var(--error)" : "var(--text-muted)"} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <BottomNav />
    </div>
  );
}
