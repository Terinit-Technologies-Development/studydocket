import { supabase } from "./supabase";
import type {
  User,
  Module,
  Event,
  Assignment,
  Assessment,
  StudySession,
  Note,
  AssignmentAttachment,
  NoteAttachment,
} from "./types";

// --------------- User ---------------

export async function fetchUser(): Promise<User | null> {
  const { data } = await supabase
    .from("users")
    .select("*")
    .limit(1)
    .single();
  if (!data) return null;
  return {
    id: data.id,
    name: data.name,
    email: data.email,
    academicYear: data.academic_year,
    timezone: data.timezone,
  };
}

// --------------- Modules ---------------

export async function fetchModules(): Promise<Module[]> {
  const { data } = await supabase
    .from("modules")
    .select("*")
    .order("name");
  return (data || []).map(mapModule);
}

export async function fetchModuleById(id: string): Promise<Module | null> {
  const { data } = await supabase
    .from("modules")
    .select("*")
    .eq("id", id)
    .single();
  return data ? mapModule(data) : null;
}

function mapModule(row: Record<string, unknown>): Module {
  return {
    id: row.id as string,
    name: row.name as string,
    lecturerName: row.lecturer_name as string,
    color: row.color as string,
    icon: row.icon as string,
    notes: row.notes as string,
    topics: (row.topics as string[]) || [],
  };
}

export async function updateModuleTopics(
  moduleId: string,
  topics: string[]
): Promise<void> {
  await supabase
    .from("modules")
    .update({ topics })
    .eq("id", moduleId);
}

// --------------- Events ---------------

export async function fetchEvents(): Promise<Event[]> {
  const { data } = await supabase
    .from("events")
    .select("*")
    .order("date")
    .order("start_time");
  return (data || []).map(mapEvent);
}

export async function fetchEventsByDate(date: string): Promise<Event[]> {
  const { data } = await supabase
    .from("events")
    .select("*")
    .eq("date", date)
    .order("start_time");
  return (data || []).map(mapEvent);
}

export async function fetchEventsByModule(moduleId: string): Promise<Event[]> {
  const { data } = await supabase
    .from("events")
    .select("*")
    .eq("module_id", moduleId)
    .order("date")
    .order("start_time");
  return (data || []).map(mapEvent);
}

function mapEvent(row: Record<string, unknown>): Event {
  return {
    id: row.id as string,
    title: row.title as string,
    type: row.type as Event["type"],
    moduleId: (row.module_id as string) || undefined,
    date: row.date as string,
    startTime: row.start_time as string,
    endTime: row.end_time as string,
    location: (row.location as string) || undefined,
    notes: (row.notes as string) || undefined,
    priority: row.priority as Event["priority"],
    repeatRule: (row.repeat_rule as string) || undefined,
    reminder: (row.reminder as number) || undefined,
  };
}

// --------------- Assignments ---------------

export async function fetchAssignments(): Promise<Assignment[]> {
  const { data } = await supabase
    .from("assignments")
    .select("*")
    .order("due_date");
  return (data || []).map(mapAssignment);
}

export async function fetchAssignmentsByModule(moduleId: string): Promise<Assignment[]> {
  const { data } = await supabase
    .from("assignments")
    .select("*")
    .eq("module_id", moduleId)
    .order("due_date");
  return (data || []).map(mapAssignment);
}

function mapAssignment(row: Record<string, unknown>): Assignment {
  return {
    id: row.id as string,
    title: row.title as string,
    moduleId: row.module_id as string,
    description: row.description as string,
    dueDate: row.due_date as string,
    status: row.status as Assignment["status"],
    priority: row.priority as Assignment["priority"],
    estimatedHours: Number(row.estimated_hours),
    progress: Number(row.progress),
    notes: (row.notes as string) || undefined,
  };
}

export async function fetchAssignmentById(id: string): Promise<Assignment | null> {
  const { data } = await supabase
    .from("assignments")
    .select("*")
    .eq("id", id)
    .single();
  return data ? mapAssignment(data) : null;
}

export async function updateAssignmentProgress(
  id: string,
  progress: number
): Promise<void> {
  await supabase
    .from("assignments")
    .update({ progress, updated_at: new Date().toISOString() })
    .eq("id", id);
}

export async function updateAssignmentStatus(
  id: string,
  status: Assignment["status"]
): Promise<void> {
  const updates: Record<string, unknown> = {
    status,
    updated_at: new Date().toISOString(),
  };
  if (status === "completed") {
    updates.progress = 100;
  }
  await supabase.from("assignments").update(updates).eq("id", id);
}

// --------------- Assessments ---------------

export async function fetchAssessments(): Promise<Assessment[]> {
  const { data } = await supabase
    .from("assessments")
    .select("*")
    .order("date");
  return (data || []).map(mapAssessment);
}

export async function fetchAssessmentsByModule(moduleId: string): Promise<Assessment[]> {
  const { data } = await supabase
    .from("assessments")
    .select("*")
    .eq("module_id", moduleId)
    .order("date");
  return (data || []).map(mapAssessment);
}

function mapAssessment(row: Record<string, unknown>): Assessment {
  return {
    id: row.id as string,
    title: row.title as string,
    moduleId: row.module_id as string,
    assessmentType: row.assessment_type as Assessment["assessmentType"],
    date: row.date as string,
    topics: row.topics as string[],
    confidenceLevel: row.confidence_level as Assessment["confidenceLevel"],
    priority: row.priority as Assessment["priority"],
    notes: (row.notes as string) || undefined,
  };
}

// --------------- StudySessions ---------------

export async function fetchStudySessions(): Promise<StudySession[]> {
  const { data } = await supabase
    .from("study_sessions")
    .select("*")
    .order("date");
  return (data || []).map(mapStudySession);
}

export async function fetchStudySessionsByModule(moduleId: string): Promise<StudySession[]> {
  const { data } = await supabase
    .from("study_sessions")
    .select("*")
    .eq("module_id", moduleId)
    .order("date");
  return (data || []).map(mapStudySession);
}

export async function fetchStudySessionsByAssignment(assignmentId: string): Promise<StudySession[]> {
  const { data } = await supabase
    .from("study_sessions")
    .select("*")
    .eq("linked_assignment_id", assignmentId)
    .order("date");
  return (data || []).map(mapStudySession);
}

function mapStudySession(row: Record<string, unknown>): StudySession {
  return {
    id: row.id as string,
    title: row.title as string,
    moduleId: row.module_id as string,
    linkedAssignmentId: (row.linked_assignment_id as string) || undefined,
    linkedAssessmentId: (row.linked_assessment_id as string) || undefined,
    date: row.date as string,
    startTime: row.start_time as string,
    endTime: row.end_time as string,
    goal: row.goal as string,
    status: row.status as StudySession["status"],
    reflectionNotes: (row.reflection_notes as string) || undefined,
  };
}

// --------------- Notes ---------------

export async function fetchNotes(): Promise<Note[]> {
  const { data } = await supabase
    .from("notes")
    .select("*")
    .order("updated_at", { ascending: false });
  return (data || []).map(mapNote);
}

export async function fetchNotesByModule(moduleId: string): Promise<Note[]> {
  const { data } = await supabase
    .from("notes")
    .select("*")
    .eq("module_id", moduleId)
    .order("updated_at", { ascending: false });
  return (data || []).map(mapNote);
}

export async function createNote(note: {
  title: string;
  moduleId: string;
  content: string;
  tags: string[];
}): Promise<Note | null> {
  const { data } = await supabase
    .from("notes")
    .insert({
      user_id: "00000000-0000-0000-0000-000000000001",
      title: note.title,
      module_id: note.moduleId,
      content: note.content,
      tags: note.tags,
    })
    .select()
    .single();
  return data ? mapNote(data) : null;
}

function mapNote(row: Record<string, unknown>): Note {
  return {
    id: row.id as string,
    title: row.title as string,
    moduleId: row.module_id as string,
    content: row.content as string,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
    tags: row.tags as string[],
  };
}

export async function fetchNoteById(id: string): Promise<Note | null> {
  const { data } = await supabase
    .from("notes")
    .select("*")
    .eq("id", id)
    .single();
  return data ? mapNote(data) : null;
}

export async function fetchNoteAttachments(
  noteId: string
): Promise<NoteAttachment[]> {
  const { data } = await supabase
    .from("note_attachments")
    .select("*")
    .eq("note_id", noteId)
    .order("created_at", { ascending: false });
  return (data || []).map(mapNoteAttachment);
}

export async function deleteNote(id: string): Promise<void> {
  await supabase.from("notes").delete().eq("id", id);
}

function mapNoteAttachment(row: Record<string, unknown>): NoteAttachment {
  return {
    id: row.id as string,
    noteId: row.note_id as string,
    userId: row.user_id as string,
    fileName: row.file_name as string,
    filePath: row.file_path as string,
    fileSize: row.file_size as number,
    fileType: row.file_type as string,
    createdAt: row.created_at as string,
  };
}

export async function uploadNoteFile(
  noteId: string,
  file: File
): Promise<NoteAttachment | null> {
  const filePath = `notes/${noteId}/${Date.now()}-${file.name}`;

  const { error: uploadError } = await supabase.storage
    .from("note-attachments")
    .upload(filePath, file);

  if (uploadError) {
    console.error("Upload failed:", uploadError);
    return null;
  }

  const { data, error: attachError } = await supabase
    .from("note_attachments")
    .insert({
      note_id: noteId,
      user_id: "00000000-0000-0000-0000-000000000001",
      file_name: file.name,
      file_path: filePath,
      file_size: file.size,
      file_type: file.type || "application/octet-stream",
    })
    .select()
    .single();

  if (attachError) {
    console.error("Attachment record failed:", attachError);
    return null;
  }

  return data ? mapNoteAttachment(data) : null;
}

export async function deleteNoteAttachment(id: string): Promise<void> {
  await supabase.from("note_attachments").delete().eq("id", id);
}

// --------------- Assignment Attachments ---------------

export async function fetchAssignmentAttachments(
  assignmentId: string
): Promise<AssignmentAttachment[]> {
  const { data } = await supabase
    .from("assignment_attachments")
    .select("*")
    .eq("assignment_id", assignmentId)
    .order("created_at", { ascending: false });
  return (data || []).map(mapAssignmentAttachment);
}

export async function uploadAssignmentFile(
  assignmentId: string,
  file: File
): Promise<AssignmentAttachment | null> {
  const filePath = `assignments/${assignmentId}/${Date.now()}-${file.name}`;

  const { error: uploadError } = await supabase.storage
    .from("note-attachments")
    .upload(filePath, file);

  if (uploadError) {
    console.error("Upload failed:", uploadError);
    return null;
  }

  const { data, error: attachError } = await supabase
    .from("assignment_attachments")
    .insert({
      assignment_id: assignmentId,
      user_id: "00000000-0000-0000-0000-000000000001",
      file_name: file.name,
      file_path: filePath,
      file_size: file.size,
      file_type: file.type || "application/octet-stream",
    })
    .select()
    .single();

  if (attachError) {
    console.error("Attachment record failed:", attachError);
    return null;
  }

  return data ? mapAssignmentAttachment(data) : null;
}

export async function deleteAssignmentAttachment(id: string): Promise<void> {
  await supabase.from("assignment_attachments").delete().eq("id", id);
}

function mapAssignmentAttachment(
  row: Record<string, unknown>
): AssignmentAttachment {
  return {
    id: row.id as string,
    assignmentId: row.assignment_id as string,
    userId: row.user_id as string,
    fileName: row.file_name as string,
    filePath: row.file_path as string,
    fileSize: row.file_size as number,
    fileType: row.file_type as string,
    createdAt: row.created_at as string,
  };
}
