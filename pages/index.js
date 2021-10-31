import React, { useState, useEffect } from 'react'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import TicketsTable from '../components/TicketsTable'
import CheckInForm from '../components/CheckInForm'

const Home = () => {
  const [tickets, setTickets] = useState([])
  const [ticketNumber, setTicketNumber] = useState('')
  const [loading, setLoading] = useState(false)

  const countCheckedInTickets = () => {
    const count = tickets.filter(ticket => {
      return ticket.ticketCheckedIn
    })
    return count.length
  }

  const fetchTickets = async () => {
    setTicketNumber('')
    setLoading(true)
    const url = `http://localhost:5000/tickets`
    const request = await fetch(url)
    const response = await request.json()
    response.sort(item => {
      return item.ticketCheckedIn ? 1 : -1 // `false` values first
    })
    setTickets(response)
    setLoading(false)

  }

  const checkInTicketByTicketNumber = async (ticketNumber) => {

    // if not a 10-digit ticket number, discontinue
    if (!ticketNumber.length) {
      toast.error('Enter a valid 10-digit ticket number')
      return
    }
    // if not a 10-digit ticket number, discontinue
    if (ticketNumber.length != 10) {
      toast.error('Not a valid 10-digit ticket number')
      return
    }

    try {
      setLoading(true)

      const getURL = `http://localhost:5000/tickets?ticketNumber=${ticketNumber}`
      const request = await fetch(getURL)
      const response = await request.json()

      // if nothing is found (ticket number doesn't exist), discontinue
      if (!response.length) {
        toast.error('Ticket NOT FOUND')
        setLoading(false)
        return
      }

      // [0] because when querying with query param, it returns an array of objects but when query by id /tickets/${id}, it returns an object
      if (!response[0].ticketCheckedIn) {
        const updatedTicket = { ...response[0], ticketCheckedIn: true }

        const putURL = `http://localhost:5000/tickets/${updatedTicket.id}`
        const putRequest = await fetch(putURL, {
          method: 'PUT',
          headers: {
            'Content-type': 'application/json',
          },
          body: JSON.stringify(updatedTicket)
        })

        setLoading(false)

        toast.success('Ticket checked in')

        await fetchTickets()
      } else {
        toast.error('ALREADY CHECKED IN')
        setTicketNumber('')
      }

      setLoading(false)

    } catch (error) {
      console.error(`There was a problem fetching ticket number: ${error}`);
    }
  }

  const checkTicketByTicketId = async (ticketId, action) => {

    let actionToTake

    if (action == 'in') {
      actionToTake = true
    }

    if (action == 'out') {
      actionToTake = false
    }

    if (actionToTake) {
      try {
        const url = `http://localhost:5000/tickets/${ticketId}` // returns an object, not an array
        const GETRequest = await fetch(url)
        const response = await GETRequest.json()
        const updatedTicket = await { ...response, ticketCheckedIn: actionToTake }
        const PUTRequest = await fetch(url, {
          method: 'PUT',
          headers: {
            'Content-type': 'application/json',
          },
          body: JSON.stringify(updatedTicket)
        })
        toast.success(`Ticket checked in`)
        await fetchTickets()
      } catch (error) {
        console.error(`Error checking in: ${error}`)
      }
    } else {
      if (window.confirm('Are you sure you want to check out this ticket?')) { // have to fix his so it doesnt ask
        try {
          const url = `http://localhost:5000/tickets/${ticketId}` // returns an object, not an array
          const GETRequest = await fetch(url)
          const response = await GETRequest.json()
          const updatedTicket = await { ...response, ticketCheckedIn: actionToTake }
          const PUTRequest = await fetch(url, {
            method: 'PUT',
            headers: {
              'Content-type': 'application/json',
            },
            body: JSON.stringify(updatedTicket)
          })
          toast.success(`Ticket ${response.ticketNumber} checked in`)
          await fetchTickets()
        } catch (error) {
          console.error(`Error checking in: ${error}`)
        }

      }
    }
  }

  const handleSubmit = e => {
    e.preventDefault()
    checkInTicketByTicketNumber(ticketNumber)
  }

  const handleTicketNumber = e => {
    setTicketNumber(e.target.value.trim())
  }

  useEffect(() => {
    fetchTickets()
  }, [])

  return (
    <div className="container">
      <h1>Check In System</h1>
      <div>
        <p>Enter the ticket number to check in or use the list.</p>
        <CheckInForm
          handleSubmit={handleSubmit}
          loading={loading}
          handleTicketNumber={handleTicketNumber}
          ticketNumber={ticketNumber} />
      </div>
      <div className="text-center">
        <p>Total tickets: {tickets.length} | Checked in: {countCheckedInTickets()} | Checked out: {tickets.length - countCheckedInTickets()}</p>
      </div>
      <TicketsTable
        tickets={tickets}
        checkTicketByTicketId={checkTicketByTicketId} />
      <ToastContainer
        position="top-left"
        autoClose={3000}
        hideProgressBar={true}
        newestOnTop
        closeOnClick={true}
        rtl={false}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover />
      <div className={`loading-sign ${loading ? 'loading-sign-visible' : ''} `}>Loading...</div>
    </div >
  )
}

export default Home
