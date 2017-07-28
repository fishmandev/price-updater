<template>
    <div class="sync">
        <div class="container">
            <div class="row">
                <div class="col-sm-6">
                    <button class="btn btn-primary"
                            @click="syncImport">Import
                    </button>
                    <button class="btn btn-warning"
                            @click="syncExport">Export
                    </button>
                </div>
            </div>
            <br>
            <div class="row info" :class="{show: infoMsg}">
                <div class="col-sm-6">
                    <div class="alert alert-info">
                        <a class="close"
                           @click="closeMsg">&times;</a>
                        <strong>Info:</strong> {{ infoMsg}}
                    </div>
                </div>
            </div>
            <div class="row danger" :class="{show: errorMsg}">
                <div class="col-sm-6">
                    <div class="alert alert-danger">
                        <a href="#" class="close"
                           @click="closeMsg">&times;</a>
                        <strong>Error:</strong> {{ errorMsg }}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
  import axios from 'axios'

  export default {
    name: 'sync',
    data () {
      return {
        errorMsg: null,
        infoMsg: null
      }
    },
    methods: {
      syncImport () {
        axios.get(process.env.BACKEND_URL + '/sync/import')
          .then(response => {
            if (response.data.status === 0) {
              this.infoMsg = 'Total imported: ' + response.data.total
            } else {
              this.errorMsg = response.data.error
            }
          })
          .catch(e => {
            this.errorMsg = e.message
          })
      },
      syncExport () {
        axios.get(process.env.BACKEND_URL + '/sync/export')
          .then(response => {
            if (response.data.status === 0) {
              this.infoMsg = 'Updated successfully'
            } else {
              this.errorMsg = response.data.error
            }
          })
          .catch(e => {
            this.errorMsg = e.message
          })
      },
      closeMsg () {
        this.errorMsg = null
        this.infoMsg = null
      }
    }
  }
</script>

<style scoped>
    .info, .danger {
        display: none;
    }

    .show {
        display: block;
    }
</style>