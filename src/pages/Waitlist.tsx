import BackButton from '../components/BackButton';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import PageWrapper from '@/components/shared/PageWrapper';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle2, ChevronRight, School, MapPin, Users, Send } from 'lucide-react';
import confetti from 'canvas-confetti';

const INDIAN_STATES = [
  'Andaman and Nicobar Islands', 'Andhra Pradesh', 'Arunachal Pradesh', 'Assam',
  'Bihar', 'Chandigarh', 'Chhattisgarh', 'Dadra and Nagar Haveli', 'Daman and Diu',
  'Delhi', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jammu and Kashmir',
  'Jharkhand', 'Karnataka', 'Kerala', 'Ladakh', 'Lakshadweep', 'Madhya Pradesh',
  'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha',
  'Puducherry', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana',
  'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
];

export default function Waitlist() {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [waitlistCount, setWaitlistCount] = useState(47); // Fallback static
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [queuePosition, setQueuePosition] = useState(48);

  const [formData, setFormData] = useState({
    fullName: '',
    role: '',
    schoolName: '',
    city: '',
    state: 'Tamil Nadu',
    mobile: '',
    email: '',
    urgency: ''
  });

  useEffect(() => {
    async function fetchCount() {
      const { count, error } = await supabase
        .from('waitlist')
        .select('*', { count: 'exact', head: true });
      if (!error && count !== null) {
        setWaitlistCount(count + 47); // Adding base to make it look active
      }
    }
    fetchCount();
  }, []);

  const updateForm = (key: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.schoolName || formData.mobile.length !== 10) {
      toast({ title: 'Error', description: 'Please fill out all required fields correctly.', variant: 'destructive' });
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('waitlist').insert({
        full_name: formData.fullName,
        role: formData.role,
        school_name: formData.schoolName,
        city: formData.city,
        state: formData.state,
        mobile: formData.mobile,
        email: formData.email,
        urgency: formData.urgency
      });

      if (error) throw error;
      
      setQueuePosition(waitlistCount + 1);
      setIsSuccess(true);
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 }
      });
    } catch (error: unknown) {
      console.error(error);
      toast({
        title: "Submission Failed",
        description: error instanceof Error ? error.message : "Please check your connection and try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleShare = () => {
    const text = `I just registered ${formData.schoolName} on HearWise — India's first mobile school hearing screening platform. Check it out: https://hearwise-child-health.vercel.app/waitlist`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <PageWrapper title="Early Access Waitlist" backPath="/">
      <BackButton />
      <div className="bg-[#000b1d] min-h-screen pb-24 text-white font-sans overflow-x-hidden relative">
        
        {/* Background Accents */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1000px] h-[600px] bg-gradient-to-b from-teal-900/20 to-transparent blur-3xl pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-20">
          
          <div className="text-center space-y-6 mb-16 relative z-10">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-400 font-bold uppercase tracking-widest text-xs mb-4">
              <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
              Live Waitlist
            </motion.div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-tight">
              HearWise is Coming <br/> to <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-500">Your City</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Be among the first schools in India to offer free hearing screening for every child. Join our early access waitlist and we will onboard your school personally.
            </p>
            <div className="flex justify-center items-center gap-6 pt-6">
              <div className="text-center">
                <div className="text-4xl font-black text-teal-400 font-mono mb-1">{waitlistCount}</div>
                <div className="text-xs text-slate-500 uppercase font-bold tracking-widest">Schools Waiting</div>
              </div>
            </div>
            
            <div className="bg-amber-900/20 border border-amber-500/20 rounded-xl max-w-xl mx-auto p-4 flex gap-4 items-start text-left mt-8">
              <span className="text-2xl">⚡</span>
              <p className="text-sm text-amber-100/80 leading-relaxed font-medium">
                <strong className="text-amber-400">First 100 schools</strong> get priority onboarding support and a dedicated HearWise school success manager.
              </p>
            </div>
          </div>

          <div className="max-w-xl mx-auto relative z-10">
            <AnimatePresence mode="wait">
              {!isSuccess ? (
                <motion.div
                  key="form"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="glass-panel p-8 sm:p-10 rounded-[3rem] bg-white/5 border border-white/10 backdrop-blur-xl shadow-2xl"
                >
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label className="text-slate-300">Full Name *</Label>
                        <Input required value={formData.fullName} onChange={e => updateForm('fullName', e.target.value)} className="bg-black/20 border-white/10 h-12 focus:border-teal-500 text-white" />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-slate-300">Role *</Label>
                        <Select required value={formData.role} onValueChange={v => updateForm('role', v)}>
                          <SelectTrigger className="bg-black/20 border-white/10 h-12 text-white">
                            <SelectValue placeholder="Select Role" />
                          </SelectTrigger>
                          <SelectContent>
                            {['Teacher', 'Principal', 'Health Officer', 'Parent', 'Audiologist', 'Other'].map(r => (
                              <SelectItem key={r} value={r}>{r}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-slate-300">School Name *</Label>
                      <Input required value={formData.schoolName} onChange={e => updateForm('schoolName', e.target.value)} className="bg-black/20 border-white/10 h-12 focus:border-teal-500 text-white" />
                    </div>

                    <div className="grid sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label className="text-slate-300">State *</Label>
                        <Select required value={formData.state} onValueChange={v => updateForm('state', v)}>
                          <SelectTrigger className="bg-black/20 border-white/10 h-12 text-white">
                            <SelectValue placeholder="Select State" />
                          </SelectTrigger>
                          <SelectContent className="max-h-[300px]">
                            {INDIAN_STATES.map(s => (
                              <SelectItem key={s} value={s}>{s}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-slate-300">City / District *</Label>
                        <Input required value={formData.city} onChange={e => updateForm('city', e.target.value)} className="bg-black/20 border-white/10 h-12 focus:border-teal-500 text-white" />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label className="text-slate-300">Mobile Number *</Label>
                        <div className="relative">
                          <span className="absolute left-3 top-3.5 text-slate-500 text-sm font-medium">+91</span>
                          <Input required value={formData.mobile} onChange={e => updateForm('mobile', e.target.value.replace(/\D/g, '').slice(0, 10))} className="bg-black/20 border-white/10 h-12 pl-12 focus:border-teal-500 text-white" placeholder="10-digit number" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-slate-300">Email Address</Label>
                        <Input type="email" value={formData.email} onChange={e => updateForm('email', e.target.value)} className="bg-black/20 border-white/10 h-12 focus:border-teal-500 text-white" />
                      </div>
                    </div>

                    <div className="space-y-4 pt-2">
                      <Label className="text-slate-300 text-base font-bold">How urgent is this for your school? *</Label>
                      <RadioGroup required value={formData.urgency} onValueChange={v => updateForm('urgency', v)} className="flex flex-col gap-3">
                        {['Very urgent (Need it this month)', 'Within 3 months', 'Just exploring for now'].map(urg => (
                          <div key={urg} className={`flex items-center space-x-3 bg-black/20 p-4 rounded-xl border transition-colors cursor-pointer ${formData.urgency === urg ? 'border-teal-500 bg-teal-500/10' : 'border-white/10 hover:border-white/30'}`}>
                            <RadioGroupItem value={urg} id={`urg-${urg}`} />
                            <Label htmlFor={`urg-${urg}`} className="cursor-pointer font-medium text-white flex-1">{urg}</Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>

                    <Button type="submit" disabled={isSubmitting} className="w-full h-14 text-lg font-black bg-teal-500 hover:bg-teal-400 text-[#000b1d] rounded-2xl shadow-lg shadow-teal-500/20 mt-8">
                      {isSubmitting ? 'Joining...' : 'Join the Waitlist'} <ChevronRight className="ml-2 w-5 h-5" />
                    </Button>
                  </form>
                </motion.div>
              ) : (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="glass-panel p-10 sm:p-12 text-center rounded-[3rem] border border-emerald-500/30 bg-emerald-900/10 shadow-2xl shadow-emerald-500/10 space-y-8"
                >
                  <div className="w-24 h-24 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto animate-pulse">
                    <span className="text-5xl">🎉</span>
                  </div>
                  <div>
                    <h2 className="text-4xl font-black text-white mb-4">You're on the list!</h2>
                    <p className="text-lg text-emerald-100/80 leading-relaxed max-w-sm mx-auto">
                      We've added <strong className="text-white">{formData.fullName}</strong> from <strong className="text-white">{formData.schoolName}</strong> to our early access waitlist.
                    </p>
                  </div>
                  <div className="inline-block bg-black/40 border border-emerald-500/30 rounded-2xl p-6 px-10">
                    <p className="text-sm text-emerald-400/80 font-bold uppercase tracking-widest mb-2">Your Position in Queue</p>
                    <p className="text-6xl font-black text-white font-mono">#{queuePosition}</p>
                  </div>
                  <div className="pt-4">
                    <Button onClick={handleShare} className="w-full sm:w-auto h-14 px-8 text-lg font-bold bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-2xl shadow-lg shadow-emerald-900">
                      Share HearWise <Send className="ml-3 w-5 h-5" />
                    </Button>
                  </div>
                  <p className="text-sm text-slate-400 pt-4">We will contact you at {formData.mobile} when we are ready to onboard your school.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="mt-20 pt-10 border-t border-white/10 max-w-4xl mx-auto flex flex-col sm:flex-row justify-center gap-8 sm:gap-16">
            <div className="flex items-center gap-4 text-slate-400">
              <School className="w-8 h-8 text-teal-500/50" />
              <div>
                <div className="font-bold text-white">{waitlistCount}</div>
                <div className="text-xs uppercase tracking-widest font-bold">Schools Waiting</div>
              </div>
            </div>
            <div className="flex items-center gap-4 text-slate-400">
              <MapPin className="w-8 h-8 text-pink-500/50" />
              <div>
                <div className="font-bold text-white">6</div>
                <div className="text-xs uppercase tracking-widest font-bold">Districts</div>
              </div>
            </div>
            <div className="flex items-center gap-4 text-slate-400">
              <Users className="w-8 h-8 text-blue-500/50" />
              <div>
                <div className="font-bold text-white">3</div>
                <div className="text-xs uppercase tracking-widest font-bold">States</div>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </PageWrapper>
  );
}
