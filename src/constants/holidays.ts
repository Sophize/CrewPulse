export interface Holiday {
  date: string;
  day: string;
  holiday: string;
  note?: string;
  type: "MANDATORY" | "OPTIONAL";
}

export const MANDATORY_HOLIDAYS: Holiday[] = [
  {
    date: "Jan 1",
    day: "Thursday",
    holiday: "New Year’s Day",
    type: "MANDATORY",
  },
  { date: "Jan 26", day: "Monday", holiday: "Republic Day", type: "MANDATORY" },
  {
    date: "May 1",
    day: "Friday",
    holiday: "May Day/Budh Purnima",
    type: "MANDATORY",
  },
  {
    date: "Aug 15",
    day: "Saturday",
    holiday: "Independence Day",
    type: "MANDATORY",
  },
  {
    date: "Aug 28",
    day: "Friday",
    holiday: "Rakshabandhan (Only North India)",
    type: "MANDATORY",
  },
  {
    date: "Oct 2",
    day: "Friday",
    holiday: "Gandhi Jayanti",
    type: "MANDATORY",
  },
  { date: "Oct 20", day: "Tuesday", holiday: "Dussehra", type: "MANDATORY" },
  {
    date: "Nov 9",
    day: "Monday",
    holiday: "Diwali (Laxmi Puja)",
    type: "MANDATORY",
  },
  { date: "Nov 10", day: "Tuesday", holiday: "Diwali", type: "MANDATORY" },
];

export const OPTIONAL_HOLIDAYS: Holiday[] = [
  {
    date: "Jan 14",
    day: "Wednesday",
    holiday: "Makar Sankranti / Pongal",
    type: "OPTIONAL",
  },
  {
    date: "Feb 15",
    day: "Sunday",
    holiday: "Maha Shivratri",
    type: "OPTIONAL",
  },
  {
    date: "Mar 4",
    day: "Wednesday",
    holiday: "Holi",
    type: "OPTIONAL",
  },
  {
    date: "Mar 31",
    day: "Tuesday",
    holiday: "Mahavir Jayanti",
    type: "OPTIONAL",
  },
  {
    date: "April 3",
    day: "Friday",
    holiday: "Good Friday",
    type: "OPTIONAL",
  },
  {
    date: "April 14",
    day: "Tuesday",
    holiday: "Ambedkar Jayanti",
    type: "OPTIONAL",
  },

  {
    date: "Sep  4",
    day: "Friday",
    holiday: "Janmashtami",
    type: "OPTIONAL",
  },
  {
    date: "Sep 14",
    day: "Monday",
    holiday: "Ganesh Chaturthi",
    type: "OPTIONAL",
  },
  {
    date: "Oct 21",
    day: "Wednesday",
    holiday: "Dasami",
    type: "OPTIONAL",
  },
  {
    date: "Nov 13",
    day: "Friday",
    holiday: "Chhath Puja",
    type: "OPTIONAL",
  },
  {
    date: "Nov 16",
    day: "Monday",
    holiday: "Chhath Puja",
    type: "OPTIONAL",
  },
  {
    date: "Nov 24",
    day: "Tuesday",
    holiday: "Guru Nanak Jayanti",
    type: "OPTIONAL",
  },
  {
    date: "Dec 25",
    day: "Friday",
    holiday: "Christmas",
    type: "OPTIONAL",
  },
  {
    date: "Dec 31",
    day: "Thursday",
    holiday: "New Year eve",
    type: "OPTIONAL",
  },
];

export const ALL_HOLIDAYS: Holiday[] = [
  ...MANDATORY_HOLIDAYS,
  ...OPTIONAL_HOLIDAYS,
];
