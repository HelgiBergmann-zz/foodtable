
import Vue from 'vue';
import Vuex from 'vuex';
import foodtable from './modules/foodtable';

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'production';

export default new Vuex.Store({
  modules: {
    foodtable
  },
  strict: debug,
})
