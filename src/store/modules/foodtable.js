import { getProducts, deleteProducts } from '../../api/request';
// initial state
const state = () => ({
    products: [],
    titles: [],
    deleteStatus: null,
    fetchStatus: null,
  })

  // getters
  const getters = {
    getProducts: (state) => state.products,
    getTitles: (state) => state.titles,
    getDeleteStatus: (state) => state.deleteStatus,
    getFetchStatus: (state) => state.fetchStatus
  }

  // actions
  const actions = {
    getProducts: async({commit}) => {
      try {
        const products = await getProducts();
        const titles = Object.keys(products[0]);
        commit('GET_PRODUCTS', {products, titles});
      } catch(err) {
        commit('GET_PRODUCTS', err);
      }

    },
    deleteProducts: async({commit}, payload) => {
       commit('RESET_DELETE_STATUS');
       try {
        await deleteProducts();
        commit('DELETE_PRODUCTS', payload);
       } catch(err) {
        commit('DELETE_PRODUCTS', err);
       }
    },
    resetDeleteStatus({commit}) {
      commit('RESET_DELETE_STATUS');
    },
    resetFetchStatus({commit}) {
      commit('RESET_FETCH_STATUS');
    },
    sortProducts({commit}, payload) {
      commit('SORT_PRODUCTS', payload);
    }
  }

  // mutations
  const mutations = {
    GET_PRODUCTS(state, payload) {
      if (payload.error) {
        state.fetchStatus = 'error';
      } else {
        state.products = payload.products;
        state.titles = payload.titles;
        state.fetchStatus = 'ok';
      }
    },
    DELETE_PRODUCTS(state, payload) {
      if (payload.error) {
        state.deleteStatus = 'error';
        console.log(payload.error);
      } else {
        payload.forEach(item => {
          const index = state.products.findIndex(p => p.id == item);
          state.products.splice(index, 1);
        })
        state.deleteStatus = 'ok';
      }
    },
    RESET_DELETE_STATUS(state) {
      state.deleteStatus = null;
    },
    RESET_FETCH_STATUS(state) {
      state.fetchStatus = null;
    },
    SORT_PRODUCTS(state, payload) {
      const {param, value} = payload;
      if (param[value] === 'INC') {
        state.products.sort((a,b) => {
          if (typeof(a[value]) !== 'string') {
            return a[value] - b[value]
          } else {
            let nameA = a[value].toUpperCase();
            let nameB = b[value].toUpperCase();
            if (nameA < nameB) {
              return -1;
            }
            if (nameA > nameB) {
              return 1;
            }
            return 0;
          }

        })
      } else {
        state.products.sort((a,b) => {
          if (typeof(a[value]) !== 'string') {
            return b[value] - a[value]
          } else {
            let nameA = a[value].toUpperCase();
            let nameB = b[value].toUpperCase();
            if (nameB < nameA) {
              return -1;
            }
            if (nameB > nameB) {
              return 1;
            }
            return 0;
          }
        })
      }
    }
  }

  export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
  }
