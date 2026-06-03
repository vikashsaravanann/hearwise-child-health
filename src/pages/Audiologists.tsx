import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import PageWrapper from '@/components/shared/PageWrapper';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { audiologists } from '@/data/audiologists';
import { Search, MapPin, Phone, Award, Building, ExternalLink, AlertTriangle, UserPlus, CheckCircle2 } from 'lucide-react';
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

  // Handle selected state change to reset district
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
    <PageWrapper title="Find an Audiologist" backPath="/">
      <div className="bg-[#000b1d] min-h-screen text-slate-300 pb-24">
        
        {/* Hero Section */}
        <div className="relative pt-24 pb-16 px-4 border-b border-white/10 bg-gradient-to-b from-teal-900/20 to-[#000b1d]">
          <div className="max-w-5xl mx-auto text-center space-y-6">
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">Find a Verified Audiologist Near You</h1>
            <p className="text-lg text-teal-400 font-medium max-w-2xl mx-auto">
              HearWise partners with certified audiologists across India to ensure every referred child receives proper clinical care.
            </p>
            
            {/* Referral Warning Box */}
            <AnimatePresence>
              {isReferral && (
                <motion.div 
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-amber-900/40 border-2 border-amber-500/50 rounded-2xl p-6 text-left max-w-3xl mx-auto mt-8 flex gap-4 items-start shadow-xl shadow-amber-900/20"
                >
                  <AlertTriangle className="w-8 h-8 text-amber-400 shrink-0" />
                  <div>
                    <h3 className="text-xl font-bold text-amber-400 mb-2">Further Evaluation Recommended</h3>
                    <p className="text-amber-100/90 leading-relaxed text-sm">
                      Your child received a Refer result on their HearWise screening. This means further evaluation by a qualified audiologist is recommended. Please contact one of the audiologists listed below at the earliest. Early evaluation leads to significantly better outcomes.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-12 space-y-12">
          
          {/* Filters */}
          <div className="glass-panel p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1 w-full relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <Input 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search by name, clinic, or city..." 
                className="pl-10 h-12 bg-black/20 border-white/10 text-white"
              />
            </div>
            <div className="w-full md:w-48">
              <Select value={selectedState} onValueChange={setSelectedState}>
                <SelectTrigger className="h-12 bg-black/20 border-white/10 text-white">
                  <SelectValue placeholder="State" />
                </SelectTrigger>
                <SelectContent>
                  {ALL_STATES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="w-full md:w-48">
              <Select value={selectedDistrict} onValueChange={setSelectedDistrict}>
                <SelectTrigger className="h-12 bg-black/20 border-white/10 text-white">
                  <SelectValue placeholder="District" />
                </SelectTrigger>
                <SelectContent className="max-h-64">
                  {availableDistricts.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="w-full md:w-48">
              <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                <SelectTrigger className="h-12 bg-black/20 border-white/10 text-white">
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
            <div className="text-center py-20 bg-white/5 border border-white/10 rounded-3xl">
              <Search className="w-12 h-12 text-white/20 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">No audiologists found</h3>
              <p className="text-slate-400">Try adjusting your filters or search query.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredList.map((aud, i) => (
                <motion.div
                  key={aud.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col justify-between hover:border-teal-500/40 hover:bg-white/10 transition-all duration-300 group"
                >
                  <div className="space-y-4 mb-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center text-white font-bold text-xl shrink-0 shadow-lg">
                        {aud.name.replace('Dr. ', '').charAt(0)}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white leading-tight group-hover:text-teal-300 transition-colors">{aud.name}</h3>
                        <p className="text-xs text-teal-500 font-medium mt-1">{aud.qualification}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2.5 pt-2">
                      <div className="flex items-start gap-3">
                        <Building className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                        <span className="text-sm text-slate-300 font-medium">{aud.clinic}</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                        <span className="text-sm text-slate-400">{aud.address}</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <Award className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                        <span className="text-sm text-slate-400">{aud.specialisation}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-2">
                      {aud.languages.map(lang => (
                        <span key={lang} className="px-2.5 py-1 rounded-full bg-teal-900/30 border border-teal-500/20 text-teal-300 text-xs font-bold uppercase tracking-wider">
                          {lang}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mt-auto">
                    <Button variant="outline" className="w-full bg-white/5 border-white/10 hover:bg-white/10 text-white" onClick={() => window.open(`tel:${aud.phone.replace(/\s+/g, '')}`)}>
                      <Phone className="w-4 h-4 mr-2" /> Call
                    </Button>
                    <Button className="w-full bg-teal-600 hover:bg-teal-500 text-white" onClick={() => window.open(aud.mapLink, '_blank')}>
                      <ExternalLink className="w-4 h-4 mr-2" /> Map
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Add Your Clinic Section */}
          <div className="mt-24 pt-16 border-t border-white/10 max-w-3xl mx-auto">
            {!showPartnerForm ? (
              <div className="text-center space-y-6 bg-gradient-to-b from-blue-900/20 to-transparent p-10 rounded-3xl border border-blue-500/20">
                <div className="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 text-blue-400">
                  <UserPlus className="w-8 h-8" />
                </div>
                <h3 className="text-3xl font-black text-white">Are you an audiologist?</h3>
                <p className="text-slate-400 text-lg max-w-xl mx-auto">Partner with HearWise. Join our verified referral network and receive referrals from school screenings in your city.</p>
                <Button size="lg" className="bg-blue-600 hover:bg-blue-500 text-white rounded-xl px-8" onClick={() => setShowPartnerForm(true)}>
                  Partner with HearWise
                </Button>
              </div>
            ) : (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-panel p-8 sm:p-10 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl"
              >
                {!isSuccess ? (
                  <form onSubmit={handlePartnerSubmit} className="space-y-6">
                    <div className="text-center mb-8">
                      <h3 className="text-2xl font-bold text-white">Join the Network</h3>
                      <p className="text-slate-400">We will verify your details and add you within 3–5 working days.</p>
                    </div>
                    
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm text-slate-300">Full Name *</label>
                        <Input required value={partnerForm.name} onChange={e => setPartnerForm(p => ({...p, name: e.target.value}))} className="bg-black/20 border-white/10 h-12 text-white" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm text-slate-300">Clinic Name *</label>
                        <Input required value={partnerForm.clinic} onChange={e => setPartnerForm(p => ({...p, clinic: e.target.value}))} className="bg-black/20 border-white/10 h-12 text-white" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm text-slate-300">City / District *</label>
                        <Input required value={partnerForm.city} onChange={e => setPartnerForm(p => ({...p, city: e.target.value}))} className="bg-black/20 border-white/10 h-12 text-white" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm text-slate-300">Mobile Number *</label>
                        <Input required value={partnerForm.phone} onChange={e => setPartnerForm(p => ({...p, phone: e.target.value}))} className="bg-black/20 border-white/10 h-12 text-white" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm text-slate-300">Email Address</label>
                        <Input type="email" value={partnerForm.email} onChange={e => setPartnerForm(p => ({...p, email: e.target.value}))} className="bg-black/20 border-white/10 h-12 text-white" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm text-slate-300">Qualifications *</label>
                        <Input required value={partnerForm.qualification} onChange={e => setPartnerForm(p => ({...p, qualification: e.target.value}))} className="bg-black/20 border-white/10 h-12 text-white" placeholder="e.g. MASLP, PhD" />
                      </div>
                    </div>

                    <div className="flex justify-end gap-4 pt-4 mt-8 border-t border-white/10">
                      <Button type="button" variant="ghost" onClick={() => setShowPartnerForm(false)} className="text-white/50 hover:text-white">Cancel</Button>
                      <Button type="submit" disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-500 text-white px-8">
                        {isSubmitting ? 'Submitting...' : 'Submit Application'}
                      </Button>
                    </div>
                  </form>
                ) : (
                  <div className="text-center py-12 space-y-4">
                    <CheckCircle2 className="w-16 h-16 text-emerald-400 mx-auto" />
                    <h3 className="text-2xl font-bold text-white">Application Received!</h3>
                    <p className="text-slate-400">Thank you for partnering with HearWise. Our team will verify your details and be in touch soon.</p>
                  </div>
                )}
              </motion.div>
            )}
          </div>

        </div>
      </div>
    </PageWrapper>
  );
}
