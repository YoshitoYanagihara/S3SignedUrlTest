<template>
    <div class="path-list">
        <button @click="reload">リロード</button>
        <table class="path-table" border="1">
            <tr>
                <th></th><th>パス</th><th>ファイル数</th>
            </tr>
            <tr v-for="item in paths" :key="item.path">
                <td><input type="checkbox" />
                <td>{{ item.path }}</td>
                <td>{{ item.files }}</td>
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
                Object.keys(response.data.list).forEach(key => {
                    const item = {
                        path: key,
                        files: response.data.list[key],
                    }
                    this.paths.push(item)
                })
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
    margin: auto;
}
</style>
