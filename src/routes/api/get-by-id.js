const logger = require('../../logger');
const { Fragment } = require('../../model/fragment');
const { createErrorResponse } = require('../../response');
const sharp = require('sharp');

var MarkdownIt = require('markdown-it'),
  md = new MarkdownIt();

/**
 * Get a fragment by ID
 */
module.exports = async (req, res) => {
  try {
    logger.info('Getting fragment by id');
    const fragmentFound = await Fragment.byId(req.user, req.params.id);
    // const data = await fragment.getData();
    // res.setHeader('Content-Type', 'text/plain');
    // res.status(200).send(data);

    const fragment = new Fragment({
      id: fragmentFound.id,
      ownerId: fragmentFound.ownerId,
      type: fragmentFound.type,
      created: fragmentFound.created,
      updated: fragmentFound.updated,
      size: fragmentFound.size,
    });

    if (Fragment.isSupportedType(fragment.type)) {
      //conversion for .html ext
      if (req.params.ext === 'html') {
        if (fragment.type === 'text/markdown' || fragment.type === 'text/html') {
          const getData = await fragment.getData();
          const data = md.render(`${getData}`);
          res.setHeader('Content-Type', 'text/html');
          res.status(200).send(data);
        } else {
          res.status(415).json(createErrorResponse(415, 'Unable to convert to .html format'));
        }
        //conversion for .txt ext
      } else if (req.params.ext === '.txt') {
        if (
          fragment.type === 'text/plain' ||
          fragment.type === 'text/markdown' ||
          fragment.type === 'text/html' ||
          fragment.type === 'application/json'
        ) {
          const data = await fragment.getData();
          res.setHeader('Content-Type', 'text/plain');
          res.status(200).send(data);
        } else {
          res.status(415).json(createErrorResponse(415, 'Unable convert to .txt format'));
        }
        //conversion for .md ext
      } else if (req.params.ext === 'md') {
        if (fragment.type === 'text/markdown') {
          const data = await fragment.getData();
          res.setHeader('Content-Type', 'text/markdown');
          res.status(200).send(data);
        } else {
          res.status(415).json(createErrorResponse(415, 'Cannot convert to .md'));
        }
        //conversion for .json ext
      } else if (req.params.ext === 'json') {
        if (fragment.type === 'application/json') {
          const data = await fragment.getData();
          res.setHeader('Content-Type', 'application/json');
          res.status(200).send(data);
        } else {
          res.status(415).json(createErrorResponse(415, 'Cannot convert to .json'));
        }
        //conversion for .png .jpg .webp ext
      } else if (
        req.params.ext === 'png' ||
        req.params.ext === 'jpg' ||
        req.params.ext === 'webp'
      ) {
        if (
          fragment.type === 'image/png' ||
          fragment.type === 'image/jpeg' ||
          fragment.type === 'image/webp'
        ) {
          const getData = await fragment.getData();
          const data = await sharp(getData).toFormat(req.params.ext).toBuffer();
          const fragmentType = 'image/' + req.params.ext;
          res.setHeader('Content-Type', fragmentType);
          res.status(200).send(data);
        } else {
          res.status(415).json(createErrorResponse(415, 'Cannot convert'));
        }
      }
      //if there is no specific extension
      else if (typeof req.params.ext === 'undefined') {
        const data = await fragment.getData();
        res.setHeader('Content-Type', fragment.type);
        res.status(200).send(data);
      }
      //if the conversion cannot be supported
      else {
        res.status(415).json(createErrorResponse(415, 'Unable to convert file'));
      }
    }
    //content type is not supported
    else {
      res
        .status(415)
        .json(createErrorResponse(415, 'Content type is not supported at this moment'));
    }
  } catch (err) {
    logger.error({ err }, 'Unable to find a fragment with matching ID');
    res.status(404).json(createErrorResponse(404, 'Unable to find fragment'));
  }
};
