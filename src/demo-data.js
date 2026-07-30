/* ==================================================================
 * TEMPORARY DEMO DATA — DELETE THIS FILE WHEN YOU GO LIVE
 * ==================================================================
 * To remove the demo feature completely, delete:
 *   1. this file (src/demo-data.js)
 *   2. the `import { ... } from "./demo-data.js"` line in transfer-desk.jsx
 *   3. the <DemoBar .../> block in transfer-desk.jsx (marked DEMO)
 *   4. the seedDemo / clearBoard functions in transfer-desk.jsx (marked DEMO)
 * Nothing else references it.
 * ================================================================== */

const pad = (n) => String(n).padStart(2, "0");
const iso = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

/** Date N days from today, as YYYY-MM-DD. Negative = in the past. */
const day = (n) => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + n);
  return iso(d);
};
const hoursAgo = (h) => Date.now() - h * 3600 * 1000;

/* ------------------------------------------------------------------ */
/*  Prefill for the New Transfer form                                  */
/* ------------------------------------------------------------------ */

/** Ready-made flights. Each click cycles to the next one, so you can post
 *  several different transfers in a row without typing anything. */
const FORM_SAMPLES = [
  {
    direction: "arrival", passenger: "Ana Popescu", pax: 1,
    flightNo: "TK1854", airport: "OTP T1", time: "14:35", pickupTime: "15:05",
    from: "OTP T1 arrivals hall", to: "Bonatti site office, Ploiești",
    phone: "+40 744 902 551",
    notes: "One suitcase. Needs to be on site before 17:00.",
  },
  {
    direction: "departure", passenger: "Sorin Ilie", pax: 3,
    flightNo: "RO263", airport: "OTP T2", time: "11:30", pickupTime: "09:00",
    from: "Crowne Plaza, Bucharest", to: "OTP T2 departures",
    phone: "+40 733 610 087",
    notes: "Three passengers plus survey equipment — needs the van, not a car.",
  },
  {
    direction: "arrival", passenger: "Giulia Bernardi", pax: 2,
    flightNo: "AZ1041", airport: "OTP T1", time: "09:05", pickupTime: "09:35",
    from: "OTP T1 arrivals hall", to: "Hotel Novotel, Bucharest",
    phone: "+39 340 552 7719",
    notes: "Italian speaker preferred if possible.",
  },
  {
    direction: "departure", passenger: "Hans Vogel", pax: 1,
    flightNo: "LH1416", airport: "OTP T1", time: "15:00", pickupTime: "12:30",
    from: "Hotel Marriott, Bucharest", to: "OTP T1 departures",
    phone: "+49 171 884 2260",
    notes: "",
  },
];

let formTurn = 0;

/**
 * One filled-in transfer, ready to post. Dated tomorrow so the pick-up time
 * is always still ahead of you.
 */
export function makeDemoFormData() {
  const sample = FORM_SAMPLES[formTurn % FORM_SAMPLES.length];
  formTurn += 1;
  return { ...sample, date: day(1) };
}

/** Airports and outside services the demo rows reference. */
export const DEMO_CONF = {
  airports: ["OTP T1", "OTP T2", "CLJ", "FCO T3"],
  services: ["City Cabs", "AirLink Shuttle", "Prime Transfers"],
  currency: "EUR",
};

/**
 * A full week of realistic traffic covering every state the app can show:
 * waiting, overdue, in-house, outside service, completed (with and without a
 * logged cost), and cancelled — spread across past and future days so the
 * Board, Month calendar, Weekly report and Monthly costs all have something
 * to display.
 *
 * @param {string} who - name used as the poster, so it looks like your own board.
 */
export function makeDemoTransfers(who = "Elena") {
  const rows = [
    /* ---- OVERDUE: pending, but the flight already landed yesterday ---- */
    {
      direction: "arrival", passenger: "Marco Ferretti", pax: 2,
      flightNo: "AZ1043", airport: "OTP T1",
      date: day(-1), time: "18:25", pickupTime: "18:55",
      from: "OTP T1 arrivals hall", to: "Hotel Intercontinental, Bucharest",
      phone: "+40 721 118 204",
      notes: "Two large cases. Site visit — needs to reach the office by 20:30.",
      status: "pending", handler: "", createdBy: who, createdAt: hoursAgo(30),
      thread: [{ by: "Reception", text: "Passenger called — still waiting at arrivals.", at: hoursAgo(2) }],
    },

    /* ---- WAITING: today and upcoming, needs a logistics decision ---- */
    {
      direction: "arrival", passenger: "Ana Popescu", pax: 1,
      flightNo: "TK1854", airport: "OTP T1",
      date: day(0), time: "14:35", pickupTime: "15:05",
      from: "OTP T1 arrivals hall", to: "Bonatti site office, Ploiești",
      phone: "+40 744 902 551",
      notes: "",
      status: "pending", handler: "", createdBy: who, createdAt: hoursAgo(5),
      thread: [],
    },
    {
      direction: "departure", passenger: "Sorin Ilie", pax: 3,
      flightNo: "RO263", airport: "OTP T2",
      date: day(1), time: "11:30", pickupTime: "09:00",
      from: "Crowne Plaza, Bucharest", to: "OTP T2 departures",
      phone: "+40 733 610 087",
      notes: "Three passengers plus survey equipment — needs the van, not a car.",
      status: "pending", handler: "", createdBy: who, createdAt: hoursAgo(20),
      thread: [],
    },

    /* ---- IN-HOUSE: accepted, one of our drivers has it ---- */
    {
      direction: "departure", passenger: "Elif Demir", pax: 1,
      flightNo: "TK1042", airport: "OTP T1",
      date: day(0), time: "19:20", pickupTime: "16:50",
      from: "Bonatti site office, Ploiești", to: "OTP T1 departures",
      phone: "+90 532 447 1180",
      notes: "",
      status: "accepted", handler: "Mihai — van 2", createdBy: who, createdAt: hoursAgo(26),
      thread: [{ by: "Mihai", text: "Confirmed, I'll leave the yard at 16:15.", at: hoursAgo(9) }],
    },
    {
      direction: "arrival", passenger: "Giulia Bernardi", pax: 2,
      flightNo: "AZ1041", airport: "OTP T1",
      date: day(2), time: "09:05", pickupTime: "09:35",
      from: "OTP T1 arrivals hall", to: "Hotel Novotel, Bucharest",
      phone: "+39 340 552 7719",
      notes: "Italian speaker preferred if possible.",
      status: "accepted", handler: "Andrei — car 4", createdBy: who, createdAt: hoursAgo(14),
      thread: [],
    },

    /* ---- OUTSIDE SERVICE: delegated, cost not logged yet ---- */
    {
      direction: "arrival", passenger: "Tomasz Wójcik", pax: 1,
      flightNo: "LO641", airport: "OTP T2",
      date: day(1), time: "22:40", pickupTime: "23:10",
      from: "OTP T2 arrivals hall", to: "Hotel Radisson Blu, Bucharest",
      phone: "+48 605 220 991",
      notes: "Late landing — both vans already booked that night.",
      status: "external", handler: "City Cabs", wasExternal: true,
      createdBy: who, createdAt: hoursAgo(18),
      thread: [{ by: "Logistics", text: "Booked with City Cabs, ref CC-88214.", at: hoursAgo(16) }],
    },

    /* ---- COMPLETED: in-house, closed off ---- */
    {
      direction: "arrival", passenger: "Radu Constantin", pax: 1,
      flightNo: "RO302", airport: "OTP T1",
      date: day(-2), time: "13:00", pickupTime: "13:30",
      from: "OTP T1 arrivals hall", to: "Bonatti site office, Ploiești",
      phone: "+40 726 331 470",
      notes: "",
      status: "done", handler: "Mihai — van 2", createdBy: who,
      createdAt: hoursAgo(70), doneAt: hoursAgo(46),
      thread: [],
    },
    {
      direction: "departure", passenger: "Hans Vogel", pax: 2,
      flightNo: "LH1416", airport: "OTP T1",
      date: day(-4), time: "15:00", pickupTime: "12:30",
      from: "Hotel Marriott, Bucharest", to: "OTP T1 departures",
      phone: "+49 171 884 2260",
      notes: "",
      status: "done", handler: "Andrei — car 4", createdBy: who,
      createdAt: hoursAgo(120), doneAt: hoursAgo(96),
      thread: [],
    },

    /* ---- COMPLETED via outside service, WITH costs (feeds Monthly costs) ---- */
    {
      direction: "departure", passenger: "Laura Marchetti", pax: 1,
      flightNo: "AZ1044", airport: "OTP T1",
      date: day(-4), time: "06:30", pickupTime: "04:00",
      from: "Hotel Intercontinental, Bucharest", to: "OTP T1 departures",
      phone: "+39 335 771 4402",
      notes: "Pre-dawn run — sent out rather than waking a driver.",
      status: "done", handler: "City Cabs", wasExternal: true, cost: 145,
      createdBy: who, createdAt: hoursAgo(150), doneAt: hoursAgo(101),
      thread: [],
    },
    {
      direction: "arrival", passenger: "Nikolai Petrov", pax: 4,
      flightNo: "SU2038", airport: "OTP T2",
      date: day(-5), time: "22:10", pickupTime: "22:40",
      from: "OTP T2 arrivals hall", to: "Hotel Sheraton, Bucharest",
      phone: "+7 916 220 3345",
      notes: "Four passengers — outside minibus.",
      status: "done", handler: "AirLink Shuttle", wasExternal: true, cost: 210,
      createdBy: who, createdAt: hoursAgo(180), doneAt: hoursAgo(125),
      thread: [],
    },
    {
      direction: "departure", passenger: "Camille Rousseau", pax: 1,
      flightNo: "AF1389", airport: "OTP T1",
      date: day(-6), time: "17:45", pickupTime: "15:15",
      from: "Bonatti site office, Ploiești", to: "OTP T1 departures",
      phone: "+33 6 12 88 40 21",
      notes: "",
      status: "done", handler: "Prime Transfers", wasExternal: true, cost: 168.5,
      createdBy: who, createdAt: hoursAgo(200), doneAt: hoursAgo(149),
      thread: [],
    },

    /* ---- COMPLETED outside service, cost still MISSING (shows in "Waiting for a cost") ---- */
    {
      direction: "arrival", passenger: "Ibrahim Al-Sayed", pax: 2,
      flightNo: "MS745", airport: "OTP T1",
      date: day(-3), time: "11:20", pickupTime: "11:50",
      from: "OTP T1 arrivals hall", to: "Hotel Novotel, Bucharest",
      phone: "+20 100 448 9930",
      notes: "Invoice not received from the service yet.",
      status: "done", handler: "City Cabs", wasExternal: true,
      createdBy: who, createdAt: hoursAgo(96), doneAt: hoursAgo(72),
      thread: [],
    },

    /* ---- CANCELLED ---- */
    {
      direction: "arrival", passenger: "Petra Novák", pax: 1,
      flightNo: "OK936", airport: "OTP T1",
      date: day(-2), time: "10:20", pickupTime: "10:50",
      from: "OTP T1 arrivals hall", to: "Hotel Radisson Blu, Bucharest",
      phone: "+420 602 118 774",
      notes: "Flight cancelled by the airline, rebooked for next month.",
      status: "cancelled", handler: "", createdBy: who,
      createdAt: hoursAgo(80),
      thread: [],
    },
  ];

  // Stable, collision-free ids so repeated seeding stays predictable.
  return rows.map((r, i) => ({
    id: `demo-${i + 1}`,
    cost: null,
    updatedAt: r.doneAt || r.createdAt,
    ...r,
  }));
}
