import { Mail, Phone } from "lucide-react";
import { footer, nav, todo, brand } from "@/config/siteConfig";
import { LuxeWordmark } from "./LuxeWordmark";
import { ApolloMark } from "./ApolloMark";
import { TodoText } from "@/components/Todo";
import { InstagramIcon, FacebookIcon } from "@/components/SocialIcons";

export function LuxeFooter() {
  return (
    <footer className="bg-forest-deep text-butter">
      <div className="mx-auto max-w-6xl px-6 py-20 sm:px-8">
        <div className="grid gap-12 md:grid-cols-[1.5fr_1fr_1.1fr]">
          <div>
            <LuxeWordmark invert />
            <p className="mt-5 max-w-xs font-luxe text-sm font-light leading-relaxed text-butter/55">
              {footer.tagline}
            </p>
            <div className="mt-6 flex items-center gap-3">
              <span
                title="Handle coming soon"
                className="grid h-10 w-10 place-items-center rounded-full border border-butter/20 text-butter/70 transition-colors hover:border-brass-light hover:text-brass-light"
              >
                <InstagramIcon className="h-5 w-5" />
              </span>
              <span
                title="Handle coming soon"
                className="grid h-10 w-10 place-items-center rounded-full border border-butter/20 text-butter/70 transition-colors hover:border-brass-light hover:text-brass-light"
              >
                <FacebookIcon className="h-5 w-5" />
              </span>
            </div>
          </div>

          <div>
            <h4 className="luxe-eyebrow text-butter/40">Explore</h4>
            <ul className="mt-5 space-y-3">
              {nav.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="font-luxe text-sm font-light text-butter/70 transition-colors hover:text-brass-light"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="luxe-eyebrow text-butter/40">Contact</h4>
            <ul className="mt-5 space-y-3 font-luxe text-sm font-light text-butter/70">
              <li className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 shrink-0 text-brass-light" />
                <TodoText>{footer.contact.email}</TodoText>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 shrink-0 text-brass-light" />
                <TodoText>{footer.contact.phone}</TodoText>
              </li>
            </ul>
          </div>
        </div>

        {/* finale */}
        <div className="mt-16 flex flex-col items-center gap-5 border-t border-butter/10 pt-14 text-center">
          <ApolloMark className="h-10 w-10 text-brass-light" />
          <p className="font-serif text-3xl font-medium tracking-tight text-butter/90">
            {brand.name}
          </p>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-butter/10 pt-6 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">
          <p className="font-luxe text-xs text-butter/45">{footer.legal}</p>
          <p className="font-luxe text-xs uppercase tracking-[0.2em] text-butter/40">
            Nassau County · {todo.opening}
          </p>
        </div>
      </div>
    </footer>
  );
}
