import React, { Component } from 'react';
import Button from 'material-ui/Button';
import { withRouter } from 'react-router-dom';
import TextField from 'material-ui/TextField';
import styled from 'styled-components';
import CenterFocusStrong from 'material-ui-icons/CenterFocusStrong';
import CenterFocusWeak from 'material-ui-icons/CenterFocusWeak';
import RemoveCircleOutline from 'material-ui-icons/RemoveCircleOutline';
import { connect } from 'react-redux';
import Dialog from 'material-ui/Dialog';
import Slide from 'material-ui/transitions/Slide';
import QRCode from 'qrcode.react';

import Panel from './../../components/Panel';
import Loader from './../../components/Loader';
import api from './../../api';


class PlaceForm extends Component {

    constructor() {
		super();
		this.state = {
            name: '',
            city: '',
            street: '',
            codes: [],
            busy: true,
            dialogOpen: false,
        }
    }
    
    componentWillMount() {
        this.placeKey = this.props.match.params.id;
        
        if(this.placeKey) {
            api.place.getPlace(this.placeKey)
                .then(snapshot => {
                    this._setPlaceData(snapshot.val()); 
                });
        } else {
            this.setState({ busy: false });
        }
    }

    _setPlaceData(data) {
        this.setState({
            name: data.name,
            city: data.city,
            street: data.street,
            codes: !data.codes ? [] : Object.keys(data.codes).map(key => {
                return {
                    id: key,
                    description: data.codes[key].description
                }
            }),
            busy: false,
        })
    }

    _handleChange = name => event => {
        const val = event.target.value;
        if(name.indexOf('.') === -1) {
            this.setState({ [name]: val });
        } else {
            const path = name.split('.');

            if(path.length === 3) {
                let update = [...this.state[path[0]]];
                update[path[1]][path[2]] = val;
                this.setState({ [path[0]] : update });
            }
        }
    }

    _addCode() {
        this.setState({
            codes: [...this.state.codes, { description: ''}]
        })
    }

    _removeCode(index) {
        this.setState({
            codes: this.state.codes.filter((el, i) => i !== index)
        })
    }

    _onSubmit(e) {
        e.preventDefault();
        const { name, city, street, codes } = this.state;

        this.setState({ busy: true });

        if(!this.placeKey) {
            // create new place
            const newPlaceKey = api.place.addPlace({ name, city, street, codes });
            if(newPlaceKey) this.props.history.push('/places/'+newPlaceKey);
        } else {
            //save place
            api.place.updatePlace(this.placeKey, { name, city, street, codes })
                .then(snapshot => {
                    this._setPlaceData(snapshot.val()); 
                    this.setState({ busy: false });
                });
        }
    }

    _deletePlace() {
        api.place.deletePlace(this.placeKey) 
        this.props.history.push('/places');
    }

    _showCode(code) {
        this.setState({ 
            dialogOpen: true,
            dislogCode: code
        })
    }

    _codeDialog() {
        if(!this.state.dialogOpen) return

        return (
            <Dialog
                open={true}
                transition={props => <Slide direction="up" {...props} />}
                onClose={() => this.setState({ dialogOpen: false, dislogCode: null })}
            >
                <CodeWrapper>
                    <QRCode 
                        value={'/places/'+this.placeKey+'/'+this.state.dislogCode.id}
                        size={300}
                        bgColor="#fff"
                        fgcolor="#000"
                        level="L" /* 'L' 'M' 'Q' 'H' */
                    />
                </CodeWrapper>  
            </Dialog>
        );
    }
    
	render() {
        const { busy, name, city, street, codes } = this.state;

        if(busy) return <Loader size="100px" color="#d6dbe0" center />

		return (
            <form ref="placeForm" onSubmit={this._onSubmit.bind(this)}>
                <Panel>
                    <Header>Place name & address</Header>
                    <TextField
                        name="name"
                        label="Place name"
                        value={name}
                        onChange={this._handleChange('name')}
                        margin="normal"
                        style={{width: '32%'}}
                        required
                    />
                    <TextField
                        name="city"
                        label="City"
                        value={city}
                        onChange={this._handleChange('city')}
                        margin="normal"
                        style={{marginRight: '2%', marginLeft: '2%', width: '32%'}}
                        required
                    />
                    <TextField
                        name="street"
                        label="Street"
                        value={street}
                        onChange={this._handleChange('street')}
                        margin="normal"
                        style={{width: '32%'}}
                        required
                    />                    
                </Panel>

                <Panel>
                    <Header>Codes</Header>
                    {codes.map((code, i) => {
                        return (
                            <div key={i}>
                                {code.id && <CenterFocusStrong fontSize color="primary" style={{ fontSize: 38, margin: '0 20px -16px 0', cursor: 'pointer' }} onClick={() => this._showCode.bind(this)(code)} />}
                                {!code.id && <CenterFocusWeak fontSize color="primary" style={{ fontSize: 38, margin: '0 20px -16px 0' }} />}
                                <TextField
                                    name={'code-'+i+'desc'}
                                    label="Description"
                                    value={code.description}
                                    onChange={this._handleChange('codes.'+i+'.description')}
                                    margin="normal"
                                    style={{width: '61.5%'}}
                                    required
                                />
                                <RemoveCircleOutline color="error" onClick={() => this._removeCode(i)} style={{ margin: '0 0 -7px 15px', cursor: 'pointer' }} />
                            </div>
                        )
                    })}
                    <Button variant="raised" style={{float:'right'}} onClick={this._addCode.bind(this)}>
                        Add code
                    </Button>              
                </Panel>
                
                <Button color="primary" component={props => <button {...props} />} variant="raised">
                    Save place settings
                </Button>
                
                {this.placeKey &&
                    <Button variant="raised" style={{marginLeft:30}} onClick={() => this.props.history.push('/places/'+this.placeKey+'/menu')}>
                        Edit menu
                    </Button>
                }

                {this.placeKey &&
                    <Button color="secondary" variant="raised" style={{float: 'right'}} onClick={this._deletePlace.bind(this)}>
                        Delete place
                    </Button>
                }

                {this._codeDialog()}

            </form>
		);
	}
}

const mapStateToProps = state => {
    return {
        user: state.auth.user
    }
}

export default withRouter(connect(mapStateToProps)(PlaceForm));

const Header = styled.h2`
	font-weight: 500;
	font-size: 20px;
	margin-bottom: 10px;
`

const CodeWrapper = styled.div`
    padding: 20px 20px 18px;
`