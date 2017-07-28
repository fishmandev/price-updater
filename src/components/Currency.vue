<template>
    <div class="currency">
        <div class="container">
            <table class="table table-hover table-condensed table-currency">
                <thead>
                    <tr>
                        <th class="col-sm-1">#</th>
                        <th class="col-sm-2">Название</th>
                        <th class="col-sm-4">Курс</th>
                    </tr>
                </thead>
                <tbody v-if="currencies && currencies.length">
                    <tr v-for="currency of currencies" :class="{ editing: currency == editCurrency }">
                        <th>{{ currency.symbol }}</th>
                        <td>{{ currency.name }}</td>
                        <td @dblclick="editRate(currency)" class="rate-label">{{ currency.rate }}</td>
                        <td class="rate-edit">
                            <input type="text"
                                   v-model="currency.rate"
                                   v-currency-focus="currency == editCurrency"
                                   @keyup.esc="cancelEdit(currency)"
                                   @blur="doneEdit(currency)"
                                   @keyup.enter="doneEdit(currency)">
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
  import axios from 'axios'

  export default {
    name: 'currency',
    data () {
      return {
        currencies: [],
        editCurrency: null
      }
    },
    created () {
      axios.get(process.env.BACKEND_URL + '/currency/list')
        .then(response => {
          this.currencies = response.data.currencies
        })
        .catch(e => {
          console.log(e)
        })
    },
    methods: {
      editRate (currency) {
        this.beforeEditCache = currency.rate
        this.editCurrency = currency
      },
      cancelEdit (currency) {
        this.editCurrency = null
        currency.rate = this.beforeEditCache
      },
      doneEdit (currency) {
        if (!this.editCurrency) {
          return
        }
        this.editCurrency = null
        currency.rate = currency.rate.trim()

        var data = new URLSearchParams()
        data.append('rate', currency.rate)
        axios.put(process.env.BACKEND_URL + '/currency/update/' + currency.id, data)
          .then(response => {})
          .catch(e => {
            console.log(e)
          })
      }
    },
    // a custom directive to wait for the DOM to be updated
    // before focusing on the input field.
    // http://vuejs.org/guide/custom-directive.html
    directives: {
      'currency-focus': function (el, binding) {
        if (binding.value) {
          el.focus()
        }
      }
    }
  }
</script>

<style scoped>
    .table-currency {
        width: 600px;
    }

    .editing .rate-label {
        display: none;
    }

    .editing .rate-edit {
        display: block;
    }

    .rate-edit {
        display: none;
    }

    .rate-edit input {
        padding: 0px;
        border: none;
    }
</style>