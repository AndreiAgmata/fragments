// src/routes/api/get.js

const { createSuccessResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');
/**
 * Get a list of fragments for the current user
 */
module.exports = async (req, res) => {
  // TODO: this is just a placeholder to get something working...

  let expand = req.query.expand;

  if (expand == 1) {
    const fragments = await Fragment.byUser(req.user, true);
    res.status(200).json(createSuccessResponse({ fragments: fragments }));
  } else {
    const fragments = await Fragment.byUser(req.user);

    let msg = {
      fragments: fragments,
    };

    let response = createSuccessResponse(msg);
    res.status(200).json(response);
  }
};
