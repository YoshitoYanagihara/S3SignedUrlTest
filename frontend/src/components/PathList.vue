<template>
    <div class="path-list">
        <button @click="reload">リロード</button>
        <table class="path-table" border="1">
            <tr>
                <th></th><th>パス</th><th>ファイル数</th>
            </tr>
            <tr v-for="item in paths" :key="item.path">
                <td><input type="checkbox" ref="gens" :value="item.path" />
                <td>{{ item.path }}</td>
                <td>{{ item.files }}</td>
            </tr>
        </table>
        <button @click="generateSignedUrl">署名付きURL発行</button>
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
        /**
         * 署名付きURL発行
         */
        async generateSignedUrl() {
            const paths = []
            this.$refs.gens.forEach(chk => {
                if (chk.checked) {
                    paths.push(chk.value)
                }
            })
            if (paths.length === 0) { return }

            try {
                const data = {
                    paths: paths,
                }
                const response = await connection.post('/api/file/gen', data)
                if (response.data.result) {
                    alert('署名付きURLを生成しました')
                } else {
                    alert('署名付きURLの生成に失敗しました')
                }
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
