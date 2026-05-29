import { useNavigate } from 'react-router-dom';
import { useSession } from '@/contexts/SessionContext';
import { t } from '@/lib/i18n';
import OwlIcon from '@/components/OwlIcon';
import SoundWaveBackground from '@/components/SoundWaveBackground';
import LanguageToggle from '@/components/LanguageToggle';
import { Button } from '@/components/ui/button';
import owlMascot from '@/assets/owl-mascot.png';
import { ChevronDown, BookOpen, GraduationCap, Gamepad2 } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

export default function LandingPage() {
  const navigate = useNavigate();
  const { lang } = useSession();

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="relative flex flex-col min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative flex min-h-screen flex-col items-center justify-center px-6 py-10">
        <SoundWaveBackground />
        <div className="absolute right-4 top-4 z-20">
          <LanguageToggle />
        </div>
        <div className="z-10 flex flex-col items-center gap-4 text-center">
          <img src={owlMascot} alt="HearWise Owl" width={140} height={140} className="drop-shadow-xl animate-in zoom-in duration-500" />
          <h1 className="text-4xl font-extrabold text-foreground tracking-tight sm:text-5xl animate-in fade-in slide-in-from-bottom-4 duration-700">HearWise</h1>
          <p className="max-w-md text-lg text-muted-foreground animate-in fade-in slide-in-from-bottom-5 duration-700 delay-150">
            {t('tagline', lang)}
          </p>
          <div className="flex w-full max-w-sm flex-col gap-3 pt-6 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-300">
            <Button className="h-14 text-lg font-bold rounded-2xl shadow-lg hover:scale-[1.02] transition-transform" onClick={() => navigate('/setup')}>
              {t('startAsTeacher', lang)}
            </Button>
            <Button variant="outline" className="h-14 text-lg font-bold rounded-2xl bg-background/50 backdrop-blur-sm hover:bg-accent/50 transition-colors" onClick={() => navigate('/dashboard')}>
              {t('viewDashboard', lang)}
            </Button>
          </div>
          
          <div className="mt-12 flex gap-8">
            <div className="animate-in fade-in duration-1000 delay-500 flex flex-col items-center cursor-pointer text-muted-foreground hover:text-foreground transition-colors" onClick={() => scrollToSection('learn-more')}>
              <span className="text-sm font-medium mb-2">Learn More</span>
              <ChevronDown className="animate-bounce" size={24} />
            </div>
            <div className="animate-in fade-in duration-1000 delay-500 flex flex-col items-center cursor-pointer text-primary hover:text-primary/80 transition-colors" onClick={() => scrollToSection('education-awareness')}>
              <span className="text-sm font-medium mb-2">Kids Zone</span>
              <Gamepad2 className="animate-bounce" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Learn More / About Project Section */}
      <div id="learn-more" className="flex flex-col items-center px-6 pt-20 pb-10 bg-muted/30">
        <div className="w-full max-w-2xl space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold tracking-tight text-foreground">About the Project</h2>
            <div className="h-1 w-20 bg-primary mx-auto rounded-full"></div>
            <p className="text-base text-muted-foreground leading-relaxed">
              HearWise is an innovative hearing screening application designed specifically for schools to early-detect hearing impairments in children. Built with a vision to make hearing care accessible for every child in India, it provides a simple, accurate, and gamified way to conduct audiometry tests using standard headphones.
            </p>
          </div>

          <Accordion type="single" collapsible className="w-full bg-background rounded-2xl p-4 shadow-sm border">
            <AccordionItem value="item-1" className="border-b-0">
              <AccordionTrigger className="text-lg font-semibold hover:no-underline">Our Mission</AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground">
                To eradicate preventable childhood hearing loss by providing a scalable and affordable screening tool that empowers teachers and healthcare workers to conduct accurate hearing assessments without expensive medical equipment.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2" className="border-b-0 mt-2">
              <AccordionTrigger className="text-lg font-semibold hover:no-underline">How It Works</AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground">
                Using calibrated pure-tone audiometry integrated into a child-friendly interface, HearWise tests different frequencies. The gamified approach ensures children stay engaged, yielding highly accurate preliminary results that guide further medical referrals.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3" className="border-b-0 mt-2">
              <AccordionTrigger className="text-lg font-semibold hover:no-underline">Upcoming Showcase</AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground">
                This project represents a dynamic startup idea focused on health-tech innovation. We are proud to officially showcase HearWise on <strong>June 7th, 2026</strong> at the prestigious <strong>Rathinam Technical Campus</strong> (now a University).
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>

      {/* Education & Awareness Section */}
      <div id="education-awareness" className="flex flex-col items-center px-6 py-16 bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10">
        <div className="w-full max-w-2xl text-center space-y-8">
          <div className="inline-block bg-primary/20 p-4 rounded-full mb-2">
            <GraduationCap className="w-10 h-10 text-primary" />
          </div>
          <h2 className="text-4xl font-black tracking-tight text-foreground bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">Education & Awareness</h2>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-lg mx-auto">
            Hearing health is fun! We've designed a special interactive zone just for children. Let them play games, learn how their ears work, and explore the magic of sound.
          </p>
          
          <div className="pt-6">
            <Button 
              size="lg" 
              className="h-16 px-10 text-xl font-bold rounded-full shadow-[0_0_40px_-10px_rgba(99,102,241,0.5)] hover:scale-105 hover:shadow-[0_0_60px_-15px_rgba(99,102,241,0.7)] transition-all bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 border-0 text-white"
              onClick={() => navigate('/learning-hub')}
            >
              <BookOpen className="mr-3 h-6 w-6" />
              Open Learning Hub
            </Button>
          </div>
        </div>
      </div>

      <div className="pb-10 pt-10 text-center w-full bg-muted/30">
        <p className="text-sm font-medium text-foreground">v1.0.0 • © 2026 HearWise Technologies</p>
        <p className="mt-2 text-xs text-muted-foreground px-6">All student data is stored securely and used exclusively for hearing health diagnosis and referrals.</p>
      </div>
    </div>
  );
}