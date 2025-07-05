import Papa from "papaparse"

export interface Person {
  id: string
  name: string
  title?: string
  company?: string
  location?: string
  email?: string
  phone?: string
  linkedin?: string
  github?: string
  website?: string
  bio?: string
  expertise?: string
  experience?: string
  education?: string
  type: 'mentor' | 'student' | 'professional'
  category?: string
  skills?: string[]
  interests?: string[]
  availability?: string
  languages?: string[]
  image?: string
  yearsExperience?: string
  state?: string
}

export interface MentorProfile {
  name: string
  linkedin: string
  company: string
  jobTitle: string
  email: string
  yearsExperience: string
  state: string
}

export interface SummerProgram {
  url: string;
  title: string;
  description: string;
  cost: string;
  acceptanceRate: string;
  applicationDeadline: string;
  sessions: string;
  targeted: string;
  location: string;
  competitive: string;
  officialUrl: string;
  name: string;
}

// Scholarship type for the new scholarships page
export interface Scholarship {
  title: string;
  degrees: string;
  funds: string;
  location: string;
}

const csvFiles = [
  "/webset-california.csv",
  "/webset-washington.csv",
  "/webset-arkansas.csv",
  "/webset-ohio.csv",
  "/webset-indiana.csv",
  "/webset-linkedin_profiles_yc_partners.csv",
  "/webset-linkedin_profiles_current_admissions_officers_t20_universities.csv",
  // New mentor websets (researchers)
  "/webset-linkedin_profiles_researcher_or_pi_high_school_projects_alabama.csv",
  "/webset-linkedin_profiles_researcher_or_pi_high_school_projects_alaska.csv",
  "/webset-linkedin_profiles_researcher_or_pi_high_school_projects_arizona.csv",
  "/webset-linkedin_profiles_researcher_or_pi_high_school_projects_colorado.csv",
  "/webset-linkedin_profiles_researcher_or_pi_high_school_projects_connecticut.csv",
  "/webset-linkedin_profiles_researcher_or_pi_high_school_projects_delaware.csv",
  "/webset-linkedin_profiles_researcher_or_pi_high_school_projects_florida.csv",
  "/webset-linkedin_profiles_researcher_or_pi_high_school_projects_georgia.csv",
  "/webset-linkedin_profiles_researcher_or_pi_high_school_projects_hawaii.csv"
]

function getStateFromFilename(filename: string): string {
  if (filename.includes("california")) return "California"
  if (filename.includes("washington")) return "Washington"
  if (filename.includes("arkansas")) return "Arkansas"
  if (filename.includes("ohio")) return "Ohio"
  if (filename.includes("indiana")) return "Indiana"
  if (filename.includes("alabama")) return "Alabama"
  if (filename.includes("alaska")) return "Alaska"
  if (filename.includes("arizona")) return "Arizona"
  if (filename.includes("colorado")) return "Colorado"
  if (filename.includes("connecticut")) return "Connecticut"
  if (filename.includes("delaware")) return "Delaware"
  if (filename.includes("florida")) return "Florida"
  if (filename.includes("georgia")) return "Georgia"
  if (filename.includes("hawaii")) return "Hawaii"
  if (filename.includes("yc_partners")) return "Y Combinator"
  if (filename.includes("admissions_officers")) return "Admissions Officer"
  return "Unknown"
}

export async function loadAllMentors(): Promise<MentorProfile[]> {
  const allMentors: MentorProfile[] = []

  for (const file of csvFiles) {
    try {
      // Always use relative URL for client-side fetch
      const res = await fetch(file)
      if (!res.ok) {
        console.warn(`Failed to load ${file}: ${res.statusText}`)
        continue
      }
      const text = await res.text()
      const { data } = Papa.parse(text, { header: true, skipEmptyLines: true })
      let state = getStateFromFilename(file)
      
      for (const row of data as any[]) {
        // Skip incomplete
        if (!row["Title"] || !row["URL"]) {
          continue
        }
        
        // Special handling for different file types
        if (file.includes("yc_partners")) {
          allMentors.push({
            name: row["Title"].trim(),
            linkedin: row["URL"].trim(),
            company: row["Company"]?.trim() || "",
            jobTitle: row["Job Title"]?.trim() || "",
            email: row["Work Email (Result)"]?.trim() || "",
            yearsExperience: row["Years Experience (Result)"]?.trim() || "",
            state: state
          })
        } else if (file.includes("researcher_or_pi_high_school_projects")) {
          // Handle new researcher files
          allMentors.push({
            name: row["Title"].trim(),
            linkedin: row["URL"].trim(),
            company: row["Company"]?.trim() || "",
            jobTitle: row["Job Title"]?.trim() || "",
            email: row["Email (Result)"]?.trim() || "",
            yearsExperience: row["Years Experience (Result)"]?.trim() || "",
            state: state
          })
        }
      }
    } catch (error) {
      console.error(`Error loading ${file}:`, error)
    }
  }

  return allMentors
}

export async function loadCSVPeople(): Promise<Person[]> {
  const allPeople: Person[] = []
  let idCounter = 1

  for (const csvFile of csvFiles) {
    try {
      const response = await fetch(csvFile)
      if (!response.ok) {
        console.warn(`Failed to load ${csvFile}: ${response.statusText}`)
        continue
      }

      const csvText = await response.text()
      const lines = csvText.split('\n')
      const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''))
      
      // Skip header row and process data rows
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim()
        if (!line) continue

        // Handle CSV parsing with potential commas in quoted fields
        const values: string[] = []
        let current = ''
        let inQuotes = false
        
        for (let j = 0; j < line.length; j++) {
          const char = line[j]
          if (char === '"') {
            inQuotes = !inQuotes
          } else if (char === ',' && !inQuotes) {
            values.push(current.trim())
            current = ''
          } else {
            current += char
          }
        }
        values.push(current.trim()) // Add the last value

        if (values.length < headers.length) {
          console.warn(`Skipping malformed row ${i} in ${csvFile}`)
          continue
        }

        const row: { [key: string]: string } = {}
        headers.forEach((header, index) => {
          row[header] = values[index] || ''
        })

        // Extract state from filename
        const state = csvFile.replace('/webset-', '').replace('.csv', '')

        // Map CSV data to Person interface
        const person: Person = {
          id: `person-${idCounter++}`,
          name: row['Title'] || row['Name'] || 'Unknown',
          title: row['Job Title'] || row['Professional title or role is researcher or principal investigator (Criterion)'] || '',
          company: row['Company'] || '',
          location: row['Currently works in California (Criterion)'] || row['Currently works in Washington (Criterion)'] || row['Currently works in Arkansas (Criterion)'] || row['Currently works in Ohio (Criterion)'] || row['Currently works in Indiana (Criterion)'] || '',
          email: row['Email (Result)'] || '',
          linkedin: row['URL'] || '',
          bio: row['Professional title or role is researcher or principal investigator (Reasoning)'] || '',
          expertise: row['Demonstrated involvement in projects, programs, or research activities with high school students (Reasoning)'] || '',
          experience: row['Years Experience (Result)'] || '',
          type: 'mentor', // All CSV data appears to be mentors
          category: 'Research', // Default category
          skills: [], // Will be extracted from bio/expertise if needed
          state: state,
          yearsExperience: row['Years Experience (Result)'] || ''
        }

        // Extract skills from bio/expertise if available
        if (person.bio) {
          const skillKeywords = ['research', 'data analysis', 'statistics', 'programming', 'python', 'r', 'sql', 'machine learning', 'ai', 'evaluation', 'assessment', 'mentoring', 'education', 'stem', 'science', 'mathematics', 'engineering', 'technology']
          const foundSkills = skillKeywords.filter(skill => 
            person.bio?.toLowerCase().includes(skill.toLowerCase()) ||
            person.expertise?.toLowerCase().includes(skill.toLowerCase())
          )
          person.skills = foundSkills.slice(0, 5) // Limit to 5 skills
        }

        // Only add if we have at least a name
        if (person.name && person.name !== 'Unknown') {
          allPeople.push(person)
        }
      }
    } catch (error) {
      console.error(`Error loading ${csvFile}:`, error)
    }
  }

  return allPeople
}

export async function loadAllSummerPrograms(): Promise<SummerProgram[]> {
  const res = await fetch("/webset-summer_programs_competitive_high_school_u_s.csv");
  const text = await res.text();
  const { data } = Papa.parse(text, { header: true, skipEmptyLines: true });
  return (data as any[]).map(row => ({
    url: row["URL"] || "",
    title: row["Title"] || row["Name of Summer Program (Result)"] || "",
    description: row["Description"] || row["Description of summer program (Result)"] || "",
    cost: row["Cost (Result)"] || "",
    acceptanceRate: row["Acceptance Rate (Result)"] || "",
    applicationDeadline: row["Application Deadline (Result)"] || "",
    sessions: row["Program Sessions, Dates (Result)"] || "",
    targeted: row["Is targeted toward low-income/first-gen (Result)"] || "",
    location: row["program is located in the united states (Criterion)"] || "",
    competitive: row["program is competitive, demonstrated by selective admissions or application process (Criterion)"] || "",
    officialUrl: row["url is the official page for the specific program (Criterion)"] || row["URL"] || "",
    name: row["Name of Summer Program (Result)"] || row["Title"] || "",
  }));
}

// Load all scholarships from the CSV file in public directory
export async function loadAllScholarships(): Promise<Scholarship[]> {
  const res = await fetch("/Universities_Schoolarships_All_Around_the_World.csv");
  const text = await res.text();
  const { data } = Papa.parse(text, { header: true, skipEmptyLines: true });
  return (data as any[]).map(row => ({
    title: row["title"] || "",
    degrees: row["degrees"] || "",
    funds: row["funds"] || "",
    location: row["location"] || "",
  }));
}

// Note: This function must be called from the browser (client-side) only. 