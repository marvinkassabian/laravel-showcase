import { createApp } from 'vue';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import 'vuetify/styles';
import '@mdi/font/css/materialdesignicons.css';

import ExampleComponent from './components/ExampleComponent.vue';
import CreatePost from './components/CreatePost.vue';

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
}).use(vuetify).mount('#app');
