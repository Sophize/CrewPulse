export interface Holiday {
  date: string;
  day: string;
  holiday: string;
  note?: string;
  type: "MANDATORY" | "OPTIONAL";
}

export const MANDATORY_HOLIDAYS: Holiday[] = [
  { date: "Jan 26", day: "Sunday",    holiday: "Republic Day", type: "MANDATORY" },
  { date: "Mar 14", day: "Friday",    holiday: "Holi", type: "MANDATORY" },
  { date: "Apr 14", day: "Monday",    holiday: "Dr. Ambedkar Jayanti", type: "MANDATORY" },
  { date: "Apr 18", day: "Friday",    holiday: "Good Friday", type: "MANDATORY" },
  { date: "May 1",  day: "Thursday",  holiday: "Maharashtra Day", type: "MANDATORY" },
  { date: "Aug 15", day: "Friday",    holiday: "Independence Day", type: "MANDATORY" },
  { date: "Oct 2",  day: "Thursday",  holiday: "Gandhi Jayanti", type: "MANDATORY" },
  { date: "Oct 20", day: "Monday",    holiday: "Dussehra", type: "MANDATORY" },
  { date: "Nov 5",  day: "Wednesday", holiday: "Diwali (Laxmi Puja)", type: "MANDATORY" },
  { date: "Dec 25", day: "Thursday",  holiday: "Christmas", type: "MANDATORY" },
];

export const OPTIONAL_HOLIDAYS: Holiday[] = [
  { date: "Jan 14", day: "Tuesday",   holiday: "Makar Sankranti / Pongal", type: "OPTIONAL" },
  { date: "Mar 31", day: "Monday",    holiday: "Id-ul-Fitr (Eid)", type: "OPTIONAL" },
  { date: "Apr 10", day: "Thursday",  holiday: "Mahavir Jayanti", type: "OPTIONAL" },
  { date: "May 12", day: "Monday",    holiday: "Buddha Purnima", type: "OPTIONAL" },
  { date: "Jun 7",  day: "Saturday",  holiday: "Id-ul-Zuha (Bakri Eid)", type: "OPTIONAL" },
  { date: "Aug 9",  day: "Saturday",  holiday: "Muharram", type: "OPTIONAL" },
  { date: "Aug 16", day: "Saturday",  holiday: "Parsi New Year", type: "OPTIONAL" },
  { date: "Sep 5",  day: "Friday",    holiday: "Ganesh Chaturthi", type: "OPTIONAL" },
  { date: "Oct 3",  day: "Friday",    holiday: "Navratri (1st day)", type: "OPTIONAL" },
  { date: "Nov 5",  day: "Wednesday", holiday: "Diwali (Naraka Chaturdashi)", note: "alt day", type: "OPTIONAL" },
  { date: "Nov 15", day: "Saturday",  holiday: "Guru Nanak Jayanti", type: "OPTIONAL" },
];

export const ALL_HOLIDAYS: Holiday[] = [
  ...MANDATORY_HOLIDAYS,
  ...OPTIONAL_HOLIDAYS,
];
