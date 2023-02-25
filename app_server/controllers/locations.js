/* get home page */
module.exports.homelist = function(req, res, next) {

    res.render('locations-list', {title: 'Homepage'});
};

/*get locations page */
module.exports.locationInfo = function(req, res, next) {
    res.render('index', {title: 'Location Info'});
};

/* get review page */
module.exports.addReview = function(req, res, next) {
    res.render('index', {title: 'Review'});
};