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
			currentMovieInfo: {}
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
		this.setState({currentMovie: movieId});
		this.movieAjax();
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
				this.setState({movies: moviesArray});
				console.log('testing showajax');
			// 	 this.getFwakingData(daMovies);//we then invoke getFwakingData(which sets the state of movies) with our new data.
			 }.bind(this),
			error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
		})
	},
	movieAjax: function(){
		$.ajax({
			url: '/users/'+this.state.currentMovie,
			type: 'GET',
			success: function(response){
				console.log(response);
				this.setState({currentMovieInfo: response})
			}.bind(this)
		})
	},
	render: function(){
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
					changeShowMovie={this.changeShowMovie}
					currentMovie={this.state.currentMovie}/>
				)
			}
		} else {
			return(
				<div>
					<h1>3 Fwauks Movies</h1>
					<FwakingLogin 
						loginCheck={this.state.authUser} 
						onChange={this.changeLogin} />
					<FwakingSignUp />
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
        <form onSubmit={this.handleSubmit}>
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
	signUpAJAX: function(username, password){
		$.ajax({
			url: "/users",
			method: "POST", 
			data: {
				username: username, 
				password: password,
			},
			success: function(data){
				// console.log("===>This is signUpAJAX success data: ", data);
			}.bind(this)
		});
	},
	render: function(){
		return(
			<div className="signup-form" >
				<h3>SignUp Fam!</h3>
				<form onSubmit={this.handleSubmit}>
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
		// var thisMovie = ;
		e.preventDefault();
		this.props.changeShowMovie();
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
			return <div><img src={movie.poster} id={movie._id} onClick={selfie.handleClick}/></div>
		});
			console.log("this is movie title", movies[0].title);
			return(
				<div>
					<h1>Welcome {this.props.name}</h1>
					<h1>{this.props.name}lishous</h1>
					<h1>{this.props.name}rooney</h1>
					<h1>{this.props.name}batootie</h1>
	        <h1>these are your fwauking movies bitch:</h1>
	        {posters}
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
		console.log(e.target.value);
		this.props.onSearchInput(
			this.refs.textInput.value
		);
	},
	handleSubmit: function(e) {
		e.preventDefault();
		console.log(this.state);
		var searchText = this.props.text.trim();
		console.log(searchText);
		this.omdbAjax(searchText);
		this.props.changeDisplay();
	}, 
	omdbAjax: function(searchText) {
		$.ajax({
			url:"http://www.omdbapi.com/?t=" + searchText,
			method:"GET",
			success: function(data) {
				console.log("===> This is the data type of results below: ", typeof data);
				console.log(data);
				this.props.onChange(data);

			}.bind(this)
		});
	},
	render: function() {

		return(
			<div className="searchForm" >
			<form onSubmit={this.handleSubmit}>
				<label htmlFor="search">Search some Fwauking movie</label>
				<br />
				<input 
					className="search-barForm" 
					type="text" 
					placeholder="search" 
					value={this.props.text}
					ref="textInput"
        	onChange={this.handleSearchChange}
        />
				<button>fwauking button</button>
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
		watch: false,
		rating: "",
	}
		$.ajax({
			url: "/users/" + id + "/newmovie",
			method:"PUT",
			data: movieData,
			success: function(data) {
				console.log("this is the data from ajax movie stuff",data);
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
			console.log("these be the props yall >: ", this.props.searchData);
			return(
				<div>
					<p>hello person</p>
					<h1>{this.props.searchData.Title}</h1>
					<img src={this.props.searchData.Poster} />
					<p>{this.props.searchData.Plot}</p>
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
	handleClick: function(e){
		e.preventDefault();
		this.props.changeShowMovie();
	},
	render: function(){
		return(
			<div>
			<p>This is movie display</p>
			<p>{this.props.currentMovie}</p>
			<button onClick={this.handleClick}>Back to User Page</button>
			</div>
		)
	}
})

// ==========================
//  REACT DOM
// ==========================

ReactDOM.render(
	<KingComponent />, 
document.getElementById("container"));