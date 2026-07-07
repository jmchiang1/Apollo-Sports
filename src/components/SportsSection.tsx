import Image from "next/image";
import { Check } from "lucide-react";
import { sports } from "@/config/siteConfig";
import { cn } from "@/lib/cn";
import { SectionWrapper, Reveal } from "./Reveal";
import { OverlayGraphic } from "./OverlayGraphic";

const CARD_IMAGES = [
  { src: "/court-badminton.jpg", alt: "Indoor badminton court with rackets and shuttlecocks" },
  { src: "/court-pickleball.jpg", alt: "A player rallying on an indoor pickleball court" },
];

function SportRow({
  title,
  body,
  features,
  lead,
  image,
}: {
  title: string;
  body: string;
  features: readonly string[];
  lead: boolean;
  image: { src: string; alt: string };
}) {
  const flip = !lead; // second row mirrors

  return (
    <Reveal>
      <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
        {/* photo panel */}
        <div className={cn(flip && "lg:order-2")}>
          <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] border-2 border-plum/10 shadow-[10px_10px_0_0_rgba(38,34,30,0.12)]">
            <Image
              src={image.src}
              alt={image.alt}
              fill
              sizes="(max-width: 1024px) 100vw, 45vw"
              className="object-cover"
            />
          </div>
        </div>

        {/* text */}
        <div className={cn(flip && "lg:order-1")}>
          <h3 className="font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
            {title}
          </h3>
          <p className="mt-4 max-w-lg text-lg leading-relaxed text-ink/75">{body}</p>
          <ul className="mt-6 space-y-3">
            {features.map((f) => (
              <li key={f} className="flex items-center gap-3">
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-gold text-plum">
                  <Check className="h-4 w-4" strokeWidth={3} />
                </span>
                <span className="font-semibold text-ink">{f}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Reveal>
  );
}

export function SportsSection() {
  return (
    <SectionWrapper id="sports" className="relative overflow-hidden bg-peach">
      {/* big pickleball watermark bleeding off the top-right corner */}
      <OverlayGraphic
        src="/pickleball.svg"
        className="-right-20 -top-24 h-96 w-96 rotate-12"
      />

      <div className="relative">
        <div className="max-w-2xl">
          <Reveal
            as="h2"
            className="font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl lg:text-[3rem]"
          >
            {sports.heading}
          </Reveal>
        </div>

        <div className="mt-14 space-y-14 sm:mt-16 sm:space-y-20">
          {sports.cards.map((card, i) => (
            <SportRow
              key={card.name}
              title={`${card.courts} ${card.name} courts`}
              body={card.body}
              features={card.features}
              lead={card.lead}
              image={CARD_IMAGES[i]}
            />
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
