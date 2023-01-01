const routes = {
    campgrounds: {
        index: {
            route: '/campgrounds',
            method: 'get',
        },
        show: {
            route: '/campgrounds/:id',
            method: 'get',
        },
        new: {
            route: '/campgrounds/new',
            method: 'get',
        },
        post: {
            route: '/campgrounds/',
            method: 'post',
        },
        edit_page: {
            route: '/campgrounds/:id/edit',
            method: 'get',
        },
        edit: {
            route: '/campgrounds/:id',
            method: 'put',
        },
        delete: {
            route: '/campgrounds/:id',
            method: 'delete',
        },
    },
    reviews: {
        post: {
            route: '/campgrounds/:id/reviews',
            method: 'post',
        },
        delete: {
            route: '/campgrounds/:id/reviews/:reivewId',
            method: 'delete',
        },
    },
    users: {
        register_page: {
            route: '/register',
            method: 'get',
        },
        register: {
            route: '/register',
            method: 'get',
        },
        login_page: {
            route: '/login',
            method: 'get',
        },
        login: {
            route: '/login',
            method: 'post',
        },
        logout: {
            route: '/logout',
            method: 'get',
        },
    },
}