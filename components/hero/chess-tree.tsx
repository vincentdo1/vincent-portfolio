import { CornerBrackets } from "@/components/valorant/corner-brackets";

type Node = {
  id: string;
  x: number;
  y: number;
  label?: string;
  eval?: string;
  pv?: boolean;
  best?: boolean;
  depth: number;
};

type Edge = { from: string; to: string; pv?: boolean };

const nodes: Node[] = [
  { id: "root", x: 220, y: 40, pv: true, depth: 0 },
  { id: "n1", x: 96, y: 140, label: "e4", pv: true, depth: 1 },
  { id: "n2", x: 220, y: 140, label: "d4", depth: 1 },
  { id: "n3", x: 344, y: 140, label: "c4", depth: 1 },
  { id: "n11", x: 56, y: 250, label: "c5", pv: true, depth: 2 },
  { id: "n12", x: 152, y: 250, label: "e5", depth: 2 },
  { id: "n21", x: 220, y: 250, label: "Nf6", depth: 2 },
  { id: "n31", x: 344, y: 250, label: "e5", depth: 2 },
  { id: "n111", x: 56, y: 360, label: "Nf3", pv: true, depth: 3 },
  { id: "n112", x: 140, y: 360, label: "Nc3", eval: "+0.1", depth: 3 },
  { id: "n211", x: 220, y: 360, label: "c4", eval: "0.0", depth: 3 },
  { id: "n311", x: 344, y: 360, label: "Nc3", eval: "−0.2", depth: 3 },
  {
    id: "n1111",
    x: 96,
    y: 442,
    label: "d6",
    eval: "+0.3",
    pv: true,
    best: true,
    depth: 4,
  },
];

const edges: Edge[] = [
  { from: "root", to: "n1", pv: true },
  { from: "root", to: "n2" },
  { from: "root", to: "n3" },
  { from: "n1", to: "n11", pv: true },
  { from: "n1", to: "n12" },
  { from: "n2", to: "n21" },
  { from: "n3", to: "n31" },
  { from: "n11", to: "n111", pv: true },
  { from: "n11", to: "n112" },
  { from: "n21", to: "n211" },
  { from: "n31", to: "n311" },
  { from: "n111", to: "n1111", pv: true },
];

const byId = Object.fromEntries(nodes.map((n) => [n.id, n]));
const depthDelay = (depth: number) => `${0.15 + depth * 0.18}s`;

/**
 * Decorative move-search tree: server-rendered SVG animated purely with
 * CSS, so it costs no JavaScript and stays visible without it.
 */
export function ChessTree() {
  return (
    <div className="relative border border-border/60 bg-card/30 p-5">
      <CornerBrackets size={14} thickness={1.5} />

      <div className="flex items-center justify-between border-b border-border/60 pb-3 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
        <span>Move search</span>
        <span className="text-primary">depth 4</span>
      </div>

      <svg
        viewBox="0 0 440 470"
        className="mt-2 w-full"
        aria-hidden="true"
        focusable="false"
      >
        {edges.map((e) => {
          const a = byId[e.from];
          const b = byId[e.to];
          return (
            <line
              key={`${e.from}-${e.to}`}
              x1={a.x}
              y1={a.y}
              x2={b.x}
              y2={b.y}
              className={e.pv ? "tree-edge tree-pv" : "tree-edge"}
              style={
                {
                  "--tree-delay": depthDelay(byId[e.to].depth),
                } as React.CSSProperties
              }
              stroke={e.pv ? "var(--primary)" : "var(--border)"}
              strokeWidth={e.pv ? 1.5 : 1}
            />
          );
        })}

        {nodes.map((n) => {
          const size = n.best ? 16 : n.id === "root" ? 14 : 10;
          const half = size / 2;
          return (
            <g
              key={n.id}
              className={n.best ? "tree-node tree-best" : "tree-node"}
              style={
                { "--tree-delay": depthDelay(n.depth) } as React.CSSProperties
              }
            >
              <rect
                x={n.x - half}
                y={n.y - half}
                width={size}
                height={size}
                fill={n.pv ? "var(--primary)" : "var(--card)"}
                stroke={n.pv ? "var(--primary)" : "var(--muted-foreground)"}
                strokeWidth={1}
              />
              {n.label && (
                <text
                  x={n.x + half + 7}
                  y={n.y + 4}
                  className="tree-label"
                  style={
                    {
                      "--tree-delay": depthDelay(n.depth),
                    } as React.CSSProperties
                  }
                  fontFamily="var(--font-mono)"
                  fontSize="13"
                  fill={n.pv ? "var(--primary)" : "var(--muted-foreground)"}
                >
                  {n.label}
                </text>
              )}
              {n.eval && (
                <text
                  x={n.x + half + 7}
                  y={n.y + 20}
                  className="tree-label"
                  style={
                    {
                      "--tree-delay": depthDelay(n.depth),
                    } as React.CSSProperties
                  }
                  fontFamily="var(--font-mono)"
                  fontSize="12"
                  fill={n.best ? "var(--primary)" : "var(--muted-foreground)"}
                  opacity={n.best ? 1 : 0.7}
                >
                  {n.eval}
                </text>
              )}
            </g>
          );
        })}
      </svg>

      <div className="mt-2 flex items-center justify-between border-t border-border/60 pt-3 font-mono text-xs text-muted-foreground">
        <span className="uppercase tracking-[0.18em]">Principal variation</span>
        <span className="tracking-[0.14em] text-foreground/80">
          e4 · c5 · Nf3 · d6
        </span>
      </div>
    </div>
  );
}
