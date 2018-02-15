import React, { Component } from 'react';
import Button from 'material-ui/Button';
import AddIcon from 'material-ui-icons/Add';
import { withRouter, Link } from 'react-router-dom';
import styled from 'styled-components';
import LocalBar from 'material-ui-icons/LocalBar';

import Panel from './../../components/Panel';
import api from './../../api';
import Loader from './../../components/Loader';

class Places extends Component {

	constructor() {
		super();

		this.state = {
			places: null
		}
	}

	componentWillMount() {
		api.place.getPlaces().then(snapshot => {
			this.setState({ places: snapshot.val() || {} });
		});
	}

	render() {
		const { places } = this.state;

		if(!places) return <Loader size="100px" color="#d6dbe0" center />

		return (
			<div>
				<Panel>
					{Object.keys(places).map((key, i) => {
						const place = places[key];
						return (
							<PlaceItem key={i}>
								<LocalBar fontSize color="primary" style={{ fontSize: 30, margin: '0 20px -8px 0' }} />
								<Link to={'/places/'+key}>{place.name}</Link>
								<span>{place.city}, {place.street}</span>
							</PlaceItem>
						)
					})}
				</Panel>
				<Button variant="fab" color="primary" style={{float:'right'}} onClick={() => this.props.history.push('/places/new')}>
					<AddIcon />
				</Button>
			</div>
		);
	}
}

export default withRouter(Places);

const PlaceItem = styled.div`
	padding: 15px 0;
	border-bottom:1px solid #D5D6D8;
	&:first-child {
		padding-top:0;
	}
	&:last-child {
		padding-bottom:0;
		border:none;
	}
	a {
		color: #000000;
		font-size:18px;
		text-decoration:none;
		transition:all .2s ease-in-out;
		&:hover {
			color: #4053AF;
		}
	}
	span {
		color: #8e8e8e;
		font-size: 15px;
		top: -1px;
		display: inline-block;
		position: relative;
		margin-left: 15px;
	}
`