
const Confirmation = ({booking, onClose}) => {
  if (!booking) {
    return null
  }

  return (
    <div className="confirmation">
      <h1>✅ Booking Confirmed!</h1>

      <p>Your tickets have been successfully booked.</p>

      <div className="confirmation-details">
        <p>Movie: {booking.movieTitle}</p>
        <p>Show Time: {booking.showTime}</p>
        <p>Seats: {booking.seats.join(', ')}</p>
        <p>Total Paid: ₹{booking.totalAmount}</p>
      </div>

      <button onClick={onClose}>
        Continue Booking
      </button>
    </div>
  )
}

export default Confirmation
