export interface Lesson {
  id: string;
  person_name: string;
  person_age: number | null;
  country: string;
  life_lesson: string;
  story: string;
  source: "seed" | "user";
  trigger_warning: string | null;
  favourite_count: number;
  is_approved: boolean;
  is_reported: boolean;
  report_count: number;
  created_at: string;
  updated_at: string;
}

// What the API returns to the client (subset of Lesson)
export interface LessonResponse {
  id: string;
  person_name: string;
  person_age: number | null;
  country: string;
  life_lesson: string;
  story: string;
  trigger_warning: string | null;
  favourite_count: number;
}

export interface Stats {
  total_lessons: number;
  total_countries: number;
}

export interface SubmitLessonRequest {
  person_name: string;
  person_age: number;
  country: string;
  life_lesson: string;
  story: string;
}

export interface SubmitLessonResponse {
  approved: boolean;
  lesson_id?: string;
  total_contributors?: number;
  message?: string;
}
