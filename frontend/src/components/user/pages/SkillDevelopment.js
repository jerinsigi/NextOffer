import React, { useState } from 'react';
import './SkillDevelopment.css';

const SkillDevelopment = () => {
    const [activeTab, setActiveTab] = useState('recommended');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [enrolledCourses, setEnrolledCourses] = useState([1, 5]);

    // Learning paths data
    const learningPaths = [
        {
            id: 1,
            title: 'Full Stack Developer',
            description: 'Master both frontend and backend development',
            duration: '6 months',
            level: 'Intermediate',
            skills: ['React', 'Node.js', 'MongoDB', 'Express'],
            progress: 45,
            modules: 12,
            completedModules: 5,
            enrolled: true,
            icon: '🚀'
        },
        {
            id: 2,
            title: 'AI/ML Engineer',
            description: 'Build intelligent systems with machine learning',
            duration: '8 months',
            level: 'Advanced',
            skills: ['Python', 'TensorFlow', 'PyTorch', 'Data Science'],
            progress: 0,
            modules: 16,
            completedModules: 0,
            enrolled: false,
            icon: '🤖'
        },
        {
            id: 3,
            title: 'Cloud Solutions Architect',
            description: 'Design and implement cloud infrastructure',
            duration: '5 months',
            level: 'Advanced',
            skills: ['AWS', 'Azure', 'Docker', 'Kubernetes'],
            progress: 0,
            modules: 10,
            completedModules: 0,
            enrolled: false,
            icon: '☁️'
        }
    ];

    // Courses data
    const courses = [
        {
            id: 1,
            title: 'Advanced React Patterns',
            instructor: 'Kent C. Dodds',
            category: 'Frontend',
            level: 'Advanced',
            duration: '8 hours',
            rating: 4.8,
            reviews: 2456,
            enrolled: true,
            progress: 65,
            thumbnail: '📱',
            price: 'Free',
            skills: ['React', 'Hooks', 'Context API'],
            recommended: true
        },
        {
            id: 2,
            title: 'Node.js Microservices',
            instructor: 'Kyle Simpson',
            category: 'Backend',
            level: 'Intermediate',
            duration: '12 hours',
            rating: 4.7,
            reviews: 1823,
            enrolled: false,
            progress: 0,
            thumbnail: '⚙️',
            price: '$49',
            skills: ['Node.js', 'Express', 'Docker'],
            recommended: true
        },
        {
            id: 3,
            title: 'System Design Fundamentals',
            instructor: 'Alex Xu',
            category: 'System Design',
            level: 'Advanced',
            duration: '10 hours',
            rating: 4.9,
            reviews: 3201,
            enrolled: false,
            progress: 0,
            thumbnail: '🏗️',
            price: '$79',
            skills: ['Architecture', 'Scalability', 'Design Patterns'],
            recommended: true
        },
        {
            id: 4,
            title: 'Data Structures & Algorithms',
            instructor: 'William Fiset',
            category: 'Computer Science',
            level: 'Intermediate',
            duration: '15 hours',
            rating: 4.6,
            reviews: 4567,
            enrolled: false,
            progress: 0,
            thumbnail: '📊',
            price: 'Free',
            skills: ['DSA', 'Problem Solving', 'Coding'],
            recommended: true
        },
        {
            id: 5,
            title: 'Modern CSS & Animations',
            instructor: 'Kevin Powell',
            category: 'Frontend',
            level: 'Beginner',
            duration: '6 hours',
            rating: 4.7,
            reviews: 1234,
            enrolled: true,
            progress: 30,
            thumbnail: '🎨',
            price: 'Free',
            skills: ['CSS', 'Animations', 'Responsive Design'],
            recommended: false
        },
        {
            id: 6,
            title: 'AWS Cloud Practitioner',
            instructor: 'Stephane Maarek',
            category: 'Cloud',
            level: 'Beginner',
            duration: '14 hours',
            rating: 4.8,
            reviews: 5432,
            enrolled: false,
            progress: 0,
            thumbnail: '☁️',
            price: '$39',
            skills: ['AWS', 'Cloud Computing', 'DevOps'],
            recommended: true
        },
        {
            id: 7,
            title: 'Python for Data Science',
            instructor: 'Jose Portilla',
            category: 'Data Science',
            level: 'Beginner',
            duration: '20 hours',
            rating: 4.6,
            reviews: 6789,
            enrolled: false,
            progress: 0,
            thumbnail: '🐍',
            price: '$59',
            skills: ['Python', 'Pandas', 'NumPy'],
            recommended: false
        },
        {
            id: 8,
            title: 'DevOps with Docker & Kubernetes',
            instructor: 'Mumshad Mannambeth',
            category: 'DevOps',
            level: 'Advanced',
            duration: '18 hours',
            rating: 4.9,
            reviews: 3456,
            enrolled: false,
            progress: 0,
            thumbnail: '🐳',
            price: '$69',
            skills: ['Docker', 'Kubernetes', 'CI/CD'],
            recommended: true
        }
    ];

    // Skills assessment data
    const skillsAssessment = [
        { name: 'JavaScript', current: 85, target: 95, category: 'Frontend' },
        { name: 'React', current: 80, target: 90, category: 'Frontend' },
        { name: 'Node.js', current: 70, target: 85, category: 'Backend' },
        { name: 'System Design', current: 60, target: 80, category: 'System Design' },
        { name: 'Data Structures', current: 75, target: 90, category: 'Computer Science' },
        { name: 'AWS', current: 50, target: 75, category: 'Cloud' }
    ];

    const handleEnroll = (courseId) => {
        if (enrolledCourses.includes(courseId)) {
            setEnrolledCourses(enrolledCourses.filter(id => id !== courseId));
        } else {
            setEnrolledCourses([...enrolledCourses, courseId]);
        }
    };

    const getFilteredCourses = () => {
        let filtered = courses;

        if (activeTab === 'recommended') {
            filtered = courses.filter(c => c.recommended);
        } else if (activeTab === 'enrolled') {
            filtered = courses.filter(c => enrolledCourses.includes(c.id));
        }

        if (selectedCategory !== 'all') {
            filtered = filtered.filter(c => c.category === selectedCategory);
        }

        return filtered;
    };

    const categories = ['all', 'Frontend', 'Backend', 'Cloud', 'Data Science', 'DevOps', 'System Design', 'Computer Science'];

    const getLevelColor = (level) => {
        switch(level) {
            case 'Beginner': return 'beginner';
            case 'Intermediate': return 'intermediate';
            case 'Advanced': return 'advanced';
            default: return 'intermediate';
        }
    };

    const getProgressColor = (progress) => {
        if (progress >= 75) return 'excellent';
        if (progress >= 50) return 'good';
        return 'average';
    };

    return (
        <div className="skill-development-container">
            {/* Page Header */}
            <div className="page-header">
                <div>
                    <h2 className="page-title">
                        <i className="fas fa-graduation-cap me-2"></i>
                        Skill Development
                    </h2>
                    <p className="text-muted">Enhance your skills with personalized learning paths</p>
                </div>
                <div className="header-actions">
                    <button className="btn btn-outline-primary">
                        <i className="fas fa-trophy me-1"></i> My Achievements
                    </button>
                    <button className="btn btn-primary">
                        <i className="fas fa-plus me-1"></i> Browse All Courses
                    </button>
                </div>
            </div>

            {/* Learning Statistics */}
            <div className="learning-stats">
                <div className="stat-card">
                    <div className="stat-icon primary">
                        <i className="fas fa-book-open"></i>
                    </div>
                    <div className="stat-info">
                        <div className="stat-value">12</div>
                        <div className="stat-label">Courses Enrolled</div>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon success">
                        <i className="fas fa-check-circle"></i>
                    </div>
                    <div className="stat-info">
                        <div className="stat-value">8</div>
                        <div className="stat-label">Courses Completed</div>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon warning">
                        <i className="fas fa-certificate"></i>
                    </div>
                    <div className="stat-info">
                        <div className="stat-value">5</div>
                        <div className="stat-label">Certificates Earned</div>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon info">
                        <i className="fas fa-fire"></i>
                    </div>
                    <div className="stat-info">
                        <div className="stat-value">24</div>
                        <div className="stat-label">Day Streak</div>
                    </div>
                </div>
            </div>

            {/* Learning Paths */}
            <div className="section">
                <div className="section-header">
                    <h3>
                        <i className="fas fa-route me-2"></i>
                        Recommended Learning Paths
                    </h3>
                    <button className="btn-text">View All</button>
                </div>
                <div className="learning-paths-grid">
                    {learningPaths.map(path => (
                        <div key={path.id} className={`path-card ${path.enrolled ? 'enrolled' : ''}`}>
                            <div className="path-icon">{path.icon}</div>
                            <div className="path-header">
                                <h4>{path.title}</h4>
                                <span className={`level-badge ${getLevelColor(path.level)}`}>
                                    {path.level}
                                </span>
                            </div>
                            <p className="path-description">{path.description}</p>
                            <div className="path-meta">
                                <span><i className="far fa-clock"></i> {path.duration}</span>
                                <span><i className="fas fa-layer-group"></i> {path.modules} modules</span>
                            </div>
                            <div className="path-skills">
                                {path.skills.map((skill, index) => (
                                    <span key={index} className="skill-tag">{skill}</span>
                                ))}
                            </div>
                            {path.enrolled && (
                                <div className="path-progress">
                                    <div className="progress-header">
                                        <span>Progress</span>
                                        <span>{path.progress}%</span>
                                    </div>
                                    <div className="progress-bar">
                                        <div 
                                            className={`progress-fill ${getProgressColor(path.progress)}`}
                                            style={{ width: `${path.progress}%` }}
                                        ></div>
                                    </div>
                                    <div className="modules-count">
                                        {path.completedModules} of {path.modules} modules completed
                                    </div>
                                </div>
                            )}
                            <button className={`btn ${path.enrolled ? 'btn-outline-primary' : 'btn-primary'} w-100`}>
                                {path.enrolled ? (
                                    <>
                                        <i className="fas fa-play me-1"></i> Continue Learning
                                    </>
                                ) : (
                                    <>
                                        <i className="fas fa-rocket me-1"></i> Start Path
                                    </>
                                )}
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Skills Assessment */}
            <div className="section">
                <div className="section-header">
                    <h3>
                        <i className="fas fa-chart-line me-2"></i>
                        Skills Assessment
                    </h3>
                    <button className="btn-text">Take Assessment</button>
                </div>
                <div className="skills-assessment-card">
                    <div className="assessment-grid">
                        {skillsAssessment.map((skill, index) => (
                            <div key={index} className="skill-assessment-item">
                                <div className="skill-assessment-header">
                                    <div>
                                        <div className="skill-name">{skill.name}</div>
                                        <div className="skill-category">{skill.category}</div>
                                    </div>
                                    <div className="skill-scores">
                                        <div className="current-score">{skill.current}%</div>
                                        <div className="target-label">Target: {skill.target}%</div>
                                    </div>
                                </div>
                                <div className="skill-bars">
                                    <div className="skill-bar current">
                                        <div className="bar-label">Current</div>
                                        <div className="bar-track">
                                            <div 
                                                className="bar-fill current-fill"
                                                style={{ width: `${skill.current}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                    <div className="skill-bar target">
                                        <div className="bar-label">Target</div>
                                        <div className="bar-track">
                                            <div 
                                                className="bar-fill target-fill"
                                                style={{ width: `${skill.target}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                                <div className="gap-indicator">
                                    <i className="fas fa-arrow-up"></i>
                                    Gap to close: {skill.target - skill.current}%
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Courses Section */}
            <div className="section">
                <div className="section-header">
                    <h3>
                        <i className="fas fa-book me-2"></i>
                        Courses
                    </h3>
                </div>

                {/* Tabs and Filters */}
                <div className="courses-filters">
                    <div className="filter-tabs">
                        <button 
                            className={`tab-btn ${activeTab === 'recommended' ? 'active' : ''}`}
                            onClick={() => setActiveTab('recommended')}
                        >
                            <i className="fas fa-star"></i>
                            Recommended
                        </button>
                        <button 
                            className={`tab-btn ${activeTab === 'enrolled' ? 'active' : ''}`}
                            onClick={() => setActiveTab('enrolled')}
                        >
                            <i className="fas fa-bookmark"></i>
                            My Courses ({enrolledCourses.length})
                        </button>
                        <button 
                            className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`}
                            onClick={() => setActiveTab('all')}
                        >
                            <i className="fas fa-th"></i>
                            All Courses
                        </button>
                    </div>

                    <div className="category-filters">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                className={`category-btn ${selectedCategory === cat ? 'active' : ''}`}
                                onClick={() => setSelectedCategory(cat)}
                            >
                                {cat === 'all' ? 'All Categories' : cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Courses Grid */}
                <div className="courses-grid">
                    {getFilteredCourses().map(course => (
                        <div key={course.id} className="course-card">
                            <div className="course-thumbnail">
                                <div className="thumbnail-icon">{course.thumbnail}</div>
                                {course.recommended && (
                                    <span className="recommended-badge">
                                        <i className="fas fa-star"></i> Recommended
                                    </span>
                                )}
                                {enrolledCourses.includes(course.id) && (
                                    <span className="enrolled-badge">
                                        <i className="fas fa-check"></i> Enrolled
                                    </span>
                                )}
                            </div>
                            <div className="course-content">
                                <div className="course-header">
                                    <h4>{course.title}</h4>
                                    <div className="course-meta">
                                        <span className="instructor">
                                            <i className="fas fa-user-tie"></i> {course.instructor}
                                        </span>
                                        <span className={`level-badge ${getLevelColor(course.level)}`}>
                                            {course.level}
                                        </span>
                                    </div>
                                </div>
                                <div className="course-info">
                                    <div className="rating">
                                        <i className="fas fa-star"></i>
                                        <span>{course.rating}</span>
                                        <span className="reviews">({course.reviews.toLocaleString()})</span>
                                    </div>
                                    <div className="duration">
                                        <i className="far fa-clock"></i>
                                        {course.duration}
                                    </div>
                                </div>
                                <div className="course-skills">
                                    {course.skills.map((skill, index) => (
                                        <span key={index} className="skill-tag-small">{skill}</span>
                                    ))}
                                </div>
                                {enrolledCourses.includes(course.id) && course.progress > 0 && (
                                    <div className="course-progress">
                                        <div className="progress-header">
                                            <span>Progress</span>
                                            <span>{course.progress}%</span>
                                        </div>
                                        <div className="progress-bar">
                                            <div 
                                                className={`progress-fill ${getProgressColor(course.progress)}`}
                                                style={{ width: `${course.progress}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                )}
                                <div className="course-footer">
                                    <div className="course-price">{course.price}</div>
                                    <button 
                                        className={`btn ${enrolledCourses.includes(course.id) ? 'btn-outline-primary' : 'btn-primary'}`}
                                        onClick={() => handleEnroll(course.id)}
                                    >
                                        {enrolledCourses.includes(course.id) ? (
                                            <>
                                                <i className="fas fa-play me-1"></i> Continue
                                            </>
                                        ) : (
                                            <>
                                                <i className="fas fa-plus me-1"></i> Enroll
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {getFilteredCourses().length === 0 && (
                    <div className="empty-state">
                        <i className="fas fa-book-open fa-4x"></i>
                        <h5>No courses found</h5>
                        <p className="text-muted">Try adjusting your filters or browse all courses</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SkillDevelopment;
