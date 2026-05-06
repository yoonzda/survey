import { useState } from 'react';
import { questions, results } from './data';
import { ChevronRight, RotateCcw } from 'lucide-react';

type Step = 'intro' | 'survey' | 'loading' | 'result';

function App() {
  const [step, setStep] = useState<Step>('intro');
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  });

  const handleStart = () => {
    setStep('survey');
    setCurrentQIndex(0);
    setAnswers({ E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 });
  };

  const handleAnswer = (value: string) => {
    setAnswers(prev => ({ ...prev, [value]: prev[value] + 1 }));
    if (currentQIndex < questions.length - 1) {
      setCurrentQIndex(prev => prev + 1);
    } else {
      setStep('loading');
      setTimeout(() => {
        setStep('result');
      }, 1500);
    }
  };

  const getResultType = () => {
    const eOrI = answers.E >= answers.I ? 'E' : 'I';
    const sOrN = answers.S >= answers.N ? 'S' : 'N';
    const tOrF = answers.T >= answers.F ? 'T' : 'F';
    const jOrP = answers.J >= answers.P ? 'J' : 'P';
    return `${eOrI}${sOrN}${tOrF}${jOrP}`;
  };

  return (
    <div className="app-container">
      <div className="card">
        {step === 'intro' && (
          <div className="intro-section animate-fade-in">
            <h1>당신의 진짜 성격은?</h1>
            <p>10개의 질문으로 알아보는 나의 성격 유형</p>
            <div className="illustration-placeholder">
              <div className="circle gradient-1"></div>
              <div className="circle gradient-2"></div>
            </div>
            <button className="primary-btn" onClick={handleStart}>
              테스트 시작하기 <ChevronRight size={20} />
            </button>
          </div>
        )}

        {step === 'survey' && (
          <div className="survey-section animate-slide-up">
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${((currentQIndex + 1) / questions.length) * 100}%` }}
              ></div>
            </div>
            <div className="question-counter">
              <span className="current">{currentQIndex + 1}</span>
              <span className="total">/ {questions.length}</span>
            </div>
            <h2 className="question-text">{questions[currentQIndex].text}</h2>
            <div className="options">
              {questions[currentQIndex].options.map((opt, idx) => (
                <button 
                  key={idx} 
                  className="option-btn" 
                  onClick={() => handleAnswer(opt.value)}
                >
                  {opt.text}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 'loading' && (
          <div className="loading-section animate-fade-in">
            <div className="spinner"></div>
            <p>당신의 성격 유형을 분석하고 있습니다...</p>
          </div>
        )}

        {step === 'result' && (
          <div className="result-section animate-fade-in">
            <h3>당신의 성격 유형은</h3>
            <div 
              className="result-type-badge"
              style={{ backgroundColor: results[getResultType()].color }}
            >
              {getResultType()}
            </div>
            <h2 className="result-title">{results[getResultType()].title}</h2>
            <div className="result-desc">
              <p>{results[getResultType()].description}</p>
            </div>
            
            <button className="secondary-btn" onClick={handleStart}>
              <RotateCcw size={20} /> 다시 테스트하기
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
