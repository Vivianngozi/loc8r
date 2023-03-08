// requiring database
var mongoose = require("mongoose");
require("../models/locations");

var Loc = mongoose.model("Location");

module.exports.locationsListByDistance = function (req, res, next) {
  sendJsonResponse(res, 200, { status: "success" });
};

module.exports.locationsCreate = function (req, res, next) {
  sendJsonResponse(res, 200, { status: "success" });
};

module.exports.locationsReadOne = function (req, res) {
  if (req.params && req.params.locationid) {
    Loc.findById(req.params.locationid).exec(function (err, location) {
      if (!location) {
        sendJsonResponse(res, 404, {
          message: "No locations found with this ID",
        });

        return;
      } else if (err) {
        sendJsonResponse(res, 404, err);
        return;
      }
      sendJsonResponse(res, 200, location);
    });
  } else {
    sendJsonResponse(res, 404, {
      message: "No locationid in request",
    });
  }
};

module.exports.locationsUpdateOne = function (req, res, next) {
  sendJsonResponse(res, 200, { status: "success" });
};

module.exports.locationDeleteOne = function (req, res, next) {
  sendJsonResponse(res, 200, { status: "success" });
};

function sendJsonResponse(res, status, content) {
  return res.status(status).json(content);
}
