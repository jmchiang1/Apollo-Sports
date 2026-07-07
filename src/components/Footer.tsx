import { Mail, Phone } from "lucide-react";
import { footer, nav, todo } from "@/config/siteConfig";
import { Wordmark } from "./Wordmark";
import { TodoText } from "./Todo";
import { InstagramIcon, FacebookIcon } from "./SocialIcons";
import { ApolloMascot } from "./ApolloMascot";

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-plum text-cream">
      <div className="mx-auto max-w-6xl px-6 py-16 sm:px-8">
        <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1.1fr]">
          {/* brand */}
          <div>
            <Wordmark invert />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-cream/60">
              {footer.tagline}
            </p>
            <div className="mt-6 flex items-center gap-3">
              <span
                title="Handle coming soon"
                className="grid h-10 w-10 place-items-center rounded-full text-cream/70 ring-1 ring-cream/15 transition-colors hover:text-gold hover:ring-cream/40"
              >
                <InstagramIcon className="h-5 w-5" />
              </span>
              <span
                title="Handle coming soon"
                className="grid h-10 w-10 place-items-center rounded-full text-cream/70 ring-1 ring-cream/15 transition-colors hover:text-gold hover:ring-cream/40"
              >
                <FacebookIcon className="h-5 w-5" />
              </span>
              <span className="text-xs text-cream/45">
                <TodoText>{footer.social.instagram}</TodoText>
              </span>
            </div>
          </div>

          {/* explore */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.16em] text-cream/40">
              Explore
            </h4>
            <ul className="mt-4 space-y-3">
              {nav.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="text-sm font-medium text-cream/70 transition-colors hover:text-gold"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* contact */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.16em] text-cream/40">
              Contact
            </h4>
            <ul className="mt-4 space-y-3 text-sm text-cream/70">
              <li className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 shrink-0 text-gold" />
                <TodoText>{footer.contact.email}</TodoText>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 shrink-0 text-gold" />
                <TodoText>{footer.contact.phone}</TodoText>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-cream/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-cream/50">{footer.legal}</p>
          <p className="text-xs text-cream/40">
            Made in Nassau County · {todo.opening} · 🐾
          </p>
        </div>
      </div>

      {/* giant wordmark finale */}
      <div className="relative flex items-center justify-center gap-4 border-t border-cream/10 py-8">
        <ApolloMascot className="h-12 w-12 shrink-0 sm:h-16 sm:w-16" />
        <span className="font-display text-[clamp(3rem,14vw,10rem)] font-extrabold leading-none tracking-tight text-cream/10">
          APOLLO
        </span>
      </div>
    </footer>
  );
}
