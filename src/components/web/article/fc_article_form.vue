<template>
    <a-form :model="form" ref="formRef" :label-col-props="{ span: 0 }" :wrapper-col-props="{ span: 24 }"
        class="fc-form-article-com">
        <a-form-item field="title" validate-trigger="blur" :rules="[{ required: true, message: '请输入文章标题' }]">
            <a-input v-model="form.title" placeholder="请输入标题（建议20字以内）"></a-input>
        </a-form-item>
        <a-form-item placeholder="请输入文章简介(选填)">
            <a-textarea v-model="form.abstract" placeholder="请输入文章简介"></a-textarea>
        </a-form-item>
        <!-- 是否开启ai分析 -->
        <div style="display: flex; align-items: center;margin-bottom: 20px;">
            <span style="color: var(--color-text-secondary);">是否开启ai分析</span>
            <a-switch v-model="aiSwitch" :disabled="!siteStore.siteInfo.ai.enable" style="margin-left: 10px;" />
            <span style="color: var(--color-text-secondary);margin-left: 10px;font-size: 12px;">开启后粘贴即可自动分析</span>
        </div>
        <a-form-item field="content" validate-trigger="blur" :rules="[{ required: true, message: '请输入文章内容' }]">
            <MdEditor v-model="form.content" placeholder="请输入文章内容" :toolbarsExclude="['github']"
                @on-upload-img="onUploadImg" @paste="handlePaste">
            </MdEditor>
        </a-form-item>
        <a-collapse :default-active-key="['1']" :bordered="false">
            <a-collapse-item header="更多设置" :key="1">
                <a-form label-align="left" :model="form" class="form-more-setting" :label-col-props="{ span: 4 }"
                    :wrapper-col-props="{ span: 8 }">
                    <a-form-item label="请选择文章分类">
                        <a-select placeholder="文章分类" :options="categoryOptions" v-model="form.categoryID"></a-select>
                        <template #help v-if="aiData.category">
                            智能推荐文章分类<span style="color: #1890ff;cursor: pointer;" alt="点击查看"
                                @click="() => categoryOptions.push({ label: aiData.category, value: aiData.category })">{{
                                    aiData.category
                                }}</span>
                        </template>
                    </a-form-item>
                    <a-form-item label="设置文章封面" content-class="article_cover_col">
                        <div class="up">
                            <fc_cover_cutter @ok="coverBack" style="width: 100%;">
                                <div class="cover_mask">
                                    <IconImage class="icon-image" />
                                    <span class="upload_text">点击上传封面图(选填)</span>
                                </div>
                            </fc_cover_cutter>
                        </div>
                        <div class="show" v-if="form.cover">
                            <a-image :src="form.cover" :height="100">
                                <template #extra>
                                    <IconDelete @click="form.cover = ''" />
                                </template>
                            </a-image>
                        </div>
                        <template #help>
                            <div v-if="siteStore.siteInfo.qiNiu.enable">
                                将上传到七牛云上
                            </div>
                        </template>
                    </a-form-item>
                    <a-form-item label="文章标签">
                        <a-select allow-create allow-clear v-model="form.tagList" placeholder="请输入文章标签" multiple
                            :options="tagOptions"></a-select>
                    </a-form-item>
                    <a-form-item label="设置评论状态">
                        <a-checkbox v-model="form.openComment">允许评论</a-checkbox>
                    </a-form-item>
                </a-form>
            </a-collapse-item>
        </a-collapse>
        <div class="action">
            <a-button type="primary" @click="publishArticle(2)" size="large">{{ props.articleId ? '更新文章' : '发布文章'
                }}</a-button>
            <a-button @click="publishArticle(1)" size="large" type="secondary">存为草稿</a-button>
        </div>
    </a-form>
</template>
<script setup lang="ts">
import { reactive, watch } from "vue";
import { articleDetailApi, articleTagListOptionsApi, type ArticleCreateRequest } from "@/api/article_api";
import { getOptions, useAxios } from "@/api/";
import { MdEditor } from 'md-editor-v3';
import 'md-editor-v3/lib/style.css';
import { ref } from "vue";
import { Message } from "@arco-design/web-vue";
import fc_cover_cutter from "@/components/web/fc_cover_cutter.vue";
import { type optionsType } from "@/options/options";
import { articleCategoryOptions } from "@/api/user_api";
import { useSiteStore } from "@/stores/site_store"
import { aiArticleAnalysisApi } from "@/api/ai_api";
import { type aiArticleAnalysisApiRes } from "@/api/ai_api"
import { onUploadImg } from "@/api/image_api";
import { useRoute } from "vue-router";
const aiSwitch = ref(false)
interface Props {
    articleId?: number;
}
const props = defineProps<Props>()
const coverBack = (imageUrl: string) => {
    form.cover = imageUrl;
}

if (props.articleId) {
    getData()
}
async function getData() {
    const res = await articleDetailApi(props.articleId as number)
    console.log(res)
    Message.success(res.msg)
    form.title = res.data.title
    form.content = res.data.content
    form.categoryID = res.data.categoryID
    form.abstract = res.data.abstract
    form.cover = res.data.cover
    form.tagList = res.data.tagList
    form.openComment = res.data.openComment
}

const emits = defineEmits(['ok'])
const publishArticle = async (status: 1 | 2) => {
    form.status = status;
    console.log(form)
    const val = await formRef.value.validate();
    if (val) return;
    emits('ok', form)
}
const siteStore = useSiteStore()
const aiData = reactive<aiArticleAnalysisApiRes>({
    title: "",
    abstract: "",
    category: "",
    tag: []
})
const handlePaste = async (e: ClipboardEvent) => {
    console.log(siteStore.siteInfo.ai.enable, aiSwitch.value)
    if (!(siteStore.siteInfo.ai.enable && aiSwitch.value)) {
        console.log("ai未开启")
        return
    }
    let file = e.clipboardData?.files?.[0];
    if (file && file.type.includes('image')) {
        return
    }
    const res = await aiArticleAnalysisApi(form.content)
    Message.success("ai分析成功")
    // console.log(res)
    Object.assign(aiData, res.data)
    if (form.title === "") {
        form.title = aiData.title
    }
    if (form.abstract === "") {
        form.abstract = aiData.abstract
    }
    if (form.tagList.length === 0) {
        form.tagList = aiData.tag
    }
}
const categoryOptions = ref<optionsType[]>([]);
const tagOptions = ref<optionsType[]>([]);
getOptions(categoryOptions, articleCategoryOptions)
getOptions(tagOptions, articleTagListOptionsApi)
const formRef = ref();
const form = reactive<ArticleCreateRequest>({
    title: "",
    content: "",
    status: 1,
    // categoryId: null,
    abstract: "",
    cover: "",
    tagList: [],
    openComment: true,
});

</script>
<style lang="less">
.fc-form-article-com {
    .form-more-setting {
        display: flex;
        flex-direction: column;
        max-height: 400px;
        overflow-y: auto;

        .article_cover_col {
            flex-direction: column;

            >div {
                width: 100%;
            }

            .show {
                margin-top: 10px;

                .arco-image-footer {
                    display: flex;
                    justify-content: center;
                    padding-left: 0;

                    svg {
                        font-size: 20px;
                        cursor: pointer;
                    }
                }
            }
        }

        .cover_mask {
            height: 120px;
            border: @fc_border;
            border-radius: 5px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            cursor: pointer;

            .upload_text {
                font-size: 12px;
            }

            color: var(--color-text-2);

            svg {
                font-size: 30px;
            }
        }
    }

    .arco-collapse-item {
        .arco-collapse-item-header {
            padding: 0;
            border: none;

            .arco-collapse-item-icon-hover {
                left: 62px;
            }
        }

        .arco-collapse-item-content {
            border: none;
            padding-right: 0;
            background: transparent;
            padding-left: 0;
            max-height: 500px;
        }
    }

    .action {
        .arco-btn.arco-btn-secondary {
            margin-left: 10px;
            margin-top: 10px;
        }
    }
}
</style>