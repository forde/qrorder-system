import React, { Component } from 'react';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import styled from 'styled-components';
import Button from 'material-ui/Button';
import { connect } from 'react-redux';
import { signIn } from './actions';
import Loader from './../../components/Loader';


class Auth extends Component {
	constructor() {
		super();
		this.state = {
			email: 'test@test.com',
			password: 'test1234',
		}
	}

	_handleChange = name => event => {
		this.setState({
			[name]: event.target.value,
		});
	}

	_handleSubmit() {
		const { email, password } = this.state;
		this.props.signIn(email, password);
	}

	render() {
		const { error, loading } = this.props;

		return (
			<AuthScreen>
				<SignInBox elevetion={4}>

					{loading && <Loader size="60px" color="#d6dbe0" center />}

					{!loading &&
						<div>
							<Header>Sign in</Header>
							<TextField
								id="email"
								label="Email"
								placeholder="Email"
								fullWidth={true}
								value={this.state.email}
								onChange={this._handleChange('email')}
								margin="normal"
							/>
							<TextField
								id="password"
								label="password"
								type="password"
								placeholder="Password"
								fullWidth={true}
								value={this.state.password}
								margin="normal"
								onChange={this._handleChange('password')}
							/>
							{error && <Error>{error}</Error>}
							<Button variant="raised" color="primary" onClick={this._handleSubmit.bind(this)} style={{marginTop: '20px'}}>Sign in</Button>
						</div>
					}
				</SignInBox>
			</AuthScreen>
		);
	}
}

const mapStateToProps = state => {
	return {
		error: state.auth.error,
		loading: state.auth.loading,
	}
}

const actions = {
	signIn
}

export default connect(mapStateToProps, actions)(Auth);

const AuthScreen = styled.div`
	display:flex;
	flex-direction: column;
	justify-content:center;
	align-items:center;
	flex:1;
	min-height:100vh;
	background: #f4f6f7;
`

const SignInBox = styled(Paper)`
	padding:30px;
	width:400px;
	min-height:290px;
`

const Header = styled.h2`
	font-weight: 500;
	font-size: 20px;
	margin-bottom: 10px;
`

const Error = styled.p`
	color: #F44336;
	line-height: 1.4;
	font-size: 14px;
	margin-top: 10px;
`