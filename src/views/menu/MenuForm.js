import React, { Component } from 'react';
import Button from 'material-ui/Button';
import { withRouter } from 'react-router-dom';
import TextField from 'material-ui/TextField';
import styled from 'styled-components';
import RemoveCircleOutline from 'material-ui-icons/RemoveCircleOutline';
import Switch from 'material-ui/Switch';
import { connect } from 'react-redux';
import uuid from 'uuid/v1';

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
            available: true,
            uuid: '',
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
        this.setState({ 
            menu: { ...this.state.menu, 
                sections: this.state.menu.sections.map((section, sI) => {
                    if(sI !== sectionIndex) return section;
                    return { ...section, name: e.target.value }
                })
            } 
        });
    }

    _onDishChange(val, sectionIndex, dishIndex, key) {
        this.setState({ 
            menu: { ...this.state.menu, 
                sections: this.state.menu.sections.map((section, sI) => {
                    if(sI !== sectionIndex) return section;
                    return { ...section, dishes: section.dishes.map((dish, dI) => {
                        if(dI !== dishIndex) return dish;
                        return { ...dish, [key]: val}
                    })}
                })
            } 
        });
    }

    _addSection() {
        const update = {...this.state.menu};
        const emptySection = {...this.emptySection};
        emptySection.dishes[0] = {...this.emptyDish, uuid: uuid()}
        update.sections = [...update.sections, emptySection];
        this.setState({ menu: update });
    }

    _removeSection(sectionIndex) {
        const update = {...this.state.menu};
        update.sections = update.sections.filter((section, sI) => sI !== sectionIndex)
        this.setState({ menu: update });
    }

    _addDish(sectionIndex) {
        const update = {...this.state.menu}
        update.sections = [...update.sections]
        update.sections[sectionIndex].dishes = [...update.sections[sectionIndex].dishes, {...this.emptyDish, uuid: uuid()}]
        this.setState({ menu: update });
    }

    _removeDish(sectionIndex, dishIndex) {
        const update = {...this.state.menu}
        update.sections = [...update.sections]
        update.sections[sectionIndex].dishes = update.sections[sectionIndex].dishes.filter((dish, dI) => dI !== dishIndex);
        this.setState({ menu: update });
    }

    _onSubmit(e) {
        e.preventDefault();
        this.setState({ busy: true });

        api.menu.updateMenu(this.placeKey, this.state.menu)
            .then(snapshot => {
                this.setState({ 
                    menu: snapshot.val(),
                    busy: false 
                });
            });
    }

    render() {
        const { busy, place, menu } = this.state;

        if(busy) return <Loader size="100px" color="#d6dbe0" center />

        console.log(place, menu);

		return (
            <form ref="menuForm" onSubmit={this._onSubmit.bind(this)}>
                {menu.sections.map((section, i) => {
                    return (
                        <Panel key={i} style={{position:'relative'}}>
                            <TextField
                                name="name"
                                label="Section name"
                                value={menu.sections[i].name}
                                onChange={e => this._handleSectionNameChange(e, i)}
                                margin="normal"
                                fullWidth={true}
                                required
                            />
                            <RemoveSectionBtn color="error" onClick={() => this._removeSection.bind(this)(i)} />
                            <Dishes 
                                dishes={section.dishes} 
                                sectionIndex={i} 
                                onDishChange={this._onDishChange.bind(this)} 
                                onAddDish={() => this._addDish.bind(this)(i)} 
                                onRemoveDish={this._removeDish.bind(this)}
                            />
                        </Panel>
                    )
                })}
                <Button color="primary" component={props => <button {...props} />} variant="raised">
                    Save menu settings
                </Button>
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
                        <RemoveDishBtn color="error" onClick={() => props.onRemoveDish(props.sectionIndex, i)} />
                        <TextField
                            name="description"
                            label="Description"
                            value={dish.description}
                            onChange={e => props.onDishChange(e.target.value, props.sectionIndex, i, 'description')}
                            margin="dense"
                            fullWidth
                            required
                        />
                        <Uuid defaultValue={'UUID: '+dish.uuid} readonly />
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
    position: relative;
`

const RemoveSectionBtn = styled(RemoveCircleOutline)`
    position: absolute;
    cursor: pointer;
    top: 8px;
    right: 8px;
`

const RemoveDishBtn = styled(RemoveCircleOutline)`
    position: absolute; 
    left: -48px; 
    top: 50%; 
    margin-top: -12px; 
    cursor: pointer;
`

const Uuid = styled.input`
    background: transparent;
    border: none;
    width: 100%;
    color: #868686;
    outline: none;
`