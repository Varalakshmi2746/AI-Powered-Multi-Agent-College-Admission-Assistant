import College from '../models/College.js';
import Student from '../models/Student.js';
import User from '../models/User.js';
import Application from '../models/Application.js';
import Course from '../models/Course.js';
import FeeDetails from '../models/FeeDetails.js';

export const getAdminStats = async (req, res, next) => {
  try {
    const [
      collegesCount,
      studentsCount,
      usersCount,
      applicationsCount,
      coursesCount,
      applications,
      colleges,
    ] = await Promise.all([
      College.countDocuments(),
      Student.countDocuments(),
      User.countDocuments(),
      Application.countDocuments(),
      Course.countDocuments(),
      Application.find().select('status').lean(),
      College.find().select('district type').lean(),
    ]);

    // Status breakdown
    const statusCounts = {};
    applications.forEach((a) => {
      statusCounts[a.status] = (statusCounts[a.status] || 0) + 1;
    });

    // District breakdown
    const districtCounts = {};
    colleges.forEach((c) => {
      districtCounts[c.district] = (districtCounts[c.district] || 0) + 1;
    });

    // College type breakdown
    const typeCounts = {};
    colleges.forEach((c) => {
      typeCounts[c.type] = (typeCounts[c.type] || 0) + 1;
    });

    res.json({
      success: true,
      stats: {
        collegesCount,
        studentsCount,
        usersCount,
        applicationsCount,
        coursesCount,
        statusCounts,
        districtCounts,
        typeCounts,
      },
    });
  } catch (error) {
    next(error);
  }
};
