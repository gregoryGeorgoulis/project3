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
			display: 'user',
			showMovie: 'no',
			currentMovie: '',
			currentMovieInfo: {},
			currentMovieTitle: '',
			currentMovieDescription: '',
			currentMoviePoster: '',
			currentMovieImdbId: '',
			currentMovieWatched: '',
			currentMovieRating: ''
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
	handleSearchInput: function(text) {
		this.setState({
			search: text,
		});
	},
	changeSearchState: function(data) {
		this.setState({
			searchMovie: data,
		})
	},
	changeDisplay: function(){
		console.log('changeDisplay is working');
		if (this.state.display === 'user'){
			this.setState({display: 'search'});
		} else {
			this.showAjax();
			this.setState({display: 'user'});
		}
	},

	changeShowMovie: function(){
		console.log('changeShowMovie is working');
		if (this.state.showMovie === 'yes') {
			this.setState({showMovie: 'no'});
		} else {
			this.showAjax();
			this.setState({showMovie: 'yes'});
		}
	},
	changeCurrentMovie: function(movieId){
		this.showAjax();
		console.log('changing current movie');
		console.log('movieId:', movieId);
		this.setState({currentMovie: movieId});
		console.log('now this.state.currentMovie:');
		console.log(this.state.currentMovie);
	},
	changeLogout: function() {
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
			success: function(data) {//upon success we set the var title to data we received
				// console.log("==========================");
				// console.log(data.movies[1].title);
				// console.log('=======================');
				// console.log("touch me please " , data.movies);
				// console.log(typeof data.movies[1]);
				// this.setState({movies: data.movies[0]});
				// console.log("movie data yo", data.movies[0]);
				var moviesArray = [];
				data.movies.forEach(function(movie) {
					moviesArray.push(
					 movie
					);
				})
				console.log('-----------------------------------------------------');
				console.log('the moviesARray', moviesArray);
				this.setState({movies: moviesArray});
				console.log('testing showajax');
			// 	 this.getFwakingData(daMovies);//we then invoke getFwakingData(which sets the state of movies) with our new data.
			 }.bind(this),
			error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
		})
	},
	movieAjax: function(thisMovieId){
		console.log('this is the current movie id:', this.state);
		$.ajax({
			url: '/users/movies/'+Cookies('id') +'/'+ thisMovieId,
			type: 'GET',
			success: function(response){
				console.log('success!');
				var response1
				for (var i = 0; i < response.length; i++){
					if (response[i]._id === thisMovieId) {
						console.log(response[i]);
						response1 = response[i];
					}
				}
				console.log("poster is",response1.poster);
				this.setState({currentMovieInfo: response1,
					currentMovieTitle: response1.title,
					currentMovieDescription: response1.description,
					currentMoviePoster: response1.poster,
					currentMovieImdbId: response1.imdbID,
					currentMovieRating: response1.rating,
					currentMovieWatched: response1.watched.toString()
				})
				this.changeShowMovie();
			}.bind(this)
		})
	},
	render: function(){
		console.log('rendering.');
		console.log('this.state.currentMovie', this.state.currentMovie);
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
				console.log('I need help displaying');
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
		console.log(e.target.value);
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
	loginAJAX: function(username, password){
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


	render: function(){
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
	// getInitialState: function(){
	// 	return{
	// 		username: this.props.loginCheck,
	// 		password: this.props.loginCheck,
	// 		loginStatus: this.props.loginCheck,
	// 	}
	// },
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
	signUpAJAX: function(username, password){
		$.ajax({
			url: "/users",
			method: "POST", 
			data: {
				username: username, 
				password: password,
			},
			success: function(data){
				this.loginAJAX2(username, password);
				// console.log("===>This is signUpAJAX success data: ", data);
				this.loginAJAX2(username, password);
			}.bind(this)
		});
	},
	render: function(){
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


var ShowUser = React.createClass({
	handleClick: function(e){
		console.log("This is e.target: ", e.target);
		console.log(typeof e.target);
		console.log(e.target.src);
		console.log(e.target.id);
		this.props.changeCurrentMovie(e.target.id);
		this.props.movieAjax(e.target.id);
		// var thisMovie = ;
		e.preventDefault();
	},
	handleLogoutClick: function(e) {
		this.props.logout();
	},
	handleDeleteClick: function(e) {
		console.log('delete was clicked');
		console.log(Cookies("id"));
		this.deleteAjax(Cookies("id"));
		this.props.logout();
	},
	deleteAjax: function(id) {
		$.ajax({
			url:"/users/" + id,
			method:"DELETE",
			success: function() {
				console.log('hello delete ajax is hit');
				this.props.logout();
			}.bind(this)
		})
	},
	render: function() {
		// console.log("props ==>", this.props.posters);

		console.log(this.props.movies);
		var movies = this.props.movies;
		

		// console.log("====>This is poster: ", posters);
		

		// console.log(typeof this.props.movies);
		// console.log("proppsss", this.props.movies);
		// var movies = this.props.movies;
		// console.log(movies[1].title);
		// var movies = this.props.movies.map(function(movie){})


		if (movies.length > 0) {
			var selfie = this;

			console.log("this is selfie", selfie);
			var posters = movies.map(function(movie){
				console.log(movie);
			return <div className="movie-posters"><img src={movie.poster} id={movie._id} onClick={selfie.handleClick}/></div>
		});
			//console.log("this is movie title", movies[0].title);
			return(
				<div>

					<h1 className="welcome-user">Welcome {this.props.name}</h1>
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

var FwaukingSearchBar = React.createClass({
	handleSearchChange: function(e) {
		// console.log(e.target.value);
		this.props.onSearchInput(
			this.refs.textInput.value
		);
	},
	handleSubmit: function(e) {
		e.preventDefault();
		// console.log(this.state);
		var searchText = this.props.text.trim();
		// console.log(searchText);
		this.omdbAjax(searchText);
		this.props.changeDisplay();
	}, 
	omdbAjax: function(searchText) {
		$.ajax({
			url:"https://www.omdbapi.com/?t=" + searchText,
			method:"GET",
			success: function(data) {
				// console.log("===> This is the data type of results below: ", typeof data);
				// console.log(data);
				this.props.onChange(data);

			}.bind(this)
		});
	},
	render: function() {

		return(
			<div className="searchForm" >
			<form onSubmit={this.handleSubmit}>
				<label className="search-label" htmlFor="search">Search some Fwauking movie</label>
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
var ShowSearch = React.createClass({
	handleClick: function(e) {
		var id = Cookies("id");
		this.makeMovie(id);
	},
	makeMovie: function(id) {
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
				this.props.changeDisplay();
			}.bind(this)
		})
	},
	goBack: function(e) {
		e.preventDefault();
		this.props.changeDisplay();
	},
	render: function() {



			if (this.props != null) {
			//console.log("these be the props yall >: ", this.props.searchData);
			return(
				<div>
					<h1 className="search-result-title">{this.props.searchData.Title}</h1>
					<img src={this.props.searchData.Poster} className="search-image" />
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

var MovieDisplay = React.createClass({
	deleteMovie: function(e){
		e.preventDefault();
		console.log(this.props.currentMovie);
		console.log(Cookies('id'));
		this.deleteMovieAjax();
		this.props.showAjax();
		this.props.changeShowMovie();
	},
	deleteMovieAjax: function(e) {
		$.ajax({
			url: '/users/'+Cookies("id")+'/delete/'+this.props.currentMovie,
			type: 'DELETE',
			success: function(){
				console.log('deleted');
			}
		}).done();
	},
	handleSubmit: function(e){
		e.preventDefault();
	},
	handleClick: function(e){
		e.preventDefault();
		this.props.changeShowMovie();
	},
	render: function(){
		console.log("these are the props:", this.props.currentMovieWatched);
		console.log(this.props.currentMovieWatched);
			return (
			<div>

			<p>This is movie display</p>
			<img src={this.props.currentMoviePoster}/>
			<p>Title: {this.props.currentMovieTitle}</p>
			<p>Description: {this.props.currentMovieDescription}</p>
			<p>Rating: {this.props.currentMovieRating}</p>
			<p>Watched: {this.props.currentMovieWatched}</p>
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