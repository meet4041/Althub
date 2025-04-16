const Event = require("../models/EventModel");

//Add Events
const addEvents = async (req, res) => {
    try {
        const event = new Event({
            organizerid: req.body.organizerid,
            title: req.body.title,
            description: req.body.description,
            date: req.body.date,
            venue: req.body.venue,
            photos: req.images
        });

        const event_data = await event.save();
        res.status(200).send({ success: true, data: event_data });

    } catch (error) {
        res.status(400).send(error.message);
        console.log("Error in Register User : " + error.message);
    }
}

//view Events
const getEvents = async (req, res) => {
    try {
        const evet_data = await Event.find({});
        res.status(200).send({ success: true, data: evet_data });
    } catch (error) {
        res.status(400).send({ success: false, msg: error.message });
    }
}
//view Events by institute
const getEventsByInstitute = async (req, res) => {
    try {
        const evet_data = await Event.find({ organizerid: req.params.organizerid });
        res.status(200).send({ success: true, data: evet_data });
    } catch (error) {
        res.status(400).send({ success: false, msg: error.message });
    }
}
//delete event
const deleteEvent = async (req, res) => {
    try {
        const id = req.params.id;
        const result = await Event.deleteOne({ _id: id });
        res.status(200).send({ success: true, msg: 'Event Deleted successfully' });
    } catch (error) {
        res.status(400).send({ success: false, msg: error.message });
    }
}

//edit event
const editEvent = async (req, res) => {
    try {
        if (req.images.length != '') {

            var id = req.body.id;
            var title = req.body.title;
            var description = req.body.description;
            var date = req.body.date;
            var venue = req.body.venue;
            var photos = req.images

            const event_data = await Event.findByIdAndUpdate({ _id: id }, { $set: { title: title, description: description, date: date, venue: venue, photos: photos } }, { new: true });
            res.status(200).send({ success: true, msg: 'Event Updated', data: event_data });
        }
        else {
            var id = req.body.id;
            var title = req.body.title;
            var description = req.body.description;
            var date = req.body.date;
            var venue = req.body.venue;

            const event_data = await Event.findByIdAndUpdate({ _id: id }, { $set: { title: title, description: description, date: date, venue: venue } }, { new: true });
            res.status(200).send({ success: true, msg: 'Event Updated', data: event_data });
        }
    } catch (error) {
        res.status(400).send({ success: false, msg: error.message });
    }
}

//search institute
const searchEvent = async (req, res) => {
    try {
        var search = req.body.search;
        var event_data = await Event.find({ "title": { $regex: ".*" + search + ".*" } });
        if (event_data.length > 0) {
            res.status(200).send({ success: true, msg: "Event Details", data: event_data });
        }
        else {
            res.status(200).send({ success: true, msg: 'Event not Found' });
        }

    } catch (error) {
        res.status(400).send({ success: false, msg: error.message });
    }
}

//get upcomming events
const getUpcommingEvents = async (req, res) => {
    try {
        let start = Date.now();
        const event_data = await Event.find({ date: { $gte: start } });
        res.status(200).send({ success: true, data: event_data });
    } catch (error) {
        res.status(400).send({ success: false, msg: error.message });
    }
}

// participate in the event
const participateInEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        // res.status(200).json(req.params.id);
        if (!event.participants.includes(req.body.userId)) {
            await event.updateOne({ $push: { participants: req.body.userId } });
            res.status(200).json("Participated in this event Successfully");
        } else {
            res.status(403).json("You have been already participated in this event");
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

module.exports = {
    addEvents,
    getEvents,
    deleteEvent,
    editEvent,
    searchEvent,
    getUpcommingEvents,
    getEventsByInstitute,
    participateInEvent
}