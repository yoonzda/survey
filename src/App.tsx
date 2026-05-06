import { useState, useRef } from 'react';
import { questions, results } from './data';
import { ArrowRight, ArrowLeft, Share, Download, RotateCcw } from 'lucide-react';
import html2canvas from 'html2canvas';

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
        <div className="screen survey-screen animate-push-left">
          <div className="survey-header">
            <button className="btn-back" onClick={handleBack}>
              <ArrowLeft size={20} strokeWidth={1.5} />
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

      {step === 'result' && (
        <div className="screen result-screen animate-push-left">
          {/* This wrapper is what we capture as an image */}
          <div ref={resultRef} className="result-capture-area">
            <div className="result-header">
              <span className="result-label">ANALYSIS COMPLETE</span>
              <h1 className="result-type accent-text">{getResultType()}</h1>
              <h2 className="result-title">{results[getResultType()].title}</h2>
            </div>
            
            <div className="result-body">
              <div className="result-desc">
                <p className="desc-main">{results[getResultType()].description}</p>
                {results[getResultType()].details && (
                  <ul className="desc-details">
                    {results[getResultType()].details?.map((detail, idx) => (
                      <li key={idx}>{detail}</li>
                    ))}
                  </ul>
                )}
              </div>
              
              <div className="traits-container">
                <div className="trait-row">
                  <span className={`trait-label ${scores.E >= scores.I ? 'active' : ''}`}>E</span>
                  <div className="trait-bar-bg">
                    <div className="trait-bar-fill" style={{ width: `${(scores.E / (scores.E + scores.I || 1)) * 100}%` }}></div>
                  </div>
                  <span className={`trait-label ${scores.I > scores.E ? 'active' : ''}`}>I</span>
                </div>
                <div className="trait-row">
                  <span className={`trait-label ${scores.S >= scores.N ? 'active' : ''}`}>S</span>
                  <div className="trait-bar-bg">
                    <div className="trait-bar-fill" style={{ width: `${(scores.S / (scores.S + scores.N || 1)) * 100}%` }}></div>
                  </div>
                  <span className={`trait-label ${scores.N > scores.S ? 'active' : ''}`}>N</span>
                </div>
                <div className="trait-row">
                  <span className={`trait-label ${scores.T >= scores.F ? 'active' : ''}`}>T</span>
                  <div className="trait-bar-bg">
                    <div className="trait-bar-fill" style={{ width: `${(scores.T / (scores.T + scores.F || 1)) * 100}%` }}></div>
                  </div>
                  <span className={`trait-label ${scores.F > scores.T ? 'active' : ''}`}>F</span>
                </div>
                <div className="trait-row">
                  <span className={`trait-label ${scores.J >= scores.P ? 'active' : ''}`}>J</span>
                  <div className="trait-bar-bg">
                    <div className="trait-bar-fill" style={{ width: `${(scores.J / (scores.J + scores.P || 1)) * 100}%` }}></div>
                  </div>
                  <span className={`trait-label ${scores.P > scores.J ? 'active' : ''}`}>P</span>
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
