<template>
    <div class="upload-form">
        <div>
            <form @submit="onSubmit">
                <input type="number" v-model="fileNum" min="1" max="100" /><br />
                <input type="submit" value="アップロード" />
            </form>
        </div>
    </div>
</template>

<script>
import connection from '@/modules/ApiConnection'

export default {
    name: 'UploadForm',
    data: function () {
        return {
            // ファイル数
            fileNum: 1,
        }
    },
    methods: {
        /**
         * 送信
         */
        async onSubmit(e) {
            e.preventDefault()

            try {
                const data = {
                    fileNum: this.fileNum,
                    filePath: this.generateFilePath(),
                }
                const response = await connection.post('api/file/upload', data)
                if (response.data.result) {
                    alert('アップロードに成功しました')
                } else {
                    alert('アップロードに失敗しました')
                }
            } catch (error) {
                alert('通信エラー')
                console.error(error)
            }
            this.fileNum = 1
        },
        /**
         * ファイルパス生成
         */
        generateFilePath() {
            const chars = 'ABCDEFGHIJKLMNOPQURSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890'
            let path = ''
            for (let i = 0; i < 10; i++) {
                const index = Math.floor(Math.random() * chars.length)
                path += chars[index]
            }
            return path
        },
    },
}
</script>

<style scoped>
</style>
