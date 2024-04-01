const router = require("express").Router();


const Organizers = require("../models/organizers");


router.get('/all', async (req, res) => {
    try {
        const organizers = await Organizers.find();
        res.status(200).json({ msg: "Organizers Fetched Successfully", data: organizers });
    } catch (error) {
        console.error('Error fetching conferences:', error);
        res.status(500).json({ error: 'An error occurred while fetching conferences' });
    }
});

router.get("/:id", async (req,res) => {
    try{
        const id = req.params.id
        const organizer = await Organizers.findById(id);
        if(organizer){
            res.status(200).json({msg: "Conference Detail Fetched Successfully", data: organizer})
        }else{
            res.status(204).json({msg: "Cannot find an Organizer with that ID"})
        }

    }catch(error){
        console.error('Error fetching Organizer Info:', error);
        res.status(500).json({ error: 'An error occurred while fetching Organizer Info' });

    }
})

module.exports = router;