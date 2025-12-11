import React from "react";

export default function SeatGrid({ seats, selected, onToggle }) {
  return (
    <div className="seat-grid">
      {seats.map((seat) => {
        const isBooked = seat.status !== "AVAILABLE";
        const isSelected = selected.includes(seat.seat_number);

        let className = "seat";
        if (isBooked) className += " booked";
        else if (isSelected) className += " selected";
        else className += " available";

        return (
          <div
            key={seat.seat_number}
            className={className}
            onClick={() => !isBooked && onToggle(seat.seat_number)}
          >
            {seat.seat_number}
          </div>
        );
      })}
    </div>
  );
}
