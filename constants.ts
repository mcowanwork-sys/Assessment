
import { NQFLevel, SalaryRange, ExperienceRange } from './types';

export const POINT_VALUES = {
  OCCUPATION_LIST: 100,
  NQF_LEVEL: {
    [NQFLevel.LEVEL_9_10]: 50,
    [NQFLevel.LEVEL_7_8]: 30,
    [NQFLevel.OTHER]: 0,
  },
  SALARY: {
    [SalaryRange.ABOVE_976k]: 50,
    [SalaryRange.BETWEEN_650k_976k]: 20,
    [SalaryRange.BELOW_650k]: 0,
  },
  EXPERIENCE: {
    [ExperienceRange.TEN_PLUS]: 30,
    [ExperienceRange.FIVE_TEN]: 20,
    [ExperienceRange.LESS_FIVE]: 0,
  },
  TRUSTED_EMPLOYER: 30,
  LANGUAGE_PROFICIENCY: 10,
};

export const MINIMUM_POINTS_REQUIRED = 100;

// Enriched summary using exact data from the 3 Oct 2023 Government Gazette (No. 49402)
export const CRITICAL_SKILLS_LIST_SUMMARY = `
OFFICIAL LIST OF GAZETTED CRITICAL SKILLS (OFO 2021 CODES & MIN NQF):
- 2021-112101: Director (Enterprise / Organisation) (Min NQF 8)
- 2021-121301: Policy and Planning Manager (Min NQF 8)
- 2021-121901: Corporate General Manager (Min NQF 8)
- 2021-121905: Programme or Project Manager (Min NQF 8)
- 2021-121908: Quality Systems Manager (Min NQF 8)
- 2021-122105: Customer Service Manager (BPO) (Min NQF 8)
- 2021-122301: Research and Development Manager (Min NQF 8)
- 2021-132102: Manufacturing Operations Manager (Min NQF 8)
- 2021-132104: Engineering Manager (Min NQF 8)
- 2021-132401: Supply and Distribution Manager (Min NQF 8)
- 2021-133101: Chief Information Officer (Min NQF 8)
- 2021-133103: Data Management Manager (Min NQF 8)
- 2021-134901: Environmental Manager (Min NQF 8)
- 2021-143905: Call or Contact Centre Manager (Min NQF 8)
- 2021-211101: Physicist (Min NQF 9)
- 2021-211205: Climate Change Scientist (Min NQF 9)
- 2021-211301: Chemist (Min NQF 9)
- 2021-211401: Geologist (Min NQF 9)
- 2021-211402: Geophysicist (Min NQF 9)
- 2021-211403: Materials Scientist (Min NQF 9)
- 2021-211405: Mineralogist (Min NQF 9)
- 2021-211406: Hydrologist (Min NQF 9)
- 2021-211407: Oceanographer (Min NQF 9)
- 2021-212101: Actuary (Min NQF 8)
- 2021-213102: General Biologist (Min NQF 9)
- 2021-213105: Biotechnologist (Min NQF 8)
- 2021-213108: Microbiologist (Min NQF 9)
- 2021-213109: Zoologist (Min NQF 9)
- 2021-213202: Agricultural Scientist (Min NQF 9)
- 2021-213205: Food and Beverage Scientist (Min NQF 9)
- 2021-213301: Conservation Scientist (Min NQF 9)
- 2021-213302: Environmental Scientist (Min NQF 9)
- 2021-214101: Industrial Engineer (Min NQF 8)
- 2021-214102: Industrial Engineering Technologist (Min NQF 6)
- 2021-214201: Civil Engineer (Min NQF 8)
- 2021-214202: Civil Engineering Technologist (Min NQF 6)
- 2021-214401: Mechanical Engineer (Min NQF 8)
- 2021-214402: Mechanical Engineering Technologist (Min NQF 6)
- 2021-214403: Aeronautical Engineer (Min NQF 8)
- 2021-214404: Aeronautical Engineering Technologist (Min NQF 6)
- 2021-214405: Naval Architect (Min NQF 8)
- 2021-214501: Chemical Engineer (Min NQF 8)
- 2021-214502: Chemical Engineering Technologist (Min NQF 6)
- 2021-214601: Mining Engineer (Min NQF 8)
- 2021-214605: Metallurgist (Min NQF 8)
- 2021-214901: Biomedical Engineer (Min NQF 9)
- 2021-214904: Quantity Surveyor (Min NQF 8)
- 2021-214905: Agricultural Engineer (Min NQF 8)
- 2021-214906: Agricultural Engineering Technologist (Min NQF 6)
- 2021-215102: Electrical Engineering Technologist (Min NQF 6)
- 2021-215103: Energy Engineer (Min NQF 8)
- 2021-215104: Energy Engineering Technologist (Min NQF 6)
- 2021-215201: Electronics Engineer (Min NQF 8)
- 2021-216101: Architect (Min NQF 9)
- 2021-216401: Urban and Regional Planner (Min NQF 9)
- 2021-216603: Multimedia Designer (Min NQF 7)
- 2021-222114: Specialist Nurse Educator (Min NQF 7)
- 2021-231101: University Lecturer (Min NQF 9/10)
- 2021-233107: FET School Teacher (Grades 10-12) (Min NQF 7)
- 2021-233108: Senior Phase School Teacher (Grades 8-9) (Min NQF 7)
- 2021-241103: Tax Professional (Min NQF 8)
- 2021-241104: External Auditor (Min NQF 8)
- 2021-241108: Forensic Accountant (Min NQF 8)
- 2021-241201: Investment Analyst (Min NQF 8)
- 2021-241202: Investment Manager (Min NQF 8)
- 2021-241203: Investment Advisor (Min NQF 8)
- 2021-242103: Business Development Officer (Min NQF 8)
- 2021-242202: Policy Analyst (Min NQF 8)
- 2021-242204: Corporate Treasurer (Min NQF 8)
- 2021-242208: Organisational Risk Manager (Min NQF 8)
- 2021-242211: Internal Auditor (Min NQF 7)
- 2021-242402: Occupational Instructor (ATC) (Min NQF 6)
- 2021-243102: Market Research Analyst (Min NQF 9)
- 2021-251101: ICT Systems Analyst (Min NQF 7)
- 2021-251102: Data Scientist (Min NQF 7)
- 2021-251201: Software Developer (Min NQF 7)
- 2021-251202: Programmer Analyst (Min NQF 7)
- 2021-251203: Developer Programmer (Min NQF 7)
- 2021-251301: Multimedia Specialist (Min NQF 7)
- 2021-251401: Applications Programmer (Min NQF 7)
- 2021-251901: Computers QA Analyst (Min NQF 7)
- 2021-252301: Computer Network and Systems Engineer (Min NQF 7)
- 2021-252302: Network Analyst (Min NQF 7)
- 2021-252901: ICT Security Specialist (Min NQF 7)
- 2021-263101: Economist (Min NQF 9)
- 2021-311101: Chemistry Technician (Min NQF 6)
- 2021-311203: Town Planning Technician (Min NQF 6)
- 2021-311401: Electronic Engineering Technician (Min NQF 6)
- 2021-311501: Mechanical Engineering Technician (Min NQF 6)
- 2021-311801: Draughtsperson (Min NQF 6)
- 2021-315401: Air Traffic Controller (Min NQF 4)
- 2021-422201: Inbound Contact Centre Consultant (Min NQF 4)
- 2021-422202: Outbound Contact Centre Consultant (Min NQF 4)
- 2021-642701: A/C and Refrigeration Mechanic (Min NQF 3)
- 2021-652301: Metal Machinist (Min NQF 3)
- 2021-671202: Millwright (Min NQF 4)
- 2021-671203: Mechatronics Technician (Min NQF 3)
- 2021-671204: Lift Mechanic (Min NQF 3)
- 2021-671206: Electrical Equipment Mechanic (Min NQF 3)
- 2021-671208: Transportation Electrician (Min NQF 4)
- 2021-672105: Instrument Mechanician (Min NQF 3)
- 2021-226202: Industrial Pharmacist (Min NQF 7)
- 2021-225101: Veterinarian (Min NQF 8)
- 2021-324101: Veterinary Nurse (Min NQF 6)
`;
