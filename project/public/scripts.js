// ==========================
// KING COMPONENT
// ==========================
var KingComponent = React.createClass({
	getInitialState: function(){//initial state of user logged in
		var userCheck;
		if(document.cookie){
			userCheck = false;
		} else {
			userCheck = "";
		}
		return{
			username: "",
			authUser: userCheck,
			id: "",
			movies:[],
			search:"",
			searchMovie: [],
			display: "user",
			showMovie: "no",
			currentMovie: "",
			currentMovieInfo: {},
			currentMovieTitle: "",
			currentMovieDescription: "",
			currentMoviePoster: "",
			currentMovieImdbId: "",
			currentMovieWatched: "",
			currentMovieRating: ""
		};
	},
	changeLogin: function(){//state is set to the cookies of username and id
		this.setState({
			authUser: true, 
			username: Cookies("username"),
			id: Cookies("id")
		});
		this.showAjax();
	},
	handleSearchInput: function(text) {//sets the state of the search input text
		this.setState({
			search: text,
		});
	},
	changeSearchState: function(data) {//sets the state of movie search
		this.setState({
			searchMovie: data,
		});
	},
	changeDisplay: function(){//changes the state of user display to search display
		// console.log('changeDisplay is working');
		if (this.state.display === "user"){
			this.setState({display: "search"});
		} else {
			this.showAjax();
			this.setState({display: "user"});
		}
	},
	changeShowMovie: function(){//toggles the state of showMovie display
		// console.log('changeShowMovie is working');
		if (this.state.showMovie === "yes") {
			this.setState({showMovie: "no"});
		} else {
			this.showAjax();
			this.setState({showMovie: "yes"});
		}
	},
	changeCurrentMovie: function(movieId){//This identifies the movie selected for show and displays it, by setting state to movieID 
		this.showAjax();//This is called to update and set state of movies
		// console.log("changing current movie");
		// console.log("movieId:", movieId);
		this.setState({currentMovie: movieId});
		// console.log('now this.state.currentMovie:');
		console.log(this.state.currentMovie);
	},
	changeLogout: function() {//this changes the state of logout by removing the cookies and JWT. Sets the state back to default
		Cookies.remove("jwt_token");
		Cookies.remove("username");
		Cookies.remove("id");
		this.setState({
			username: "",
			authUser: "",
			id: "",
		})
	},
	// getFwakingData: function(movies) {//This method gets our data and sets the state of 
	// 	// console.log('hey you fuck');
	// 	// console.log("fuck you and ur fat cunt" ,movies.movies[1].title);
	// 	this.setState({movies:movies.movies);//The state of getFwakingData is now set to movies: title(which is the data we got back)
	// },
	showAjax: function() {//This ajax call queries the database on the frontend via the get request in the users.js controller
		$.ajax({//get users by ID
			url:"/users/" + this.state.id,
			method:"GET",
			success: function(data) {//upon success we grab each movie that is currently in the user's collection and push it into an empty array that we just created
				var moviesArray = [];
				data.movies.forEach(function(movie) {
					moviesArray.push(
					movie
					);
				})
				// console.log('-----------------------------------------------------');
				// console.log('the moviesARray', moviesArray);
				this.setState({movies: moviesArray}); //After all data has been pushed into the moviesArray, we set state to moviesArray
				// console.log('testing showajax');
			// 	 this.getFwakingData(daMovies);//we then invoke getFwakingData(which sets the state of movies) with our new data.
			 }.bind(this),
			error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
		});
	},
	movieAjax: function(thisMovieId){//This call gets the users movies by userID and movieID
		// console.log('this is the current movie id:', this.state);
		$.ajax({
			url: '/users/movies/'+Cookies('id') +'/'+ thisMovieId,
			type: 'GET',
			success: function(response){//upon success we loop over the data received and store it in the var response1
				// console.log('success!');
				var response1
				for (var i = 0; i < response.length; i++){
					if (response[i]._id === thisMovieId) {
						console.log(response[i]);
						response1 = response[i];
					}
				}//We then use the var response1 to set the state of the data we want to display
				// console.log("poster is",response1.poster);
				this.setState({currentMovieInfo: response1,
					currentMovieTitle: response1.title,
					currentMovieDescription: response1.description,
					currentMoviePoster: response1.poster,
					currentMovieImdbId: response1.imdbID,
					currentMovieRating: response1.rating,
					currentMovieWatched: response1.watched.toString()
				});
				this.changeShowMovie();//this toggles display to showMovie
			}.bind(this)
		});
	},
	render: function(){//this render function holds all of the components rendered in the app
		// console.log('rendering.');
		// console.log('this.state.currentMovie', this.state.currentMovie);
		//If the user is logged in all this stuff happens, and there be a else statement down thizair to do stuff if not logged in yall
		//btwwws this rachel ;)
		//If the display is user and showMovie is no, render the first set of conditions
		//If the display is search, render the search results
		//If the display is user and showMovie is yes, render the MovieDisplay
		//If the else (meaning you are not authenticated), login and signup is displayed
		if(this.state.authUser === true){
			if (this.state.display === 'user' && this.state.showMovie === 'no'){
				return(
					<div>
					<FwaukingSearchBar 
						text={this.state.search} 
						onSearchInput={this.handleSearchInput}
						onChange={this.changeSearchState}
						changeDisplay={this.changeDisplay}
						/>
					<ShowUser 
						movieInfo={this.changeToMovieInfoDisplay}
						movies={this.state.movies} 
						name={this.state.username} 
						text={this.state.search}
						changeShowMovie={this.changeShowMovie}
						changeCurrentMovie={this.changeCurrentMovie}
						logout={this.changeLogout}
						delete={this.changeLogout}
						movieAjax={this.movieAjax}
						/>
					</div>
				)
			} else if (this.state.display === 'search'){
				return(
					<ShowSearch
						display={this.state.display}
						searchData={this.state.searchMovie}
						changeDisplay={this.changeDisplay}
						changeShowMovie={this.changeShowMovie}
					/>
				)

			} else if (this.state.display === 'user' && this.state.showMovie === 'yes') {
					// console.log('I need help displaying');
					return(
						<MovieDisplay
							movieAjax={this.movieAjax}
							changeShowMovie={this.changeShowMovie}
							currentMovie={this.state.currentMovie}
							currentMovieInfo={this.state.currentMovieInfo}
							currentMovieTitle={this.state.currentMovieTitle}
							currentMovieDescription={this.state.currentMovieDescription}
							currentMoviePoster={this.state.currentMoviePoster}
							currentMovieWatched={this.state.currentMovieWatched}
							currentMovieRating={this.state.currentMovieRating}
							currentMovieImdbId={this.state.currentMovieImdbId}
							showAjax={this.showAjax}/>
					)
				}
		} else {
			return(
				<div>
					<h1>3 Fwauks Movies</h1>
					<FwakingLogin 
						loginCheck={this.state.authUser} 
						onChange={this.changeLogin} />
					<FwakingSignUp onChange={this.changeLogin}/>
				</div>
			);
		}
	}
});

var FwakingLogin = React.createClass({
	getInitialState: function(){//Initial state is set to the props of auth user via the attribute "loginCheck"
		return{
			username: this.props.loginCheck,
			password: this.props.loginCheck,
			loginStatus: this.props.loginCheck
		};	
	},
	handleLoginFormChange: function(stateName, e){
		var change = {};
		// console.log(e.target.value);
		// console.log("===> This is stateName: ", stateName);
		change[stateName] = e.target.value;
		this.setState(change);//sets state to the input of login form
	},
	handleSubmit: function(e){//The submit will be handled by passing the username and password through the loginAJAX call
		e.preventDefault();
		var username = this.state.username.trim();
		var password = this.state.password.trim();
		this.loginAJAX(username, password);
	},
	loginAJAX: function(username, password){//sends the data grabbed to the auth route and logs the user in
		$.ajax({
			url: "/auth",
			method: "POST", 
			data: {
				username: username, 
				password: password
			},

			success: function(data){//set the cookis for JWT Token, username and ID
				// console.log("===>This is loginAJAX success data: ", data);
				Cookies.set("jwt_token", data.token);
				Cookies.set("username", data.username);
				Cookies.set("id", data.id);
				this.props.onChange(data.token)//this changes state
			}.bind(this)
		});
	},
	render: function(){//renders login form
		return(
			<div className="login-form" >
        <h3>Please Login</h3>
        <form className="log" onSubmit={this.handleSubmit}>
          <label htmlFor="username">Username</label>
          <input className="username-login-form" type="text" placeholder="username" 
          onChange={this.handleLoginFormChange.bind(this, 'username')}/>
          <br/>
          <label htmlFor="password">Password</label>
          <input className="password-login-form" type="password" placeholder="password" onChange={this.handleLoginFormChange.bind(this, 'password')}/>
          <br/>
          <input className="login-form-submit" type="submit"/>
        </form>
    </div>
		);
	}
})

// ==================================
// Signup Code - child of Kingcomponent
// ==================================
var FwakingSignUp = React.createClass({
	handleSignUpFormChange: function(stateName, e){
		var change = {};
		// console.log("===> This is stateName: ", stateName);
		change[stateName] = e.target.value;
		this.setState(change);//sets state to the input of signup form
	},
	handleSubmit: function(e){//The submit will be handled by passing the username and password through the signUpAJAX call
		e.preventDefault();
		var username = this.state.username.trim();
		var password = this.state.password.trim();
		this.signUpAJAX(username, password);
	},
	loginAJAX2: function(username, password){
		$.ajax({
			url: "/auth",
			method: "POST", 
			data: {
				username: username, 
				password: password
			},
			success: function(data){
				// console.log("===>This is loginAJAX success data: ", data);
				Cookies.set("jwt_token", data.token);
				Cookies.set("username", data.username);
				Cookies.set("id", data.id);
				this.props.onChange(data.token)
			}.bind(this)
		});
	},
	signUpAJAX: function(username, password){//AJAX call takes the username and password entered by the user and runs it through the create.user route
		$.ajax({
			url: "/users",
			method: "POST", 
			data: {
				username: username, 
				password: password,
			},
			success: function(data){//upon success, we invoke the loginAjax with the same new user info to automatically log the user in
				// this.loginAJAX2(username, password);
				// console.log("===>This is signUpAJAX success data: ", data);
				this.loginAJAX2(username, password);
			}.bind(this)
		});
	},
	render: function(){//renders signup form
		return(
			<div className="signup-form" >
				<h3>SignUp Fam!</h3>
				<form className="log" onSubmit={this.handleSubmit}>
					<label htmlFor="username">Username</label>
					<input 
						className="username-signup-form" 
						type="text" 
						placeholder="username"
						onChange={this.handleSignUpFormChange.bind(this, 'username')}
					/>
					<br/>
					<label htmlFor="password">Password</label>
					<input 
						className="password-signup-form"
						type="text" 
						placeholder="password"
						onChange={this.handleSignUpFormChange.bind(this, 'password')}
					/>
					<br/>
					<input className="signup-form-submit" type="submit"/>
				</form>
			</div>
		);
	}
});
var ShowUser = React.createClass({//show user component
	handleClick: function(e){
		// console.log("This is e.target: ", e.target);
		// console.log(typeof e.target);
		// console.log(e.target.src);
		// console.log(e.target.id);
		this.props.changeCurrentMovie(e.target.id);//passes changeCurrentMovie down to ShowUser component and invoked with e.target.id from image element. This sets the state to show current movie
		this.props.movieAjax(e.target.id);//Calls the movieAjax to display selected movie and sets the state of current movie properties
		e.preventDefault();//prevents page from refreshing
	},
	handleLogoutClick: function(e) {
		this.props.logout();//calls a prop that deletes the cookies and sets state to default, loggin the user out
	},
	handleDeleteClick: function(e) {
		// console.log('delete was clicked');
		// console.log(Cookies("id"));
		this.deleteAjax(Cookies("id"));//calls the delete ajax and passes the user ID, which has been stored as a cookie
		this.props.logout();//calls a prop that deletes the cookies and sets state to default, logging the user out...re-rendering the page
	},
	deleteAjax: function(id) {//calls delete route. deletes the user by user id
		$.ajax({
			url:"/users/" + id,
			method:"DELETE",
			success: function() {
				console.log("hello delete ajax is hit");
				this.props.logout();
			}.bind(this)
		})
	},
	render: function() {
		// console.log("props ==>", this.props.posters);
		// console.log(this.props.movies);
		var movies = this.props.movies;
		if (movies.length > 0) {//if there is at least 1 movie present, we map over posters and render the posters 
			var selfie = this;
			// console.log("this is selfie", selfie);
			var posters = movies.map(function(movie){
				// console.log(movie);
			return (
				<div className="movie-posters">
					<img 
					src={movie.poster} id={movie._id} 
					onClick={selfie.handleClick}
					/>
				</div>
			)
		});
			//console.log("this is movie title", movies[0].title);
			return(
				<div>
					<h1 className="welcome-user">Welcome {this.props.name}</h1>
					<p className="aka1">a.k.a</p>
					<p className="aka">{this.props.name}Licious...</p>
					<p className="aka">{this.props.name}Rooney...</p>
					<p className="aka">{this.props.name}Batootie...</p>
	        <p className="wanted-movies">Check out my fwauking movies baaatch:</p>
	        <div className="user-movies">{posters}</div>
	        <button onClick={selfie.handleLogoutClick} >logout</button>
	        <br />
	        <button onClick={selfie.handleDeleteClick}>Delete user</button>
		    </div>
	    );
		} else {
			return(
				<div>
					<h1>you have no movies sad face</h1>
				</div>
			)
		}
	}
});

var FwaukingSearchBar = React.createClass({//The search bar
	handleSearchChange: function(e) {//Keeps track of searchbar value as the user types
		// console.log(e.target.value);
		this.props.onSearchInput(
		this.refs.textInput.value
		);
	},
	handleSubmit: function(e) { ///What happens after submitting search query.
		e.preventDefault();
		// console.log(this.state);
		var searchText = this.props.text.trim();
		// console.log(searchText);
		this.omdbAjax(searchText);///Search omdb
		this.props.changeDisplay();//Changes to display the search component
	}, 
	omdbAjax: function(searchText) {//omdb request. Our external API. One of our requirements
		$.ajax({
			url:"https://www.omdbapi.com/?t=" + searchText,
			method:"GET",
			success: function(data) {
				// console.log("===> This is the data type of results below: ", typeof data);
				// console.log(data);
				this.props.onChange(data);//Changes the state of searchMovie. Used for the search display
			}.bind(this)
		});
	},
	render: function() {
		return(
			<div className="searchForm" >
			<form onSubmit={this.handleSubmit}>
				<label 
					className="search-label" 
					htmlFor="search">Search some Fwauking movie
				</label>
				<br/>
				<input 
					className="search-barForm" 
					type="text" 
					placeholder="search" 
					value={this.props.text}
					ref="textInput"
        	onChange={this.handleSearchChange}
        />
				<button className="search-button">fwauking button</button>
			</form>
			</div>
		)
	}
})
var ShowSearch = React.createClass({//Show search results
	handleClick: function(e) {
		var id = Cookies("id");
		this.makeMovie(id);
	},
	makeMovie: function(id) {//this sets the movie data which will be used to save into the database.
		var movieData = {
		imdbID:this.props.searchData.imdbID,
		title:this.props.searchData.Title,
		poster:this.props.searchData.Poster,
		description:this.props.searchData.Plot,
		watched: false,
		rating: "",
	}
		$.ajax({
			url: "/users/" + id + "/newmovie",
			method:"PUT",
			data: movieData,
			success: function(data) {
				//console.log("this is the data from ajax movie stuff",data);
				this.props.changeDisplay(); //Switches display to show user page
			}.bind(this)
		})
	},
	goBack: function(e) { ///If the user wants to go back but does not want to add the movie
		e.preventDefault();
		this.props.changeDisplay();//Switches display to show user page.
	},
	render: function() {



			if (this.props != null) {
			//console.log("these be the props yall >: ", this.props.searchData);
			return(
				<div>
					<h1 className="search-result-title">{this.props.searchData.Title}</h1>
					<img 
						src={this.props.searchData.Poster} 
						className="search-image" 
					/>
					<p className="search-movie-info">{this.props.searchData.Plot}</p>
					<button onClick={this.handleClick}>fork this movie</button>	
					<button onClick={this.goBack}>Go back to your User Page!</button>
				</div>
			)
		} else {
			return(
				<h1>you fwauked the search up</h1>
			)
		}
	}
})
var MovieDisplay = React.createClass({//Displays the movies from the user page
	deleteMovie: function(e){//Deleting a single movie from the user's movie list.
		e.preventDefault();
		// console.log(this.props.currentMovie);
		// console.log(Cookies("id"));
		this.deleteMovieAjax();
		this.props.showAjax();
		this.props.changeShowMovie();
	},
	deleteMovieAjax: function(e) {//Ajax call for deleting the user movies.
		$.ajax({
			url: "/users/"+Cookies("id")+"/delete/"+this.props.currentMovie,
			type: "DELETE",
			success: function(){
				// console.log("deleted");
			}
		}).done();
	},
	handleSubmit: function(e){
		e.preventDefault();
	},
	handleClick: function(e){
		e.preventDefault();
		this.props.changeShowMovie();//If the user wants to go back to their user page, it changes the display
	},
	render: function(){
		// console.log("these are the props:", this.props.currentMovieWatched);
		// console.log(this.props.currentMovieWatched);

		return (
			<div id="movie-display-container">
				<p className="movie-display-header"> Movie Info</p>
				<img 
					src={this.props.currentMoviePoster} 
					className="search-image"
				/>
				<p className="movie-display-title">Title: {this.props.currentMovieTitle}</p>
				<p className="movie-display">Description: {this.props.currentMovieDescription}</p>
				<p className="movie-display">Rating: {this.props.currentMovieRating}</p>
				<p className="movie-display">Watched: {this.props.currentMovieWatched}</p>
				<button onClick={this.handleClick}>Back to User Page</button>
				<button onClick={this.deleteMovie}>Delete</button>
			</div>
		)
	}
});

// ==========================
//  REACT DOM
// ==========================

ReactDOM.render(
	<KingComponent />, 
document.getElementById("container"));


//	 ____________
//	/ Gregginator\
// |______________\
// |   ---   ---  | \
// |    C     C   |__\
// |       U      |
// \     \___/    /
//  \____     ___/
//       \___/



////////////////////////
//scrap////
///////////////////////
				// console.log("==========================");
				// console.log(data.movies[1].title);
				// console.log('=======================');
				// console.log("touch me please " , data.movies);
				// console.log(typeof data.movies[1]);
				// this.setState({movies: data.movies[0]});
				// console.log("movie data yo", data.movies[0]);
					// getInitialState: function(){
	// 	return{
	// 		username: this.props.loginCheck,
	// 		password: this.props.loginCheck,
	// 		loginStatus: this.props.loginCheck,
	// 	}
	// },
			// console.log("====>This is poster: ", posters);
		// console.log(typeof this.props.movies);
		// console.log("proppsss", this.props.movies);
		// var movies = this.props.movies;
		// console.log(movies[1].title);
		// var movies = this.props.movies.map(function(movie){})
