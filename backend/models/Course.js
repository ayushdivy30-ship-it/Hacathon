const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LessonSchema = new Schema({
    title: { type: String, required: true },
    videoUrl: { type: String, required: true },
    publicId: { type: String, required: true }
});

// Sections group lessons together (e.g., Class 1, Class 2)
const SectionSchema = new Schema({
    title: { type: String, required: true },
    lessons: [LessonSchema]
});

const CourseSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    teacher: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    // Backwards-compatible top-level lessons (existing data)
    lessons: [LessonSchema],
    // New sections field for grouping lessons by section/class
    sections: [SectionSchema]
}, { timestamps: true });

// This line is also changed to prevent the same error for the Course model
module.exports = mongoose.models.Course || mongoose.model('Course', CourseSchema);

