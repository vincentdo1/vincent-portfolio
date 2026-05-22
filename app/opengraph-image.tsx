import { ImageResponse } from "next/og";

export const alt = "Vincent Do — Software Engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#0c1610",
          color: "#ECE8E1",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          position: "relative",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        {/* faint grid */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        {/* corner brackets */}
        <div
          style={{
            position: "absolute",
            top: 40,
            left: 40,
            width: 24,
            height: 24,
            borderTop: "2px solid #85ED50",
            borderLeft: "2px solid #85ED50",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 40,
            right: 40,
            width: 24,
            height: 24,
            borderTop: "2px solid #85ED50",
            borderRight: "2px solid #85ED50",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 40,
            left: 40,
            width: 24,
            height: 24,
            borderBottom: "2px solid #85ED50",
            borderLeft: "2px solid #85ED50",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 40,
            right: 40,
            width: 24,
            height: 24,
            borderBottom: "2px solid #85ED50",
            borderRight: "2px solid #85ED50",
          }}
        />

        {/* eyebrow */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            marginBottom: 24,
          }}
        >
          <div
            style={{
              width: 32,
              height: 1,
              background: "#85ED50",
            }}
          />
          <div
            style={{
              color: "#85ED50",
              fontSize: 22,
              letterSpacing: "0.3em",
              textTransform: "uppercase",
            }}
          >
            Hello, I&apos;m
          </div>
        </div>

        {/* name */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            fontSize: 180,
            fontWeight: 800,
            lineHeight: 0.9,
            letterSpacing: "-0.03em",
            textTransform: "uppercase",
          }}
        >
          <div style={{ color: "#ECE8E1" }}>Vincent</div>
          <div style={{ color: "#85ED50" }}>Do_</div>
        </div>

        {/* footer line */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: 48,
            color: "#999",
            fontSize: 26,
            letterSpacing: "0.04em",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: 4,
                background: "#85ED50",
              }}
            />
            Software Engineer · Boeing · St. Louis
          </div>
          <div
            style={{
              fontSize: 22,
              color: "#666",
              letterSpacing: "0.2em",
            }}
          >
            VMD306.COM
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
