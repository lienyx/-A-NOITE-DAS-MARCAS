import { useEffect, useRef, useState, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import type { GamePhase } from '../shared/gameData';
import { Moon as MoonArt, Skull, Pentagram } from './art/Ornaments';

type Scene = 'night' | 'bell' | 'seals' | 'dawn' | 'end';

interface PhaseVisual {
  scene: Scene;
  eyebrow: string;
  title: string;
  subtitle: string;
}

function getPhaseVisual(phase: GamePhase, round: number): PhaseVisual | null {
  switch (phase) {
    case 'NOITE_ZERO':
      return { scene: 'night', eyebrow: 'Antes da primeira caçada', title: 'Noite Zero', subtitle: 'A cidade fecha os olhos. A Máfia se reconhece.' };
    case 'CACADA':
      return { scene: 'night', eyebrow: `Rodada ${round}`, title: 'Anoitece', subtitle: 'A caçada começou. Aja em segredo.' };
    case 'BADALADA':
      return { scene: 'bell', eyebrow: `Rodada ${round}`, title: 'Badalada', subtitle: 'O sino toca. Todos passam pela urna.' };
    case 'DANCA_DOS_SELOS':
      return { scene: 'seals', eyebrow: `Rodada ${round}`, title: 'Dança dos Selos', subtitle: 'As marcas cobram o seu preço.' };
    case 'TRIBUNAL':
      return { scene: 'dawn', eyebrow: `Dia ${round}`, title: 'Amanhece', subtitle: 'A praça se enche. Hora de apontar.' };
    case 'FIM_DE_JOGO':
      return { scene: 'end', eyebrow: 'A última badalada', title: 'Fim da Noite', subtitle: 'Todos os pergaminhos serão abertos.' };
    default:
      return null;
  }
}

/* Pequenas variações de ângulo para as letras parecerem recortadas à mão. */
const JITTER = [-4, 3, -2, 5, -3, 2, -5, 4, -1, 3, -4, 2, -2, 4, -3, 1];

function CutoutTitle({ text }: { text: string }) {
  let n = 0;
  return (
    <h2 className="curtain-title" aria-label={text}>
      {text.split(' ').map((word, wi) => (
        <span key={wi} aria-hidden="true" style={{ display: 'inline-block', whiteSpace: 'nowrap', margin: '0 .12em' }}>
          {Array.from(word).map((ch) => {
            const i = n++;
            return (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 26, rotate: JITTER[i % JITTER.length] * 3 }}
                animate={{ opacity: 1, y: 0, rotate: JITTER[i % JITTER.length] }}
                transition={{ delay: 0.25 + i * 0.035, type: 'spring', stiffness: 380, damping: 18 }}
                style={{ display: 'inline-block' }}
              >
                {ch}
              </motion.span>
            );
          })}
        </span>
      ))}
    </h2>
  );
}

function Bell() {
  return (
    <svg viewBox="0 0 120 130" className="bell-art">
      <path d="M60 8L60 20" stroke="#241029" strokeWidth="6" strokeLinecap="round" />
      <path d="M60 18C38 18 30 38 30 60C30 80 24 90 14 98L106 98C96 90 90 80 90 60C90 38 82 18 60 18Z" fill="#FF5D70" stroke="#241029" strokeWidth="5" strokeLinejoin="round" />
      <path d="M40 40C42 32 48 28 54 27" stroke="#FFB3BC" strokeWidth="5" strokeLinecap="round" fill="none" />
      <rect x="10" y="96" width="100" height="12" rx="6" fill="#C92D45" stroke="#241029" strokeWidth="5" />
      <circle cx="60" cy="116" r="9" fill="#F4F1FA" stroke="#241029" strokeWidth="5" />
    </svg>
  );
}

function Sun() {
  return (
    <svg viewBox="0 0 160 160" className="curtain-sun">
      <g stroke="#FFD6A8" strokeWidth="6" strokeLinecap="round">
        {Array.from({ length: 12 }).map((_, i) => {
          const a = (i / 12) * Math.PI * 2;
          const r2 = 70 + (i % 2) * 10;
          return <path key={i} d={`M${80 + Math.cos(a) * 54} ${80 + Math.sin(a) * 54}L${80 + Math.cos(a) * r2} ${80 + Math.sin(a) * r2}`} />;
        })}
      </g>
      <circle cx="80" cy="80" r="44" fill="#FFC98A" stroke="#241029" strokeWidth="5" />
      <path d="M64 78C66 74 70 74 72 78M88 78C90 74 94 74 96 78" stroke="#241029" strokeWidth="4" strokeLinecap="round" fill="none" />
      <path d="M70 94C76 99 84 99 90 94" stroke="#241029" strokeWidth="4" strokeLinecap="round" fill="none" />
    </svg>
  );
}

function SceneArt({ scene }: { scene: Scene }): ReactNode {
  if (scene === 'night') {
    return (
      <motion.div
        className="curtain-prop"
        initial={{ y: -60, x: 40, opacity: 0, rotate: -20 }}
        animate={{ y: 0, x: 0, opacity: 1, rotate: 0 }}
        transition={{ duration: 0.9, ease: [0.2, 0.9, 0.2, 1] }}
      >
        <MoonArt className="curtain-moon" />
      </motion.div>
    );
  }
  if (scene === 'bell') {
    return (
      <motion.div
        className="curtain-prop"
        style={{ transformOrigin: '50% 6%' }}
        initial={{ rotate: -26, opacity: 0 }}
        animate={{ rotate: [-26, 20, -14, 9, -4, 0], opacity: 1 }}
        transition={{ duration: 1.5, ease: 'easeOut' }}
      >
        <span className="bell-wave" />
        <span className="bell-wave bell-wave-2" />
        <Bell />
      </motion.div>
    );
  }
  if (scene === 'seals') {
    return (
      <motion.div
        className="curtain-prop"
        initial={{ scale: 2.6, opacity: 0, rotate: -30 }}
        animate={{ scale: 1, opacity: 1, rotate: -8 }}
        transition={{ type: 'spring', stiffness: 260, damping: 14, delay: 0.1 }}
      >
        <span className="wax-seal">
          <Pentagram className="wax-seal-mark" color="#3A0A16" />
        </span>
      </motion.div>
    );
  }
  if (scene === 'dawn') {
    return (
      <motion.div
        className="curtain-prop"
        initial={{ y: 90, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1.1, ease: [0.2, 0.9, 0.2, 1] }}
      >
        <Sun />
      </motion.div>
    );
  }
  return (
    <motion.div
      className="curtain-prop"
      initial={{ scale: 0.4, opacity: 0, rotate: 30 }}
      animate={{ scale: 1, opacity: 1, rotate: 0 }}
      transition={{ type: 'spring', stiffness: 200, damping: 12 }}
    >
      <Skull className="curtain-skull" />
    </motion.div>
  );
}

const HOLD_MS = 2100;

export function PhaseTransitionOverlay({ phase, round }: { phase: GamePhase | null; round: number }) {
  const prevPhaseRef = useRef<GamePhase | null>(null);
  const [visibleKey, setVisibleKey] = useState<string | null>(null);
  const [visual, setVisual] = useState<PhaseVisual | null>(null);

  useEffect(() => {
    if (!phase) {
      prevPhaseRef.current = null;
      setVisibleKey(null);
      return;
    }
    if (prevPhaseRef.current === phase) return;
    prevPhaseRef.current = phase;
    if (phase === 'LOBBY') return;

    const nextVisual = getPhaseVisual(phase, round);
    if (!nextVisual) return;
    setVisual(nextVisual);
    setVisibleKey(`${phase}-${round}-${Date.now()}`);
    const t = setTimeout(() => setVisibleKey(null), HOLD_MS);
    return () => clearTimeout(t);
  }, [phase, round]);

  return (
    <AnimatePresence>
      {visibleKey && visual && (
        <motion.div
          key={visibleKey}
          className={`curtain curtain-${visual.scene}`}
          initial={{ clipPath: 'inset(0 0 100% 0)' }}
          animate={{ clipPath: 'inset(0 0 0% 0)' }}
          exit={{ clipPath: 'inset(100% 0 0% 0)' }}
          transition={{ duration: 0.5, ease: [0.7, 0, 0.2, 1] }}
          onClick={() => setVisibleKey(null)}
          role="status"
          aria-live="polite"
        >
          <svg className="curtain-hem" viewBox="0 0 200 40" preserveAspectRatio="none" aria-hidden="true">
            <path d="M0 0L200 0L200 8C196 8 196 30 190 30C184 30 186 10 178 10C170 10 172 22 166 22C160 22 162 8 150 8C140 8 144 36 134 36C126 36 130 12 118 12C108 12 112 26 104 26C96 26 100 8 86 8C74 8 80 20 70 20C62 20 64 6 52 6C42 6 46 32 36 32C28 32 32 10 20 10C12 10 14 22 6 22C2 22 2 8 0 8Z" />
          </svg>
          <div className="curtain-inner">
            <SceneArt scene={visual.scene} />
            <motion.p
              className="curtain-eyebrow"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
            >
              {visual.eyebrow}
            </motion.p>
            <CutoutTitle text={visual.title} />
            <motion.p
              className="curtain-sub"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              {visual.subtitle}
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
