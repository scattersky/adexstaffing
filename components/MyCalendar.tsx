'use client'

import { useState, useEffect } from "react"
import FullCalendar from "@fullcalendar/react"
import dayGridPlugin from "@fullcalendar/daygrid"
import interactionPlugin from "@fullcalendar/interaction"
import { Dialog } from "@headlessui/react"
import { getAuth } from "firebase/auth"
import axios from "axios"

// Corrected event type: id must be string
type CalendarEvent = {
  id?: string
  title: string
  start: string
  end?: string
  description?: string
  backgroundColor?: string
}

export default function MyCalendar() {
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [modalOpen, setModalOpen] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    start: "",
    end: "",
    description: "",
    color: "#3b82f6"
  })

  // Load events from API
  useEffect(() => {
    const auth = getAuth()
    const uid = auth.currentUser?.uid
    if (!uid) return

    axios.get(`https://adextravelnursing.com/api_get_events.php?uid=${uid}`)
      .then(res => {
        // Convert numeric IDs from backend to string
        const loadedEvents = res.data.map((ev: any) => ({
          ...ev,
          id: ev.id?.toString()
        }))
        setEvents(loadedEvents)
      })
      .catch(console.error)
  }, [])

  // Handle day click
  const handleDateClick = (info: { dateStr: string }) => {
    setFormData(prev => ({ ...prev, start: info.dateStr, end: info.dateStr }))
    setModalOpen(true)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const auth = getAuth()
    const uid = auth.currentUser?.uid
    if (!uid) return alert("User not logged in")

    try {
      const res = await axios.post("https://adextravelnursing.com/api_create_event.php", {
        uid,
        title: formData.title,
        start: formData.start,
        end: formData.end || formData.start,
        description: formData.description,
        backgroundColor: formData.color
      })

      if (res.data.status === "success") {
        // Assign string ID for FullCalendar
        setEvents(prev => [...prev, { ...formData, id: res.data.event_id.toString() }])
        setModalOpen(false)
        setFormData({
          title: "",
          start: "",
          end: "",
          description: "",
          color: "#3b82f6"
        })
      }
    } catch (err) {
      console.error(err)
      alert("Failed to create event")
    }
  }

  return (
    <div className="bg-white p-4 rounded-xl shadow">


      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events} // Now fully compatible
        dateClick={handleDateClick}
        height="auto"
      />

      {/* Modal */}
      <Dialog open={modalOpen} onClose={() => setModalOpen(false)} className="fixed z-10 inset-0 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen p-4 bg-[rgba(0,0,0,0.5)]">
          <Dialog.Panel className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
            <Dialog.Title className="text-lg font-semibold mb-4">Create Event</Dialog.Title>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block font-medium mb-1">Title</label>
                <input type="text" name="title" value={formData.title} onChange={handleChange} className="w-full border rounded p-2" required />
              </div>
              <div>
                <label className="block font-medium mb-1">Start Date</label>
                <input type="date" name="start" value={formData.start} onChange={handleChange} className="w-full border rounded p-2" required />
              </div>
              <div>
                <label className="block font-medium mb-1">End Date</label>
                <input type="date" name="end" value={formData.end} onChange={handleChange} className="w-full border rounded p-2" />
              </div>
              <div>
                <label className="block font-medium mb-1">Description</label>
                <textarea name="description" value={formData.description} onChange={handleChange} className="w-full border rounded p-2" />
              </div>
              <div>
                <label className="block font-medium mb-1">Color</label>
                <input type="color" name="color" value={formData.color} onChange={handleChange} className="w-12 h-10 p-0 border-0" />
              </div>
              <div className="flex justify-end space-x-2 mt-4">
                <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 border rounded">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Create</button>
              </div>
            </form>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  )
}