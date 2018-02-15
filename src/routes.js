import Places from './views/place/Places';
import PlaceForm from './views/place/PlaceForm';
import MenuForm from './views/menu/MenuForm';

export default {
    places: {
        name: 'Places',
        path: '/places',
        exact: true,
        component: Places,
        addToNav: true,
    },
    newPlace: {
        name: 'New place',
        path: '/places/new',
        exact: true,
        component: PlaceForm,
        addToNav: false
    },
    editPlace: {
        name: 'Edit place',
        path: '/places/:id',
        exact: true,
        component: PlaceForm,
        addToNav: false
    },
    placeMenu: {
        name: 'Place menu',
        path: '/places/:id/menu',
        exact: true,
        component: MenuForm,
        addToNav: false
    },
}