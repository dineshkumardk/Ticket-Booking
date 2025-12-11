export default function SeatGrid({ seats, selected, onToggle }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(8, 50px)",
        gap: 8,
        marginTop: 20
      }}
    >
      {seats.map((seat) => {
        const isSelected = selected.includes(seat.seat_number);
        const isAvailable = seat.status === "AVAILABLE";

        return (
          <div
            key={seat.seat_number}
            onClick={() => {
              if (isAvailable) onToggle(seat.seat_number);
            }}
            style={{
              width: 50,
              height: 40,
              background: !isAvailable
                ? "#ccc"
                : isSelected
                ? "#4caf50"
                : "#fff",
              border: "1px solid #555",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: isAvailable ? "pointer" : "not-allowed",
              borderRadius: 4
            }}
          >
            {seat.seat_number}
          </div>
        );
      })}
    </div>
  );
}