import { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Routes, Route, Link } from "react-router-dom";

declare global {
  interface Window {
    google: any;
  }
}

const GOOGLE_CLIENT_ID =
  "498663745634-4vmhm4ceggentcmn0ask85jqkeeaqbt0.apps.googleusercontent.com";

const SCOPES =
  "https://www.googleapis.com/auth/calendar.events https://www.googleapis.com/auth/calendar.readonly";

type CalendarEvent = {
  id: string;
  title: string;
  start: string;
  end: string;
  notes?: string;
  category?: string;
  backgroundColor?: string;
  borderColor?: string;
};

const verses = [
  {
    arabic: "فَإِنَّ مَعَ الْعُسْرِ يُسْرًا ۝ إِنَّ مَعَ الْعُسْرِ يُسْرًا",
    english: "Indeed, with hardship comes ease. Indeed, with hardship comes ease.",
    reference: "Surah Ash-Sharh (94:5-6)",
    meaning: "Every difficulty is accompanied by relief.",
  },
  {
    arabic: "لَا يُكَلِّفُ اللَّهُ نَفْسًا إِلَّا وُسْعَهَا",
    english: "Allah does not burden a soul beyond that it can bear.",
    reference: "Surah Al-Baqarah (2:286)",
    meaning: "You are stronger than you think.",
  },
  {
    arabic: "لَا تَقْنَطُوا مِن رَّحْمَةِ اللَّهِ",
    english: "Do not despair of the mercy of Allah.",
    reference: "Surah Az-Zumar (39:53)",
    meaning: "No situation is beyond Allah's forgiveness.",
  },
  {
    arabic: "إِنَّ اللَّهَ مَعَ الصَّابِرِينَ",
    english: "Indeed, Allah is with the patient.",
    reference: "Surah Al-Baqarah (2:153)",
    meaning: "Patience brings Allah's support.",
  },
  {
    arabic: "وَمَا تَوْفِيقِي إِلَّا بِاللَّهِ",
    english: "My success is only through Allah.",
    reference: "Surah Hud (11:88)",
    meaning: "Every achievement comes from Allah.",
  },
  {
    arabic: "أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ",
    english: "Surely in the remembrance of Allah do hearts find rest.",
    reference: "Surah Ar-Ra'd (13:28)",
    meaning: "True peace comes from remembering Allah, not from worldly things.",
  },
];

function Dashboard({
  calendarEvents,
  connectGoogleCalendar,
  personalAccessToken,
  workAccessToken,
  fetchGoogleEvents,
  virelleStats,
  updateVirelleStat,
}: {
  calendarEvents: CalendarEvent[];
  connectGoogleCalendar: (type: "personal" | "work") => void;
  personalAccessToken: string | null;
  workAccessToken: string | null;
  fetchGoogleEvents: () => Promise<void>;
  virelleStats: {
    providers: number;
    investors: number;
    applications: number;
    fundingGoal: number;
    fundingRaised: number;
  };
  updateVirelleStat: (key: string, value: string) => void;
}) {
  
  const [tasks, setTasks] = useState<string[]>(() => {
    const saved = localStorage.getItem("tasks");
    return saved ? JSON.parse(saved) : [];
  });

  const [taskInput, setTaskInput] = useState("");
  const [notes, setNotes] = useState(() => localStorage.getItem("notes") || "");
  const [currentTime, setCurrentTime] = useState(new Date());

  const [goals, setGoals] = useState<string[]>(() => {
    const saved = localStorage.getItem("goals");
    return saved
      ? JSON.parse(saved)
      : ["Launch Virelle", "Land a software role", "Grow my network", "Stay consistent"];
  });

  const [goalInput, setGoalInput] = useState("");

  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

  const [intentions, setIntentions] = useState<string[]>(() => {
    const saved = localStorage.getItem("intentions");
    return saved
      ? JSON.parse(saved)
      : ["Pray on time", "Read Quran", "Work on Virelle", "Apply to jobs", "Take care of myself"];
  });

  const [intentionInput, setIntentionInput] = useState("");

  const [weeklyFocus] = useState<string[]>(() => {
    const saved = localStorage.getItem("weeklyFocus");
    return saved
      ? JSON.parse(saved)
      : ["Finish Virelle landing page", "Apply to 15 jobs", "Reach out to 5 investors"];
  });

  const dailyVerse = verses[new Date().getDate() % verses.length];

  const addTask = () => {
    if (!taskInput.trim()) return;
    setTasks([...tasks, taskInput]);
    setTaskInput("");
  };

  const addGoal = () => {
    if (!goalInput.trim()) return;
    setGoals([...goals, goalInput]);
    setGoalInput("");
  };

  const addIntention = () => {
    if (!intentionInput.trim()) return;
    setIntentions([...intentions, intentionInput]);
    setIntentionInput("");
  };

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem("notes", notes);
  }, [notes]);

  useEffect(() => {
    localStorage.setItem("goals", JSON.stringify(goals));
  }, [goals]);

  useEffect(() => {
    localStorage.setItem("intentions", JSON.stringify(intentions));
  }, [intentions]);

  useEffect(() => {
    localStorage.setItem("weeklyFocus", JSON.stringify(weeklyFocus));
  }, [weeklyFocus]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);


  return (
    <div className="dashboard">
      <div className="topBar">
        <div>
         <h1>Mahassin</h1>
<p className="subtitle">FOUNDER • BUILDER • DREAMER</p>
        </div>

        <h3>{currentTime.toLocaleString()}</h3>
      </div>

     <div className="grid">
  <div className="leftColumn">
    <div className="card todo-card">
      <h2>To Do List</h2>

      <div className="input-row">
        <input
          value={taskInput}
          onChange={(e) => setTaskInput(e.target.value)}
          placeholder="Add a task..."
        />
        <button onClick={addTask}>Add</button>
      </div>

      {tasks.map((task, index) => (
        <div className="task" key={index}>
          <span>{task}</span>
          <button onClick={() => setTasks(tasks.filter((_, i) => i !== index))}>
            ✕
          </button>
        </div>
      ))}
    </div>

    <div className="card intentions-card">
      <h2>Today's Intentions</h2>

      <div className="input-row">
        <input
          value={intentionInput}
          onChange={(e) => setIntentionInput(e.target.value)}
          placeholder="Add an intention..."
        />
        <button onClick={addIntention}>Add</button>
      </div>

      {intentions.map((intention, index) => (
        <div className="task" key={index}>
          <span>♡ {intention}</span>
          <button onClick={() => setIntentions(intentions.filter((_, i) => i !== index))}>
            ✕
          </button>
        </div>
      ))}
    </div>

    <div className="card notes-card">
      <h2>Notes</h2>
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Write reminders, ideas, or business notes..."
      />
    </div>
  </div>

  <div className="centerColumn">
    <div className="card calendar-card">
      <h2>Calendar</h2>

      <FullCalendar
        eventClick={(info) => {
          const clickedEvent = calendarEvents.find(
            (event) => event.id === info.event.id
          );

          if (clickedEvent) {
            setSelectedEvent(clickedEvent);
          }
        }}
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: "prev,next",
          center: "title",
          right: "",
        }}
        height="360px"
        events={calendarEvents}
      />

      <Link to="/planner">
        <button>Open Full Planner</button>
      </Link>
    </div>

    <div className="card quran-card">
      <h2>Quran Verse of the Day</h2>
      <p className="arabicVerse">{dailyVerse.arabic}</p>
      <p className="englishVerse">"{dailyVerse.english}"</p>
      <p className="reference">{dailyVerse.reference}</p>
      <p className="meaning">{dailyVerse.meaning}</p>
    </div>
  </div>

  {selectedEvent && (
    <div className="modalOverlay">
      <div className="eventModal">
        <h2>{selectedEvent.title}</h2>

        <p className="modalTime">
          {new Date(selectedEvent.start).toLocaleString()} -{" "}
          {new Date(selectedEvent.end).toLocaleTimeString()}
        </p>

        <div className="modalActions">
          <button onClick={() => setSelectedEvent(null)}>Close</button>

          <Link to="/planner">
            <button>Open in Planner</button>
          </Link>
        </div>
      </div>
    </div>
  )}

  <div className="rightColumn">
    <div className="card virelle-card">
      <h2>Virelle Dashboard</h2>

      <div className="virelleGrid">
        <div>
          <label>Providers</label>
          <input
            type="number"
            value={virelleStats.providers}
            onChange={(e) => updateVirelleStat("providers", e.target.value)}
          />
        </div>

        <div>
          <label>Investors</label>
          <input
            type="number"
            value={virelleStats.investors}
            onChange={(e) => updateVirelleStat("investors", e.target.value)}
          />
        </div>

        <div>
          <label>Applications</label>
          <input
            type="number"
            value={virelleStats.applications}
            onChange={(e) => updateVirelleStat("applications", e.target.value)}
          />
        </div>

        <div>
          <label>Raised ($)</label>
          <input
            type="number"
            value={virelleStats.fundingRaised}
            onChange={(e) => updateVirelleStat("fundingRaised", e.target.value)}
          />
        </div>
      </div>

      <div className="progressBar">
        <div
          className="progressFill"
          style={{
            width: `${Math.min(
              (virelleStats.fundingRaised / virelleStats.fundingGoal) * 100,
              100
            )}%`,
          }}
        />
      </div>

      <p className="progressText">
        ${virelleStats.fundingRaised.toLocaleString()} / $
        {virelleStats.fundingGoal.toLocaleString()}
      </p>
    </div>

      <div className="card">
      <h2>Quick Links</h2>

      <div className="quick-links">
        <a href="https://mail.google.com" target="_blank">Gmail</a>
        <a href="https://calendar.google.com" target="_blank">Calendar</a>
        <a href="https://www.linkedin.com" target="_blank">LinkedIn</a>
        <a href="https://github.com" target="_blank">GitHub</a>
        <a href="https://stripe.com" target="_blank">Stripe</a>
        <a href="https://www.squarespace.com" target="_blank">Squarespace</a>
      </div>

       <div className="card">
      <h2>Goals</h2>

      <div className="input-row">
        <input
          value={goalInput}
          onChange={(e) => setGoalInput(e.target.value)}
          placeholder="Add a goal..."
        />
        <button onClick={addGoal}>Add</button>
      </div>

      {goals.map((goal, index) => (
        <div className="task" key={index}>
          <span>🏆 {goal}</span>
          <button onClick={() => setGoals(goals.filter((_, i) => i !== index))}>
            ✕
          </button>
        </div>
      ))}
    </div>

    <div className="card connected-card">
      <h2>Connected Calendars</h2>

      <button onClick={() => connectGoogleCalendar("personal")}>
        {personalAccessToken ? "Personal Connected ✓" : "Connect Personal"}
      </button>

      <button onClick={() => connectGoogleCalendar("work")}>
        {workAccessToken ? "Work Connected ✓" : "Connect Work"}
      </button>

      <button onClick={fetchGoogleEvents}>Sync Calendars</button>
    </div>

  
    </div>
  </div>
</div>
      </div>
    
  );
}

function Planner({
  calendarEvents,
  setCalendarEvents,
  personalAccessToken,
  workAccessToken,
}: {
  calendarEvents: CalendarEvent[];
  setCalendarEvents: React.Dispatch<React.SetStateAction<CalendarEvent[]>>;
  personalAccessToken: string | null;
  workAccessToken: string | null;
}) {


  const [newEventTitle, setNewEventTitle] = useState("");
  const [newEventNotes, setNewEventNotes] = useState("");
  const [newEventCategory, setNewEventCategory] = useState("Business");
  const [selectedSlot, setSelectedSlot] = useState<{ start: string; end: string } | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [saveToCalendar, setSaveToCalendar] = useState("local");

  const categoryColors: Record<string, string> = {
    Business: "#d8c7b7",
    Personal: "#c7d8c7",
    Faith: "#c7cfe8",
    Job: "#e8d2c7",
  };

  const closeModal = () => {
    setSelectedSlot(null);
    setSelectedEvent(null);
    setNewEventTitle("");
    setNewEventNotes("");
    setNewEventCategory("Business");
  };

const saveEventToGoogle = async (
  token: string,
  title: string,
  start: string,
  end: string,
  notes: string
) => {
  await fetch(
    "https://www.googleapis.com/calendar/v3/calendars/primary/events",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        summary: title,
        description: notes,
        start: {
          dateTime: start,
        },
        end: {
          dateTime: end,
        },
      }),
    }
  );
};

return (
    <div className="dashboard">
      <div className="topBar">
        <h1>Planner</h1>

        <Link to="/">
          <button>Back to Dashboard</button>
        </Link>
      </div>

      <div className="card full-planner">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="timeGridWeek"
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay",
          }}
          height="80vh"
          nowIndicator={true}
          selectable={true}
          editable={true}
          select={(info) => {
            setSelectedSlot({
              start: info.startStr,
              end: info.endStr,
            });
          }}
          eventClick={(info) => {
            const clickedEvent = calendarEvents.find(
              (event) => event.id === info.event.id
            );

            if (clickedEvent) {
              setSelectedEvent(clickedEvent);
              setNewEventTitle(clickedEvent.title);
              setNewEventNotes(clickedEvent.notes || "");
              setNewEventCategory(clickedEvent.category || "Business");
            }
          }}

 
          eventDrop={(info) => {
            setCalendarEvents(
              calendarEvents.map((event) =>
                event.id === info.event.id
                  ? {
                      ...event,
                      start: info.event.startStr,
                      end: info.event.endStr,
                    }
                  : event
              )
            );
          }}

         

          eventResize={(info) => {
            setCalendarEvents(
              calendarEvents.map((event) =>
                event.id === info.event.id
                  ? {
                      ...event,
                      start: info.event.startStr,
                      end: info.event.endStr,
                    }
                  : event
              )
            );
          }}
          events={calendarEvents}
        />

        {(selectedSlot || selectedEvent) && (
          <div className="modalOverlay">
            <div className="eventModal">
              <h2>{selectedEvent ? "Event Details" : "Create Event"}</h2>

              <p className="modalTime">
                {selectedSlot &&
                  `${new Date(selectedSlot.start).toLocaleString()} - ${new Date(
                    selectedSlot.end
                  ).toLocaleTimeString()}`}

                {selectedEvent &&
                  `${new Date(selectedEvent.start).toLocaleString()} - ${new Date(
                    selectedEvent.end
                  ).toLocaleTimeString()}`}
              </p>

              <input
                value={newEventTitle}
                onChange={(e) => setNewEventTitle(e.target.value)}
                placeholder="Event title..."
                autoFocus
              />

              <textarea
                value={newEventNotes}
                onChange={(e) => setNewEventNotes(e.target.value)}
                placeholder="Event notes..."
                style={{ marginTop: "12px", minHeight: "100px" }}
              />

              <select
                value={newEventCategory}
                onChange={(e) => setNewEventCategory(e.target.value)}
                style={{
                  marginTop: "12px",
                  width: "100%",
                  padding: "12px",
                  borderRadius: "12px",
                  border: "1px solid #d8c7b7",
                }}
              >
                <option>Business</option>
                <option>Personal</option>
                <option>Faith</option>
                <option>Job</option>
              </select>

              <select
  value={saveToCalendar}
  onChange={(e) => setSaveToCalendar(e.target.value)}
  style={{
    marginTop: "12px",
    width: "100%",
    padding: "12px",
    borderRadius: "12px",
    border: "1px solid #d8c7b7",
  }}
>
  <option value="local">Local Only</option>
  <option value="personal">Personal Google Calendar</option>
  <option value="work">Work Google Calendar</option>
</select>

              

              <div className="modalActions">
                <button onClick={closeModal}>Cancel</button>

                {selectedEvent && (
                  <button
                    onClick={() => {
                      setCalendarEvents(
                        calendarEvents.filter((event) => event.id !== selectedEvent.id)
                      );
                      closeModal();
                    }}
                  >
                    Delete
                  </button>
                )}
<button
  onClick={async () => {
    if (!newEventTitle.trim()) return;

    const color = categoryColors[newEventCategory];

    if (selectedEvent) {
      setCalendarEvents(
        calendarEvents.map((event) =>
          event.id === selectedEvent.id
            ? {
                ...event,
                title: newEventTitle,
                notes: newEventNotes,
                category: newEventCategory,
                backgroundColor: color,
                borderColor: color,
              }
            : event
        )
      );
    } else if (selectedSlot) {
      const newEvent = {
        id: crypto.randomUUID(),
        title: newEventTitle,
        start: selectedSlot.start,
        end: selectedSlot.end,
        notes: newEventNotes,
        category: newEventCategory,
        backgroundColor: color,
        borderColor: color,
      };

      if (saveToCalendar === "personal" && personalAccessToken) {
        await saveEventToGoogle(
          personalAccessToken,
          newEventTitle,
          selectedSlot.start,
          selectedSlot.end,
          newEventNotes
        );
      }

      if (saveToCalendar === "work" && workAccessToken) {
        await saveEventToGoogle(
          workAccessToken,
          newEventTitle,
          selectedSlot.start,
          selectedSlot.end,
          newEventNotes
        );
      }

      setCalendarEvents([...calendarEvents, newEvent]);
    }

    closeModal();
  }}
>
  {selectedEvent ? "Save Changes" : "Save Event"}
</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function App() {
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>(() => {
    const saved = localStorage.getItem("calendarEvents");
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: "1",
            title: "Virelle Work Session",
            start: "2026-06-14T10:00:00",
            end: "2026-06-14T12:00:00",
          },
        ];
  });

  const [personalAccessToken, setPersonalAccessToken] = useState<string | null>(
  localStorage.getItem("personalAccessToken")
);

const [workAccessToken, setWorkAccessToken] = useState<string | null>(
  localStorage.getItem("workAccessToken")
);

const [virelleStats, setVirelleStats] = useState(() => {
  const saved = localStorage.getItem("virelleStats");
  return saved
    ? JSON.parse(saved)
    : {
        providers: 24,
        investors: 3,
        applications: 18,
        fundingGoal: 50000,
        fundingRaised: 1200,
      };
});

useEffect(() => {
  localStorage.setItem("virelleStats", JSON.stringify(virelleStats));
}, [virelleStats]);
useEffect(() => {
  if (personalAccessToken) {
    localStorage.setItem("personalAccessToken", personalAccessToken);
  }
}, [personalAccessToken]);

useEffect(() => {
  if (workAccessToken) {
    localStorage.setItem("workAccessToken", workAccessToken);
  }
}, [workAccessToken]);
  useEffect(() => {
    localStorage.setItem("calendarEvents", JSON.stringify(calendarEvents));
  }, [calendarEvents]);

  const updateVirelleStat = (key: string, value: string) => {
  setVirelleStats({
    ...virelleStats,
    [key]: Number(value),
  });
};

  const connectGoogleCalendar = (type: "personal" | "work") => {
  const tokenClient = window.google.accounts.oauth2.initTokenClient({
    client_id: GOOGLE_CLIENT_ID,
    scope: SCOPES,
    prompt: "select_account consent",
    callback: (response: any) => {
      if (response.access_token) {
        if (type === "personal") {
          setPersonalAccessToken(response.access_token);
          localStorage.setItem("personalAccessToken", response.access_token);
        } else {
          setWorkAccessToken(response.access_token);
          localStorage.setItem("workAccessToken", response.access_token);
        }
      }
    },
  });

  tokenClient.requestAccessToken();
};

const fetchGoogleEvents = async () => {
  const fetchEventsForToken = async (
    token: string,
    source: "personal" | "work"
  ) => {
    const response = await fetch(
      "https://www.googleapis.com/calendar/v3/calendars/primary/events?singleEvents=true&orderBy=startTime",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

   const data = await response.json();

console.log("Google Response:", data);

    return (data.items || []).map((event: any) => ({
      id: `${source}-${event.id}`,
      title: event.summary || "Untitled Event",
      start: event.start.dateTime || event.start.date,
      end: event.end.dateTime || event.end.date,
      category: source === "personal" ? "Personal" : "Work",
      backgroundColor: source === "personal" ? "#c7d8c7" : "#d8c7b7",
      borderColor: source === "personal" ? "#c7d8c7" : "#d8c7b7",
    }));
  };

  const allEvents = [];

  if (personalAccessToken) {
    allEvents.push(...(await fetchEventsForToken(personalAccessToken, "personal")));
  }

  if (workAccessToken) {
    allEvents.push(...(await fetchEventsForToken(workAccessToken, "work")));
  }

  setCalendarEvents(allEvents);
};

  return (
    <Routes>
      <Route
        path="/"
        element={
          <Dashboard
            calendarEvents={calendarEvents}
            connectGoogleCalendar={connectGoogleCalendar}
            personalAccessToken={personalAccessToken}
            workAccessToken={workAccessToken}
            fetchGoogleEvents={fetchGoogleEvents}
            virelleStats={virelleStats}
            updateVirelleStat={updateVirelleStat}
          />
        }
      />
      <Route
        path="/planner"
        element={
          <Planner
             calendarEvents={calendarEvents}
  setCalendarEvents={setCalendarEvents}
  personalAccessToken={personalAccessToken}
  workAccessToken={workAccessToken}
          />
        }
      />
    </Routes>
  );
}

export default App;