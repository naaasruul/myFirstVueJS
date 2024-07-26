const {createApp} = Vue;
import router from "./router.js";

const app = createApp({})

app.use(router)
app.mount('#app')