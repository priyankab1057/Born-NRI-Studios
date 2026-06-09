import { useState, useEffect, useRef } from "react";

const PHOTOS = [
  { id: 1, category: "portrait", src: "https://res-console.cloudinary.com/dh6xo1aun/thumbnails/v1/image/upload/v1777962658/RFNDMDYxMTlfbjh3Z3lu/drilldown", title: "Gender Reveal Portrait" },
  { id: 2, category: "wedding", src: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80", title: "Wedding Bloom" },
  { id: 3, category: "aerial", src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80", title: "Mountain Aerial" },
  { id: 4, category: "portrait", src: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&q=80", title: "Studio Gaze" },
  { id: 5, category: "wedding", src: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800&q=80", title: "First Dance" },
  { id: 6, category: "aerial", src: "https://images.unsplash.com/photo-1473116763249-2faaef81ccda?w=800&q=80", title: "Coast From Above" },
  { id: 7, category: "portrait", src: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&q=80", title: "Natural Light" },
  { id: 8, category: "wedding", src: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800&q=80", title: "Candid Joy" },
  { id: 9, category: "aerial", src: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=800&q=80", title: "City Grid" },
];

const PACKAGES = [
  {
    name: "Essential",
    price: "$450",
    hours: "2 Hours",
    highlights: ["150+ edited photos", "1 location", "Online gallery", "Print release"],
  },
  {
    name: "Signature",
    price: "$950",
    hours: "4 Hours",
    highlights: ["400+ edited photos", "2 locations", "Drone footage included", "Rush delivery", "Canvas print"],
    featured: true,
  },
  {
    name: "Elite",
    price: "$1,800",
    hours: "Full Day",
    highlights: ["Unlimited photos", "Multiple locations", "4K drone video", "Same-week delivery", "10 prints + album"],
  },
];

const TESTIMONIALS = [
  { name: "Priya & Arjun", event: "Wedding", stars: 5, text: "Our photos are beyond magical. Every moment captured perfectly — we cry every time we look at them." },
  { name: "Marcus T.", event: "Corporate Headshots", stars: 5, text: "Booked on a Tuesday, had stunning shots by Friday. Pure professionalism and incredible eye for light." },
  { name: "The Hendersons", event: "Family Session", stars: 5, text: "The drone footage of our beach session is something we'll treasure forever. Absolute genius." },
];

const NAV_SECTIONS = ["work", "video", "packages", "about", "contact"];

function useScrollReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("revealed"); }),
      { threshold: 0.12 }
    );
    document.querySelectorAll(".reveal").forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

function useActiveSection() {
  const [active, setActive] = useState("hero");
  useEffect(() => {
    const handler = () => {
      const offsets = ["hero", ...NAV_SECTIONS].map(id => {
        const el = document.getElementById(id);
        return el ? { id, top: el.getBoundingClientRect().top } : null;
      }).filter(Boolean);
      const current = offsets.filter(o => o.top <= 80).pop();
      if (current) setActive(current.id);
    };
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);
  return active;
}

function useScrollProgress() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const handler = () => {
      const doc = document.documentElement;
      const scrolled = doc.scrollTop || document.body.scrollTop;
      const total = doc.scrollHeight - doc.clientHeight;
      setProgress(total > 0 ? (scrolled / total) * 100 : 0);
    };
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);
  return progress;
}

export default function PhotographyPortfolio() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [lightbox, setLightbox] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", event: "", date: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const heroRef = useRef(null);
  const [scrollY, setScrollY] = useState(0);
  const activeSection = useActiveSection();
  const scrollProgress = useScrollProgress();
  useScrollReveal();

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const filtered = activeFilter === "all" ? PHOTOS : PHOTOS.filter(p => p.category === activeFilter);

  const handleBook = async (e) => {
    e.preventDefault();
    const res = await fetch("https://formspree.io/f/mdabglnz", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    if (res.ok) setSubmitted(true);
  };

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  const navScrolled = scrollY > 60;

  return (
    <div style={styles.root}>
      <style>{css}</style>

      {/* SCROLL PROGRESS BAR */}
      <div style={{ ...styles.progressBar, width: `${scrollProgress}%` }} />

      {/* NAV */}
      <nav style={{
        ...styles.nav,
        background: navScrolled ? "rgba(6,4,2,0.97)" : "transparent",
        borderBottom: navScrolled ? "1px solid rgba(200,169,110,0.12)" : "1px solid transparent",
        backdropFilter: navScrolled ? "blur(16px)" : "none",
        padding: navScrolled ? "0.85rem 3rem" : "1.4rem 3rem",
      }}>
        <div style={styles.navLogo} onClick={() => scrollTo("hero")}>
          <span style={styles.logoMark}>✦</span>
          <span>Born NRI Studios</span>
        </div>

        {/* DESKTOP NAV LINKS */}
        <div style={styles.navLinks} className="nav-links-desktop">
          {NAV_SECTIONS.map(s => (
            <button
              key={s}
              style={styles.navBtn}
              className={`nav-btn ${activeSection === s ? "nav-btn-active" : ""}`}
              onClick={() => scrollTo(s)}
            >
              {s === "work" ? "WORK" : s === "video" ? "VIDEO" : s === "packages" ? "PACKAGES" : s === "about" ? "ABOUT" : "CONTACT"}
            </button>
          ))}
          <button style={styles.navCTA} className="nav-cta" onClick={() => scrollTo("contact")}>BOOK NOW</button>
        </div>

        {/* HAMBURGER */}
        <button
          style={styles.burger}
          className={`burger-btn ${menuOpen ? "burger-open" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span style={styles.burgerLine} className="burger-line burger-line-1" />
          <span style={styles.burgerLine} className="burger-line burger-line-2" />
          <span style={styles.burgerLine} className="burger-line burger-line-3" />
        </button>
      </nav>

      {/* MOBILE MENU OVERLAY */}
      <div style={{ ...styles.mobileMenu, ...(menuOpen ? styles.mobileMenuOpen : {}) }} className="mobile-menu">
        <div style={styles.mobileMenuInner}>
          <p style={styles.mobileMenuEyebrow}>NAVIGATION</p>
          {NAV_SECTIONS.map((s, i) => (
            <button
              key={s}
              style={{ ...styles.mobileNavBtn, animationDelay: `${0.05 + i * 0.07}s` }}
              className={`mobile-nav-btn ${menuOpen ? "mobile-nav-btn-visible" : ""} ${activeSection === s ? "mobile-nav-btn-active" : ""}`}
              onClick={() => scrollTo(s)}
            >
              <span style={styles.mobileNavNum}>0{i + 1}</span>
              <span style={styles.mobileNavLabel}>{s === "work" ? "WORK" : s === "video" ? "VIDEO" : s === "packages" ? "PACKAGES" : s === "about" ? "ABOUT" : "CONTACT"}</span>
              <span style={styles.mobileNavArrow}>→</span>
            </button>
          ))}
          <button style={styles.mobileBookBtn} onClick={() => scrollTo("contact")}>
            BOOK A SESSION &nbsp;✦
          </button>
          <p style={styles.mobileMenuFooter}>✦ Born NRI Studios · Est. 2025</p>
        </div>
      </div>

      {/* HERO */}
      <section id="hero" style={styles.hero} ref={heroRef}>
        <div style={{ ...styles.heroBg, transform: `translateY(${scrollY * 0.35}px)` }} />
        <div style={styles.heroOverlay} />
        <div style={styles.heroNoise} />
        <div style={styles.heroContent} className="fade-in">
          <div style={styles.heroDividerTop} />
          <p style={styles.heroEyebrow}>PHOTOGRAPHY &nbsp;✦&nbsp; AERIAL VIDEOGRAPHY</p>
          <h1 style={styles.heroTitle}>
            Moments That<br />
            <em style={styles.heroGold}>Live Forever</em>
          </h1>
          <div style={styles.heroDividerBottom} />
          <p style={styles.heroSub}>
            NewBorn · Portraits · Events · Graduation · PreWedding · House Warming · Product · Drone
          </p>
          <div style={styles.heroBtns}>
            <button style={styles.btnGold} className="btn-gold" onClick={() => scrollTo("work")}>VIEW MY WORK</button>
            <button style={styles.btnOutline} className="btn-outline" onClick={() => scrollTo("contact")}>BOOK A SESSION</button>
          </div>
        </div>
        <div style={styles.heroScroll}>
          <span style={styles.scrollLine} />
          <span style={styles.scrollText}>SCROLL</span>
        </div>
      </section>

      {/* STATS BAR */}
      <div style={styles.statsBar}>
        {[["500+", "Sessions Shot"], ["8", "Years Experience"], ["4.9★", "Average Rating"], ["12", "Awards Won"]].map(([num, label], i) => (
          <div key={label} style={{ ...styles.stat, ...(i < 3 ? styles.statBorder : {}) }}>
            <span style={styles.statNum}>{num}</span>
            <span style={styles.statLabel}>{label}</span>
          </div>
        ))}
      </div>

      {/* GALLERY */}
      <section id="work" style={styles.section}>
        <div style={styles.sectionHead} className="reveal">
          <p style={styles.eyebrow}>— PORTFOLIO —</p>
          <h2 style={styles.sectionTitle}>A Glimpse of My Work</h2>
          <div style={styles.titleUnderline} />
        </div>
        <div style={styles.filters} className="reveal">
          {["all", "portrait", "wedding", "aerial"].map(f => (
            <button
              key={f}
              style={{ ...styles.filterBtn, ...(activeFilter === f ? styles.filterActive : {}) }}
              className="filter-btn"
              onClick={() => setActiveFilter(f)}
            >
              {f.toUpperCase()}
            </button>
          ))}
        </div>
        <div style={styles.gallery} className="gallery-grid">
          {filtered.map((photo, i) => (
            <div
              key={photo.id}
              style={{ ...styles.galleryItem, animationDelay: `${i * 0.07}s` }}
              className="gallery-item reveal"
              onClick={() => setLightbox(photo)}
            >
              <img src={photo.src} alt={photo.title} style={styles.galleryImg} loading="lazy" />
              <div style={styles.galleryOverlay} className="gallery-overlay">
                <div style={styles.galleryMeta}>
                  <span style={styles.galleryTitle}>{photo.title}</span>
                  <span style={styles.galleryView}>VIEW ↗</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* LIGHTBOX */}
      {lightbox && (
        <div style={styles.lightboxBg} onClick={() => setLightbox(null)}>
          <button style={styles.lightboxClose} onClick={() => setLightbox(null)}>✕</button>
          <img
            src={lightbox.src.replace("w=800", "w=1400")}
            alt={lightbox.title}
            style={styles.lightboxImg}
            onClick={e => e.stopPropagation()}
          />
          <p style={styles.lightboxCaption}>{lightbox.title}</p>
        </div>
      )}

      {/* DRONE VIDEO */}
      <section id="video" style={styles.videoSection}>
        <div style={styles.videoInner}>
          <div style={styles.sectionHead} className="reveal">
            <p style={styles.eyebrowLight}>— AERIAL CINEMATOGRAPHY —</p>
            <h2 style={{ ...styles.sectionTitle, color: "#f0ebe2" }}>Drone Videography</h2>
            <div style={styles.titleUnderline} />
          </div>
          <p style={styles.videoCopy} className="reveal">
            From sweeping coastlines to intimate rooftop ceremonies — my drone captures the story from a perspective no one else can offer. Every flight is planned, permitted, and breathtaking.
          </p>
          <div style={styles.videoGrid}>
            {[
              { label: "Wedding Aerial Reel", thumb: "https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=80" },
              { label: "Nature & Landscape", thumb: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80" },
              { label: "Corporate Events", thumb: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=600&q=80" },
            ].map(v => (
              <div key={v.label} style={styles.videoCard} className="video-card reveal">
                <img src={v.thumb} alt={v.label} style={styles.videoThumb} />
                <div style={styles.videoCardOverlay} />
                <div style={styles.playCircle}>
                  <span style={styles.playIcon}>▶</span>
                </div>
                <div style={styles.videoLabel}>{v.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PACKAGES */}
      <section id="packages" style={styles.section}>
        <div style={styles.sectionHead} className="reveal">
          <p style={styles.eyebrow}>— INVESTMENT —</p>
          <h2 style={styles.sectionTitle}>Session Packages</h2>
          <div style={styles.titleUnderline} />
        </div>
        <div style={styles.packagesGrid}>
          {PACKAGES.map((pkg, i) => (
            <div
              key={pkg.name}
              style={{ ...styles.packageCard, ...(pkg.featured ? styles.packageFeatured : {}) }}
              className="package-card reveal"
            >
              {pkg.featured && <div style={styles.featuredBadge}>MOST POPULAR</div>}
              {pkg.featured && <div style={styles.featuredGlow} />}
              <h3 style={styles.pkgName}>{pkg.name}</h3>
              <div style={styles.pkgDivider} />
              <div style={styles.pkgPrice}>{pkg.price}</div>
              <div style={styles.pkgHours}>{pkg.hours}</div>
              <ul style={styles.pkgList}>
                {pkg.highlights.map(h => (
                  <li key={h} style={styles.pkgItem}>
                    <span style={styles.pkgCheck}>✦</span>
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
              <button style={pkg.featured ? styles.pkgBtnFeatured : styles.pkgBtn} className="pkg-btn" onClick={() => scrollTo("contact")}>
                BOOK THIS PACKAGE
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section style={styles.testimonialsSection}>
        <div style={styles.sectionHead} className="reveal">
          <p style={styles.eyebrowLight}>— KIND WORDS —</p>
          <h2 style={{ ...styles.sectionTitle, color: "#f0ebe2" }}>What Clients Say</h2>
          <div style={styles.titleUnderline} />
        </div>
        <div style={styles.testimonialsGrid}>
          {TESTIMONIALS.map(t => (
            <div key={t.name} style={styles.testimonialCard} className="testimonial-card reveal">
              <div style={styles.quoteIcon}>"</div>
              <div style={styles.starsRow}>{"★".repeat(t.stars)}</div>
              <p style={styles.testimonialText}>{t.text}</p>
              <div style={styles.testimonialDivider} />
              <div style={styles.testimonialAuthor}>
                <strong style={styles.testimonialName}>{t.name}</strong>
                <span style={styles.testimonialEvent}>{t.event}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" style={styles.aboutSection}>
        <div style={styles.aboutImgWrap} className="reveal">
          <div style={styles.aboutImgAccent} />
          <img src="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=700&q=80" alt="Photographer" style={styles.aboutImg} />
        </div>
        <div style={styles.aboutText} className="reveal">
          <p style={styles.eyebrow}>— ABOUT ME —</p>
          <h2 style={styles.sectionTitle}>The Eye Behind the Lens</h2>
          <div style={styles.titleUnderline} />
          <p style={styles.aboutCopy}>
            I'm a visual storyteller based in the heart of the city, specializing in weddings, portraits, and aerial cinematography. With 8 years behind the lens and hundreds of sessions across four continents, I believe every frame should feel inevitable — like it couldn't have been taken any other way.
          </p>
          <p style={styles.aboutCopy}>
            My drone certification and film-school background give me a rare dual perspective: intimate ground-level storytelling and cinematic aerial sweeps in the same session.
          </p>
          <div style={styles.aboutBadges}>
            {["FAA Drone Certified", "Adobe Certified", "Canon Explorer"].map(b => (
              <span key={b} style={styles.badge}>{b}</span>
            ))}
          </div>
        </div>
      </section>

      {/* BOOKING FORM */}
      <section id="contact" style={{ ...styles.section, background: "linear-gradient(180deg, #080604 0%, #0c0a07 100%)" }}>
        <div style={styles.sectionHead} className="reveal">
          <p style={styles.eyebrow}>— LET'S CREATE —</p>
          <h2 style={styles.sectionTitle}>Book Your Session</h2>
          <div style={styles.titleUnderline} />
          <p style={styles.formSubtitle}>Fill out the form below and I'll get back to you within 24 hours.</p>
        </div>

        {submitted ? (
          <div style={styles.successBox} className="reveal">
            <div style={styles.successIcon}>✦</div>
            <h3 style={{ color: "#c8a96e", marginBottom: "0.5rem", fontSize: "1.5rem", fontWeight: 300, letterSpacing: "0.05em" }}>You're on my radar!</h3>
            <p style={{ opacity: 0.75, lineHeight: 1.8 }}>Thanks {formData.name}! I'll be in touch within 24 hours to confirm your session.</p>
          </div>
        ) : (
          <form style={styles.form} onSubmit={handleBook} className="reveal">
            <div style={styles.formRow}>
              <div style={styles.formGroup}>
                <label style={styles.label}>YOUR NAME</label>
                <input style={styles.input} placeholder="Jane Smith" required value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })} />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>EMAIL ADDRESS</label>
                <input style={styles.input} type="email" placeholder="jane@email.com" required value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })} />
              </div>
            </div>
            <div style={styles.formRow}>
              <div style={styles.formGroup}>
                <label style={styles.label}>EVENT TYPE</label>
                <select style={styles.input} value={formData.event} onChange={e => setFormData({ ...formData, event: e.target.value })} required>
                  <option value="">Select event…</option>
                  <option>Wedding</option>
                  <option>Portrait Session</option>
                  <option>New Born</option>
                  <option>Maternity</option>
                  <option>House Warming</option>
                  <option>Corporate / Headshots</option>
                  <option>Drone / Aerial</option>
                  <option>Family Session</option>
                  <option>Other</option>
                </select>
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>PREFERRED DATE</label>
                <input style={styles.input} type="date" value={formData.date}
                  onChange={e => setFormData({ ...formData, date: e.target.value })} />
              </div>
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>TELL ME ABOUT YOUR VISION</label>
              <textarea style={{ ...styles.input, height: "140px", resize: "vertical" }}
                placeholder="Share any details, locations, or inspiration you have in mind…"
                value={formData.message} onChange={e => setFormData({ ...formData, message: e.target.value })} />
            </div>
            <button type="submit" style={styles.submitBtn} className="btn-gold">SEND BOOKING REQUEST &nbsp;✦</button>
          </form>
        )}
      </section>

      {/* FOOTER */}
      <footer style={styles.footer}>
        <div style={styles.footerDivider} />
        <div style={styles.footerLogo}>
          <span style={styles.logoMark}>✦</span>
          <span>Born NRI Studios</span>
        </div>
        <p style={styles.footerTagline}>Capturing Global Moments · EST. 2025</p>
        <div style={styles.footerLinks}>
          {["Instagram", "Facebook", "YouTube"].map(s => (
            <a key={s} href="#" style={styles.footerLink} className="footer-link">{s}</a>
          ))}
        </div>
        <p style={styles.footerCopy}>© 2025 Born NRI Photography. All rights reserved.</p>
      </footer>
    </div>
  );
}

const styles = {
  root: { fontFamily: "'Cormorant Garamond', Georgia, serif", background: "#080604", color: "#f0ebe2", minHeight: "100vh", overflowX: "hidden" },

  progressBar: { position: "fixed", top: 0, left: 0, height: "2px", background: "linear-gradient(to right, #c8a96e, #e8d4a0)", zIndex: 200, transition: "width 0.1s linear", pointerEvents: "none" },
  nav: { position: "fixed", top: "2px", left: 0, right: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "space-between", transition: "all 0.4s ease" },
  navLogo: { fontSize: "1.05rem", letterSpacing: "0.22em", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: "0.6rem", fontFamily: "'Raleway', sans-serif", zIndex: 101 },
  logoMark: { color: "#c8a96e", fontSize: "0.9rem" },
  navLinks: { display: "flex", gap: "2.2rem", alignItems: "center" },
  navBtn: { background: "none", border: "none", color: "#f0ebe2", cursor: "pointer", fontSize: "0.6rem", letterSpacing: "0.2em", opacity: 0.7, fontFamily: "'Raleway', sans-serif", fontWeight: 500, padding: "0.4rem 0", position: "relative" },
  navCTA: { background: "transparent", border: "1px solid #c8a96e", color: "#c8a96e", padding: "0.55rem 1.5rem", fontSize: "0.58rem", letterSpacing: "0.22em", cursor: "pointer", fontFamily: "'Raleway', sans-serif", fontWeight: 600, transition: "all 0.25s", marginLeft: "0.5rem" },
  burger: { display: "none", background: "none", border: "none", cursor: "pointer", padding: "0.5rem", flexDirection: "column", gap: "5px", zIndex: 101 },
  burgerLine: { display: "block", width: "24px", height: "1.5px", background: "#f0ebe2", transition: "all 0.35s cubic-bezier(0.23,1,0.32,1)", transformOrigin: "center" },
  mobileMenu: { position: "fixed", inset: 0, background: "rgba(6,4,2,0)", zIndex: 99, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none", transition: "background 0.4s ease" },
  mobileMenuOpen: { background: "rgba(6,4,2,0.98)", pointerEvents: "all" },
  mobileMenuInner: { textAlign: "center", padding: "2rem" },
  mobileMenuEyebrow: { fontSize: "0.52rem", letterSpacing: "0.35em", color: "rgba(200,169,110,0.5)", marginBottom: "2.5rem", fontFamily: "'Raleway', sans-serif" },
  mobileNavBtn: { display: "flex", alignItems: "center", gap: "1.5rem", background: "none", border: "none", color: "#f0ebe2", cursor: "pointer", padding: "1rem 0", width: "100%", borderBottom: "1px solid rgba(200,169,110,0.1)", opacity: 0, transform: "translateY(20px)", transition: "all 0.3s ease" },
  mobileNavNum: { fontSize: "0.6rem", color: "#c8a96e", fontFamily: "'Raleway', sans-serif", letterSpacing: "0.15em", width: "24px", textAlign: "left" },
  mobileNavLabel: { fontSize: "2rem", fontWeight: 300, letterSpacing: "0.12em", flex: 1, textAlign: "left", fontFamily: "'Cormorant Garamond', serif" },
  mobileNavArrow: { color: "#c8a96e", opacity: 0, transition: "opacity 0.2s, transform 0.2s", fontSize: "1.2rem" },
  mobileBookBtn: { background: "#c8a96e", border: "none", color: "#060402", padding: "1rem 3rem", fontSize: "0.62rem", letterSpacing: "0.25em", cursor: "pointer", fontFamily: "'Raleway', sans-serif", fontWeight: 700, marginTop: "2.5rem", transition: "all 0.3s" },
  mobileMenuFooter: { fontSize: "0.55rem", letterSpacing: "0.2em", color: "rgba(200,169,110,0.35)", marginTop: "2.5rem", fontFamily: "'Raleway', sans-serif" },

  hero: { position: "relative", height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" },
  heroBg: { position: "absolute", inset: "-20%", backgroundImage: "url(https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=1800&q=80)", backgroundSize: "cover", backgroundPosition: "center" },
  heroOverlay: { position: "absolute", inset: 0, background: "linear-gradient(160deg, rgba(6,4,2,0.82) 0%, rgba(6,4,2,0.5) 60%, rgba(6,4,2,0.78) 100%)" },
  heroNoise: { position: "absolute", inset: 0, opacity: 0.03, backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")", backgroundRepeat: "repeat" },
  heroContent: { position: "relative", textAlign: "center", maxWidth: "820px", padding: "2rem" },
  heroDividerTop: { width: "60px", height: "1px", background: "linear-gradient(to right, transparent, #c8a96e, transparent)", margin: "0 auto 2rem" },
  heroEyebrow: { fontSize: "0.6rem", letterSpacing: "0.35em", color: "#c8a96e", marginBottom: "1.8rem", fontFamily: "'Raleway', sans-serif", fontWeight: 500 },
  heroTitle: { fontSize: "clamp(3.2rem, 8.5vw, 6.5rem)", lineHeight: 1.02, fontWeight: 300, marginBottom: "1.5rem", letterSpacing: "-0.01em" },
  heroGold: { color: "#d4b47a", fontStyle: "italic", fontWeight: 300 },
  heroDividerBottom: { width: "40px", height: "1px", background: "linear-gradient(to right, transparent, #c8a96e, transparent)", margin: "0 auto 1.8rem" },
  heroSub: { fontSize: "0.85rem", opacity: 0.65, letterSpacing: "0.18em", marginBottom: "2.8rem", lineHeight: 1.9, fontFamily: "'Raleway', sans-serif" },
  heroBtns: { display: "flex", gap: "1.2rem", justifyContent: "center", flexWrap: "wrap" },
  btnGold: { background: "#c8a96e", border: "1px solid #c8a96e", color: "#060402", padding: "1rem 2.8rem", fontSize: "0.62rem", letterSpacing: "0.22em", cursor: "pointer", fontWeight: 700, fontFamily: "'Raleway', sans-serif", transition: "all 0.3s" },
  btnOutline: { background: "transparent", border: "1px solid rgba(200,169,110,0.55)", color: "#c8a96e", padding: "1rem 2.8rem", fontSize: "0.62rem", letterSpacing: "0.22em", cursor: "pointer", fontFamily: "'Raleway', sans-serif", fontWeight: 500, transition: "all 0.3s" },
  heroScroll: { position: "absolute", bottom: "2.5rem", left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.6rem" },
  scrollLine: { width: "1px", height: "55px", background: "linear-gradient(to bottom, transparent, #c8a96e)", display: "block", animation: "scrollPulse 2s ease-in-out infinite" },
  scrollText: { fontSize: "0.5rem", letterSpacing: "0.3em", color: "#c8a96e", fontFamily: "'Raleway', sans-serif" },

  statsBar: { display: "flex", justifyContent: "center", background: "#0c0a07", padding: "2.5rem 3rem", borderTop: "1px solid rgba(200,169,110,0.12)", borderBottom: "1px solid rgba(200,169,110,0.12)", flexWrap: "wrap", gap: "0" },
  stat: { textAlign: "center", padding: "0 3.5rem" },
  statBorder: { borderRight: "1px solid rgba(200,169,110,0.15)" },
  statNum: { display: "block", fontSize: "2.4rem", fontWeight: 300, color: "#c8a96e", letterSpacing: "-0.02em", marginBottom: "0.3rem" },
  statLabel: { fontSize: "0.58rem", letterSpacing: "0.25em", opacity: 0.55, fontFamily: "'Raleway', sans-serif", textTransform: "uppercase" },

  section: { maxWidth: "1200px", margin: "0 auto", padding: "7rem 2rem" },
  sectionHead: { textAlign: "center", marginBottom: "3.5rem" },
  eyebrow: { fontSize: "0.58rem", letterSpacing: "0.3em", color: "#c8a96e", marginBottom: "1rem", fontFamily: "'Raleway', sans-serif", fontWeight: 500 },
  eyebrowLight: { fontSize: "0.58rem", letterSpacing: "0.3em", color: "#c8a96e", marginBottom: "1rem", fontFamily: "'Raleway', sans-serif", fontWeight: 500 },
  sectionTitle: { fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 300, letterSpacing: "0.02em", marginBottom: "1rem" },
  titleUnderline: { width: "50px", height: "1px", background: "linear-gradient(to right, transparent, #c8a96e, transparent)", margin: "1rem auto 0" },

  filters: { display: "flex", gap: "0.5rem", justifyContent: "center", marginBottom: "3rem", flexWrap: "wrap" },
  filterBtn: { background: "none", border: "1px solid rgba(240,235,226,0.15)", color: "rgba(240,235,226,0.6)", padding: "0.55rem 1.8rem", fontSize: "0.58rem", letterSpacing: "0.2em", cursor: "pointer", fontFamily: "'Raleway', sans-serif", fontWeight: 500, transition: "all 0.3s" },
  filterActive: { background: "#c8a96e", borderColor: "#c8a96e", color: "#060402" },

  gallery: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.6rem" },
  galleryItem: { position: "relative", overflow: "hidden", cursor: "pointer", aspectRatio: "4/3" },
  galleryImg: { width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.6s cubic-bezier(0.25,0.46,0.45,0.94)" },
  galleryOverlay: { position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(6,4,2,0.85) 0%, transparent 50%)", opacity: 0, transition: "opacity 0.35s ease", display: "flex", flexDirection: "column", justifyContent: "flex-end" },
  galleryMeta: { padding: "1.5rem", transform: "translateY(8px)", transition: "transform 0.35s ease" },
  galleryTitle: { display: "block", color: "#f0ebe2", fontSize: "1.05rem", fontWeight: 300, marginBottom: "0.3rem" },
  galleryView: { display: "block", color: "#c8a96e", fontSize: "0.58rem", letterSpacing: "0.22em", fontFamily: "'Raleway', sans-serif" },

  lightboxBg: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.96)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" },
  lightboxClose: { position: "absolute", top: "1.5rem", right: "2rem", background: "none", border: "1px solid rgba(255,255,255,0.2)", color: "#fff", fontSize: "1rem", cursor: "pointer", width: "38px", height: "38px", display: "flex", alignItems: "center", justifyContent: "center", transition: "border-color 0.2s" },
  lightboxImg: { maxWidth: "90vw", maxHeight: "80vh", objectFit: "contain" },
  lightboxCaption: { marginTop: "1.2rem", color: "#c8a96e", letterSpacing: "0.18em", fontSize: "0.8rem", fontFamily: "'Raleway', sans-serif" },

  videoSection: { background: "#060402", padding: "7rem 2rem", borderTop: "1px solid rgba(200,169,110,0.08)", borderBottom: "1px solid rgba(200,169,110,0.08)" },
  videoInner: { maxWidth: "1200px", margin: "0 auto", textAlign: "center" },
  videoCopy: { maxWidth: "580px", margin: "0 auto 3.5rem", opacity: 0.65, lineHeight: 2, fontSize: "1.05rem" },
  videoGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1.2rem" },
  videoCard: { position: "relative", overflow: "hidden", cursor: "pointer", aspectRatio: "16/9" },
  videoThumb: { width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.6s cubic-bezier(0.25,0.46,0.45,0.94)", filter: "brightness(0.65)" },
  videoCardOverlay: { position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(6,4,2,0.7) 0%, transparent 60%)", transition: "background 0.3s" },
  playCircle: { position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -60%)", width: "54px", height: "54px", border: "1px solid rgba(200,169,110,0.7)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.3s", background: "rgba(200,169,110,0.1)" },
  playIcon: { color: "#c8a96e", fontSize: "1.1rem", marginLeft: "3px" },
  videoLabel: { position: "absolute", bottom: "1.2rem", left: "1.2rem", right: "1.2rem", color: "#f0ebe2", fontSize: "0.88rem", letterSpacing: "0.08em", fontWeight: 300 },

  packagesGrid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.5rem" },
  packageCard: { border: "1px solid rgba(200,169,110,0.18)", padding: "3rem 2rem 2.5rem", position: "relative", textAlign: "center", transition: "all 0.35s", background: "rgba(255,255,255,0.01)" },
  packageFeatured: { border: "1px solid rgba(200,169,110,0.6)", background: "rgba(200,169,110,0.04)", transform: "translateY(-8px)" },
  featuredBadge: { position: "absolute", top: "-1px", left: "50%", transform: "translateX(-50%)", background: "#c8a96e", color: "#060402", fontSize: "0.52rem", letterSpacing: "0.25em", padding: "0.35rem 1.2rem", fontWeight: 700, fontFamily: "'Raleway', sans-serif", whiteSpace: "nowrap" },
  featuredGlow: { position: "absolute", inset: -1, background: "linear-gradient(135deg, rgba(200,169,110,0.08), transparent)", pointerEvents: "none" },
  pkgName: { fontSize: "1.3rem", fontWeight: 300, letterSpacing: "0.15em", marginBottom: "0.8rem", textTransform: "uppercase" },
  pkgDivider: { width: "30px", height: "1px", background: "#c8a96e", margin: "0 auto 1.5rem", opacity: 0.5 },
  pkgPrice: { fontSize: "3.2rem", color: "#c8a96e", fontWeight: 300, letterSpacing: "-0.02em", lineHeight: 1 },
  pkgHours: { fontSize: "0.6rem", letterSpacing: "0.25em", opacity: 0.5, marginBottom: "2.2rem", marginTop: "0.5rem", fontFamily: "'Raleway', sans-serif" },
  pkgList: { listStyle: "none", padding: 0, marginBottom: "2.2rem", textAlign: "left" },
  pkgItem: { padding: "0.6rem 0", borderBottom: "1px solid rgba(240,235,226,0.06)", fontSize: "0.95rem", display: "flex", gap: "0.7rem", alignItems: "center" },
  pkgCheck: { color: "#c8a96e", fontSize: "0.6rem", flexShrink: 0 },
  pkgBtn: { background: "none", border: "1px solid rgba(200,169,110,0.4)", color: "#c8a96e", padding: "0.9rem 1.5rem", fontSize: "0.58rem", letterSpacing: "0.2em", cursor: "pointer", fontFamily: "'Raleway', sans-serif", fontWeight: 600, width: "100%", transition: "all 0.3s" },
  pkgBtnFeatured: { background: "#c8a96e", border: "1px solid #c8a96e", color: "#060402", padding: "0.9rem 1.5rem", fontSize: "0.58rem", letterSpacing: "0.2em", cursor: "pointer", fontFamily: "'Raleway', sans-serif", fontWeight: 700, width: "100%", transition: "all 0.3s" },

  testimonialsSection: { background: "#050403", padding: "7rem 2rem", borderTop: "1px solid rgba(200,169,110,0.08)" },
  testimonialsGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "1.5rem", maxWidth: "1200px", margin: "0 auto" },
  testimonialCard: { padding: "2.5rem 2rem", border: "1px solid rgba(200,169,110,0.12)", background: "rgba(255,255,255,0.01)", position: "relative", transition: "all 0.3s" },
  quoteIcon: { fontSize: "4rem", color: "#c8a96e", opacity: 0.2, lineHeight: 1, marginBottom: "0.5rem", fontFamily: "Georgia, serif" },
  starsRow: { color: "#c8a96e", fontSize: "0.75rem", letterSpacing: "0.15em", marginBottom: "1.2rem" },
  testimonialText: { fontSize: "1.05rem", lineHeight: 1.9, opacity: 0.8, marginBottom: "1.5rem", fontStyle: "italic" },
  testimonialDivider: { width: "30px", height: "1px", background: "rgba(200,169,110,0.35)", marginBottom: "1.2rem" },
  testimonialAuthor: { display: "flex", flexDirection: "column", gap: "0.25rem" },
  testimonialName: { color: "#c8a96e", fontWeight: 400, fontSize: "1rem", letterSpacing: "0.05em" },
  testimonialEvent: { opacity: 0.5, fontSize: "0.65rem", letterSpacing: "0.18em", fontFamily: "'Raleway', sans-serif" },

  aboutSection: { display: "grid", gridTemplateColumns: "1fr 1fr", maxWidth: "1200px", margin: "0 auto", padding: "7rem 2rem", gap: "6rem", alignItems: "center" },
  aboutImgWrap: { position: "relative" },
  aboutImgAccent: { position: "absolute", top: "1.5rem", left: "1.5rem", right: "-1.5rem", bottom: "-1.5rem", border: "1px solid rgba(200,169,110,0.25)", zIndex: 0 },
  aboutImg: { width: "100%", height: "550px", objectFit: "cover", position: "relative", zIndex: 1, display: "block" },
  aboutText: {},
  aboutCopy: { opacity: 0.7, lineHeight: 2, fontSize: "1.05rem", marginBottom: "1.4rem" },
  aboutBadges: { display: "flex", gap: "0.75rem", flexWrap: "wrap", marginTop: "2rem" },
  badge: { border: "1px solid rgba(200,169,110,0.35)", color: "#c8a96e", fontSize: "0.58rem", letterSpacing: "0.18em", padding: "0.45rem 1.1rem", fontFamily: "'Raleway', sans-serif", fontWeight: 500 },

  form: { maxWidth: "740px", margin: "0 auto" },
  formRow: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginBottom: "1.5rem" },
  formGroup: { display: "flex", flexDirection: "column", gap: "0.6rem", marginBottom: "1.5rem" },
  label: { fontSize: "0.55rem", letterSpacing: "0.22em", color: "#c8a96e", fontFamily: "'Raleway', sans-serif", fontWeight: 600 },
  input: { background: "rgba(240,235,226,0.03)", border: "1px solid rgba(240,235,226,0.12)", borderBottom: "1px solid rgba(200,169,110,0.3)", color: "#f0ebe2", padding: "0.9rem 1rem", fontSize: "1rem", fontFamily: "'Cormorant Garamond', serif", outline: "none", width: "100%", boxSizing: "border-box", transition: "border-color 0.3s" },
  submitBtn: { background: "#c8a96e", border: "1px solid #c8a96e", color: "#060402", padding: "1.15rem 2.5rem", fontSize: "0.62rem", letterSpacing: "0.25em", cursor: "pointer", fontWeight: 700, fontFamily: "'Raleway', sans-serif", width: "100%", marginTop: "0.5rem", transition: "all 0.3s" },
  formSubtitle: { opacity: 0.5, fontSize: "0.95rem", marginTop: "0.75rem", fontFamily: "'Raleway', sans-serif" },
  successBox: { maxWidth: "480px", margin: "0 auto", textAlign: "center", border: "1px solid rgba(200,169,110,0.3)", padding: "3.5rem" },
  successIcon: { fontSize: "2rem", color: "#c8a96e", marginBottom: "1.2rem" },

  footer: { background: "#030201", padding: "4rem 2rem 2.5rem", textAlign: "center" },
  footerDivider: { width: "80px", height: "1px", background: "linear-gradient(to right, transparent, #c8a96e, transparent)", margin: "0 auto 3rem" },
  footerLogo: { fontSize: "1.1rem", letterSpacing: "0.25em", fontWeight: 700, color: "#f0ebe2", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.6rem", marginBottom: "0.6rem", fontFamily: "'Raleway', sans-serif" },
  footerTagline: { fontSize: "0.58rem", letterSpacing: "0.25em", color: "#c8a96e", opacity: 0.6, fontFamily: "'Raleway', sans-serif", marginBottom: "2rem" },
  footerLinks: { display: "flex", gap: "2.5rem", justifyContent: "center", marginBottom: "2rem", flexWrap: "wrap" },
  footerLink: { color: "#f0ebe2", opacity: 0.35, textDecoration: "none", fontSize: "0.6rem", letterSpacing: "0.2em", fontFamily: "'Raleway', sans-serif", fontWeight: 500, transition: "opacity 0.2s" },
  footerCopy: { opacity: 0.25, fontSize: "0.7rem", fontFamily: "'Raleway', sans-serif" },
};

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,700;1,300;1,400&family=Raleway:wght@300;400;500;600;700&display=swap');
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html { scroll-behavior: smooth; }

  /* Scroll reveal */
  .reveal { opacity: 0; transform: translateY(28px); transition: opacity 0.75s ease, transform 0.75s ease; }
  .reveal.revealed { opacity: 1; transform: translateY(0); }

  .fade-in { animation: fadeUp 1.1s cubic-bezier(0.22,1,0.36,1) both; }
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(36px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes scrollPulse {
    0%, 100% { opacity: 0.4; transform: scaleY(1); }
    50% { opacity: 1; transform: scaleY(1.1); }
  }

  /* Desktop nav */
  .nav-links-desktop { display: flex; gap: 2.2rem; align-items: center; }

  /* Nav btn underline effect */
  .nav-btn::after {
    content: '';
    position: absolute;
    bottom: 0; left: 50%; right: 50%;
    height: 1px;
    background: #c8a96e;
    transition: left 0.3s ease, right 0.3s ease;
  }
  .nav-btn:hover { opacity: 1 !important; color: #c8a96e !important; }
  .nav-btn:hover::after, .nav-btn-active::after { left: 0 !important; right: 0 !important; }
  .nav-btn-active { opacity: 1 !important; color: #c8a96e !important; }
  .nav-cta:hover { background: #c8a96e !important; color: #060402 !important; }

  /* Hamburger animations */
  .burger-btn { display: flex !important; }
  .burger-open .burger-line-1 { transform: translateY(6.5px) rotate(45deg); }
  .burger-open .burger-line-2 { opacity: 0; transform: scaleX(0); }
  .burger-open .burger-line-3 { transform: translateY(-6.5px) rotate(-45deg); }

  /* Mobile menu item animations */
  .mobile-nav-btn-visible { opacity: 1 !important; transform: translateY(0) !important; }
  .mobile-nav-btn:hover .mobile-nav-arrow-el { opacity: 1 !important; transform: translateX(4px) !important; }
  .mobile-nav-btn-active { color: #c8a96e !important; }
  .mobile-nav-btn:hover { color: #c8a96e !important; }
  .mobile-nav-btn:hover > span:last-child { opacity: 1 !important; transform: translateX(6px) !important; }
  .mobile-book-btn:hover { opacity: 0.85 !important; }

  /* Gallery hover */
  .gallery-item:hover img { transform: scale(1.06); }
  .gallery-item:hover .gallery-overlay { opacity: 1 !important; }
  .gallery-item:hover .gallery-overlay > div { transform: translateY(0) !important; }

  /* Video card hover */
  .video-card:hover img { transform: scale(1.05); filter: brightness(0.45) !important; }
  .video-card:hover div[style*="playCircle"], .video-card:hover > div:nth-child(3) {
    background: rgba(200,169,110,0.2) !important;
    border-color: #c8a96e !important;
    transform: translate(-50%, -60%) scale(1.1) !important;
  }

  /* Package card hover */
  .package-card:hover { border-color: rgba(200,169,110,0.45) !important; }

  /* Testimonial card hover */
  .testimonial-card:hover { border-color: rgba(200,169,110,0.3) !important; background: rgba(200,169,110,0.02) !important; }

  /* Button hover */
  .btn-gold:hover { background: #d4b47a !important; border-color: #d4b47a !important; transform: translateY(-1px); }
  .btn-outline:hover { background: rgba(200,169,110,0.08) !important; border-color: rgba(200,169,110,0.8) !important; }
  .pkg-btn:hover { background: rgba(200,169,110,0.1) !important; }

  /* Filter button hover */
  .filter-btn:hover { border-color: rgba(200,169,110,0.5) !important; color: #c8a96e !important; }

  /* Footer link hover */
  .footer-link:hover { opacity: 0.85 !important; color: #c8a96e !important; }

  /* Input focus */
  input:focus, select:focus, textarea:focus {
    border-color: rgba(200,169,110,0.5) !important;
    background: rgba(200,169,110,0.03) !important;
  }
  select option { background: #0c0a07; }

  /* Mobile nav */
  @media (max-width: 768px) {
    .nav-links-desktop { display: none !important; }
    .burger-btn { display: flex !important; }
  }
  @media (min-width: 769px) {
    .burger-btn { display: none !important; }
    .mobile-menu { display: none !important; }
  }

  /* Mobile responsive grids */
  @media (max-width: 900px) {
    .gallery-grid { grid-template-columns: repeat(2, 1fr) !important; }
  }
  @media (max-width: 600px) {
    .gallery-grid { grid-template-columns: 1fr !important; }
  }
  @media (max-width: 768px) {
    [style*="gridTemplateColumns: repeat(3, 1fr)"] { grid-template-columns: 1fr !important; }
    [style*="gridTemplateColumns: 1fr 1fr"] { grid-template-columns: 1fr !important; }
    [style*="gridTemplateColumns: \"1fr 1fr\""] { grid-template-columns: 1fr !important; }
  }
`;
