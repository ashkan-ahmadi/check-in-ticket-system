const TicketsTable = (props) => {
  const { tickets, checkTicketByTicketId } = props
  return (
    <table className="tickets-table">
      <thead>
        <tr>
          <th>Ticket Number</th>
          <th>First Name</th>
          <th>Last Name</th>
          <th>Email</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {tickets.map(ticket => (
          <tr key={ticket.id} className={ticket.ticketCheckedIn ? 'checked-in' : 'checked-out'}>
            <td>{ticket.ticketNumber}</td>
            <td>{ticket.ticketHolderFirstName}</td>
            <td>{ticket.ticketHolderLastName}</td>
            <td>{ticket.ticketHolderEmail}</td>
            <td>
              <button
                className={`btn btn-small ${ticket.ticketCheckedIn ? 'btn-danger-outline' : 'btn-primary'}`}
                onClick={() => {
                  ticket.ticketCheckedIn ? checkTicketByTicketId(ticket.id, 'out') : checkTicketByTicketId(ticket.id, 'in')
                }}
              >{ticket.ticketCheckedIn ? 'Check out' : 'Check in'}</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table >
  )
}

export default TicketsTable
