// Contraexemplu furnizat: fără tranzacție, un eșec ulterior păstrează scrierile anterioare.
export async function unsafeBookSeats(
  { Event, Booking, BookingAudit },
  { eventId, attendeeId, seats, afterBookingCreated = async () => {} },
) {
  const event = await Event.findByPk(eventId);
  event.availableSeats -= seats;
  await event.save();
  const booking = await Booking.create({ eventId, attendeeId, seats });
  await afterBookingCreated({ booking, transaction: undefined });
  await BookingAudit.create({ bookingId: booking.id, eventId, attendeeId, seats, action: "created" });
  return { booking: booking.get({ plain: true }), event: event.get({ plain: true }) };
}
