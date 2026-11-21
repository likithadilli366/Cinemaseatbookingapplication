
import './index.css'

const BookingSummary = ({
  movie,
  showTime,
  selectedSeats,
  ticketPrice,
  onConfirm,
}) => {
  const totalAmount = selectedSeats.length * ticketPrice

  return (
    <div className="booking-summary">
      <h2>🎟️ Booking Summary</h2>

      <div className="summary-details">
        <p>
          <span>Movie</span>
          <strong>{movie?.title || 'Not selected'}</strong>
        </p>

        <p>
          <span>Show Time</span>
          <strong>{showTime}</strong>
        </p>

        <p>
          <span>Selected Seats</span>
          <strong>
            {selectedSeats.length > 0
              ? selectedSeats.join(', ')
              : 'None'}
          </strong>
        </p>

        <p>
          <span>Ticket Price</span>
          <strong>₹{ticketPrice}</strong>
        </p>

        <p>
          <span>Seat Count</span>
          <strong>{selectedSeats.length}</strong>
        </p>
      </div>

      <div className="total-amount">
        <h3>Total Amount</h3>
        <h2>₹{totalAmount}</h2>
      </div>

      <button
        className="confirm-button"
        onClick={onConfirm}
        disabled={!movie || selectedSeats.length === 0}
      >
        Confirm Booking
      </button>
    </div>
  )
}

export default BookingSummary
