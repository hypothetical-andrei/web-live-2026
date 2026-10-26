// Stocarea este furnizată pentru a concentra exercițiul pe comportamentul HTTP.
const seed = [
  { id: "m1", title: "Zebra planning", accepted: false },
  { id: "m2", title: "Alpha review", accepted: true },
  { id: "m3", title: "Middle workshop", accepted: false },
];

export function createMeetingStore() {
  const meetings = seed.map((meeting) => ({ ...meeting }));
  return {
    list: () => meetings.map((meeting) => ({ ...meeting })),
    find: (id) => {
      const meeting = meetings.find((item) => item.id === id);
      return meeting ? { ...meeting } : null;
    },
    accept: (id) => {
      const meeting = meetings.find((item) => item.id === id);
      if (!meeting) throw new Error("Store accept requires an existing meeting");
      meeting.accepted = true;
      return { ...meeting };
    },
  };
}
