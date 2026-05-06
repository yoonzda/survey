import { useState } from 'react';
import { questions, results } from './data';
import { ArrowRight, RotateCcw, Share } from 'lucide-react';

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
      }, 2000); // slightly longer, calmer loading
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
          text: `나의 성격 유형은 [${resultType} - ${resultTitle}] 입니다.`,
          url: url,
        });
      } catch (err) {
        console.error('Share failed:', err);
      }
    } else {
      navigator.clipboard.writeText(url);
      alert('결과 링크가 복사되었습니다.');
    }
  };

  return (
    <div className="app-container">
      {step === 'intro' && (
        <div className="screen intro-screen animate-fade-in">
          <div className="intro-content">
            <h3 className="subtitle">PERSONALITY TEST</h3>
            <h1 className="title">내면의 성향을<br/>발견하는 시간</h1>
            <div className="divider"></div>
            <p className="description">
              10개의 심도 있는 질문을 통해<br/>
              당신의 고유한 성격 유형을 분석합니다.
            </p>
          </div>
          <button className="btn-primary" onClick={handleStart}>
            <span>검사 시작하기</span>
            <ArrowRight size={18} strokeWidth={1.5} />
          </button>
        </div>
      )}

      {step === 'survey' && (
        <div className="screen survey-screen animate-fade-in">
          <div className="survey-header">
            <div className="progress-text">
              {String(currentQIndex + 1).padStart(2, '0')} / {questions.length}
            </div>
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${((currentQIndex + 1) / questions.length) * 100}%` }}
              ></div>
            </div>
          </div>
          <div className="question-content">
            <h2 className="question-text">{questions[currentQIndex].text}</h2>
          </div>
          <div className="options">
            {questions[currentQIndex].options.map((opt, idx) => (
              <button 
                key={idx} 
                className="btn-option" 
                onClick={() => handleAnswer(opt.value)}
              >
                {opt.text}
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 'loading' && (
        <div className="screen loading-screen animate-fade-in">
          <div className="loader"></div>
          <p className="loading-text">답변을 바탕으로<br/>심층 분석을 진행 중입니다</p>
        </div>
      )}

      {step === 'result' && (
        <div className="screen result-screen animate-fade-in">
          <div className="result-header">
            <span className="result-label">ANALYSIS COMPLETE</span>
            <h1 className="result-type">{getResultType()}</h1>
            <h2 className="result-title">{results[getResultType()].title}</h2>
          </div>
          
          <div className="result-body">
            <div className="result-desc">
              <p>{results[getResultType()].description}</p>
            </div>
            
            <div className="traits-container">
              <div className="trait-row">
                <span className={`trait-label ${answers.E >= answers.I ? 'active' : ''}`}>E</span>
                <div className="trait-bar-bg">
                  <div className="trait-bar-fill" style={{ width: `${(answers.E / (answers.E + answers.I || 1)) * 100}%` }}></div>
                </div>
                <span className={`trait-label ${answers.I > answers.E ? 'active' : ''}`}>I</span>
              </div>
              <div className="trait-row">
                <span className={`trait-label ${answers.S >= answers.N ? 'active' : ''}`}>S</span>
                <div className="trait-bar-bg">
                  <div className="trait-bar-fill" style={{ width: `${(answers.S / (answers.S + answers.N || 1)) * 100}%` }}></div>
                </div>
                <span className={`trait-label ${answers.N > answers.S ? 'active' : ''}`}>N</span>
              </div>
              <div className="trait-row">
                <span className={`trait-label ${answers.T >= answers.F ? 'active' : ''}`}>T</span>
                <div className="trait-bar-bg">
                  <div className="trait-bar-fill" style={{ width: `${(answers.T / (answers.T + answers.F || 1)) * 100}%` }}></div>
                </div>
                <span className={`trait-label ${answers.F > answers.T ? 'active' : ''}`}>F</span>
              </div>
              <div className="trait-row">
                <span className={`trait-label ${answers.J >= answers.P ? 'active' : ''}`}>J</span>
                <div className="trait-bar-bg">
                  <div className="trait-bar-fill" style={{ width: `${(answers.J / (answers.J + answers.P || 1)) * 100}%` }}></div>
                </div>
                <span className={`trait-label ${answers.P > answers.J ? 'active' : ''}`}>P</span>
              </div>
            </div>
          </div>

          <div className="action-group">
            <button className="btn-secondary" onClick={handleShare}>
              <Share size={16} strokeWidth={1.5} />
              <span>공유하기</span>
            </button>
            <button className="btn-outline" onClick={handleStart}>
              <RotateCcw size={16} strokeWidth={1.5} />
              <span>다시하기</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
