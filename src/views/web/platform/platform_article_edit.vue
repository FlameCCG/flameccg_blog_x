<template>
    <div class="platform_article_edit_view">
        <fc_web_card title="编辑文章">
            <Fc_article_form @ok="editUpdeate" :article-id="Number(route.params.id)"> </Fc_article_form>
        </fc_web_card>
    </div>
</template>
<script setup lang="ts">
import { articleCreateApi, articleUpdateApi, type ArticleCreateRequest } from "@/api/article_api";
import Fc_article_form from "@/components/web/article/fc_article_form.vue";
import fc_web_card from "@/components/web/fc_web_card.vue"
import router from "@/router";
import { Message } from "@arco-design/web-vue";
import { useRoute } from "vue-router";
const route = useRoute();

const editUpdeate = async (form: ArticleCreateRequest) => {
    console.log(route.params.id, form);
    const res = await articleUpdateApi({
        id: Number(route.params.id),
        ...form
    });
    Message.success(res.msg);
    router.push({ name: "platformArticle" })
}
</script>

<style lang="less">
.platform_article_edit_view {
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
}
</style>