const { createSuccessResponse, createErrorResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');
const logger = require('../../logger');

module.exports = async (req, res) => {
  logger.info('PUT: {' + 'User: ' + req.user + ' Body: ' + req.body + '}');
  const incomingContentType = req.headers['content-type'];

  try {
    const fragmentToBeUpdated = await Fragment.byId(req.user, req.params.id);

    if (fragmentToBeUpdated) {
      if (fragmentToBeUpdated.type == incomingContentType) {
        await fragmentToBeUpdated.setData(req.body);

        createSuccessResponse(
          res.status(200).json({ status: 'ok', fragments: fragmentToBeUpdated })
        );
      } else {
        //create error response, unable to update fragment with a different content type
        createErrorResponse(
          res.status(415).json({
            status: 'error',
            message: "A fragment's type can not be changed after it is created",
          })
        );
      }
    } else {
      createErrorResponse(
        res.status(404).json({
          status: 'error',
          message: 'Fragment not found',
        })
      );
    }
  } catch (err) {
    logger.error({ err }, 'Unable to update fragment');
    createErrorResponse(
      res.status(404).json({
        status: 'error',
        message: "A fragment's type can not be changed after it is created",
      })
    );
  }
};
