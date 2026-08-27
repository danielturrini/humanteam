import { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import { OfficeScene } from './OfficeScene';
import { useSquadStore } from '@/store/useSquadStore';

export function PhaserGame() {
  const containerRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<Phaser.Game | null>(null);
  const selectedSquad = useSquadStore((state) => state.selectedSquad);
  const activeStates = useSquadStore((state) => state.activeStates);

  // Create Phaser game on mount
  useEffect(() => {
    if (!containerRef.current || gameRef.current) return;

    const container = containerRef.current;
    const w = container.clientWidth || 800;
    const h = container.clientHeight || 600;

    const game = new Phaser.Game({
      type: Phaser.AUTO,
      parent: container,
      width: w,
      height: h,
      pixelArt: false,          // disabled globally so text renders smooth
      antialias: false,          // keep pixel art look for sprites
      roundPixels: true,         // snap sprites to whole pixels
      backgroundColor: '#1a1420',
      scene: [OfficeScene],
      scale: {
        mode: Phaser.Scale.NONE,
      },
    });

    gameRef.current = game;

    // Resize canvas when container resizes
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        if (width > 0 && height > 0) {
          game.scale.resize(width, height);
        }
      }
    });
    ro.observe(container);

    return () => {
      ro.disconnect();
      game.destroy(true);
      gameRef.current = null;
    };
  }, []);

  // Bridge React state → Phaser scene
  useEffect(() => {
    const squadState = selectedSquad
      ? activeStates.get(selectedSquad) ?? null
      : null;
    let attempts = 0;
    let timer: number | undefined;

    const emit = () => {
      const game = gameRef.current;
      const scene = game?.scene.getScene('OfficeScene') as OfficeScene | null;

      if (!scene || !scene.scene.isActive()) {
        attempts++;
        if (attempts < 20) {
          timer = window.setTimeout(emit, 50);
        }
        return;
      }

      scene.updateFromReact(squadState);
    };

    emit();

    return () => {
      if (timer !== undefined) {
        window.clearTimeout(timer);
      }
    };
  }, [activeStates, selectedSquad]);

  return (
    <div
      ref={containerRef}
      style={{
        flex: 1,
        overflow: 'hidden',
        imageRendering: 'auto',
      }}
    />
  );
}
