import React, { useState, useEffect, useRef } from 'react';
import { generateAlgebraProblem } from './utils/algebra';
import { fetchQuote } from './utils/quotes';
import './App.css';

const STEPS = { QUESTIONS: 0, ALGEBRA: 1, QUOTE: 2 };

// Calming ambient music (CC) - replace with your own file in public/ if preferred
const CALMING_MUSIC_URL = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3';

function normalizeForCompare(str) {
  return str
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .replace(/["""'']/g, '"')
    .replace(/[—–-]/g, '-')
    .trim();
}

function App() {
  const [step, setStep] = useState(STEPS.QUESTIONS);
  const [thankful, setThankful] = useState('');
  const [excited, setExcited] = useState('');
  const [important, setImportant] = useState('');
  const [algebra, setAlgebra] = useState(null);
  const [algebraAnswer, setAlgebraAnswer] = useState('');
  const [algebraSolved, setAlgebraSolved] = useState(false);
  const [algebraSkipped, setAlgebraSkipped] = useState(false);
  const [algebraFeedback, setAlgebraFeedback] = useState(null); // null | 'correct' | 'incorrect'
  const [quote, setQuote] = useState(null);
  const [quoteInput, setQuoteInput] = useState('');
  const [quoteError, setQuoteError] = useState(false);
  const [loading, setLoading] = useState(false);
  const audioRef = useRef(null);

  const canProceedFromQuestions =
    thankful.trim() && excited.trim() && important.trim();

  useEffect(() => {
    if (step === STEPS.ALGEBRA && !algebra) {
      setAlgebra(generateAlgebraProblem());
    }
  }, [step, algebra]);

  useEffect(() => {
    if (step === STEPS.QUOTE && !quote) {
      setLoading(true);
      fetchQuote()
        .then(setQuote)
        .finally(() => setLoading(false));
    }
  }, [step, quote]);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = 0.4;
      audio.play().catch(() => {});
    }
    return () => {
      if (audio) audio.pause();
    };
  }, []);

  const handleQuestionsSubmit = () => {
    if (!canProceedFromQuestions) return;
    setStep(STEPS.ALGEBRA);
  };

  const handleAlgebraSubmit = () => {
    const num = parseFloat(algebraAnswer);
    const isCorrect = !isNaN(num) && Math.abs(num - algebra.answer) < 0.01;
    setAlgebraSolved(isCorrect);
    setAlgebraFeedback(isCorrect ? 'correct' : 'incorrect');
  };

  const handleAlgebraContinue = () => {
    setStep(STEPS.QUOTE);
  };

  const handleAlgebraSkip = () => {
    setAlgebraSkipped(true);
    setStep(STEPS.QUOTE);
  };

  const handleQuoteSubmit = () => {
    const normalized = normalizeForCompare(quoteInput);
    const expected = normalizeForCompare(quote);
    if (normalized === expected) {
      saveAndClose();
    } else {
      setQuoteError(true);
    }
  };

  async function saveAndClose() {
    if (window.electronAPI) {
      await window.electronAPI.saveEntry({
        thankful: thankful.trim(),
        excited: excited.trim(),
        important: important.trim(),
        algebraSolved,
        algebraSkipped,
        quote,
      });
      await window.electronAPI.closeApp();
    }
  }

  return (
    <div className="app">
      <audio ref={audioRef} src={CALMING_MUSIC_URL} loop preload="auto" />
      <header className="header">
        <h1 className="title">Daily Reflections</h1>
        <p className="subtitle">A moment of intention before the day begins</p>
      </header>

      <main className="content">
        {step === STEPS.QUESTIONS && (
          <section className="step questions-step">
            <p className="prompt">
              Before you proceed, take a moment to reflect.
            </p>
            <div className="question">
              <label>What is one thing you are thankful for?</label>
              <textarea
                value={thankful}
                onChange={(e) => setThankful(e.target.value)}
                placeholder="A small gratitude can illuminate the whole day..."
                rows={2}
              />
            </div>
            <div className="question">
              <label>What is one thing you are excited about today?</label>
              <textarea
                value={excited}
                onChange={(e) => setExcited(e.target.value)}
                placeholder="Anticipation lends purpose to the hours ahead..."
                rows={2}
              />
            </div>
            <div className="question">
              <label>What is the one important thing you must accomplish today?</label>
              <textarea
                value={important}
                onChange={(e) => setImportant(e.target.value)}
                placeholder="One thing done well is worth more than many left undone..."
                rows={2}
              />
            </div>
            <button
              className="btn btn-primary"
              onClick={handleQuestionsSubmit}
              disabled={!canProceedFromQuestions}
            >
              Continue
            </button>
          </section>
        )}

        {step === STEPS.ALGEBRA && algebra && (
          <section className="step algebra-step">
            <p className="prompt">
              A brief exercise for the mind. Solve for x, or skip if you prefer.
            </p>
            <div className="algebra-problem">
              <span className="problem-text">{algebra.problem}</span>
            </div>
            {algebraFeedback ? (
              <>
                <div className={`algebra-feedback ${algebraFeedback}`}>
                  {algebraFeedback === 'correct' ? (
                    <>Correct! Well done.</>
                  ) : (
                    <>Incorrect. The answer was <strong>x = {algebra.answer}</strong>.</>
                  )}
                </div>
                <button
                  className="btn btn-primary"
                  onClick={handleAlgebraContinue}
                >
                  Continue
                </button>
              </>
            ) : (
              <>
                <div className="algebra-answer">
                  <label>x =</label>
                  <input
                    type="text"
                    value={algebraAnswer}
                    onChange={(e) => setAlgebraAnswer(e.target.value)}
                    placeholder="Your answer"
                  />
                </div>
                <div className="algebra-actions">
                  <button
                    className="btn btn-secondary"
                    onClick={handleAlgebraSkip}
                  >
                    Skip
                  </button>
                  <button
                    className="btn btn-primary"
                    onClick={handleAlgebraSubmit}
                  >
                    Submit
                  </button>
                </div>
              </>
            )}
          </section>
        )}

        {step === STEPS.QUOTE && (
          <section className="step quote-step">
            <p className="prompt">
              Ponder this thought. To close, type it below in full.
            </p>
            {loading ? (
              <p className="quote-loading">Fetching a thought for you...</p>
            ) : quote ? (
              <>
                <blockquote className="quote-block">{quote}</blockquote>
                <div className="quote-input-wrap">
                  <input
                    type="text"
                    className={`quote-input ${quoteError ? 'error' : ''}`}
                    value={quoteInput}
                    onChange={(e) => {
                      setQuoteInput(e.target.value);
                      setQuoteError(false);
                    }}
                    placeholder="Type the quote above to continue..."
                  />
                  {quoteError && (
                    <span className="quote-error">The text does not match. Please try again.</span>
                  )}
                </div>
                <button
                  className="btn btn-primary"
                  onClick={handleQuoteSubmit}
                  disabled={!quoteInput.trim()}
                >
                  Complete & Close
                </button>
              </>
            ) : null}
          </section>
        )}
      </main>

      <footer className="footer">
        <span className="ornament">— ✦ —</span>
        {typeof window !== 'undefined' && window.electronAPI && (
          <button
            className="btn-override"
            onClick={() => window.electronAPI.minimizeApp()}
          >
            Minimize for now
          </button>
        )}
      </footer>
    </div>
  );
}

export default App;
