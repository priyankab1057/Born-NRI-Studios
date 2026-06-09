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
    color: "#c8a96e",
  },
  {
    name: "Signature",
    price: "$950",
    hours: "4 Hours",
    highlights: ["400+ edited photos", "2 locations", "Drone footage included", "Rush delivery", "Canvas print"],
    color: "#e8c98e",
    featured: true,
  },
  {
    name: "Elite",
    price: "$1,800",
    hours: "Full Day",
    highlights: ["Unlimited photos", "Multiple locations", "4K drone video", "Same-week delivery", "10 prints + album"],
    color: "#c8a96e",
  },
];

const TESTIMONIALS = [
  { name: "Priya & Arjun", event: "Wedding", text: "Our photos are beyond magical. Every moment captured perfectly — we cry every time we look at them." },
  { name: "Marcus T.", event: "Corporate Headshots", text: "Booked on a Tuesday, had stunning shots by Friday. Pure professionalism and incredible eye for light." },
  { name: "The Hendersons", event: "Family Session", text: "The drone footage of our beach session is something we'll treasure forever. Absolute genius." },
];

export default function PhotographyPortfolio() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [lightbox, setLightbox] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", event: "", date: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const heroRef = useRef(null);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

  return (
    <div style={styles.root}>
      <style>{css}</style>

      {/* NAV */}
      <nav style={{ ...styles.nav, background: scrollY > 60 ? "rgba(8,6,4,0.96)" : "transparent" }}>
        <div style={styles.navLogo} onClick={() => scrollTo("hero")}>
          <span style={styles.logoMark}>✦</span> Born NRI Studios
        </div>
        <div style={{ ...styles.navLinks, display: menuOpen ? "flex" : undefined }} className="nav-links">
          {["work", "video", "packages", "about", "contact"].map(s => (
            <button key={s} style={styles.navBtn} onClick={() => scrollTo(s)}>
              {s.toUpperCase()}
            </button>
          ))}
          <button style={styles.navCTA} onClick={() => scrollTo("contact")}>BOOK NOW</button>
        </div>
        <button style={styles.burger} onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? "✕" : "☰"}
        </button>
      </nav>

      {/* HERO */}
      <section id="hero" style={styles.hero} ref={heroRef}>
        <div style={{ ...styles.heroBg, transform: `translateY(${ scrollY * 0.4 }px)` }} />
        <div style={styles.heroOverlay} />
        <div style={styles.heroContent} className="fade-in">
          <p style={styles.heroEyebrow}>PHOTOGRAPHY & AERIAL VIDEOGRAPHY</p>
          <h1 style={styles.heroTitle}>
            Moments That<br />
            <span style={styles.heroGold}>Live Forever</span>
          </h1>
          <p style={styles.heroSub}>
            NewBorn Photography · Portraits · Events · Graduation · PreWedding · House Warming · Product Photography · Drone Cinematography
          </p>
          <div style={styles.heroBtns}>
            <button style={styles.btnGold} onClick={() => scrollTo("work")}>VIEW MY WORK</button>
            <button style={styles.btnOutline} onClick={() => scrollTo("contact")}>BOOK A SESSION</button>
          </div>
        </div>
        <div style={styles.heroScroll}>
          <span style={styles.scrollLine} />
          <span style={styles.scrollText}>SCROLL</span>
        </div>
      </section>

      {/* STATS BAR */}
      <div style={styles.statsBar}>
        {[["500+", "Sessions Shot"], ["8", "Years Experience"], ["4.9★", "Average Rating"], ["12", "Awards Won"]].map(([num, label]) => (
          <div key={label} style={styles.stat}>
            <span style={styles.statNum}>{num}</span>
            <span style={styles.statLabel}>{label}</span>
          </div>
        ))}
      </div>

      {/* GALLERY */}
      <section id="work" style={styles.section}>
        <div style={styles.sectionHead}>
          <p style={styles.eyebrow}>PORTFOLIO</p>
          <h2 style={styles.sectionTitle}>A Glimpse of My Work</h2>
        </div>
        <div style={styles.filters}>
          {["all", "portrait", "wedding", "aerial"].map(f => (
            <button
              key={f}
              style={{ ...styles.filterBtn, ...(activeFilter === f ? styles.filterActive : {}) }}
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
              style={{ ...styles.galleryItem, animationDelay: `${ i * 0.07 }s` }}
              className="gallery-item"
              onClick={() => setLightbox(photo)}
            >
              <img src={photo.src} alt={photo.title} style={styles.galleryImg} loading="lazy" />
              <div style={styles.galleryOverlay}>
                <span style={styles.galleryTitle}>{photo.title}</span>
                <span style={styles.galleryView}>VIEW ↗</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* LIGHTBOX */}
      {lightbox && (
        <div style={styles.lightboxBg} onClick={() => setLightbox(null)}>
          <button style={styles.lightboxClose}>✕</button>
          <img src={lightbox.src.replace("w=800", "w=1400")} alt={lightbox.title} style={styles.lightboxImg} onClick={e => e.stopPropagation()} />
          <p style={styles.lightboxCaption}>{lightbox.title}</p>
        </div>
      )}

      {/* DRONE VIDEO */}
      <section id="video" style={styles.videoSection}>
        <div style={styles.videoInner}>
          <p style={styles.eyebrow} style={{ color: "#c8a96e", letterSpacing: "0.2em", fontSize: "0.7rem", marginBottom: "1rem" }}>AERIAL CINEMATOGRAPHY</p>
          <h2 style={{ ...styles.sectionTitle, color: "#fff", marginBottom: "1.5rem" }}>Drone Videography</h2>
          <p style={styles.videoCopy}>
            From sweeping coastlines to intimate rooftop ceremonies — my drone captures the story from a perspective no one else can offer. Every flight is planned, permitted, and breathtaking.
          </p>
          <div style={styles.videoGrid}>
            {[
              { label: "Wedding Aerial Reel", thumb: "https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=80" },
              { label: "Nature & Landscape", thumb: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80" },
              { label: "Corporate Events", thumb: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=600&q=80" },
            ].map(v => (
              <div key={v.label} style={styles.videoCard} className="video-card">
                <img src={v.thumb} alt={v.label} style={styles.videoThumb} />
                <div style={styles.playBtn}>▶</div>
                <div style={styles.videoLabel}>{v.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PACKAGES */}
      <section id="packages" style={styles.section}>
        <div style={styles.sectionHead}>
          <p style={styles.eyebrow}>INVESTMENT</p>
          <h2 style={styles.sectionTitle}>Session Packages</h2>
        </div>
        <div style={styles.packagesGrid}>
          {PACKAGES.map(pkg => (
            <div key={pkg.name} style={{ ...styles.packageCard, ...(pkg.featured ? styles.packageFeatured : {}) }} className="package-card">
              {pkg.featured && <div style={styles.featuredBadge}>MOST POPULAR</div>}
              <h3 style={styles.pkgName}>{pkg.name}</h3>
              <div style={styles.pkgPrice}>{pkg.price}</div>
              <div style={styles.pkgHours}>{pkg.hours}</div>
              <ul style={styles.pkgList}>
                {pkg.highlights.map(h => (
                  <li key={h} style={styles.pkgItem}><span style={{ color: "#c8a96e" }}>✦</span> {h}</li>
                ))}
              </ul>
              <button style={styles.pkgBtn} onClick={() => scrollTo("contact")}>BOOK THIS PACKAGE</button>
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section style={styles.testimonialsSection}>
        <div style={styles.sectionHead}>
          <p style={styles.eyebrow}>KIND WORDS</p>
          <h2 style={{ ...styles.sectionTitle, color: "#fff" }}>What Clients Say</h2>
        </div>
        <div style={styles.testimonialsGrid}>
          {TESTIMONIALS.map(t => (
            <div key={t.name} style={styles.testimonialCard} className="testimonial-card">
              <p style={styles.testimonialText}>"{t.text}"</p>
              <div style={styles.testimonialAuthor}>
                <strong style={{ color: "#c8a96e" }}>{t.name}</strong>
                <span style={{ opacity: 0.6, fontSize: "0.8rem" }}>{t.event}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" style={styles.aboutSection}>
        <div style={styles.aboutImg}>
          <img src="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=700&q=80" alt="Photographer" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>
        <div style={styles.aboutText}>
          <p style={styles.eyebrow}>ABOUT ME</p>
          <h2 style={styles.sectionTitle}>The Eye Behind the Lens</h2>
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
      <section id="contact" style={styles.section}>
        <div style={styles.sectionHead}>
          <p style={styles.eyebrow}>LET'S CREATE</p>
          <h2 style={styles.sectionTitle}>Book Your Session</h2>
          <p style={styles.formSubtitle}>Fill out the form below and I'll get back to you within 24 hours.</p>
        </div>

        {submitted ? (
          <div style={styles.successBox}>
            <div style={styles.successIcon}>✦</div>
            <h3 style={{ color: "#c8a96e", marginBottom: "0.5rem" }}>You're on my radar!</h3>
            <p style={{ opacity: 0.8 }}>Thanks {formData.name}! I'll be in touch within 24 hours to confirm your session.</p>
          </div>
        ) : (
          <form style={styles.form} onSubmit={handleBook}>
            <div style={styles.formRow}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Your Name</label>
                <input style={styles.input} placeholder="Jane Smith" required value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })} />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Email Address</label>
                <input style={styles.input} type="email" placeholder="jane@email.com" required value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })} />
              </div>
            </div>
            <div style={styles.formRow}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Event Type</label>
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
                <label style={styles.label}>Preferred Date</label>
                <input style={styles.input} type="date" value={formData.date}
                  onChange={e => setFormData({ ...formData, date: e.target.value })} />
              </div>
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Tell me about your vision</label>
              <textarea style={{ ...styles.input, height: "130px", resize: "vertical" }}
                placeholder="Share any details, locations, or inspiration you have in mind…"
                value={formData.message} onChange={e => setFormData({ ...formData, message: e.target.value })} />
            </div>
            <button type="submit" style={styles.submitBtn}>SEND BOOKING REQUEST ✦</button>
          </form>
        )}
      </section>

      {/* FOOTER */}
      <footer style={styles.footer}>
        <div style={styles.footerLogo}><span style={styles.logoMark}>✦</span> Born NRI Studios </div>
        <p style={{ opacity: 0.4, fontSize: "0.8rem", marginTop: "0.5rem" }}>
          © 2025 Born NRI Photography. All rights reserved.
        </p>
        <div style={styles.footerLinks}>
          {["Instagram", "Facebook", "YouTube"].map(s => (
            <a key={s} href="#" style={styles.footerLink}>{s}</a>
          ))}
        </div>
      </footer>
    </div>
  );
}

const styles = {
  root: { fontFamily: "'Cormorant Garamond', Georgia, serif", background: "#080604", color: "#f0ebe2", minHeight: "100vh", overflowX: "hidden" },
  nav: { position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1.2rem 3rem", transition: "background 0.4s ease" },
  navLogo: { fontSize: "1.1rem", letterSpacing: "0.25em", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: "0.5rem" },
  logoMark: { color: "#c8a96e" },
  navLinks: { display: "flex", gap: "2rem", alignItems: "center" },
  navBtn: { background: "none", border: "none", color: "#f0ebe2", cursor: "pointer", fontSize: "0.7rem", letterSpacing: "0.18em", opacity: 0.8, fontFamily: "'Cormorant Garamond', serif" },
  navCTA: { background: "#c8a96e", border: "none", color: "#080604", padding: "0.6rem 1.4rem", fontSize: "0.65rem", letterSpacing: "0.18em", cursor: "pointer", fontFamily: "'Cormorant Garamond', serif", fontWeight: 700 },
  burger: { display: "none", background: "none", border: "none", color: "#f0ebe2", fontSize: "1.4rem", cursor: "pointer" },
  hero: { position: "relative", height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" },
  heroBg: { position: "absolute", inset: "-20%", backgroundImage: "url(https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=1800&q=80)", backgroundSize: "cover", backgroundPosition: "center" },
  heroOverlay: { position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(8,6,4,0.75) 0%, rgba(8,6,4,0.45) 100%)" },
  heroContent: { position: "relative", textAlign: "center", maxWidth: "800px", padding: "2rem" },
  heroEyebrow: { fontSize: "0.65rem", letterSpacing: "0.3em", color: "#c8a96e", marginBottom: "1.5rem" },
  heroTitle: { fontSize: "clamp(3rem, 8vw, 6rem)", lineHeight: 1.05, fontWeight: 300, marginBottom: "1.2rem", letterSpacing: "-0.01em" },
  heroGold: { color: "#c8a96e", fontStyle: "italic" },
  heroSub: { fontSize: "1rem", opacity: 0.7, letterSpacing: "0.15em", marginBottom: "2.5rem" },
  heroBtns: { display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" },
  btnGold: { background: "#c8a96e", border: "none", color: "#080604", padding: "1rem 2.5rem", fontSize: "0.7rem", letterSpacing: "0.2em", cursor: "pointer", fontWeight: 700, fontFamily: "'Cormorant Garamond', serif", transition: "transform 0.2s" },
  btnOutline: { background: "transparent", border: "1px solid rgba(200,169,110,0.6)", color: "#c8a96e", padding: "1rem 2.5rem", fontSize: "0.7rem", letterSpacing: "0.2em", cursor: "pointer", fontFamily: "'Cormorant Garamond', serif" },
  heroScroll: { position: "absolute", bottom: "2.5rem", left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem" },
  scrollLine: { width: "1px", height: "50px", background: "linear-gradient(to bottom, transparent, #c8a96e)", display: "block" },
  scrollText: { fontSize: "0.55rem", letterSpacing: "0.25em", color: "#c8a96e" },
  statsBar: { display: "flex", justifyContent: "space-around", background: "#0f0d09", padding: "2rem 3rem", borderTop: "1px solid rgba(200,169,110,0.15)", borderBottom: "1px solid rgba(200,169,110,0.15)", flexWrap: "wrap", gap: "1.5rem" },
  stat: { textAlign: "center" },
  statNum: { display: "block", fontSize: "2.2rem", fontWeight: 300, color: "#c8a96e", letterSpacing: "-0.02em" },
  statLabel: { fontSize: "0.65rem", letterSpacing: "0.2em", opacity: 0.6 },
  section: { maxWidth: "1200px", margin: "0 auto", padding: "6rem 2rem" },
  sectionHead: { textAlign: "center", marginBottom: "3rem" },
  eyebrow: { fontSize: "0.65rem", letterSpacing: "0.28em", color: "#c8a96e", marginBottom: "0.75rem" },
  sectionTitle: { fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 300, letterSpacing: "-0.01em" },
  filters: { display: "flex", gap: "0.75rem", justifyContent: "center", marginBottom: "2.5rem", flexWrap: "wrap" },
  filterBtn: { background: "none", border: "1px solid rgba(240,235,226,0.2)", color: "#f0ebe2", padding: "0.5rem 1.5rem", fontSize: "0.65rem", letterSpacing: "0.18em", cursor: "pointer", fontFamily: "'Cormorant Garamond', serif", transition: "all 0.25s" },
  filterActive: { background: "#c8a96e", borderColor: "#c8a96e", color: "#080604" },
  gallery: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1rem" },
  galleryItem: { position: "relative", overflow: "hidden", cursor: "pointer", aspectRatio: "4/3" },
  galleryImg: { width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.5s ease" },
  galleryOverlay: { position: "absolute", inset: 0, background: "rgba(8,6,4,0)", display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: "1.5rem", transition: "background 0.3s" },
  galleryTitle: { color: "#fff", fontSize: "1rem", fontWeight: 300, transform: "translateY(10px)", opacity: 0, transition: "all 0.3s" },
  galleryView: { color: "#c8a96e", fontSize: "0.65rem", letterSpacing: "0.2em", transform: "translateY(10px)", opacity: 0, transition: "all 0.3s 0.05s" },
  lightboxBg: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.95)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" },
  lightboxClose: { position: "absolute", top: "1.5rem", right: "2rem", background: "none", border: "none", color: "#fff", fontSize: "1.8rem", cursor: "pointer" },
  lightboxImg: { maxWidth: "90vw", maxHeight: "80vh", objectFit: "contain" },
  lightboxCaption: { marginTop: "1rem", color: "#c8a96e", letterSpacing: "0.15em", fontSize: "0.85rem" },
  videoSection: { background: "#0a0806", padding: "6rem 2rem" },
  videoInner: { maxWidth: "1200px", margin: "0 auto", textAlign: "center" },
  videoCopy: { maxWidth: "600px", margin: "0 auto 3rem", opacity: 0.7, lineHeight: 1.8, fontSize: "1.1rem" },
  videoGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1.5rem" },
  videoCard: { position: "relative", overflow: "hidden", cursor: "pointer", aspectRatio: "16/9" },
  videoThumb: { width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.5s ease", filter: "brightness(0.7)" },
  playBtn: { position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2.5rem", color: "#c8a96e", textShadow: "0 0 30px rgba(200,169,110,0.5)" },
  videoLabel: { position: "absolute", bottom: "1rem", left: "1rem", right: "1rem", color: "#fff", fontSize: "0.85rem", letterSpacing: "0.1em" },
  packagesGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.5rem" },
  packageCard: { border: "1px solid rgba(200,169,110,0.2)", padding: "2.5rem 2rem", position: "relative", textAlign: "center", transition: "border-color 0.3s" },
  packageFeatured: { border: "1px solid #c8a96e", background: "rgba(200,169,110,0.04)" },
  featuredBadge: { position: "absolute", top: "-1px", left: "50%", transform: "translateX(-50%)", background: "#c8a96e", color: "#080604", fontSize: "0.55rem", letterSpacing: "0.2em", padding: "0.3rem 1rem", fontWeight: 700 },
  pkgName: { fontSize: "1.4rem", fontWeight: 300, letterSpacing: "0.1em", marginBottom: "1rem" },
  pkgPrice: { fontSize: "3rem", color: "#c8a96e", fontWeight: 300, letterSpacing: "-0.02em" },
  pkgHours: { fontSize: "0.75rem", letterSpacing: "0.2em", opacity: 0.6, marginBottom: "2rem" },
  pkgList: { listStyle: "none", padding: 0, marginBottom: "2rem", textAlign: "left" },
  pkgItem: { padding: "0.5rem 0", borderBottom: "1px solid rgba(240,235,226,0.08)", fontSize: "0.95rem", display: "flex", gap: "0.6rem", alignItems: "center" },
  pkgBtn: { background: "none", border: "1px solid #c8a96e", color: "#c8a96e", padding: "0.85rem 1.5rem", fontSize: "0.65rem", letterSpacing: "0.18em", cursor: "pointer", fontFamily: "'Cormorant Garamond', serif", width: "100%", transition: "all 0.25s" },
  testimonialsSection: { background: "#050403", padding: "6rem 2rem" },
  testimonialsGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1.5rem", maxWidth: "1200px", margin: "0 auto" },
  testimonialCard: { padding: "2rem", border: "1px solid rgba(200,169,110,0.15)" },
  testimonialText: { fontSize: "1.05rem", lineHeight: 1.8, opacity: 0.85, marginBottom: "1.5rem", fontStyle: "italic" },
  testimonialAuthor: { display: "flex", flexDirection: "column", gap: "0.3rem" },
  aboutSection: { display: "grid", gridTemplateColumns: "1fr 1fr", maxWidth: "1200px", margin: "0 auto", padding: "6rem 2rem", gap: "5rem", alignItems: "center" },
  aboutImg: { height: "550px", overflow: "hidden" },
  aboutText: {},
  aboutCopy: { opacity: 0.75, lineHeight: 1.9, fontSize: "1.05rem", marginBottom: "1.2rem" },
  aboutBadges: { display: "flex", gap: "0.75rem", flexWrap: "wrap", marginTop: "1.5rem" },
  badge: { border: "1px solid rgba(200,169,110,0.4)", color: "#c8a96e", fontSize: "0.65rem", letterSpacing: "0.15em", padding: "0.4rem 1rem" },
  form: { maxWidth: "720px", margin: "0 auto" },
  formRow: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginBottom: "1.5rem" },
  formGroup: { display: "flex", flexDirection: "column", gap: "0.5rem" },
  label: { fontSize: "0.65rem", letterSpacing: "0.18em", color: "#c8a96e" },
  input: { background: "rgba(240,235,226,0.04)", border: "1px solid rgba(240,235,226,0.15)", color: "#f0ebe2", padding: "0.85rem 1rem", fontSize: "1rem", fontFamily: "'Cormorant Garamond', serif", outline: "none", width: "100%", boxSizing: "border-box" },
  submitBtn: { background: "#c8a96e", border: "none", color: "#080604", padding: "1.1rem 2.5rem", fontSize: "0.7rem", letterSpacing: "0.2em", cursor: "pointer", fontWeight: 700, fontFamily: "'Cormorant Garamond', serif", width: "100%", marginTop: "0.5rem", transition: "opacity 0.2s" },
  formSubtitle: { opacity: 0.6, fontSize: "1rem", marginTop: "0.5rem" },
  successBox: { maxWidth: "480px", margin: "0 auto", textAlign: "center", border: "1px solid rgba(200,169,110,0.3)", padding: "3rem" },
  successIcon: { fontSize: "2rem", color: "#c8a96e", marginBottom: "1rem" },
  footer: { background: "#040302", padding: "3rem 2rem", textAlign: "center", borderTop: "1px solid rgba(200,169,110,0.1)" },
  footerLogo: { fontSize: "1.1rem", letterSpacing: "0.25em", fontWeight: 700, color: "#f0ebe2", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" },
  footerLinks: { display: "flex", gap: "2rem", justifyContent: "center", marginTop: "1.5rem", flexWrap: "wrap" },
  footerLink: { color: "#f0ebe2", opacity: 0.4, textDecoration: "none", fontSize: "0.7rem", letterSpacing: "0.15em" },
};

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,700;1,300;1,400&display=swap');
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html { scroll-behavior: smooth; }
  
  .fade-in { animation: fadeUp 1s ease both; }
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(30px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .gallery-item:hover img { transform: scale(1.07); }
  .gallery-item:hover > div { background: rgba(8,6,4,0.6) !important; }
  .gallery-item:hover span { opacity: 1 !important; transform: translateY(0) !important; }

  .video-card:hover img { transform: scale(1.05); filter: brightness(0.5) !important; }
  .package-card:hover { border-color: rgba(200,169,110,0.5) !important; }
  .testimonial-card:hover { border-color: rgba(200,169,110,0.35) !important; }
  
  input:focus, select:focus, textarea:focus {
    border-color: rgba(200,169,110,0.5) !important;
    box-shadow: 0 0 0 1px rgba(200,169,110,0.15);
  }
  select option { background: #0f0d09; }
  
  @media (max-width: 768px) {
    .nav-links { display: none; flex-direction: column; position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: #080604; align-items: center; justify-content: center; gap: 2rem; z-index: 99; }
  }
  @media (max-width: 768px) {
    [style*="display: grid"][style*="gridTemplateColumns: 1fr 1fr"] { grid-template-columns: 1fr !important; }
  }
`;
