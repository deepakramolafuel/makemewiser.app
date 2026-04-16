import type {
  LessonResponse,
  Stats,
  SubmitLessonRequest,
  SubmitLessonResponse,
} from "./types";

export async function getRandomLesson(
  excludeIds: string[] = []
): Promise<LessonResponse | null> {
  const params = excludeIds.length
    ? `?exclude=${excludeIds.join(",")}`
    : "";
  const res = await fetch(`/api/random-lesson${params}`);
  if (!res.ok) return null;
  return res.json();
}

export async function getStats(): Promise<Stats> {
  const res = await fetch("/api/stats");
  if (!res.ok) return { total_lessons: 0, total_countries: 0 };
  return res.json();
}

export async function favouriteLesson(
  lessonId: string
): Promise<{ favourite_count: number } | null> {
  const res = await fetch("/api/favourite", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ lesson_id: lessonId }),
  });
  if (!res.ok) return null;
  return res.json();
}

export async function reportLesson(
  lessonId: string
): Promise<{ reported: boolean } | null> {
  const res = await fetch("/api/report", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ lesson_id: lessonId }),
  });
  if (!res.ok) return null;
  return res.json();
}

export async function submitLesson(
  data: SubmitLessonRequest
): Promise<SubmitLessonResponse> {
  const res = await fetch("/api/submit-lesson", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    return {
      approved: false,
      message:
        "Something went wrong. Please try again.",
    };
  }
  return res.json();
}
