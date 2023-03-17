// requiring database
const { options } = require("mongoose");
var mongoose = require("mongoose");
require("../models/locations");

var Loc = mongoose.model("Location");

var theEarth = (function () {
  var earthRadius = 6371;
  var getDistanceFromRads = function(rads) {
    return parseFloat(rads * earthRadius);
  };
  var getRadsFromDistance = function(distance) {
    return parseFloat(distance / earthRadius);
  };
  return {
    getDistanceFromRads : getDistanceFromRads,
    getRadsFromDistance : getRadsFromDistance
  };
}) ();

module.exports.locationsListByDistance = function (req, res, next) {
  var lng = parseFloat(req.query.lng);
  var lat = parseFloat(req.query.lat);
  var point = {
    type: "Point",
    coordinates: [lng, lat]
  };
  var geoOptions = {
    spherical: true,
    maxDistance: theEarth.getRadsFromDistance(20),
    num: 10
  };
  if (!lng || !lat) {
    sendJsonResponse (res, 404, {
      "message": "lng and lat query parameters are required"
    });
    return;
  }
  Loc.geoNear(point, geoOptions, function(err, results, stats){
    var locations = [];
    if (err) {
      sendJsonResponse(res, 404, err);
    } else {
      results.forEach(function(doc) {
        locations.push ({
          distance: theEarth.getDistanceFromRads(doc.dis),
          name: doc.obj.name,
          address: doc.obj.address,
          rating: doc.obj.rating,
          facilities: doc.obj.facilities,
          _id: doc.obj._id
        });
      });
      sendJsonResponse(res, 200, locations);
    }
  });
};

module.exports.locationsCreate = function (req, res, next) {
  Loc.create({
    name: req.body.name,
    address: req.body.address,
    facilities: req.body.facilities,
    coords: [parseFloat(req.body.lng), parseFloat(req.body.lat)],
    openingTimes: [{
      days: req.body.day1,
      opening: req.body.opening1,
      closing: req.body.closing1,
      closed: req.body.closed1,
    }, {
      days: req.body.day2,
      opening: req.body.opening2,
      closing: req.body.closing2,
      closed: req.body.closed2
    }
  ]
  }, function(err, location) {
    if (err) {
      sendJsonResponse(res, 404, err);
    }
    else  {
      sendJsonResponse(res, 201, location);
    }
  });
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
  if (!req.params.locationid) {
    sendJsonResponse(res, 404, {
      "message": "Not fiund, locationid is required"
    });
    return;
  }
  Loc.findById(req.params.locationid).select('-reviews -rating').exec(function(err, location) {
    if(!location) {
      sendJsonResponse(res, 404, {
        "message": "locationid not found"
      });
      return
    } else if (err) {
      sendJsonResponse(res, 400, err);
      return;
    }
    location.name =req.body.name;
    location.address = req.body.address;
    location.facilities = req.body.facilities.split(',');
    location.coords = [parseFloat(req.body.lng), parseFloat(req.body.lat)];
    location.openingTimes = [{
      days: req.body.day1,
      opening: req.body.opening1,
      closing: req.body.closing1,
      closed: req.body.closed1,
    }, {
      days: req.body.day2,
      opening: req.body.opening2,
      closing: req.body.closing2,
      closed: req.body.closed2,
    }];
    location.save(function(err, location) {
      if (err) {
        sendJsonResponse(res, 404, err);
      } else {
        sendJsonResponse(res, 200, location);
      }
    });
  });
};

module.exports.locationDeleteOne = function (req, res, next) {
  var locationid = req.params.locationid;
    if(locationid) {
        Loc.findByIdAndRemove(locationid).exec(function (err, location) {
            if (err) {
                sendJsonResponse(res, 404, err);
                return;
            } 
            sendJsonResponse(res, 204, null);
        });
    } else {
        sendJsonResponse(res, 404, {
            "message": "No location data found"
        });
    }
  };

  var doAddReview = function(req, res, location) {
    if (!location) {
        sendJsonResponse(res, 404, {
            "message": "loactionid not found"
        });
    } else {
        location.reviews.concat({
            author: req.body.author,
            rating: req.body.rating,
            reviewText: req.body.reviewText
        });
        location.save(function(err, location) {
            var thisReview;
            if (err) {
                sendJsonResponse(res, 400, err);
            } else {
                updateAverageRating(location._id);
                thisReview = location.reviews[location.reviews.length - 1];
                sendJsonResponse(res, 201, thisReview);
            }
        });
    }
};


function sendJsonResponse(res, status, content) {
    return res.status(status).json(content);
  }
