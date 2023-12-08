const { createSuccessResponse, createErrorResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');
const logger = require('../../logger');

module.exports = async (req, res) => {
  logger.info('Put: {' + 'User: ' + req.user + ' Body: ' + req.body + '}');

  if (!Buffer.isBuffer(req.body)) {
    return res.status(415).json(createErrorResponse(415, 'Unsupported Media Type : Empty body'));
  }
  try {
    const fragmentToUpdate = await Fragment.byId(req.user, req.params.id);
    if (!fragmentToUpdate) {
      return res.status(404).json(createErrorResponse(404, 'Fragment not found'));
    }
    if (fragmentToUpdate.type !== req.get('content-type')) {
      return res
        .status(400)
        .json(createErrorResponse(415, 'Unable to change fragment type after its been added'));
    }
    const fragment = new Fragment({
      ownerId: req.user,
      id: req.params.id,
      created: fragmentToUpdate.created,
      type: req.get('content-type'),
    });
    await fragment.save();
    await fragment.setData(req.body);

    res.set('content-type', fragment.type);
    res.set('Location', `http://${req.headers.host}/v1/fragments/${fragment.id}`);
    res.status(201).json(
      createSuccessResponse({
        fragment: fragment,
      })
    );
  } catch (err) {
    res.status(500).json(createErrorResponse(500, err.message));
  }
};
