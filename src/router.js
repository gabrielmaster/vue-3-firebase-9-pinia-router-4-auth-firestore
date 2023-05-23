import { createRouter, createWebHistory } from 'vue-router';
import { useUserStore } from './stores/user';


const requireAuth = async (to, from, next) => {
    const userStore = useUserStore();
    userStore.loadingSession = true;
    const user = await userStore.currentUser();
    if(user){
        next();
    }else {
        next('/login');
    }
    userStore.loadingSession = false;
};

const routes = [
    { path: '/', component: () => import('./views/Home.vue'), beforeEnter: requireAuth },
    { path: '/editar/:id', component: () => import('./views/Editar.vue'), beforeEnter: requireAuth },
    { path: '/login', component: () => import('./views/Login.vue') },
    { path: '/register', component: () => import('./views/Register.vue') },
];

const history = createWebHistory();

const router = createRouter({
    history,
    routes
});

export default router;