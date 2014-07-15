exports.configure = function (app){
	app.get('/', function(req, res){
        //render app view
		res.render ('index', {title: 'Race'});
	});
}
