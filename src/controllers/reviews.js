var mongoose = require("mongoose");
require("../models/locations");

var Loc = mongoose.model("Location");


module.exports.reviewsCreate = function (req, res, next) {
    var locationid = req.params.locationid;
    if (locationid) {
        Loc.findById(locationid).select('reviews').exec(function(err, location){
            if (err) {
                sendJsonResponse(res, 400, err);
            } else {
                location.reviews.unshift({
                    author: req.body.author,
                    rating: req.body.rating,
                    reviewText: req.body.reviewText
                 })
                 location.save((err, location)=>{
                    var thisreview
                    if (err){
                       sendJsonResponse(res,400, err)
                    }else{
                        updateAverageRating(location._id)
                       thisreview=location.reviews[location.reviews.length -1]
                       sendJsonResponse(res, 201, thisreview)
                    }
                 })
            }
        });
    } else {
        sendJsonResponse(res, 404, {
            "message": "Not found, locationid required"
        });
    }
};

module.exports.reviewsReadOne = function(req, res) {
    if (req.params && req.params.locationid && req.params.reviewid) {
    
        Loc.findById(req.params.locationid).select('name reviews') .exec(function(err, location) {
            var response, review;
    
            if (!location) {
    
                sendJsonResponse(res, 404, {
    
                    "message": "locationid not found"
    
                });
    
                return;
  
    
            } else if (err) {
    
                sendJsonResponse(res, 400, err);
    
                return;
    
            }
    
            if (location.reviews && location.reviews.length > 0) {
    
                review = location.reviews.id(req.params.reviewid); 
    
                if (!review) { 
    
                    sendJsonResponse(res, 404, {
    
                        "message": "review not found"
        
                    });
    
                } else { 
    
                    response = { 
    
                        location : { 
    
                            name : location.name, 
    
                            id : req.params.locationid 
    
                        }, 
    
                        review : review 
    }; 
    
    
    sendJsonResponse(res, 200, response); 
    

} 
    
} else { 
    
    sendJsonResponse(res, 404, { 
    
        "message": "No reviews found" 
    
    }); 
   
} 
    
}
    
);
    
} else {
    
    sendJsonResponse(res, 404, {
    
        "message": "Not found, locationid and reviewid are both required"
    
    });
    
}
   
};
                   

module.exports.reviewsUpdateOne = function (req, res, next) {
    if(!req.params.locationid || !req.params.reviewid) {
        sendJsonResponse(res, 404, {
            "message": "Not found, locationid and reviewid required"
        });
        return;
    }
    Loc.findById(req.params.locationid).select('reviews').exec(function(err, location) {
        var thisReview;
        if(!location) {
            sendJsonResponse (res, 404, {
                "message": "locationid not found"
            });
            return;
        } else if (err) {
            sendJsonResponse(res,400, err);
            return;    
        }
        if (location.reviews && location.reviews.length > 0) {
            thisReview = location.reviews.id(req.params.reviewid);
            if (!thisReview) {
                sendJsonResponse(res, 404, {
                    "message": "reviewid not found"
                });
            } else {
                thisReview.author = req.body.author;
                thisReview.rating = req.body.rating;
                thisReview.reviewText = req.body.reviewText;
                location.save(function(err, location) {
                    if (err) {
                        sendJsonResponse(res, 404, err);
                    } else {
                        updateAverageRating(location._id);
                        sendJsonResponse(res, 200, thisReview);
                    }
                });
            }
        }else {
            sendJsonResponse(res, 404, {
                "message": "No review to update"
            });
        }
    });
  };


  module.exports.reviewsDeleteOne = function (req, res) {
    if(!req.params.locationid || !req.params.reviewid) {
        sendJsonResponse(res, 404, {
            "message": "No locationid and reviewid"
        });
        return;
    }
    Loc.findById(req.params.locationid).select('reviews').exec( function(err, location) {
        if(!location) {
            sendJsonResponse(res, 404, {
                "message": "no locationid"
            });
            return;
        }else if (err) {
            sendJsonResponse(res, 400, err);
            return;
        }
        if(location.reviews && location.reviews.length > 0) {
            if(!location.reviews.id(req.params.reviewid)) {
                sendJsonResponse(res, 404, {
                    "message": "no reviewid"
                });
            } else {
                location.reviews.id(req.params.reviewid).remove();
                location.save(function(err) {
                    if (err) {
                        sendJsonResponse(res, 404, err);
                    } else {
                        updateAverageRating(location._id);
                        sendJsonResponse(res,204, null);
                    }
                });
            }
        } else {
            sendJsonResponse(res, 404, {
                "message": "no review data"
            });
        }
    });
};

var updateAverageRating = (x)=>{
    Loc
       .findById(x)
       .select('rating reviews')
       .exec(
          function (err, location) {
             if (!err) {
                doSetAverageRating(location);
             }
          });
 };

var doSetAverageRating = function(location) {
    var i, reviewCount, ratingAverage, ratingTotal;
    if (location.reviews && location.reviews.length > 0) {
        reviewCount = location.reviews.length;
        ratingTotal = 0;
        for (i= 0; i < reviewCount; i++) {
            ratingTotal = ratingTotal + location.reviews[i].rating;
        }
        ratingAverage = parseInt(ratingTotal / reviewCount, 10);
        location.rating = ratingAverage;
        location.save(function(err) {
            if (err) {
                console.log(err);
            } else {
                console.log("Average rating updated to ", ratingAverage);
            }
        });
    }
};




function sendJsonResponse(res, status, content) {
    return res.status(status).json(content);
  }