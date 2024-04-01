const router = require("express").Router();
const Conferences = require("../models/conference")
const users = require("../models/user");
const Organizers = require("../models/organizers");
const auth = require("../middleware.js")

router.get("/", (req,res) =>{
    res.send("conference route called")
})

router.post("/create", auth, async (req, res) => {
    try {
        const { title, description, date, time, link } = req.body;
        if(!title || !description || !date){
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
            link,
            time,
            created_at: Date.now(),
            organizedBy: req.user.id
        });
        await conference.save();
        const user = await users.findById(req.user.id);
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


module.exports = router;