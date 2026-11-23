import { defineStore } from 'pinia';
import { reactive } from 'vue';
import api from '../api';

export const useGlobalStore = defineStore('user', () => {
    let user = reactive({
        token: localStorage.getItem("token"),
        email: null,
        isAdmin: null
    });

    async function getUserDetails(token = localStorage.getItem("token")) {
        if (!token) {
            user.token = null;
            user.email = null;
            user.isAdmin = null;
            return;
        }

        try {
            let { data } = await api.get("/users/details");
            

            const userData = data.user || data;

            user.token = token;
            user.email = userData.email;
            user.isAdmin = userData.isAdmin;
            
        } catch (error) {
            console.error("Failed to fetch user details:", error);
            
            
            user.token = null;
            user.email = null;
            user.isAdmin = null;
            localStorage.removeItem("token");
        }
    }

    return {
        user,
        getUserDetails
    }
});