/**
 * Seed script — populates the lessons table from the FUEL World Wisdom Map CSV.
 *
 * Run with:
 *   npx tsx supabase/seed.ts
 *
 * Requires NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local
 */

import fs from "fs";
import path from "path";
import Papa from "papaparse";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config({ path: path.join(process.cwd(), ".env.local") });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Maps verbose TW column values to short keyword tags
function normalizeTriggerWarning(tw: string | undefined | null): string | null {
  if (!tw || !tw.trim()) return null;
  const t = tw.toLowerCase();
  if (t.includes("war")) return "war";
  if (t.includes("natural disaster") || t.includes("hurricane") || t.includes("flood")) return "natural disaster";
  if (t.includes("holocaust")) return "Holocaust";
  if (t.includes("abuse")) return "abuse";
  if (t.includes("grief") || t.includes("loss") || t.includes("bereavement")) return "grief";
  if (t.includes("death") || t.includes("died") || t.includes("suicide")) return "death";
  if (t.includes("addiction") || t.includes("alcohol") || t.includes("drug")) return "addiction";
  if (t.includes("mental health") || t.includes("depression") || t.includes("anxiety")) return "mental health";
  if (t.includes("trauma")) return "trauma";
  if (t.includes("violence")) return "violence";
  if (t.includes("illness") || t.includes("cancer") || t.includes("disease")) return "illness";
  if (t.includes("displacement") || t.includes("refugee")) return "displacement";
  if (t.includes("sexual assault") || t.includes("rape")) return "sexual assault";
  if (t.includes("poverty")) return "poverty";
  if (t.includes("racism") || t.includes("discrimination")) return "discrimination";
  // If there's any TW value we couldn't map, return a cleaned version of it
  return tw.trim().toLowerCase().replace(/^contains incidents of\s*/i, "");
}

// Normalize country names that may differ between CSV and our dropdown
const COUNTRY_OVERRIDES: Record<string, string> = {
  "usa": "United States",
  "united states of america": "United States",
  "u.s.a.": "United States",
  "uk": "United Kingdom",
  "great britain": "United Kingdom",
  "england": "United Kingdom",
  "scotland": "United Kingdom",
  "wales": "United Kingdom",
  "uae": "United Arab Emirates",
  "south korea": "South Korea",
  "north korea": "North Korea",
  "republic of korea": "South Korea",
  "drc": "Congo (Democratic Republic)",
  "democratic republic of congo": "Congo (Democratic Republic)",
  "republic of congo": "Congo (Republic)",
  "czech republic": "Czech Republic",
  "czechia": "Czech Republic",
  "russia": "Russia",
  "russian federation": "Russia",
  "iran": "Iran",
  "islamic republic of iran": "Iran",
  "syria": "Syria",
  "vietnam": "Vietnam",
  "viet nam": "Vietnam",
  "laos": "Laos",
  "lao pdr": "Laos",
  "taiwan": "Taiwan",
  "côte d'ivoire": "Ivory Coast",
  "ivory coast": "Ivory Coast",
  "cote d'ivoire": "Ivory Coast",
  "trinidad": "Trinidad and Tobago",
  "trinidad & tobago": "Trinidad and Tobago",
  "st. lucia": "Saint Lucia",
  "st lucia": "Saint Lucia",
  "st. kitts and nevis": "Saint Kitts and Nevis",
  "st. vincent and the grenadines": "Saint Vincent and the Grenadines",
  "sao tome & principe": "Sao Tome and Principe",
  "eswatini": "Eswatini",
  "swaziland": "Eswatini",
  "north macedonia": "North Macedonia",
  "macedonia": "North Macedonia",
  "myanmar": "Myanmar",
  "burma": "Myanmar",
  "cabo verde": "Cabo Verde",
  "cape verde": "Cabo Verde",
  "timor-leste": "Timor-Leste",
  "east timor": "Timor-Leste",
  "palestine": "Palestine",
  "west bank": "Palestine",
  "kosovo": "Kosovo",
};

function normalizeCountry(raw: string): string {
  const trimmed = raw.trim();
  const key = trimmed.toLowerCase();
  return COUNTRY_OVERRIDES[key] ?? trimmed;
}

interface CsvRow {
  "S.No.": string;
  "Country ": string; // trailing space in header
  "Have/Don't Have": string;
  "Person Contacting": string;
  "Name of the person": string;
  "Age": string;
  "TW": string;
  "Life Lesson": string;
  "Story behind the lesson": string;
  [key: string]: string;
}

async function seed() {
  const csvPath = path.join(process.cwd(), "supabase", "lessons.csv");
  const csvContent = fs.readFileSync(csvPath, "utf-8");

  const { data: rows, errors } = Papa.parse<CsvRow>(csvContent, {
    header: true,
    skipEmptyLines: true,
    trimHeaders: true,
  });

  if (errors.length > 0) {
    console.warn("CSV parse warnings:", errors.slice(0, 5));
  }

  const lessons: {
    person_name: string;
    person_age: number | null;
    country: string;
    life_lesson: string;
    story: string;
    trigger_warning: string | null;
    source: string;
    is_approved: boolean;
  }[] = [];

  let skipped = 0;
  let currentCountry = "";

  for (const row of rows) {
    // Track the current country — some rows don't have a country (continuation rows)
    const rawCountry = (row["Country"] ?? row["Country "] ?? "").trim();
    if (rawCountry) currentCountry = normalizeCountry(rawCountry);

    const personName = (row["Name of the person"] ?? "").trim();
    const lifeLesson = (row["Life Lesson"] ?? "").trim();
    const story = (row["Story behind the lesson"] ?? "").trim();

    // Skip if missing required fields
    if (!lifeLesson || !story) {
      skipped++;
      console.log(`Skipped (missing lesson/story): ${personName || "unknown"} from ${currentCountry}`);
      continue;
    }

    if (!currentCountry) {
      skipped++;
      console.log(`Skipped (no country): ${personName || "unknown"}`);
      continue;
    }

    const rawAge = (row["Age"] ?? "").trim();
    const age = rawAge && !isNaN(parseInt(rawAge)) ? parseInt(rawAge) : null;

    const tw = normalizeTriggerWarning(row["TW"]);

    lessons.push({
      person_name: personName || "Anonymous",
      person_age: age,
      country: currentCountry,
      life_lesson: lifeLesson,
      story,
      trigger_warning: tw,
      source: "seed",
      is_approved: true,
    });
  }

  console.log(`\nParsed ${lessons.length} lessons, skipped ${skipped} rows.`);
  console.log("Inserting into Supabase...\n");

  // Insert in batches of 50 to avoid request size limits
  const BATCH_SIZE = 50;
  let inserted = 0;

  for (let i = 0; i < lessons.length; i += BATCH_SIZE) {
    const batch = lessons.slice(i, i + BATCH_SIZE);
    const { error } = await supabase.from("lessons").insert(batch);
    if (error) {
      console.error(`Error inserting batch ${i / BATCH_SIZE + 1}:`, error.message);
    } else {
      inserted += batch.length;
      console.log(`Inserted batch ${Math.floor(i / BATCH_SIZE) + 1} (${inserted} total)`);
    }
  }

  console.log(`\nDone. ${inserted} lessons seeded successfully.`);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
