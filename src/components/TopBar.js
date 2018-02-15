import React, { Component } from 'react';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';

import routes from './../routes';
import { signOut } from './../views/auth/actions';

class TopBar extends Component {
	render() {
		return (
			<AppBar position="static"  >
				<Toolbar>
					<Typography variant="title" color="inherit" style={{flex:1}}>
						QR Order
          			</Typography>
					{
					Object.keys(routes)
						.filter(routeName => routes[routeName].addToNav )
						.map((routeName, i) => {
							const { name, path } = routes[routeName];
							return <Button key={i} color="inherit" onClick={() => this.props.history.push(path) } >{name}</Button> 
						})
					}
					<Button color="inherit" onClick={() => this.props.signOut()} >Sign out</Button>
        		</Toolbar>
				
			</AppBar>
		);
	}
}

const actions = {
	signOut
}

export default withRouter(connect(null, actions)(TopBar));