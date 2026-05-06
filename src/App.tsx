import { useState } from 'react';
import { questions, results } from './data';
import { ChevronRight, RotateCcw, Share2 } from 'lucide-react';

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

  const handleShare = async () => {
    const url = window.location.href;
    const resultType = getResultType();
    const resultTitle = results[resultType].title;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: '성격 유형 테스트',
          text: `나의 성격 유형은 [${resultType} - ${resultTitle}]! 당신의 성격도 알아보세요.`,
          url: url,
        });
      } catch (err) {
        console.error('Share failed:', err);
      }
    } else {
      navigator.clipboard.writeText(url);
      alert('결과 링크가 클립보드에 복사되었습니다!');
    }
  };

  return (
    <div className="app-container">
      <div className="card">
        {step === 'intro' && (
          <div className="intro-section animate-fade-in">
            <div className="intro-content">
              <h1>당신의 진짜 성격은?</h1>
              <p>10개의 질문으로 알아보는 나의 성격 유형</p>
              <div className="illustration-placeholder">
                <div className="circle gradient-1"></div>
                <div className="circle gradient-2"></div>
                <div className="circle gradient-3"></div>
              </div>
            </div>
            <button className="primary-btn" onClick={handleStart}>
              테스트 시작하기 <ChevronRight size={20} />
            </button>
          </div>
        )}

        {step === 'survey' && (
          <div className="survey-section animate-fade-in">
            <div className="survey-header">
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
            </div>
            <div className="question-content">
              <h2 className="question-text">{questions[currentQIndex].text}</h2>
            </div>
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
            <div className="spinner-wrapper">
              <div className="spinner"></div>
              <div className="spinner-inner"></div>
            </div>
            <p className="loading-text">당신의 성격 유형을<br/>정밀하게 분석하고 있습니다...</p>
          </div>
        )}

        {step === 'result' && (
          <div className="result-section animate-slide-up">
            <div className="result-header">
              <h3>분석 완료! 당신의 성격 유형은</h3>
              <div 
                className="result-type-badge"
                style={{ 
                  background: `linear-gradient(135deg, ${results[getResultType()].color}, ${results[getResultType()].color}dd)`,
                  boxShadow: `0 10px 25px ${results[getResultType()].color}66`
                }}
              >
                {getResultType()}
              </div>
              <h2 className="result-title">{results[getResultType()].title}</h2>
            </div>
            
            <div className="result-content">
              <div className="result-desc-box">
                <div className="quote-icon left">"</div>
                <p>{results[getResultType()].description}</p>
                <div className="quote-icon right">"</div>
              </div>
              
              <div className="traits-summary">
                <div className="trait-row">
                  <span className={answers.E >= answers.I ? 'active' : ''}>E (외향)</span>
                  <div className="trait-bar">
                    <div className="trait-fill" style={{ width: `${(answers.E / (answers.E + answers.I || 1)) * 100}%`, background: answers.E >= answers.I ? '#6366f1' : '#cbd5e1' }}></div>
                  </div>
                  <span className={answers.I > answers.E ? 'active' : ''}>I (내향)</span>
                </div>
                <div className="trait-row">
                  <span className={answers.S >= answers.N ? 'active' : ''}>S (감각)</span>
                  <div className="trait-bar">
                    <div className="trait-fill" style={{ width: `${(answers.S / (answers.S + answers.N || 1)) * 100}%`, background: answers.S >= answers.N ? '#a855f7' : '#cbd5e1' }}></div>
                  </div>
                  <span className={answers.N > answers.S ? 'active' : ''}>N (직관)</span>
                </div>
                <div className="trait-row">
                  <span className={answers.T >= answers.F ? 'active' : ''}>T (사고)</span>
                  <div className="trait-bar">
                    <div className="trait-fill" style={{ width: `${(answers.T / (answers.T + answers.F || 1)) * 100}%`, background: answers.T >= answers.F ? '#3b82f6' : '#cbd5e1' }}></div>
                  </div>
                  <span className={answers.F > answers.T ? 'active' : ''}>F (감정)</span>
                </div>
                <div className="trait-row">
                  <span className={answers.J >= answers.P ? 'active' : ''}>J (판단)</span>
                  <div className="trait-bar">
                    <div className="trait-fill" style={{ width: `${(answers.J / (answers.J + answers.P || 1)) * 100}%`, background: answers.J >= answers.P ? '#ec4899' : '#cbd5e1' }}></div>
                  </div>
                  <span className={answers.P > answers.J ? 'active' : ''}>P (인식)</span>
                </div>
              </div>

              <div className="action-buttons">
                <button className="primary-btn share-btn" onClick={handleShare}>
                  <Share2 size={20} /> 결과 공유하기
                </button>
                <button className="secondary-btn" onClick={handleStart}>
                  <RotateCcw size={20} /> 다시 테스트하기
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
