import React from "react";
import { render } from "@testing-library/react";
import { workshops } from "../src/fixtures.js";
export function renderDashboard(Component) { let next = 3; return render(<Component initialWorkshops={workshops} createRegistrationId={() => `r${next++}`} />); }
