const logger = require('../../logger');
const { Fragment } = require('../../model/fragment');
const { createErrorResponse, createSuccessResponse } = require('../../response');

/**
 * Get a fragment by ID
 */
module.exports = async (req, res) => {
  try {
    const fragment = await Fragment.byId(req.user, req.params.id);
    const data = await fragment.getData();
    res.setHeader('Content-Type', 'text/plain');
    //res.status(200).send(data);
    res.status(200).json(createSuccessResponse({ data }));
  } catch (err) {
    logger.error({ err }, 'Unable to find a fragment with matching ID');
    res.status(404).json(createErrorResponse(404, 'Unable to find fragment'));
  }
};
