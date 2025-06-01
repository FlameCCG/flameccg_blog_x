import { createApp, nextTick } from 'vue';
import { createPinia } from 'pinia';
import ArcoVue from '@arco-design/web-vue';
import ArcoVueIcon from '@arco-design/web-vue/es/icon';
import '@/assets/base.css';
import '@arco-design/web-vue/dist/arco.css';
import '@/assets/scrollbar.css';
import App from './App.vue';
import router from './router';
import '@/assets/iconfont.css';
import '@/assets/weather_icon/qweather-icons.css';
import 'nprogress/nprogress.css';
import 'vue-json-pretty/lib/styles.css';

const app = createApp(App);

app.use(ArcoVue);
app.use(ArcoVueIcon);
app.use(createPinia());
app.use(router);
app.mount('#app');
