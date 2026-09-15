import { courses } from "../courseData";

export interface SeedQuizQuestion {
  position: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface SeedChapter {
  id: string;
  title: string;
  content: string;
  position: number;
  estimatedMinutes: number;
  quiz: SeedQuizQuestion[];
}

export interface SeedCourse {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: string;
  level: string;
  estimatedHours: number;
  position: number;
  chapters: SeedChapter[];
}

// Map the courseData into typed seed structures
export const seedCourses: SeedCourse[] = courses.map((course, courseIndex) => ({
  id: course.id,
  title: course.title,
  description: course.description,
  icon: course.id.startsWith("js")
    ? "Code"
    : course.id.startsWith("html")
    ? "Globe"
    : course.id.startsWith("react")
    ? "Atom"
    : course.id.startsWith("db")
    ? "Database"
    : "GitBranch",
  category: course.id.startsWith("js")
    ? "JavaScript"
    : course.id.startsWith("html")
    ? "Frontend"
    : course.id.startsWith("react")
    ? "Frontend"
    : course.id.startsWith("db")
    ? "Backend"
    : "Tools",
  level: "Beginner",
  estimatedHours: 10,
  position: courseIndex,
  chapters: course.chapters.map((ch, chIndex) => ({
    id: ch.id,
    title: ch.title,
    content: ch.content,
    position: chIndex,
    estimatedMinutes: 30,
    quiz: ch.quiz.map((q, qIndex) => ({
      position: qIndex,
      question: q.q,
      options: q.opts,
      correctIndex: q.ans,
      explanation: q.exp,
    })),
  })),
}));
