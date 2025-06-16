const TryCatch = (handler) => {
  // This middleware catches any errors that occur in the given handler
  // and returns a 500 status code with the error message
  return async (req, res, next) => {
    try {
      await handler(req, res, next);
    } catch (error) {
      // log the error
      console.error(error);
      res.status(500).json({
        message: error.message,
      });
    }
  };
};

export default TryCatch;

