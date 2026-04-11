'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import {
  Loader2,
  ArrowLeft,
  X,
  Pencil,
  Trash2,
} from 'lucide-react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import eventService, { Event } from '@/app/services/eventService';
import ticketService, {
  Ticket,
  TicketData,
} from '@/app/services/ticketService';

export default function ViewEventPage() {
  const params = useParams();
  const eventId = params.id as string;
  const { token } = useAuth();

  const [loading, setLoading] = useState(true);
  const [ticketsLoading, setTicketsLoading] = useState(true);
  const [event, setEvent] = useState<Event | null>(null);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [error, setError] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [editingTicket, setEditingTicket] = useState<Ticket | null>(null);
  const [processing, setProcessing] = useState(false);

  const [ticketForm, setTicketForm] = useState({
    title: '',
    description: '',
    price: '',
    quantity: '',
  });

  const isEventLocked =
    event?.status === 'ended' || event?.status === 'cancelled';

  // Fetch
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!token) throw new Error('Auth required');

        const [eventRes, ticketRes] = await Promise.all([
          eventService.getEventById(eventId, token),
          ticketService.getEventTickets(eventId, token),
        ]);

        if (eventRes.success) setEvent(eventRes.data);
        if (ticketRes.success) setTickets(ticketRes.data);
      } catch (err) {
        setError('Failed to load');
      } finally {
        setLoading(false);
        setTicketsLoading(false);
      }
    };

    if (eventId && token) fetchData();
  }, [eventId, token]);

  // Open modal
  const openCreateModal = () => {
    setEditingTicket(null);
    setTicketForm({
      title: '',
      description: '',
      price: '',
      quantity: '',
    });
    setShowModal(true);
  };

  const openEditModal = (ticket: Ticket) => {
    setEditingTicket(ticket);
    setTicketForm({
      title: ticket.title,
      description: ticket.description || '',
      price: String(ticket.price),
      quantity: String(ticket.quantity),
    });
    setShowModal(true);
  };

  // Create / Update
  const handleSubmit = async () => {
    if (!token) return;

    setProcessing(true);
    try {
      const payload: TicketData = {
        title: ticketForm.title,
        description: ticketForm.description,
        price: Number(ticketForm.price),
        quantity: Number(ticketForm.quantity),
      };

      if (editingTicket) {
        const res = await ticketService.updateTicket(
          editingTicket._id,
          payload,
          token
        );

        setTickets((prev) =>
          prev.map((t) =>
            t._id === editingTicket._id ? res.data : t
          )
        );
      } else {
        const res = await ticketService.createTicket(
          eventId,
          payload,
          token
        );
        setTickets((prev) => [...prev, res.data]);
      }

      setShowModal(false);
    } catch (err) {
      console.error(err);
    } finally {
      setProcessing(false);
    }
  };

  // Delete
  const handleDelete = async (ticketId: string) => {
    if (!token) return;

    if (!confirm('Delete this ticket?')) return;

    try {
      await ticketService.deleteTicket(ticketId, token);
      setTickets((prev) => prev.filter((t) => t._id !== ticketId));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-black flex items-center justify-center text-white">
        <Loader2 className="animate-spin" />
      </main>
    );
  }

  if (!event) return null;

  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />

      <div className="container mx-auto px-4 pt-28 pb-12 space-y-8">
        {/* BACK */}
        <Link href="/dashboard/host" className="flex items-center gap-2 text-gold">
          <ArrowLeft className="w-4 h-4" />
          Back
        </Link>

        {/* EVENT */}
        <div className="bg-gray-900/50 border border-gold/20 rounded-xl p-8">
          <h1 className="text-3xl font-bold">{event.title}</h1>
          <p className="text-gray-400 mt-2">{event.description}</p>
        </div>

        {/* TICKETS */}
        <div className="bg-gray-900/50 border border-gold/20 rounded-xl p-8 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Tickets</h2>

            <button
              onClick={openCreateModal}
              disabled={isEventLocked}
              className="px-4 py-2 bg-gold text-black rounded-lg disabled:opacity-40"
            >
              + Add Ticket
            </button>
          </div>

          {isEventLocked && (
            <p className="text-red-400 text-sm">
              Ticket actions disabled (event ended/cancelled)
            </p>
          )}

          {ticketsLoading ? (
            <Loader2 className="animate-spin" />
          ) : tickets.length === 0 ? (
            <div className="text-center text-gray-400 py-10">
              <p>No tickets yet</p>
              {!isEventLocked && (
                <button
                  onClick={openCreateModal}
                  className="mt-4 px-6 py-2 bg-gold text-black rounded-lg"
                >
                  Create Event Ticket
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {tickets.map((ticket) => (
                <div
                  key={ticket._id}
                  className="p-4 border border-gold/20 rounded-lg flex justify-between items-center"
                >
                  <div>
                    <h3 className="font-bold">{ticket.title}</h3>
                    <p className="text-sm text-gray-400">
                      ₦{ticket.price} • {ticket.sold}/{ticket.quantity}
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => openEditModal(ticket)}
                      disabled={isEventLocked}
                    >
                      <Pencil className="w-4 h-4 text-gold" />
                    </button>

                    <button
                      onClick={() => handleDelete(ticket._id)}
                      disabled={isEventLocked}
                    >
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center">
          <div className="bg-gray-900 p-6 rounded-xl w-full max-w-md space-y-4 border border-gold/20">
            <div className="flex justify-between">
              <h2 className="font-bold">
                {editingTicket ? 'Edit Ticket' : 'Create Ticket'}
              </h2>
              <button onClick={() => setShowModal(false)}>
                <X />
              </button>
            </div>

            <input
              placeholder="Title"
              value={ticketForm.title}
              onChange={(e) =>
                setTicketForm({ ...ticketForm, title: e.target.value })
              }
              className="w-full px-4 py-2 bg-gray-800 rounded"
            />

            <textarea
              placeholder="Description"
              value={ticketForm.description}
              onChange={(e) =>
                setTicketForm({
                  ...ticketForm,
                  description: e.target.value,
                })
              }
              className="w-full px-4 py-2 bg-gray-800 rounded"
            />

            <input
              type="number"
              placeholder="Price"
              value={ticketForm.price}
              onChange={(e) =>
                setTicketForm({ ...ticketForm, price: e.target.value })
              }
              className="w-full px-4 py-2 bg-gray-800 rounded"
            />

            <input
              type="number"
              placeholder="Quantity"
              value={ticketForm.quantity}
              onChange={(e) =>
                setTicketForm({ ...ticketForm, quantity: e.target.value })
              }
              className="w-full px-4 py-2 bg-gray-800 rounded"
            />

            <button
              onClick={handleSubmit}
              disabled={processing}
              className="w-full py-2 bg-gold text-black rounded-lg"
            >
              {processing
                ? 'Processing...'
                : editingTicket
                ? 'Update Ticket'
                : 'Create Ticket'}
            </button>
          </div>
        </div>
      )}
    </main>
  );
}