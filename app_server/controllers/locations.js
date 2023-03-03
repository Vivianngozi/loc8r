/* get home page */
module.exports.homelist = function(req, res){
    res.render('locations-list', {
     title: 'Loc8r - find a place to work with wifi',
     pageHeader: {
          title: 'Loc8r',
          strapline: 'Find places to work with wifi near you!'
    },
     sidebar: "Looking for wifi and a seat? Loc8r helps you find places to work when out and about. Perhaps with coffee, cake or a pint? Let Loc8r help you find the place you're looking for.", 
     locations: [{ 
         name: 'Starcups',
         address: '125 High Street, Reading, RG6 1PS',
         rating: 3,
         facilities: ['Hot drinks', 'Food', 'Premium wifi'],
         distance: '100m'
    },{
         name: 'Cafe Hero',
         address: '125 High Street, Reading, RG6 1PS',
         rating: 4,
         facilities: ['Hot drinks', 'Food', 'Premium wifi'],
         distance: '200m'
    },{
         name: 'Burger Queen',
         address: '125 High Street, Reading, RG6 1PS',
         rating: 2,
         facilities: ['Food', 'Premium wifi'],
         distance: '250m'
    }],
    });
   };
   

/*get locations page */
module.exports.locationInfo = function(req, res, next) {
    res.render('location-info', {
        title: 'Location Info',
        locations: {
         name: 'Starcups',
         address: '125 High Street, Reading, RG6 1PS',
         rating: 3,
         facilities: ['Hot drinks', 'Food', 'Premium wifi'],
         distance: '100m',
         coords: { lat: 51.456356, lng: -0.9873489},
         openingTimes: [{
            days: 'Mondays-Fridays',
            opening: '7:00am',
            closing: '9:00pm',
            closed: false
         },{
            days: 'Saturday',
            opening: '9:00am',
            closing: '9:00pm',
            closed:false
         },{
            days: 'Sunday',
            closed: true
         }
        ],
        reviews: [{
            author: 'Vivian',
            rating:4,
            timestamp: '16 May 2020',
            reviewText:'What a great place to be'
        },{
            author: 'Vivian',
            rating:4,
            timestamp: '16 May 2020',
            reviewText:'What a great place to be'
            
        }, {
            author: 'Vivian',
            rating:4,
            timestamp: '16 May 2020',
            reviewText:'What a great place to be'
        }
    ]
        }
    });
};

/* get review page */
module.exports.addReview = function(req, res, next) {
    res.render('location-review-form', {title: 'Review'});
};
