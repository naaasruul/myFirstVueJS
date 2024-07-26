const {createRouter, createWebHistory} = VueRouter;

import Game from "./components/Game.js";
import Index from "./components/Index.js";
import Leaderboards from "./components/Leaderboards.js";

const routes = [
    {
        path:'/',
        component:Index,
    },
    {
        path:'/game/:mode',
        component:Game,
    },
    {
        path:'/leaderboards/:mode',
        component:Leaderboards,
    }
]

const router = createRouter({
    routes,
    history:createWebHistory()
})

export default router