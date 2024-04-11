const router = require("express").Router();
const Conferences = require("../models/conference")
const Users = require("../models/user");
const Organizers = require("../models/organizers");
const auth = require("../middleware.js")

router.get("/", (req,res) =>{
    res.send("conference route called")
})
//Create Conference
router.post("/create", auth, async (req, res) => {
    try {
        const { title, description, date, time, link, location } = req.body;
        if(!title || !description || !date || !location || !time){
            return res.status(400).json({ error: "All fields are required" });
        }
        const existingConference = await Conferences.findOne({ title });
        if (existingConference) {
            return res.status(400).json({ error: "Conference with this title already exists" });
        }

        const conference = new Conferences({
            title,
            description,
            date,
            location,
            link,
            time,
            created_at: Date.now(),
            organizedBy: req.user.id
        });
        await conference.save();
        const user = await Users.findById(req.user.id);
        if(user){
            user.conferencesOrganized.push(conference._id);
            user.role = "organizer";
            await user.save();
            const organizer = await Organizers.findOne({ user: req.user.id });
            if (organizer) {
                organizer.numConferences++;
                await organizer.save();
            } else {
                await Organizers.create(
                    {
                        user: req.user.id,
                        organizer_info: {
                            email: user.email,
                            walletAddress:user.walletaddress,
                            fullName: user.name,
                            avatar: user.avatar
                        },
                        numConferences: 1
                    });
                }
        }
       

        res.status(201).json({ message: "Conference created successfully", conference});
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

// Get All Conferences
router.get('/all', async (req, res) => {
    try {
        const conferences = await Conferences.find();
        res.status(200).json({msg: "Conferences Fetched Successfully", data: conferences });
    } catch (error) {
        console.error('Error fetching conferences:', error);
        res.status(500).json({ error: 'An error occurred while fetching conferences' });
    }
});


//Get Conference by Id
router.get("/:id", async (req,res) => {
    try{
        const id = req.params.id
        const conference = await Conferences.findById(id);
        if(conference){
            res.status(200).json({msg: "Conference Detail Fetched Successfully", data: conference})
        }else{
            res.status(204).json({msg: "Cannot find a conference with that ID"})
        }

    }catch(error){
        console.error('Error fetching conferences:', error);
        res.status(500).json({ error: 'An error occurred while fetching conference data' });

    }
})
//Delete Conference by Id
router.delete("/:id", auth, async (req, res) => {
    try {
        const conferenceId = req.params.id;
        const conference = await Conferences.findById(conferenceId);
        if (!conference) {
            return res.status(404).json({ error: "Conference not found" });
        }
        if (conference.organizedBy.toString() !== req.user.id) {
            return res.status(401).json({ error: "Unauthorized: You are not the organizer of this conference" });
        }
        await Conferences.deleteOne({ _id: conferenceId });
        const user = await Users.findById(req.user.id);
        if (user) {
            user.conferencesOrganized = user.conferencesOrganized.filter(id => id.toString() !== conferenceId);
            await user.save();
        }
        const organizer = await Organizers.findOne({ user: req.user.id });
        if (organizer) {
            if (organizer.numConferences === 1) {
                await Organizers.deleteOne({ user: req.user.id });
            } else {
                organizer.numConferences--;
                await organizer.save();
            }
        }

        res.status(200).json({ message: "Conference deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});




module.exports = router;