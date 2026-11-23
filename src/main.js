import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'notyf/notyf.min.css';
import './style.css'

import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import { createPinia } from 'pinia';
import App from './App.vue';

import LoginPage from './pages/LoginPage.vue';
import RegisterPage from './pages/RegisterPage.vue';
import MovieCatalog from './pages/MovieCatalog.vue';
import ViewMovie from './pages/ViewMovie.vue';
import AddMovie from './pages/AddMovie.vue';

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path:"/",
            redirect: "/movies"
        },
        {
            path:"/login",
            name: 'Login',
            component: LoginPage
        },
        {
            path: "/register",
            name: "Register",
            component: RegisterPage
        },
        {
            path: "/movies",
            name: "Movies",
            component: MovieCatalog
        },
        {
            path: "/movies/:id",
            name: "View Movie",
            component: ViewMovie
        },
        {
            path: "/addMovie",
            name: "Add Movie",
            component: AddMovie
        }
        
    ]
});



const app = createApp(App);

app.use(createPinia());
app.use(router);

app.mount('#app');