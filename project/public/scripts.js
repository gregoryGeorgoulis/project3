// ==========================
// KING COMPONENT
// ==========================

var KingComponent = React.createClass({
	getInitialState: function(){//initial state of user logged in
		var userCheck;
		if(document.cookie){
			userCheck = true;
		} else {
			userCheck = "";
		}
		return{
			username: "",
			authUser: userCheck,
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
					<h1>Lick my fwak</h1>
				</div>
			);
		}
	}
});


// ==========================
//  REACT DOM
// ==========================

ReactDOM.render(
	<KingComponent />, 
document.getElementById("container"));



