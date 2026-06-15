import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Link } from "react-router-dom";

export default function Planner() {
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
          events={[
            {
              title: "Virelle Work Session",
              start: "2026-06-14T10:00:00",
              end: "2026-06-14T12:00:00",
            },
          ]}
        />
      </div>
    </div>
  );
}