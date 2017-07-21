<template>
    <div class="product">
        <div class="container">
            <table class="table table-hover table-condensed">
                <thead>
                <tr>
                    <th class="col-sm-1">#</th>
                    <th class="col-sm-2">Название</th>
                    <th class="col-sm-4">Цена</th>
                </tr>
                </thead>
                <tbody v-if="items && items.length">
                <tr v-for="product of items">
                    <th>{{ product.id }}</th>
                    <td>{{ product.name }}</td>
                    <td>{{ product.price }}</td>
                </tr>
                </tbody>
            </table>
            <pagination :pagination="pagination" :callback="loadData" size="small"></pagination>
        </div>
    </div>
</template>

<script>
  import axios from 'axios'
  import pagination from 'vue-bootstrap-pagination'

  export default {
    name: 'product',
    data () {
      return {
        items: [],
        pagination: {
          per_page: 10,
          current_page: 1,
          last_page: 0
        }
      }
    },
    created () {
      this.loadData()
    },
    methods: {
      loadData () {
        axios.get('http://price-updater.zone/products/' + this.pagination.current_page)
          .then(response => {
            this.pagination = response.data.pagination
            this.items = response.data.items
          })
          .catch(e => {
            console.log(e)
          })
      }
    },
    components: {
      pagination
    }
  }
</script>
