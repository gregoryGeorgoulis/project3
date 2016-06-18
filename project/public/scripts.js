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
			movies:"",
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
	getFwakingData: function(title) {
		this.setState({movies:title});
	},
	showAjax: function() {
		$.ajax({
			url:"/users/" + this.state.id,
			method:"GET",
			success: function(data) {
				console.log('(. )( .)');
				console.log(data.movies[0].title);
				var title = data.movies[0].title;
				console.log('V', title);
				 // this.setState({movies: title});
				 this.getFwakingData(title);
			}.bind(this),
			error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
		})
	},
	render: function(){
		console.log("====> authUser state: ", this.state.authUser);
		console.log("====> state of username: ", this.state.username);
		console.log("====> state of id: ", this.state.id);
		console.log("====> state of movies: ", this.state.movies);
		if(this.state.authUser === true){
			return(
				<div>
					<ShowUser title={this.state.movies} name={this.state.username} />
				</div>
			);
		} else {
			return(
				<div>
					<h1>My fwak is dirty!</h1>
					<FwakingLogin loginCheck={this.state.authUser} onChange={this.changeLogin} />
				</div>
			);
		}
	}
});

var FwakingLogin = React.createClass({
	getInitialState: function(){
		return{
			username: this.props.loginCheck,
			password: this.props.loginCheck,
			loginStatus: this.props.loginCheck
		};	
	},
	handleLoginFormChange: function(stateName, e){
		var change = {};
		console.log("===> This is stateName: ", stateName);
		change[stateName] = e.target.value;
		this.setState(change);
	},
	handleSubmit: function(e){
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
				console.log("===>This is loginAJAX success data: ", data);
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


var ShowUser =React.createClass({
	render: function() {
		console.log("props ==>", this.props);
		return(
			<div>
				<h1>{this.props.name}</h1>
				<h1>whats to watch {this.props.title}</h1>
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



