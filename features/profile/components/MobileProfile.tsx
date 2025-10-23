'use client';

import React, { useState } from 'react';
import {
  User,
  MapPin,
  Star,
  Award,
  Shield,
  ChevronRight,
  ChevronDown,
  Clock,
  CheckCircle,
  AlertCircle,
  Briefcase,
  Calendar,
  TrendingUp,
  GraduationCap,
  Users,
  Globe,
  Heart,
  BookOpen,
  Target,
  MessageCircle,
  Phone,
  Mail,
  CalendarCheck,
  X,
} from 'lucide-react';

// Mock profile data - will connect to Firebase later
const mockProfile = {
  id: 'TOM-NHS-2024-4782',
  firstName: 'Sarah',
  lastName: 'Johnson',
  role: 'Scrub Nurse',
  band: 'Band 6',
  rating: 4.8,
  totalShifts: 127,
  completedShifts: 125,

  // Contact Details
  contactDetails: {
    email: 'sarah.johnson@nhs.net',
    phone: '+44 7700 900123',
    preferredContact: 'email'
  },

  // Location & Availability
  location: {
    currentTrust: 'Barts Health NHS Trust',
    currentHospital: 'Royal London Hospital',
    postcode: 'E1 1BB',
    area: 'East London',
    willingToTravel: 10, // miles
  },

  // Experience & Specialties
  yearsExperience: 6,

  competencyStats: {
    mandatory: 12,
    clinical: 89,
    technical: 24,
    professional: 8,
  },

  // Hierarchical specialty tree
  specialtyTree: [
    {
      name: 'Orthopaedics',
      subcategories: [
        {
          name: 'Trauma',
          subcategories: [
            { name: 'Upper Limb Trauma', procedures: ['ORIF Radius/Ulna', 'ORIF Humerus', 'Shoulder Dislocation Repair'] },
            { name: 'Lower Limb Trauma', procedures: ['Femoral Nail Fixation', 'Dynamic Hip Screw', 'ORIF Ankle Fracture', 'Tibial Nailing'] },
            { name: 'Pelvic Trauma', procedures: ['Pelvic Fixation', 'Acetabular Fracture ORIF'] }
          ]
        },
        {
          name: 'Elective',
          subcategories: [
            { name: 'Hip', procedures: ['Total Hip Replacement', 'Hip Resurfacing', 'Revision THR'] },
            { name: 'Knee', procedures: ['Total Knee Replacement', 'Unicompartmental Knee', 'Revision TKR'] },
            { name: 'Shoulder', procedures: ['Shoulder Arthroscopy', 'Rotator Cuff Repair', 'Shoulder Replacement'] },
            { name: 'Foot & Ankle', procedures: ['Bunion Correction', 'Ankle Arthroscopy', 'Achilles Repair'] }
          ]
        },
        {
          name: 'Spinal',
          procedures: ['Lumbar Discectomy', 'Spinal Fusion', 'Laminectomy']
        }
      ]
    },
    {
      name: 'General Surgery',
      subcategories: [
        {
          name: 'Upper GI',
          procedures: ['Laparoscopic Cholecystectomy', 'Laparoscopic Fundoplication', 'Oesophagectomy', 'Gastrectomy']
        },
        {
          name: 'Lower GI',
          subcategories: [
            { name: 'Colorectal', procedures: ['Right Hemicolectomy', 'Left Hemicolectomy', 'Anterior Resection', 'Abdominoperineal Resection'] },
            { name: 'Emergency', procedures: ['Open Appendectomy', 'Laparoscopic Appendectomy', 'Small Bowel Resection'] }
          ]
        },
        {
          name: 'Hepatobiliary',
          procedures: ['Liver Resection', 'Whipple Procedure', 'Pancreatic Surgery']
        },
        {
          name: 'Breast',
          procedures: ['Wide Local Excision', 'Mastectomy', 'Axillary Clearance', 'Breast Reconstruction']
        },
        {
          name: 'Hernia',
          procedures: ['Inguinal Hernia Repair (Open)', 'Inguinal Hernia Repair (Lap)', 'Umbilical Hernia Repair', 'Incisional Hernia Repair']
        }
      ]
    },
    {
      name: 'Cardiac Surgery',
      subcategories: [
        {
          name: 'Coronary',
          procedures: ['CABG (On-Pump)', 'CABG (Off-Pump)', 'Minimally Invasive CABG']
        },
        {
          name: 'Valve',
          procedures: ['AVR (Aortic Valve Replacement)', 'MVR (Mitral Valve Replacement)', 'Mitral Valve Repair', 'TAVI']
        },
        {
          name: 'Aortic',
          procedures: ['Aortic Aneurysm Repair', 'Aortic Dissection Repair', 'Bentall Procedure']
        }
      ]
    },
    {
      name: 'Neurosurgery',
      subcategories: [
        {
          name: 'Cranial',
          procedures: ['Craniotomy for Tumour', 'Burr Hole Drainage', 'VP Shunt Insertion', 'Aneurysm Clipping']
        },
        {
          name: 'Spinal',
          procedures: ['Spinal Decompression', 'Spinal Instrumentation', 'Discectomy']
        }
      ]
    },
    {
      name: 'Vascular Surgery',
      procedures: ['AAA Repair (Open)', 'EVAR', 'Carotid Endarterectomy', 'Femoropopliteal Bypass', 'AV Fistula Formation']
    },
    {
      name: 'Plastic Surgery',
      subcategories: [
        {
          name: 'Reconstructive',
          procedures: ['Free Flap Reconstruction', 'Skin Grafting', 'Hand Surgery']
        },
        {
          name: 'Cosmetic',
          procedures: ['Breast Augmentation', 'Abdominoplasty', 'Rhinoplasty']
        }
      ]
    },
    {
      name: 'Maxillofacial Surgery',
      procedures: ['Mandible Fracture ORIF', 'Maxillary Fracture ORIF', 'Orthognathic Surgery', 'TMJ Surgery']
    },
    {
      name: 'Gynaecology',
      procedures: ['Total Abdominal Hysterectomy', 'Laparoscopic Hysterectomy', 'Ovarian Cystectomy', 'Prolapse Repair']
    },
    {
      name: 'Urology',
      procedures: ['TURP', 'TURBT', 'Nephrectomy', 'Cystectomy', 'Prostatectomy']
    }
  ],

  // Competency Tree
  competencyTree: [
    {
      name: 'Mandatory Training',
      icon: 'shield',
      subcategories: [
        {
          name: 'Statutory & Mandatory',
          items: [
            { name: 'Basic Life Support', level: 'certified', expiry: '2026-03-15', provider: 'Resuscitation Council UK' },
            { name: 'Immediate Life Support', level: 'certified', expiry: '2026-03-15', provider: 'Resuscitation Council UK' },
            { name: 'Safeguarding Adults Level 3', level: 'certified', expiry: '2026-01-20', provider: 'Trust Training' },
            { name: 'Safeguarding Children Level 3', level: 'certified', expiry: '2026-01-20', provider: 'Trust Training' },
            { name: 'Infection Prevention & Control', level: 'certified', expiry: '2026-04-10', provider: 'Trust Training' },
            { name: 'Fire Safety', level: 'certified', expiry: '2025-11-30', provider: 'Trust Training' },
            { name: 'Health & Safety', level: 'certified', expiry: '2025-11-30', provider: 'Trust Training' }
          ]
        },
        {
          name: 'Clinical Mandatory',
          items: [
            { name: 'Blood Transfusion', level: 'certified', expiry: '2026-02-20', provider: 'Trust Training' },
            { name: 'Anaphylaxis Management', level: 'certified', expiry: '2026-03-10', provider: 'Resuscitation Council UK' },
            { name: 'Latex Allergy Awareness', level: 'certified', expiry: '2025-12-15', provider: 'Trust Training' },
            { name: 'COSHH', level: 'certified', expiry: '2026-01-05', provider: 'Trust Training' },
            { name: 'Manual Handling', level: 'certified', expiry: '2025-11-28', provider: 'Trust Training' }
          ]
        }
      ]
    },
    {
      name: 'Clinical & Practical Skills',
      icon: 'briefcase',
      subcategories: [
        {
          name: 'Theatre Scrub',
          subcategories: [
            {
              name: 'Scrubbing & Gowning',
              items: [
                { name: 'Aseptic Technique', level: 'expert', description: 'Full aseptic non-touch technique (ANTT) for surgical procedures.' },
                { name: 'Surgical Scrub', level: 'expert', description: 'Traditional and alcohol-based surgical hand preparation.' },
                { name: 'Sterile Gowning & Gloving', level: 'expert', description: 'Open and closed gloving techniques, assisted gowning of surgeon.' }
              ]
            },
            {
              name: 'Instrument Handling',
              items: [
                { name: 'Instrument Recognition', level: 'expert', description: 'Immediate identification of 500+ surgical instruments across all specialties.' },
                { name: 'Instrument Passing', level: 'expert', description: 'Anticipatory instrument passing, understanding surgeon preferences.' },
                { name: 'Sharps Safety', level: 'expert', description: 'No-touch sharps handling, neutral zone technique.' }
              ]
            },
            {
              name: 'Surgical Count',
              items: [
                { name: 'WHO Surgical Safety Checklist', level: 'expert', description: 'Sign In, Time Out, Sign Out procedures.' },
                { name: 'Swab & Instrument Counting', level: 'expert', description: 'Pre, intra, and post-operative counts with documentation.' },
                { name: 'Accountability', level: 'expert', description: 'Managing count discrepancies, escalation procedures.' }
              ]
            }
          ]
        },
        {
          name: 'Theatre Anaesthetics',
          items: [
            { name: 'Anaesthetic Machine Check', level: 'competent', description: 'Daily anaesthetic machine checks and troubleshooting.' },
            { name: 'Airway Management Assistance', level: 'competent', description: 'Assisting with intubation, LMA insertion, difficult airway.' },
            { name: 'IV Access & Drug Administration', level: 'competent', description: 'Peripheral IV cannulation, drug drawing, checking procedures.' },
            { name: 'Patient Monitoring', level: 'competent', description: 'Understanding ECG, SpO2, NIBP, capnography, temperature.' },
            { name: 'Anaesthetic Emergencies', level: 'competent', description: 'Anaphylaxis, malignant hyperthermia, failed intubation support.' }
          ]
        },
        {
          name: 'Recovery',
          items: [
            { name: 'Post-Operative Observations', level: 'competent', description: 'Neurological, cardiovascular, respiratory assessment.' },
            { name: 'Pain Management', level: 'competent', description: 'Pain scoring, analgesic administration, PCA/epidural monitoring.' },
            { name: 'PONV Management', level: 'competent', description: 'Post-operative nausea and vomiting assessment and treatment.' },
            { name: 'Discharge Criteria', level: 'competent', description: 'Aldrete scoring, safe discharge from recovery.' }
          ]
        }
      ]
    },
    {
      name: 'Technical & Equipment',
      icon: 'briefcase',
      subcategories: [
        {
          name: 'Theatre Equipment',
          items: [
            { name: 'Diathermy (Monopolar & Bipolar)', level: 'expert', description: 'Safe setup, troubleshooting, patient safety checks.' },
            { name: 'Operating Tables', level: 'expert', description: 'Positioning, table adjustments, attachments for all specialties.' },
            { name: 'Theatre Lights', level: 'expert', description: 'LED and halogen systems, positioning, sterilization of handles.' },
            { name: 'Suction Systems', level: 'expert', description: 'Wall suction, portable suction, Yankauer and surgical tips.' },
            { name: 'Tourniquets', level: 'expert', description: 'Application, pressure settings, tourniquet time monitoring.' },
            { name: 'Patient Warming Devices', level: 'advanced', description: 'Bair Hugger, heated mattresses, fluid warmers.' }
          ]
        },
        {
          name: 'Laparoscopic Equipment',
          items: [
            { name: 'Laparoscopy Tower', level: 'advanced', description: 'Setup, camera handling, insufflation management.' },
            { name: 'Laparoscopic Instruments', level: 'advanced', description: 'Graspers, scissors, dissectors, staplers, clip appliers.' },
            { name: 'Energy Devices', level: 'advanced', description: 'LigaSure, Harmonic, Thunderbeat, EnSeal systems.' },
            { name: 'Specimen Retrieval', level: 'advanced', description: 'Endobags, morcellation (where appropriate).' }
          ]
        },
        {
          name: 'Robotic Systems',
          items: [
            { name: 'Da Vinci Xi', level: 'certified', description: 'Patient cart setup, instrument changes, troubleshooting.' },
            { name: 'Mako Robotic Knee System', level: 'certified', description: 'System setup, registration, intra-operative support.' },
            { name: 'Mazor X Stealth', level: 'certified', description: 'Spinal robotics setup and intra-operative workflow.' }
          ]
        },
        {
          name: 'Imaging',
          items: [
            { name: 'C-Arm Operation', level: 'competent', description: 'Positioning, radiation safety, image acquisition.' },
            { name: 'Image Intensifier', level: 'competent', description: 'Setup for orthopaedic and vascular cases.' },
            { name: 'Ultrasound (Intra-Operative)', level: 'basic', description: 'Sterile probe handling, image interpretation support.' }
          ]
        }
      ]
    },
    {
      name: 'Professional & Leadership',
      icon: 'briefcase',
      items: [
        { name: 'Mentorship & Supervision', level: 'expert', description: 'Mentoring students, newly qualified staff, and junior nurses.' },
        { name: 'Competency Assessment', level: 'advanced', description: 'Assessing and signing off theatre competencies for Band 5 staff.' },
        { name: 'Theatre Coordination', level: 'advanced', description: 'List coordination, emergency prioritization, staff allocation.' },
        { name: 'Clinical Audits', level: 'competent', description: 'Participation in and leading quality improvement projects.' },
        { name: 'EPR Systems', level: 'expert', description: 'Cerner, Epic, Lorenzo - documentation and workflow.' },
        { name: 'Policy Development', level: 'competent', description: 'Contributing to SOPs, guidelines, and departmental policies.' },
        { name: 'Incident Investigation', level: 'competent', description: 'Datix reporting, root cause analysis, learning from incidents.' },
        { name: 'Teaching & Training', level: 'advanced', description: 'Delivering formal teaching sessions, simulation training.' }
      ]
    }
  ],

  // Employment History
  employmentHistory: [
    {
      employer: 'Barts Health NHS Trust',
      hospital: 'Royal London Hospital',
      department: 'Main Theatres',
      position: 'Senior Theatre Nurse',
      band: 'Band 6',
      type: 'Permanent',
      startDate: '2022-06-01',
      endDate: null, // Current
      specialties: ['Orthopaedics', 'Trauma & Orthopaedics', 'General Surgery'],
      responsibilities: [
        'Lead scrub nurse for major trauma and elective orthopaedic procedures',
        'Mentoring and supervising junior staff and students',
        'Competency assessor for newly qualified theatre nurses',
        'Theatre list coordination and emergency response'
      ],
      verifiedBy: 'Jane Mitchell',
      verifiedByRole: 'Theatre Manager',
      verifiedDate: '2025-10-01',
      verified: true
    },
    {
      employer: 'Barts Health NHS Trust',
      hospital: 'Royal London Hospital',
      department: 'Cardiac Theatres',
      position: 'Theatre Nurse',
      band: 'Band 5',
      type: 'Permanent',
      startDate: '2020-03-01',
      endDate: '2022-05-31',
      specialties: ['Cardiac Surgery', 'Cardiothoracic'],
      responsibilities: [
        'Scrub nurse for CABG, valve replacements, and aortic surgery',
        'Circulating role for complex cardiac procedures',
        'Training in cardiopulmonary bypass support'
      ]
    },
    {
      employer: "Guy's and St Thomas' NHS Foundation Trust",
      hospital: "St Thomas' Hospital",
      department: 'Neurosurgery Theatres',
      position: 'Theatre Nurse',
      band: 'Band 5',
      type: 'Permanent',
      startDate: '2018-09-01',
      endDate: '2020-02-28',
      specialties: ['Neurosurgery', 'Spinal Surgery'],
      responsibilities: [
        'Scrub nurse for cranial and spinal neurosurgical procedures',
        'Specialized training in neurosurgical instrumentation',
        'Support for awake craniotomy procedures'
      ]
    },
    {
      employer: "King's College Hospital NHS Foundation Trust",
      hospital: "King's College Hospital",
      department: 'General Theatres',
      position: 'Newly Qualified Theatre Nurse',
      band: 'Band 5',
      type: 'Permanent',
      startDate: '2018-07-01',
      endDate: '2018-08-31',
      specialties: ['General Surgery', 'Urology', 'Gynaecology'],
      responsibilities: [
        'Preceptorship programme for newly qualified theatre nurses',
        'Rotation across general surgical specialties',
        'Building core theatre competencies'
      ]
    }
  ],

  // Education & Qualifications
  education: [
    {
      institution: 'City, University of London',
      degree: 'BSc (Hons) Nursing (Adult)',
      field: 'Adult Nursing',
      grade: 'First Class Honours',
      startDate: '2015-09-01',
      endDate: '2018-07-01',
      description: 'Three-year undergraduate nursing programme with clinical placements across acute, community, and mental health settings. Final year dissertation on "Improving Surgical Safety Culture in NHS Theatres".',
      verified: true,
      verificationLink: 'https://www.city.ac.uk/verify',
      certificateNumber: 'CITY-NURS-2018-4782'
    },
    {
      institution: 'Royal College of Nursing',
      degree: 'Post-Registration Certificate',
      field: 'Perioperative Care',
      grade: 'Pass with Distinction',
      startDate: '2019-01-01',
      endDate: '2019-12-01',
      description: 'Specialist post-registration training in perioperative nursing, covering scrub, anaesthetics, and recovery nursing across all surgical specialties.'
    },
    {
      institution: 'Association of periOperative Registered Nurses (AORN)',
      degree: 'CNOR Certification Preparation',
      field: 'Perioperative Nursing',
      grade: 'Completed',
      startDate: '2023-06-01',
      endDate: '2023-09-01',
      description: 'Preparation for Certified Nurse Operating Room (CNOR) international certification. Comprehensive review of perioperative standards and best practices.'
    }
  ],

  // Certifications & Licenses
  certifications: [
    { name: 'NMC Registration', issuer: 'Nursing & Midwifery Council', number: 'NMC12A34567', issueDate: '2018-07-01', expiryDate: '2027-07-01', status: 'Active' },
    { name: 'Da Vinci Xi Robotic System', issuer: 'Intuitive Surgical', number: 'DV-UK-2023-1847', issueDate: '2023-11-20', expiryDate: null, status: 'Current' },
    { name: 'Mako Robotic Knee System', issuer: 'Stryker', number: 'MAKO-EU-2024-0392', issueDate: '2024-03-15', expiryDate: '2027-03-15', status: 'Current' },
    { name: 'Mazor X Stealth Edition', issuer: 'Medtronic', number: 'MX-UK-2024-0618', issueDate: '2024-06-10', expiryDate: '2027-06-10', status: 'Current' },
    { name: 'ILS Provider', issuer: 'Resuscitation Council UK', number: 'RCUK-ILS-2025-48291', issueDate: '2025-03-15', expiryDate: '2026-03-15', status: 'Current' },
    { name: 'Mentor & Assessor', issuer: 'NMC Approved', number: 'MA-2021-7734', issueDate: '2021-05-10', expiryDate: null, status: 'Current' }
  ],

  // Professional Memberships
  memberships: [
    {
      organization: 'Royal College of Nursing (RCN)',
      role: 'Member',
      startDate: '2018-07-01',
      current: true,
      description: 'Professional membership with access to clinical networks, CPD resources, and professional indemnity insurance.'
    },
    {
      organization: 'Association of periOperative Registered Nurses (AORN)',
      role: 'International Member',
      startDate: '2020-01-01',
      current: true,
      description: 'International perioperative nursing organization providing evidence-based guidelines and professional development.'
    },
    {
      organization: 'British Association of Perioperative Practitioners (BAPS)',
      role: 'Member',
      startDate: '2019-03-01',
      current: true,
      description: 'UK-based organization for theatre and perioperative practitioners, attending annual conferences and regional events.'
    },
    {
      organization: 'NANDA International',
      role: 'Member',
      startDate: '2020-06-01',
      current: false,
      description: 'Nursing diagnosis and classification systems for evidence-based nursing practice.'
    }
  ],

  // Recommendations
  recommendations: [
    {
      author: 'Mr. James Patterson',
      authorRole: 'Consultant Orthopaedic Surgeon',
      authorOrganization: 'Royal London Hospital',
      relationship: 'Worked together on same team',
      date: '2025-09-15',
      text: 'Sarah is an exceptional theatre nurse with outstanding technical skill and clinical knowledge. Her ability to anticipate surgical needs and maintain perfect aseptic technique under pressure is remarkable. I have worked with Sarah on numerous complex trauma cases and her professionalism, composure, and dedication to patient safety are exemplary. She is also an excellent mentor to junior staff and contributes significantly to the department culture of excellence.'
    },
    {
      author: 'Jane Mitchell',
      authorRole: 'Theatre Manager',
      authorOrganization: 'Royal London Hospital',
      relationship: 'Managed directly',
      date: '2025-08-22',
      text: "Sarah has been an invaluable member of our theatre team since joining as a Band 6. She consistently demonstrates leadership, clinical excellence, and a commitment to continuous improvement. Her work on our surgical count audit led to a significant reduction in count discrepancies. Sarah is a natural leader and mentor, and I have no doubt she will progress to Band 7 and beyond."
    },
    {
      author: 'Dr. Aisha Rahman',
      authorRole: 'Consultant Cardiac Surgeon',
      authorOrganization: "St Thomas' Hospital",
      relationship: 'Worked together on same team',
      date: '2022-04-10',
      text: "During her time in our cardiac theatres, Sarah proved herself to be a highly skilled and dedicated scrub nurse. Cardiac surgery demands precision, focus, and the ability to work effectively in high-pressure situations - Sarah excels in all these areas. Her commitment to learning and her positive attitude make her a pleasure to work with."
    }
  ],

  // Awards & Honors
  awards: [
    {
      title: 'Theatre Nurse of the Year',
      issuer: 'Barts Health NHS Trust',
      date: '2024-11-15',
      description: 'Awarded for outstanding clinical practice, leadership, and contribution to patient safety and quality improvement initiatives.'
    },
    {
      title: 'Mentor of the Year (Highly Commended)',
      issuer: 'Royal London Hospital',
      date: '2024-06-20',
      description: 'Recognized for exceptional mentorship and support of student nurses and newly qualified theatre practitioners.'
    },
    {
      title: 'Quality Improvement Award',
      issuer: 'Barts Health NHS Trust',
      date: '2023-10-05',
      description: 'For leading a successful project to reduce surgical count discrepancies through implementation of barcode scanning technology.'
    },
    {
      title: 'Patient Safety Champion',
      issuer: 'Royal London Hospital Theatres',
      date: '2023-03-12',
      description: 'Awarded for commitment to WHO Surgical Safety Checklist compliance and championing a safety-first culture.'
    }
  ],

  // Volunteer Experience
  volunteerWork: [
    {
      organization: 'Mercy Ships International',
      role: 'Volunteer Theatre Nurse',
      location: 'Madagascar',
      startDate: '2019-06-01',
      endDate: '2019-07-31',
      description: 'Volunteered on the hospital ship Africa Mercy, providing surgical care to underserved communities.',
      activities: [
        'Scrub nursing for complex reconstructive surgeries',
        'Training local healthcare workers in sterile technique',
        'Working in resource-limited settings with minimal equipment'
      ]
    },
    {
      organization: 'NHS Cadets Programme',
      role: 'Mentor & Workshop Leader',
      location: 'East London',
      startDate: '2021-09-01',
      endDate: null, // Ongoing
      description: 'Mentoring young people (14-18) interested in NHS careers, delivering workshops on theatre nursing and surgical safety.',
      activities: [
        'Monthly mentoring sessions with NHS Cadets',
        'Theatre tours and simulation training',
        'Career guidance and UCAS support for aspiring nursing students'
      ]
    }
  ],

  // Publications & Projects
  publications: [
    {
      title: 'Reducing Surgical Count Discrepancies: A Quality Improvement Initiative',
      type: 'Clinical Audit',
      publisher: 'Royal London Hospital',
      date: '2023-05-01',
      description: 'Led a quality improvement project implementing barcode scanning for surgical instruments and swabs, resulting in 87% reduction in count discrepancies over 6 months. Presented findings at Trust Quality Improvement Conference.',
      coAuthors: ['Rachel Thompson', 'Dr. Sarah Williams']
    },
    {
      title: 'Improving Surgical Safety Culture Through Enhanced WHO Checklist Compliance',
      type: 'Research Project',
      publisher: 'Journal of Perioperative Practice (Submitted)',
      date: '2024-09-01',
      description: 'Multi-site observational study examining barriers to WHO Surgical Safety Checklist compliance and interventions to improve team engagement. Currently under peer review.',
      coAuthors: ['Dr. Michael Foster', 'Jane Mitchell', 'Prof. David Chen']
    }
  ],

  // Languages
  languages: [
    { language: 'English', proficiency: 'Native' },
    { language: 'Polish', proficiency: 'Conversational' },
    { language: 'British Sign Language (BSL)', proficiency: 'Basic' }
  ],

  // Interests & Activities
  interests: [
    {
      category: 'Professional Development',
      items: ['Surgical robotics', 'Theatre efficiency optimization', 'Human factors in surgery', 'Quality improvement methodologies']
    },
    {
      category: 'Clinical Interests',
      items: ['Trauma & orthopaedic surgery', 'Neurosurgery', 'Surgical innovation', 'Patient safety']
    },
    {
      category: 'Personal',
      items: ['Running & marathons', 'Medical podcasts', 'Travel & photography', 'Cooking']
    }
  ],

  // Compliance
  compliance: {
    dbs: {
      status: 'valid',
      expiryDate: '2025-12-31',
      updateService: true,
      certificateNumber: 'DBS001234567890'
    },
    nmc: {
      status: 'active',
      number: 'NMC12A34567',
      expiryDate: '2027-07-01',
      revalidationDue: '2026-07-01'
    },
    occupationalHealth: {
      status: 'fit',
      lastAssessment: '2025-09-15',
      nextDue: '2026-09-15',
      restrictions: []
    },
    mandatoryTraining: [
      { name: 'Basic Life Support', status: 'valid', expiry: '2026-03-15' },
      { name: 'Immediate Life Support', status: 'valid', expiry: '2026-03-15' },
      { name: 'Safeguarding Adults L3', status: 'valid', expiry: '2026-01-20' },
      { name: 'Safeguarding Children L3', status: 'valid', expiry: '2026-01-20' },
      { name: 'Infection Prevention & Control', status: 'valid', expiry: '2026-04-10' },
      { name: 'Fire Safety', status: 'expiring', expiry: '2025-11-30' },
      { name: 'Health & Safety', status: 'expiring', expiry: '2025-11-30' },
      { name: 'Blood Transfusion', status: 'valid', expiry: '2026-02-20' },
      { name: 'Anaphylaxis Management', status: 'valid', expiry: '2026-03-10' },
      { name: 'COSHH', status: 'valid', expiry: '2026-01-05' },
      { name: 'Manual Handling', status: 'expiring', expiry: '2025-11-28' },
      { name: 'Preventing Radicalisation (PREVENT)', status: 'valid', expiry: '2026-05-12' }
    ],
    immunisations: [
      { name: 'Hepatitis B', status: 'current', lastDose: '2018-05-10', boosterDue: null },
      { name: 'MMR', status: 'current', lastDose: '2018-06-15', boosterDue: null },
      { name: 'Varicella (Chickenpox)', status: 'current', lastDose: '2018-06-15', boosterDue: null },
      { name: 'Tuberculosis (BCG)', status: 'current', lastDose: '2000-09-01', boosterDue: null },
      { name: 'Tetanus/Diphtheria/Polio', status: 'current', lastDose: '2020-03-10', boosterDue: '2030-03-10' },
      { name: 'COVID-19', status: 'current', lastDose: '2024-10-05', boosterDue: '2025-10-05' },
      { name: 'Influenza', status: 'current', lastDose: '2024-10-12', boosterDue: '2025-10-12' },
      { name: 'COVID-19 Primary Course', status: 'current', lastDose: '2021-04-20', boosterDue: null }
    ],
    indemnityInsurance: {
      provider: 'Royal College of Nursing',
      policyNumber: 'RCN-IND-2024-891234',
      coverage: '£6,000,000',
      expiryDate: '2025-06-30'
    }
  },

  // Preferences
  preferences: {
    shifts: ['Early (07:30-15:30)', 'Late (13:00-21:00)', 'Long Day (07:30-20:00)'],
    travel: { max: 10, unit: 'miles' },
    minRate: 28.50,
    maxHoursPerWeek: 48
  },

  // Track Record
  trackRecord: {
    reliability: 98.4, // %
    endorsements: 23,
    shiftsCancelled: 2,
    shiftsCompleted: 125
  },

  // Willing to work at
  willingToWorkAt: [
    'Royal London Hospital',
    "St Bartholomew's Hospital",
    'Whipps Cross University Hospital',
    'Newham University Hospital'
  ]
};

export default function MobileProfile() {
  const [activeSection, setActiveSection] = useState<'overview' | 'skills' | 'compliance'>('overview');
  const [selectedProcedure, setSelectedProcedure] = useState<any | null>(null);
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const [selectedSkillCategory, setSelectedSkillCategory] = useState<'mandatory' | 'clinical' | 'technical' | 'professional' | null>(null);
  const [selectedJob, setSelectedJob] = useState<any | null>(null);
  const [selectedEducation, setSelectedEducation] = useState<any | null>(null);
  const [selectedCertification, setSelectedCertification] = useState<any | null>(null);
  const [selectedAward, setSelectedAward] = useState<any | null>(null);
  const [selectedVolunteer, setSelectedVolunteer] = useState<any | null>(null);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showAvailabilityModal, setShowAvailabilityModal] = useState(false);
  const [showSpecificShiftModal, setShowSpecificShiftModal] = useState(false);
  const [showMultipleBookingsModal, setShowMultipleBookingsModal] = useState(false);

  const toggleNode = (path: string) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(path)) {
      newExpanded.delete(path);
    } else {
      newExpanded.add(path);
    }
    setExpandedNodes(newExpanded);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header with Avatar */}
      <div className="bg-gradient-to-r from-blue-600 to-teal-500 px-4 pt-8 pb-6">
        <div className="flex items-start space-x-4">
          <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center text-blue-600 text-2xl font-bold shadow-lg">
            {mockProfile.firstName[0]}{mockProfile.lastName[0]}
          </div>
          <div className="flex-1">
            <h1 className="text-white font-bold text-xl">
              {mockProfile.firstName} {mockProfile.lastName}
            </h1>
            <p className="text-white/90 text-sm">{mockProfile.role} • {mockProfile.band}</p>
            <p className="text-white/80 text-xs mt-1">{mockProfile.location.currentTrust}</p>
            <p className="text-white/70 text-xs font-mono mt-1">ID: {mockProfile.id}</p>
            <div className="flex items-center space-x-1 mt-2">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3.5 h-3.5 ${
                    i < Math.floor(mockProfile.rating)
                      ? 'text-yellow-300 fill-yellow-300'
                      : 'text-white/30'
                  }`}
                />
              ))}
              <span className="text-white text-xs ml-1">{mockProfile.rating}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2 mt-4">
          <button
            onClick={() => setShowContactModal(true)}
            className="bg-white text-blue-600 px-4 py-2.5 rounded-lg font-semibold text-sm flex items-center justify-center space-x-2 hover:bg-white/90 transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Message</span>
          </button>
          <button
            onClick={() => setShowBookingModal(true)}
            className="bg-white/20 backdrop-blur-sm text-white px-4 py-2.5 rounded-lg font-semibold text-sm flex items-center justify-center space-x-2 hover:bg-white/30 transition-colors border border-white/30"
          >
            <CalendarCheck className="w-4 h-4" />
            <span>Book Shift</span>
          </button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3 mt-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2.5 text-center">
            <div className="text-white font-bold text-lg">{mockProfile.yearsExperience}</div>
            <div className="text-white/80 text-xs">Years</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2.5 text-center">
            <div className="text-white font-bold text-lg">{mockProfile.totalShifts}</div>
            <div className="text-white/80 text-xs">Shifts</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2.5 text-center">
            <div className="text-white font-bold text-lg">{mockProfile.competencyStats.mandatory + mockProfile.competencyStats.clinical + mockProfile.competencyStats.technical + mockProfile.competencyStats.professional}</div>
            <div className="text-white/80 text-xs">Skills</div>
          </div>
        </div>
      </div>

      {/* Section Tabs */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="flex">
          {[
            { id: 'overview', label: 'Overview', icon: User },
            { id: 'skills', label: 'Skills', icon: Award },
            { id: 'compliance', label: 'Compliance', icon: Shield },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id as any)}
              className={`flex-1 py-3 px-3 text-sm font-medium transition-all flex items-center justify-center space-x-1.5 border-b-2 ${
                activeSection === tab.id
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content Sections */}
      <div className="pb-24">
        {activeSection === 'overview' && (
          <div className="space-y-0">
            {/* About - Instagram Story Style */}
            <div className="bg-white p-4 border-b border-gray-100">
              <p className="text-sm text-gray-900 leading-relaxed">
                <span className="font-semibold">Band 6 Scrub Nurse</span> • {mockProfile.yearsExperience} years experience • Specializing in <span className="text-blue-600">trauma & orthopaedics</span>, cardiac, neurosurgery & general surgery
              </p>
            </div>

            {/* Highlights - Instagram Story Highlights Style */}
            <div className="bg-white p-4 border-b border-gray-100">
              <div className="flex items-center space-x-3 overflow-x-auto pb-2">
                <div className="flex flex-col items-center flex-shrink-0">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-teal-500 p-0.5">
                    <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                      <Briefcase className="w-7 h-7 text-blue-600" />
                    </div>
                  </div>
                  <span className="text-xs text-gray-600 mt-1.5">Current</span>
                </div>
                <div className="flex flex-col items-center flex-shrink-0">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-teal-500 p-0.5">
                    <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                      <Award className="w-7 h-7 text-yellow-500" />
                    </div>
                  </div>
                  <span className="text-xs text-gray-600 mt-1.5">Awards</span>
                </div>
                <div className="flex flex-col items-center flex-shrink-0">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-teal-500 p-0.5">
                    <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                      <GraduationCap className="w-7 h-7 text-blue-600" />
                    </div>
                  </div>
                  <span className="text-xs text-gray-600 mt-1.5">Education</span>
                </div>
                <div className="flex flex-col items-center flex-shrink-0">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-teal-500 p-0.5">
                    <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                      <Heart className="w-7 h-7 text-red-500" />
                    </div>
                  </div>
                  <span className="text-xs text-gray-600 mt-1.5">Volunteer</span>
                </div>
                <div className="flex flex-col items-center flex-shrink-0">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-teal-500 p-0.5">
                    <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                      <Shield className="w-7 h-7 text-green-600" />
                    </div>
                  </div>
                  <span className="text-xs text-gray-600 mt-1.5">Certified</span>
                </div>
              </div>
            </div>

            {/* Current Role - Instagram Post Style */}
            <div className="bg-white border-b border-gray-100">
              <div className="px-4 py-3 flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-teal-500 flex items-center justify-center">
                  <Briefcase className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-900">{mockProfile.employmentHistory[0].position}</p>
                  <p className="text-xs text-gray-500">{mockProfile.employmentHistory[0].employer}</p>
                </div>
              </div>
              <div className="px-4 pb-3">
                <p className="text-xs text-gray-600 mb-2">{mockProfile.employmentHistory[0].department}</p>
                <div className="flex flex-wrap gap-1.5">
                  {mockProfile.employmentHistory[0].specialties.map((spec, idx) => (
                    <span key={idx} className="px-2.5 py-1 bg-gradient-to-r from-blue-50 to-teal-50 text-blue-700 text-xs rounded-full font-medium">
                      {spec}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Experience Timeline - Instagram Feed Style */}
            <div className="bg-white border-b border-gray-100">
              <div className="px-4 py-3 flex items-center justify-between">
                <h3 className="font-semibold text-gray-900 text-sm">Experience</h3>
                <Calendar className="w-4 h-4 text-gray-400" />
              </div>
              <div className="px-4 pb-4 space-y-3">
                {mockProfile.employmentHistory.slice(0, 3).map((job, index) => {
                  const startDate = new Date(job.startDate);
                  const endDate = job.endDate ? new Date(job.endDate) : new Date();
                  const months = (endDate.getFullYear() - startDate.getFullYear()) * 12 + (endDate.getMonth() - startDate.getMonth());
                  const years = Math.floor(months / 12);
                  const remainingMonths = months % 12;
                  const duration = years > 0
                    ? `${years}y ${remainingMonths}m`
                    : `${remainingMonths}m`;

                  return (
                    <button
                      key={index}
                      onClick={() => setSelectedJob(job)}
                      className="flex items-start space-x-3 w-full text-left hover:bg-gray-50 rounded-lg p-2 -m-2 transition-colors"
                    >
                      <div className={`w-10 h-10 rounded-lg ${!job.endDate ? 'bg-gradient-to-br from-blue-600 to-teal-500' : 'bg-gray-200'} flex items-center justify-center flex-shrink-0`}>
                        <Briefcase className={`w-5 h-5 ${!job.endDate ? 'text-white' : 'text-gray-500'}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <p className="text-sm font-semibold text-gray-900">{job.position}</p>
                          {!job.endDate && (
                            <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                              Current
                            </span>
                          )}
                          {job.verified && (
                            <CheckCircle className="w-4 h-4 text-blue-600" />
                          )}
                        </div>
                        <p className="text-xs text-gray-600">{job.hospital}</p>
                        <p className="text-xs text-gray-500">{duration} • {job.band}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0 mt-1" />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Education & Certifications - Grid Style */}
            <div className="bg-white border-b border-gray-100">
              <div className="px-4 py-3">
                <h3 className="font-semibold text-gray-900 text-sm mb-3">Education & Certifications</h3>
                <div className="grid grid-cols-2 gap-2">
                  {mockProfile.education.slice(0, 2).map((edu, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedEducation(edu)}
                      className="bg-gradient-to-br from-blue-50 to-teal-50 rounded-lg p-3 text-left hover:from-blue-100 hover:to-teal-100 transition-all active:scale-95 relative"
                    >
                      <GraduationCap className="w-5 h-5 text-blue-600 mb-2" />
                      {edu.verified && (
                        <CheckCircle className="w-4 h-4 text-blue-600 absolute top-2 right-2" />
                      )}
                      <p className="text-xs font-semibold text-gray-900 line-clamp-2">{edu.degree}</p>
                      <p className="text-xs text-gray-600 mt-1">{new Date(edu.endDate).getFullYear()}</p>
                    </button>
                  ))}
                  {mockProfile.certifications.slice(0, 2).map((cert, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedCertification(cert)}
                      className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-3 text-left hover:from-green-100 hover:to-emerald-100 transition-all active:scale-95 relative"
                    >
                      <Shield className="w-5 h-5 text-green-600 mb-2" />
                      <CheckCircle className="w-4 h-4 text-green-600 absolute top-2 right-2" />
                      <p className="text-xs font-semibold text-gray-900 line-clamp-2">{cert.name}</p>
                      <p className="text-xs text-gray-600 mt-1">{cert.issuer}</p>
                    </button>
                  ))}
                </div>
                <button className="text-xs text-blue-600 font-medium mt-3">
                  View all certifications ({mockProfile.certifications.length}) →
                </button>
              </div>
            </div>

            {/* Recommendations - Instagram Comment Style */}
            <div className="bg-white border-b border-gray-100">
              <div className="px-4 py-3 flex items-center justify-between">
                <h3 className="font-semibold text-gray-900 text-sm">Recommendations</h3>
                <Users className="w-4 h-4 text-gray-400" />
              </div>
              <div className="px-4 pb-4 space-y-3">
                {mockProfile.recommendations.map((rec, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-600 to-teal-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                      {rec.author.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline space-x-1.5">
                        <p className="text-sm font-semibold text-gray-900">{rec.author.split(' ')[0]}</p>
                        <p className="text-xs text-gray-600 line-clamp-2">"{rec.text.substring(0, 80)}..."</p>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">{rec.authorRole}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Awards - Grid with Icons */}
            <div className="bg-white border-b border-gray-100">
              <div className="px-4 py-3">
                <h3 className="font-semibold text-gray-900 text-sm mb-3">Awards & Honors</h3>
                <div className="space-y-2">
                  {mockProfile.awards.map((award, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedAward(award)}
                      className="flex items-center space-x-3 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-lg p-2.5 w-full text-left hover:from-yellow-100 hover:to-amber-100 transition-all active:scale-95"
                    >
                      <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center flex-shrink-0">
                        <Award className="w-4 h-4 text-yellow-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 line-clamp-1">{award.title}</p>
                        <p className="text-xs text-gray-600">{new Date(award.date).getFullYear()}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Volunteer - Card Style */}
            <div className="bg-white border-b border-gray-100">
              <div className="px-4 py-3">
                <h3 className="font-semibold text-gray-900 text-sm mb-3">Volunteer Experience</h3>
                <div className="space-y-2">
                  {mockProfile.volunteerWork.map((vol, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedVolunteer(vol)}
                      className="bg-gradient-to-br from-red-50 to-pink-50 rounded-lg p-3 w-full text-left hover:from-red-100 hover:to-pink-100 transition-all active:scale-95"
                    >
                      <div className="flex items-start space-x-2">
                        <Heart className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-gray-900">{vol.role}</p>
                          <p className="text-xs text-gray-600">{vol.organization}</p>
                          <p className="text-xs text-gray-500 mt-1">{vol.location} • {new Date(vol.startDate).getFullYear()}</p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Interests - Hashtag Style */}
            <div className="bg-white border-b border-gray-100">
              <div className="px-4 py-3">
                <h3 className="font-semibold text-gray-900 text-sm mb-3">Interests</h3>
                <div className="flex flex-wrap gap-2">
                  {mockProfile.interests.flatMap(interest => interest.items).map((item, idx) => (
                    <span key={idx} className="px-3 py-1.5 bg-gray-100 text-gray-700 text-xs rounded-full font-medium">
                      #{item.toLowerCase().replace(/\s+/g, '')}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'skills' && (
          <div className="space-y-3 p-4">
            {/* Skills Summary */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setSelectedSkillCategory('mandatory')}
                className="bg-gradient-to-br from-blue-600 to-teal-500 rounded-lg p-4 text-white text-left hover:from-blue-700 hover:to-teal-600 transition-all active:scale-95"
              >
                <div className="text-2xl font-bold">{mockProfile.competencyStats.mandatory}</div>
                <div className="text-sm opacity-90 mt-1">Mandatory Training</div>
              </button>
              <button
                onClick={() => setSelectedSkillCategory('clinical')}
                className="bg-gradient-to-br from-blue-600 to-teal-500 rounded-lg p-4 text-white text-left hover:from-blue-700 hover:to-teal-600 transition-all active:scale-95"
              >
                <div className="text-2xl font-bold">{mockProfile.competencyStats.clinical}</div>
                <div className="text-sm opacity-90 mt-1">Clinical Skills</div>
              </button>
              <button
                onClick={() => setSelectedSkillCategory('technical')}
                className="bg-gradient-to-br from-blue-600 to-teal-500 rounded-lg p-4 text-white text-left hover:from-blue-700 hover:to-teal-600 transition-all active:scale-95"
              >
                <div className="text-2xl font-bold">{mockProfile.competencyStats.technical}</div>
                <div className="text-sm opacity-90 mt-1">Technical Skills</div>
              </button>
              <button
                onClick={() => setSelectedSkillCategory('professional')}
                className="bg-gradient-to-br from-blue-600 to-teal-500 rounded-lg p-4 text-white text-left hover:from-blue-700 hover:to-teal-600 transition-all active:scale-95"
              >
                <div className="text-2xl font-bold">{mockProfile.competencyStats.professional}</div>
                <div className="text-sm opacity-90 mt-1">Leadership</div>
              </button>
            </div>

            {/* Competency Tree */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Competencies</h3>
              <div className="space-y-1">
                {mockProfile.competencyTree.map((category: any, idx: number) => (
                  <CompetencyNode
                    key={idx}
                    node={category}
                    path={category.name}
                    level={0}
                    expandedNodes={expandedNodes}
                    toggleNode={toggleNode}
                  />
                ))}
              </div>
            </div>

            {/* Specialties */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Specialties</h3>
              <div className="space-y-1">
                {mockProfile.specialtyTree.map((specialty: any, idx: number) => (
                  <SpecialtyNode
                    key={idx}
                    node={specialty}
                    path={specialty.name}
                    level={0}
                    expandedNodes={expandedNodes}
                    toggleNode={toggleNode}
                    setSelectedProcedure={setSelectedProcedure}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {activeSection === 'compliance' && (
          <div className="space-y-3 p-4">
            {/* Compliance Status */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-white border border-gray-200 rounded-lg p-3 text-center">
                <CheckCircle className="w-6 h-6 text-green-600 mx-auto mb-1" />
                <div className="text-lg font-bold text-gray-900">100%</div>
                <div className="text-xs text-gray-500">Compliance</div>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-3 text-center">
                <Shield className="w-6 h-6 text-blue-600 mx-auto mb-1" />
                <div className="text-lg font-bold text-gray-900">{mockProfile.compliance.mandatoryTraining.length}</div>
                <div className="text-xs text-gray-500">Certifications</div>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-3 text-center">
                <AlertCircle className="w-6 h-6 text-amber-600 mx-auto mb-1" />
                <div className="text-lg font-bold text-gray-900">3</div>
                <div className="text-xs text-gray-500">Expiring Soon</div>
              </div>
            </div>

            {/* Professional Registration */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                <Shield className="w-4 h-4 mr-2 text-blue-600" />
                Professional Registration
              </h3>
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">NMC Registration</p>
                    <p className="text-xs text-gray-500">Number: {mockProfile.compliance.nmc.number}</p>
                    <p className="text-xs text-gray-500">Expires: {new Date(mockProfile.compliance.nmc.expiryDate).toLocaleDateString()}</p>
                  </div>
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">DBS Check</p>
                    <p className="text-xs text-gray-500">Update Service: Active</p>
                    <p className="text-xs text-gray-500">Expires: {new Date(mockProfile.compliance.dbs.expiryDate).toLocaleDateString()}</p>
                  </div>
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
              </div>
            </div>

            {/* Mandatory Training */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Mandatory Training</h3>
              <div className="space-y-2">
                {mockProfile.compliance.mandatoryTraining.map((training, index) => (
                  <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">{training.name}</p>
                      <p className="text-xs text-gray-500">Expires: {new Date(training.expiry).toLocaleDateString()}</p>
                    </div>
                    {training.status === 'valid' ? (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-amber-600" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Immunisations */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Immunisations</h3>
              <div className="space-y-2">
                {mockProfile.compliance.immunisations.map((imm, index) => (
                  <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                    <div>
                      <p className="text-sm text-gray-900">{imm.name}</p>
                      <p className="text-xs text-gray-500">Last: {new Date(imm.lastDose).toLocaleDateString()}</p>
                    </div>
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                ))}
              </div>
            </div>

            {/* Occupational Health */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Occupational Health</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Status: Fit for Work</p>
                    <p className="text-xs text-gray-500">Last assessment: {new Date(mockProfile.compliance.occupationalHealth.lastAssessment).toLocaleDateString()}</p>
                    <p className="text-xs text-gray-500">Next due: {new Date(mockProfile.compliance.occupationalHealth.nextDue).toLocaleDateString()}</p>
                  </div>
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
              </div>
            </div>

            {/* Indemnity Insurance */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Indemnity Insurance</h3>
              <div className="space-y-1">
                <p className="text-sm text-gray-900">Provider: {mockProfile.compliance.indemnityInsurance.provider}</p>
                <p className="text-xs text-gray-500">Coverage: {mockProfile.compliance.indemnityInsurance.coverage}</p>
                <p className="text-xs text-gray-500">Expires: {new Date(mockProfile.compliance.indemnityInsurance.expiryDate).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Procedure Detail Modal */}
      {selectedProcedure && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4">
          <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full max-w-lg max-h-[80vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-teal-500 px-4 py-4 flex items-center justify-between">
              <h3 className="text-white font-bold text-lg">{selectedProcedure.name}</h3>
              <button
                onClick={() => setSelectedProcedure(null)}
                className="text-white hover:bg-white/20 rounded-full p-1"
              >
                ✕
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Specialty</p>
                <p className="text-sm text-gray-900">{selectedProcedure.specialty}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Proficiency Level</p>
                <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                  selectedProcedure.level === 'expert' ? 'bg-blue-100 text-blue-700' :
                  selectedProcedure.level === 'proficient' ? 'bg-teal-100 text-teal-700' :
                  selectedProcedure.level === 'competent' ? 'bg-green-100 text-green-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {selectedProcedure.level}
                </span>
              </div>
              {selectedProcedure.count && (
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Times Performed</p>
                  <p className="text-sm text-gray-900">{selectedProcedure.count}</p>
                </div>
              )}
              {selectedProcedure.lastPerformed && (
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Last Performed</p>
                  <p className="text-sm text-gray-900">{new Date(selectedProcedure.lastPerformed).toLocaleDateString()}</p>
                </div>
              )}
              {selectedProcedure.equipment && (
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Equipment & Systems</p>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedProcedure.equipment.map((eq: string, idx: number) => (
                      <span key={idx} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded">
                        {eq}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {selectedProcedure.description && (
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Description</p>
                  <p className="text-sm text-gray-600 leading-relaxed">{selectedProcedure.description}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Skill Category Detail Modal */}
      {selectedSkillCategory && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4">
          <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full max-w-lg max-h-[80vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-teal-500 px-4 py-4 flex items-center justify-between">
              <h3 className="text-white font-bold text-lg">
                {selectedSkillCategory === 'mandatory' && 'Mandatory Training'}
                {selectedSkillCategory === 'clinical' && 'Clinical Skills'}
                {selectedSkillCategory === 'technical' && 'Technical Skills'}
                {selectedSkillCategory === 'professional' && 'Leadership & Professional Skills'}
              </h3>
              <button
                onClick={() => setSelectedSkillCategory(null)}
                className="text-white hover:bg-white/20 rounded-full p-1"
              >
                ✕
              </button>
            </div>
            <div className="p-4">
              {selectedSkillCategory === 'mandatory' && (
                <div className="space-y-3">
                  <p className="text-sm text-gray-600 mb-4">All statutory and mandatory training requirements completed and up to date.</p>

                  <div className="space-y-2">
                    <h4 className="font-semibold text-gray-900 text-sm">Statutory & Mandatory</h4>
                    {[
                      { name: 'Basic Life Support', level: 'Certified', expiry: '2026-03-15', status: 'valid' },
                      { name: 'Immediate Life Support', level: 'Certified', expiry: '2026-03-15', status: 'valid' },
                      { name: 'Safeguarding Adults Level 3', level: 'Certified', expiry: '2026-01-20', status: 'valid' },
                      { name: 'Safeguarding Children Level 3', level: 'Certified', expiry: '2026-01-20', status: 'valid' },
                      { name: 'Infection Prevention & Control', level: 'Certified', expiry: '2026-04-10', status: 'valid' },
                      { name: 'Fire Safety', level: 'Certified', expiry: '2025-11-30', status: 'expiring' },
                      { name: 'Health & Safety', level: 'Certified', expiry: '2025-11-30', status: 'expiring' },
                    ].map((item, idx) => (
                      <div key={idx} className="bg-gray-50 rounded-lg p-3 flex items-start justify-between">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{item.name}</p>
                          <p className="text-xs text-gray-500 mt-1">Expires: {new Date(item.expiry).toLocaleDateString()}</p>
                        </div>
                        {item.status === 'valid' ? (
                          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                        ) : (
                          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2 mt-4">
                    <h4 className="font-semibold text-gray-900 text-sm">Clinical Mandatory</h4>
                    {[
                      { name: 'Blood Transfusion', expiry: '2026-02-20', status: 'valid' },
                      { name: 'Anaphylaxis Management', expiry: '2026-03-10', status: 'valid' },
                      { name: 'Latex Allergy Awareness', expiry: '2025-12-15', status: 'valid' },
                      { name: 'COSHH', expiry: '2026-01-05', status: 'valid' },
                      { name: 'Manual Handling', expiry: '2025-11-28', status: 'expiring' },
                    ].map((item, idx) => (
                      <div key={idx} className="bg-gray-50 rounded-lg p-3 flex items-start justify-between">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{item.name}</p>
                          <p className="text-xs text-gray-500 mt-1">Expires: {new Date(item.expiry).toLocaleDateString()}</p>
                        </div>
                        {item.status === 'valid' ? (
                          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                        ) : (
                          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedSkillCategory === 'clinical' && (
                <div className="space-y-3">
                  <p className="text-sm text-gray-600 mb-4">Comprehensive clinical and practical skills across theatre scrub, anaesthetics, and recovery nursing.</p>

                  <div className="space-y-2">
                    <h4 className="font-semibold text-gray-900 text-sm">Theatre Scrub - Core Skills</h4>
                    {[
                      { name: 'Aseptic Technique (ANTT)', level: 'Expert', description: 'Full aseptic non-touch technique for all surgical procedures' },
                      { name: 'Surgical Scrub', level: 'Expert', description: 'Traditional and alcohol-based hand preparation' },
                      { name: 'Sterile Gowning & Gloving', level: 'Expert', description: 'Open/closed gloving, assisted gowning' },
                      { name: 'Instrument Recognition', level: 'Expert', description: '500+ instruments across all specialties' },
                      { name: 'Instrument Passing', level: 'Expert', description: 'Anticipatory passing, surgeon preferences' },
                      { name: 'Sharps Safety', level: 'Expert', description: 'No-touch sharps handling, neutral zone technique' },
                    ].map((item, idx) => (
                      <div key={idx} className="bg-gray-50 rounded-lg p-3">
                        <div className="flex items-start justify-between mb-1">
                          <p className="text-sm font-medium text-gray-900">{item.name}</p>
                          <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded font-medium">
                            {item.level}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600">{item.description}</p>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2 mt-4">
                    <h4 className="font-semibold text-gray-900 text-sm">Theatre Anaesthetics</h4>
                    {[
                      { name: 'Anaesthetic Machine Check', level: 'Competent' },
                      { name: 'Airway Management Assistance', level: 'Competent' },
                      { name: 'IV Access & Drug Administration', level: 'Competent' },
                      { name: 'Patient Monitoring (ECG, SpO2, NIBP)', level: 'Competent' },
                      { name: 'Anaesthetic Emergencies', level: 'Competent' },
                    ].map((item, idx) => (
                      <div key={idx} className="bg-gray-50 rounded-lg p-3 flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900">{item.name}</p>
                        <span className="px-2 py-0.5 bg-teal-100 text-teal-700 text-xs rounded font-medium">
                          {item.level}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2 mt-4">
                    <h4 className="font-semibold text-gray-900 text-sm">Recovery Nursing</h4>
                    {[
                      { name: 'Post-Operative Observations', level: 'Competent' },
                      { name: 'Pain Management (PCA/Epidural)', level: 'Competent' },
                      { name: 'PONV Management', level: 'Competent' },
                      { name: 'Discharge Criteria (Aldrete Scoring)', level: 'Competent' },
                    ].map((item, idx) => (
                      <div key={idx} className="bg-gray-50 rounded-lg p-3 flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900">{item.name}</p>
                        <span className="px-2 py-0.5 bg-teal-100 text-teal-700 text-xs rounded font-medium">
                          {item.level}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2 mt-4">
                    <h4 className="font-semibold text-gray-900 text-sm">WHO Surgical Safety Checklist</h4>
                    {[
                      { name: 'Sign In', level: 'Expert' },
                      { name: 'Time Out', level: 'Expert' },
                      { name: 'Sign Out', level: 'Expert' },
                      { name: 'Swab & Instrument Counting', level: 'Expert' },
                      { name: 'Count Discrepancy Management', level: 'Expert' },
                    ].map((item, idx) => (
                      <div key={idx} className="bg-gray-50 rounded-lg p-3 flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900">{item.name}</p>
                        <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded font-medium">
                          {item.level}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedSkillCategory === 'technical' && (
                <div className="space-y-3">
                  <p className="text-sm text-gray-600 mb-4">Expert-level technical equipment operation and troubleshooting across theatre equipment, laparoscopy, robotics, and imaging.</p>

                  <div className="space-y-2">
                    <h4 className="font-semibold text-gray-900 text-sm">Theatre Equipment</h4>
                    {[
                      { name: 'Diathermy (Monopolar & Bipolar)', level: 'Expert', manufacturer: 'Stryker System 8' },
                      { name: 'Operating Tables', level: 'Expert', manufacturer: 'Getinge Maquet' },
                      { name: 'Theatre Lights', level: 'Expert', manufacturer: 'LED & Halogen Systems' },
                      { name: 'Suction Systems', level: 'Expert', manufacturer: 'Wall & Portable' },
                      { name: 'Tourniquets', level: 'Expert', manufacturer: 'Zimmer ATS' },
                      { name: 'Patient Warming Devices', level: 'Advanced', manufacturer: 'Bair Hugger' },
                    ].map((item, idx) => (
                      <div key={idx} className="bg-gray-50 rounded-lg p-3">
                        <div className="flex items-start justify-between mb-1">
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">{item.name}</p>
                            <p className="text-xs text-gray-500 mt-0.5">{item.manufacturer}</p>
                          </div>
                          <span className={`px-2 py-0.5 text-xs rounded font-medium ${
                            item.level === 'Expert' ? 'bg-blue-100 text-blue-700' : 'bg-teal-100 text-teal-700'
                          }`}>
                            {item.level}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2 mt-4">
                    <h4 className="font-semibold text-gray-900 text-sm">Laparoscopic Equipment</h4>
                    {[
                      { name: 'Laparoscopy Tower', level: 'Advanced', manufacturer: 'Karl Storz' },
                      { name: 'Laparoscopic Instruments', level: 'Advanced', manufacturer: 'Various' },
                      { name: 'Energy Devices (LigaSure, Harmonic)', level: 'Advanced', manufacturer: 'Medtronic, Ethicon' },
                      { name: 'Specimen Retrieval', level: 'Advanced', manufacturer: 'Endobags' },
                    ].map((item, idx) => (
                      <div key={idx} className="bg-gray-50 rounded-lg p-3">
                        <div className="flex items-start justify-between mb-1">
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">{item.name}</p>
                            <p className="text-xs text-gray-500 mt-0.5">{item.manufacturer}</p>
                          </div>
                          <span className="px-2 py-0.5 bg-teal-100 text-teal-700 text-xs rounded font-medium">
                            {item.level}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2 mt-4">
                    <h4 className="font-semibold text-gray-900 text-sm">Robotic Systems (Certified)</h4>
                    {[
                      { name: 'Da Vinci Xi Surgical System', certDate: '2023-11-20', manufacturer: 'Intuitive Surgical' },
                      { name: 'Mako Robotic Knee System', certDate: '2024-03-15', manufacturer: 'Stryker' },
                      { name: 'Mazor X Stealth Edition', certDate: '2024-06-10', manufacturer: 'Medtronic' },
                    ].map((item, idx) => (
                      <div key={idx} className="bg-gray-50 rounded-lg p-3">
                        <div className="flex items-start justify-between mb-1">
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">{item.name}</p>
                            <p className="text-xs text-gray-500 mt-0.5">{item.manufacturer}</p>
                            <p className="text-xs text-gray-500">Certified: {new Date(item.certDate).toLocaleDateString()}</p>
                          </div>
                          <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded font-medium">
                            Certified
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2 mt-4">
                    <h4 className="font-semibold text-gray-900 text-sm">Imaging</h4>
                    {[
                      { name: 'C-Arm Operation', level: 'Competent' },
                      { name: 'Image Intensifier', level: 'Competent' },
                      { name: 'Intra-Operative Ultrasound', level: 'Basic' },
                    ].map((item, idx) => (
                      <div key={idx} className="bg-gray-50 rounded-lg p-3 flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900">{item.name}</p>
                        <span className={`px-2 py-0.5 text-xs rounded font-medium ${
                          item.level === 'Competent' ? 'bg-teal-100 text-teal-700' : 'bg-gray-100 text-gray-700'
                        }`}>
                          {item.level}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedSkillCategory === 'professional' && (
                <div className="space-y-3">
                  <p className="text-sm text-gray-600 mb-4">Leadership, mentorship, and professional development skills essential for senior theatre nursing roles.</p>

                  <div className="space-y-2">
                    {[
                      { name: 'Mentorship & Supervision', level: 'Expert', description: 'Mentoring students, NQPs, and junior nurses with structured development plans' },
                      { name: 'Competency Assessment', level: 'Advanced', description: 'Assessing and signing off theatre competencies for Band 5 staff' },
                      { name: 'Theatre Coordination', level: 'Advanced', description: 'List coordination, emergency prioritization, staff allocation across 8 theatres' },
                      { name: 'Clinical Audits & QI', level: 'Competent', description: 'Leading quality improvement projects, data analysis, and implementation' },
                      { name: 'EPR Systems', level: 'Expert', description: 'Cerner, Epic, Lorenzo - full documentation and workflow management' },
                      { name: 'Policy Development', level: 'Competent', description: 'Contributing to SOPs, guidelines, and departmental policies' },
                      { name: 'Incident Investigation', level: 'Competent', description: 'Datix reporting, root cause analysis, implementing learning' },
                      { name: 'Teaching & Training', level: 'Advanced', description: 'Formal teaching sessions, simulation training, conference presentations' },
                    ].map((item, idx) => (
                      <div key={idx} className="bg-gray-50 rounded-lg p-3">
                        <div className="flex items-start justify-between mb-1">
                          <p className="text-sm font-medium text-gray-900">{item.name}</p>
                          <span className={`px-2 py-0.5 text-xs rounded font-medium ${
                            item.level === 'Expert' ? 'bg-blue-100 text-blue-700' :
                            item.level === 'Advanced' ? 'bg-teal-100 text-teal-700' :
                            'bg-green-100 text-green-700'
                          }`}>
                            {item.level}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600">{item.description}</p>
                      </div>
                    ))}
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-4">
                    <h4 className="font-semibold text-blue-900 text-sm mb-2">Leadership Achievements</h4>
                    <ul className="text-xs text-blue-800 space-y-1.5">
                      <li>• Theatre Nurse of the Year 2024 - Barts Health NHS Trust</li>
                      <li>• Mentor of the Year (Highly Commended) 2024</li>
                      <li>• Led surgical count QI project - 87% reduction in discrepancies</li>
                      <li>• NMC Approved Mentor & Assessor since 2021</li>
                      <li>• Regular supervision of 3-5 student nurses per rotation</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Job Detail Modal */}
      {selectedJob && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4">
          <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full max-w-lg max-h-[80vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-teal-500 px-4 py-4 flex items-center justify-between">
              <h3 className="text-white font-bold text-lg">{selectedJob.position}</h3>
              <button
                onClick={() => setSelectedJob(null)}
                className="text-white hover:bg-white/20 rounded-full p-1"
              >
                ✕
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Organization</p>
                <p className="text-sm font-semibold text-gray-900">{selectedJob.employer}</p>
                <p className="text-sm text-gray-600">{selectedJob.hospital}</p>
                <p className="text-xs text-gray-500 mt-1">{selectedJob.department}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Duration</p>
                <p className="text-sm text-gray-900">
                  {new Date(selectedJob.startDate).toLocaleDateString()} - {selectedJob.endDate ? new Date(selectedJob.endDate).toLocaleDateString() : 'Present'}
                </p>
                <p className="text-xs text-gray-500 mt-1">{selectedJob.band} • {selectedJob.type}</p>
              </div>
              {selectedJob.specialties && (
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Specialties</p>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedJob.specialties.map((spec: string, idx: number) => (
                      <span key={idx} className="px-2.5 py-1 bg-blue-50 text-blue-700 text-xs rounded-full font-medium">
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {selectedJob.responsibilities && (
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Responsibilities</p>
                  <ul className="space-y-1.5">
                    {selectedJob.responsibilities.map((resp: string, idx: number) => (
                      <li key={idx} className="text-sm text-gray-600 flex items-start">
                        <span className="text-blue-600 mr-2">•</span>
                        <span>{resp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {selectedJob.verified && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-blue-900">Verified Employment</p>
                      <p className="text-xs text-blue-700 mt-1">
                        Verified by {selectedJob.verifiedBy} ({selectedJob.verifiedByRole}) on {new Date(selectedJob.verifiedDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Education Detail Modal */}
      {selectedEducation && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4">
          <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full max-w-lg max-h-[80vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-teal-500 px-4 py-4 flex items-center justify-between">
              <h3 className="text-white font-bold text-lg">{selectedEducation.degree}</h3>
              <button
                onClick={() => setSelectedEducation(null)}
                className="text-white hover:bg-white/20 rounded-full p-1"
              >
                ✕
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Institution</p>
                <p className="text-sm font-semibold text-gray-900">{selectedEducation.institution}</p>
                <p className="text-xs text-gray-500 mt-1">{selectedEducation.field}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Duration</p>
                <p className="text-sm text-gray-900">
                  {new Date(selectedEducation.startDate).toLocaleDateString()} - {new Date(selectedEducation.endDate).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Grade</p>
                <p className="text-sm font-semibold text-gray-900">{selectedEducation.grade}</p>
              </div>
              {selectedEducation.description && (
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Description</p>
                  <p className="text-sm text-gray-600 leading-relaxed">{selectedEducation.description}</p>
                </div>
              )}
              {selectedEducation.verified && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-green-900">Verified Qualification</p>
                      <p className="text-xs text-green-700 mt-1">
                        Certificate #: {selectedEducation.certificateNumber}
                      </p>
                      {selectedEducation.verificationLink && (
                        <a
                          href={selectedEducation.verificationLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-600 font-medium mt-2 inline-flex items-center hover:underline"
                        >
                          Verify at institution →
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Certification Detail Modal */}
      {selectedCertification && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4">
          <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full max-w-lg max-h-[80vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-teal-500 px-4 py-4 flex items-center justify-between">
              <h3 className="text-white font-bold text-lg">{selectedCertification.name}</h3>
              <button
                onClick={() => setSelectedCertification(null)}
                className="text-white hover:bg-white/20 rounded-full p-1"
              >
                ✕
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Issuing Organization</p>
                <p className="text-sm font-semibold text-gray-900">{selectedCertification.issuer}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Credential ID</p>
                <p className="text-sm text-gray-900 font-mono">{selectedCertification.number}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Issue Date</p>
                <p className="text-sm text-gray-900">{new Date(selectedCertification.issueDate).toLocaleDateString()}</p>
              </div>
              {selectedCertification.expiryDate && (
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Expiry Date</p>
                  <p className="text-sm text-gray-900">{new Date(selectedCertification.expiryDate).toLocaleDateString()}</p>
                </div>
              )}
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <div className="flex items-start space-x-2">
                  <Shield className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-green-900">Active Certification</p>
                    <p className="text-xs text-green-700 mt-1">This certification is currently active and verified.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Award Detail Modal */}
      {selectedAward && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4">
          <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full max-w-lg max-h-[80vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-teal-500 px-4 py-4 flex items-center justify-between">
              <h3 className="text-white font-bold text-lg">{selectedAward.title}</h3>
              <button
                onClick={() => setSelectedAward(null)}
                className="text-white hover:bg-white/20 rounded-full p-1"
              >
                ✕
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Awarded By</p>
                <p className="text-sm font-semibold text-gray-900">{selectedAward.issuer}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Date</p>
                <p className="text-sm text-gray-900">{new Date(selectedAward.date).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Description</p>
                <p className="text-sm text-gray-600 leading-relaxed">{selectedAward.description}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Volunteer Detail Modal */}
      {selectedVolunteer && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4">
          <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full max-w-lg max-h-[80vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-teal-500 px-4 py-4 flex items-center justify-between">
              <h3 className="text-white font-bold text-lg">{selectedVolunteer.role}</h3>
              <button
                onClick={() => setSelectedVolunteer(null)}
                className="text-white hover:bg-white/20 rounded-full p-1"
              >
                ✕
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Organization</p>
                <p className="text-sm font-semibold text-gray-900">{selectedVolunteer.organization}</p>
                <p className="text-xs text-gray-500 mt-1">{selectedVolunteer.location}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Duration</p>
                <p className="text-sm text-gray-900">
                  {new Date(selectedVolunteer.startDate).toLocaleDateString()} - {selectedVolunteer.endDate ? new Date(selectedVolunteer.endDate).toLocaleDateString() : 'Ongoing'}
                </p>
              </div>
              {selectedVolunteer.description && (
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">About</p>
                  <p className="text-sm text-gray-600 leading-relaxed">{selectedVolunteer.description}</p>
                </div>
              )}
              {selectedVolunteer.activities && (
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Activities</p>
                  <ul className="space-y-1.5">
                    {selectedVolunteer.activities.map((activity: string, idx: number) => (
                      <li key={idx} className="text-sm text-gray-600 flex items-start">
                        <span className="text-red-500 mr-2">•</span>
                        <span>{activity}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Contact/Message Modal */}
      {showContactModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4">
          <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full max-w-lg">
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-teal-500 px-4 py-4 flex items-center justify-between rounded-t-2xl">
              <h3 className="text-white font-bold text-lg">Contact {mockProfile.firstName}</h3>
              <button
                onClick={() => setShowContactModal(false)}
                className="text-white hover:bg-white/20 rounded-full p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-xs text-blue-700 mb-2">
                  <strong>Registration ID:</strong> {mockProfile.id}
                </p>
                <p className="text-xs text-blue-600">
                  Use this ID when referencing this staff member in communications or bookings.
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900 text-sm">Contact Methods</h4>

                <a
                  href={`mailto:${mockProfile.contactDetails.email}`}
                  className="flex items-center space-x-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <Mail className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Email</p>
                    <p className="text-xs text-gray-600">{mockProfile.contactDetails.email}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </a>

                <a
                  href={`tel:${mockProfile.contactDetails.phone}`}
                  className="flex items-center space-x-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                    <Phone className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Phone</p>
                    <p className="text-xs text-gray-600">{mockProfile.contactDetails.phone}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </a>

                <button
                  onClick={() => {
                    setShowContactModal(false);
                    // Open messaging interface
                  }}
                  className="w-full flex items-center space-x-3 p-3 bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 rounded-lg transition-colors text-white"
                >
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                    <MessageCircle className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-medium">Send Message</p>
                    <p className="text-xs opacity-90">Via TOM Platform</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-white" />
                </button>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                <p className="text-xs text-amber-800">
                  <strong>Preferred contact:</strong> {mockProfile.contactDetails.preferredContact === 'email' ? 'Email' : 'Phone'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Booking Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4">
          <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-teal-500 px-4 py-4 flex items-center justify-between rounded-t-2xl">
              <h3 className="text-white font-bold text-lg">Book {mockProfile.firstName} for Shift</h3>
              <button
                onClick={() => setShowBookingModal(false)}
                className="text-white hover:bg-white/20 rounded-full p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm font-semibold text-blue-900 mb-1">
                  {mockProfile.firstName} {mockProfile.lastName}
                </p>
                <p className="text-xs text-blue-700">
                  {mockProfile.role} • {mockProfile.band} • ID: {mockProfile.id}
                </p>
              </div>

              {/* Booking Options */}
              <div className="space-y-3">
                <button
                  onClick={() => setShowAvailabilityModal(true)}
                  className="w-full flex items-center space-x-3 p-4 bg-white border-2 border-gray-200 hover:border-blue-600 rounded-lg transition-all"
                >
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-600 to-teal-500 flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-semibold text-gray-900">View Availability</p>
                    <p className="text-xs text-gray-600">See available dates and time slots</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </button>

                <button
                  onClick={() => setShowSpecificShiftModal(true)}
                  className="w-full flex items-center space-x-3 p-4 bg-white border-2 border-gray-200 hover:border-blue-600 rounded-lg transition-all"
                >
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-600 to-emerald-500 flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-semibold text-gray-900">Request for Specific Shift</p>
                    <p className="text-xs text-gray-600">Send booking request for your shift</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </button>

                <button
                  onClick={() => setShowMultipleBookingsModal(true)}
                  className="w-full flex items-center space-x-3 p-4 bg-white border-2 border-gray-200 hover:border-blue-600 rounded-lg transition-all"
                >
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center">
                    <CalendarCheck className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-semibold text-gray-900">Multiple Bookings</p>
                    <p className="text-xs text-gray-600">Book for recurring shifts or multiple dates</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              {/* Quick Info */}
              <div className="space-y-2 pt-4 border-t border-gray-200">
                <h4 className="font-semibold text-gray-900 text-sm">Quick Info</h4>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-gray-50 rounded-lg p-2">
                    <p className="text-xs text-gray-500">Min Rate</p>
                    <p className="text-sm font-semibold text-gray-900">£{mockProfile.preferences.minRate}/hr</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-2">
                    <p className="text-xs text-gray-500">Max Travel</p>
                    <p className="text-sm font-semibold text-gray-900">{mockProfile.preferences.travel.max} miles</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-2">
                    <p className="text-xs text-gray-500">Rating</p>
                    <p className="text-sm font-semibold text-gray-900">⭐ {mockProfile.rating}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-2">
                    <p className="text-xs text-gray-500">Completed</p>
                    <p className="text-sm font-semibold text-gray-900">{mockProfile.completedShifts} shifts</p>
                  </div>
                </div>
              </div>

              {/* Preferred Shifts */}
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Preferred Shifts</p>
                <div className="flex flex-wrap gap-1.5">
                  {mockProfile.preferences.shifts.map((shift, idx) => (
                    <span key={idx} className="px-2.5 py-1 bg-blue-50 text-blue-700 text-xs rounded-full font-medium">
                      {shift}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Availability Modal */}
      {showAvailabilityModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4">
          <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-teal-500 px-4 py-4 flex items-center justify-between rounded-t-2xl">
              <h3 className="text-white font-bold text-lg">Availability Calendar</h3>
              <button
                onClick={() => setShowAvailabilityModal(false)}
                className="text-white hover:bg-white/20 rounded-full p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm font-semibold text-blue-900 mb-1">
                  {mockProfile.firstName} {mockProfile.lastName}
                </p>
                <p className="text-xs text-blue-700">
                  Showing availability for next 30 days
                </p>
              </div>

              {/* Mock Calendar - Next 7 days */}
              <div className="space-y-2">
                <h4 className="font-semibold text-gray-900 text-sm">This Week</h4>
                {[
                  { date: '2025-10-24', day: 'Monday', slots: ['Early (07:30-15:30)', 'Late (13:00-21:00)'] },
                  { date: '2025-10-25', day: 'Tuesday', slots: ['Long Day (07:30-20:00)'] },
                  { date: '2025-10-26', day: 'Wednesday', slots: [] },
                  { date: '2025-10-27', day: 'Thursday', slots: ['Early (07:30-15:30)', 'Late (13:00-21:00)'] },
                  { date: '2025-10-28', day: 'Friday', slots: ['Early (07:30-15:30)'] },
                  { date: '2025-10-29', day: 'Saturday', slots: ['Long Day (07:30-20:00)'] },
                  { date: '2025-10-30', day: 'Sunday', slots: [] },
                ].map((day, idx) => (
                  <div key={idx} className={`p-3 rounded-lg border-2 ${day.slots.length > 0 ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{day.day}</p>
                        <p className="text-xs text-gray-500">{new Date(day.date).toLocaleDateString()}</p>
                      </div>
                      {day.slots.length > 0 ? (
                        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                          Available
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-gray-200 text-gray-600 text-xs rounded-full font-medium">
                          Unavailable
                        </span>
                      )}
                    </div>
                    {day.slots.length > 0 && (
                      <div className="space-y-1">
                        {day.slots.map((slot, sidx) => (
                          <button
                            key={sidx}
                            className="w-full px-2.5 py-1.5 bg-white border border-green-300 hover:bg-green-100 rounded text-xs text-left text-gray-700 transition-colors"
                          >
                            {slot}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <button
                onClick={() => {
                  setShowAvailabilityModal(false);
                  // Proceed to booking
                }}
                className="w-full bg-gradient-to-r from-blue-600 to-teal-500 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-teal-600 transition-all"
              >
                Select Dates & Book
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Specific Shift Request Modal */}
      {showSpecificShiftModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4">
          <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-teal-500 px-4 py-4 flex items-center justify-between rounded-t-2xl">
              <h3 className="text-white font-bold text-lg">Request Specific Shift</h3>
              <button
                onClick={() => setShowSpecificShiftModal(false)}
                className="text-white hover:bg-white/20 rounded-full p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm font-semibold text-blue-900 mb-1">
                  {mockProfile.firstName} {mockProfile.lastName}
                </p>
                <p className="text-xs text-blue-700">
                  Send a booking request for your specific shift
                </p>
              </div>

              <form className="space-y-4">
                {/* Shift Details */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Shift Date *</label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Shift Type *</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent">
                    <option value="">Select shift type...</option>
                    <option value="early">Early (07:30-15:30)</option>
                    <option value="late">Late (13:00-21:00)</option>
                    <option value="night">Night (20:00-08:00)</option>
                    <option value="long-day">Long Day (07:30-20:00)</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Start Time *</label>
                    <input
                      type="time"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">End Time *</label>
                    <input
                      type="time"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Hospital/Location *</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent">
                    <option value="">Select location...</option>
                    {mockProfile.willingToWorkAt.map((hospital, idx) => (
                      <option key={idx} value={hospital}>{hospital}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Department *</label>
                  <input
                    type="text"
                    placeholder="e.g., Main Theatres, DSU"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Specialty Required</label>
                  <input
                    type="text"
                    placeholder="e.g., Orthopaedics, General Surgery"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  />
                </div>

                {/* Rate */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Offered Rate (£/hr) *</label>
                  <input
                    type="number"
                    step="0.50"
                    min={mockProfile.preferences.minRate}
                    placeholder={`Minimum: £${mockProfile.preferences.minRate}`}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">Staff minimum rate: £{mockProfile.preferences.minRate}/hr</p>
                </div>

                {/* Additional Info */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Additional Information</label>
                  <textarea
                    rows={3}
                    placeholder="Any specific requirements or notes..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent resize-none"
                  />
                </div>

                {/* Actions */}
                <div className="flex space-x-3 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setShowSpecificShiftModal(false)}
                    className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-teal-500 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-teal-600 transition-all"
                  >
                    Send Request
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Multiple Bookings Modal */}
      {showMultipleBookingsModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4">
          <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-teal-500 px-4 py-4 flex items-center justify-between rounded-t-2xl">
              <h3 className="text-white font-bold text-lg">Multiple Bookings</h3>
              <button
                onClick={() => setShowMultipleBookingsModal(false)}
                className="text-white hover:bg-white/20 rounded-full p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                <p className="text-sm font-semibold text-purple-900 mb-1">
                  {mockProfile.firstName} {mockProfile.lastName}
                </p>
                <p className="text-xs text-purple-700">
                  Book for multiple dates or set up recurring shifts
                </p>
              </div>

              <form className="space-y-4">
                {/* Booking Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Booking Type *</label>
                  <div className="space-y-2">
                    <label className="flex items-center p-3 border-2 border-gray-200 rounded-lg hover:border-purple-600 cursor-pointer transition-all">
                      <input type="radio" name="booking-type" value="multiple" className="mr-3" defaultChecked />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Multiple Specific Dates</p>
                        <p className="text-xs text-gray-600">Select individual dates for booking</p>
                      </div>
                    </label>
                    <label className="flex items-center p-3 border-2 border-gray-200 rounded-lg hover:border-purple-600 cursor-pointer transition-all">
                      <input type="radio" name="booking-type" value="recurring" className="mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Recurring Shifts</p>
                        <p className="text-xs text-gray-600">Set up a recurring schedule (e.g., every Monday)</p>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Date Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date Range *</label>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">From</label>
                      <input
                        type="date"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">To</label>
                      <input
                        type="date"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Days of Week (for recurring) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select Days</label>
                  <div className="grid grid-cols-4 gap-2">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                      <label key={day} className="flex items-center justify-center p-2 border-2 border-gray-200 rounded-lg hover:border-purple-600 cursor-pointer transition-all">
                        <input type="checkbox" className="mr-2" />
                        <span className="text-xs font-medium">{day}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Shift Details */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Shift Type *</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent">
                    <option value="">Select shift type...</option>
                    <option value="early">Early (07:30-15:30)</option>
                    <option value="late">Late (13:00-21:00)</option>
                    <option value="night">Night (20:00-08:00)</option>
                    <option value="long-day">Long Day (07:30-20:00)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Hospital/Location *</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent">
                    <option value="">Select location...</option>
                    {mockProfile.willingToWorkAt.map((hospital, idx) => (
                      <option key={idx} value={hospital}>{hospital}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Offered Rate (£/hr) *</label>
                  <input
                    type="number"
                    step="0.50"
                    min={mockProfile.preferences.minRate}
                    placeholder={`Minimum: £${mockProfile.preferences.minRate}`}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                    required
                  />
                </div>

                {/* Summary */}
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                  <p className="text-xs font-semibold text-purple-900 mb-2">Booking Summary</p>
                  <p className="text-xs text-purple-700">
                    You're about to book multiple shifts. The staff member will receive a request and can accept or decline based on their availability.
                  </p>
                </div>

                {/* Actions */}
                <div className="flex space-x-3 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setShowMultipleBookingsModal(false)}
                    className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-pink-600 transition-all"
                  >
                    Send Requests
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Competency Node Component
interface CompetencyNodeProps {
  node: any;
  path: string;
  level: number;
  expandedNodes: Set<string>;
  toggleNode: (path: string) => void;
}

function CompetencyNode({ node, path, level, expandedNodes, toggleNode }: CompetencyNodeProps) {
  const isExpanded = expandedNodes.has(path);
  const hasChildren = node.subcategories && node.subcategories.length > 0;
  const hasItems = node.items && node.items.length > 0;
  const isTerminal = hasItems;

  const bgClass = level === 0 ? 'bg-gray-50' : level === 1 ? 'bg-white' : 'bg-gray-50';

  return (
    <div>
      <button
        onClick={() => toggleNode(path)}
        className={`w-full px-3 py-2 rounded flex items-center justify-between text-left ${bgClass} hover:bg-gray-100 transition-colors`}
      >
        <div className="flex items-center space-x-2">
          <ChevronDown
            className={`w-4 h-4 text-gray-500 transition-transform ${
              isExpanded ? '' : '-rotate-90'
            }`}
          />
          <span className={`${level === 0 ? 'font-semibold text-gray-900' : 'text-sm text-gray-700'}`}>
            {node.name}
          </span>
        </div>
        {hasItems && (
          <span className="text-xs text-gray-500 bg-white border border-gray-200 px-2 py-0.5 rounded-full">
            {node.items.length}
          </span>
        )}
      </button>
      {isExpanded && hasChildren && (
        <div className="ml-4 mt-1 space-y-1">
          {node.subcategories.map((child: any, idx: number) => (
            <CompetencyNode
              key={idx}
              node={child}
              path={`${path}.${child.name}`}
              level={level + 1}
              expandedNodes={expandedNodes}
              toggleNode={toggleNode}
            />
          ))}
        </div>
      )}
      {isExpanded && hasItems && (
        <div className="ml-4 mt-1 space-y-1">
          {node.items.map((item: any, idx: number) => (
            <div key={idx} className="px-3 py-2 bg-white border border-gray-200 rounded text-sm">
              <div className="flex items-start justify-between">
                <span className="text-gray-900">{item.name}</span>
                {item.level && (
                  <span className={`text-xs px-2 py-0.5 rounded ${
                    item.level === 'expert' ? 'bg-blue-100 text-blue-700' :
                    item.level === 'certified' ? 'bg-green-100 text-green-700' :
                    item.level === 'advanced' ? 'bg-teal-100 text-teal-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {item.level}
                  </span>
                )}
              </div>
              {item.expiry && (
                <p className="text-xs text-gray-500 mt-1">Expires: {new Date(item.expiry).toLocaleDateString()}</p>
              )}
              {item.description && (
                <p className="text-xs text-gray-600 mt-1">{item.description}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Specialty Node Component
interface SpecialtyNodeProps {
  node: any;
  path: string;
  level: number;
  expandedNodes: Set<string>;
  toggleNode: (path: string) => void;
  setSelectedProcedure: (proc: any) => void;
}

function SpecialtyNode({ node, path, level, expandedNodes, toggleNode, setSelectedProcedure }: SpecialtyNodeProps) {
  const isExpanded = expandedNodes.has(path);
  const hasSubcategories = node.subcategories && node.subcategories.length > 0;
  const hasProcedures = node.procedures && node.procedures.length > 0;

  const bgClass = level === 0 ? 'bg-gray-50' : level === 1 ? 'bg-white' : 'bg-gray-50';

  return (
    <div>
      <button
        onClick={() => toggleNode(path)}
        className={`w-full px-3 py-2 rounded flex items-center justify-between text-left ${bgClass} hover:bg-gray-100 transition-colors`}
      >
        <div className="flex items-center space-x-2">
          <ChevronDown
            className={`w-4 h-4 text-gray-500 transition-transform ${
              isExpanded ? '' : '-rotate-90'
            }`}
          />
          <span className={`${level === 0 ? 'font-semibold text-gray-900' : 'text-sm text-gray-700'}`}>
            {node.name}
          </span>
        </div>
      </button>
      {isExpanded && hasSubcategories && (
        <div className="ml-4 mt-1 space-y-1">
          {node.subcategories.map((child: any, idx: number) => (
            <SpecialtyNode
              key={idx}
              node={child}
              path={`${path}.${child.name}`}
              level={level + 1}
              expandedNodes={expandedNodes}
              toggleNode={toggleNode}
              setSelectedProcedure={setSelectedProcedure}
            />
          ))}
        </div>
      )}
      {isExpanded && hasProcedures && (
        <div className="ml-4 mt-1 flex flex-wrap gap-1.5">
          {node.procedures.map((proc: string, idx: number) => (
            <button
              key={idx}
              onClick={() => setSelectedProcedure({ name: proc, specialty: path })}
              className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded hover:bg-blue-100 transition-colors"
            >
              {proc}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
