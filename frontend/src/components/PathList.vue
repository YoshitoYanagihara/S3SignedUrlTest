<template>
    <div class="path-list">
        <button @click="reload">リロード</button>
        <table class="path-table">
            <tr v-for="path in paths" :key="path">
                <td>{{ path }}</td>
            </tr>
        </table>
    </div>
</template>

<script>
import connection from '@/modules/ApiConnection'

export default {
    name: 'PathList',
    data: function () {
        return {
            paths: [],
        }
    },
    mounted: function () {
        this.reload()
    },
    methods: {
        /**
         * リロード
         */
        async reload() {
            this.paths.splice(0)
            try {
                const response = await connection.get('/api/file/list')
                this.paths.push(...[response.data.list])
            } catch (error) {
                alert('通信エラー')
                console.error(error)
            }
        },
    },
}
</script>

<style scoped>
.path-table {
    border: 1px solid #000000;
    margin: auto;
}
</style>
