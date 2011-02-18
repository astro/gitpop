var github = require('github');
var step = require('step');

var login = process.argv[2];
var apiToken = process.argv[3];;
var user = process.argv[4];
var repo = process.argv[5];
var collaborators = process.argv.slice(6);
if (!user || !repo || !user || !repo) {
    console.error("Usage: " + process.argv[0] + " " + process.argv[1] + " <login> <api_token> <user> <repo> [collaborators...]");
    process.exit(1);
}

var api = new github.GitHubApi(false, null, true);
api.getRequest().setOption('http_port', 80);
api.authenticateToken(login, apiToken);


var repoApi = api.getRepoApi();
repoApi.addCollaborator = function(user, repo, collaborator, callback) {
    this.$api.post('repos/collaborators/' + user + '/' + repo + '/add/' + collaborator,
		   {}, null, this.$createListener(callback, 'collaborators'));
};
repoApi.rmCollaborator = function(user, repo, collaborator, callback) {
    this.$api.post('repos/collaborators/' + user + '/' + repo + '/remove/' + collaborator,
		   {}, null, this.$createListener(callback, 'collaborators'));
};

var steps = [function() { return null; }];
collaborators.forEach(function(collaborator) {
    steps.push((function(collaborator) {
		    return function(err) {
			if (err)
			    throw err;
			console.log('+ ' + collaborator);
			repoApi.addCollaborator(user, repo, collaborator, this);
		    };
		})(collaborator));
    steps.push((function(collaborator) {
		    return function(err) {
			if (err)
			    throw err;
			console.log('- ' + collaborator);
			repoApi.rmCollaborator(user, repo, collaborator, this);
		    };
		})(collaborator));
});
steps.push(function(err) {
    if (err)
	console.error(err);
});
step.apply(step, steps);
