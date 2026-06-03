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
import { CheckCircle2, ChevronRight, ArrowLeft, Building2, User, Cpu, PartyPopper } from 'lucide-react';
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

  const updateForm = (key: keyof typeof formData, value: any) => {
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
    } catch (err: any) {
      console.error(err);
      toast({
        title: "Registration Failed",
        description: err.message || "Please check your connection and try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <PageWrapper title="Registration Complete" backPath="/">
        <div className="bg-[#000b1d] min-h-screen flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-panel max-w-lg w-full p-10 text-center rounded-[3rem] border border-emerald-500/30 bg-emerald-900/10 shadow-2xl shadow-emerald-500/10 space-y-6"
          >
            <div className="w-24 h-24 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
              <PartyPopper className="w-12 h-12 text-emerald-400" />
            </div>
            <h1 className="text-4xl font-black text-white tracking-tight">🎉 Registration Received!</h1>
            <p className="text-lg text-emerald-100/80 leading-relaxed">
              Thank you for registering <strong className="text-white">{formData.schoolName}</strong> with HearWise.
              Our team will contact <strong>{formData.contactName}</strong> at <strong>{formData.mobile}</strong> within 2–3 working days to complete your school's onboarding.
            </p>
            <p className="text-emerald-300/80 italic pb-4">
              Together, we will ensure every child in your school gets their hearing checked.
            </p>
            <Button size="lg" className="w-full h-14 text-lg font-bold bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl" onClick={() => navigate('/')}>
              Back to Home <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </motion.div>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper title="Register School" backPath="/">
      <div className="bg-[#000b1d] min-h-screen text-slate-200 py-12 px-4 md:px-8">
        <div className="max-w-3xl mx-auto space-y-12">
          
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">School Onboarding</h1>
            <p className="text-lg text-teal-400">Join the movement to screen every child in India.</p>
          </div>

          {/* STEP INDICATOR */}
          <div className="flex justify-between items-center relative pb-8">
            <div className="absolute top-5 left-0 right-0 h-1 bg-white/10 z-0 rounded-full" />
            <div className="absolute top-5 left-0 h-1 bg-teal-500 z-0 rounded-full transition-all duration-500" style={{ width: `${((step - 1) / 3) * 100}%` }} />
            
            {[
              { num: 1, label: 'School Details', icon: <Building2 className="w-5 h-5" /> },
              { num: 2, label: 'Contact', icon: <User className="w-5 h-5" /> },
              { num: 3, label: 'Infrastructure', icon: <Cpu className="w-5 h-5" /> },
              { num: 4, label: 'Confirm', icon: <CheckCircle2 className="w-5 h-5" /> }
            ].map(s => (
              <div key={s.num} className="relative z-10 flex flex-col items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold shadow-lg transition-all duration-300 ${
                  step > s.num ? 'bg-emerald-500 text-white shadow-emerald-500/20' : 
                  step === s.num ? 'bg-teal-500 text-[#000b1d] ring-4 ring-teal-500/30' : 
                  'bg-slate-800 text-slate-500 border border-white/10'
                }`}>
                  {step > s.num ? <CheckCircle2 className="w-5 h-5" /> : s.num}
                </div>
                <span className={`text-xs font-bold uppercase tracking-wider hidden sm:block ${
                  step === s.num ? 'text-teal-400' : step > s.num ? 'text-emerald-400' : 'text-slate-500'
                }`}>{s.label}</span>
              </div>
            ))}
          </div>

          <div className="glass-panel p-6 sm:p-10 rounded-[2rem] border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl relative overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {step === 1 && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2"><Building2 className="text-teal-400" /> School Details</h2>
                    
                    <div className="space-y-4">
                      <div>
                        <Label className="text-white/70">School Name *</Label>
                        <Input value={formData.schoolName} onChange={e => updateForm('schoolName', e.target.value)} className="bg-black/20 border-white/10 h-12 mt-1 focus:border-teal-500" placeholder="e.g. Government Higher Secondary School" />
                      </div>
                      
                      <div>
                        <Label className="text-white/70">School Type *</Label>
                        <RadioGroup value={formData.schoolType} onValueChange={v => updateForm('schoolType', v)} className="flex flex-wrap gap-4 mt-2">
                          {['Government', 'Government-Aided', 'Private', 'CBSE', 'ICSE'].map(type => (
                            <div key={type} className="flex items-center space-x-2 bg-black/20 px-4 py-3 rounded-xl border border-white/5 cursor-pointer hover:border-teal-500/50">
                              <RadioGroupItem value={type} id={`type-${type}`} />
                              <Label htmlFor={`type-${type}`} className="cursor-pointer">{type}</Label>
                            </div>
                          ))}
                        </RadioGroup>
                      </div>

                      <div>
                        <Label className="text-white/70">Full Address *</Label>
                        <Textarea value={formData.address} onChange={e => updateForm('address', e.target.value)} className="bg-black/20 border-white/10 mt-1 focus:border-teal-500 min-h-[100px]" placeholder="Street address..." />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <Label className="text-white/70">District *</Label>
                          <Select value={formData.district} onValueChange={v => updateForm('district', v)}>
                            <SelectTrigger className="bg-black/20 border-white/10 h-12 mt-1">
                              <SelectValue placeholder="Select District" />
                            </SelectTrigger>
                            <SelectContent className="max-h-64">
                              {TN_DISTRICTS.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label className="text-white/70">Pincode *</Label>
                          <Input value={formData.pincode} onChange={e => updateForm('pincode', e.target.value.replace(/\\D/g, '').slice(0, 6))} className="bg-black/20 border-white/10 h-12 mt-1" placeholder="6-digit pincode" />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <Label className="text-white/70">School UDISE Code (Optional)</Label>
                          <Input value={formData.udiseCode} onChange={e => updateForm('udiseCode', e.target.value)} className="bg-black/20 border-white/10 h-12 mt-1" />
                        </div>
                        <div>
                          <Label className="text-white/70">Approx. Number of Students *</Label>
                          <Input type="number" value={formData.studentCount} onChange={e => updateForm('studentCount', e.target.value)} className="bg-black/20 border-white/10 h-12 mt-1" placeholder="e.g. 500" />
                        </div>
                      </div>

                      <div>
                        <Label className="text-white/70">Classes Available</Label>
                        <div className="flex flex-wrap gap-3 mt-2">
                          {['LKG', 'UKG', '1-5', '6-8', '9-10', '11-12'].map(cls => (
                            <label key={cls} className={`flex items-center gap-2 px-4 py-2 rounded-xl border cursor-pointer transition-colors ${formData.classes.includes(cls) ? 'bg-teal-500/20 border-teal-500 text-teal-300' : 'bg-black/20 border-white/5 hover:border-white/20'}`}>
                              <Checkbox checked={formData.classes.includes(cls)} onCheckedChange={() => handleClassToggle(cls)} />
                              {cls}
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2"><User className="text-teal-400" /> Contact Person</h2>
                    
                    <div className="space-y-4">
                      <div>
                        <Label className="text-white/70">Contact Person Name *</Label>
                        <Input value={formData.contactName} onChange={e => updateForm('contactName', e.target.value)} className="bg-black/20 border-white/10 h-12 mt-1" />
                      </div>

                      <div>
                        <Label className="text-white/70">Designation *</Label>
                        <RadioGroup value={formData.designation} onValueChange={v => updateForm('designation', v)} className="flex flex-wrap gap-4 mt-2">
                          {['Principal', 'Vice Principal', 'Health Teacher', 'Other'].map(type => (
                            <div key={type} className="flex items-center space-x-2 bg-black/20 px-4 py-3 rounded-xl border border-white/5 cursor-pointer hover:border-teal-500/50">
                              <RadioGroupItem value={type} id={`desig-${type}`} />
                              <Label htmlFor={`desig-${type}`} className="cursor-pointer">{type}</Label>
                            </div>
                          ))}
                        </RadioGroup>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <Label className="text-white/70">Email Address *</Label>
                          <Input type="email" value={formData.email} onChange={e => updateForm('email', e.target.value)} className="bg-black/20 border-white/10 h-12 mt-1" />
                        </div>
                        <div>
                          <Label className="text-white/70">Mobile Number *</Label>
                          <div className="relative mt-1">
                            <span className="absolute left-3 top-3 text-white/50">+91</span>
                            <Input value={formData.mobile} onChange={e => updateForm('mobile', e.target.value.replace(/\\D/g, '').slice(0, 10))} className="bg-black/20 border-white/10 h-12 pl-12" placeholder="10-digit number" />
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <Label className="text-white/70">Preferred Language</Label>
                          <Select value={formData.preferredLanguage} onValueChange={v => updateForm('preferredLanguage', v)}>
                            <SelectTrigger className="bg-black/20 border-white/10 h-12 mt-1">
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
                          <Label className="text-white/70">Best Time to Contact</Label>
                          <Select value={formData.contactTime} onValueChange={v => updateForm('contactTime', v)}>
                            <SelectTrigger className="bg-black/20 border-white/10 h-12 mt-1">
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
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2"><Cpu className="text-teal-400" /> Infrastructure & Setup</h2>
                    
                    <div className="space-y-6">
                      <div>
                        <Label className="text-white/70 text-base">Do you have Android smartphones available for screening? *</Label>
                        <RadioGroup value={formData.androidAvailable} onValueChange={v => updateForm('androidAvailable', v)} className="flex gap-6 mt-3">
                          {['Yes', 'No', 'Unsure'].map(type => (
                            <div key={type} className="flex items-center space-x-2">
                              <RadioGroupItem value={type} id={`android-${type}`} />
                              <Label htmlFor={`android-${type}`}>{type}</Label>
                            </div>
                          ))}
                        </RadioGroup>
                      </div>

                      {formData.androidAvailable === 'Yes' && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                          <Label className="text-white/70">How many smartphones? (Approx)</Label>
                          <Input type="number" value={formData.phoneCount} onChange={e => updateForm('phoneCount', e.target.value)} className="bg-black/20 border-white/10 h-12 mt-1 max-w-xs" />
                        </motion.div>
                      )}

                      <div>
                        <Label className="text-white/70 text-base">Do you have standard wired headphones? *</Label>
                        <RadioGroup value={formData.headphonesAvailable} onValueChange={v => updateForm('headphonesAvailable', v)} className="flex flex-col gap-3 mt-3">
                          {['Yes, we have them', 'No, but we can arrange them', 'No, we need help procuring them'].map(type => (
                            <div key={type} className="flex items-center space-x-2">
                              <RadioGroupItem value={type} id={`hp-${type}`} />
                              <Label htmlFor={`hp-${type}`}>{type}</Label>
                            </div>
                          ))}
                        </RadioGroup>
                      </div>

                      <div>
                        <Label className="text-white/70 text-base">Internet connectivity at school</Label>
                        <Select value={formData.connectivity} onValueChange={v => updateForm('connectivity', v)}>
                          <SelectTrigger className="bg-black/20 border-white/10 h-12 mt-1 max-w-md">
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
                        <Label className="text-white/70 text-base">How did you hear about HearWise?</Label>
                        <Select value={formData.referralSource} onValueChange={v => updateForm('referralSource', v)}>
                          <SelectTrigger className="bg-black/20 border-white/10 h-12 mt-1 max-w-md">
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
                        <Label className="text-white/70">Any additional notes or questions? (Optional)</Label>
                        <Textarea value={formData.notes} onChange={e => updateForm('notes', e.target.value)} className="bg-black/20 border-white/10 mt-1 min-h-[100px]" />
                      </div>
                    </div>
                  </div>
                )}

                {step === 4 && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2"><CheckCircle2 className="text-teal-400" /> Review Details</h2>
                    <p className="text-white/60">Please review your school details before submitting.</p>
                    
                    <div className="bg-black/30 border border-white/10 rounded-2xl p-6 space-y-6 text-sm sm:text-base">
                      
                      <div className="flex justify-between items-start border-b border-white/10 pb-4">
                        <div className="space-y-1">
                          <p className="text-teal-400 font-bold uppercase text-xs tracking-wider">School Details</p>
                          <p className="font-bold text-white text-lg">{formData.schoolName || '—'}</p>
                          <p className="text-white/70">{formData.schoolType} • {formData.studentCount} Students</p>
                          <p className="text-white/50">{formData.address}, {formData.district}, {formData.state} - {formData.pincode}</p>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => setStep(1)} className="text-white/40 hover:text-white">Edit</Button>
                      </div>

                      <div className="flex justify-between items-start border-b border-white/10 pb-4">
                        <div className="space-y-1">
                          <p className="text-teal-400 font-bold uppercase text-xs tracking-wider">Contact Person</p>
                          <p className="font-bold text-white">{formData.contactName || '—'} <span className="text-white/50 font-normal">({formData.designation})</span></p>
                          <p className="text-white/70">{formData.email}</p>
                          <p className="text-white/70">+91 {formData.mobile}</p>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => setStep(2)} className="text-white/40 hover:text-white">Edit</Button>
                      </div>

                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <p className="text-teal-400 font-bold uppercase text-xs tracking-wider">Infrastructure</p>
                          <p className="text-white/70">Android: <span className="text-white">{formData.androidAvailable}</span></p>
                          <p className="text-white/70">Headphones: <span className="text-white">{formData.headphonesAvailable}</span></p>
                          <p className="text-white/70">Internet: <span className="text-white">{formData.connectivity}</span></p>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => setStep(3)} className="text-white/40 hover:text-white">Edit</Button>
                      </div>

                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Bottom Controls */}
            <div className="mt-10 pt-6 border-t border-white/10 flex justify-between">
              {step > 1 ? (
                <Button variant="ghost" onClick={handleBack} className="text-white/70 hover:text-white hover:bg-white/10 px-6 h-12 rounded-xl">
                  <ArrowLeft className="mr-2 w-4 h-4" /> Back
                </Button>
              ) : <div></div>}
              
              {step < 4 ? (
                <Button onClick={handleNext} className="bg-teal-600 hover:bg-teal-500 text-white font-bold px-8 h-12 rounded-xl">
                  Next Step <ChevronRight className="ml-2 w-4 h-4" />
                </Button>
              ) : (
                <Button 
                  onClick={handleSubmit} 
                  disabled={isSubmitting || !formData.schoolName || !formData.contactName || formData.mobile.length !== 10}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-8 h-12 rounded-xl shadow-lg shadow-emerald-500/20"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Registration'} <CheckCircle2 className="ml-2 w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
