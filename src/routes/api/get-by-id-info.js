const { createSuccessResponse, createErrorResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');
const logger = require('../../logger');

/**
 * Get a fragment's info by id for current user
 */
module.exports = async (req, res) => {
  try {
    const fragment = await Fragment.byId(req.user, req.params.id);
    if (fragment);
    {
      let data = { fragment: fragment };
      let msg = createSuccessResponse(data);
      res.status(200).json(msg);
    }
  } catch (error) {
    logger.error({ error }, 'Error in get-by-id-info');
    res.status(404).json(createErrorResponse(404, 'Fragment not found'));
  }
};
