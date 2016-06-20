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
				var moviesArray = this.state.movies;
				data.movies.forEach(function(movie) {
					moviesArray.push(
					 movie
					);
				})
				this.setState({movies: moviesArray});
			// 	 this.getFwakingData(daMovies);//we then invoke getFwakingData(which sets the state of movies) with our new data.
			 }.bind(this),
			error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
		})
	},
	render: function(){
		// console.log("====> authUser state: ", this.state.authUser);
		// console.log("====> state of username: ", this.state.username);
		// console.log("====> state of id: ", this.state.id);
		// console.log("====> state of movies: ", this.state.movies);
		// console.log("===> checking shit out bros", this.state.movies);
		if(this.state.authUser === true){
			return(
				<div>
				<FwaukingSearchBar 
					text={this.state.search} 
					onSearchInput={this.handleSearchInput}
					onChange={this.changeSearchState}
					/>
					<ShowUser 
						movies={this.state.movies} 
						name={this.state.username} 
						text={this.state.search}
					 />
				</div>
			);
		} else {
			return(
				<div>
					<h1>My fwak is dirty!</h1>
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
          <input className="password-login-form" type="text" placeholder="password" onChange={this.handleLoginFormChange.bind(this, 'password')}/>
          <br/>
          <input type="submit"/>
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
	render: function() {
		// console.log("props ==>", this.props.posters);

		var movies = this.props.movies;
		console.log('movies:');
		console.log(movies);
		console.log(movies[0]);
		// console.log(movies[0].title);
		// var poster = this.props.posters;
		// console.log("====>This is poster: ", posters);
		

		// console.log(typeof this.props.movies);
		// console.log("proppsss", this.props.movies);
		// var movies = this.props.movies;
		// console.log(movies[1].title);
		// var movies = this.props.movies.map(function(movie){})


		if (movies.length > 0) {
			var posters = movies.map(function(movie){
			return <img src={movie.poster}/>
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
		var searchText = this.props.text.trim();
		console.log(searchText);
		this.omdbAjax(searchText);
	}, 
	omdbAjax: function(searchText) {
		$.ajax({
			url:"http://www.omdbapi.com/?t=" + searchText,
			method:"GET",
			success: function(data) {
				console.log("===> This is the data type of results below: ", typeof data);
				console.log(data);
				changeSearchState(data);
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
// var ShowSearch = React.createClass({
// 	render: function() {
// 		return(

// 		)
// 	}
// })

// ==========================
//  REACT DOM
// ==========================

ReactDOM.render(
	<KingComponent />, 
document.getElementById("container"));