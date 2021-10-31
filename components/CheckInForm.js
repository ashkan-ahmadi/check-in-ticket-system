const CheckInForm = (props) => {
  const { handleSubmit, loading, handleTicketNumber, ticketNumber } = props
  return (
    <form onSubmit={handleSubmit} className="flex justify-center">
      <input
        type="number"
        id="ticketNumber"
        placeholder="Ticket number e.g. 2525009959"
        value={ticketNumber}
        onChange={handleTicketNumber}
        autoComplete="off"
        autoFocus={true}
        disabled={loading}
        className="ticket-field"
      />
      <button
        type="submit"
        className="btn btn-primary btn-lookupticket"
        disabled={loading}
      >Look up ticket</button>
    </form>
  )
}

export default CheckInForm
