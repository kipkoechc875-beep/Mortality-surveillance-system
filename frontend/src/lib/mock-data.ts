import { subDays } from "date-fns";

export type RecordModel = {
  id: string;
  owner: string;
  name: string;
  age: number;
  sex: "Male" | "Female" | "Other";
  cause_of_death: string;
  location: string;
  date_of_death: string;
  created_at: string;
};

const CAUSES = [
  "Cardiovascular Disease",
  "Pneumonia",
  "Road Traffic Accident",
  "Cancer",
  "Sepsis",
  "Diabetes Complications",
  "Stroke",
  "Tuberculosis",
];

const LOCATIONS = [
  "Central Hospital",
  "North District Clinic",
  "Southside Medical Center",
  "East Valley Hospital",
  "Westwood Care Home",
];

const SAMPLE_OWNERS = ["admin", "user1", "health_officer"];

const generateMockData = (): RecordModel[] => {
  const records: RecordModel[] = [];
  const today = new Date();

  for (let i = 1; i <= 30; i++) {
    const age = Math.floor(Math.random() * 85) + 10;
    const sex = Math.random() > 0.5 ? "Male" : "Female";
    const cause = CAUSES[Math.floor(Math.random() * CAUSES.length)];
    const location = LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)];
    const date_of_death = subDays(today, Math.floor(Math.random() * 365)).toISOString();
    const owner = SAMPLE_OWNERS[i % SAMPLE_OWNERS.length];

    records.push({
      id: `REC-${1000 + i}`,
      owner,
      name: `Patient ${i}`,
      age,
      sex,
      cause_of_death: cause,
      location,
      date_of_death,
      created_at: new Date().toISOString(),
    });
  }

  return records.sort((a, b) => new Date(b.date_of_death).getTime() - new Date(a.date_of_death).getTime());
};

export const MOCK_RECORDS = generateMockData();
export { CAUSES, LOCATIONS };
