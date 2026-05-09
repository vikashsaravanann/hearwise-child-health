import {
  ExternalLink,
  Github,
  Instagram,
  Linkedin,
  Mail,
} from 'lucide-react';

interface TechBadge {
  name: string;
  role: string;
}

const TECH_BADGES: TechBadge[] = [
  { name: 'React', role: 'Frontend framework' },
  { name: 'TypeScript', role: 'Type safety' },
  { name: 'Vite', role: 'Build tool' },
  { name: 'Tailwind CSS', role: 'Styling' },
  { name: 'Supabase', role: 'Backend & DB' },
  { name: 'Shadcn UI', role: 'Components' },
  { name: 'Web Audio API', role: 'Tone generation' },
  { name: 'Recharts', role: 'Analytics charts' },
  { name: 'jsPDF', role: 'Report export' },
  { name: 'GitHub Actions', role: 'CI/CD' },
  { name: 'Vercel', role: 'Deployment' },
  { name: 'Claude API', role: 'AI insights' },
];

export default function AboutDeveloperPage() {
  return (
    <div className="space-y-5">
      <section
        className="flex flex-col gap-8 rounded-[14px] border px-8 py-7 xl:flex-row"
        style={{ background: '#0F172A', borderColor: 'rgba(255,255,255,0.08)' }}
      >
        <div className="xl:w-1/3">
          <div
            className="mx-auto flex h-[120px] w-[120px] items-center justify-center rounded-full border-3 text-4xl font-semibold text-white xl:mx-0"
            style={{
              background: 'linear-gradient(135deg, #1E3A5F 0%, #2F80ED 100%)',
              borderColor: 'rgba(47,128,237,0.4)',
            }}
          >
            VS
          </div>
          <p className="mt-[14px] text-center text-[18px] font-semibold text-white xl:text-left">
            Vikash S.
          </p>
          <p className="text-center text-xs text-[#60A5FA] xl:text-left">
            AI &amp; Data Science Undergrad
          </p>
          <p
            className="text-center text-[11px] xl:text-left"
            style={{ color: 'rgba(255,255,255,0.4)' }}
          >
            Rathinam Technical Campus
          </p>

          <div className="mt-4 flex items-center justify-center gap-3 xl:justify-start">
            {[
              { icon: Github, href: 'https://github.com/vikashsaravanann', label: 'GitHub' },
              { icon: Instagram, href: 'https://instagram.com/startupwithvikash', label: 'Instagram' },
              { icon: Linkedin, href: 'https://www.linkedin.com/in/vikash-saravanan-j7528/', label: 'LinkedIn' },
              { icon: Mail, href: 'mailto:vikash752008@icloud.com', label: 'Email' },
            ].map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="flex h-9 w-9 items-center justify-center rounded-full border text-[rgba(255,255,255,0.5)] transition-all duration-200 hover:bg-[rgba(47,128,237,0.1)] hover:text-[#2F80ED]"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  borderColor: 'rgba(255,255,255,0.1)',
                }}
              >
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>

        <div className="xl:w-2/3">
          <h2
            className="border-b pb-3 text-[18px] font-semibold text-white"
            style={{ borderColor: 'rgba(255,255,255,0.1)' }}
          >
            About the Developer
          </h2>

          <p className="mt-4 text-[13px] leading-[1.7]" style={{ color: 'rgba(255,255,255,0.65)' }}>
            I architected and developed HearWise to bridge the critical gap between advanced digital
            health solutions and resource-constrained school systems.
          </p>

          <div className="mt-5">
            <p className="mb-2 text-[11px] uppercase tracking-[1px] text-[#2F80ED]">Technical Focus</p>
            <p className="text-[13px] leading-[1.7]" style={{ color: 'rgba(255,255,255,0.6)' }}>
              My core focus is on building scalable, data-driven applications that solve real-world
              problems. For HearWise, this meant designing an offline-first React and Supabase
              architecture capable of delivering reliable clinical screening workflows regardless of
              network connectivity.
            </p>
          </div>

          <div
            className="mt-5 rounded-lg border border-l-[3px] px-4 py-[14px]"
            style={{
              background: 'rgba(47,128,237,0.08)',
              borderColor: 'rgba(47,128,237,0.2)',
              borderLeftColor: '#2F80ED',
            }}
          >
            <p className="text-[11px] uppercase text-[#2F80ED]">Looking Forward</p>
            <p className="mt-2 text-xs leading-[1.7]" style={{ color: 'rgba(255,255,255,0.55)' }}>
              I am deeply passionate about leveraging AI, computer vision, and full-stack development to
              create impactful software. I am actively seeking AI/DS internships and engineering roles to
              further apply my skills to enterprise-level challenges.
            </p>
          </div>

          <a
            href="mailto:vikash752008@icloud.com"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-[#2F80ED] px-5 py-2.5 text-[13px] font-medium text-white transition-all duration-200 hover:bg-[#1a6fd4]"
          >
            Get in Touch
            <ExternalLink size={14} />
          </a>
        </div>
      </section>

      <section>
        <h3 className="mb-[14px] text-sm font-medium text-white">Tech Stack</h3>
        <div className="grid grid-cols-2 gap-2.5 md:grid-cols-3 xl:grid-cols-6">
          {TECH_BADGES.map((item) => (
            <div
              key={item.name}
              className="rounded-[10px] border px-4 py-3 text-center transition-all duration-200 hover:border-[rgba(47,128,237,0.4)] hover:bg-[rgba(47,128,237,0.06)]"
              style={{
                background: 'rgba(255,255,255,0.04)',
                borderColor: 'rgba(255,255,255,0.08)',
              }}
            >
              <p className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.8)' }}>
                {item.name}
              </p>
              <p className="mt-0.5 text-[10px]" style={{ color: 'rgba(255,255,255,0.35)' }}>
                {item.role}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
