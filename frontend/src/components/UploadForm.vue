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
import axios from 'axios'

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
                }
                const response = await axios.post('http://localhost:3000/api/file/upload', data)
                console.log(response)
            } catch (error) {
                console.error(error)
            }
        }
    },
}
</script>

<style scoped>
</style>
