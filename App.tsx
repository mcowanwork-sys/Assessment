
import React, { useState, useMemo, useCallback, useRef } from 'react';
import { 
  CheckCircle, 
  AlertCircle, 
  Info, 
  Calculator, 
  ShieldCheck, 
  FileText, 
  Globe,
  Briefcase,
  ChevronRight,
  RefreshCw,
  Search,
  HelpCircle,
  GraduationCap,
  Download,
  User,
  Hash,
  Coins,
  Upload,
  X,
  FileCode
} from 'lucide-react';
import { 
  NQFLevel, 
  SalaryRange, 
  ExperienceRange, 
  AssessmentData, 
  MatchResult 
} from './types';
import { 
  POINT_VALUES, 
  MINIMUM_POINTS_REQUIRED 
} from './constants';
import { matchOccupationWithAI } from './geminiService';
import { generateAssessmentPDF } from './pdfService';
import { generateAssessmentWord } from './wordService';

const App: React.FC = () => {
  const [data, setData] = useState<AssessmentData>({
    fullName: '',
    jobTitle: '',
    isOccupationOnList: false,
    nqfLevel: NQFLevel.LEVEL_7,
    salaryRange: SalaryRange.BELOW_650k,
    yearsExperience: ExperienceRange.LESS_FIVE,
    isTrustedEmployer: false,
    isLanguageProficient: false,
    hasSaqaSubmission: false,
    hasMandatoryOffer: false
  });

  const [isVerifying, setIsVerifying] = useState(false);
  const [matchResult, setMatchResult] = useState<MatchResult | null>(null);
  const [customLogo, setCustomLogo] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const pointsWithoutCSL = useMemo(() => {
    let score = 0;
    score += POINT_VALUES.NQF_LEVEL[data.nqfLevel];
    score += POINT_VALUES.SALARY[data.salaryRange];
    score += POINT_VALUES.EXPERIENCE[data.yearsExperience];
    if (data.isTrustedEmployer) score += POINT_VALUES.TRUSTED_EMPLOYER;
    if (data.isLanguageProficient) score += POINT_VALUES.LANGUAGE_PROFICIENCY;
    return score;
  }, [data]);

  const totalPoints = useMemo(() => {
    return pointsWithoutCSL + (data.isOccupationOnList ? 100 : 0);
  }, [pointsWithoutCSL, data.isOccupationOnList]);

  const qualifiedForCSWV = useMemo(() => {
    return data.isOccupationOnList && data.hasMandatoryOffer;
  }, [data.isOccupationOnList, data.hasMandatoryOffer]);

  const qualifiedForGWV = useMemo(() => {
    return pointsWithoutCSL >= MINIMUM_POINTS_REQUIRED && data.hasMandatoryOffer;
  }, [pointsWithoutCSL, data.hasMandatoryOffer]);

  const meetsRequirements = qualifiedForCSWV || qualifiedForGWV;

  const handleVerify = useCallback(async () => {
    if (!data.jobTitle) return;
    setIsVerifying(true);
    try {
      const result = await matchOccupationWithAI(data.jobTitle, data.nqfLevel);
      setMatchResult(result);
      setData(prev => ({ 
        ...prev, 
        isOccupationOnList: result.matchType === 'FULL' && result.isNQFValid 
      }));
    } catch (error) {
      console.error("Verification failed:", error);
      setMatchResult({
        matchType: 'NONE',
        officialOccupation: '',
        confidence: 0,
        reason: 'An unexpected error occurred during verification. Please try again.',
        isNQFValid: false
      });
    } finally {
      setIsVerifying(false);
    }
  }, [data.jobTitle, data.nqfLevel]);

  const updateData = (updates: Partial<AssessmentData>) => {
    setData(prev => ({ ...prev, ...updates }));
  };

  const handleDownloadPDF = () => {
    generateAssessmentPDF(data, matchResult, totalPoints, customLogo || undefined);
  };

  const handleDownloadWord = () => {
    generateAssessmentWord(data, matchResult, totalPoints, customLogo || undefined);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCustomLogo(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeLogo = () => {
    setCustomLogo(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="min-h-screen pb-12 bg-slate-50">
      <nav className="bg-white border-b border-slate-200 py-4 px-6 sticky top-0 z-50 shadow-sm">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            {customLogo ? (
              <div className="relative group">
                <img src={customLogo} alt="Custom Logo" className="h-10 md:h-12 w-auto object-contain rounded" />
                <button 
                  onClick={removeLogo}
                  className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <img 
                src="https://www.xpatweb.com/wp-content/uploads/2019/02/xpatweb-logo.png" 
                alt="Xpatweb Logo" 
                className="h-10 md:h-12 w-auto object-contain"
              />
            )}
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors uppercase tracking-widest bg-slate-100 px-3 py-2 rounded-lg border border-slate-200"
            >
              <Upload className="w-4 h-4" /> {customLogo ? 'Change Company Logo' : 'Upload Company Logo'}
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*" 
              onChange={handleLogoUpload} 
            />
          </div>
        </div>
      </nav>

      <header className="bg-slate-900 text-white py-12 px-4 shadow-lg mb-8 border-b-4 border-yellow-500">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2 tracking-tight">Work Visa Assessment Tool</h1>
            <p className="text-slate-300 text-lg flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-yellow-500" />
              Automated Eligibility Reporting & Costing
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 text-center min-w-[200px] shadow-inner">
            <span className="text-sm uppercase tracking-wider text-slate-400 block mb-1">Supplementary Points</span>
            <div className={`text-5xl font-black transition-colors duration-500 ${pointsWithoutCSL >= 100 ? 'text-green-400' : 'text-yellow-400'}`}>
              {pointsWithoutCSL}
            </div>
            <div className="text-xs mt-2 text-slate-300">Min. 100 required for GWV</div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="bg-slate-50 border-b border-slate-200 p-6 flex items-center gap-3">
              <div className="bg-slate-700 p-2 rounded-lg text-white">
                <User className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-semibold">Applicant Details</h2>
            </div>
            <div className="p-6">
              <div className="relative">
                <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Full Name</label>
                <div className="relative">
                  <input 
                    type="text"
                    placeholder="Enter applicant's full name"
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    value={data.fullName}
                    onChange={(e) => updateData({ fullName: e.target.value })}
                  />
                  <User className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />
                </div>
              </div>
            </div>
          </section>

          <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="bg-slate-50 border-b border-slate-200 p-6 flex items-center gap-3">
              <div className="bg-blue-600 p-2 rounded-lg text-white">
                <Briefcase className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-semibold">1. Critical Skills Matching</h2>
            </div>
            <div className="p-6">
              <p className="text-sm text-slate-500 mb-4">
                Verify if the profession exists on the gazetted Critical Skills List to determine CSWV eligibility.
              </p>
              <div className="flex flex-col md:flex-row gap-3">
                <div className="relative flex-1">
                  <input 
                    type="text"
                    placeholder="Job Title (e.g. Aeronautical Engineer)"
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    value={data.jobTitle}
                    onChange={(e) => updateData({ jobTitle: e.target.value })}
                  />
                  <Search className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />
                </div>
                <button 
                  onClick={handleVerify}
                  disabled={isVerifying || !data.jobTitle}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all disabled:bg-slate-300 flex items-center justify-center gap-2"
                >
                  {isVerifying ? <RefreshCw className="w-5 h-5 animate-spin" /> : <ChevronRight className="w-5 h-5" />}
                  Verify Skill
                </button>
              </div>

              {matchResult && (
                <div className={`mt-4 p-4 rounded-xl border ${matchResult.matchType === 'FULL' && matchResult.isNQFValid ? 'bg-green-50 border-green-100' : 'bg-slate-50 border-slate-200'}`}>
                  <div className="flex items-start gap-3">
                    {matchResult.matchType === 'FULL' && matchResult.isNQFValid ? <CheckCircle className="w-5 h-5 text-green-600 mt-1" /> : <HelpCircle className="w-5 h-5 text-slate-400 mt-1" />}
                    <div>
                      <p className="font-bold text-slate-800">{matchResult.matchType === 'FULL' && matchResult.isNQFValid ? 'Match Confirmed' : 'Verification Feedback'}</p>
                      <p className="text-sm text-slate-600">{matchResult.reason}</p>
                      {matchResult.ofoCode && <div className="mt-2 text-[10px] font-mono bg-white px-2 py-0.5 rounded border inline-block">OFO: {matchResult.ofoCode}</div>}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>

          <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="bg-slate-50 border-b border-slate-200 p-6 flex items-center gap-3">
              <div className="bg-purple-600 p-2 rounded-lg text-white">
                <Calculator className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-semibold">2. Supplementary Points Factors</h2>
            </div>
            <div className="p-6 space-y-6">
              <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-100">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={data.hasMandatoryOffer} 
                    onChange={e => updateData({ hasMandatoryOffer: e.target.checked })}
                    className="w-5 h-5 accent-blue-600"
                  />
                  <span className="text-sm font-bold text-slate-700 uppercase">Verification of Mandatory Job Offer</span>
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-2 uppercase">Highest Qualification (NQF)</label>
                  <select 
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                    value={data.nqfLevel}
                    onChange={e => updateData({ nqfLevel: e.target.value as NQFLevel })}
                  >
                    <option value={NQFLevel.OTHER}>Other / Below NQF 6 (0 pts)</option>
                    <option value={NQFLevel.LEVEL_6}>NQF Level 6 (0 pts)</option>
                    <option value={NQFLevel.LEVEL_7}>NQF Level 7 (30 pts)</option>
                    <option value={NQFLevel.LEVEL_8}>NQF Level 8 (30 pts)</option>
                    <option value={NQFLevel.LEVEL_9}>NQF Level 9 (50 pts)</option>
                    <option value={NQFLevel.LEVEL_10}>NQF Level 10 (50 pts)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-2 uppercase">Annual ZAR Salary</label>
                  <select 
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                    value={data.salaryRange}
                    onChange={e => updateData({ salaryRange: e.target.value as SalaryRange })}
                  >
                    <option value={SalaryRange.BELOW_650k}>Below R650,976 (0 pts)</option>
                    <option value={SalaryRange.BETWEEN_650k_976k}>R650k - R976k (20 pts)</option>
                    <option value={SalaryRange.ABOVE_976k}>Above R976k (50 pts)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-2 uppercase">Years of Professional Experience</label>
                  <select 
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                    value={data.yearsExperience}
                    onChange={e => updateData({ yearsExperience: e.target.value as ExperienceRange })}
                  >
                    <option value={ExperienceRange.LESS_FIVE}>0 - 5 Years (0 pts)</option>
                    <option value={ExperienceRange.FIVE_TEN}>5 - 10 Years (20 pts)</option>
                    <option value={ExperienceRange.TEN_PLUS}>10+ Years (30 pts)</option>
                  </select>
                </div>
                <div className="flex items-end">
                   <label className="flex items-center gap-3 p-3 bg-slate-50 w-full rounded-xl border border-slate-200 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={data.isLanguageProficient} 
                      onChange={e => updateData({ isLanguageProficient: e.target.checked })}
                      className="w-5 h-5 accent-blue-600"
                    />
                    <span className="text-sm font-bold text-slate-700">English Language Proficient (10 pts)</span>
                  </label>
                </div>
              </div>

              <label className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl border border-blue-100 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={data.isTrustedEmployer} 
                  onChange={e => updateData({ isTrustedEmployer: e.target.checked })}
                  className="w-5 h-5 accent-blue-600"
                />
                <div>
                  <span className="text-sm font-bold text-blue-900">Offer from Registered Trusted Employer (+30 pts)</span>
                  <p className="text-xs text-blue-700">Points applied for DHA accredited employers</p>
                </div>
              </label>
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <section className={`rounded-3xl p-8 border-t-8 transition-all duration-500 shadow-xl ${meetsRequirements ? 'bg-slate-900 text-white border-yellow-500' : 'bg-white border-slate-200'}`}>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              {meetsRequirements ? <CheckCircle className="w-6 h-6 text-green-400" /> : <AlertCircle className="w-6 h-6 text-slate-400" />}
              Assessment Result
            </h2>

            {meetsRequirements ? (
              <div className="space-y-4">
                <p className="text-3xl font-black text-green-400 tracking-tighter">POTENTIALLY QUALIFIED</p>
                <div className="space-y-2 text-sm opacity-90">
                  {qualifiedForCSWV && <p className="flex items-center gap-2"><CheckCircle className="w-4 h-4" /> Eligible: Critical Skills Visa</p>}
                  {qualifiedForGWV && <p className="flex items-center gap-2"><CheckCircle className="w-4 h-4" /> Eligible: General Work Visa</p>}
                </div>
                <div className="pt-4 space-y-3">
                  <button 
                    onClick={handleDownloadPDF}
                    className="w-full py-4 bg-yellow-500 text-slate-900 font-black rounded-xl hover:bg-yellow-400 transition-all shadow-lg flex items-center justify-center gap-2"
                  >
                    <Download className="w-5 h-5" /> EXPORT PDF
                  </button>
                  <button 
                    onClick={handleDownloadWord}
                    className="w-full py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl border border-white/20 transition-all flex items-center justify-center gap-2"
                  >
                    <FileCode className="w-5 h-5" /> EXPORT WORD
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-3xl font-black text-slate-400 tracking-tighter">UNQUALIFIED</p>
                <div className="space-y-2 text-sm text-slate-500">
                  {!data.hasMandatoryOffer && <p className="text-red-500 font-bold">• Verifiable Offer is Required</p>}
                  {pointsWithoutCSL < 100 && <p>• Gap of {100 - pointsWithoutCSL} pts for General Visa</p>}
                  {!data.isOccupationOnList && <p>• Professional skill matching required</p>}
                </div>
                <div className="pt-4 space-y-3">
                  <button 
                    onClick={handleDownloadPDF}
                    disabled={!data.jobTitle}
                    className="w-full py-3 bg-slate-100 text-slate-400 font-bold rounded-xl border border-slate-200 disabled:opacity-50 cursor-not-allowed"
                  >
                    DOWNLOAD SUMMARY
                  </button>
                  <button 
                    onClick={handleDownloadWord}
                    disabled={!data.jobTitle}
                    className="w-full py-3 bg-slate-50 text-slate-300 font-bold rounded-xl border border-slate-100 disabled:opacity-50 cursor-not-allowed"
                  >
                    DOWNLOAD WORD
                  </button>
                </div>
              </div>
            )}
          </section>

          <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Facilitation Costs</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-600">General Work Visa</span>
                <span className="font-bold">R28,860.00</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-600">Disbursements (VFS)</span>
                <span className="font-bold">R2,685.00</span>
              </div>
              <p className="text-[10px] text-slate-400 mt-2 leading-tight italic">
                Fees reflect base facilitation (excl. VAT). Specific professional body fees apply separately.
              </p>
            </div>
          </section>

          <div className="p-4 bg-slate-100 rounded-2xl border border-slate-200 text-center">
             <div className="flex justify-center mb-2">
               {customLogo ? (
                 <img src={customLogo} alt="Logo" className="h-6 opacity-60 grayscale" />
               ) : (
                 <img 
                  src="https://www.xpatweb.com/wp-content/uploads/2019/02/xpatweb-logo.png" 
                  alt="Xpatweb Logo" 
                  className="h-6 opacity-50 grayscale"
                />
               )}
             </div>
            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Specialists in Global Mobility</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
