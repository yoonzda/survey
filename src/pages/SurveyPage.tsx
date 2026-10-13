import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './SurveyPage.module.css';
import { useStore } from '../store/useStore';

const SURVEY_QUESTIONS = [
  {
    id: 'sleep',
    title: '요즘 수면 상태는 어떠신가요?',
    options: [
      { id: '1', label: '자도 자도 피곤하고 아침에 일어나기 힘들어요' },
      { id: '2', label: '중간에 자주 깨고 깊게 잠들지 못해요' },
      { id: '3', label: '밤낮이 바뀌어서 밤에 오히려 각성 상태가 돼요' },
      { id: '4', label: '비교적 개운하게 잘 자는 편이에요' },
    ]
  },
  {
    id: 'digestion',
    title: '식사 후 주로 어떤 느낌이 드시나요?',
    options: [
      { id: '1', label: '식곤증이 심해서 오후에 아무것도 못하겠어요' },
      { id: '2', label: '소화가 잘 안되고 더부룩한 느낌이 오래가요' },
      { id: '3', label: '스트레스 받으면 체하거나 폭식을 하게 돼요' },
      { id: '4', label: '특별히 불편한 점 없이 편안해요' },
    ]
  },
  {
    id: 'caffeine',
    title: '하루 카페인 섭취량은 어느 정도인가요?',
    options: [
      { id: '1', label: '커피 3잔 이상 안 마시면 버틸 수 없어요' },
      { id: '2', label: '오후 늦게도 커피를 자주 마시는 편이에요' },
      { id: '3', label: '하루 1~2잔 정도 기분 전환용으로 마셔요' },
      { id: '4', label: '카페인을 거의 섭취하지 않아요' },
    ]
  },
  {
    id: 'stress',
    title: '현재 가장 크게 느끼는 스트레스 유형은?',
    options: [
      { id: '1', label: '항상 긴장 상태라 어깨나 목이 뻣뻣해요' },
      { id: '2', label: '감정 기복이 심하고 무기력해질 때가 많아요' },
      { id: '3', label: '작은 일에도 예민해지고 집중이 잘 안 돼요' },
      { id: '4', label: '스트레스를 잘 관리하고 있는 편이에요' },
    ]
  },
  {
    id: 'temperature',
    title: '평소 체온 감각은 어떠신가요?',
    options: [
      { id: '1', label: '수족냉증이 심하고 추위를 많이 타요' },
      { id: '2', label: '상체로 열이 훅 오르는 느낌을 자주 받아요' },
      { id: '3', label: '온도 변화에 민감해서 쉽게 지쳐요' },
      { id: '4', label: '적당한 체온을 잘 유지하는 편이에요' },
    ]
  },
  {
    id: 'focus',
    title: '업무나 학습 시 집중력은 어떠신가요?',
    options: [
      { id: '1', label: '5분도 집중하기 힘들고 자꾸 딴생각이 들어요' },
      { id: '2', label: '오후만 되면 머리가 멍해지고 능률이 떨어져요' },
      { id: '3', label: '특정 시간에는 잘 되지만 기복이 심해요' },
      { id: '4', label: '원할 때 충분히 집중할 수 있어요' },
    ]
  }
];

export default function SurveyPage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const setAnswersStore = useStore((state) => state.setAnswers);
  const calculateResult = useStore((state) => state.calculateResult);

  const handleSelect = (optionId: string) => {
    const newAnswers = { ...answers, [SURVEY_QUESTIONS[currentStep].id]: optionId };
    setAnswers(newAnswers);
    
    setTimeout(() => {
      if (currentStep < SURVEY_QUESTIONS.length - 1) {
        setCurrentStep(prev => prev + 1);
      } else {
        setAnswersStore(newAnswers);
        calculateResult();
        navigate('/result');
      }
    }, 400);
  };

  const question = SURVEY_QUESTIONS[currentStep];
  const progress = ((currentStep + 1) / SURVEY_QUESTIONS.length) * 100;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <button className={styles.backButton} onClick={() => {
          if (currentStep > 0) setCurrentStep(prev => prev - 1);
          else navigate(-1);
        }}>
          <ChevronLeft size={24} />
        </button>
        <div className={styles.progressBar}>
          <div className={styles.progressFill} style={{ width: `${progress}%` }} />
        </div>
        <div className={styles.stepText}>{currentStep + 1} / {SURVEY_QUESTIONS.length}</div>
      </header>

      <main className={styles.main}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className={styles.questionContainer}
          >
            <h2 className={styles.questionTitle}>{question.title}</h2>
            
            <div className={styles.optionsList}>
              {question.options.map(option => (
                <button
                  key={option.id}
                  className={`${styles.optionButton} ${answers[question.id] === option.id ? styles.selected : ''}`}
                  onClick={() => handleSelect(option.id)}
                >
                  <span>{option.label}</span>
                  {answers[question.id] === option.id && <ArrowRight size={20} className={styles.selectedIcon} />}
                </button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
