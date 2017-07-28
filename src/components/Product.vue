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
                    :class="{ 'editing-currency': product == editProduct, warning: !product.currency || !product.price, 'editing-price': product == editProductPrice }">
                    <th>{{ product.id }}</th>
                    <td>{{ product.name }}</td>
                    <td class="price-label"
                        v-if="product.price"
                        @dblclick="editPrice(product)">{{ product.price }}
                    </td>
                    <td class="price-label"
                        v-else
                        @dblclick="editPrice(product)">N/A</td>
                    <td class="edit-price">
                        <input type="text" class="price-input"
                               v-model="product.price"
                               v-focus="product == editProductPrice"
                               @keyup.esc="cancelPriceEdit(product)"
                               @blur="donePriceEdit(product)"
                               @keyup.enter="donePriceEdit(product)">
                    </td>
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
                                    v-focus="product == editProduct"
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
        editProduct: null,
        editProductPrice: null
      }
    },
    created () {
      this.loadData()
      axios.get(process.env.BACKEND_URL + '/currency/list')
        .then(response => {
          this.currencies = response.data.currencies
        })
        .catch(e => {
          console.log(e)
        })
    },
    methods: {
      loadData () {
        axios.get(process.env.BACKEND_URL + '/products/' + this.pagination.current_page)
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
        this.saveProduct(product.id, {
          currency_id: this.selectedCurrency.id
        })
      },
      editPrice (product) {
        this.beforeEditCache = product.price
        this.editProductPrice = product
      },
      cancelPriceEdit (product) {
        this.editProductPrice = null
        product.price = this.beforeEditCache
      },
      donePriceEdit (product) {
        if (!this.editProductPrice) {
          return
        }
        this.editProductPrice = null
        if (product.price) {
          product.price = product.price.trim()
          if (this.beforeEditCache !== product.price) {
            this.saveProduct(product.id, {
              price: product.price
            })
          }
        }
      },
      saveProduct (productId, productData) {
        var data = new URLSearchParams()
        for (var key in productData) {
          data.append(key, productData[key])
        }
        axios.put(process.env.BACKEND_URL + '/product/update/' + productId, data)
          .then(response => {
          })
          .catch(e => {
            console.log(e)
          })
      }
    },
    components: {
      pagination
    },
    directives: {
      'focus': function (el, binding) {
        if (binding.value) {
          el.focus()
        }
      }
    }
  }
</script>

<style scoped>
    .currency-list {
        padding: 0px;
        height: 20px;
        width: 100px;
    }

    .edit-currency,
    .edit-price,
    .editing-currency .currency-label,
    .editing-price .price-label {
        display: none;
    }

    .editing-currency .edit-currency,
    .editing-price .edit-price {
        display: block;
    }

    .price-input {
        border: 0;
    }
</style>