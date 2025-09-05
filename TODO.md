# Railway System Fixes

## Issues to Fix:
1. **Search Bar Not Working**: Make search case-insensitive and include train name/number
2. **Ticket Booking Error**: Fix prop mismatch between TrainSelector (_id) and TicketBookingForm (id)
3. **Improve Search Functionality**: Add better search capabilities

## Tasks:
- [ ] Update TrainSelector.tsx to make search case-insensitive
- [ ] Add search by train name and train number in TrainSelector
- [ ] Fix prop mismatch: Update TrainSelector to pass 'id' or update TicketBookingForm to use '_id'
- [ ] Remove hardcoded train object in Dashboard.tsx
- [ ] Test search functionality
- [ ] Test ticket booking
