<template>
    <div class="user_collect_list_view">
        <Fc_collect_list :user-i-d="Number(route.params.id)" :is-me="store.isMe">
        </Fc_collect_list>
        <Fc_article_list :is-check="store.isMe" @dispatch-delete="dispatchDeleteHandler" ref="articleListRef">
        </Fc_article_list>
    </div>
</template>

<script setup lang="ts">
import { articleListApi, type articleListRequest, type articleListType } from '@/api/article_api';
import Fc_article_list from '@/components/web/article/fc_article_list.vue';
import { useRoute, useRouter } from 'vue-router';
import { userBaseInfoStore } from '@/stores/user_base_store';
import { ref } from 'vue';
import Fc_collect_list from '@/components/web/article/fc_collect_list.vue';
import { collectDeleteApi, removeCollectArticle, type removeCollectArticleReq } from '@/api/collect_api';
import { Message } from '@arco-design/web-vue';
const store = userBaseInfoStore();
const route = useRoute();
const router = useRouter();
const articleListRef = ref<InstanceType<typeof Fc_article_list>>();
const dispatchDeleteHandler = async (req: number[]) => {
    let params: removeCollectArticleReq = {
        articleIDList: req,
        collectionID: Number(route.params.query)
    }
    const res = await removeCollectArticle(params);
    Message.success(res.msg);
    articleListRef.value?.getData();
}
</script>

<style lang="less">
.user_collect_list_view {
    display: flex;

    .fc_category_list_view,
    .fc_collect_list_view {
        width: 150px;
    }

}
</style>