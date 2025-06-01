<template>
    <div class="fc_web_home">
        <fc_nav></fc_nav>
        <fc_main>
            <div class="left">
                <Fc_banner_list></Fc_banner_list>
                <Article_search_list></Article_search_list>
            </div>
            <div class="right">
                <template v-for="item in siteStore.siteInfo.indexRight.list">
                    <component v-if="item.enable" :is="mapData[item.title]"></component>
                </template>
            </div>
        </fc_main>
        <Fc_footer></Fc_footer>
    </div>
</template>

<script setup lang="ts">
import fc_nav from '@/components/web/fc_nav.vue';
import fc_main from '@/components/web/fc_main.vue';
import Fc_footer from '@/components/web/fc_footer.vue';
import Fc_banner_list from '@/components/web/index/fc_banner_list.vue';
import Article_search_list from '@/components/web/index/article_search_list.vue';
import { searchArticleApi, type articleSearchReq, type articleSearchRes } from '@/api/search_api';
import type { listResponse } from '@/api';
import { reactive, type DefineComponent } from 'vue';
import Tag_list from '@/components/web/index/tag_list.vue';
import AuthorRecommend from '@/components/web/index/authorRecommend.vue';
import ArticleRecommend from '@/components/web/index/articleRecommend.vue';
import About from '@/components/web/index/about.vue';
import Extension from '@/components/web/index/extension.vue';
import type { Component } from 'vue';
import { useSiteStore } from '@/stores/site_store';
const siteStore = useSiteStore()
siteStore.getSiteInfo()

const data = reactive<listResponse<articleSearchRes>>({
    list: [],
    count: 0
});
const params = reactive<articleSearchReq>({

})

const mapData: { [key: string]: Component } = {
    "标签云": Tag_list,
    "作者推荐": AuthorRecommend,
    "文章推荐": ArticleRecommend,
    "关于我们": About,
    "独家推广": Extension,
};

async function getData() {
    const res = await searchArticleApi(params)
    Object.assign(data, res.data)
}
getData()
</script>

<style lang="less">
.fc_web_home {
    .fc_container {
        display: flex;
        justify-content: space-between;

        .left {
            width: calc(100% - 280px);

            .fc_banner_com {
                margin-top: 20px;
            }

            .article_search_list_com {
                margin-top: 20px;
            }
        }

        .right {
            width: 260px;
            padding: 20px 0;
            display: grid;
            grid-row-gap: 20px;
            align-content: start;
        }
    }
}
</style>