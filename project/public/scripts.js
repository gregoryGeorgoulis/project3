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
		};
	},
	changeLogin: function(){//state is set to the cookies of username and id
		this.setState({
			authUser: true, 
			username: Cookies("username"),
			id: Cookies("id")
		});
	},
	render: function(){
		console.log("====> authUser state: ", this.state.authUser);
		console.log("====> state of username: ", this.state.username);
		console.log("====> state of id: ", this.state.id);
		if(this.state.authUser === true){
			return(
				<div>
					<ShowUser />
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
		this.showAjax();
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
	showAjax: function() {
		$.ajax({
			url:"/users/" + this.stat.id,
			method:"GET",
			success: function(data) {
				console.log('(. )( .)');
				console.log(data);
				console.log('V');
			}
		}).bind(this);
	},

	render: function(){
		return(
			<div className="login-form" >
        <h3>Please Login</h3>
        <form onSubmit={this.handleSubmit}>
          <label htmlFor="username">Username</label>
          <input className="username-login-form" type="text" value={this.state.username} onChange={this.handleLoginFormChange.bind(this, 'username')}/>
          <br/>
          <label htmlFor="password">Password</label>
          <input className="password-login-form" type="text" value={this.state.password} onChange={this.handleLoginFormChange.bind(this, 'password')}/>
          <br/>
          <input type="submit"/>
        </form>
    </div>
		);
	}
})


var ShowUser =React.createClass({
	showAjax: function() {
		$.ajax({
			url:"/users/" + Cookies("id"),
			method:"GET",
			success: function(data) {
				console.log('(. )( .)');
				console.log(data);
				console.log('V');
			}
		})
	},
	render: function() {
		return(
			<div>
			{this.showAjax}
				<h1>touch my fwak</h1>
			}

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



