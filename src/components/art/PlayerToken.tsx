import { ROLES, type RoleId } from '../../shared/gameData';
import { FACTION_PAL, RoleCharacter } from './Characters';

/* Cores das capas dos vultos: cada assento ganha a sua, para os jogadores se reconhecerem de relance. */
const CLOAKS = ['#3C86AE', '#7A4C9E', '#2F8C78', '#B3263F', '#C0873A', '#5B6FC2', '#8E4F6B', '#4E7A3A', '#9C5A2E', '#466A8C'];
const TILTS = [-3, 2, -1.5, 3, -2.5, 1, -0.5, 2.5, -2, 1.5];

/** Rosto de um jogador na praça: um vulto encapuzado com a inicial, ou o bicho do papel quando ele já foi revelado. */
export function PlayerToken({
  name,
  seat,
  alive = true,
  roleId = null,
  size = 40,
  highlight = false,
}: {
  name: string;
  seat: number;
  alive?: boolean;
  roleId?: RoleId | null;
  size?: number;
  highlight?: boolean;
}) {
  const cloak = CLOAKS[seat % CLOAKS.length];
  const tilt = TILTS[seat % TILTS.length];
  const ring = roleId ? FACTION_PAL[ROLES[roleId].faction].o : highlight ? '#8FD0EE' : '#2C4260';
  const initial = (name.trim()[0] || '?').toUpperCase();
  return (
    <span
      className={`ptoken ${alive ? '' : 'is-dead'}`}
      style={{ width: size, height: size, ['--ring' as string]: ring, transform: `rotate(${tilt}deg)` }}
      aria-hidden="true"
    >
      {roleId ? (
        <RoleCharacter roleId={roleId} faction={ROLES[roleId].faction} className="ptoken-art" ground={false} />
      ) : (
        <svg viewBox="0 0 48 48" className="ptoken-art">
          <path d="M24 7C15 7 10 14 10 22L10 30C10 33 7 36 5 44L43 44C41 36 38 33 38 30L38 22C38 14 33 7 24 7Z" fill={cloak} stroke="#090C13" strokeWidth="2.4" strokeLinejoin="round" />
          <path d="M24 13C18 13 15.5 18 15.5 23C15.5 28 19 31.5 24 31.5C29 31.5 32.5 28 32.5 23C32.5 18 30 13 24 13Z" fill="#0A0F18" />
          <circle cx="20.4" cy="23" r="2.1" fill="#F4F1FA" />
          <circle cx="27.6" cy="23" r="2.1" fill="#F4F1FA" />
          <text x="24" y="42" textAnchor="middle" fontFamily="Londrina Solid, sans-serif" fontSize="10" fill="#F4F1FA">{initial}</text>
        </svg>
      )}
      {!alive && (
        <svg viewBox="0 0 48 48" className="ptoken-x">
          <path d="M11 11L37 37M37 11L11 37" stroke="#E23B4E" strokeWidth="5" strokeLinecap="round" />
        </svg>
      )}
    </span>
  );
}

/** Tracinhos de contagem, como numa parede de cela: quatro riscos e um corte. */
export function TallyMarks({ count, color = '#F2F0FA' }: { count: number; color?: string }) {
  if (count <= 0) return null;
  const groups: number[] = [];
  for (let left = count; left > 0; left -= 5) groups.push(Math.min(5, left));
  return (
    <span className="tally" aria-label={`${count} voto${count === 1 ? '' : 's'}`}>
      {groups.map((n, gi) => (
        <svg key={gi} viewBox="0 0 34 26" width="30" height="23" aria-hidden="true">
          {Array.from({ length: Math.min(4, n) }).map((_, i) => (
            <path
              key={i}
              className="tally-stroke"
              style={{ animationDelay: `${i * 60}ms` }}
              d={`M${5 + i * 7} ${4 + (i % 2)}L${4 + i * 7 + (i % 2)} ${22 - (i % 2)}`}
              stroke={color}
              strokeWidth="2.6"
              strokeLinecap="round"
            />
          ))}
          {n === 5 && <path className="tally-stroke" d="M1 18L31 6" stroke="#E23B4E" strokeWidth="2.8" strokeLinecap="round" />}
        </svg>
      ))}
    </span>
  );
}
