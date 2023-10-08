// src/routes/api/post.js

const logger = require('../../logger');
const { createSuccessResponse, createErrorResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');

/**
 * Post a fragment for the current user
 */

module.exports = async (req, res) => {
  logger.info('POST: {' + 'User: ' + req.user + ' Body: ' + req.body + '}');

  const contentType = req.headers['content-type'];

  if (req.body == {}) {
    res.status(415).json(createErrorResponse(415, 'Unable to POST: Empty Body'));
  } else {
    if (Fragment.isSupportedType(contentType)) {
      const fragment = new Fragment({ ownerId: req.user, type: contentType });

      try {
        await fragment.setData(req.body);
        await fragment.save();
        //res.set('Location', `http://${req.headers.host}/v1/fragments/${fragment.id}`);
        res.set('Location', `${process.env.API_URL}/v1/fragments/${fragment.id}`);

        let msg = { fragment: fragment };
        let response = createSuccessResponse(msg);
        res.status(201).json(response);
      } catch (err) {
        logger.error({ err }, 'Unable to POST fragment');
      }
    } else {
      res.status(415).json(createErrorResponse(415, 'Unable to post: Media type is not supported'));
    }
  }
};
