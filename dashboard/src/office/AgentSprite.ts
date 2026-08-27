import Phaser from 'phaser';
import { avatarKeys, DESK_KEYS, FURNITURE_KEYS, type CharacterName } from './assetKeys';
import { COLORS } from './palette';
import type { Agent, AgentStatus } from '@/types/state';

// Avatar display scale — characters should be prominent at desk
const AVATAR_SCALE = 0.8;

// Status → badge color mapping
const STATUS_COLORS: Record<AgentStatus, number> = {
  idle: COLORS.statusIdle,
  working: COLORS.statusWorking,
  done: COLORS.statusDone,
  checkpoint: COLORS.statusCheckpoint,
  delivering: COLORS.statusWorking,
};

// Status → display label
const STATUS_LABELS: Record<AgentStatus, string> = {
  idle: 'disponivel',
  working: 'trabalhando',
  done: 'pronto',
  checkpoint: 'aprovacao',
  delivering: 'entregando',
};

export class AgentSprite {
  private scene: Phaser.Scene;
  private deskTable: Phaser.GameObjects.Image;
  private deskShadow: Phaser.GameObjects.Graphics;
  private desk: Phaser.GameObjects.Image;
  private coffeeMug: Phaser.GameObjects.Image;
  private avatar: Phaser.GameObjects.Image;
  private activityText: Phaser.GameObjects.Text;
  private nameText: Phaser.GameObjects.Text;
  private badgeBg: Phaser.GameObjects.Graphics;
  private statusDot: Phaser.GameObjects.Graphics;
  private statusText: Phaser.GameObjects.Text;
  private activityRing: Phaser.GameObjects.Graphics;
  private animTimer?: Phaser.Time.TimerEvent;
  private pulseTween?: Phaser.Tweens.Tween;
  private bobTween?: Phaser.Tweens.Tween;
  private activityTween?: Phaser.Tweens.Tween;
  private agent: Agent;
  private characterName: CharacterName;
  private deskVariant: 'black' | 'white';
  private avatarDisplayH: number = 0;
  private avatarBaseY: number = 0;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    characterName: CharacterName,
    deskVariant: 'black' | 'white',
    agent: Agent,
  ) {
    this.scene = scene;
    this.agent = agent;
    this.characterName = characterName;
    this.deskVariant = deskVariant;

    // === VERTICAL LAYOUT (sprites, top to bottom on screen) ===
    // desk_wood: 96x64 @ 1.3x = 125x83px  → y-42 to y+42
    // desktop_set: ~48x40 @ 1.3x = 62x52px → y-56 to y-4  (center at y-30)
    // avatar: 48x51 @ 0.8x = 38x41px        → y-91 to y-50 (center at y-70)
    //
    // Depth order (low = behind, high = front):
    //   avatar     → y        (seated character, lowest — desk will cover lower body)
    //   desk_wood  → y+1      (desk surface IN FRONT of avatar → covers avatar's lower half)
    //   monitor    → y+2      (on desk surface, screen faces viewer)
    //   coffee mug → y+3      (foreground item on front desk edge)
    //   label      → 900/901  (always on top)
    //
    // Result: avatar fully visible above monitor, lower body hidden by desk → seated look
    // =========================================

    // Avatar — positioned further behind the desk so head/torso is clearly visible
    const avatarKey = this.getAvatarKey(agent.status);
    this.avatar = scene.add.image(x, y - 70, avatarKey)
      .setOrigin(0.5, 0.5)
      .setScale(AVATAR_SCALE)
      .setDepth(y);  // LOWEST depth — desk and monitor render in front
    // Lock display height so texture swaps between frames of different pixel dimensions
    // don't cause a visible scale jump (e.g. Male1 blink=56px tall vs talk=51px tall).
    // Width is NOT locked — each frame scales proportionally from this height reference.
    this.avatarDisplayH = this.avatar.displayHeight;
    this.avatarBaseY = this.avatar.y;

    // Desk table surface — renders IN FRONT of avatar (covers lower body)
    this.deskTable = scene.add.image(x, y, FURNITURE_KEYS.deskWood)
      .setOrigin(0.5, 0.5)
      .setScale(1.3)
      .setDepth(y + 1);

    // Monitor — screen-facing (_down orientation), sits on desk surface
    const deskKey = this.getDeskKey(agent.status);
    this.desk = scene.add.image(x, y - 30, deskKey)
      .setOrigin(0.5, 0.5)
      .setScale(1.3)
      .setDepth(y + 2);  // On top of desk surface, screen visible to viewer

    this.activityText = scene.add.text(x + 2, y - 38, '...', {
      fontFamily: '"Segoe UI", "Helvetica Neue", Arial, sans-serif',
      fontSize: '16px',
      fontStyle: 'bold',
      color: this.getStatusHexColor(agent.status),
      align: 'center',
      stroke: '#101018',
      strokeThickness: 3,
      resolution: 2,
    }).setOrigin(0.5, 0.5);
    this.activityText.setDepth(y + 4);

    // Coffee mug — right side of desk, away from monitor
    this.coffeeMug = scene.add.image(x + 42, y + 8, 'furniture_coffee_mug')
      .setOrigin(0.5, 1).setScale(1.4).setDepth(y + 3);

    // Shadow (unused graphics object kept for destroy() compatibility)
    this.deskShadow = scene.add.graphics();
    this.deskShadow.setDepth(y - 1);

    this.activityRing = scene.add.graphics();
    this.activityRing.setDepth(y - 2);
    this.drawActivityRing(x, y + 2, agent.status);

    // Name badge — above avatar head (avatar center y-70, head top ≈ y-91, badge at y-140)
    // badge height = 44px → badge bottom at y-96, leaving 5px gap above avatar top
    const labelY = y - 140;

    // Background pill behind name + status
    this.badgeBg = scene.add.graphics();

    // Name text — bold, clean, high contrast
    this.nameText = scene.add.text(x, labelY + 5, agent.name, {
      fontFamily: '"Segoe UI", "Helvetica Neue", Arial, sans-serif',
      fontSize: '16px',
      fontStyle: 'bold',
      color: '#ffffff',
      align: 'center',
      stroke: '#000000',
      strokeThickness: 4,
      resolution: 2,
    }).setOrigin(0.5, 0);
    this.nameText.setDepth(901);

    // Status dot
    this.statusDot = scene.add.graphics();

    // Status text — colored with outline
    const statusColor = this.getStatusHexColor(agent.status);
    this.statusText = scene.add.text(x, labelY + 24, STATUS_LABELS[agent.status], {
      fontFamily: '"Segoe UI", "Helvetica Neue", Arial, sans-serif',
      fontSize: '13px',
      fontStyle: 'bold',
      color: statusColor,
      align: 'center',
      stroke: '#000000',
      strokeThickness: 3,
      resolution: 2,
    }).setOrigin(0.5, 0);
    this.statusText.setDepth(901);

    // Draw background and status dot
    this.drawLabelBackground(x, labelY);
    this.drawStatusDot(x, labelY + 22, agent.status);

    this.startAnimation(agent.status);
  }

  private getStatusHexColor(status: AgentStatus): string {
    const num = STATUS_COLORS[status] ?? COLORS.statusIdle;
    return '#' + num.toString(16).padStart(6, '0');
  }

  private getDeskKey(_status: AgentStatus): string {
    // Always show coding desk — all agents are always working
    return this.deskVariant === 'black' ? DESK_KEYS.blackCoding : DESK_KEYS.whiteCoding;
  }

  private getAvatarKey(_status: AgentStatus): string {
    // Always start in talk frame — animation will cycle from there
    return avatarKeys(this.characterName).talk;
  }

  private drawLabelBackground(x: number, labelY: number): void {
    const nameW = Math.max(this.nameText.width, this.statusText.width + 18);
    const bgW = nameW + 20;
    const bgH = 44;
    // Solid dark background with rounded corners
    this.badgeBg.fillStyle(0x1a1225, 0.95);
    this.badgeBg.fillRoundedRect(x - bgW / 2, labelY, bgW, bgH, 5);
    // Subtle border
    this.badgeBg.lineStyle(1, 0x6a5a80, 0.4);
    this.badgeBg.strokeRoundedRect(x - bgW / 2, labelY, bgW, bgH, 4);
    this.badgeBg.setDepth(900);
  }

  private drawStatusDot(x: number, _statusY: number, status: AgentStatus): void {
    const dotColor = STATUS_COLORS[status] ?? COLORS.statusIdle;
    const textW = Math.max(this.statusText.width, 24);
    this.statusDot.fillStyle(dotColor, 1);
    this.statusDot.fillCircle(x - textW / 2 - 5, this.statusText.y + this.statusText.height / 2, 3);
    this.statusDot.setDepth(901);
  }

  private drawActivityRing(x: number, y: number, status: AgentStatus): void {
    this.pulseTween?.stop();
    this.activityRing.clear();
    this.activityRing.setScale(1);

    const color = STATUS_COLORS[status] ?? COLORS.statusIdle;
    const alpha = status === 'idle' ? 0.16 : status === 'done' ? 0.24 : 0.44;

    this.activityRing.lineStyle(3, color, alpha);
    this.activityRing.strokeEllipse(x, y, 132, 54);
    this.activityRing.fillStyle(color, status === 'idle' ? 0.035 : 0.08);
    this.activityRing.fillEllipse(x, y, 132, 54);

    const shouldPulse = status === 'working' || status === 'delivering' || status === 'checkpoint';
    if (shouldPulse) {
      this.pulseTween = this.scene.tweens.add({
        targets: this.activityRing,
        alpha: { from: 0.45, to: 1 },
        scaleX: { from: 0.96, to: 1.08 },
        scaleY: { from: 0.96, to: 1.08 },
        duration: status === 'checkpoint' ? 620 : 920,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
      });
    } else if (status === 'idle') {
      this.pulseTween = this.scene.tweens.add({
        targets: this.activityRing,
        alpha: { from: 0.35, to: 0.7 },
        duration: 1800,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
      });
    }
  }

  private setAvatarFrame(key: string): void {
    this.avatar.setTexture(key);
    // Scale uniformly so height matches the reference (talk frame) — preserves aspect ratio
    this.avatar.setScale(this.avatarDisplayH / this.avatar.height);
  }

  private startAnimation(_status: AgentStatus): void {
    this.bobTween?.stop();
    this.activityTween?.stop();
    this.avatar.y = this.avatarBaseY;

    // Always run a visible ambient animation; idle means available, not frozen.
    const keys = avatarKeys(this.characterName);
    let frame = 0;
    this.animTimer = this.scene.time.addEvent({
      delay: _status === 'working' || _status === 'delivering' ? 360 : 620,
      loop: true,
      callback: () => {
        frame = (frame + 1) % 2;
        this.setAvatarFrame(frame === 0 ? keys.talk : keys.blink);
      },
    });

    const active = _status === 'working' || _status === 'delivering' || _status === 'checkpoint';
    this.bobTween = this.scene.tweens.add({
      targets: this.avatar,
      y: this.avatarBaseY - (active ? 7 : 3),
      duration: active ? 520 : 1350,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });

    this.activityText.setText(active ? '•••' : '•');
    this.activityText.setColor(this.getStatusHexColor(_status));
    this.activityTween = this.scene.tweens.add({
      targets: this.activityText,
      y: this.activityText.y - (active ? 8 : 4),
      alpha: { from: active ? 1 : 0.35, to: active ? 0.35 : 0.75 },
      duration: active ? 520 : 1300,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });
  }

  updateStatus(agent: Agent): void {
    if (this.agent.status === agent.status) return;
    this.agent = agent;

    this.desk.setTexture(this.getDeskKey(agent.status));
    this.setAvatarFrame(this.getAvatarKey(agent.status));

    this.animTimer?.destroy();
    this.startAnimation(agent.status);

    // Update status text and dot
    this.statusText.setText(STATUS_LABELS[agent.status]);
    this.statusText.setColor(this.getStatusHexColor(agent.status));
    this.activityText.setColor(this.getStatusHexColor(agent.status));

    this.statusDot.clear();
    const dotColor = STATUS_COLORS[agent.status] ?? COLORS.statusIdle;
    this.statusDot.fillStyle(dotColor, 1);
    const textW = Math.max(this.statusText.width, 24);
    this.statusDot.fillCircle(
      this.statusText.x - textW / 2 - 5,
      this.statusText.y + this.statusText.height / 2,
      3,
    );
    this.drawActivityRing(this.deskTable.x, this.deskTable.y + 2, agent.status);
  }

  destroy(): void {
    this.animTimer?.destroy();
    this.pulseTween?.stop();
    this.bobTween?.stop();
    this.activityTween?.stop();
    this.deskTable.destroy();
    this.deskShadow.destroy();
    this.desk.destroy();
    this.coffeeMug.destroy();
    this.avatar.destroy();
    this.activityText.destroy();
    this.activityRing.destroy();
    this.nameText.destroy();
    this.badgeBg.destroy();
    this.statusDot.destroy();
    this.statusText.destroy();
  }
}
