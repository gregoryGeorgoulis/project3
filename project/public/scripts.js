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
	getFwakingData: function(movies) {//This method gets our data and sets the state of 
		console.log(movies);
		this.setState({movies:movies});//The state of getFwakingData is now set to movies: title(which is the data we got back)
	},
	showAjax: function() {//This ajax call queries the database on the frontend via the get request in the users.js controller
		$.ajax({//get users by ID
			url:"/users/" + this.state.id,
			method:"GET",
			success: function(data) {//upon success we set the var title to data we received
				// console.log("==========================");
				// console.log(data.movies);
				// console.log('=======================');
				var daMovies = data.movies;
				var title = data.movies[0].title;
				var description = data.movies[0].description;
				var poster = data.movies[0].poster;
				// console.log('V', title);
				// var both = data.movies.forEach(function(movie) {
				// 	console.log('=======================');
				// 	console.log(movie.title);
				// 	console.log(movie.description);
				// 	console.log(movie.rating);							
				 // this.setState({movies: title});
				 this.getFwakingData(daMovies);//we then invoke getFwakingData(which sets the state of movies) with our new data.
			}.bind(this),
			error: function(xhr, status, err) {
        // console.error(this.props.url, status, err.toString());
      }.bind(this)
		})
	},
	render: function(){
		// console.log("====> authUser state: ", this.state.authUser);
		// console.log("====> state of username: ", this.state.username);
		// console.log("====> state of id: ", this.state.id);
		// console.log("====> state of movies: ", this.state.movies);
		// console.log("===> checking shit out bros", this.state.movies[0]);
		if(this.state.authUser === true){
			return(
				<div>
					<ShowUser movies={this.state.movies[1]} name={this.state.username} />
				</div>
			);
		} else {
			return(
				<div>
					<h1>My fwak is dirty!</h1>
					<FwakingLogin loginCheck={this.state.authUser} onChange={this.changeLogin} />
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
          <input className="username-login-form" type="text" placeholder="username" onChange={this.handleLoginFormChange.bind(this, 'username')}/>
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
		console.log("===> This is stateName: ", stateName);
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
				console.log("===>This is signUpAJAX success data: ", data);
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

var SearchBar = React.createClass({
	onClick: function(search) {
		$.ajax({
			url: 'http://www.omdbapi.com/?s='+search,
			type: 'GET',
			success: function(data){

			}
		})
	},
	render: function() {
		return(
			<input type="search" for="search" placeholder="Search Movies"></input>
		);
	}
});

var ShowUser =React.createClass({
	render: function() {
		// console.log("props ==>", this.props);
		// console.log(this.props.movies);
		// var movies = this.props.movies.map(function(movie){})
		
		return(
			<div>
				<h1>Welcome {this.props.name}</h1>
				
			</div>

		);
	}
})

// ==========================
//  REACT DOM
// ==========================

ReactDOM.render(
	<KingComponent />, 
document.getElementById("container"));