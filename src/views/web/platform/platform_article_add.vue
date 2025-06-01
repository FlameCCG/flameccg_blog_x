<template>
    <div class="platform_article_add_view">
        <fc_web_card title="发布文章">
            <Fc_article_form @ok="publishArticle"></Fc_article_form>
        </fc_web_card>
    </div>
</template>
<script setup lang="ts">
import fc_web_card from "@/components/web/fc_web_card.vue"
import { articleCreateApi, type ArticleCreateRequest } from "@/api/article_api";
import 'md-editor-v3/lib/style.css';
import { Message } from "@arco-design/web-vue";
import router from '@/router';
import Fc_article_form from "@/components/web/article/fc_article_form.vue";


const publishArticle = async (form: ArticleCreateRequest) => {
    try {
        const res = await articleCreateApi(form);
        console.log(res);
        Message.success(res.msg);
        console.log(res.data);
        router.push({ name: "platformArticle" })
        console.log("跳转成功")
    } catch (error) {
        console.log(error);
    }
}

</script>
<style lang="less">
.platform_article_add_view {
    .fc_card_com {
        .body {
            max-height: calc(100% - 160px);
            overflow-y: auto;
            width: 100%;

            .md-editor-toolbar-wrapper .md-editor-toolbar {
                justify-content: flex-start;
            }

            .md-editor-toolbar-wrapper .md-editor-toolbar-item {
                margin: 0 1.5px;
            }
        }

    }

    // .form-more-setting {
    //     display: flex;
    //     flex-direction: column;
    //     max-height: 400px;
    //     overflow-y: auto;

    //     .article_cover_col {
    //         flex-direction: column;

    //         >div {
    //             width: 100%;
    //         }

    //         .show {
    //             margin-top: 10px;
    //         }
    //     }

    //     .cover_mask {
    //         height: 120px;
    //         border: @fc_border;
    //         border-radius: 5px;
    //         display: flex;
    //         flex-direction: column;
    //         align-items: center;
    //         justify-content: center;
    //         cursor: pointer;

    //         .upload_text {
    //             font-size: 12px;
    //         }

    //         color: var(--color-text-2);

    //         svg {
    //             font-size: 30px;
    //         }
    //     }
    // }

    // .arco-collapse-item {
    //     .arco-collapse-item-header {
    //         padding: 0;
    //         border: none;

    //         .arco-collapse-item-icon-hover {
    //             left: 62px;
    //         }
    //     }

    //     .arco-collapse-item-content {
    //         border: none;
    //         padding-right: 0;
    //         background: transparent;
    //         padding-left: 0;
    //         max-height: 500px;
    //     }
    // }

    // .actions {
    //     .arco-btn {
    //         margin-right: 10px;
    //     }
    // }
}
</style>