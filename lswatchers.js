var github = require('github');

var user = process.argv[2];
var repo = process.argv[3];
if (!user || !repo) {
    console.error("Usage: " + process.argv[0] + " " + process.argv[1] + " <user> <repo>");
    process.exit(1);
}

var api = new github.GitHubApi(false, null, true);
var oldGetRequest = api.getRequest;
api.getRequest = function() {
    var req = oldGetRequest.apply(this, arguments);
    req.configure({ http_port: 80 });
    return req;
};
api.getRepoApi().getRepoWatchers(user, repo, function(err, watchers) {
    if (err) {
	console.error(err);
    } else if (watchers) {
	console.info(watchers.join(' '));
    }
});
