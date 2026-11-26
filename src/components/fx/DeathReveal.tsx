import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import type { GamePhase, RoleId } from '../../shared/gameData';
import { ROLES } from '../../shared/gameData';
import type { PublicPlayer } from '../../shared/types';
import { TarotCard } from '../art/TarotCard';
import { Skull } from '../art/Ornaments';
import { playDeathSound } from '../../utils/sound';

const CAUSE: Record<string, { stamp: string; line: string }> = {
  SELO_MAFIA: { stamp: 'Selado', line: 'Um selo foi colado nas costas na calada da noite.' },
  SELO_ASSASSINO: { stamp: 'Selado', line: 'Alguém deixou a sua marca e sumiu na névoa.' },
  FOGO: { stamp: 'Queimado', line: 'O fósforo acendeu na Badalada. Sobrou cinza.' },
  BALA: { stamp: 'Baleado', line: 'Uma bala caiu na urna com o seu nome.' },
  EXECUCAO: { stamp: 'Executado', line: 'A masmorra não devolveu o prisioneiro.' },
  CULPA_JUSTICEIRO: { stamp: 'Culpa', line: 'Atirou em um inocente e não suportou a culpa.' },
  GUARDA_COSTAS: { stamp: 'Sacrifício', line: 'Entrou na frente do golpe para salvar alguém.' },
  TRIBUNAL: { stamp: 'Preso', line: 'A cidade apontou. O pergaminho foi aberto na praça.' },
  VINGANCA_BOBO: { stamp: 'Assombrado', line: 'O Bobo da Corte voltou para se vingar.' },
};

interface Fallen {
  key: string;
  name: string;
  isMe: boolean;
  cause: string | null;
  roleId: RoleId | null;
}

/**
 * Quando alguém morre, a cidade para por alguns segundos: a carta cai na mesa,
 * vira (se o papel for revelado) e recebe o carimbo da causa da morte.
 */
export function DeathReveal({
  players,
  phase,
  myId,
}: {
  players: PublicPlayer[];
  phase: GamePhase;
  myId: string;
}) {
  const aliveRef = useRef<Map<string, boolean> | null>(null);
  const [queue, setQueue] = useState<Fallen[]>([]);
  const [delayUntil, setDelayUntil] = useState(0);
  const [ready, setReady] = useState(false);
  const lastPhaseRef = useRef(phase);

  useEffect(() => {
    const phaseChanged = lastPhaseRef.current !== phase;
    lastPhaseRef.current = phase;
    const prev = aliveRef.current;
    const next = new Map(players.map((p) => [p.id, p.alive] as const));
    aliveRef.current = next;
    if (!prev || phase === 'LOBBY') return;
    const fallen = players
      .filter((p) => prev.get(p.id) === true && !p.alive)
      .map((p) => ({
        key: `${p.id}-${Date.now()}`,
        name: p.name,
        isMe: p.id === myId,
        cause: p.deathCause,
        roleId: p.revealedRole,
      }));
    if (fallen.length === 0) return;
    // Espera a cortina da fase passar antes de mostrar o corpo.
    if (phaseChanged) setDelayUntil(Date.now() + 2300);
    setQueue((q) => [...q, ...fallen]);
  }, [players, phase, myId]);

  useEffect(() => {
    if (queue.length === 0) {
      setReady(false);
      return;
    }
    const wait = Math.max(0, delayUntil - Date.now());
    const t = setTimeout(() => setReady(true), wait);
    return () => clearTimeout(t);
  }, [queue.length, delayUntil]);

  const current = ready ? queue[0] : undefined;

  useEffect(() => {
    if (!current) return;
    playDeathSound();
    const t = setTimeout(() => setQueue((q) => q.slice(1)), 4300);
    return () => clearTimeout(t);
  }, [current]);

  const cause = current?.cause ? CAUSE[current.cause] : null;

  return (
    <AnimatePresence>
      {current && (
        <motion.div
          key={current.key}
          className="death-veil"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          onClick={() => setQueue((q) => q.slice(1))}
          role="alert"
        >
          <motion.p
            className="death-eyebrow"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {current.isMe ? 'Você caiu' : 'A cidade perdeu alguém'}
          </motion.p>

          <div className="death-card-wrap">
            <motion.div
              className="death-card"
              initial={{ y: -260, rotate: -24, rotateY: 0 }}
              animate={{ y: 0, rotate: -4, rotateY: current.roleId ? 180 : 0 }}
              transition={{
                y: { type: 'spring', stiffness: 140, damping: 14 },
                rotate: { type: 'spring', stiffness: 140, damping: 12 },
                rotateY: { delay: 1.05, duration: 0.7, ease: [0.4, 0, 0.2, 1] },
              }}
            >
              <div className="death-card-face death-card-back">
                <Skull className="death-card-skull" />
                <span>Papel em segredo</span>
              </div>
              {current.roleId && (
                <div className="death-card-face death-card-front">
                  <TarotCard roleId={current.roleId} size="lg" />
                </div>
              )}
            </motion.div>
            {cause && (
              <motion.span
                className="death-stamp"
                initial={{ scale: 3, opacity: 0, rotate: -30 }}
                animate={{ scale: 1, opacity: 1, rotate: -14 }}
                transition={{ delay: current.roleId ? 1.8 : 0.9, type: 'spring', stiffness: 500, damping: 18 }}
              >
                {cause.stamp}
              </motion.span>
            )}
          </div>

          <motion.h2
            className="death-name"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            {current.isMe ? 'Você' : current.name}
          </motion.h2>
          <motion.p
            className="death-line"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            {cause?.line ?? 'Não voltou para casa esta noite.'}
            {current.roleId && <> Era <strong>{ROLES[current.roleId].name}</strong>.</>}
          </motion.p>
          {current.isMe && (
            <motion.p className="death-ghost" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4 }}>
              Agora você é um fantasma. Ainda pode conversar no canal dos mortos.
            </motion.p>
          )}
          <p className="death-tap">toque para continuar</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
