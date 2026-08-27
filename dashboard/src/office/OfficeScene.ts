import Phaser from 'phaser';
import {
  CHARACTER_NAMES, MALE_CHARACTERS, FEMALE_CHARACTERS, avatarKeys, avatarPath,
  DESK_PATHS,
  FURNITURE_PATHS,
  type CharacterName,
} from './assetKeys';
import { CELL_W, CELL_H, MARGIN, WALL_H } from './palette';
import { RoomBuilder } from './RoomBuilder';
import { AgentSprite } from './AgentSprite';
import type { SquadState, Agent } from '@/types/state';

function assignCharacters(agents: Agent[]): Map<string, CharacterName> {
  const assignments = new Map<string, CharacterName>();
  let maleIndex = 0;
  let femaleIndex = 0;

  for (const [index, agent] of agents.entries()) {
    const gender = agent.gender ?? (index % 2 === 0 ? 'female' : 'male');
    if (gender === 'male') {
      assignments.set(agent.id, MALE_CHARACTERS[maleIndex % MALE_CHARACTERS.length]);
      maleIndex++;
    } else {
      assignments.set(agent.id, FEMALE_CHARACTERS[femaleIndex % FEMALE_CHARACTERS.length]);
      femaleIndex++;
    }
  }

  return assignments;
}

const DEMO_AGENTS: Agent[] = [
  { id: '1', name: 'Researcher', icon: '', status: 'working', gender: 'female', desk: { col: 1, row: 1 } },
  { id: '2', name: 'Writer', icon: '', status: 'idle', gender: 'male', desk: { col: 2, row: 1 } },
  { id: '3', name: 'Editor', icon: '', status: 'done', gender: 'female', desk: { col: 3, row: 1 } },
  { id: '4', name: 'Designer', icon: '', status: 'working', gender: 'female', desk: { col: 1, row: 2 } },
  { id: '5', name: 'Reviewer', icon: '', status: 'checkpoint', gender: 'male', desk: { col: 2, row: 2 } },
  { id: '6', name: 'Publisher', icon: '', status: 'idle', gender: 'male', desk: { col: 3, row: 2 } },
];

export class OfficeScene extends Phaser.Scene {
  private agentSprites: Map<string, AgentSprite> = new Map();
  private roomBuilder!: RoomBuilder;
  private handoffTween?: Phaser.Tweens.Tween;

  constructor() {
    super({ key: 'OfficeScene' });
  }

  preload(): void {
    // Load desk sprites
    for (const [key, path] of Object.entries(DESK_PATHS)) {
      this.load.image(key, path);
    }

    // Load avatar sprites
    for (const name of CHARACTER_NAMES) {
      const keys = avatarKeys(name);
      this.load.image(keys.blink, avatarPath(name, 'blink'));
      this.load.image(keys.talk, avatarPath(name, 'talk'));
      this.load.image(keys.wave1, avatarPath(name, 'wave1'));
      this.load.image(keys.wave2, avatarPath(name, 'wave2'));
    }

    // Load furniture sprites
    for (const [key, path] of Object.entries(FURNITURE_PATHS)) {
      this.load.image(key, path);
    }

    this.load.on('loaderror', (file: Phaser.Loader.File) => {
      console.error('Failed to load asset:', file.key, file.url);
    });
  }

  create(): void {
    // Set all loaded textures to NEAREST filter for crisp pixel art
    this.textures.list && Object.values(this.textures.list).forEach((tex) => {
      if (tex.key !== '__DEFAULT' && tex.key !== '__MISSING') {
        tex.setFilter(Phaser.Textures.FilterMode.NEAREST);
      }
    });

    this.roomBuilder = new RoomBuilder(this);

    this.events.on('stateUpdate', (state: SquadState | null) => {
      this.onStateUpdate(state);
    });

    this.renderScene(null);
  }

  private onStateUpdate(state: SquadState | null): void {
    this.renderScene(state);
  }

  updateFromReact(state: SquadState | null): void {
    this.onStateUpdate(state);
  }

  private renderScene(state: SquadState | null): void {
    let agents = this.prepareAgentsForDisplay(state);

    // Auto-assign desk positions if all agents are at the same spot (default 1,1)
    const allSameDesk = agents.length > 1 &&
      agents.every(a => a.desk.col === agents[0].desk.col && a.desk.row === agents[0].desk.row);
    if (allSameDesk) {
      const cols = Math.min(agents.length, 3); // max 3 columns
      agents = agents.map((a, i) => ({
        ...a,
        desk: { col: (i % cols) + 1, row: Math.floor(i / cols) + 1 },
      }));
    }

    let maxCol = 0, maxRow = 0;
    for (const agent of agents) {
      maxCol = Math.max(maxCol, agent.desk.col);
      maxRow = Math.max(maxRow, agent.desk.row);
    }

    // Wider cells for comfortable spacing between agents + labels
    const cellW = CELL_W + 64;   // 160px per cell (wider for desk tables + decorations)
    const cellH = CELL_H + 80;   // 176px per cell (label + monitor + desk + avatar)

    const roomW = Math.max(maxCol * cellW + MARGIN * 2, 580);
    // Extra space below desk grid for lounge area
    const loungeSpace = CELL_H + 48;
    const roomH = maxRow * cellH + MARGIN * 2 + WALL_H + loungeSpace;

    this.clearScene();
    this.roomBuilder.build(roomW, roomH);

    const characterMap = assignCharacters(agents);
    const positions = new Map<string, { x: number; y: number }>();

    for (let i = 0; i < agents.length; i++) {
      const agent = agents[i];
      const x = (agent.desk.col - 1) * cellW + MARGIN + cellW / 2;
      const y = (agent.desk.row - 1) * cellH + MARGIN + WALL_H + cellH / 2;
      positions.set(agent.id, { x, y });
      const characterName = characterMap.get(agent.id)!;
      const deskVariant = i % 2 === 0 ? 'black' : 'white';
      const agentSprite = new AgentSprite(this, x, y, characterName, deskVariant, agent);
      this.agentSprites.set(agent.id, agentSprite);
    }

    this.drawHandoff(state, positions);

    // Fit room in viewport with slight padding
    const cam = this.cameras.main;
    const scaleX = cam.width / (roomW + 32);
    const scaleY = cam.height / (roomH + 32);
    const zoom = Math.min(scaleX, scaleY, 2);
    cam.setZoom(zoom);
    cam.centerOn(roomW / 2, roomH / 2);
  }

  private clearScene(): void {
    this.handoffTween?.stop();
    this.handoffTween = undefined;
    for (const sprite of this.agentSprites.values()) {
      sprite.destroy();
    }
    this.agentSprites.clear();
    this.children.removeAll(true);
  }

  private prepareAgentsForDisplay(state: SquadState | null): Agent[] {
    if (!state) return DEMO_AGENTS;

    const agents = state.agents.map((agent) => ({ ...agent, desk: { ...agent.desk } }));
    const hasActiveAgent = agents.some((agent) =>
      agent.status === 'working' || agent.status === 'delivering' || agent.status === 'checkpoint'
    );

    if (hasActiveAgent || state.status === 'completed') return agents;

    if (state.status === 'running' || state.status === 'checkpoint') {
      const index = Math.min(Math.max(state.step.current - 1, 0), agents.length - 1);
      if (agents[index]) {
        agents[index] = {
          ...agents[index],
          status: state.status === 'checkpoint' ? 'checkpoint' : 'working',
        };
      }
    }

    return agents;
  }

  private drawHandoff(
    state: SquadState | null,
    positions: Map<string, { x: number; y: number }>,
  ): void {
    if (!state?.handoff) return;

    const from = positions.get(state.handoff.from);
    const to = positions.get(state.handoff.to);
    if (!from || !to) return;

    const line = this.add.graphics();
    line.setDepth(850);
    line.lineStyle(4, 0x60b0ff, 0.66);
    line.beginPath();
    const startX = from.x;
    const startY = from.y - 44;
    const endX = to.x;
    const endY = to.y - 44;
    const midX = (from.x + to.x) / 2;
    const midY = Math.min(from.y, to.y) - 116;
    line.moveTo(startX, startY);
    for (let i = 1; i <= 24; i++) {
      const t = i / 24;
      const inv = 1 - t;
      const x = inv * inv * startX + 2 * inv * t * midX + t * t * endX;
      const y = inv * inv * startY + 2 * inv * t * midY + t * t * endY;
      line.lineTo(x, y);
    }
    line.strokePath();

    const label = this.add.text(midX, midY - 28, 'handoff', {
      fontFamily: '"Segoe UI", "Helvetica Neue", Arial, sans-serif',
      fontSize: '13px',
      fontStyle: 'bold',
      color: '#ffffff',
      stroke: '#101018',
      strokeThickness: 4,
      resolution: 2,
    }).setOrigin(0.5, 0.5).setDepth(902);

    this.tweens.add({
      targets: label,
      alpha: { from: 0.65, to: 1 },
      duration: 760,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });

    const courier = this.add.circle(from.x, from.y - 44, 7, 0xffffff, 1).setDepth(901);
    courier.setStrokeStyle(3, 0x60b0ff, 1);

    this.handoffTween = this.tweens.add({
      targets: courier,
      x: to.x,
      y: to.y - 44,
      duration: 1200,
      repeat: -1,
      yoyo: false,
      ease: 'Sine.easeInOut',
      onRepeat: () => {
        courier.setPosition(from.x, from.y - 44);
      },
    });
  }
}
