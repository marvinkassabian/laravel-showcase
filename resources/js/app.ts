import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import 'vuetify/styles';
import '@mdi/font/css/materialdesignicons.css';

import ExampleComponent from './components/ExampleComponent.vue';
import CreatePost from './components/CreatePost.vue';

const pinia = createPinia();

const vuetify = createVuetify({
    components,
    directives,
    theme: {
        defaultTheme: 'light'
    }
});

createApp({
    components: {
        ExampleComponent,
        CreatePost
    }
}).use(pinia).use(vuetify).mount('#app');
