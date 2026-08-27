import { useSquadSocket } from "@/hooks/useSquadSocket";
import { SquadSelector } from "@/components/SquadSelector";
import { PhaserGame } from "@/office/PhaserGame";
import { StatusBar } from "@/components/StatusBar";

export function App() {
  useSquadSocket();

  return (
    <div
      style={{
        position: "relative",
        height: "100%",
        width: "100%",
        overflow: "hidden",
        background: "var(--bg-primary)",
      }}
    >
      <header
        style={{
          position: "absolute",
          zIndex: 10,
          top: 12,
          left: 12,
          right: 12,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 14px",
          height: 38,
          border: "1px solid var(--border)",
          borderRadius: 8,
          background: "rgba(20, 20, 34, 0.84)",
          backdropFilter: "blur(10px)",
          fontSize: 13,
          fontWeight: 600,
          letterSpacing: 0.5,
        }}
      >
        <span>HUMAN / Human Team</span>
        <span style={{ color: "var(--text-secondary)", fontSize: 12 }}>
          mapa visual dos agentes
        </span>
      </header>

      <main
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            zIndex: 9,
            top: 62,
            left: 12,
            bottom: 58,
            width: 260,
            border: "1px solid var(--border)",
            borderRadius: 8,
            overflow: "hidden",
            boxShadow: "0 24px 80px rgba(0, 0, 0, 0.28)",
          }}
        >
        <SquadSelector />
        </div>
        <PhaserGame />
      </main>

      <StatusBar />
    </div>
  );
}
