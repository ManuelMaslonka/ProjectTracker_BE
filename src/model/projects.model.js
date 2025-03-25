const {Schema, model} = require('mongoose');

const ProjectSchema = new Schema({
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
    author: {type: Schema.Types.ObjectId, ref: "User", required: true},
    tasks: [{type: Schema.Types.ObjectId, ref: "Task"}], // Array of task ids
    status: {type: String, enum: ["active", "completed"], default: "active"},
    tags: [{type: String}],
    users: [{type: Schema.Types.ObjectId, ref: "User"}] // Array of user ids
});

module.exports = model("Projects", ProjectSchema);
