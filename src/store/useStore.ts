import { create } from 'zustand';

export type UserType = '오전 멍함형' | '오후 방전형' | '밤 각성형' | '식후 졸림형' | '긴장 과부하형';

export interface Routine {
  id: string;
  time: string;
  title: string;
  completed: boolean;
  isCustom?: boolean;
}

export interface DayPlan {
  day: number;
  routines: Routine[];
}

interface UserState {
  answers: Record<string, string>;
  userType: UserType | null;
  scores: { sleep: number; focus: number; fatigue: number; emotion: number; caffeine: number };
  weeklyPlan: DayPlan[];
  currentDay: number;
  wakeTime: string;
  sleepTime: string;
  
  setAnswers: (answers: Record<string, string>) => void;
  calculateResult: () => void;
  setWakeSleepTime: (wake: string, sleep: string) => void;
  toggleRoutine: (day: number, id: string) => void;
  setCurrentDay: (day: number) => void;
  addCustomRoutine: (day: number, time: string, title: string) => void;
  deleteRoutine: (day: number, id: string) => void;
  
  toastMessage: string | null;
  showToast: (msg: string) => void;
  hideToast: () => void;
}

// Helper to generate routine times dynamically
const adjustTime = (baseTime: string, hoursOffset: number) => {
  const [h, m] = baseTime.split(':').map(Number);
  const newH = (Math.floor(h + hoursOffset) + 24) % 24;
  const newM = (m + (hoursOffset % 1) * 60) % 60;
  return `${String(newH).padStart(2, '0')}:${String(newM).padStart(2, '0')}`;
};

export const useStore = create<UserState>((set, get) => ({
  answers: {},
  userType: null,
  scores: { sleep: 0, focus: 0, fatigue: 0, emotion: 0, caffeine: 0 },
  weeklyPlan: [],
  currentDay: 1,
  wakeTime: '07:00',
  sleepTime: '23:00',
  toastMessage: null,
  
  showToast: (msg) => {
    set({ toastMessage: msg });
    setTimeout(() => {
      if (get().toastMessage === msg) {
        set({ toastMessage: null });
      }
    }, 2500);
  },
  
  hideToast: () => set({ toastMessage: null }),
  
  setAnswers: (answers) => set({ answers }),
  
  calculateResult: () => {
    const { answers, wakeTime, sleepTime } = get();
    
    const parseScore = (key: string) => (parseInt(answers[key] || '2')) * 25;
    const sleepScore = parseScore('sleep');
    const digestionScore = parseScore('digestion');
    const stressScore = parseScore('stress');
    const caffeineScore = parseScore('caffeine');
    const focusScore = parseScore('focus');

    const scores = {
      sleep: sleepScore,
      focus: focusScore,
      fatigue: Math.floor((sleepScore + focusScore + digestionScore) / 3),
      emotion: Math.floor((stressScore * 1.5 + sleepScore * 0.5) / 2),
      caffeine: caffeineScore
    };

    let type: UserType = '오전 멍함형';
    if (answers['sleep'] === '1' && answers['caffeine'] === '1') type = '오전 멍함형';
    else if (answers['sleep'] === '3' && answers['stress'] <= '2') type = '밤 각성형';
    else if (answers['digestion'] === '1') type = '식후 졸림형';
    else if (answers['stress'] === '1') type = '긴장 과부하형';
    else if (answers['focus'] <= '2') type = '오후 방전형';

    // Generate 14 days
    const newPlan: DayPlan[] = [];
    for(let d=1; d<=14; d++) {
      const dailyRoutines: Routine[] = [
        { id: `base-1-${d}`, time: adjustTime(wakeTime, 0.5), title: '아침 기상 직후 미지근한 물 한 잔', completed: false }
      ];

      // Introduce gradual habits
      if (type === '오전 멍함형') {
        if (d >= 1) dailyRoutines.push({ id: `t1-${d}`, time: adjustTime(wakeTime, 1), title: '가벼운 5분 스트레칭으로 뇌 깨우기', completed: false });
        if (d >= 4) dailyRoutines.push({ id: `t2-${d}`, time: '14:00', title: '오후 커피 대신 탄산수 마시기', completed: false });
        if (d >= 8) dailyRoutines.push({ id: `t3-${d}`, time: adjustTime(wakeTime, 1.5), title: '아침 10분 햇빛 산책', completed: false });
      } else if (type === '오후 방전형') {
        if (d >= 1) dailyRoutines.push({ id: `t1-${d}`, time: '13:30', title: '점심 식사 후 10분 가벼운 산책', completed: false });
        if (d >= 4) dailyRoutines.push({ id: `t2-${d}`, time: '16:00', title: '견과류나 다크초콜릿 간식 섭취', completed: false });
        if (d >= 8) dailyRoutines.push({ id: `t3-${d}`, time: '15:00', title: '5분간 눈 감고 시각 자극 차단하기', completed: false });
      } else if (type === '밤 각성형') {
        if (d >= 1) dailyRoutines.push({ id: `t1-${d}`, time: '19:00', title: '저녁 식사 이후 조명 어둡게 조절', completed: false });
        if (d >= 4) dailyRoutines.push({ id: `t2-${d}`, time: adjustTime(sleepTime, -1), title: '수면 1시간 전 스마트폰 차단', completed: false });
        if (d >= 8) dailyRoutines.push({ id: `t3-${d}`, time: adjustTime(sleepTime, -0.5), title: '취침 전 수면 유도 명상 10분', completed: false });
      } else if (type === '식후 졸림형') {
        if (d >= 1) dailyRoutines.push({ id: `t1-${d}`, time: '12:30', title: '식사 시 탄수화물 비중 줄이기', completed: false });
        if (d >= 4) dailyRoutines.push({ id: `t2-${d}`, time: '13:00', title: '식후 바로 눕지 않고 서있기', completed: false });
        if (d >= 8) dailyRoutines.push({ id: `t3-${d}`, time: '13:15', title: '식후 15분 스쿼트 3세트', completed: false });
      } else {
        if (d >= 1) dailyRoutines.push({ id: `t1-${d}`, time: '15:00', title: '업무 중 3분 심호흡 명상', completed: false });
        if (d >= 4) dailyRoutines.push({ id: `t2-${d}`, time: adjustTime(sleepTime, -2), title: '따뜻한 물로 샤워 혹은 반신욕', completed: false });
        if (d >= 8) dailyRoutines.push({ id: `t3-${d}`, time: '10:00', title: '카페인 섭취 반으로 줄이기', completed: false });
      }

      dailyRoutines.push({ id: `base-2-${d}`, time: sleepTime, title: '취침 및 하루 회고 작성', completed: false });

      // sort by time
      dailyRoutines.sort((a,b) => a.time.localeCompare(b.time));

      newPlan.push({ day: d, routines: dailyRoutines });
    }

    set({ scores, userType: type, weeklyPlan: newPlan, currentDay: 1 });
  },

  setCurrentDay: (day) => set({ currentDay: day }),

  setWakeSleepTime: (wake, sleep) => {
    set({ wakeTime: wake, sleepTime: sleep });
    get().calculateResult();
  },

  toggleRoutine: (day, id) => {
    set((state) => ({
      weeklyPlan: state.weeklyPlan.map(dp => 
        dp.day === day 
          ? { ...dp, routines: dp.routines.map(r => r.id === id ? { ...r, completed: !r.completed } : r) } 
          : dp
      )
    }));
  },

  addCustomRoutine: (day, time, title) => {
    const newRoutine: Routine = {
      id: `custom-${Date.now()}`,
      time,
      title,
      completed: false,
      isCustom: true
    };
    
    set((state) => ({
      weeklyPlan: state.weeklyPlan.map(dp => {
        if (dp.day === day) {
          const newRoutines = [...dp.routines, newRoutine].sort((a,b) => a.time.localeCompare(b.time));
          return { ...dp, routines: newRoutines };
        }
        return dp;
      })
    }));
  },

  deleteRoutine: (day, id) => {
    set((state) => ({
      weeklyPlan: state.weeklyPlan.map(dp => 
        dp.day === day 
          ? { ...dp, routines: dp.routines.filter(r => r.id !== id) } 
          : dp
      )
    }));
  }
}));
