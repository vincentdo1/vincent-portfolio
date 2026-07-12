import Image from "next/image";

export function GlobeFallback() {
  return (
    <div className="absolute inset-0">
      <Image
        src="/projects/airport-globe-fallback.jpg"
        alt="Static view of the airport route globe showing flight arcs across Asia"
        fill
        sizes="(min-width: 1280px) 860px, calc(100vw - 2rem)"
        className="object-cover"
      />
    </div>
  );
}
