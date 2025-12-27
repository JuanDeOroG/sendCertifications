function validate(schema) {
  return (req, res, next) => {
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      const errors = parsed.error.issues.map(issue => ({
        message: issue.path +": "+issue.message
      }));
      return res.status(400).json({ errors });
    }
    req.validatedData = parsed.data;
    next();
  };
}

module.exports = validate;