import { useNavigate } from 'react-router-dom';
import { useSession } from '@/contexts/SessionContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import LanguageToggle from '@/components/LanguageToggle';
import owlMascot from '@/assets/owl-mascot.png';
import {
  ArrowLeft,
  Target,
  Eye,
  AlertTriangle,
  Globe2,
  Users,
  Building2,
  Stethoscope,
  GraduationCap,
  Heart,
  ShieldCheck,
  Award,
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Twitter,
  Github,
  Rocket,
  Languages,
  Wifi,
  IndianRupee,
  HeartPulse,
  Briefcase,
  Sparkles,
  CheckCircle2,
  TrendingUp,
  Hospital,
  School as SchoolIcon,
  Lightbulb,
} from 'lucide-react';

export default function AboutPage() {
  const navigate = useNavigate();
  const { lang: _lang } = useSession();

  const heroStats = [
    { value: '63M+', label: 'Indians with hearing loss' },
    { value: '1.5M', label: 'Government schools in India' },
    { value: '37,000+', label: 'Schools in Tamil Nadu alone' },
    { value: '<10', label: 'Age we aim to screen by' },
  ];

  const team = [
    {
      name: 'Vikash Saravanan',
      role: 'Founder & CEO',
      bio: 'Visionary behind HearWise. Leading product, partnerships, and government relations across Tamil Nadu and India.',
      tag: 'Founder',
    },
    {
      name: 'Clinical Advisory Board',
      role: 'Audiologists & ENT Specialists',
      bio: 'A panel of pediatric audiologists guiding our screening protocol, threshold calibration, and referral standards.',
      tag: 'Medical',
    },
    {
      name: 'Engineering Team',
      role: 'Mobile-First Engineers',
      bio: 'Building offline-first, low-bandwidth software that runs on the smartphones teachers already carry.',
      tag: 'Tech',
    },
    {
      name: 'Field Operations',
      role: 'School Outreach Partners',
      bio: 'On-ground partners conducting pilots, training teachers, and connecting flagged children to ENT care.',
      tag: 'Operations',
    },
  ];

  const values = [
    { icon: Heart, title: 'Child First', desc: 'Every design decision is judged by whether it protects and serves the child.' },
    { icon: ShieldCheck, title: 'Clinically Safe', desc: 'Screening protocols reviewed by audiologists; no diagnosis, only responsible referral.' },
    { icon: Globe2, title: 'Built for Bharat', desc: 'Works offline, in regional languages, on the lowest-end Android devices.' },
    { icon: Award, title: 'Open & Trusted', desc: 'Open-source, MIT-licensed, transparent data privacy by default.' },
  ];

  const advancedFeatures = [
    { icon: Wifi, title: 'Offline-First Sync', desc: 'Conduct full screenings without internet. Data syncs automatically when online.' },
    { icon: HeartPulse, title: 'Clinically-Safe Audiometry', desc: '500/1000/2000/4000 Hz pure-tone screening with stereo channel isolation.' },
    { icon: Languages, title: 'Multilingual UX', desc: 'English + Tamil today. Hindi, Telugu, Kannada, Bengali, Marathi on the roadmap.' },
    { icon: ShieldCheck, title: 'Privacy by Design', desc: 'End-to-end encrypted student records, RLS-protected backend, no third-party trackers.' },
    { icon: TrendingUp, title: 'Government Dashboard', desc: 'District-level analytics, CSV exports, and trend reports for education + health departments.' },
    { icon: Rocket, title: 'Scales to Millions', desc: 'Architected for crore-scale screenings — every child in India before age 10.' },
  ];

  const roadmap = [
    { phase: 'Phase 1 — Now', title: 'Tamil Nadu Pilot', items: ['10 government schools in Coimbatore', '2,000 children screened', 'Partnership with District Education Officer'] },
    { phase: 'Phase 2 — Q2', title: 'State Rollout', items: ['Tamil Nadu School Health Programme integration', 'iStart Tamil Nadu accelerator', 'Hindi + Telugu language support'] },
    { phase: 'Phase 3 — Q4', title: 'National Expansion', items: ['Atal Innovation Mission partnership', 'Ministry of Health collaboration', '10 lakh children screened'] },
    { phase: 'Phase 4 — Year 2', title: 'Global Reach', items: ['SAARC + African deployment', 'WHO ear-care partnership', 'White-label for hospital chains worldwide'] },
  ];

  const partners = [
    { icon: SchoolIcon, name: 'Government Schools', desc: 'Tamil Nadu School Education Dept.' },
    { icon: Hospital, name: 'ENT Hospitals', desc: 'Sankara Nethralaya, Apollo, MIOT' },
    { icon: Briefcase, name: 'NGO Partners', desc: 'Rotary, CRY, Smile Foundation' },
    { icon: Building2, name: 'Govt. Programs', desc: 'iStart TN, NASSCOM 10K, AIM' },
  ];

  const businessModel = [
    { tier: 'Government Pilots', price: 'Free', detail: 'First 50 schools — proving impact' },
    { tier: 'Private Schools', price: '₹2,000/yr', detail: 'Unlimited screenings per school' },
    { tier: 'NGO Plan', price: '₹15,000/yr', detail: 'Multi-school + impact reports' },
    { tier: 'State Govt. Contract', price: 'Custom', detail: 'Lakh-scale deployments' },
    { tier: 'White-Label / API', price: '₹50,000+/yr', detail: 'Hospitals, ENT chains, global' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/30">
      {/* Top nav */}
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <button onClick={() => navigate('/')} className="flex items-center gap-2">
            <img src={owlMascot} alt="HearWise" className="h-9 w-9 rounded-xl bg-white p-1" />
            <span className="text-lg font-black tracking-tight">HearWise</span>
          </button>
          <div className="flex items-center gap-2">
            <LanguageToggle />
            <Button variant="ghost" size="sm" onClick={() => navigate('/')} className="hidden sm:flex">
              <ArrowLeft className="mr-1 h-4 w-4" /> Home
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-12 px-4 py-10 sm:px-6 sm:py-14">
        {/* Hero */}
        <section className="relative overflow-hidden rounded-3xl border border-border/70 bg-gradient-to-br from-primary/10 via-card to-secondary/10 p-6 shadow-2xl sm:p-12">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-secondary/10 blur-3xl" />

          <div className="relative">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              India · Tamil Nadu · Global
            </div>
            <h1 className="mt-4 text-4xl font-black tracking-tight text-foreground sm:text-6xl">
              Hearing care for <span className="text-primary">every</span> child.
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              HearWise is India's first mobile-based school hearing screening platform — letting teachers test
              <strong className="text-foreground"> 50 children per hour</strong> with just a smartphone and headphones.
              We are building the audiological public-health infrastructure for the next billion children.
            </p>

            <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {heroStats.map((s) => (
                <div key={s.label} className="rounded-2xl border border-border/60 bg-background/80 p-4 backdrop-blur">
                  <p className="text-2xl font-black text-primary sm:text-3xl">{s.value}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="grid gap-5 md:grid-cols-2">
          <Card className="rounded-3xl border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
            <CardContent className="p-6 sm:p-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/15 text-primary">
                <Target className="h-6 w-6" />
              </div>
              <h2 className="mt-4 text-xl font-bold sm:text-2xl">Our Mission</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
                To eliminate undetected childhood hearing loss in India — and eventually worldwide — through
                accessible, affordable, and scalable mobile-based audiometry screening, delivered through schools,
                governments, and frontline health workers.
              </p>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-secondary/20 bg-gradient-to-br from-secondary/5 to-transparent">
            <CardContent className="p-6 sm:p-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary/15 text-secondary">
                <Eye className="h-6 w-6" />
              </div>
              <h2 className="mt-4 text-xl font-bold sm:text-2xl">Our Vision</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
                <strong className="text-foreground">Every child in India screened for hearing loss before age 10.</strong>{' '}
                A future where no child loses speech, language, or learning to a hearing problem that could have been
                caught with a 2-minute test.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* The Problem */}
        <section>
          <Card className="rounded-3xl border-destructive/20">
            <CardContent className="p-6 sm:p-8">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
                  <AlertTriangle className="h-6 w-6" />
                </div>
                <h2 className="text-xl font-bold sm:text-2xl">The Problem We Are Solving</h2>
              </div>

              <div className="mt-5 grid gap-4 md:grid-cols-3">
                <div className="rounded-2xl bg-destructive/5 p-4">
                  <p className="text-3xl font-black text-destructive">63M</p>
                  <p className="mt-1 text-sm text-muted-foreground">Indians live with significant hearing loss</p>
                </div>
                <div className="rounded-2xl bg-destructive/5 p-4">
                  <p className="text-3xl font-black text-destructive">50%+</p>
                  <p className="mt-1 text-sm text-muted-foreground">of cases begin in childhood and go undetected</p>
                </div>
                <div className="rounded-2xl bg-destructive/5 p-4">
                  <p className="text-3xl font-black text-destructive">7-10</p>
                  <p className="mt-1 text-sm text-muted-foreground">Age most cases are detected — far too late</p>
                </div>
              </div>

              <p className="mt-5 text-sm leading-relaxed text-muted-foreground sm:text-base">
                Undetected childhood hearing loss causes <strong className="text-foreground">irreversible damage to
                speech, language, and learning</strong>. India's 1.5 million government schools have <strong className="text-foreground">zero scalable digital hearing-screening tools</strong> today.
                Traditional audiometry requires expensive booths, trained audiologists, and unreachable specialist clinics.
                <strong className="text-foreground"> HearWise changes that.</strong>
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Advanced Capabilities */}
        <section>
          <div className="mb-6 text-center">
            <h2 className="text-2xl font-black sm:text-3xl">Built for Scale, Designed for India</h2>
            <p className="mt-2 text-sm text-muted-foreground sm:text-base">
              Enterprise-grade engineering meets last-mile reality.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {advancedFeatures.map((f) => (
              <Card key={f.title} className="rounded-2xl transition-shadow hover:shadow-lg">
                <CardContent className="p-5">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <f.icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-3 text-base font-bold">{f.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{f.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Values */}
        <section>
          <div className="mb-6">
            <h2 className="text-2xl font-black sm:text-3xl">Our Values</h2>
            <p className="mt-1 text-sm text-muted-foreground">The principles that guide every product decision.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v) => (
              <div key={v.title} className="rounded-2xl border border-border/60 bg-card/60 p-5">
                <v.icon className="h-7 w-7 text-primary" />
                <h3 className="mt-3 text-base font-bold">{v.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{v.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Roadmap */}
        <section>
          <div className="mb-6">
            <h2 className="text-2xl font-black sm:text-3xl">Our Roadmap</h2>
            <p className="mt-1 text-sm text-muted-foreground">From Coimbatore pilot to global infrastructure.</p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {roadmap.map((r, i) => (
              <Card key={r.phase} className="relative overflow-hidden rounded-2xl">
                <div className="absolute left-0 top-0 h-full w-1 bg-primary" />
                <CardContent className="p-5 pl-6">
                  <p className="text-xs font-bold uppercase tracking-wider text-primary">{r.phase}</p>
                  <h3 className="mt-1 text-lg font-bold">{r.title}</h3>
                  <ul className="mt-3 space-y-1.5">
                    {r.items.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Partners */}
        <section>
          <div className="mb-6">
            <h2 className="text-2xl font-black sm:text-3xl">Partners & Ecosystem</h2>
            <p className="mt-1 text-sm text-muted-foreground">We work with governments, hospitals, NGOs, and schools.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {partners.map((p) => (
              <Card key={p.name} className="rounded-2xl">
                <CardContent className="flex items-start gap-3 p-5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary/10 text-secondary">
                    <p.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-bold">{p.name}</p>
                    <p className="text-xs text-muted-foreground">{p.desc}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Business Model */}
        <section>
          <div className="mb-6">
            <h2 className="text-2xl font-black sm:text-3xl">Sustainable Impact Model</h2>
            <p className="mt-1 text-sm text-muted-foreground">Free where it matters, sustainable where it scales.</p>
          </div>
          <Card className="rounded-3xl">
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {businessModel.map((b) => (
                  <div key={b.tier} className="flex items-center justify-between gap-4 p-4 sm:p-5">
                    <div className="flex items-center gap-3">
                      <IndianRupee className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-bold">{b.tier}</p>
                        <p className="text-xs text-muted-foreground">{b.detail}</p>
                      </div>
                    </div>
                    <p className="shrink-0 rounded-full bg-primary/10 px-3 py-1 text-sm font-bold text-primary">{b.price}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Team */}
        <section>
          <div className="mb-6">
            <h2 className="text-2xl font-black sm:text-3xl">The Team</h2>
            <p className="mt-1 text-sm text-muted-foreground">Engineers, clinicians, and educators united by one mission.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {team.map((m) => (
              <Card key={m.name} className="rounded-2xl">
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-secondary text-lg font-black text-primary-foreground">
                      {m.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-bold">{m.name}</p>
                        <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{m.tag}</span>
                      </div>
                      <p className="text-xs text-primary">{m.role}</p>
                      <p className="mt-2 text-sm text-muted-foreground">{m.bio}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Contact */}
        <section>
          <Card className="overflow-hidden rounded-3xl border-primary/20 bg-gradient-to-br from-primary/10 via-card to-secondary/10">
            <CardContent className="p-6 sm:p-10">
              <div className="grid gap-8 md:grid-cols-2">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                    <Lightbulb className="h-3.5 w-3.5" />
                    Let's Build Together
                  </div>
                  <h2 className="mt-3 text-2xl font-black sm:text-3xl">Partner with HearWise</h2>
                  <p className="mt-3 text-sm text-muted-foreground sm:text-base">
                    Government department, school administrator, NGO, hospital, or investor — if your mission overlaps with ours,
                    let's talk. We respond within 48 hours.
                  </p>

                  <div className="mt-6 flex flex-wrap gap-3">
                    <Button asChild className="h-12 rounded-2xl px-5 font-semibold">
                      <a href="mailto:vikash752008@icloud.com">
                        <Mail className="mr-2 h-4 w-4" /> Email Us
                      </a>
                    </Button>
                    <Button asChild variant="outline" className="h-12 rounded-2xl px-5 font-semibold">
                      <a href="tel:9342877474">
                        <Phone className="mr-2 h-4 w-4" /> Call Founder
                      </a>
                    </Button>
                  </div>
                </div>

                <div className="space-y-4 rounded-2xl bg-background/70 p-5 backdrop-blur">
                  <div className="flex items-start gap-3">
                    <Mail className="mt-0.5 h-5 w-5 text-primary" />
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground">Email</p>
                      <p className="text-sm font-medium">vikash752008@icloud.com</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone className="mt-0.5 h-5 w-5 text-primary" />
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground">Phone</p>
                      <p className="text-sm font-medium">+91 9342877474</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="mt-0.5 h-5 w-5 text-primary" />
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground">Headquarters</p>
                      <p className="text-sm font-medium">HearWise Technologies Pvt. Ltd.</p>
                      <p className="text-xs text-muted-foreground">Coimbatore · Tamil Nadu · India</p>
                    </div>
                  </div>
                  <div className="flex gap-3 pt-2">
                    <a href="#" aria-label="LinkedIn" className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted text-muted-foreground transition hover:bg-primary hover:text-primary-foreground">
                      <Linkedin className="h-4 w-4" />
                    </a>
                    <a href="#" aria-label="Twitter" className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted text-muted-foreground transition hover:bg-primary hover:text-primary-foreground">
                      <Twitter className="h-4 w-4" />
                    </a>
                    <a href="https://github.com/vikashsaravanann/hearwise-child-health" target="_blank" rel="noreferrer" aria-label="GitHub" className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted text-muted-foreground transition hover:bg-primary hover:text-primary-foreground">
                      <Github className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* CTA */}
        <section className="text-center">
          <h2 className="text-2xl font-black sm:text-3xl">Ready to screen your first 50 children?</h2>
          <p className="mt-2 text-sm text-muted-foreground sm:text-base">It takes one teacher, one phone, and one hour.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button onClick={() => navigate('/setup')} className="h-12 rounded-2xl px-6 font-semibold">
              <GraduationCap className="mr-2 h-4 w-4" /> Start Screening
            </Button>
            <Button variant="outline" onClick={() => navigate('/dashboard')} className="h-12 rounded-2xl px-6 font-semibold">
              <Stethoscope className="mr-2 h-4 w-4" /> Admin Dashboard
            </Button>
          </div>
        </section>
      </main>

      <footer className="border-t border-border/60 bg-card/40 px-6 py-6 text-center">
        <p className="text-xs text-muted-foreground">
          © 2025 HearWise Technologies Pvt. Ltd. · v1.0.0 · Making hearing care accessible for every child in India.
        </p>
        <p className="mt-1 text-[11px] text-muted-foreground">
          HearWise is a screening tool, not a diagnostic device. Always confirm findings with a qualified ENT specialist.
        </p>
      </footer>
    </div>
  );
}