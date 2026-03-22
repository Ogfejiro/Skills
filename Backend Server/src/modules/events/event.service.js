import Event from '../../models/Event.model.js'
import AppError from '../../services/shared/appError.js'

export const createEvent = async (hostId, eventData) => {
    const event = await Event.create({ ...eventData, hostId })
    return event.populate('hostId', 'firstName lastName')
}

export const getHostEvents = async (hostId, page = 1, limit = 10) => {
    const events = await Event.find({ hostId })
        .sort({ createdAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .populate('hostId', 'firstName lastName')
    const total = await Event.countDocuments({ hostId })
    return { events, page, totalPages: Math.ceil(total / limit) }
}

export const getPublicEvents = async (page = 1, limit = 10) => {
    const events = await Event.find({ status: { $in: ['live'] } })
        .sort({ date: 1 })
        .limit(limit * 1)
        .skip((page - 1) * limit)
    const total = await Event.countDocuments({ status: 'live' })
    return { events, page, totalPages: Math.ceil(total / limit) }
}

export const getEventById = async (id) => {
    const event = await Event.findById(id).populate(
        'hostId',
        'firstName lastName profession',
    )
    if (!event) throw new AppError('Event not found', 404)
    return event
}

export const updateEvent = async (id, hostId, updateData) => {
    const event = await Event.findOne({ _id: id, hostId })
    if (!event) throw new AppError('Event not found or not authorized', 404)
    const updated = await Event.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
    })
    return updated.populate('hostId', 'firstName lastName')
}

export const deleteEvent = async (id, hostId) => {
    const event = await Event.findOneAndDelete({ _id: id, hostId })
    if (!event) throw new AppError('Event not found or not authorized', 404)
    return { success: true, message: 'Event deleted' }
}
