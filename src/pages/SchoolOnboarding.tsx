import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession } from '@/contexts/SessionContext';
import { t } from '@/lib/i18n';
import PageWrapper from '@/components/shared/PageWrapper';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/lib/supabase';
import { CheckCircle2, ChevronRight, ArrowLeft, Building2, User, Cpu, PartyPopper, HelpCircle, Shield, Rocket, Target, ListChecks, CheckSquare, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const TN_DISTRICTS = [
  'Ariyalur', 'Chengalpattu', 'Chennai', 'Coimbatore', 'Cuddalore', 'Dharmapuri', 'Dindigul', 
  'Erode', 'Kallakurichi', 'Kanchipuram', 'Kanyakumari', 'Karur', 'Krishnagiri', 'Madurai', 
  'Mayiladuthurai', 'Nagapattinam', 'Namakkal', 'Nilgiris', 'Perambalur', 'Pudukkottai', 
  'Ramanathapuram', 'Ranipet', 'Salem', 'Sivaganga', 'Tenkasi', 'Thanjavur', 'Theni', 
  'Thoothukudi', 'Tiruchirappalli', 'Tirunelveli', 'Tirupathur', 'Tiruppur', 'Tiruvallur', 
  'Tiruvannamalai', 'Tiruvarur', 'Vellore', 'Viluppuram', 'Virudhunagar'
];

export default function SchoolOnboarding() {
  const navigate = useNavigate();
  const { lang } = useSession();
  const { toast } = useToast();
  
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    schoolName: '',
    schoolType: '',
    address: '',
    district: '',
    state: 'Tamil Nadu',
    pincode: '',
    udiseCode: '',
    studentCount: '',
    classes: [] as string[],
    contactName: '',
    designation: '',
    email: '',
    mobile: '',
    preferredLanguage: '',
    contactTime: '',
    androidAvailable: '',
    phoneCount: '',
    headphonesAvailable: '',
    connectivity: '',
    experience: '',
    referralSource: '',
    notes: ''
  });

  const handleNext = () => setStep(s => Math.min(4, s + 1));
  const handleBack = () => setStep(s => Math.max(1, s - 1));

  const updateForm = (key: keyof typeof formData, value: unknown) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleClassToggle = (cls: string) => {
    setFormData(prev => {
      const current = prev.classes;
      return {
        ...prev,
        classes: current.includes(cls) ? current.filter(c => c !== cls) : [...current, cls]
      };
    });
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('school_registrations').insert({
        school_name: formData.schoolName,
        school_type: formData.schoolType,
        address: formData.address,
        district: formData.district,
        state: formData.state,
        pincode: formData.pincode,
        udise_code: formData.udiseCode || null,
        student_count: parseInt(formData.studentCount) || 0,
        contact_name: formData.contactName,
        designation: formData.designation,
        email: formData.email,
        mobile: formData.mobile,
        preferred_language: formData.preferredLanguage,
        android_available: formData.androidAvailable === 'Yes',
        phone_count: parseInt(formData.phoneCount) || 0,
        headphones_available: formData.headphonesAvailable,
        connectivity: formData.connectivity,
        referral_source: formData.referralSource,
        notes: formData.notes
      });

      if (error) throw error;
      setIsSuccess(true);
    } catch (error: unknown) {
      console.error(error);
      toast({
        title: "Registration Failed",
        description: error instanceof Error ? error.message : "Please check your connection and try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <PageWrapper title="Registration Complete" backPath="/">
        <div className="bg-[#020817] min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none mix-blend-overlay"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-500/20 rounded-full blur-[150px] pointer-events-none" />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="relative z-10 glass-panel max-w-2xl w-full p-12 text-center rounded-[3rem] border border-emerald-500/40 bg-emerald-950/40 shadow-2xl shadow-emerald-900/50 backdrop-blur-2xl space-y-8"
          >
            <motion.div 
              initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.2 }}
              className="w-28 h-28 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-500/30 shadow-lg shadow-emerald-500/20"
            >
              <PartyPopper className="w-14 h-14 text-emerald-400" />
            </motion.div>
            <h1 className="text-5xl font-black text-white tracking-tight">Registration Received!</h1>
            <p className="text-xl text-emerald-100/90 leading-relaxed max-w-xl mx-auto">
              Welcome to the HearWise network, <strong className="text-white font-black">{formData.schoolName}</strong>!
            </p>
            <div className="bg-emerald-900/40 border border-emerald-500/30 rounded-2xl p-6 text-left">
              <h3 className="text-emerald-400 font-bold uppercase tracking-widest text-sm mb-3 flex items-center gap-2"><Rocket className="w-4 h-4"/> Next Steps</h3>
              <ul className="space-y-3 text-emerald-100/80">
                <li className="flex items-start gap-3">
                  <CheckSquare className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                  Our team will call <strong>{formData.contactName}</strong> at <strong>{formData.mobile}</strong> within 48 hours.
                </li>
                <li className="flex items-start gap-3">
                  <CheckSquare className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                  We will provide Admin credentials for your school's dashboard.
                </li>
                <li className="flex items-start gap-3">
                  <CheckSquare className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                  We will schedule a 30-minute virtual teacher training session.
                </li>
              </ul>
            </div>
            <Button size="lg" className="w-full h-16 text-xl font-black bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.02]" onClick={() => navigate('/')}>
              Return to Home <ArrowRight className="ml-2 w-6 h-6" />
            </Button>
          </motion.div>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper title="Register School" backPath="/">
      <div className="bg-[#020817] min-h-screen text-slate-200 relative overflow-hidden pb-24">
        
        {/* Animated background orbs */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-teal-500/10 rounded-full blur-[120px] animate-pulse pointer-events-none" />
        <div className="absolute bottom-1/4 left-0 w-[600px] h-[600px] bg-cyan-600/5 rounded-full blur-[120px] animate-pulse pointer-events-none" style={{ animationDelay: '3s' }} />

        {/* Grid overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.03] z-0"
          style={{
            backgroundImage: `linear-gradient(rgba(20,184,166,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(20,184,166,0.5) 1px, transparent 1px)`,
            backgroundSize: '60px 60px'
          }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 pt-16">
          
          <div className="text-center space-y-6 max-w-3xl mx-auto mb-16">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-teal-500/30 bg-teal-500/10 text-teal-400 text-xs font-semibold uppercase tracking-widest mb-6">
                <Sparkles className="w-4 h-4" />
                FOR EDUCATORS
              </div>
              <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-tight">
                REGISTER YOUR <br/>
                <span className="bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">
                  SCHOOL FOR FREE
                </span>
              </h1>
              <p className="text-xl text-slate-400 mt-6 leading-relaxed">
                Join the movement to screen every child in India. No expensive equipment needed—just Android phones, headphones, and a quiet room.
              </p>
            </motion.div>
          </div>

          <div className="grid lg:grid-cols-12 gap-12">
            
            {/* Form Section */}
            <div className="lg:col-span-8">
              {/* STEP INDICATOR */}
              <div className="flex justify-between items-center relative pb-10">
                <div className="absolute top-6 left-0 right-0 h-1.5 bg-white/5 z-0 rounded-full" />
                <div className="absolute top-6 left-0 h-1.5 bg-gradient-to-r from-teal-600 to-teal-400 z-0 rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(45,212,191,0.5)]" style={{ width: `${((step - 1) / 3) * 100}%` }} />
                
                {[
                  { num: 1, label: 'Details', icon: <Building2 className="w-5 h-5" /> },
                  { num: 2, label: 'Contact', icon: <User className="w-5 h-5" /> },
                  { num: 3, label: 'Setup', icon: <Cpu className="w-5 h-5" /> },
                  { num: 4, label: 'Confirm', icon: <CheckCircle2 className="w-5 h-5" /> }
                ].map(s => (
                  <div key={s.num} className="relative z-10 flex flex-col items-center gap-3">
                    <motion.div 
                      whileHover={{ scale: 1.1 }}
                      className={`w-12 h-12 rounded-full flex items-center justify-center font-bold shadow-lg transition-all duration-300 ${
                      step > s.num ? 'bg-teal-500 text-white shadow-teal-500/30' : 
                      step === s.num ? 'bg-black text-teal-400 border-2 border-teal-400 shadow-[0_0_15px_rgba(45,212,191,0.4)]' : 
                      'bg-[#020817] text-slate-500 border-2 border-white/10'
                    }`}>
                      {step > s.num ? <CheckCircle2 className="w-6 h-6" /> : s.num}
                    </motion.div>
                    <span className={`text-[10px] sm:text-xs font-bold uppercase tracking-widest ${
                      step === s.num ? 'text-teal-400' : step > s.num ? 'text-teal-300' : 'text-slate-500'
                    }`}>{s.label}</span>
                  </div>
                ))}
              </div>

              <div className="glass-panel p-6 sm:p-10 rounded-[2.5rem] border border-white/10 bg-black/40 backdrop-blur-2xl shadow-2xl relative overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={step}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    {step === 1 && (
                      <div className="space-y-8">
                        <h2 className="text-3xl font-black text-white flex items-center gap-3"><Building2 className="text-teal-400 w-8 h-8" /> School Details</h2>
                        
                        <div className="space-y-6">
                          <div>
                            <Label className="text-slate-300 text-sm font-semibold">School Name *</Label>
                            <Input value={formData.schoolName} onChange={e => updateForm('schoolName', e.target.value)} className="bg-white/5 border-white/10 h-14 rounded-xl mt-2 text-white focus:border-teal-500 text-lg" />
                          </div>
                          
                          <div>
                            <Label className="text-slate-300 text-sm font-semibold">School Type *</Label>
                            <RadioGroup value={formData.schoolType} onValueChange={v => updateForm('schoolType', v)} className="flex flex-wrap gap-4 mt-3">
                              {['Government', 'Government-Aided', 'Private', 'CBSE', 'ICSE'].map(type => (
                                <div key={type} className={`flex items-center space-x-2 px-5 py-3 rounded-xl border cursor-pointer transition-all ${formData.schoolType === type ? 'bg-teal-500/20 border-teal-500 shadow-lg shadow-teal-500/10 text-teal-300' : 'bg-white/5 border-white/10 hover:border-white/30 text-slate-300'}`}>
                                  <RadioGroupItem value={type} id={`type-${type}`} className="hidden" />
                                  <Label htmlFor={`type-${type}`} className="cursor-pointer font-semibold">{type}</Label>
                                </div>
                              ))}
                            </RadioGroup>
                          </div>

                          <div>
                            <Label className="text-slate-300 text-sm font-semibold">Full Address *</Label>
                            <Textarea value={formData.address} onChange={e => updateForm('address', e.target.value)} className="bg-white/5 border-white/10 mt-2 focus:border-teal-500 min-h-[100px] rounded-xl text-white text-lg" />
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                              <Label className="text-slate-300 text-sm font-semibold">District *</Label>
                              <Select value={formData.district} onValueChange={v => updateForm('district', v)}>
                                <SelectTrigger className="bg-white/5 border-white/10 h-14 mt-2 rounded-xl text-white text-lg">
                                  <SelectValue placeholder="Select District" />
                                </SelectTrigger>
                                <SelectContent className="max-h-64">
                                  {TN_DISTRICTS.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label className="text-slate-300 text-sm font-semibold">Pincode *</Label>
                              <Input value={formData.pincode} onChange={e => updateForm('pincode', e.target.value.replace(/\D/g, '').slice(0, 6))} className="bg-white/5 border-white/10 h-14 mt-2 rounded-xl text-white focus:border-teal-500 text-lg" />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                              <Label className="text-slate-300 text-sm font-semibold">School UDISE Code (Optional)</Label>
                              <Input value={formData.udiseCode} onChange={e => updateForm('udiseCode', e.target.value)} className="bg-white/5 border-white/10 h-14 mt-2 rounded-xl text-white focus:border-teal-500 text-lg" />
                            </div>
                            <div>
                              <Label className="text-slate-300 text-sm font-semibold">Approx. Number of Students *</Label>
                              <Input type="number" value={formData.studentCount} onChange={e => updateForm('studentCount', e.target.value)} className="bg-white/5 border-white/10 h-14 mt-2 rounded-xl text-white focus:border-teal-500 text-lg" />
                            </div>
                          </div>

                          <div>
                            <Label className="text-slate-300 text-sm font-semibold">Classes Available</Label>
                            <div className="flex flex-wrap gap-3 mt-3">
                              {['LKG', 'UKG', '1-5', '6-8', '9-10', '11-12'].map(cls => (
                                <label key={cls} className={`flex items-center gap-3 px-5 py-3 rounded-xl border cursor-pointer transition-all ${formData.classes.includes(cls) ? 'bg-teal-500/20 border-teal-500 text-teal-300 shadow-lg shadow-teal-500/10' : 'bg-white/5 border-white/10 hover:border-white/30 text-slate-300'}`}>
                                  <Checkbox checked={formData.classes.includes(cls)} onCheckedChange={() => handleClassToggle(cls)} />
                                  <span className="font-semibold">{cls}</span>
                                </label>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {step === 2 && (
                      <div className="space-y-8">
                        <h2 className="text-3xl font-black text-white flex items-center gap-3"><User className="text-teal-400 w-8 h-8" /> Contact Person</h2>
                        
                        <div className="space-y-6">
                          <div>
                            <Label className="text-slate-300 text-sm font-semibold">Contact Person Name *</Label>
                            <Input value={formData.contactName} onChange={e => updateForm('contactName', e.target.value)} className="bg-white/5 border-white/10 h-14 rounded-xl mt-2 text-white focus:border-teal-500 text-lg" />
                          </div>

                          <div>
                            <Label className="text-slate-300 text-sm font-semibold">Designation *</Label>
                            <RadioGroup value={formData.designation} onValueChange={v => updateForm('designation', v)} className="flex flex-wrap gap-4 mt-3">
                              {['Principal', 'Vice Principal', 'Health Teacher', 'Other'].map(type => (
                                <div key={type} className={`flex items-center space-x-2 px-5 py-3 rounded-xl border cursor-pointer transition-all ${formData.designation === type ? 'bg-teal-500/20 border-teal-500 shadow-lg shadow-teal-500/10 text-teal-300' : 'bg-white/5 border-white/10 hover:border-white/30 text-slate-300'}`}>
                                  <RadioGroupItem value={type} id={`desig-${type}`} className="hidden" />
                                  <Label htmlFor={`desig-${type}`} className="cursor-pointer font-semibold">{type}</Label>
                                </div>
                              ))}
                            </RadioGroup>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                              <Label className="text-slate-300 text-sm font-semibold">Email Address *</Label>
                              <Input type="email" value={formData.email} onChange={e => updateForm('email', e.target.value)} className="bg-white/5 border-white/10 h-14 rounded-xl mt-2 text-white focus:border-teal-500 text-lg" />
                            </div>
                            <div>
                              <Label className="text-slate-300 text-sm font-semibold">Mobile Number *</Label>
                              <div className="relative mt-2">
                                <span className="absolute left-4 top-4 text-white/50 font-bold">+91</span>
                                <Input value={formData.mobile} onChange={e => updateForm('mobile', e.target.value.replace(/\D/g, '').slice(0, 10))} className="bg-white/5 border-white/10 h-14 rounded-xl pl-14 text-white focus:border-teal-500 text-lg" />
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                              <Label className="text-slate-300 text-sm font-semibold">Preferred Language</Label>
                              <Select value={formData.preferredLanguage} onValueChange={v => updateForm('preferredLanguage', v)}>
                                <SelectTrigger className="bg-white/5 border-white/10 h-14 mt-2 rounded-xl text-white text-lg">
                                  <SelectValue placeholder="Select Language" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="English">English</SelectItem>
                                  <SelectItem value="Tamil">Tamil (தமிழ்)</SelectItem>
                                  <SelectItem value="Hindi">Hindi (हिंदी)</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label className="text-slate-300 text-sm font-semibold">Best Time to Contact</Label>
                              <Select value={formData.contactTime} onValueChange={v => updateForm('contactTime', v)}>
                                <SelectTrigger className="bg-white/5 border-white/10 h-14 mt-2 rounded-xl text-white text-lg">
                                  <SelectValue placeholder="Select Time" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Morning (9 AM - 12 PM)">Morning (9 AM - 12 PM)</SelectItem>
                                  <SelectItem value="Afternoon (12 PM - 4 PM)">Afternoon (12 PM - 4 PM)</SelectItem>
                                  <SelectItem value="Evening (4 PM - 6 PM)">Evening (4 PM - 6 PM)</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {step === 3 && (
                      <div className="space-y-8">
                        <h2 className="text-3xl font-black text-white flex items-center gap-3"><Cpu className="text-teal-400 w-8 h-8" /> Infrastructure & Setup</h2>
                        
                        <div className="space-y-8">
                          <div>
                            <Label className="text-slate-300 text-base font-semibold">Do you have Android smartphones available for screening? *</Label>
                            <RadioGroup value={formData.androidAvailable} onValueChange={v => updateForm('androidAvailable', v)} className="flex gap-6 mt-4">
                              {['Yes', 'No', 'Unsure'].map(type => (
                                <div key={type} className="flex items-center space-x-2">
                                  <RadioGroupItem value={type} id={`android-${type}`} />
                                  <Label htmlFor={`android-${type}`} className="text-white font-medium">{type}</Label>
                                </div>
                              ))}
                            </RadioGroup>
                          </div>

                          {formData.androidAvailable === 'Yes' && (
                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                              <Label className="text-slate-300 text-sm font-semibold">How many smartphones? (Approx)</Label>
                              <Input type="number" value={formData.phoneCount} onChange={e => updateForm('phoneCount', e.target.value)} className="bg-white/5 border-white/10 h-14 mt-2 rounded-xl text-white focus:border-teal-500 text-lg max-w-xs" />
                            </motion.div>
                          )}

                          <div>
                            <Label className="text-slate-300 text-base font-semibold">Do you have standard wired headphones? *</Label>
                            <RadioGroup value={formData.headphonesAvailable} onValueChange={v => updateForm('headphonesAvailable', v)} className="flex flex-col gap-4 mt-4">
                              {['Yes, we have them', 'No, but we can arrange them', 'No, we need help procuring them'].map(type => (
                                <div key={type} className="flex items-center space-x-3 bg-white/5 p-4 rounded-xl border border-white/10 hover:border-teal-500/50 transition-colors">
                                  <RadioGroupItem value={type} id={`hp-${type}`} />
                                  <Label htmlFor={`hp-${type}`} className="text-white font-medium w-full cursor-pointer">{type}</Label>
                                </div>
                              ))}
                            </RadioGroup>
                          </div>

                          <div>
                            <Label className="text-slate-300 text-base font-semibold">Internet connectivity at school</Label>
                            <Select value={formData.connectivity} onValueChange={v => updateForm('connectivity', v)}>
                              <SelectTrigger className="bg-white/5 border-white/10 h-14 mt-2 rounded-xl text-white text-lg max-w-md">
                                <SelectValue placeholder="Select Connectivity" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Good WiFi / 4G">Good WiFi / 4G</SelectItem>
                                <SelectItem value="Intermittent / Poor">Intermittent / Poor (HearWise works offline!)</SelectItem>
                                <SelectItem value="None">None</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div>
                            <Label className="text-slate-300 text-base font-semibold">How did you hear about HearWise?</Label>
                            <Select value={formData.referralSource} onValueChange={v => updateForm('referralSource', v)}>
                              <SelectTrigger className="bg-white/5 border-white/10 h-14 mt-2 rounded-xl text-white text-lg max-w-md">
                                <SelectValue placeholder="Select Source" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Social Media">Social Media</SelectItem>
                                <SelectItem value="Colleague / Other School">Colleague / Other School</SelectItem>
                                <SelectItem value="Government Notification">Government Notification</SelectItem>
                                <SelectItem value="News / Press">News / Press</SelectItem>
                                <SelectItem value="Other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div>
                            <Label className="text-slate-300 text-sm font-semibold">Any additional notes or questions? (Optional)</Label>
                            <Textarea value={formData.notes} onChange={e => updateForm('notes', e.target.value)} className="bg-white/5 border-white/10 mt-2 min-h-[120px] rounded-xl text-white text-lg focus:border-teal-500" />
                          </div>
                        </div>
                      </div>
                    )}

                    {step === 4 && (
                      <div className="space-y-8">
                        <h2 className="text-3xl font-black text-white flex items-center gap-3"><CheckCircle2 className="text-teal-400 w-8 h-8" /> Review Details</h2>
                        <p className="text-slate-400 text-lg">Please review your school details before submitting.</p>
                        
                        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 space-y-8 text-base">
                          
                          <div className="flex justify-between items-start border-b border-white/10 pb-6">
                            <div className="space-y-2">
                              <p className="text-teal-400 font-bold uppercase text-xs tracking-widest">School Details</p>
                              <p className="font-black text-white text-2xl">{formData.schoolName || '—'}</p>
                              <p className="text-slate-300 font-medium">{formData.schoolType} • {formData.studentCount} Students</p>
                              <p className="text-slate-400">{formData.address}, {formData.district}, {formData.state} - {formData.pincode}</p>
                            </div>
                            <Button variant="ghost" onClick={() => setStep(1)} className="text-white/50 hover:text-white hover:bg-white/10 rounded-xl">Edit</Button>
                          </div>

                          <div className="flex justify-between items-start border-b border-white/10 pb-6">
                            <div className="space-y-2">
                              <p className="text-teal-400 font-bold uppercase text-xs tracking-widest">Contact Person</p>
                              <p className="font-bold text-white text-lg">{formData.contactName || '—'} <span className="text-slate-400 font-medium text-base">({formData.designation})</span></p>
                              <p className="text-slate-300">{formData.email}</p>
                              <p className="text-slate-300">+91 {formData.mobile}</p>
                            </div>
                            <Button variant="ghost" onClick={() => setStep(2)} className="text-white/50 hover:text-white hover:bg-white/10 rounded-xl">Edit</Button>
                          </div>

                          <div className="flex justify-between items-start">
                            <div className="space-y-3">
                              <p className="text-teal-400 font-bold uppercase text-xs tracking-widest">Infrastructure</p>
                              <p className="text-slate-400">Android: <span className="text-white font-medium">{formData.androidAvailable}</span></p>
                              <p className="text-slate-400">Headphones: <span className="text-white font-medium">{formData.headphonesAvailable}</span></p>
                              <p className="text-slate-400">Internet: <span className="text-white font-medium">{formData.connectivity}</span></p>
                            </div>
                            <Button variant="ghost" onClick={() => setStep(3)} className="text-white/50 hover:text-white hover:bg-white/10 rounded-xl">Edit</Button>
                          </div>

                        </div>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>

                {/* Bottom Controls */}
                <div className="mt-12 pt-8 border-t border-white/10 flex justify-between">
                  {step > 1 ? (
                    <Button variant="outline" onClick={handleBack} className="bg-transparent border-white/20 text-white hover:bg-white/10 px-8 h-14 rounded-xl font-bold text-lg">
                      <ArrowLeft className="mr-2 w-5 h-5" /> Back
                    </Button>
                  ) : <div></div>}
                  
                  {step < 4 ? (
                    <Button onClick={handleNext} className="bg-teal-600 hover:bg-teal-500 text-white font-black px-10 h-14 rounded-xl text-lg shadow-lg shadow-teal-500/20">
                      Next Step <ChevronRight className="ml-2 w-5 h-5" />
                    </Button>
                  ) : (
                    <Button 
                      onClick={handleSubmit} 
                      disabled={isSubmitting || !formData.schoolName || !formData.contactName || formData.mobile.length !== 10}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white font-black px-10 h-14 rounded-xl text-lg shadow-xl shadow-emerald-500/30 transition-all hover:scale-[1.02]"
                    >
                      {isSubmitting ? 'Submitting...' : 'Submit Registration'} <CheckCircle2 className="ml-2 w-5 h-5" />
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* Informational Sidebar */}
            <div className="lg:col-span-4 space-y-6">
              
              <div className="bg-gradient-to-br from-teal-900/30 to-[#020817] border border-teal-500/20 p-8 rounded-[2.5rem] backdrop-blur-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none">
                  <Target className="w-32 h-32 text-teal-400" />
                </div>
                <h3 className="text-2xl font-black text-white mb-6 relative z-10">The HearWise Impact</h3>
                <div className="space-y-6 relative z-10">
                  <div className="flex gap-4 items-start">
                    <div className="w-10 h-10 rounded-full bg-teal-500/20 flex items-center justify-center shrink-0 border border-teal-500/30">
                      <span className="text-teal-400 font-bold">1</span>
                    </div>
                    <div>
                      <h4 className="text-white font-bold">Zero Cost</h4>
                      <p className="text-slate-400 text-sm mt-1">Our platform is 100% free for all Government and Aided schools.</p>
                    </div>
                  </div>
                  <div className="flex gap-4 items-start">
                    <div className="w-10 h-10 rounded-full bg-teal-500/20 flex items-center justify-center shrink-0 border border-teal-500/30">
                      <span className="text-teal-400 font-bold">2</span>
                    </div>
                    <div>
                      <h4 className="text-white font-bold">Extremely Fast</h4>
                      <p className="text-slate-400 text-sm mt-1">Screen up to 50 students per hour using a single smartphone.</p>
                    </div>
                  </div>
                  <div className="flex gap-4 items-start">
                    <div className="w-10 h-10 rounded-full bg-teal-500/20 flex items-center justify-center shrink-0 border border-teal-500/30">
                      <span className="text-teal-400 font-bold">3</span>
                    </div>
                    <div>
                      <h4 className="text-white font-bold">Instant Reports</h4>
                      <p className="text-slate-400 text-sm mt-1">Get immediate digital reports and clinical referral pathways for parents.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 p-8 rounded-[2.5rem] backdrop-blur-xl">
                <h3 className="text-xl font-black text-white mb-6 flex items-center gap-2">
                  <HelpCircle className="text-cyan-400" /> Frequently Asked
                </h3>
                <div className="space-y-4">
                  {[
                    { q: "Do we need an internet connection?", a: "The HearWise app works entirely offline. You only need internet to upload the data at the end of the day." },
                    { q: "Who conducts the tests?", a: "Any teacher or volunteer can conduct the test after a 30-minute training session from our team." },
                    { q: "What headphones should we use?", a: "Standard over-ear wired headphones work best. Avoid bluetooth or earphones for clinical accuracy." }
                  ].map((faq, i) => (
                    <div key={i} className="border border-white/10 rounded-2xl bg-black/20 overflow-hidden">
                      <button 
                        onClick={() => setOpenFaq(openFaq === i ? null : i)}
                        className="w-full text-left p-4 font-bold text-white hover:bg-white/5 transition-colors flex justify-between items-center"
                      >
                        {faq.q}
                        <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform ${openFaq === i ? 'rotate-90' : ''}`} />
                      </button>
                      <AnimatePresence>
                        {openFaq === i && (
                          <motion.div 
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="px-4 pb-4 text-sm text-slate-400"
                          >
                            {faq.a}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
