export type Priority = "high" | "medium" | "low";

export type EventType =
  | "class"
  | "assignment"
  | "assessment"
  | "study-session"
  | "reading"
  | "personal";

export type AssignmentStatus =
  | "not-started"
  | "in-progress"
  | "completed"
  | "overdue";

export type AssessmentType = "test" | "exam" | "quiz" | "presentation";

export type ConfidenceLevel = 1 | 2 | 3 | 4 | 5;

export type StudySessionStatus = "planned" | "in-progress" | "completed";

export interface User {
  id: string;
  name: string;
  email: string;
  academicYear: string;
  timezone: string;
}

export interface Module {
  id: string;
  name: string;
  lecturerName: string;
  color: string;
  icon: string;
  notes: string;
}

export interface Event {
  id: string;
  title: string;
  type: EventType;
  moduleId?: string;
  date: string;
  startTime: string;
  endTime: string;
  location?: string;
  notes?: string;
  priority: Priority;
  repeatRule?: string;
  reminder?: number;
}

export interface Assignment {
  id: string;
  title: string;
  moduleId: string;
  description: string;
  dueDate: string;
  status: AssignmentStatus;
  priority: Priority;
  estimatedHours: number;
  progress: number;
  notes?: string;
}

export interface Assessment {
  id: string;
  title: string;
  moduleId: string;
  assessmentType: AssessmentType;
  date: string;
  topics: string[];
  confidenceLevel: ConfidenceLevel;
  priority: Priority;
  notes?: string;
}

export interface StudySession {
  id: string;
  title: string;
  moduleId: string;
  linkedAssignmentId?: string;
  linkedAssessmentId?: string;
  date: string;
  startTime: string;
  endTime: string;
  goal: string;
  status: StudySessionStatus;
  reflectionNotes?: string;
}
