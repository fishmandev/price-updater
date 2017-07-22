<template>
    <div class="product">
        <div class="container">
            <table class="table table-hover table-condensed">
                <thead>
                <tr>
                    <th class="col-sm-1">#</th>
                    <th class="col-sm-4">Название</th>
                    <th class="col-sm-2">Цена</th>
                    <th class="col-sm-2">Валюта</th>
                    <th class="col-sm-6">Курс</th>
                </tr>
                </thead>
                <tbody v-if="items && items.length">
                <tr v-for="product of items"
                    :class="{ 'editing-currency': product == editProduct, warning: !product.currency }">
                    <th>{{ product.id }}</th>
                    <td>{{ product.name }}</td>
                    <td v-if="product.price">{{ product.price }}</td>
                    <td v-else>N/A</td>
                    <template v-if="product.currency">
                        <td>{{ product.currency.symbol }}</td>
                        <td>{{ product.currency.rate }}</td>
                    </template>
                    <template v-else>
                        <td @dblclick="editCurrency(product)"
                            class="currency-label">N/A
                        </td>
                        <td class="edit-currency">
                            <select v-model="selectedCurrency"
                                    class="form-control currency-list"
                                    v-currency-focus="product == editProduct"
                                    @blur="doneEditCurrency(product)"
                                    @keyup.esc="cancelEditCurrency(product)">
                                <option v-for="currency in currencies" :value="currency">
                                    {{ currency.symbol }} {{ currency.name }}
                                </option>
                            </select>
                        </td>
                        <td>N/A</td>
                    </template>
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
        currencies: [],
        selectedCurrency: null,
        items: [],
        pagination: {
          per_page: 10,
          current_page: 1,
          last_page: 0
        },
        editProduct: null
      }
    },
    created () {
      this.loadData()
      axios.get('http://price-updater.zone/currency/list')
        .then(response => {
          this.currencies = response.data.currencies
        })
        .catch(e => {
          console.log(e)
        })
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
      },
      editCurrency (product) {
        this.editProduct = product
      },
      cancelEditCurrency (product) {
        this.editProduct = null
      },
      doneEditCurrency (product) {
        if (!this.editProduct) {
          return
        }
        this.editProduct = null
        product.currency = this.selectedCurrency
        var data = new URLSearchParams()
        data.append('currency_id', this.selectedCurrency.id)
        axios.put('http://price-updater.zone/product/update/' + product.id, data)
          .then(response => {})
          .catch(e => {
            console.log(e)
          })
      }
    },
    components: {
      pagination
    },
    directives: {
      'currency-focus': function (el, binding) {
        if (binding.value) {
          el.focus()
        }
      }
    }
  }
</script>

<style>
    .currency-list {
        padding: 0px;
        height: 20px;
        width: 100px;
    }

    .edit-currency {
        display: none;
    }

    .editing-currency .edit-currency {
        display: block;
    }

    .editing-currency .currency-label {
        display: none;
    }

</style>