import React from "react";
import { createRoot } from "react-dom/client";
import WorkshopDashboard from "./WorkshopDashboard.jsx";
import { workshops } from "./fixtures.js";
import "./styles.css";
let nextId = 3;
createRoot(document.querySelector("#root")).render(<WorkshopDashboard initialWorkshops={workshops} createRegistrationId={() => `r${nextId++}`} />);
