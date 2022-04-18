var userFormEl = document.querySelector("#user-form");
var nameInputEl = document.querySelector("#username");
var repoContainerEl = document.querySelector("#repos-container");
var repoSearchTerm = document.querySelector("#repo-search-term");

// FORM SUBMISSION HANDLER
var formSubmitHandler = function(event) {
    event.preventDefault();
    
    // get value from input element
    var username = nameInputEl.value.trim();

    if (username) {
        getUserRepos(username);
        nameInputEl.value = "";
    } else {
        alert("Please enter a Github username");
    }
}

// CREATES USER URL / FETCHES USER DATA
var getUserRepos = function(user) {
    // format the github api url
    var apiURL = "https://api.github.com/users/" + user + "/repos";

    // make a request to the url
    fetch(apiURL)
        .then(function(response) {
            if (response.ok) {
                response.json().then(function(data) {
                    displayRepos(data, user);
                })
            } else {
                alert("Error: GitHub User Not Found");
            }
        })
        .catch(function(error) {
            alert("Unable to connect to Github");
        })
}

// TAKES SEARCHED NAME AND ARRAY NAME (JSON)
var displayRepos = function(repos, searchTerm) {

    // clear old content
    repoContainerEl.textContent = "";
    repoSearchTerm.textContent = searchTerm;

    // check if api returned any repos
    if (repos.length === 0) {
        repoContainerEl.textContent = "No Repositories Found.";
        return;
    }

    // loop over repos
    for (var i=0; i < repos.length; i++) {
        
        // format repo name
        var repoName = repos[i].owner.login + "/" + repos[i].name;
        
        //create a container for each repo
        var repoEl = document.createElement("div");
        repoEl.classList = "list-item flex-row justify-space-between align-center";
        
        // create a span element to hold repository name
        var titleEl = document.createElement("span");
        titleEl.textContent = repoName;
        
        // check if current repo has issues or not
        var statusEl = document.createElement("span");
        statusEl.classList = "flex-row align-center";
        if (repos[i].open_issues > 0) {
            statusEl.innerHTML = 
            "<i class='fas fa-times status-icon icon-danger'></i>" + repos[i].open_issues_count + " issue(s)";
        } else {
            statusEl.innerHTML = "<i class='fas fa-check-square status-icon icon-success'></i>";
        }

        // append elements
        repoEl.appendChild(statusEl);
        repoEl.appendChild(titleEl);
        repoContainerEl.appendChild(repoEl);
    }
}

// EVENT LISTENERS
userFormEl.addEventListener("submit", formSubmitHandler);