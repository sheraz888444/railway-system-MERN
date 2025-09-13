# TODO: Fix Booking Error and Add Seat Availability Feature

## Backend Changes
- [x] Fix seat booking logic in backend/routes/bookings.js:
  - Ensure proper seat availability check before booking
  - Update seat status to booked after successful booking
  - Handle seat unbooking on booking cancellation
- [x] Add seat availability API endpoint in backend/routes/trains.js (if needed for frontend)

## Frontend Changes
- [x] Update admin dashboard in frontend/src/components/Dashboard.tsx:
  - Display total seats, booked seats, and available seats for each train
- [x] Update passenger dashboard if needed to show seat availability
- [x] Update staff dashboard if needed to show seat availability
- [x] Modify frontend/src/components/TicketBookingForm.tsx:
  - Fetch and display available seats for the selected train
  - Validate seat selection against available seats
  - Show error messages for unavailable seats

## Testing
- [ ] Test booking flow to ensure no index errors
- [ ] Test seat availability display in dashboards
- [ ] Test seat selection and validation in booking form
- [ ] Test booking cancellation and seat unbooking
