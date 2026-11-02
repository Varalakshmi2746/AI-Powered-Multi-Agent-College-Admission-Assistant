import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { connectDB, disconnectDB } from '../config/db.js';
import User from '../models/User.js';
import Student from '../models/Student.js';
import College from '../models/College.js';
import Course from '../models/Course.js';
import AdmissionCriteria from '../models/AdmissionCriteria.js';
import FeeDetails from '../models/FeeDetails.js';
import Application from '../models/Application.js';

dotenv.config();

export const collegesData = [
  {
    name: 'Andhra University College of Engineering (Autonomous), Visakhapatnam',
    code: 'AUCE',
    type: 'State University / Govt',
    city: 'Visakhapatnam',
    district: 'Visakhapatnam',
    state: 'Andhra Pradesh',
    establishedYear: 1946,
    nirfRank: 'Rank 43 (University)',
    naacGrade: 'A++',
    nbaAccredited: true,
    website: 'https://andhrauniversity.edu.in',
    counsellingCode: 'AUCE',
    contactEmail: 'principal.engg@andhrauniversity.edu.in',
    contactPhone: '+91-891-2844111',
    facilities: [
      'Central Digital Library with IEEE Access',
      'High-Performance Supercomputing Cluster',
      'Separate AC & Non-AC Hostels for Boys & Girls',
      'ATAL Incubation Center & Startup Hub',
      'Olympic-standard Sports Complex & Gymnasium',
      'On-Campus Bank, ATM & Healthcare Center',
    ],
    placementStats: {
      highestPackageLPA: 38.0,
      averagePackageLPA: 7.8,
      placementRatePercent: 91,
      topRecruiters: ['Microsoft', 'Amazon', 'TCS Digital', 'Infosys', 'L&T', 'Wipro Turbo'],
    },
    imageUrl: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=800&q=80',
    fee: {
      tuitionFeePerYear: 45000,
      hostelFeePerYear: 38000,
      messFeePerYear: 34000,
      otherFeePerYear: 8000,
      scholarshipAvailable: true,
      govtFeeReimbursementEligible: true,
      scholarshipDetails: 'Jagananna Vidya Deevena (JVD) 100% tuition support for eligible categories; AICTE Pragati Scholarships.',
    },
    courses: [
      { branchName: 'Computer Science and Engineering', branchCode: 'CSE', seats: 120, cutoffs: { OC: 2200, BCA: 3800, BCB: 3400, BCC: 4500, BCD: 3100, BCE: 4000, SC: 9500, ST: 14000, EWS: 2400 } },
      { branchName: 'Artificial Intelligence and Data Science', branchCode: 'AIDS', seats: 60, cutoffs: { OC: 3100, BCA: 5200, BCB: 4800, BCC: 6000, BCD: 4400, BCE: 5500, SC: 12000, ST: 18000, EWS: 3300 } },
      { branchName: 'Electronics and Communication Engineering', branchCode: 'ECE', seats: 120, cutoffs: { OC: 4800, BCA: 7500, BCB: 6900, BCC: 8500, BCD: 6500, BCE: 7800, SC: 17500, ST: 24000, EWS: 5100 } },
      { branchName: 'Information Technology', branchCode: 'IT', seats: 60, cutoffs: { OC: 3900, BCA: 6400, BCB: 5900, BCC: 7200, BCD: 5600, BCE: 6800, SC: 15000, ST: 21000, EWS: 4200 } },
      { branchName: 'Electrical and Electronics Engineering', branchCode: 'EEE', seats: 90, cutoffs: { OC: 7800, BCA: 11000, BCB: 10200, BCC: 12500, BCD: 9800, BCE: 11500, SC: 24000, ST: 32000, EWS: 8300 } },
      { branchName: 'Mechanical Engineering', branchCode: 'MECH', seats: 120, cutoffs: { OC: 11500, BCA: 16000, BCB: 15200, BCC: 18000, BCD: 14800, BCE: 17000, SC: 31000, ST: 42000, EWS: 12500 } },
    ],
  },
  {
    name: 'JNTU College of Engineering (Autonomous), Kakinada',
    code: 'JNTK',
    type: 'State University / Govt',
    city: 'Kakinada',
    district: 'Kakinada',
    state: 'Andhra Pradesh',
    establishedYear: 1946,
    nirfRank: 'Rank 78 (Engineering Band)',
    naacGrade: 'A+',
    nbaAccredited: true,
    website: 'https://jntucek.ac.in',
    counsellingCode: 'JNTK',
    contactEmail: 'principal_jntucek@yahoo.com',
    contactPhone: '+91-884-2300823',
    facilities: [
      'Historic 110-acre Green Campus',
      'Central Computing Facility with Gigabit Network',
      'Student Residential Hostels with RO Purified Water',
      'Innovation Hub & Robotics Research Lab',
      'Auditorium with 1500 Seating Capacity',
      'Indoor Badminton Courts & Cricket Ground',
    ],
    placementStats: {
      highestPackageLPA: 34.5,
      averagePackageLPA: 7.2,
      placementRatePercent: 89,
      topRecruiters: ['Cognizant', 'Accenture', 'TCS', 'Oracle', 'Hyundai Motors'],
    },
    imageUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=800&q=80',
    fee: {
      tuitionFeePerYear: 50000,
      hostelFeePerYear: 40000,
      messFeePerYear: 35000,
      otherFeePerYear: 7500,
      scholarshipAvailable: true,
      govtFeeReimbursementEligible: true,
      scholarshipDetails: 'JVD Eligible; National Merit Scholarship; University Merit-cum-Means waiver.',
    },
    courses: [
      { branchName: 'Computer Science and Engineering', branchCode: 'CSE', seats: 120, cutoffs: { OC: 3100, BCA: 4900, BCB: 4500, BCC: 5800, BCD: 4200, BCE: 5100, SC: 11500, ST: 16500, EWS: 3300 } },
      { branchName: 'Artificial Intelligence and Machine Learning', branchCode: 'AIML', seats: 60, cutoffs: { OC: 3800, BCA: 6100, BCB: 5600, BCC: 7000, BCD: 5200, BCE: 6300, SC: 13500, ST: 19500, EWS: 4000 } },
      { branchName: 'Electronics and Communication Engineering', branchCode: 'ECE', seats: 120, cutoffs: { OC: 5900, BCA: 8900, BCB: 8200, BCC: 9800, BCD: 7800, BCE: 9200, SC: 19500, ST: 27000, EWS: 6200 } },
      { branchName: 'Electrical and Electronics Engineering', branchCode: 'EEE', seats: 90, cutoffs: { OC: 8900, BCA: 12800, BCB: 11900, BCC: 14200, BCD: 11400, BCE: 13200, SC: 27500, ST: 36000, EWS: 9400 } },
      { branchName: 'Mechanical Engineering', branchCode: 'MECH', seats: 120, cutoffs: { OC: 13200, BCA: 18500, BCB: 17200, BCC: 20500, BCD: 16800, BCE: 19200, SC: 35000, ST: 47000, EWS: 14000 } },
    ],
  },
  {
    name: 'Sri Venkateswara University College of Engineering (SVUCE), Tirupati',
    code: 'SVUCE',
    type: 'State University / Govt',
    city: 'Tirupati',
    district: 'Tirupati',
    state: 'Andhra Pradesh',
    establishedYear: 1959,
    nirfRank: 'Rank 85 (University Band)',
    naacGrade: 'A+',
    nbaAccredited: true,
    website: 'https://svuce.edu.in',
    counsellingCode: 'SVUE',
    contactEmail: 'svuceprincipal@gmail.com',
    contactPhone: '+91-877-2289561',
    facilities: [
      'Scenic Foothills Campus with 200+ Acres',
      'Modern High-Bandwidth Laboratories',
      'Comprehensive University Library & Digital Archives',
      'Separate Hostels with Hygienic Dining Facility',
      'Sports Stadium, Gymnasium & Swimming Pool',
      'Medical Center with Round-the-clock Ambulance',
    ],
    placementStats: {
      highestPackageLPA: 31.0,
      averagePackageLPA: 6.9,
      placementRatePercent: 87,
      topRecruiters: ['Cognizant', 'Infosys', 'Capgemini', 'Zoho', 'Broadcom'],
    },
    imageUrl: 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?auto=format&fit=crop&w=800&q=80',
    fee: {
      tuitionFeePerYear: 48000,
      hostelFeePerYear: 39000,
      messFeePerYear: 33000,
      otherFeePerYear: 7000,
      scholarshipAvailable: true,
      govtFeeReimbursementEligible: true,
      scholarshipDetails: 'Full tuition fee reimbursement under JVD for eligible students.',
    },
    courses: [
      { branchName: 'Computer Science and Engineering', branchCode: 'CSE', seats: 120, cutoffs: { OC: 3600, BCA: 5600, BCB: 5100, BCC: 6600, BCD: 4800, BCE: 5900, SC: 12800, ST: 18000, EWS: 3800 } },
      { branchName: 'Electronics and Communication Engineering', branchCode: 'ECE', seats: 120, cutoffs: { OC: 6800, BCA: 9800, BCB: 9100, BCC: 11000, BCD: 8700, BCE: 10200, SC: 21000, ST: 29000, EWS: 7200 } },
      { branchName: 'Electrical and Electronics Engineering', branchCode: 'EEE', seats: 90, cutoffs: { OC: 9800, BCA: 14200, BCB: 13100, BCC: 15800, BCD: 12600, BCE: 14600, SC: 29500, ST: 39000, EWS: 10400 } },
      { branchName: 'Civil Engineering', branchCode: 'CIVIL', seats: 60, cutoffs: { OC: 18500, BCA: 26000, BCB: 24500, BCC: 29000, BCD: 23500, BCE: 27500, SC: 46000, ST: 58000, EWS: 19800 } },
    ],
  },
  {
    name: 'Velagapudi Ramakrishna Siddhartha Engineering College (Autonomous), Vijayawada',
    code: 'VRSEC',
    type: 'Autonomous Private',
    city: 'Vijayawada',
    district: 'NTR / Krishna',
    state: 'Andhra Pradesh',
    establishedYear: 1977,
    nirfRank: 'Rank 121 (Engineering)',
    naacGrade: 'A+',
    nbaAccredited: true,
    website: 'https://vrsiddhartha.ac.in',
    counsellingCode: 'VRSE',
    contactEmail: 'principal@vrsiddhartha.ac.in',
    contactPhone: '+91-866-2582333',
    facilities: [
      'Siemens Center of Excellence in Manufacturing & Automation',
      'Apple iOS Development Lab & Cisco Networking Academy',
      'Air-conditioned Central Auditorium and Seminar Halls',
      'Secured Campus Hostels with 24/7 Security & High-Speed Wi-Fi',
      'Dedicated Training and Placement Cell with Mock Interview Suites',
      'Sports complex with synthetic athletic tracks',
    ],
    placementStats: {
      highestPackageLPA: 44.0,
      averagePackageLPA: 6.8,
      placementRatePercent: 93,
      topRecruiters: ['Amazon', 'Cisco', 'Adobe', 'TCS Ninja & Digital', 'Capgemini', 'IBM'],
    },
    imageUrl: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=800&q=80',
    fee: {
      tuitionFeePerYear: 73000,
      hostelFeePerYear: 75000,
      messFeePerYear: 38000,
      otherFeePerYear: 12000,
      scholarshipAvailable: true,
      govtFeeReimbursementEligible: true,
      scholarshipDetails: 'JVD Full Reimbursement for convener quota; Siddhartha Foundation merit scholarships.',
    },
    courses: [
      { branchName: 'Computer Science and Engineering', branchCode: 'CSE', seats: 180, cutoffs: { OC: 5800, BCA: 8600, BCB: 7900, BCC: 9800, BCD: 7400, BCE: 8900, SC: 18500, ST: 26000, EWS: 6200 } },
      { branchName: 'Information Technology', branchCode: 'IT', seats: 120, cutoffs: { OC: 8200, BCA: 12000, BCB: 11000, BCC: 13500, BCD: 10500, BCE: 12500, SC: 24500, ST: 34000, EWS: 8800 } },
      { branchName: 'Artificial Intelligence and Data Science', branchCode: 'AIDS', seats: 120, cutoffs: { OC: 6900, BCA: 10200, BCB: 9500, BCC: 11800, BCD: 9000, BCE: 10800, SC: 21500, ST: 30000, EWS: 7400 } },
      { branchName: 'Electronics and Communication Engineering', branchCode: 'ECE', seats: 180, cutoffs: { OC: 11200, BCA: 16500, BCB: 15200, BCC: 18500, BCD: 14500, BCE: 17200, SC: 32000, ST: 44000, EWS: 12000 } },
    ],
  },
  {
    name: 'Gayatri Vidya Parishad College of Engineering (Autonomous), Visakhapatnam',
    code: 'GVPCE',
    type: 'Autonomous Private',
    city: 'Visakhapatnam',
    district: 'Visakhapatnam',
    state: 'Andhra Pradesh',
    establishedYear: 1996,
    nirfRank: 'Rank 128 (Engineering)',
    naacGrade: 'A',
    nbaAccredited: true,
    website: 'https://gvpce.ac.in',
    counsellingCode: 'GVPE',
    contactEmail: 'gvpce@yahoo.com',
    contactPhone: '+91-891-2739507',
    facilities: [
      'Picturesque Campus Surrounded by Valley Hills',
      'Advanced Robotics & AI Center of Excellence',
      'Smart Classrooms with Interactive Whiteboards',
      'Separate Boy & Girl Hostels with Solar Water Heaters',
      'Industry Incubator & Entrepreneurship Development Cell',
      'Well-equipped Gymnasium and Volleyball / Basketball Courts',
    ],
    placementStats: {
      highestPackageLPA: 41.5,
      averagePackageLPA: 6.4,
      placementRatePercent: 90,
      topRecruiters: ['Amazon', 'ServiceNow', 'Cognizant', 'Infosys', 'TCS Digital', 'Hexaware'],
    },
    imageUrl: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&w=800&q=80',
    fee: {
      tuitionFeePerYear: 72000,
      hostelFeePerYear: 70000,
      messFeePerYear: 36000,
      otherFeePerYear: 10000,
      scholarshipAvailable: true,
      govtFeeReimbursementEligible: true,
      scholarshipDetails: 'JVD Government reimbursement; GVP internal endowment scholarships for top rankers.',
    },
    courses: [
      { branchName: 'Computer Science and Engineering', branchCode: 'CSE', seats: 180, cutoffs: { OC: 6400, BCA: 9400, BCB: 8700, BCC: 10600, BCD: 8200, BCE: 9800, SC: 20000, ST: 28000, EWS: 6900 } },
      { branchName: 'Information Technology', branchCode: 'IT', seats: 120, cutoffs: { OC: 9200, BCA: 13500, BCB: 12400, BCC: 15000, BCD: 11900, BCE: 14000, SC: 27000, ST: 37000, EWS: 9800 } },
      { branchName: 'Electronics and Communication Engineering', branchCode: 'ECE', seats: 180, cutoffs: { OC: 12500, BCA: 18000, BCB: 16800, BCC: 20200, BCD: 16000, BCE: 18800, SC: 35000, ST: 48000, EWS: 13400 } },
      { branchName: 'Artificial Intelligence and Machine Learning', branchCode: 'AIML', seats: 60, cutoffs: { OC: 7500, BCA: 11000, BCB: 10200, BCC: 12500, BCD: 9700, BCE: 11600, SC: 23000, ST: 32000, EWS: 8100 } },
    ],
  },
  {
    name: 'RVR & JC College of Engineering (Autonomous), Guntur',
    code: 'RVRJC',
    type: 'Autonomous Private',
    city: 'Guntur',
    district: 'Guntur',
    state: 'Andhra Pradesh',
    establishedYear: 1985,
    nirfRank: 'Rank 151-200 Band',
    naacGrade: 'A+',
    nbaAccredited: true,
    website: 'https://rvrjc.ac.in',
    counsellingCode: 'RVRJ',
    contactEmail: 'rvrjcce@hotmail.com',
    contactPhone: '+91-863-2288201',
    facilities: [
      'Expansive 37-acre Serene Educational Campus',
      'Digital Library with over 1,20,000 Volumes',
      'In-house Hostels with Wi-Fi & Gymnasium',
      'Incubation & Skill Development Center',
      'Fleet of 80+ College Buses Connecting Guntur & Vijayawada',
      'Sports Complex with Tennis, Badminton and Cricket Nets',
    ],
    placementStats: {
      highestPackageLPA: 30.0,
      averagePackageLPA: 5.8,
      placementRatePercent: 88,
      topRecruiters: ['TCS', 'Cognizant', 'HCL', 'Tech Mahindra', 'Accenture'],
    },
    imageUrl: 'https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?auto=format&fit=crop&w=800&q=80',
    fee: {
      tuitionFeePerYear: 69800,
      hostelFeePerYear: 65000,
      messFeePerYear: 35000,
      otherFeePerYear: 9000,
      scholarshipAvailable: true,
      govtFeeReimbursementEligible: true,
      scholarshipDetails: 'Jagananna Vidya Deevena (JVD) valid; Alumni sponsored scholarships.',
    },
    courses: [
      { branchName: 'Computer Science and Engineering', branchCode: 'CSE', seats: 180, cutoffs: { OC: 9800, BCA: 14500, BCB: 13200, BCC: 16500, BCD: 12700, BCE: 15200, SC: 29000, ST: 40000, EWS: 10500 } },
      { branchName: 'Computer Science and Business Systems', branchCode: 'CSBS', seats: 60, cutoffs: { OC: 13200, BCA: 19000, BCB: 17800, BCC: 21500, BCD: 17200, BCE: 20000, SC: 37000, ST: 51000, EWS: 14100 } },
      { branchName: 'Electronics and Communication Engineering', branchCode: 'ECE', seats: 180, cutoffs: { OC: 17500, BCA: 25000, BCB: 23200, BCC: 28000, BCD: 22500, BCE: 26500, SC: 46000, ST: 62000, EWS: 18800 } },
    ],
  },
  {
    name: 'Mohan Babu University (formerly Sree Vidyanikethan), Tirupati',
    code: 'MBU',
    type: 'Deemed University',
    city: 'Tirupati',
    district: 'Tirupati',
    state: 'Andhra Pradesh',
    establishedYear: 1996,
    nirfRank: 'Rank 165 (University)',
    naacGrade: 'A+',
    nbaAccredited: true,
    website: 'https://mbu.asia',
    counsellingCode: 'SVEC',
    contactEmail: 'info@mbu.asia',
    contactPhone: '+91-877-2236711',
    facilities: [
      'Sprawling 100-acre World-Class Smart Campus',
      'State-of-the-art Innovation Center & Hackathon Arena',
      'Air-conditioned Residential Hostels with North & South Cuisine',
      'Apple Mac Labs & Google Developer Student Club',
      'Indoor Sports Arena & Modern Fitness Gyms',
      'Round the clock Medical Clinic with On-duty Doctors',
    ],
    placementStats: {
      highestPackageLPA: 60.0,
      averagePackageLPA: 6.8,
      placementRatePercent: 88,
      topRecruiters: ['Amazon', 'Google', 'Cisco', 'Cognizant', 'Wipro', 'Infosys'],
    },
    imageUrl: 'https://images.unsplash.com/photo-1525921429624-479b6a26d84d?auto=format&fit=crop&w=800&q=80',
    fee: {
      tuitionFeePerYear: 120000,
      hostelFeePerYear: 85000,
      messFeePerYear: 45000,
      otherFeePerYear: 15000,
      scholarshipAvailable: true,
      govtFeeReimbursementEligible: true,
      scholarshipDetails: 'Chancellor Merit Scholarship (up to 100% waiver); JVD for convener seats.',
    },
    courses: [
      { branchName: 'Computer Science and Engineering', branchCode: 'CSE', seats: 240, cutoffs: { OC: 11500, BCA: 17000, BCB: 15500, BCC: 19500, BCD: 15000, BCE: 18000, SC: 34000, ST: 47000, EWS: 12300 } },
      { branchName: 'Artificial Intelligence and Machine Learning', branchCode: 'AIML', seats: 120, cutoffs: { OC: 13500, BCA: 19500, BCB: 18000, BCC: 22000, BCD: 17400, BCE: 20500, SC: 38000, ST: 52000, EWS: 14400 } },
      { branchName: 'Electronics and Communication Engineering', branchCode: 'ECE', seats: 180, cutoffs: { OC: 21000, BCA: 29500, BCB: 27500, BCC: 33000, BCD: 26800, BCE: 31000, SC: 52000, ST: 68000, EWS: 22500 } },
    ],
  },
  {
    name: 'Koneru Lakshmaiah Education Foundation (KL Deemed to be University), Vaddeswaram',
    code: 'KLU',
    type: 'Deemed University',
    city: 'Vijayawada / Guntur',
    district: 'Guntur',
    state: 'Andhra Pradesh',
    establishedYear: 1980,
    nirfRank: 'Rank 28 (Universities in India)',
    naacGrade: 'A++',
    nbaAccredited: true,
    website: 'https://kluniversity.in',
    counsellingCode: 'KLEF',
    contactEmail: 'admissions@kluniversity.in',
    contactPhone: '+91-863-2399999',
    facilities: [
      '100-acre Fully Wi-Fi Enabled Smart Campus',
      'Central Library with 1.5 Lakh Volumes & 24/7 Digital Hub',
      'Advanced Cloud Computing, Cyber Security & IoT Labs',
      'AC Luxury Hostels with Laundry and International Food Courts',
      'World-Class Indoor Stadium & Synthetic Athletics Track',
      'Incubation Center with over 50+ Incubated Student Startups',
    ],
    placementStats: {
      highestPackageLPA: 58.0,
      averagePackageLPA: 7.5,
      placementRatePercent: 96,
      topRecruiters: ['Microsoft', 'Amazon', 'ServiceNow', 'Bosch', 'Deloitte', 'PwC'],
    },
    imageUrl: 'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&w=800&q=80',
    fee: {
      tuitionFeePerYear: 240000,
      hostelFeePerYear: 110000,
      messFeePerYear: 50000,
      otherFeePerYear: 20000,
      scholarshipAvailable: true,
      govtFeeReimbursementEligible: false,
      scholarshipDetails: 'KLEEE rank-based tuition waivers from 25% to 100%; sports scholarship quotas.',
    },
    courses: [
      { branchName: 'Computer Science and Engineering', branchCode: 'CSE', seats: 360, cutoffs: { OC: 12000, BCA: 18000, BCB: 16500, BCC: 21000, BCD: 16000, BCE: 19500, SC: 36000, ST: 49000, EWS: 13000 } },
      { branchName: 'Artificial Intelligence and Data Science', branchCode: 'AIDS', seats: 180, cutoffs: { OC: 14000, BCA: 20500, BCB: 19000, BCC: 23500, BCD: 18400, BCE: 22000, SC: 40000, ST: 54000, EWS: 15200 } },
      { branchName: 'Electronics and Communication Engineering', branchCode: 'ECE', seats: 180, cutoffs: { OC: 22000, BCA: 31000, BCB: 29000, BCC: 35000, BCD: 28000, BCE: 33000, SC: 55000, ST: 71000, EWS: 23800 } },
    ],
  },
  {
    name: 'Sagi Rama Krishnam Raju Engineering College (SRKR), Bhimavaram',
    code: 'SRKR',
    type: 'Autonomous Private',
    city: 'Bhimavaram',
    district: 'West Godavari',
    state: 'Andhra Pradesh',
    establishedYear: 1980,
    nirfRank: 'Rank 151-200 Band',
    naacGrade: 'A+',
    nbaAccredited: true,
    website: 'https://srkr.ac.in',
    counsellingCode: 'SRKR',
    contactEmail: 'principal@srkr.ac.in',
    contactPhone: '+91-8816-223332',
    facilities: [
      'Green Campus with 30-acre Lush Ecosystem',
      'Dedicated Computing Hub with 1500+ High-end Workstations',
      'Affordable On-Campus Hostels with Nutritious Andhra Cuisine',
      'Student Innovation & Robotics Society Labs',
      'Modern Gymnasium & Multipurpose Sports Ground',
      'Extensive Alumni Network across Silicon Valley and Bengaluru',
    ],
    placementStats: {
      highestPackageLPA: 33.0,
      averagePackageLPA: 5.7,
      placementRatePercent: 88,
      topRecruiters: ['TCS', 'Infosys', 'Wipro', 'Capgemini', 'Mindtree'],
    },
    imageUrl: 'https://images.unsplash.com/photo-1519452635265-7b1fbfd1e4e0?auto=format&fit=crop&w=800&q=80',
    fee: {
      tuitionFeePerYear: 71500,
      hostelFeePerYear: 62000,
      messFeePerYear: 34000,
      otherFeePerYear: 8500,
      scholarshipAvailable: true,
      govtFeeReimbursementEligible: true,
      scholarshipDetails: 'Jagananna Vidya Deevena valid; SRKR Alumni Trust merit awards.',
    },
    courses: [
      { branchName: 'Computer Science and Engineering', branchCode: 'CSE', seats: 180, cutoffs: { OC: 8900, BCA: 13200, BCB: 12100, BCC: 15000, BCD: 11600, BCE: 13900, SC: 27000, ST: 37000, EWS: 9600 } },
      { branchName: 'Information Technology', branchCode: 'IT', seats: 120, cutoffs: { OC: 12200, BCA: 17800, BCB: 16400, BCC: 19800, BCD: 15800, BCE: 18500, SC: 34500, ST: 47000, EWS: 13100 } },
      { branchName: 'Electronics and Communication Engineering', branchCode: 'ECE', seats: 180, cutoffs: { OC: 16500, BCA: 23500, BCB: 22000, BCC: 26500, BCD: 21200, BCE: 24800, SC: 43000, ST: 59000, EWS: 17800 } },
    ],
  },
  {
    name: 'GMR Institute of Technology (Autonomous), Rajam',
    code: 'GMRIT',
    type: 'Autonomous Private',
    city: 'Rajam',
    district: 'Vizianagaram',
    state: 'Andhra Pradesh',
    establishedYear: 1997,
    nirfRank: 'Rank 180 (Engineering)',
    naacGrade: 'A',
    nbaAccredited: true,
    website: 'https://gmrit.edu.in',
    counsellingCode: 'GMRV',
    contactEmail: 'gmrit@gmrit.edu.in',
    contactPhone: '+91-8941-251592',
    facilities: [
      'GMR Varalakshmi Foundation 117-acre Eco-friendly Campus',
      'Siemens PLM Software Center of Excellence',
      'Ultra-modern Residential Hostels with Hygienic Steam Cooking',
      'Full Campus Wi-Fi & Automated RFID Central Library',
      'Outdoor Cricket Stadium, Basketball and Tennis Courts',
      'Dedicated Community Radio & Student Cultural Clubs',
    ],
    placementStats: {
      highestPackageLPA: 31.0,
      averagePackageLPA: 5.6,
      placementRatePercent: 86,
      topRecruiters: ['GMR Group', 'Cognizant', 'LTI Mindtree', 'Tech Mahindra', 'Hyundai'],
    },
    imageUrl: 'https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?auto=format&fit=crop&w=800&q=80',
    fee: {
      tuitionFeePerYear: 70000,
      hostelFeePerYear: 60000,
      messFeePerYear: 34000,
      otherFeePerYear: 8000,
      scholarshipAvailable: true,
      govtFeeReimbursementEligible: true,
      scholarshipDetails: 'JVD Full Reimbursement; GMR Varalakshmi Foundation special financial assistance.',
    },
    courses: [
      { branchName: 'Computer Science and Engineering', branchCode: 'CSE', seats: 180, cutoffs: { OC: 11000, BCA: 16200, BCB: 15000, BCC: 18500, BCD: 14400, BCE: 17100, SC: 32000, ST: 44000, EWS: 11800 } },
      { branchName: 'Artificial Intelligence and Data Science', branchCode: 'AIDS', seats: 60, cutoffs: { OC: 13200, BCA: 19000, BCB: 17800, BCC: 21500, BCD: 17200, BCE: 20000, SC: 37000, ST: 51000, EWS: 14100 } },
      { branchName: 'Electronics and Communication Engineering', branchCode: 'ECE', seats: 120, cutoffs: { OC: 19500, BCA: 27500, BCB: 25800, BCC: 31000, BCD: 25000, BCE: 29000, SC: 49000, ST: 65000, EWS: 21000 } },
    ],
  },
];

export const seedDatabase = async () => {
  try {
    console.log('[Seeder] Starting database seeding...');
    await connectDB();

    // Clear existing collections
    await User.deleteMany({});
    await Student.deleteMany({});
    await College.deleteMany({});
    await Course.deleteMany({});
    await AdmissionCriteria.deleteMany({});
    await FeeDetails.deleteMany({});
    await Application.deleteMany({});

    console.log('[Seeder] Cleared previous records.');

    // 1. Create Default Users (Student & Admin)
    const adminUser = await User.create({
      name: 'System Administrator',
      email: 'admin@collegeadmission.ai',
      password: 'AdminPassword123!',
      phone: '+91-9876543210',
      role: 'admin',
    });

    const demoStudentUser = await User.create({
      name: 'Sai Krishna Reddy',
      email: 'student@demo.com',
      password: 'StudentPass123!',
      phone: '+91-9848022338',
      role: 'student',
    });

    const demoStudentProfile = await Student.create({
      userId: demoStudentUser._id,
      intermediateMarks: 94.2,
      entranceExamName: 'AP EAPCET',
      entranceExamRank: 7850,
      category: 'OC',
      preferredCourse: 'Computer Science and Engineering',
      preferredState: 'Andhra Pradesh',
      preferredCity: 'All / Any',
      annualBudget: 180000,
      hostelRequired: true,
      targetDistrict: 'Visakhapatnam',
      academicInterests: ['Artificial Intelligence', 'Software Engineering', 'Cloud Computing'],
    });

    console.log(`[Seeder] Created Admin (${adminUser.email}) and Demo Student (${demoStudentUser.email})`);

    // 2. Insert Colleges, Courses, Criteria, Fees
    for (const item of collegesData) {
      const college = await College.create({
        name: item.name,
        code: item.code,
        type: item.type,
        city: item.city,
        district: item.district,
        state: item.state,
        establishedYear: item.establishedYear,
        nirfRank: item.nirfRank,
        naacGrade: item.naacGrade,
        nbaAccredited: item.nbaAccredited,
        website: item.website,
        counsellingCode: item.counsellingCode,
        contactEmail: item.contactEmail,
        contactPhone: item.contactPhone,
        facilities: item.facilities,
        placementStats: item.placementStats,
        imageUrl: item.imageUrl,
        isDemonstrationData: true,
      });

      // Fee Details
      await FeeDetails.create({
        collegeId: college._id,
        tuitionFeePerYear: item.fee.tuitionFeePerYear,
        hostelFeePerYear: item.fee.hostelFeePerYear,
        messFeePerYear: item.fee.messFeePerYear,
        otherFeePerYear: item.fee.otherFeePerYear,
        scholarshipAvailable: item.fee.scholarshipAvailable,
        govtFeeReimbursementEligible: item.fee.govtFeeReimbursementEligible,
        scholarshipDetails: item.fee.scholarshipDetails,
      });

      // Courses & Admission Criteria
      for (const crs of item.courses) {
        const course = await Course.create({
          collegeId: college._id,
          branchName: crs.branchName,
          branchCode: crs.branchCode,
          degree: 'B.Tech',
          durationYears: 4,
          intakeSeats: crs.seats,
          accreditationStatus: 'NBA Accredited',
        });

        await AdmissionCriteria.create({
          collegeId: college._id,
          branchName: crs.branchName,
          examType: 'AP EAPCET',
          academicYear: '2025-2026',
          minIntermediatePercentage: 45,
          openingRank: Math.floor(crs.cutoffs.OC * 0.4),
          closingRank: crs.cutoffs.OC,
          categoryClosingRanks: {
            OC: crs.cutoffs.OC,
            BCA: crs.cutoffs.BCA,
            BCB: crs.cutoffs.BCB,
            BCC: crs.cutoffs.BCC,
            BCD: crs.cutoffs.BCD,
            BCE: crs.cutoffs.BCE,
            SC: crs.cutoffs.SC,
            ST: crs.cutoffs.ST,
            EWS: crs.cutoffs.EWS,
          },
          counsellingRounds: [
            { roundNumber: 1, startDate: '2026-07-01', endDate: '2026-07-10', status: 'Completed' },
            { roundNumber: 2, startDate: '2026-07-18', endDate: '2026-07-24', status: 'Upcoming' },
            { roundNumber: 3, startDate: '2026-08-01', endDate: '2026-08-06', status: 'Upcoming' },
          ],
        });
      }
    }

    // 3. Create Sample Applications for demo student
    const allColleges = await College.find();
    if (allColleges.length >= 2) {
      await Application.create({
        studentId: demoStudentProfile._id,
        collegeId: allColleges[3]._id, // VRSEC
        branchName: 'Computer Science and Engineering',
        status: 'Web Options Frozen',
        counsellingPhase: 'Phase 1 Counselling',
        notes: 'Priority Option 1 in AP EAPCET Web Counselling Portal.',
      });

      await Application.create({
        studentId: demoStudentProfile._id,
        collegeId: allColleges[4]._id, // GVPCE
        branchName: 'Computer Science and Engineering',
        status: 'Saved / Draft',
        counsellingPhase: 'Phase 1 Counselling',
        notes: 'Priority Option 2 shortlisted.',
      });
    }

    console.log(`[Seeder] Seeded ${allColleges.length} Andhra Pradesh colleges with complete courses, fees, and cutoff metrics.`);
    console.log('[Seeder] Database seeding completed successfully!');
  } catch (err) {
    console.error('[Seeder] Error during seeding:', err);
  }
};

// If run directly
if (process.argv[1]?.endsWith('seedData.js')) {
  seedDatabase().then(() => {
    console.log('[Seeder] Exiting process.');
    process.exit(0);
  });
}
