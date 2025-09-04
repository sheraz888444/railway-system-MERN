# Ticket Booking Feature Implementation

## Backend
- [x] Booking model exists with passengers, train, dates, amounts
- [x] Booking routes exist: create, get my bookings, get by PNR, cancel
- [x] API endpoints secured with auth middleware

## Frontend
- [ ] Install jsPDF for PDF generation
- [ ] Create TicketBookingForm component
  - [ ] Form fields: passenger details (name, age, gender, seat class)
  - [ ] Train selection (preselected)
  - [ ] Journey date picker
  - [ ] Validation using react-hook-form and zod
  - [ ] Submit to bookingsAPI.createBooking
  - [ ] Handle success/error responses
- [ ] Create TicketDetails page/component
  - [ ] Display booking info: PNR, train details, passengers, journey date, amount
  - [ ] Print button (window.print)
  - [ ] Download PDF button (jsPDF)
- [ ] Update TrainCard component
  - [ ] Add onBook handler to open booking form
- [ ] Add routing for TicketDetails page
- [ ] Update Dashboard "Book Ticket" button
- [ ] Test booking flow end-to-end

## Testing
- [ ] Test booking form submission
- [ ] Test ticket details display
- [ ] Test print functionality
- [ ] Test PDF download
- [ ] Test error handling
