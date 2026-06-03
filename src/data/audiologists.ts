export interface Audiologist {
  id: string;
  name: string;
  qualification: string;
  clinic: string;
  address: string;
  district: string;
  state: string;
  phone: string;
  languages: string[];
  specialisation: string;
  mapLink: string;
}

export const audiologists: Audiologist[] = [
  {
    id: "a1",
    name: "Dr. S. Meenakshi Sundaram",
    qualification: "M.Sc. Audiology & Speech-Language Pathology, AIISH",
    clinic: "Coimbatore Hearing Care Centre",
    address: "42, Avinashi Road, Peelamedu, Coimbatore – 641 004",
    district: "Coimbatore",
    state: "Tamil Nadu",
    phone: "+91 98421 XXXXX",
    languages: ["Tamil", "English"],
    specialisation: "Paediatric Audiology, Hearing Aids",
    mapLink: "https://maps.google.com/?q=Avinashi+Road+Coimbatore"
  },
  {
    id: "a2",
    name: "Dr. R. Prabhakaran",
    qualification: "M.S. ENT, MS Ramaiah Medical College",
    clinic: "Chennai ENT & Hearing Clinic",
    address: "18, TTK Road, Alwarpet, Chennai – 600 018",
    district: "Chennai",
    state: "Tamil Nadu",
    phone: "+91 98402 XXXXX",
    languages: ["Tamil", "English", "Hindi"],
    specialisation: "Cochlear Implants, Paediatric Hearing",
    mapLink: "https://maps.google.com/?q=TTK+Road+Chennai"
  },
  {
    id: "a3",
    name: "Dr. V. Karthikeyan",
    qualification: "BASLP, JSS Institute of Speech and Hearing",
    clinic: "Madurai Sound & Speech Centre",
    address: "12, Kamarajar Salai, Madurai – 625 009",
    district: "Madurai",
    state: "Tamil Nadu",
    phone: "+91 94433 XXXXX",
    languages: ["Tamil", "English"],
    specialisation: "Newborn Hearing Screening",
    mapLink: "https://maps.google.com/?q=Kamarajar+Salai+Madurai"
  },
  {
    id: "a4",
    name: "Dr. Anita Rajan",
    qualification: "M.Sc. Audiology, SRMC",
    clinic: "Trichy Hearing Solutions",
    address: "5, Thillai Nagar Main Road, Tiruchirappalli – 620 018",
    district: "Tiruchirappalli",
    state: "Tamil Nadu",
    phone: "+91 99444 XXXXX",
    languages: ["Tamil", "English"],
    specialisation: "Educational Audiology, Auditory Processing",
    mapLink: "https://maps.google.com/?q=Thillai+Nagar+Trichy"
  },
  {
    id: "a5",
    name: "Dr. K. Senthil Kumar",
    qualification: "Ph.D. Audiology, AIISH",
    clinic: "Salem Advanced Hearing Clinic",
    address: "24, Omalur Main Road, Salem – 636 009",
    district: "Salem",
    state: "Tamil Nadu",
    phone: "+91 98945 XXXXX",
    languages: ["Tamil", "English", "Telugu"],
    specialisation: "Paediatric Audiology, Tinnitus Management",
    mapLink: "https://maps.google.com/?q=Omalur+Main+Road+Salem"
  },
  {
    id: "a6",
    name: "Dr. P. Nandhini",
    qualification: "BASLP, MERF",
    clinic: "Tiruppur Hearing Aid Centre",
    address: "10, PN Road, Tiruppur – 641 602",
    district: "Tiruppur",
    state: "Tamil Nadu",
    phone: "+91 98422 XXXXX",
    languages: ["Tamil", "English"],
    specialisation: "Paediatric Hearing Assessment",
    mapLink: "https://maps.google.com/?q=PN+Road+Tiruppur"
  },
  {
    id: "a7",
    name: "Dr. M. Suresh",
    qualification: "M.Sc. Audiology",
    clinic: "Vellore Speech and Hearing Clinic",
    address: "55, Katpadi Road, Vellore – 632 004",
    district: "Vellore",
    state: "Tamil Nadu",
    phone: "+91 94431 XXXXX",
    languages: ["Tamil", "English", "Hindi"],
    specialisation: "Rehabilitative Audiology",
    mapLink: "https://maps.google.com/?q=Katpadi+Road+Vellore"
  },
  {
    id: "a8",
    name: "Dr. L. Geetha",
    qualification: "BASLP, CMC Vellore",
    clinic: "Erode Hearing Care",
    address: "33, Perundurai Road, Erode – 638 011",
    district: "Erode",
    state: "Tamil Nadu",
    phone: "+91 98941 XXXXX",
    languages: ["Tamil", "English"],
    specialisation: "Diagnostic Audiology",
    mapLink: "https://maps.google.com/?q=Perundurai+Road+Erode"
  },
  {
    id: "a9",
    name: "Dr. R. Venkatesh",
    qualification: "M.S. ENT",
    clinic: "Thanjavur ENT Care",
    address: "21, Medical College Road, Thanjavur – 613 004",
    district: "Thanjavur",
    state: "Tamil Nadu",
    phone: "+91 94422 XXXXX",
    languages: ["Tamil", "English"],
    specialisation: "Otology and Audiology",
    mapLink: "https://maps.google.com/?q=Medical+College+Road+Thanjavur"
  },
  {
    id: "a10",
    name: "Dr. S. Priya",
    qualification: "M.Sc. Audiology & Speech Therapy",
    clinic: "Tirunelveli Sound Centre",
    address: "15, Vannarpettai, Tirunelveli – 627 003",
    district: "Tirunelveli",
    state: "Tamil Nadu",
    phone: "+91 99422 XXXXX",
    languages: ["Tamil", "English", "Malayalam"],
    specialisation: "Paediatric Aural Rehabilitation",
    mapLink: "https://maps.google.com/?q=Vannarpettai+Tirunelveli"
  }
];
