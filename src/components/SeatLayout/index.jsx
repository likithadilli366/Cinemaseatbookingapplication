
import Seat from '../Seat'
import './index.css'

const SeatLayout = ({bookedSeats, selectedSeats, onSeatSelect}) => {
  const rows = ['A', 'B', 'C', 'D', 'E', 'F']

  const getSeatStatus = seatId => {
    if (bookedSeats.includes(seatId)) {
      return 'booked'
    }

    if (selectedSeats.includes(seatId)) {
      return 'selected'
    }

    return 'available'
  }

  return (
    <div className="seat-layout">
      <div className="screen">SCREEN</div>

      <div className="seats-container">
        {rows.map(row => (
          <div className="seat-row" key={row}>
            <span className="row-label">{row}</span>

            {Array.from({length: 8}, (_, index) => {
              const seatId = `${row}${index + 1}`

              return (
                <Seat
                  key={seatId}
                  seatId={seatId}
                  status={getSeatStatus(seatId)}
                  onSelect={onSeatSelect}
                />
              )
            })}
          </div>
        ))}
      </div>

      <div className="seat-legend">
        <span><i className="available-box"></i> Available</span>
        <span><i className="selected-box"></i> Selected</span>
        <span><i className="booked-box"></i> Booked</span>
      </div>
    </div>
  )
}

export default SeatLayout
