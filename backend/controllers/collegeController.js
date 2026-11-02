import College from '../models/College.js';
import Course from '../models/Course.js';
import AdmissionCriteria from '../models/AdmissionCriteria.js';
import FeeDetails from '../models/FeeDetails.js';

export const getAllColleges = async (req, res, next) => {
  try {
    const { search, district, city, type, course, maxFee, sort } = req.query;
    let query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { code: { $regex: search, $options: 'i' } },
        { city: { $regex: search, $options: 'i' } },
        { district: { $regex: search, $options: 'i' } },
      ];
    }

    if (district && district !== 'All') {
      query.district = { $regex: district, $options: 'i' };
    }

    if (city && city !== 'All') {
      query.city = { $regex: city, $options: 'i' };
    }

    if (type && type !== 'All') {
      query.type = type;
    }

    let colleges = await College.find(query).lean();

    // Populate fees and courses for each college
    const collegeIds = colleges.map((c) => c._id);
    const [allFees, allCourses, allCriteria] = await Promise.all([
      FeeDetails.find({ collegeId: { $in: collegeIds } }).lean(),
      Course.find({ collegeId: { $in: collegeIds } }).lean(),
      AdmissionCriteria.find({ collegeId: { $in: collegeIds } }).lean(),
    ]);

    const feeMap = new Map(allFees.map((f) => [f.collegeId.toString(), f]));
    const courseMap = new Map();
    const criteriaMap = new Map();

    allCourses.forEach((crs) => {
      const cid = crs.collegeId.toString();
      if (!courseMap.has(cid)) courseMap.set(cid, []);
      courseMap.get(cid).push(crs);
    });

    allCriteria.forEach((crit) => {
      const cid = crit.collegeId.toString();
      if (!criteriaMap.has(cid)) criteriaMap.set(cid, []);
      criteriaMap.get(cid).push(crit);
    });

    let enrichedColleges = colleges.map((col) => {
      const cid = col._id.toString();
      return {
        ...col,
        feeDetails: feeMap.get(cid) || null,
        courses: courseMap.get(cid) || [],
        criteria: criteriaMap.get(cid) || [],
      };
    });

    // Filter by course if specified
    if (course && course !== 'All') {
      enrichedColleges = enrichedColleges.filter((c) =>
        c.courses.some((crs) => crs.branchName.toLowerCase().includes(course.toLowerCase()))
      );
    }

    // Filter by budget if specified
    if (maxFee) {
      enrichedColleges = enrichedColleges.filter(
        (c) => c.feeDetails && c.feeDetails.totalEstimatedAnnual <= Number(maxFee)
      );
    }

    // Sort
    if (sort === 'fee_low') {
      enrichedColleges.sort(
        (a, b) => (a.feeDetails?.totalEstimatedAnnual || 0) - (b.feeDetails?.totalEstimatedAnnual || 0)
      );
    } else if (sort === 'fee_high') {
      enrichedColleges.sort(
        (a, b) => (b.feeDetails?.totalEstimatedAnnual || 0) - (a.feeDetails?.totalEstimatedAnnual || 0)
      );
    } else if (sort === 'placement') {
      enrichedColleges.sort(
        (a, b) =>
          (b.placementStats?.averagePackageLPA || 0) - (a.placementStats?.averagePackageLPA || 0)
      );
    }

    res.json({ success: true, count: enrichedColleges.length, colleges: enrichedColleges });
  } catch (error) {
    next(error);
  }
};

export const getCollegeById = async (req, res, next) => {
  try {
    const college = await College.findById(req.params.id).lean();
    if (!college) {
      return res.status(404).json({ success: false, message: 'College not found' });
    }

    const [feeDetails, courses, criteria] = await Promise.all([
      FeeDetails.findOne({ collegeId: college._id }).lean(),
      Course.find({ collegeId: college._id }).lean(),
      AdmissionCriteria.find({ collegeId: college._id }).lean(),
    ]);

    res.json({
      success: true,
      college: {
        ...college,
        feeDetails,
        courses,
        criteria,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const createCollege = async (req, res, next) => {
  try {
    const { name, code, type, city, district, state, website, nirfRank, naacGrade, facilities, placementStats, feeDetails } = req.body;
    
    const existing = await College.findOne({ code });
    if (existing) {
      return res.status(400).json({ success: false, message: 'College code already exists' });
    }

    const college = await College.create({
      name,
      code,
      type: type || 'Autonomous Private',
      city,
      district,
      state: state || 'Andhra Pradesh',
      website,
      nirfRank,
      naacGrade,
      facilities: facilities || [],
      placementStats: placementStats || {},
    });

    if (feeDetails) {
      await FeeDetails.create({
        collegeId: college._id,
        tuitionFeePerYear: feeDetails.tuitionFeePerYear || 70000,
        hostelFeePerYear: feeDetails.hostelFeePerYear || 60000,
        messFeePerYear: feeDetails.messFeePerYear || 35000,
        otherFeePerYear: feeDetails.otherFeePerYear || 10000,
        scholarshipAvailable: feeDetails.scholarshipAvailable ?? true,
      });
    }

    res.status(201).json({ success: true, message: 'College created successfully', college });
  } catch (error) {
    next(error);
  }
};

export const updateCollege = async (req, res, next) => {
  try {
    const college = await College.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!college) {
      return res.status(404).json({ success: false, message: 'College not found' });
    }
    res.json({ success: true, message: 'College updated successfully', college });
  } catch (error) {
    next(error);
  }
};

export const deleteCollege = async (req, res, next) => {
  try {
    const college = await College.findById(req.params.id);
    if (!college) {
      return res.status(404).json({ success: false, message: 'College not found' });
    }
    await Promise.all([
      College.findByIdAndDelete(college._id),
      Course.deleteMany({ collegeId: college._id }),
      FeeDetails.deleteMany({ collegeId: college._id }),
      AdmissionCriteria.deleteMany({ collegeId: college._id }),
    ]);
    res.json({ success: true, message: 'College and associated details deleted successfully' });
  } catch (error) {
    next(error);
  }
};
