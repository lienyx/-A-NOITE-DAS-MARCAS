import type { GamePhase } from '../../shared/gameData';

export type SkyMood = 'night' | 'bell' | 'seals' | 'dawn' | 'end' | 'lobby';

export function moodForPhase(phase: GamePhase | null): SkyMood {
  switch (phase) {
    case 'NOITE_ZERO':
    case 'CACADA':
      return 'night';
    case 'BADALADA':
      return 'bell';
    case 'DANCA_DOS_SELOS':
      return 'seals';
    case 'TRIBUNAL':
      return 'dawn';
    case 'FIM_DE_JOGO':
      return 'end';
    default:
      return 'lobby';
  }
}

/* Estrelas em posições fixas (nada de aleatório a cada render, senão o céu "pula"). */
const STARS = [
  [6, 8, 1.4], [14, 22, 1], [22, 6, 1.8], [31, 15, 1.1], [39, 4, 1.3], [47, 19, 0.9], [55, 9, 1.6],
  [63, 25, 1], [71, 5, 1.2], [79, 17, 1.5], [88, 10, 1], [94, 27, 1.3], [9, 34, 1], [27, 38, 1.4],
  [43, 31, 1], [59, 41, 1.2], [76, 35, 0.9], [91, 44, 1.1], [18, 48, 0.8], [51, 52, 1],
];

/**
 * O céu atrás da partida. Muda de humor a cada fase: noite azul com lua,
 * lua de sangue na Badalada, névoa gelada na Dança dos Selos e o amanhecer no Tribunal.
 */
export function Atmosphere({ mood }: { mood: SkyMood }) {
  return (
    <div className={`sky sky-${mood}`} aria-hidden="true">
      <div className="sky-wash" />
      <svg className="sky-stars" viewBox="0 0 100 60" preserveAspectRatio="xMidYMid slice">
        {STARS.map(([x, y, r], i) => (
          <circle key={i} cx={x} cy={y} r={r * 0.32} className="sky-star" style={{ animationDelay: `${(i * 0.37) % 4}s` }} />
        ))}
      </svg>
      <div className="sky-orb">
        <svg viewBox="0 0 120 120">
          <circle cx="60" cy="60" r="46" className="orb-body" />
          <circle cx="44" cy="48" r="8" className="orb-crater" />
          <circle cx="74" cy="72" r="11" className="orb-crater" />
          <circle cx="70" cy="38" r="5" className="orb-crater" />
        </svg>
      </div>
      <div className="sky-sun">
        <svg viewBox="0 0 160 160">
          <g className="sun-rays" stroke="#FFD6A8" strokeWidth="5" strokeLinecap="round">
            {Array.from({ length: 12 }).map((_, i) => {
              const a = (i / 12) * Math.PI * 2;
              return <path key={i} d={`M${80 + Math.cos(a) * 54} ${80 + Math.sin(a) * 54}L${80 + Math.cos(a) * (66 + (i % 2) * 8)} ${80 + Math.sin(a) * (66 + (i % 2) * 8)}`} />;
            })}
          </g>
          <circle cx="80" cy="80" r="42" fill="#FFC98A" stroke="#241029" strokeWidth="4" />
        </svg>
      </div>
      <div className="sky-fog sky-fog-1" />
      <div className="sky-fog sky-fog-2" />
      <svg className="sky-bat" viewBox="0 0 120 80">
        <path d="M60 22L66 14L68 26C78 20 96 18 112 26C106 32 104 40 106 50C98 44 90 46 86 54C80 48 72 50 68 58L60 70L52 58C48 50 40 48 34 54C30 46 22 44 14 50C16 40 14 32 8 26C24 18 42 20 52 26L54 14Z" fill="#05080E" />
      </svg>
      <svg className="sky-town" viewBox="0 0 400 90" preserveAspectRatio="xMidYMax slice">
        <path
          className="town-back"
          d="M0 90L0 62L14 62L14 50L22 42L30 50L30 60L46 60L46 44L58 34L70 44L70 58L86 58L86 48L98 48L98 58L112 58L112 38L120 24L128 38L128 56L146 56L146 46L160 36L174 46L174 60L196 60L196 52L210 52L210 62L228 62L228 40L240 30L252 40L252 58L270 58L270 48L282 48L282 56L300 56L300 36L310 20L320 36L320 60L338 60L338 50L352 42L366 50L366 62L384 62L384 54L400 54L400 90Z"
        />
        <path
          className="town-front"
          d="M0 90L0 74L20 74L20 66L34 56L48 66L48 76L70 76L70 70L84 70L84 78L104 78L104 64L116 54L128 64L128 78L150 78L150 70L164 70L164 46L172 30L180 46L180 72L196 72L196 64L212 54L228 64L228 80L248 80L248 70L264 70L264 78L286 78L286 62L300 52L314 62L314 76L332 76L332 70L348 70L348 80L366 80L366 66L380 58L394 66L394 76L400 76L400 90Z"
        />
        <g className="town-windows">
          <rect x="120" y="62" width="4" height="6" rx="1" />
          <rect x="240" y="46" width="4" height="6" rx="1" />
          <rect x="306" y="66" width="4" height="5" rx="1" />
          <rect x="32" y="66" width="4" height="5" rx="1" />
          <rect x="168" y="54" width="4" height="7" rx="1" />
          <rect x="208" y="66" width="4" height="5" rx="1" />
        </g>
      </svg>
    </div>
  );
}
