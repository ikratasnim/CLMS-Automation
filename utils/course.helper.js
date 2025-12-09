export class CourseDataGenerator {
  static generateRandomCourse() {
    const randomId = Math.floor(Math.random() * 1000);
    return {
      title: `Test Course ${randomId}`,
      description: `This is a test course description for course ${randomId}. It contains detailed information about the course content and objectives.`,
      chapters: [
        {
          name: `Introduction to Course ${randomId}`,
          description: `Introduction chapter covering basic concepts for course ${randomId}.`,
          lessons: [
            { title: `Getting Started - Lesson ${randomId}` },
            { title: `Understanding Basic Concepts - ${randomId}` }
          ]
        },
        {
          name: `Advanced Topics - ${randomId}`,
          description: `Advanced topics and concepts for course ${randomId}.`
        }
      ]
    };
  }

  static generateBasicCourse(title) {
    return {
      title: title || 'Basic Test Course',
      description: 'This is a test course created for automation testing purposes.',
      chapters: [
        {
          name: 'Chapter 1: Introduction',
          description: 'Introduction chapter covering basic concepts.',
          lessons: [
            { title: 'Welcome Lesson' }
          ]
        },
        {
          name: 'Chapter 2: Advanced Topics',
          description: 'Advanced topics and concepts.'
        }
      ]
    };
  }

  static generateCourseWithRichContent() {
    return {
      title: 'Rich Content Course',
      description: 'I am providing description. \n\nThis is description 2\n\n/',
      chapters: [
        {
          name: 'Interactive Chapter',
          description: 'Chapter with interactive content and rich formatting.',
          lessons: [
            { title: 'Multimedia Lesson' },
            { title: 'Interactive Elements' }
          ]
        }
      ],
      uploadThumbnail: true,
      uploadVideo: false
    };
  }

  static generateComprehensiveCourse() {
    const timestamp = Date.now();
    return {
      title: `Comprehensive Test Course ${timestamp}`,
      description: `This is a comprehensive test course created at ${new Date().toISOString()}. It includes multiple chapters, lessons, and rich media content.`,
      chapters: [
        {
          name: 'Introduction and Setup',
          description: 'Getting started with the course and setting up your environment.',
          lessons: [
            { title: 'Welcome to the Course' },
            { title: 'Course Overview' },
            { title: 'Setting Up Your Workspace' }
          ]
        },
        {
          name: 'Core Concepts',
          description: 'Understanding the fundamental concepts and principles.',
          lessons: [
            { title: 'Basic Principles' },
            { title: 'Key Terminology' },
            { title: 'Practical Examples' }
          ]
        },
        {
          name: 'Advanced Techniques',
          description: 'Deep dive into advanced topics and techniques.',
          lessons: [
            { title: 'Advanced Methods' },
            { title: 'Best Practices' }
          ]
        },
        {
          name: 'Conclusion and Next Steps',
          description: 'Wrapping up and planning your learning journey.',
          lessons: [
            { title: 'Course Summary' },
            { title: 'Additional Resources' },
            { title: 'What\'s Next?' }
          ]
        }
      ],
      uploadThumbnail: true,
      uploadVideo: true
    };
  }

  static generateSimpleCourse() {
    return {
      title: 'Simple Course Test',
      description: 'A simple course for quick testing.',
      chapters: [
        {
          name: 'Chapter 1',
          description: 'First chapter description',
          lessons: [{ title: 'Lesson 1' }]
        },
        {
          name: 'Chapter 2',
          description: 'Second chapter description'
        }
      ],
      uploadThumbnail: false,
      uploadVideo: false
    };
  }
}
