import React, { Component } from 'react';
import Button from 'material-ui/Button';
import { withRouter } from 'react-router-dom';
import TextField from 'material-ui/TextField';
import styled from 'styled-components';
import RemoveCircleOutline from 'material-ui-icons/RemoveCircleOutline';
import Switch from 'material-ui/Switch';
import { connect } from 'react-redux';

import Panel from './../../components/Panel';
import Loader from './../../components/Loader';
import api from './../../api';

class MenuForm extends Component {

    constructor() {
        super();
        
		this.state = {
            busy: true,
            place: null,
        }

        this.emptyDish = {
            name: '',
            description: '',
            price: '',
            available: true
        }

        this.emptySection = {
            name: '',
            dishes: [{...this.emptyDish}]
        }

        this.emptyMenu = {
            sections: [{...this.emptySection}]
        }
    }
    
    componentWillMount() {
        this.placeKey = this.props.match.params.id;
        
        api.place.getPlace(this.placeKey)
            .then(snapshot => {
                this.setState({ place: snapshot.val() }); 

                api.menu.getMenu(this.placeKey)
                    .then(snapshot => {
                        this.setState({ 
                            menu: snapshot.val() || {...this.emptyMenu},
                            busy: false
                        });                             
                    });
            });
    }

    _handleSectionNameChange(e, sectionIndex) {
        const update = {...this.state.menu};
        update.sections = [...update.sections]
        update.sections[sectionIndex].name = e.target.value
        this.setState({ menu: update });
    }

    _onDishChange(val, sectionIndex, dishIndex, key) {
        console.log(val, sectionIndex, dishIndex, key)
        const update = {...this.state.menu}
        update.sections = [...update.sections]
        update.sections[sectionIndex].dishes = [...update.sections[sectionIndex].dishes, {...this.emptyDish}]
        update.sections[sectionIndex].dishes[dishIndex] = [...update.sections[sectionIndex].dishes[dishIndex]]
        update.sections[sectionIndex].dishes[dishIndex][key] = val
        this.setState({ menu: update });
    }

    _addSection() {
        const update = {...this.state.menu};
        update.sections = [...update.sections, {...this.emptySection}]
        this.setState({ menu: update });
    }

    _addDish(sectionIndex) {
        const update = {...this.state.menu}
        update.sections = [...update.sections]
        update.sections[sectionIndex].dishes = [...update.sections[sectionIndex].dishes, {...this.emptyDish}]
        this.setState({ menu: update });
    }

    _onSubmit(e) {

    }

    render() {
        const { busy, place, menu } = this.state;

        if(busy) return <Loader size="100px" color="#d6dbe0" center />

        console.log(place, menu);

		return (
            <form ref="menuForm" onSubmit={this._onSubmit.bind(this)}>
                {menu.sections.map((section, i) => {
                    return (
                        <Panel key={i}>
                            <TextField
                                name="name"
                                label="Section name"
                                value={menu.sections[i].name}
                                onChange={e => this._handleSectionNameChange(e, i)}
                                margin="normal"
                                fullWidth={true}
                                required
                            />
                            <Dishes dishes={section.dishes} sectionIndex={i} onDishChange={this._onDishChange.bind(this)} onAddDish={() => this._addDish.bind(this)(i)} />
                        </Panel>
                    )
                })}
                <Button style={{float: 'right'}} onClick={this._addSection.bind(this)} variant="raised">
                    Add menu section
                </Button>
            </form>
        )
    }
}

const mapStateToProps = state => {
    return {
        user: state.auth.user
    }
}

export default withRouter(connect(mapStateToProps)(MenuForm));

const Dishes = props => {
    return (
        <DishesWrapper>
            {props.dishes.map((dish, i) => {
                return (
                    <Dish key={i}>
                        <TextField
                            name="name"
                            label="Dish name"
                            value={dish.name}
                            onChange={e => props.onDishChange(e.target.value, props.sectionIndex, i, 'name')}
                            margin="dense"
                            style={{width: '32%'}}
                            required
                        />
                        <TextField
                            name="price"
                            label="Price"
                            value={dish.price}
                            onChange={e => props.onDishChange(e.target.value, props.sectionIndex, i, 'price')}
                            margin="dense"
                            style={{marginRight: '2%', marginLeft: '2%', width: '32%'}}
                            required
                        />
                        Available
                        <Switch
                            checked={dish.available}
                            onChange={(e, checked) => props.onDishChange(checked, props.sectionIndex, i, 'available')}
                        />
                        <TextField
                            name="description"
                            label="Description"
                            value={dish.description}
                            onChange={e => props.onDishChange(e.target.value, props.sectionIndex, i, 'description')}
                            margin="dense"
                            fullWidth
                            required
                        />
                    </Dish>
                )
            })}
            <Button variant="raised" onClick={props.onAddDish} style={{float: 'right'}} >
                Add dish
            </Button>
        </DishesWrapper>
    )
} 

const DishesWrapper = styled.div`
    padding-left: 60px;
    padding-top: 20px;
`

const Dish = styled.div`
    margin-bottom: 20px;
    padding: 8px 20px 15px;
    background: #f7f7f7;
`