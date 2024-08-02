const Project = require('./../model/project');

exports.queryProjects = (req, res) => {
    const query = req.query;

    const projects = 'Placeholder'; // make a db call

    res.status(200).json({
        status: 'success',
        data: {
            project: query,
        },
    });
};

exports.getProjectById = (req, res) => {
    const projectId = req.params.id;

    const project = 'Placeholder'; //make a db call

    res.status(200).json({
        status: 'success',
        data: {
            project,
        },
    });
};

exports.createNewProject = async (req, res) => {
    const project = await Project.create(req.data);

    res.status(200).json({
        status: 'success',
        project,
    });
};

exports.updateProject = (req, res) => {
    res.status(404).json({
        status: 'fail',
        message: 'Route not yet implemented.',
    });
};

exports.deleteProject = (req, res) => {
    res.status(404).json({
        status: 'fail',
        message: 'Route not yet implemented.',
    });
};

exports.getMyProjects = (req, res) => {
    res.status(404).json({
        status: 'fail',
        message: 'Route not yet implemented.',
    });
};
