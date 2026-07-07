import { cn } from "@/lib/cn";
import { Reveal } from "./Reveal";
import { iconMap, type IconName } from "./icons";
import { TodoText } from "./Todo";

const tones = {
  peach: "bg-peach text-plum",
  gold: "bg-gold text-plum",
  rose: "bg-rose text-plum",
  plum: "bg-plum text-gold",
} as const;

export type Tone = keyof typeof tones;

type ProgramCardProps = {
  name: string;
  body: string;
  icon: string;
  note?: string;
  tone?: Tone;
};

export function ProgramCard({ name, body, icon, note, tone = "peach" }: ProgramCardProps) {
  const Icon = iconMap[icon as IconName];

  return (
    <Reveal>
      <article className="group flex h-full flex-col rounded-3xl border-2 border-plum/10 bg-cream p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-[8px_8px_0_0_rgba(56,40,44,0.12)]">
        <span
          className={cn(
            "grid h-12 w-12 place-items-center rounded-2xl transition-transform duration-300 group-hover:-rotate-6",
            tones[tone],
          )}
        >
          {Icon ? <Icon className="h-6 w-6" strokeWidth={2} /> : null}
        </span>
        <h3 className="mt-5 font-display text-xl font-extrabold text-ink">{name}</h3>
        <p className="mt-2 flex-grow text-[0.97rem] leading-relaxed text-muted">
          {body}
        </p>
        {note && (
          <p className="mt-4 text-sm">
            <TodoText>{note}</TodoText>
          </p>
        )}
      </article>
    </Reveal>
  );
}
