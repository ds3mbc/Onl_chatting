
/*
 * GET home page.
 */

exports.index = function(req, res){
	res.render('index');
};

exports.newroom = function(req, res){
	res.render('newroom');
}

exports.start = function(req, res){
    res.render('chatting');
}