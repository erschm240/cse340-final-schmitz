const addLocalVariables = (req, res, next) => {
    // Set current year
    res.locals.currentYear = new Date().getFullYear();
    
    // Node environment variable (development/production)
    res.locals.NODE_ENV = process.env.NODE_ENV?.toLowerCase() || 'production';

    // Make req.query available to all templates
    res.locals.queryParams = { ...req.query };

    next();
};

export { addLocalVariables };