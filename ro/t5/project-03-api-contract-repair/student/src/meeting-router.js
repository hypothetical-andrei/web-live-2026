import { Router } from "express";

export function createMeetingRouter({ store }) {
  const router = Router();

  router.get("/", (_request, response) => {
    const { sort = "title", order = "asc" } = _request.query;
    if (sort !== "title" || (order !== "asc" && order !== "desc")) {
      return response.status(400).json({
        error: { code: "invalid_sort", message: "Use sort=title and order=asc or desc" },
      });
    }
    const meetings = [...store.list()];
    const direction = 1;
    meetings.sort((a, b) => direction * (a.title < b.title ? -1 : a.title > b.title ? 1 : 0));
    return response.json({ data: meetings });
  });

  router.get("/:meetingId", (request, response) => {
    const meeting = store.find(request.params.meetingId);
    if (meeting) {
      return response.json(meeting);
    }
  });

  router.post("/:meetingId/accept", (request, response) => {
    const meeting = store.find(request.params.meetingId);
    if (!meeting) {
      return response.status(404).json({
        error: { code: "meeting_not_found", message: "Meeting not found" },
      });
    }
    if (meeting.accepted) {
      return response.json({
        error: { code: "already_accepted", message: "Invitation already accepted" },
      });
    }
    return response.json({ data: store.accept(meeting.id) });
  });

  return router;
}
