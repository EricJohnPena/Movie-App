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

const router = createRouter({
    history: createWebHistory(),
    routes: [
        // {
        //     path:"/",
        //     redirect: "/movies"
        // },
        {
            path:"/login",
            name: 'Login',
            component: LoginPage
        },
        {
            path: "/register",
            name: "Register",
            component: RegisterPage
        }
    ]
});



const app = createApp(App);

app.use(createPinia());
app.use(router);

app.mount('#app');