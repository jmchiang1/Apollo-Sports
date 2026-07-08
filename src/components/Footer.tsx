import { Mail, Phone } from "lucide-react";
import { footer, nav, todo } from "@/config/siteConfig";
import { Wordmark } from "./Wordmark";
import { TodoText } from "./Todo";
import { InstagramIcon, FacebookIcon } from "./SocialIcons";

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-grid">
          {/* brand */}
          <div>
            <Wordmark invert />
            <p className="footer-tagline">{footer.tagline}</p>
            <div className="footer-socials">
              <span title="Handle coming soon" className="footer-social">
                <InstagramIcon className="footer-social-icon" />
              </span>
              <span title="Handle coming soon" className="footer-social">
                <FacebookIcon className="footer-social-icon" />
              </span>
            </div>
          </div>

          {/* explore */}
          <div>
            <h4 className="footer-col-title">Explore</h4>
            <ul className="footer-links">
              {nav.map((item) => (
                <li key={item.href}>
                  <a href={item.href} className="footer-link">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* contact */}
          <div>
            <h4 className="footer-col-title">Contact</h4>
            <ul className="footer-contact-list">
              <li className="footer-contact-item">
                <Mail className="footer-contact-icon" />
                <TodoText>{footer.contact.email}</TodoText>
              </li>
              <li className="footer-contact-item">
                <Phone className="footer-contact-icon" />
                <TodoText>{footer.contact.phone}</TodoText>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-legal">{footer.legal}</p>
          <p className="footer-note">
            Made in Nassau County · {todo.opening} · 🐾
          </p>
        </div>
      </div>
    </footer>
  );
}
