import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from '../entities/user.entity';
import { Specialization } from '../entities/specialization.entity';
import { Doctor } from '../entities/doctor.entity';

@Injectable()
export class SeedService implements OnModuleInit {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Specialization)
    private specializationRepository: Repository<Specialization>,
    @InjectRepository(Doctor)
    private doctorRepository: Repository<Doctor>,
  ) {}

  async onModuleInit() {
    await this.seedData();
  }

  async seedData() {
    // Check if data already exists
    const doctorCount = await this.doctorRepository.count();
    if (doctorCount > 0) {
      console.log('Database already seeded, skipping...');
      return;
    }

    console.log('Seeding database with real doctor data...');

    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const admin = this.userRepository.create({
      email: 'admin@doctorfinder.com',
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: UserRole.ADMIN,
    });
    await this.userRepository.save(admin);

    // Create test user
    const userPassword = await bcrypt.hash('user123', 10);
    const testUser = this.userRepository.create({
      email: 'user@test.com',
      password: userPassword,
      firstName: 'John',
      lastName: 'Doe',
      phone: '+92-300-1234567',
    });
    await this.userRepository.save(testUser);

    // Create specializations
    const specializationsData = [
      { name: 'Urologist', description: 'Urinary tract and male reproductive system specialists', icon: '🫀' },
      { name: 'Gastroenterologist', description: 'Digestive system and gastrointestinal tract specialists', icon: '🫃' },
      { name: 'Pediatrician', description: 'Child health and development specialists', icon: '👶' },
      { name: 'Neonatologist', description: 'Newborn infant care specialists', icon: '🍼' },
      { name: 'Gynecologist', description: 'Women\'s reproductive health specialists', icon: '👩‍⚕️' },
      { name: 'Obstetrician', description: 'Pregnancy and childbirth specialists', icon: '🤰' },
      { name: 'Neuro Surgeon', description: 'Brain and nervous system surgery specialists', icon: '🧠' },
      { name: 'Aesthetic Physician', description: 'Cosmetic and aesthetic medicine specialists', icon: '✨' },
      { name: 'Audiologist', description: 'Hearing and balance disorder specialists', icon: '👂' },
      { name: 'Cardiologist', description: 'Heart and cardiovascular system specialists', icon: '❤️' },
      { name: 'Dentist', description: 'Oral and dental health specialists', icon: '🦷' },
      { name: 'ENT Specialist', description: 'Ear, nose, and throat specialists', icon: '👃' },
      { name: 'Eye Specialist', description: 'Vision and eye care specialists', icon: '👁️' },
      { name: 'Eye Surgeon', description: 'Ophthalmic surgery specialists', icon: '👁️' },
      { name: 'General Surgeon', description: 'General surgical procedures specialists', icon: '🏥' },
      { name: 'Internal Medicine Specialist', description: 'Adult disease prevention and treatment specialists', icon: '💊' },
      { name: 'Medical Specialist', description: 'General medical care specialists', icon: '🩺' },
      { name: 'Neurologist', description: 'Brain and nervous system specialists', icon: '🧠' },
      { name: 'Nutritionist', description: 'Diet and nutrition specialists', icon: '🥗' },
      { name: 'Orthopedic Surgeon', description: 'Bone, joint, and muscle surgery specialists', icon: '🦴' },
      { name: 'Pediatric Surgeon', description: 'Children\'s surgical care specialists', icon: '👶' },
      { name: 'Physiotherapist', description: 'Physical therapy and rehabilitation specialists', icon: '🏃' },
      { name: 'Plastic Surgeon', description: 'Reconstructive and cosmetic surgery specialists', icon: '✨' },
      { name: 'Pulmonologist', description: 'Lung and respiratory system specialists', icon: '🫁' },
      { name: 'Sonologist', description: 'Ultrasound and imaging specialists', icon: '📊' },
      { name: 'Speech Therapist', description: 'Speech and language disorder specialists', icon: '🗣️' },
      { name: 'Psychologist', description: 'Mental health and behavioral specialists', icon: '🧘' },
      { name: 'General Physician', description: 'Primary care and family medicine specialists', icon: '👨‍⚕️' },
      { name: 'Pain Specialist', description: 'Pain management specialists', icon: '💉' },
      { name: 'Radiologist', description: 'Medical imaging specialists', icon: '📷' },
      { name: 'Dermatologist', description: 'Skin, hair, and nail specialists', icon: '🧴' },
      { name: 'Vascular Surgeon', description: 'Blood vessel surgery specialists', icon: '🩸' },
      { name: 'Nuclear Medicine Specialist', description: 'Nuclear imaging and therapy specialists', icon: '☢️' },
      { name: 'Sexologist', description: 'Sexual health specialists', icon: '💑' },
      { name: 'Andrologist', description: 'Male reproductive health specialists', icon: '👨' },
      { name: 'Oral and Maxillofacial Surgeon', description: 'Jaw and facial surgery specialists', icon: '🦷' },
    ];

    const specializations: Map<string, Specialization> = new Map();
    for (const specData of specializationsData) {
      const spec = this.specializationRepository.create(specData);
      const savedSpec = await this.specializationRepository.save(spec);
      specializations.set(specData.name.toLowerCase(), savedSpec);
    }

    // Real doctors data from CSV
    const doctorsData = [
      { name: 'Dr. Khalil Ahmad', qualification: 'MBBS, FCPS', specialization: 'Urologist', experience: 16, featured: true },
      { name: 'Dr. Asad Jalil Ul Islam', qualification: 'MBBS, Ms. Urology', specialization: 'Urologist', experience: 5 },
      { name: 'Dr. Hafiz Irfan Mushtaq', qualification: 'MBBS, FCPS', specialization: 'Gastroenterologist', experience: 8, featured: true },
      { name: 'Dr. Asim Noor Cheema', qualification: 'MBBS, DCH, PGPN FCPS', specialization: 'Pediatrician', experience: 17, featured: true },
      { name: 'Dr. Muhammad Naveed Ashraf', qualification: 'M.B.B.S, M.D (Pediatrics), P.G.P.N (BOSTON)', specialization: 'Pediatrician', experience: 9 },
      { name: 'Dr. Nazia Zaib', qualification: 'MBBS, FCPS', specialization: 'Pediatrician', experience: 10 },
      { name: 'Assoc. Prof. Dr. Iram Munawar', qualification: 'MBBS, FCPS (Obstetrics & Gynecology)', specialization: 'Gynecologist', experience: 28, featured: true },
      { name: 'Dr. Sidra Haq', qualification: 'MBBS, FCPS', specialization: 'Gynecologist', experience: 18 },
      { name: 'Dr. Hina Toufeeq', qualification: 'MBBS, FCPS', specialization: 'Gynecologist', experience: 6 },
      { name: 'Dr. Farida Sumbul', qualification: 'MBBS, MCPS (Gynecology & Obstetrics)', specialization: 'Gynecologist', experience: 20, featured: true },
      { name: 'Dr. Hina Mukkaram', qualification: 'MBBS, MCPS (Gynecology & Obstetrics)', specialization: 'Gynecologist', experience: 14 },
      { name: 'Dr. Shazia Noor', qualification: 'MBBS, MCPS (Gynecology & Obstetrics)', specialization: 'Gynecologist', experience: 3 },
      { name: 'Dr. Munaza Malik', qualification: 'MBBS, FCPS', specialization: 'Gynecologist', experience: 10 },
      { name: 'Dr. Fariha Arshad', qualification: 'MBBS, FCPS', specialization: 'Gynecologist', experience: 8 },
      { name: 'Dr. Sara Khan Niazi', qualification: 'MBBS, FCPS, DIPLOMA IN COSMETIC GYNAECOLOGY', specialization: 'Gynecologist', experience: 17 },
      { name: 'Dr. Nauman Hasan', qualification: 'MBBS MS Neurosurgery', specialization: 'Neuro Surgeon', experience: 9, featured: true },
      { name: 'Dr. Mariam Asim', qualification: 'MBBS, CONSULTANT AESTHETIC PHYSICIAN', specialization: 'Aesthetic Physician', experience: 10 },
      { name: 'Mr. Daniel Akhtar', qualification: 'Bachelor of Science in Audiology', specialization: 'Audiologist', experience: 6 },
      { name: 'Dr. M. Shahid Iqbal', qualification: 'MBBS, FCPS', specialization: 'Cardiologist', experience: 17, featured: true },
      { name: 'Dr. Muhammad Wasim Ashraf', qualification: 'MBBS, FCPS Cardiology', specialization: 'Cardiologist', experience: 13 },
      { name: 'Dr. Saira Tariq', qualification: 'MBBS, FCPS', specialization: 'Dentist', experience: 7 },
      { name: 'Dr. Daud Anthony', qualification: 'BDS, M PHILL, CHPE, PHDs', specialization: 'Dentist', experience: 15, featured: true },
      { name: 'Dr. Maruf Christopher', qualification: 'BDS, M PHILL (GOLD MEDALIST)', specialization: 'Dentist', experience: 16 },
      { name: 'Dr. Syed Qasim Ali Jaffery', qualification: 'BSC, MBBS, FCPS', specialization: 'Dentist', experience: 12 },
      { name: 'Dr. Maqsood Ahmed', qualification: 'MBBS, FCPS, DLO', specialization: 'ENT Specialist', experience: 15 },
      { name: 'Dr. M. Owais Shareef', qualification: 'MBBS, FCPS', specialization: 'Eye Specialist', experience: 15, featured: true },
      { name: 'Dr. Iqbal Ahmed Chaudhary', qualification: 'MBBS, DOMS, FCPS', specialization: 'Eye Surgeon', experience: 8 },
      { name: 'Dr. Azhar Alam', qualification: 'MBBS, MS (General Surgery)', specialization: 'General Surgeon', experience: 15 },
      { name: 'Prof. Dr. Tariq Mehmood', qualification: 'MBBS, MS (General Surgery)', specialization: 'General Surgeon', experience: 9 },
      { name: 'Asst. Prof. Dr. Muhammad Hassan Taqi', qualification: 'MBBS, FCPS', specialization: 'General Surgeon', experience: 13 },
      { name: 'Dr. Waqas Farooq Vohra', qualification: 'MBBS, FCPS Medicine', specialization: 'Internal Medicine Specialist', experience: 22, featured: true },
      { name: 'Dr. Najam Us Saqib', qualification: 'MBBS, MRCGP (International), FACC, CCK', specialization: 'Medical Specialist', experience: 18 },
      { name: 'Dr. Muhammad Mubeen Akhtar', qualification: 'MBBS., FCPS (Medicine), MRCP (UK)', specialization: 'Medical Specialist', experience: 10 },
      { name: 'Dr. Muhammad Maqsood', qualification: 'MBBS, FCPS', specialization: 'Medical Specialist', experience: 17 },
      { name: 'Dr. Rafaqat Shafique', qualification: 'MBBS, FCPS', specialization: 'Neurologist', experience: 3 },
      { name: 'Ms. Zartasha Khalid', qualification: 'BS(HONS), M PHILL', specialization: 'Nutritionist', experience: 7 },
      { name: 'Dr. Muhammad Tasneem Warsi', qualification: 'MBBS, MS ORTHOPAEDIC SURGEON', specialization: 'Orthopedic Surgeon', experience: 17, featured: true },
      { name: 'Asst. Prof. Dr. Asif Iqbal', qualification: 'M.B.B.S, M.S (Pediatric Surgery)', specialization: 'Pediatric Surgeon', experience: 10 },
      { name: 'Dr. Fareeda Bibi', qualification: 'MBBS, FCPS', specialization: 'Physiotherapist', experience: 5 },
      { name: 'Dr. Iqra Bashir', qualification: 'MBBS, FCPS', specialization: 'Physiotherapist', experience: 6 },
      { name: 'Dr. Fatima Saleem', qualification: 'DPT', specialization: 'Physiotherapist', experience: 8 },
      { name: 'Dr. Sana Imdad', qualification: 'MBBS, DUHS, FCPS', specialization: 'Plastic Surgeon', experience: 13, featured: true },
      { name: 'Dr. Kashif Butt', qualification: 'MBBS, FCPS', specialization: 'Pulmonologist', experience: 6 },
      { name: 'Dr. Shabana Shaikh', qualification: 'MBBS', specialization: 'Sonologist', experience: 2 },
      { name: 'Dr. Saadia Rizvi', qualification: 'MBBS', specialization: 'Sonologist', experience: 4 },
      { name: 'Mr. Naveed Ahmed Aftab Bhutta', qualification: 'MS Pathology, Certified Audiologist & Audiometric, M.A Spl Edu', specialization: 'Speech Therapist', experience: 5 },
      { name: 'Asst. Prof. Dr. Bushra Shahid', qualification: 'MBBS, FCPS (Medicine)', specialization: 'Internal Medicine Specialist', experience: 31, featured: true },
      { name: 'Prof. Dr. Nasir Raza Awan', qualification: 'MBBS, FCPS (Neuro Surgery)', specialization: 'Neuro Surgeon', experience: 28, featured: true },
      { name: 'Dr. Sadaf Awan', qualification: 'DPT', specialization: 'Physiotherapist', experience: 8 },
      { name: 'Maryam Adil', qualification: 'BS (Hons) Food and Nutrition, Diploma in Clinical Nutrition', specialization: 'Nutritionist', experience: 4 },
      { name: 'Dr. M Shamoos Saqib', qualification: 'DPT', specialization: 'Physiotherapist', experience: 5 },
      { name: 'Dr. Nageen Zahra', qualification: 'DPT', specialization: 'Physiotherapist', experience: 7 },
      { name: 'Dr. Ahmed Sultan', qualification: 'MBBS, FCPS (Neuro Surgery)', specialization: 'Neuro Surgeon', experience: 8 },
      { name: 'Ms. Fakeeha Maryam', qualification: 'PGD Health Nutrition, M.Phil Nutrition, BS Food & Nutrition', specialization: 'Nutritionist', experience: 10 },
      { name: 'Salman Riaz', qualification: 'MS Clinical Psychology, (ADCP), Dip. MD (Alternative Medicines)', specialization: 'Psychologist', experience: 8 },
      { name: 'Dr. Atif Ashraf', qualification: 'MBBS, FCPS (Paeds)', specialization: 'Pediatrician', experience: 11 },
      { name: 'Usman Shakir', qualification: 'DPT, MSPT(Neurology)', specialization: 'Physiotherapist', experience: 5 },
      { name: 'Dr. Neelum Maqsood', qualification: 'MBBS, MCPS (Gynecology & Obstetrics)', specialization: 'Gynecologist', experience: 10 },
      { name: 'Dr. Zuha Fatima', qualification: 'DPT', specialization: 'Physiotherapist', experience: 2 },
      { name: 'Dr. Aqeel Asghar', qualification: 'MBBS, FCPS Cardiology', specialization: 'Cardiologist', experience: 6 },
      { name: 'Dr. Hamza Riaz', qualification: 'MBBS, FCPS', specialization: 'General Physician', experience: 8 },
      { name: 'Dr. Waqas Ashraf', qualification: 'MBBS, MD (USA) - Medicine, MSc Pain Management', specialization: 'Pain Specialist', experience: 13 },
      { name: 'Dr. M. Faizan Hamid', qualification: 'DPT, MS-CPPT', specialization: 'Physiotherapist', experience: 15 },
      { name: 'Dr. Faryal Safdar', qualification: 'DPT', specialization: 'Physiotherapist', experience: 4 },
      { name: 'Dr. Haseeb Aslam', qualification: 'MBBS', specialization: 'Medical Specialist', experience: 8 },
      { name: 'Dr. Azka Farooqi', qualification: 'DPT, MS-WHPT', specialization: 'Physiotherapist', experience: 4 },
      { name: 'Dr. Aniza Khalid', qualification: 'MSPT, D.P.T (Doctor Of Physical Therapy)', specialization: 'Physiotherapist', experience: 10 },
      { name: 'Dr. Sarah Hafeez', qualification: 'M.B.B.S, F.C.P.S.', specialization: 'Gynecologist', experience: 10 },
      { name: 'Dr. Muhammad Asif Ishaq', qualification: 'MBBS, FCPS(Medicine), BS Cardiology', specialization: 'Cardiologist', experience: 8 },
      { name: 'Dr. Haseeb Manzoor', qualification: 'MBBS, FCPS I (Diagnostic Radiology)', specialization: 'Radiologist', experience: 7 },
      { name: 'Prof. Dr. Samina Jahangir', qualification: 'MD (USA), Vitreretinal Surgery (USA), Oculoplastic Surgery (USA)', specialization: 'Eye Surgeon', experience: 19, featured: true },
      { name: 'Dr. Seemal Samreen', qualification: 'MBBS, FCPS (Gynaecology & Obstetrics)', specialization: 'Gynecologist', experience: 13 },
      { name: 'Dr. Sadia Malik', qualification: 'MBBS, MCPS', specialization: 'Medical Specialist', experience: 18 },
      { name: 'Dr. Sasul Laghari', qualification: 'MBBS', specialization: 'General Physician', experience: 1 },
      { name: 'Asst. Prof. Dr. Shahzad Hussain', qualification: 'BDS, FCPS, C-Implants', specialization: 'Oral and Maxillofacial Surgeon', experience: 10 },
      { name: 'Dr. Tabinda Nasir', qualification: 'BDS, FCPS (Orthodontics)', specialization: 'Dentist', experience: 5 },
      { name: 'Dr. Waqas Ahmad', qualification: 'MBBS, FCPS (Pediatrics)', specialization: 'Pediatrician', experience: 12 },
      { name: 'Dr. Muqaddus Shareef', qualification: 'DPT', specialization: 'Physiotherapist', experience: 2 },
      { name: 'Dr. Farrukh Masood', qualification: 'MBBS, FCPS (Cardiology)', specialization: 'Cardiologist', experience: 5 },
      { name: 'Dr. Ghulam Mujtaba', qualification: 'MBBS, FCPS (Dermatology)', specialization: 'Dermatologist', experience: 30, featured: true },
      { name: 'Asst. Prof. Dr. Muhammad Waqas Khan', qualification: 'MBBS, MCPS (General Surgery), FCPS (Urology), FRCS (Urology)', specialization: 'Urologist', experience: 14 },
      { name: 'Asst. Prof. Dr. Muhammad Hassan Nisar', qualification: 'MBBS, FCPS (ENT)', specialization: 'ENT Specialist', experience: 17, featured: true },
      { name: 'Dr. Aamir Javid', qualification: 'MBBS, FCPS (General Surgery), FCPS (Vascular Surgery)', specialization: 'Vascular Surgeon', experience: 16, featured: true },
      { name: 'Prof. Dr. M Saeed Akhtar', qualification: 'MBBS, MSC, PHD Nuclear Medicine', specialization: 'Nuclear Medicine Specialist', experience: 30, featured: true },
      { name: 'Dr. Israr Ahmad', qualification: 'MBBS, FCPS (Orthopedic Surgery), Fellowship (Trauma & Orthopedics)', specialization: 'Orthopedic Surgeon', experience: 12 },
      { name: 'Asst. Prof. Dr. Bushra Ghulam', qualification: 'MBBS, FCPS (General Surgery), CHPE and ATLS', specialization: 'General Surgeon', experience: 9 },
      { name: 'Dr. Usman Fawad', qualification: 'MBBS, FCPS', specialization: 'Pediatrician', experience: 11 },
      { name: 'Dr. Hammad Riaz Khan', qualification: 'MBBS, FCPS Paediatric', specialization: 'Pediatrician', experience: 18 },
      { name: 'Dr. Movahid Anwer', qualification: 'MBBS, FCPS (General Surgery)', specialization: 'General Surgeon', experience: 10 },
      { name: 'Asst. Prof. Dr. Kalsoom Jawaid', qualification: 'MBBS, FCPS', specialization: 'Dermatologist', experience: 12 },
      { name: 'Maryam Zubair', qualification: 'DPT', specialization: 'Physiotherapist', experience: 3 },
      { name: 'Dr. Usama Ali', qualification: 'MBBS, MS (Pediatric Surgery)', specialization: 'Pediatric Surgeon', experience: 10 },
    ];

    const cities = ['Lahore', 'Karachi', 'Islamabad', 'Rawalpindi', 'Faisalabad', 'Multan'];
    const hospitals = [
      'City Hospital', 'National Medical Center', 'Prime Healthcare', 
      'Medicare Hospital', 'HealthPlus Clinic', 'Care Medical Center',
      'Allied Hospital', 'General Hospital', 'Family Health Clinic'
    ];

    for (let i = 0; i < doctorsData.length; i++) {
      const doc = doctorsData[i];
      const nameParts = doc.name.replace(/^(Dr\.|Prof\.|Asst\. Prof\.|Assoc\. Prof\.|Mr\.|Ms\.)\s*/i, '').trim().split(' ');
      const firstName = nameParts[0] || 'Doctor';
      const lastName = nameParts.slice(1).join(' ') || 'Unknown';
      
      const specName = doc.specialization.toLowerCase();
      let specialization = specializations.get(specName);
      
      // Try to find a matching specialization
      if (!specialization) {
        for (const [key, value] of specializations.entries()) {
          if (specName.includes(key) || key.includes(specName)) {
            specialization = value;
            break;
          }
        }
      }
      
      // Default to Medical Specialist if no match found
      if (!specialization) {
        specialization = specializations.get('medical specialist');
      }

      const doctor = this.doctorRepository.create({
        firstName,
        lastName,
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase().replace(/\s+/g, '')}${i}@hospital.pk`,
        phone: `+92-${300 + Math.floor(Math.random() * 100)}-${1000000 + Math.floor(Math.random() * 9000000)}`,
        bio: `${doc.name} is a highly qualified ${doc.specialization} with ${doc.experience} years of experience. Qualification: ${doc.qualification}`,
        rating: Number((3.5 + Math.random() * 1.5).toFixed(1)),
        reviewCount: Math.floor(50 + Math.random() * 300),
        experience: doc.experience,
        education: doc.qualification,
        hospital: hospitals[Math.floor(Math.random() * hospitals.length)],
        address: `${Math.floor(Math.random() * 500) + 1} Medical Street`,
        city: cities[Math.floor(Math.random() * cities.length)],
        consultationFee: Math.round((1500 + Math.random() * 3500) / 500) * 500,
        languages: ['English', 'Urdu'],
        availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        availableTimeStart: '09:00',
        availableTimeEnd: '17:00',
        isActive: true,
        isFeatured: doc.featured || false,
        specialization: specialization,
      });
      
      await this.doctorRepository.save(doctor);
    }

    console.log('Database seeded successfully with 99 real doctors!');
    console.log('Admin login: admin@doctorfinder.com / admin123');
    console.log('Test user login: user@test.com / user123');
  }
}
