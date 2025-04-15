const {Schema, model} = require('mongoose');

const TaskSchema = new Schema({
    title: {type: String, required: true},
    description: {type: String, required: true},
    created_at: {
        type: Date,
        default: Date.now,
        get: function(date) {
            if (date) {
                return date.toISOString().split('T')[0]; // Returns YYYY-MM-DD format
            }
            return date;
        },
        set: function(date) {
            if (typeof date === 'string') {
                return new Date(date); // Parses YYYY-MM-DD format
            }
            return date;
        }
    },
    due_date: {
        type: Date,
        get: function(date) {
            if (date) {
                return date.toISOString().split('T')[0]; // Returns YYYY-MM-DD format
            }
            return date;
        },
        set: function(date) {
            if (typeof date === 'string') {
                return new Date(date); // Parses YYYY-MM-DD format
            }
            return date;
        }
    },
    state: {type: String, enum: ["open", "progress","completed"], default: "active"},
    project: {type: Schema.Types.ObjectId, ref: "Projects", required: true},
    author: {type: Schema.Types.ObjectId, ref: "User", required: true},
    assigned_to: {type: Schema.Types.ObjectId, ref: "User"},
    logged_hours: {type: Number, default: 0},
    image_path: {type: String},
});




module.exports = model("Task", TaskSchema);
