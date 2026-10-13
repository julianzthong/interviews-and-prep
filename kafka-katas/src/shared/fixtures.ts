/** In-memory Tasker store for the matching katas. Not a database, on purpose. */
export type Tasker = {
  taskerId: string;
  name: string;
  categories: string[];
  zips: string[];
  busy: boolean;
};

export const CATEGORIES = ["furniture-assembly", "mounting", "moving-help", "handyman"] as const;

export const taskers: Tasker[] = [
  { taskerId: "t-001", name: "Ana",    categories: ["furniture-assembly", "mounting"], zips: ["94103", "94107"], busy: false },
  { taskerId: "t-002", name: "Ben",    categories: ["moving-help"],                    zips: ["94103"],          busy: false },
  { taskerId: "t-003", name: "Chioma", categories: ["furniture-assembly"],             zips: ["94110", "94103"], busy: false },
  { taskerId: "t-004", name: "Dev",    categories: ["handyman", "mounting"],           zips: ["94110"],          busy: false },
  { taskerId: "t-005", name: "Elena",  categories: ["furniture-assembly", "handyman"], zips: ["94107"],          busy: true  },
];
