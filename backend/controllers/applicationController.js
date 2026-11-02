import Application from '../models/Application.js';
import Student from '../models/Student.js';

export const getMyApplications = async (req, res, next) => {
  try {
    const student = await Student.findOne({ userId: req.user._id });
    if (!student) {
      return res.json({ success: true, count: 0, applications: [] });
    }

    const applications = await Application.find({ studentId: student._id })
      .populate('collegeId')
      .sort({ updatedAt: -1 })
      .lean();

    res.json({ success: true, count: applications.length, applications });
  } catch (error) {
    next(error);
  }
};

export const applyOrShortlistCollege = async (req, res, next) => {
  try {
    const { collegeId, branchName, status, notes } = req.body;
    let student = await Student.findOne({ userId: req.user._id });
    if (!student) {
      student = await Student.create({ userId: req.user._id });
    }

    // Check if application for this college/branch already exists
    let application = await Application.findOne({
      studentId: student._id,
      collegeId,
      branchName,
    });

    if (application) {
      application.status = status || application.status;
      if (notes) application.notes = notes;
      await application.save();
      return res.json({ success: true, message: 'Application updated', application });
    }

    application = await Application.create({
      studentId: student._id,
      collegeId,
      branchName: branchName || 'Computer Science and Engineering',
      status: status || 'Saved / Draft',
      notes: notes || 'Shortlisted from college recommendations.',
    });

    res.status(201).json({ success: true, message: 'College added to applications list', application });
  } catch (error) {
    next(error);
  }
};

export const updateApplicationStatus = async (req, res, next) => {
  try {
    const { status, notes, allotmentRank } = req.body;
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    if (status) application.status = status;
    if (notes) application.notes = notes;
    if (allotmentRank !== undefined) application.allotmentRank = allotmentRank;

    await application.save();
    res.json({ success: true, message: 'Status updated', application });
  } catch (error) {
    next(error);
  }
};

export const deleteApplication = async (req, res, next) => {
  try {
    const application = await Application.findByIdAndDelete(req.params.id);
    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }
    res.json({ success: true, message: 'Application removed' });
  } catch (error) {
    next(error);
  }
};
