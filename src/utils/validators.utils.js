const {body} = require("express-validator");

const validateProject = [
    body('title')
        .notEmpty().withMessage('Title is required')
        .isLength({ min: 3 }).withMessage('Title must be at least 3 characters'),

    body('description')
        .notEmpty().withMessage('Description is required')
        .isLength({ min: 3 }).withMessage('Description must be at least 3 characters'),

    body('due_date')
        .optional()
        .isISO8601().withMessage('Invalid date format'),

    body('tasks')
        .optional()
        .isArray().withMessage('Tasks must be an array')
        .custom(tasks => {
            if (tasks && tasks.length > 0) {
                return tasks.every(task => typeof task === 'string' && task.trim() !== '');
            }
            return true;
        }).withMessage('Each task must be a valid ID'),

    body('status')
        .optional()
        .isIn(['active','completed']).withMessage('Status must be either active or completed'),


    body('users')
        .optional()
        .isArray().withMessage('Users must be an array')
        .custom(users => {
            if (users && users.length > 0) {
                return users.every(user => typeof user === 'string' && user.trim() !== '');
            }
            return true;
        }).withMessage('Each user must be a valid ID')
];

const validateTask = [
    body('title')
        .notEmpty().withMessage('Title is required')
        .isLength({ min: 3 }).withMessage('Title must be at least 3 characters'),

    body('description')
        .notEmpty().withMessage('Description is required')
        .isLength({ min: 3 }).withMessage('Description must be at least 3 characters'),

    body('due_date')
        .notEmpty().withMessage('Must be filled due_date')
        .isISO8601().withMessage('Invalid date format'),
];

module.exports = validateTask;
module.exports = validateProject;
