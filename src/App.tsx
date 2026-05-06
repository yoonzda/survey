import React, { useState, useRef } from 'react';
import { questions, results, traitExplanations } from './data';
import { 
  ChevronRight, ChevronLeft, Share, Download, RotateCcw,
  Coffee, Users, Plane, Flower2, Calendar, ChefHat, HeartHandshake, Film, Handshake, Puzzle
} from 'lucide-react';
import html2canvas from 'html2canvas';

const IconMap: Record<string, React.ElementType> = {
  Coffee, Users, Plane, Flower2, Calendar, ChefHat, HeartHandshake, Film, Handshake, Puzzle
};

type Step = 'intro' | 'survey' | 'loading' | 'result';

function App() {
  const [step, setStep] = useState<Step>('intro');
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const resultRef = useRef<HTMLDivElement>(null);

  const handleStart = () => {
    setStep('survey');
    setCurrentQIndex(0);
    setAnswers([]);
  };

  const handleAnswer = (value: string) => {
    const newAnswers = [...answers, value];
    setAnswers(newAnswers);
    
    if (currentQIndex < questions.length - 1) {
      setCurrentQIndex(prev => prev + 1);
    } else {
      setStep('loading');
      setTimeout(() => {
        setStep('result');
      }, 1500);
    }
  };

  const handleBack = () => {
    if (currentQIndex > 0) {
      setCurrentQIndex(prev => prev - 1);
      setAnswers(prev => prev.slice(0, -1));
    } else {
      // Go back to intro
      setStep('intro');
    }
  };

  const handleGoHome = () => {
    setStep('intro');
    setCurrentQIndex(0);
    setAnswers([]);
  };

  const getScores = () => {
    const scores: Record<string, number> = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };
    answers.forEach(ans => {
      if (scores[ans] !== undefined) scores[ans]++;
    });
    return scores;
  };

  const getResultType = () => {
    const s = getScores();
    const eOrI = s.E >= s.I ? 'E' : 'I';
    const sOrN = s.S >= s.N ? 'S' : 'N';
    const tOrF = s.T >= s.F ? 'T' : 'F';
    const jOrP = s.J >= s.P ? 'J' : 'P';
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

  const handleSaveImage = async () => {
    if (resultRef.current) {
      try {
        const canvas = await html2canvas(resultRef.current, { scale: 2, useCORS: true, backgroundColor: '#fcfcfc' });
        const dataUrl = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = `my_result_${getResultType()}.png`;
        link.href = dataUrl;
        link.click();
      } catch (error) {
        console.error('Image generation failed', error);
        alert('이미지 저장에 실패했습니다.');
      }
    }
  };

  const scores = step === 'result' ? getScores() : { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };

  const renderTraitBar = (leftLabel: string, rightLabel: string, leftScore: number, rightScore: number) => {
    const total = leftScore + rightScore || 1;
    const isLeft = leftScore >= rightScore;
    const pct = isLeft ? (leftScore / total) * 50 : (rightScore / total) * 50;

    return (
      <div className="trait-row">
        <span className={`trait-label ${isLeft ? 'active' : ''}`}>{leftLabel}</span>
        <div className="trait-bar-bg center-aligned">
          <div className="trait-center-mark"></div>
          <div 
            className="trait-bar-fill" 
            style={{ 
              width: `${pct}%`,
              [isLeft ? 'right' : 'left']: '50%',
            }}
          ></div>
        </div>
        <span className={`trait-label ${!isLeft ? 'active' : ''}`}>{rightLabel}</span>
      </div>
    );
  };

  const currentResult = step === 'result' ? results[getResultType()] : null;

  return (
    <div className="app-container">
      {step === 'intro' && (
        <div className="screen intro-screen animate-push-left">
          <div className="intro-content">
            <img src={`${import.meta.env.BASE_URL}favicon.svg`} alt="Survey Logo" className="intro-logo" />
            <h3 className="subtitle">PERSONALITY TEST</h3>
            <h1 className="title">내면의 성향을<br/>발견하는 시간</h1>
            <div className="divider"></div>
            <p className="description">
              당신의 내면을 꿰뚫는 심도 있는 질문들을 통해<br/>
              고유한 성격 유형을 분석합니다.
            </p>
          </div>
          <button className="btn-primary" onClick={handleStart}>
            <span>검사 시작하기</span>
            <ChevronRight size={22} strokeWidth={2.5} className="bounce-arrow" />
          </button>
        </div>
      )}

      {step === 'survey' && (
        <div className="screen survey-screen animate-push-left">
          {IconMap[questions[currentQIndex].icon] && (
            <div className="bg-watermark">
              {React.createElement(IconMap[questions[currentQIndex].icon], { strokeWidth: 1 })}
            </div>
          )}
          <div className="survey-header">
            <button className="btn-back" onClick={handleBack}>
              <ChevronLeft size={22} strokeWidth={1.5} />
            </button>
            <div className="progress-text">
              {String(currentQIndex + 1).padStart(2, '0')} / {questions.length}
            </div>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${((currentQIndex + 1) / questions.length) * 100}%` }}
            ></div>
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
        <div className="screen loading-screen animate-push-left">
          <div className="loader"></div>
          <p className="loading-text">답변을 바탕으로<br/>심층 분석을 진행 중입니다</p>
        </div>
      )}

      {step === 'result' && currentResult && (
        <div className="screen result-screen animate-push-left">
          <div ref={resultRef} className="result-capture-area">
            <div className="result-header">
              <span className="result-label">ANALYSIS COMPLETE</span>
              <h1 className="result-type accent-text">{currentResult.type}</h1>
              <h2 className="result-title">{currentResult.title}</h2>
            </div>
            
            <div className="result-body">
              <div className="traits-container">
                {renderTraitBar('E', 'I', scores.E, scores.I)}
                {renderTraitBar('S', 'N', scores.S, scores.N)}
                {renderTraitBar('T', 'F', scores.T, scores.F)}
                {renderTraitBar('J', 'P', scores.J, scores.P)}
              </div>

              <div className="result-desc">
                <p className="desc-main">{currentResult.description}</p>
                
                {/* 각 성향별 딥다이브 */}
                <div className="trait-breakdown">
                  {currentResult.type.split('').map(char => {
                    const trait = traitExplanations[char];
                    return (
                      <div key={char} className="trait-breakdown-item">
                        <span className="trait-breakdown-char">{char}</span>
                        <div className="trait-breakdown-text">
                          <h4 className="trait-breakdown-title">{trait.title}</h4>
                          <p>{trait.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* 환상의 궁합 / 파국의 궁합 */}
                <div className="match-container">
                  <div className="match-card good-match">
                    <div className="match-badge">최고의 궁합 🤝</div>
                    <div className="match-type">{currentResult.goodMatch.type} - {currentResult.goodMatch.title}</div>
                    <p className="match-desc">{currentResult.goodMatch.desc}</p>
                  </div>
                  <div className="match-card bad-match">
                    <div className="match-badge">상극인 궁합 🌪️</div>
                    <div className="match-type">{currentResult.badMatch.type} - {currentResult.badMatch.title}</div>
                    <p className="match-desc">{currentResult.badMatch.desc}</p>
                  </div>
                </div>

              </div>
            </div>
          </div>

          <div className="action-group">
            <div className="action-row">
              <button className="btn-secondary" onClick={handleSaveImage}>
                <Download size={16} strokeWidth={1.5} />
                <span>이미지 저장</span>
              </button>
              <button className="btn-secondary" onClick={handleShare}>
                <Share size={16} strokeWidth={1.5} />
                <span>링크 공유</span>
              </button>
            </div>
            <button className="btn-outline" onClick={handleGoHome}>
              <RotateCcw size={16} strokeWidth={1.5} />
              <span>처음으로</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
