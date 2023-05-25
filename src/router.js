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
    { path: '/', component: () => import('./views/Home.vue'), beforeEnter: requireAuth, name: 'home' },
    { path: '/editar/:id', component: () => import('./views/Editar.vue'), beforeEnter: requireAuth, name: 'editar' },
    { path: '/login', component: () => import('./views/Login.vue'), name: 'login' },
    { path: '/register', component: () => import('./views/Register.vue'), name: 'register' },
];

const history = createWebHistory();

const router = createRouter({
    history,
    routes
});

export default router;