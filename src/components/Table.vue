<template>
  <div class="container text-left">

    <h1>Table UI</h1>
    <div class="text-danger font-weight-bold" v-if="this.deleteStatus === 'error'">
      Server error please try to delete again
    </div>
    <div class="text-danger font-weight-bold" v-if="this.fetchStatus === 'error'">
      Server error please reload the page
    </div>
    <div v-else>
      <div class="panel">
      <div class="panel-sort">
        <span class="font-weight-bold" style="display: inline-block; padding:6px;">Sorting by:</span>
        <button
          v-for="title in [...titles].splice(1)"
          :key="title.id"
          :class="['btn', {'btn-success': sortFlags[title]}]"
          @click="sortTable(title)" > {{title}} </button>
    </div>
    <button :disabled="this.checkedProducts.length === 0"
      class="btn btn-success mr-3"
      @click="deleteProducts()">
      Delete {{this.checkedProducts.length ? `(${this.checkedProducts.length})` : ''}}
    </button>

    <b-dropdown class="mr-3" id="dropdown-1" :text="`${chosenPerPage} per page`" variant="outline-dark">
      <b-dropdown-item v-for="item in availablePerPage" :key="item" @click="choseItemsPerPages(item)">
        {{item}} Per Page
      </b-dropdown-item>
    </b-dropdown>

    <div class="mr-3">
      <button :disabled="this.currenPage === 0" @click="previousPage()" class="btn btn-outline-dark"> &lt; </button>
        {{countOfItems}}
      <button :disabled="this.currenPage * this.chosenPerPage >= this.items.length - this.chosenPerPage"
        @click="nextPage()" class="btn btn-outline-dark"> > </button>
     </div>

     <b-dropdown  variant="outline-dark" id="dropdown-form" :text="`${checkedColumns.length - 1} columns selected`" ref="dropdown" class="m-2">
      <b-dropdown-form>
        <b-form-group
          v-for="item in [...titles].splice(1)"
          :key="item"
          @submit.stop.prevent>
          <div class="custom-control custom-checkbox">
            <input type="checkbox" class="custom-control-input" :id="item" :value="item" v-model="checkedColumns">
            <label class="custom-control-label" :for="item">{{item}}</label>
          </div>
        </b-form-group>
      </b-dropdown-form>
     </b-dropdown>

    </div>

    <table class="table">
      <tr>
        <th v-for="title in titles" :key="title.id"
        :style="checkedColumns.indexOf(title) !== -1 ? 'display:table-cell' : 'display: none'">
         <div v-if="title === 'id'" class="custom-control custom-checkbox">
              <input type="checkbox" class="custom-control-input" :id="title"
              :value="selectAllVisibleFlag"  v-model="selectAllVisibleFlag" @change="selectAllVisible()">
              <label class="custom-control-label" :for="title"></label>
         </div>
        <button :class="['btn btn-table-header', {'btn-table-header-active': sortFlags[title]}]" v-else @click="sortTable(title)">
          {{ title }}
          <div style="display:inline-block; width: 8px;">
            <span :style="sortFlags[title] === 'INC' ? 'display:block': 'display: none'">&uarr;</span>
            <span :style="sortFlags[title] === 'DESC' ? 'display:block': 'display: none'">&darr;</span>
          </div>
        </button>
        </th>
      </tr>

      <tr v-for="(item) in itemsPerPage" :key="item.id">
        <td v-for="(value, field) in item"
            :style="checkedColumns.indexOf(field) !== -1 ? 'display:table-cell' : 'display: none'"
            :key="field.id">
            <div v-if="field === 'id'" class="custom-control custom-checkbox">
              <input type="checkbox" class="custom-control-input" :id="item.id" :value="item.id" v-model="checkedProducts">
              <label class="custom-control-label" :for="item.id"></label>
            </div>
            <span v-else>{{value}}</span>
        </td>
        <td>
          <b-button class="btn btn-reset" :id="`popover${item.id}`" href="#" tabindex="0">
             <b-icon icon="trash"></b-icon> <span class="ml-1">Delete</span>
          </b-button>
          <b-popover class="text-center"  placement="bottom" :target="`popover${item.id}`"  triggers="focus">
           Are you sure you want to delete item?
           <button class="btn btn-outline-dark" @click="closePop()">Cancel</button>
           <button class="btn btn-success" @click=" deleteProduct(item.id); closePop();">Confirm</button>
          </b-popover>
        </td>
      </tr>
    </table>
    </div>

  </div>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
  name: "Table",
  props: {
    items: Array,
    titles: Array
  },
  data: () => ({
    checkedProducts: [],
    checkedColumns: [],
    availablePerPage: [10, 15, 20],
    chosenPerPage: null,
    pages: null,
    currenPage: 0,
    valueForGrab: 0,
    itemsPerPage: [],
    countOfItems: null,
    sortFlags: {},
    selectAllVisibleFlag: null,
  }),
  created() {
    this.choseItemsPerPages();
  },
  beforeUpdate() {
    if (this.fetchStatus === 'ok') {
       this.checkedColumns = [...this.titles]
       this.$store.dispatch('foodtable/resetFetchStatus');
    }

    this.calculateItemsPerPage();
    if (this.deleteStatus === 'ok') {
      this.selectAllVisibleFlag = false;
    }
  },
  computed: {
    ...mapGetters({
      deleteStatus: 'foodtable/getDeleteStatus',
      fetchStatus: 'foodtable/getFetchStatus',
    })
  },
  methods: {
    deleteProducts() {
      const confirm = window.confirm(
        "Are you sure you want to delete this item?"
      );
      if (!confirm) {
        return;
      }
      this.$store.dispatch('foodtable/deleteProducts', this.checkedProducts);
    },
    deleteProduct(id) {
      console.log('wertet')
       this.$store.dispatch('foodtable/deleteProducts', [id]);
    },
    choseItemsPerPages(value = 10) {
      this.pages = this.items / value;
      this.chosenPerPage = value;
      this.countChanged = true;
    },
    nextPage() {
       this.currenPage++;
       this.calculateItemsPerPage();
    },
    previousPage() {
       this.currenPage--;
       this.calculateItemsPerPage();
    },
    calculateItemsPerPage() {
      const itemCopies = [...this.items];
      if (!this.countChanged) {
         this.valueForGrab = this.chosenPerPage * this.currenPage;
      }
      this.countChanged = false;
      this.countOfItems = `
        ${this.valueForGrab + 1} -
        ${this.valueForGrab + this.chosenPerPage > this.items.length ?
          this.items.length : this.valueForGrab + this.chosenPerPage } of
        ${this.items.length}`;
      if (this.valueForGrab + this.chosenPerPage > this.items.length) {
        this.itemsPerPage = itemCopies.splice(this.valueForGrab)
      } else {
         this.itemsPerPage = itemCopies.splice(this.valueForGrab, this.chosenPerPage);
      }
    },
    sortTable(value) {
      for (let key in this.sortFlags) {
        if (key !== value) this.sortFlags[key] = undefined;
      }
      this.sortFlags[value] = this.sortFlags[value] === undefined ?
        'INC' : this.sortFlags[value] === 'INC' ?
        'DESC' : 'INC';
      this.$store.dispatch('foodtable/sortProducts', {param: this.sortFlags, value})
    },
    selectAllVisible() {
      this.$store.dispatch('foodtable/resetDeleteStatus')
      if (this.selectAllVisibleFlag) {
         this.checkedProducts = [...this.itemsPerPage.map(i => i.id)]
      } else {
        this.checkedProducts = [];
      }
    },
    closePop() {
      this.$root.$emit('bv::hide::popover')
    }
  }
};
</script>

<!-- Add "scoped"  attribute to limit CSS to this component only -->
<style>
.custom-control {
   cursor: pointer;
}
.custom-control-label {
  cursor: pointer;
}
.custom-checkbox .custom-control-input:checked~.custom-control-label::before{
  background-color:#28a745;
}
.btn.btn-table-header {
  padding: 0;
  font-size: 14px;
}
th .btn {
  font-weight: bold;
}
.btn.btn-table-header-active,
.btn.btn-table-header-active:hover {
  color: #28a745;
  text-decoration: underline;
}
.btn.btn-table-header-active:focus {
  outline: none;
  border: none;
  box-shadow: none;
}
.panel {
  display: flex;
  flex-flow: row wrap;
  align-items: center;
  font-size: 14px;
}
.panel .btn {
  font-size: 14px;
}
.panel-sort {
  margin-right: 28px;
}
.panel-sort .btn {
  padding-left: 6px;
  padding-right: 6px;
}
table {
  font-size: 14px;
}
.btn.btn-outline-dark {
  border-color: #ccc;
}
.btn.btn-outline-dark:hover, .btn-outline-dark:focus {
  background: none;
  color: #343a40;
}
.show > .btn.btn-outline-dark.dropdown-toggle {
  background: none;
  color: #343a40;
}
.dropdown-menu li {
  font-size: 14px;
}
.btn.btn-reset, .btn.btn-reset:hover, .btn.btn-reset:focus {
  padding: 0;
  background: none;
  color: #343a40;
  border: none;
  font-size: 12px;
}
</style>
