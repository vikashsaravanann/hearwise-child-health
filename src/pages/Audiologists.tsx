import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { audiologists } from '@/data/audiologists';
import { Search, MapPin, Phone, Award, Building, ExternalLink, AlertTriangle, UserPlus, CheckCircle2, ShieldCheck, Stethoscope, Activity, Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';

const ALL_STATES = ['Tamil Nadu', 'Kerala', 'Karnataka'];

export default function Audiologists() {
  const [searchParams] = useSearchParams();
  const isReferral = searchParams.get('refer') === 'true';
  const { toast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedState, setSelectedState] = useState('Tamil Nadu');
  const [selectedDistrict, setSelectedDistrict] = useState('All');
  const [selectedLanguage, setSelectedLanguage] = useState('All');
  const [showPartnerForm, setShowPartnerForm] = useState(false);

  // Partner Form State
  const [partnerForm, setPartnerForm] = useState({
    name: '',
    clinic: '',
    city: '',
    phone: '',
    email: '',
    qualification: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Compute available districts based on selected state
  const availableDistricts = useMemo(() => {
    const districts = new Set<string>();
    audiologists.forEach(a => {
      if (a.state === selectedState) {
        districts.add(a.district);
      }
    });
    return ['All', ...Array.from(districts).sort()];
  }, [selectedState]);

  // Compute available languages
  const availableLanguages = useMemo(() => {
    const langs = new Set<string>();
    audiologists.forEach(a => {
      a.languages.forEach(l => langs.add(l));
    });
    return ['All', ...Array.from(langs).sort()];
  }, []);

  // Filter audiologists
  const filteredList = useMemo(() => {
    return audiologists.filter(a => {
      const matchState = a.state === selectedState;
      const matchDistrict = selectedDistrict === 'All' || a.district === selectedDistrict;
      const matchLanguage = selectedLanguage === 'All' || a.languages.includes(selectedLanguage);
      const matchSearch = searchQuery === '' || 
        a.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        a.clinic.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.district.toLowerCase().includes(searchQuery.toLowerCase());
      
      return matchState && matchDistrict && matchLanguage && matchSearch;
    });
  }, [selectedState, selectedDistrict, selectedLanguage, searchQuery]);

  useEffect(() => {
    setSelectedDistrict('All');
  }, [selectedState]);

  const handlePartnerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!partnerForm.name || !partnerForm.phone || !partnerForm.clinic) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('audiologist_applications').insert({
        name: partnerForm.name,
        clinic: partnerForm.clinic,
        city: partnerForm.city,
        phone: partnerForm.phone,
        email: partnerForm.email,
        qualification: partnerForm.qualification
      });

      if (error) throw error;
      setIsSuccess(true);
      setTimeout(() => {
        setShowPartnerForm(false);
        setIsSuccess(false);
        setPartnerForm({ name: '', clinic: '', city: '', phone: '', email: '', qualification: '' });
      }, 5000);
    } catch (err: any) {
      console.error(err);
      toast({ title: 'Error', description: err.message || 'Failed to submit application', variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="bg-[#020817] min-h-screen text-slate-300 pb-24 relative overflow-hidden">
        
        {/* Animated background orbs */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-teal-500/10 rounded-full blur-[120px] animate-pulse pointer-events-none" />
        <div className="absolute bottom-1/4 left-0 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[120px] animate-pulse pointer-events-none" style={{ animationDelay: '3s' }} />

        {/* Grid overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.03] z-0"
          style={{
            backgroundImage: `linear-gradient(rgba(20,184,166,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(20,184,166,0.5) 1px, transparent 1px)`,
            backgroundSize: '60px 60px'
          }}
        />

        {/* Hero Section */}
        <div className="relative z-10 pt-24 pb-16 px-4">
          <div className="max-w-5xl mx-auto text-center space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-teal-500/30 bg-teal-500/10 text-teal-400 text-xs font-semibold uppercase tracking-widest mb-6">
                <ShieldCheck className="w-4 h-4" />
                VERIFIED PARTNERS
              </div>
              <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-tight">
                FIND A VERIFIED <br/>
                <span className="bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">
                  CLINIC NEAR YOU
                </span>
              </h1>
              <p className="text-xl text-slate-400 max-w-2xl mx-auto mt-6">
                HearWise partners with certified audiologists across India to ensure every referred child receives proper clinical care.
              </p>
            </motion.div>
            
            {/* Referral Warning Box */}
            <AnimatePresence>
              {isReferral && (
                <motion.div 
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-amber-900/20 border border-amber-500/50 rounded-2xl p-6 text-left max-w-3xl mx-auto mt-8 flex gap-4 items-start shadow-xl shadow-amber-900/10 backdrop-blur-md"
                >
                  <AlertTriangle className="w-8 h-8 text-amber-400 shrink-0" />
                  <div>
                    <h3 className="text-xl font-bold text-amber-400 mb-2">Further Evaluation Recommended</h3>
                    <p className="text-amber-100/80 leading-relaxed text-sm">
                      Your child received a Refer result on their HearWise screening. This means further evaluation by a qualified audiologist is recommended. Please contact one of the audiologists listed below at the earliest. Early evaluation leads to significantly better outcomes.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Live Stats Banner */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 mb-16">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-xl divide-x divide-white/10"
          >
            {[
              { label: 'Verified Clinics', value: '124+', icon: <Building className="text-teal-400 w-5 h-5" /> },
              { label: 'Cities Covered', value: '38', icon: <MapPin className="text-cyan-400 w-5 h-5" /> },
              { label: 'Kids Evaluated', value: '12k+', icon: <Star className="text-emerald-400 w-5 h-5" /> },
              { label: 'Quality Score', value: '4.9/5', icon: <Award className="text-blue-400 w-5 h-5" /> },
            ].map((stat, i) => (
              <div key={i} className="flex flex-col items-center justify-center text-center px-2">
                <div className="mb-2">{stat.icon}</div>
                <div className="text-2xl font-black text-white">{stat.value}</div>
                <div className="text-xs text-slate-400 uppercase tracking-widest font-bold mt-1">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
          
          {/* Filters */}
          <div className="glass-panel p-6 rounded-3xl bg-black/40 border border-white/10 backdrop-blur-xl flex flex-col md:flex-row gap-4 items-end shadow-2xl">
            <div className="flex-1 w-full relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <Input 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search by name, clinic, or city..." 
                className="pl-12 h-14 bg-white/5 border-white/10 text-white rounded-xl text-lg focus:border-teal-500 transition-colors"
              />
            </div>
            <div className="w-full md:w-48">
              <Select value={selectedState} onValueChange={setSelectedState}>
                <SelectTrigger className="h-14 bg-white/5 border-white/10 text-white rounded-xl">
                  <SelectValue placeholder="State" />
                </SelectTrigger>
                <SelectContent>
                  {ALL_STATES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="w-full md:w-48">
              <Select value={selectedDistrict} onValueChange={setSelectedDistrict}>
                <SelectTrigger className="h-14 bg-white/5 border-white/10 text-white rounded-xl">
                  <SelectValue placeholder="District" />
                </SelectTrigger>
                <SelectContent className="max-h-64">
                  {availableDistricts.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="w-full md:w-48">
              <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                <SelectTrigger className="h-14 bg-white/5 border-white/10 text-white rounded-xl">
                  <SelectValue placeholder="Language" />
                </SelectTrigger>
                <SelectContent>
                  {availableLanguages.map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Results Grid */}
          {filteredList.length === 0 ? (
            <div className="text-center py-24 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-md">
              <Search className="w-16 h-16 text-white/20 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-white mb-2">No clinics found</h3>
              <p className="text-slate-400 text-lg">Try adjusting your filters or search query.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredList.map((aud, i) => (
                <motion.div
                  key={aud.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-white/5 border border-white/10 rounded-3xl p-6 flex flex-col justify-between hover:border-teal-500/50 hover:bg-white/10 hover:shadow-2xl hover:shadow-teal-500/10 transition-all duration-300 group backdrop-blur-md relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/10 rounded-full blur-[50px] opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="space-y-4 mb-8 relative z-10">
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center text-white font-black text-2xl shrink-0 shadow-lg border border-white/20">
                        {aud.name.replace('Dr. ', '').charAt(0)}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white leading-tight group-hover:text-teal-300 transition-colors">{aud.name}</h3>
                        <div className="flex items-center gap-1 mt-1.5 text-xs text-teal-400 font-bold bg-teal-900/30 border border-teal-500/20 px-2 py-0.5 rounded-full inline-flex">
                          <Award className="w-3 h-3" />
                          {aud.qualification}
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-3 pt-4 border-t border-white/10">
                      <div className="flex items-start gap-3">
                        <Building className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                        <span className="text-sm text-slate-200 font-semibold">{aud.clinic}</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                        <span className="text-sm text-slate-400 leading-relaxed">{aud.address}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-4">
                      {aud.languages.map(lang => (
                        <span key={lang} className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-slate-300 text-[10px] font-bold uppercase tracking-wider">
                          {lang}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mt-auto relative z-10">
                    <Button variant="outline" className="w-full bg-black/40 border-white/10 hover:bg-white/10 text-white rounded-xl h-11" onClick={() => window.open(`tel:${aud.phone.replace(/\s+/g, '')}`)}>
                      <Phone className="w-4 h-4 mr-2 text-teal-400" /> Call
                    </Button>
                    <Button className="w-full bg-teal-600 hover:bg-teal-500 text-white rounded-xl h-11 shadow-lg shadow-teal-500/20" onClick={() => window.open(aud.mapLink, '_blank')}>
                      <ExternalLink className="w-4 h-4 mr-2" /> Map
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* New Informational Widgets */}
          <div className="grid md:grid-cols-2 gap-8 pt-16 mt-16 border-t border-white/10">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h2 className="text-3xl font-black text-white">Why Choose a HearWise Partner?</h2>
              <div className="space-y-4">
                {[
                  { title: 'Verified Credentials', desc: 'Every clinic is thoroughly vetted for RCI certification and valid audiology degrees.' },
                  { title: 'Pediatric Equipment', desc: 'Equipped with OAE, Tympanometry, and pediatric-friendly testing environments.' },
                  { title: 'Standardized Reporting', desc: 'Clinics upload results back to the HearWise platform to track the child\'s journey.' }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 items-start p-4 bg-white/5 border border-white/10 rounded-2xl">
                    <div className="p-2 bg-teal-500/20 text-teal-400 rounded-lg shrink-0">
                      <ShieldCheck className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-white font-bold text-lg">{item.title}</h4>
                      <p className="text-slate-400 text-sm mt-1">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-blue-900/30 to-indigo-900/30 border border-blue-500/30 p-8 rounded-3xl relative overflow-hidden"
            >
              <div className="absolute -top-10 -right-10 opacity-10">
                <Stethoscope className="w-64 h-64 text-blue-400" />
              </div>
              <div className="relative z-10">
                <h2 className="text-2xl font-black text-white mb-6">What to expect at the clinic</h2>
                <div className="space-y-6">
                  <div className="relative pl-8 border-l-2 border-blue-500/30">
                    <div className="absolute left-[-9px] top-1 w-4 h-4 bg-blue-500 rounded-full ring-4 ring-blue-900/50" />
                    <h4 className="text-white font-bold text-lg">1. Otoscopy</h4>
                    <p className="text-blue-100/70 text-sm mt-1">The audiologist looks inside the ear for wax blockage or visible infections.</p>
                  </div>
                  <div className="relative pl-8 border-l-2 border-blue-500/30">
                    <div className="absolute left-[-9px] top-1 w-4 h-4 bg-blue-500 rounded-full ring-4 ring-blue-900/50" />
                    <h4 className="text-white font-bold text-lg">2. Tympanometry</h4>
                    <p className="text-blue-100/70 text-sm mt-1">A quick, painless test to check if there is fluid trapped behind the eardrum.</p>
                  </div>
                  <div className="relative pl-8 border-l-2 border-transparent">
                    <div className="absolute left-[-9px] top-1 w-4 h-4 bg-blue-500 rounded-full ring-4 ring-blue-900/50" />
                    <h4 className="text-white font-bold text-lg">3. PTA / OAE</h4>
                    <p className="text-blue-100/70 text-sm mt-1">Detailed hearing tests to measure exact hearing thresholds and inner ear function.</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Add Your Clinic Section */}
          <div className="mt-24 pt-16 border-t border-white/10 max-w-4xl mx-auto">
            {!showPartnerForm ? (
              <motion.div 
                whileHover={{ scale: 1.01 }}
                className="text-center space-y-6 bg-gradient-to-b from-teal-900/40 to-transparent p-12 rounded-[3rem] border border-teal-500/30 shadow-2xl shadow-teal-900/20"
              >
                <div className="w-20 h-20 bg-teal-500/20 rounded-3xl flex items-center justify-center mx-auto mb-6 text-teal-400 border border-teal-500/30">
                  <UserPlus className="w-10 h-10" />
                </div>
                <h3 className="text-4xl font-black text-white">Are you an audiologist?</h3>
                <p className="text-teal-100/70 text-lg max-w-xl mx-auto">
                  Partner with HearWise. Join our verified referral network and receive pediatric referrals directly from school screenings in your city.
                </p>
                <Button size="lg" className="bg-teal-600 hover:bg-teal-500 text-white rounded-xl px-10 h-14 text-lg font-bold mt-4 shadow-lg shadow-teal-500/20" onClick={() => setShowPartnerForm(true)}>
                  Partner with HearWise
                </Button>
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-panel p-8 sm:p-12 rounded-[3rem] bg-black/40 border border-teal-500/30 backdrop-blur-xl shadow-2xl"
              >
                {!isSuccess ? (
                  <form onSubmit={handlePartnerSubmit} className="space-y-8">
                    <div className="text-center mb-10">
                      <h3 className="text-3xl font-black text-white mb-2">Join the Network</h3>
                      <p className="text-slate-400 text-lg">We will verify your RCI credentials and add you within 3–5 working days.</p>
                    </div>
                    
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-300">Full Name *</label>
                        <Input required value={partnerForm.name} onChange={e => setPartnerForm(p => ({...p, name: e.target.value}))} className="bg-white/5 border-white/10 h-14 rounded-xl text-white focus:border-teal-500" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-300">Clinic Name *</label>
                        <Input required value={partnerForm.clinic} onChange={e => setPartnerForm(p => ({...p, clinic: e.target.value}))} className="bg-white/5 border-white/10 h-14 rounded-xl text-white focus:border-teal-500" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-300">City / District *</label>
                        <Input required value={partnerForm.city} onChange={e => setPartnerForm(p => ({...p, city: e.target.value}))} className="bg-white/5 border-white/10 h-14 rounded-xl text-white focus:border-teal-500" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-300">Mobile Number *</label>
                        <Input required value={partnerForm.phone} onChange={e => setPartnerForm(p => ({...p, phone: e.target.value}))} className="bg-white/5 border-white/10 h-14 rounded-xl text-white focus:border-teal-500" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-300">Email Address</label>
                        <Input type="email" value={partnerForm.email} onChange={e => setPartnerForm(p => ({...p, email: e.target.value}))} className="bg-white/5 border-white/10 h-14 rounded-xl text-white focus:border-teal-500" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-300">Qualifications *</label>
                        <Input required value={partnerForm.qualification} onChange={e => setPartnerForm(p => ({...p, qualification: e.target.value}))} className="bg-white/5 border-white/10 h-14 rounded-xl text-white focus:border-teal-500" placeholder="e.g. MASLP, PhD" />
                      </div>
                    </div>

                    <div className="flex justify-end gap-4 pt-6 mt-6 border-t border-white/10">
                      <Button type="button" variant="ghost" onClick={() => setShowPartnerForm(false)} className="text-white/50 hover:text-white hover:bg-white/5 h-12 rounded-xl px-6">Cancel</Button>
                      <Button type="submit" disabled={isSubmitting} className="bg-teal-600 hover:bg-teal-500 text-white px-8 h-12 rounded-xl font-bold shadow-lg shadow-teal-500/20">
                        {isSubmitting ? 'Submitting...' : 'Submit Application'}
                      </Button>
                    </div>
                  </form>
                ) : (
                  <div className="text-center py-16 space-y-6">
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-24 h-24 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto border border-emerald-500/30">
                      <CheckCircle2 className="w-12 h-12 text-emerald-400" />
                    </motion.div>
                    <h3 className="text-3xl font-black text-white">Application Received!</h3>
                    <p className="text-emerald-100/70 text-lg max-w-md mx-auto">Thank you for partnering with HearWise. Our clinical team will verify your RCI credentials and be in touch soon.</p>
                  </div>
                )}
              </motion.div>
            )}
          </div>

        </div>
      </div>
    </>
  );
}
