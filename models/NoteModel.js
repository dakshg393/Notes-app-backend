const mongoose = require("mongoose");

const noteSchema = mongoose.Schema(
    {
        title: { type: String, required: false },
        body: { type: String, required: false },
        user: { type: String, required: true },
        date: { type: Date, required: true }

    },
    {
        versionKey: false,
    }
);

const NoteModel = mongoose.model("note", noteSchema);

module.exports = {
    NoteModel,
};