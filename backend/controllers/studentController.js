import Student from '../models/Student.js';
import User from '../models/User.js';

export const getStudentProfile = async (req, res, next) => {
  try {
    let student = await Student.findOne({ userId: req.user._id });
    if (!student) {
      student = await Student.create({
        userId: req.user._id,
        intermediateMarks: 85,
        entranceExamName: 'AP EAPCET',
        entranceExamRank: 10000,
        category: 'OC',
        preferredCourse: 'Computer Science and Engineering',
        preferredState: 'Andhra Pradesh',
        preferredCity: 'All / Any',
        annualBudget: 180000,
        hostelRequired: true,
      });
    }
    res.json({ success: true, student });
  } catch (error) {
    next(error);
  }
};

export const updateStudentProfile = async (req, res, next) => {
  try {
    const {
      intermediateMarks,
      entranceExamName,
      entranceExamRank,
      category,
      preferredCourse,
      preferredState,
      preferredCity,
      annualBudget,
      hostelRequired,
      targetDistrict,
      academicInterests,
    } = req.body;

    let student = await Student.findOne({ userId: req.user._id });
    if (!student) {
      student = new Student({ userId: req.user._id });
    }

    if (intermediateMarks !== undefined) student.intermediateMarks = Number(intermediateMarks);
    if (entranceExamName) student.entranceExamName = entranceExamName;
    if (entranceExamRank !== undefined) student.entranceExamRank = Number(entranceExamRank);
    if (category) student.category = category;
    if (preferredCourse) student.preferredCourse = preferredCourse;
    if (preferredState) student.preferredState = preferredState;
    if (preferredCity) student.preferredCity = preferredCity;
    if (annualBudget !== undefined) student.annualBudget = Number(annualBudget);
    if (hostelRequired !== undefined) student.hostelRequired = Boolean(hostelRequired);
    if (targetDistrict) student.targetDistrict = targetDistrict;
    if (academicInterests) student.academicInterests = academicInterests;

    await student.save();

    res.json({ success: true, message: 'Student profile updated successfully', student });
  } catch (error) {
    next(error);
  }
};

export const getAllStudents = async (req, res, next) => {
  try {
    const students = await Student.find().populate('userId', 'name email phone role createdAt');
    res.json({ success: true, count: students.length, students });
  } catch (error) {
    next(error);
  }
};
