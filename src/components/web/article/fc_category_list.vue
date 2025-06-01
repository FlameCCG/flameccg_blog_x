<template>
    <div class="fc_category_list_view">
        <div class="add" v-if="props.isMe">
            <a-button type="outline" @click="createCategory">
                <template #icon>
                    <IconPlus></IconPlus>
                    创建
                </template>
            </a-button>
        </div>
        <div class="categoryList">
            <div class="item" v-for="item in categoryData.list" :key="item.id"
                :class="{ active: item.id === Number(route.query.categoryID) }">
                <a-trigger trigger="contextMenu" align-point content-class="category-trigger" v-if="props.isMe">
                    <Fc_a @click="changeCategory(item)">
                        <span class="title">
                            <a-typography-title :ellipsis="{ css: true, rows: 1 }">{{ item.title
                                }}</a-typography-title>
                        </span>
                        <span>{{ item.articleCount }}</span>
                    </Fc_a>
                    <template #content>
                        <div class="item" @click="showEditModal(item)">编辑</div>
                        <div class="item delete" @click="handleDelete(item)">删除</div>
                    </template>
                </a-trigger>
                <Fc_a v-else @click="changeCategory(item)"> <span class="title">
                        <a-typography-title :ellipsis="{ css: true, rows: 1 }">{{ item.title
                        }}</a-typography-title>
                    </span>
                    <span>{{ item.articleCount }}</span>
                </Fc_a>
            </div>
        </div>
    </div>
    <a-modal v-model:visible="visible" :on-before-ok="handleCreateCategory" :title="form.id ? '编辑分类' : '创建分类'"
        v-if="props.isMe">
        <a-input v-model="form.title" placeholder="请输入分类名称" />
    </a-modal>
</template>

<script setup lang="ts">
import { articleCategoryListApi, type ArticleCategroyListRes, categoryCreate, type categoryCreateReq, categoryDelete } from '@/api/category_api.ts';
import { articleListApi, type articleListRequest, type articleListType } from '@/api/article_api.ts';
import { type listResponse } from '@/api';
import { Message } from '@arco-design/web-vue';
import { reactive, ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { title } from 'process';
import { userBaseInfoStore } from '@/stores/user_base_store.ts';
import Fc_a from '@/components/common/fc_a.vue';
const store = userBaseInfoStore();
const router = useRouter()
const route = useRoute();
const form = reactive<categoryCreateReq>({
    title: "",
    id: 0,
})

const changeCategory = (item: ArticleCategroyListRes) => {
    // 判断是不是已经点了
    const categoryID = Number(route.query.categoryID)
    let _id: number | undefined = item.id
    if (categoryID === _id) {
        _id = undefined
    }
    router.push({
        name: route.name as string,
        query: {
            ...route.query,
            categoryID: _id,
        },
        params: route.params,
    });
}


interface Props {
    userID: number;
    isMe: boolean;
}
const props = defineProps<Props>();
const categoryData = reactive<listResponse<ArticleCategroyListRes>>({
    list: [],
    count: 0,
});
const handleDelete = async (item: ArticleCategroyListRes) => {
    const res = await categoryDelete([item.id]);
    Message.success(res.msg);
    getCategoryList()
}
const getCategoryList = async () => {
    const res = await articleCategoryListApi({
        type: 2,
        userID: props.userID
    });
    Object.assign(categoryData, res.data)
    console.log('分类数据:', categoryData)
}
getCategoryList()

const createCategory = () => {
    form.id = 0;
    form.title = "";
    visible.value = true;
}
const showEditModal = (item: ArticleCategroyListRes) => {
    form.id = item.id;
    form.title = item.title;
    visible.value = true;
}

const handleCreateCategory = async () => {
    console.log(form)
    if (form.title.trim() === "") {
        Message.warning("分类名称不能为空");
        return;
    }
    const res = await categoryCreate(form);
    Message.success(res.msg);
    getCategoryList()
}
const visible = ref(false);
</script>

<style lang="less">
.fc_category_list_view {
    width: 100%;
    border-right: 1px solid var(--color-border-2);
    padding: 16px;
    background-color: var(--color-bg-1);
    transition: all 0.3s ease;

    .add {
        position: relative;
        margin-bottom: 16px;

        .arco-btn {
            width: 100%;
            border-radius: 6px;
            background-color: var(--color-fill-2);
            border: 1px solid var(--color-border-2);
            color: var(--color-text-1);
            transition: all 0.2s ease;
            height: 36px;
            font-size: 14px;

            &:hover {
                background-color: var(--color-fill-3);
                color: rgb(var(--primary-6));
            }

            .arco-icon {
                margin-right: 4px;
                transform: translateY(3px);
            }
        }
    }

    .categoryList {
        margin-top: 10px;

        .item {
            position: relative;
            transition: all 0.2s ease;
            margin-bottom: 8px;
            border-radius: 6px;

            &:last-child {
                margin-bottom: 0;
            }

            &:hover {
                background-color: var(--color-fill-2);
                transform: translateY(-2px);
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
            }

            &.active {
                background-color: var(--color-fill-2);

                a {
                    color: rgb(var(--primary-6)) !important;
                    padding-left: 15px;
                    font-weight: 500;
                    height: 100%;
                    width: 100%;
                    display: flex;
                    align-items: center;

                    &::before {
                        content: '';
                        position: absolute;
                        left: 0;
                        top: 20%;
                        width: 3px;
                        height: 60%;
                        background-color: rgb(var(--primary-6));
                        border-radius: 0 2px 2px 0;
                    }
                }
            }

            a {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 10px 12px;
                border-radius: 6px;
                font-size: 14px;
                text-decoration: none;
                transition: all 0.2s ease;
                position: relative;

                .title {
                    flex: 1;
                    overflow: hidden;
                    margin-right: 8px;

                    .arco-typography {
                        font-size: 14px;
                        margin: 0;
                        font-weight: normal;
                        color: inherit;
                        line-height: 1.5;
                    }
                }

                span:last-child {
                    font-size: 14px;
                    color: var(--color-text-2);
                    min-width: 16px;
                    text-align: right;
                }

                &:hover {
                    color: rgb(var(--primary-6));
                }

                &.router-link-active,
                &.router-link-exact-active {
                    color: var(--color-text-2);
                }
            }
        }
    }
}

.category-trigger {
    background-color: var(--color-bg-1);
    border-radius: 5px;
    border: @fc_border;
    padding: 5px 0;

    .item {
        padding: 10px 20px;
        cursor: pointer;

        &.delete {
            color: red;
        }

        &:hover {
            background-color: var(--color-fill-1);
        }
    }
}
</style>