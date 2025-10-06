const Course = require('../models/Course');
const User = require('../models/User');
const cloudinary = require('cloudinary').v2;
const bcrypt = require('bcryptjs');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Get all courses (with teacher info)
const getAllCoursesAdmin = async (req, res) => {
  try {
    const courses = await Course.find().populate('teacher', 'name email').sort({ createdAt: -1 });
    res.json(courses);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Delete a lesson from a course (also remove from Cloudinary)
const deleteLesson = async (req, res) => {
  try {
    const { courseId, lessonId } = req.params;
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ msg: 'Course not found' });

    const lesson = course.lessons.id(lessonId);
    if (!lesson) return res.status(404).json({ msg: 'Lesson not found' });

    // Remove from Cloudinary if publicId exists
    if (lesson.publicId) {
      try {
        await cloudinary.uploader.destroy(lesson.publicId, { resource_type: 'video' });
      } catch (cloudErr) {
        console.warn('Cloudinary delete warning:', cloudErr.message);
      }
    }

    lesson.remove();
    await course.save();
    res.json(course);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Delete an entire course (and its lessons from Cloudinary)
const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const course = await Course.findById(id);
    if (!course) return res.status(404).json({ msg: 'Course not found' });

    // Delete lessons from Cloudinary
    for (const lesson of course.lessons) {
      if (lesson.publicId) {
        try {
          await cloudinary.uploader.destroy(lesson.publicId, { resource_type: 'video' });
        } catch (cloudErr) {
          console.warn('Cloudinary delete warning:', cloudErr.message);
        }
      }
    }

    await Course.findByIdAndDelete(id);
    res.json({ msg: 'Course deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Create a new user with role admin or teacher
const createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password || !role) return res.status(400).json({ msg: 'Missing fields' });
    if (!['admin', 'teacher'].includes(role)) return res.status(400).json({ msg: 'Invalid role' });

    let existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ msg: 'User already exists' });

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    const user = new User({ name, email, password: hashed, role });
    await user.save();

    res.status(201).json({ msg: 'User created', user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

module.exports = {
  getAllCoursesAdmin,
  deleteLesson,
  deleteCourse,
  createUser,
};
