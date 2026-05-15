const express = require('express');
const router = express.Router();
const Note = require('../models/Note');
const protect = require('../middleware/protect')

router.use(protect)

router.get('/', async (req,res) => {
    try {
        const notes = await Note.find({ userId: req.user._id})
        res.status(200).json(notes) 
    } catch (error) {
        res.status(500).json({ msg: error.message})
    }
});

router.post ('/', async (req, res) => {
    try {
        const {title, content} = req.body
        const note = new Note({ title, content, userId: req.user._id })
        await note.save()

        res.status(201).json(note)
    } catch (error) {
        res.status(500).json({ msg: error.message})
    }
});

router.get('/:id', async (req, res) => {
    try {
        const note = await Note.findById(req.params.id)

        if (!note) {
            return res.status.json({ msg: 'Note not found'})
        }
        res.status(200).json(note)
    } catch (error) {
        res.status(500).json({ msg: error.message})
    }
});

router.put('/:id', async (req, res) => {
    const { title, content } = req.body
    const note = await Note.findByIdAndUpdate(
        req.params.id,
        { title, content },
        { new: true }
    )
    if (!note) {
        return res.status(404).json({ msg: 'Note not found'})
    }
    res.status(200).json(note)
});

router.delete('/:id', async (req, res) => {
    try {
        const note = await Note.findByIdAndDelete(req.params.id)

        if(!note) {
            return res.status(404).json({ msg: 'Note not found'})
        }
        res.status(200).json({ msg: 'Note deleted'})
    } catch (erroe) {
        res.status(500).json({ msg: error.message})
    }
});


module.exports = router;