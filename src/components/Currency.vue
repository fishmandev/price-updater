<template>
    <div class="currency">
        <div class="container">
            <table class="table table-hover table-condensed">
                <thead>
                    <tr>
                        <th class="col-sm-1">#</th>
                        <th class="col-sm-2">Название</th>
                        <th class="col-sm-2">Курс</th>
                    </tr>
                </thead>
                <tbody v-if="currencies && currencies.length">
                    <tr v-for="currency of currencies">
                        <th>{{ currency.symbol }}</th>
                        <td>{{ currency.name }}</td>
                        <td>{{ currency.rate }}</td>
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
        currencies: []
      }
    },
    created () {
      axios.get('http://price-updater.zone/currency/list')
        .then(response => {
          this.currencies = response.data.currencies
        })
        .catch(e => {
          console.log(e)
        })
    }
  }
</script>

<style>
    .table {
        width: initial;
    }
</style>