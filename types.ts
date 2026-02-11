
export enum NQFLevel {
  LEVEL_10 = '10', // Doctorate
  LEVEL_9 = '9',   // Master's
  LEVEL_8 = '8',   // Honours / PG Diploma
  LEVEL_7 = '7',   // Bachelor's / Adv Diploma
  LEVEL_6 = '6',   // Diploma
  OTHER = 'other'
}

export enum SalaryRange {
  ABOVE_976k = 'above_976',
  BETWEEN_650k_976k = '650_976',
  BELOW_650k = 'below_650'
}

export enum ExperienceRange {
  TEN_PLUS = '10+',
  FIVE_TEN = '5-10',
  LESS_FIVE = '0-5'
}

export interface AssessmentData {
  fullName: string;
  jobTitle: string;
  isOccupationOnList: boolean;
  nqfLevel: NQFLevel;
  salaryRange: SalaryRange;
  yearsExperience: ExperienceRange;
  isTrustedEmployer: boolean;
  isLanguageProficient: boolean;
  hasSaqaSubmission: boolean;
  hasMandatoryOffer: boolean;
}

export type MatchType = 'FULL' | 'PARTIAL' | 'NONE';

export interface MatchResult {
  matchType: MatchType;
  officialOccupation: string;
  confidence: number;
  reason: string;
  isNQFValid: boolean;
  minNQFRequired?: string;
  ofoCode?: string;
}
