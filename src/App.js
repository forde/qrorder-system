import React, { Component } from 'react';
import { Route, withRouter, Redirect, Switch } from 'react-router-dom';
import styled from 'styled-components';
import { connect } from 'react-redux';

import Auth from './views/auth/Auth';
import firebase from './firebase';
import TopBar from './components/TopBar';
import Loader from './components/Loader';
import routes from './routes';

import { setUser } from './views/auth/actions';

class App extends Component {

	componentWillMount() {
		firebase.auth().onAuthStateChanged(user => {
			this.props.setUser(user);
		});
	}

	render() {
		const { user, history } = this.props;

		if(user === false) return <Loader size="100px" color="#d6dbe0" center />

		if(user === null) {
			if(history.location.pathname !== '/auth') return <Redirect to="/auth"/>
			return <Route exact={true} path="/auth" component={Auth}/>
		}

		if(user && history.location.pathname === '/auth') {
			return <Redirect to="/"/>
		}

		return (
			<div>
				<TopBar/>
				<ViewsWprapper>
					<Switch>
						{Object.keys(routes).map((routeName, i) => {
							const { path, component, exact } = routes[routeName];
							return <Route key={i} exact={exact} path={path} component={component}/>
						})}
					</Switch>
				</ViewsWprapper>
			</div>
		);
	}
}

const mapStateToProps = state => {
	return {
		user: state.auth.user
	}
}

const actions = {
	setUser
}

export default withRouter(connect(mapStateToProps, actions)(App));

const ViewsWprapper = styled.div`
	padding: 24px;
`


