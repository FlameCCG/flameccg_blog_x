<template>
    <div class="web_setting">
        <a-form>
            <a-row>
                <a-col :span="8">
                    <div class="form web_form">
                        <fc_title>网站设置</fc_title>
                        <div class="body">
                            <a-form-item :label-col-props="{ span: 5 }" :wrapper-col-props="{ span: 16 }" label="
                                网站标题"><a-input placeholder="请输入网站标题"
                                    v-model="form.siteInfo.title"></a-input></a-form-item>
                            <a-form-item :label-col-props="{ span: 5 }" :wrapper-col-props="{ span: 16 }" label="
                                logo">
                                <Fc_image_upload v-model="form.siteInfo.logo" placeholder="上传logo"></Fc_image_upload>
                            </a-form-item>
                            <a-form-item :label-col-props="{ span: 5 }" :wrapper-col-props="{ span: 16 }" label="
                                备案号"><a-input placeholder="请输入备案号"
                                    v-model="form.siteInfo.filing"></a-input></a-form-item>
                            <a-form-item :label-col-props="{ span: 5 }" :wrapper-col-props="{ span: 16 }" label="
                                运行模式">
                                <a-radio-group v-model="form.siteInfo.mode">
                                    <a-radio :value="1">社区模式</a-radio>
                                    <a-radio :value="2">博客模式</a-radio>
                                </a-radio-group>
                            </a-form-item>
                        </div>
                    </div>
                    <div class="form project_form">
                        <fc_title>项目设置</fc_title>
                        <div class="body">
                            <a-form-item :label-col-props="{ span: 5 }" :wrapper-col-props="{ span: 16 }" label="
                                网站title"><a-input placeholder="请输入网站标题"
                                    v-model="form.project.title"></a-input></a-form-item>
                            <a-form-item :label-col-props="{ span: 5 }" :wrapper-col-props="{ span: 16 }" label="
                                网站icon">
                                <Fc_image_upload v-model="form.project.icon" placeholder="请上传logo" shape="circle">
                                </Fc_image_upload>
                            </a-form-item>
                            <a-form-item :label-col-props="{ span: 5 }" :wrapper-col-props="{ span: 16 }" label="
                                前端地址">
                                <a-input placeholder="请输入前端地址" v-model="form.project.webPath"></a-input>
                            </a-form-item>
                        </div>
                    </div>
                    <div class="form seo_form">
                        <fc_title>SEO设置</fc_title>
                        <div class="body">
                            <a-form-item :label-col-props="{ span: 5 }" :wrapper-col-props="{ span: 16 }"
                                label="keywords">
                                <a-input placeholder="请输入keywords" v-model="form.seo.keywords"></a-input>
                            </a-form-item>
                            <a-form-item :label-col-props="{ span: 5 }" :wrapper-col-props="{ span: 16 }" label="
                                description">
                                <a-input placeholder="请输入description" v-model="form.seo.description"></a-input>
                            </a-form-item>
                        </div>
                    </div>
                </a-col>
                <a-col :span="8">
                    <div class="form about_form">
                        <fc_title>关于我们</fc_title>
                        <div class="body">
                            <a-form-item :label-col-props="{ span: 5 }" :wrapper-col-props="{ span: 16 }" label="建站日期">
                                <a-input placeholder="请输入建站日期" v-model="form.about.siteDate"></a-input>
                            </a-form-item>
                            <a-form-item :label-col-props="{ span: 5 }" :wrapper-col-props="{ span: 16 }" label="
                                网站版本">
                                <a-input placeholder="请输入网站版本" v-model="form.about.version"></a-input>
                            </a-form-item>
                            <a-form-item :label-col-props="{ span: 5 }" :wrapper-col-props="{ span: 16 }" label="
                                qq二维码">
                                <Fc_image_upload shape="square" v-model="form.about.qq" placeholder="请上传qq二维码"
                                    :width="100" :height="100">
                                </Fc_image_upload>
                            </a-form-item>
                            <a-form-item :label-col-props="{ span: 5 }" :wrapper-col-props="{ span: 16 }" label="
                                微信二维码">
                                <Fc_image_upload shape="square" v-model="form.about.wechat" placeholder="请上传微信二维码"
                                    :width="100" :height="100">
                                </Fc_image_upload>
                            </a-form-item>
                            <a-form-item :label-col-props="{ span: 5 }" :wrapper-col-props="{ span: 16 }" label="
                                gitee">
                                <a-input placeholder="gitee" v-model="form.about.gitee"></a-input>
                            </a-form-item>
                            <a-form-item :label-col-props="{ span: 5 }" :wrapper-col-props="{ span: 16 }" label="
                                哔哩哔哩">
                                <a-input placeholder="bilibili" v-model="form.about.bilibili"></a-input>
                            </a-form-item>
                            <a-form-item :label-col-props="{ span: 5 }" :wrapper-col-props="{ span: 16 }" label="
                                github">
                                <a-input placeholder="github" v-model="form.about.github"></a-input>
                            </a-form-item>
                        </div>
                    </div>
                    <div class="form login_form">
                        <fc_title>登录设置</fc_title>
                        <div class="body">
                            <a-form-item :label-col-props="{ span: 6 }" :wrapper-col-props="{ span: 15 }" label="
                            启用QQ登录">
                                <a-switch v-model="form.login.qqpLogin"></a-switch>
                            </a-form-item>
                            <a-form-item :label-col-props="{ span: 6 }" :wrapper-col-props="{ span: 15 }"
                                label="用户名密码登录">
                                <a-switch v-model="form.login.usernamePwdLogin"></a-switch>
                            </a-form-item>
                            <a-form-item :label-col-props="{ span: 6 }" :wrapper-col-props="{ span: 15 }"
                                label="启用邮箱注册">
                                <a-switch v-model="form.login.emailLogin"></a-switch>
                            </a-form-item>
                            <a-form-item :label-col-props="{ span: 6 }" :wrapper-col-props="{ span: 15 }"
                                label="启用图片验证码">
                                <a-switch v-model="form.login.captcha"></a-switch>
                            </a-form-item>
                        </div>
                    </div>
                </a-col>
                <a-col :span="8">
                    <div class="form index_right_form">
                        <fc_title>首页右侧组件展示</fc_title>
                        <div class="body">
                            <a-tree class="index_right_tree" draggable blockNode checkable :data="treeData"
                                @drop="onDrop" :allow-drop="allowDropHandler" @dragEnd="dragEnd"
                                v-model:checkedKeys="selectKeys" @check="check">
                            </a-tree>
                        </div>

                    </div>
                    <div class="form article_form">
                        <fc_title>文章设置</fc_title>
                        <div class="body">
                            <a-form-item :label-col-props="{ span: 5 }" :wrapper-col-props="{ span: 16 }" label="
                                文章免审核">
                                <a-switch v-model="form.article.noExamine"></a-switch>
                            </a-form-item>
                            <a-form-item :label-col-props="{ span: 5 }" :wrapper-col-props="{ span: 16 }" label="
                                评论行数">
                                <a-input-number v-model="form.article.commentLine" :min="1" :max="10"></a-input-number>
                            </a-form-item>
                        </div>
                    </div>
                    <a-button @click="updateHandler" type="primary" style="margin:100px 200px">更新</a-button>
                </a-col>
            </a-row>
        </a-form>
    </div>
</template>

<script setup lang="ts">
import { type siteResponse, siteApi, siteUpdate } from "@/api/site_api";
import Fc_image_upload from "@/components/common/fc_image_upload.vue";
import fc_title from "@/components/common/fc_title.vue";
import { title } from "@/global/global";
import { TreeNodeData, Message } from "@arco-design/web-vue";
import { ref } from "vue";
import { reactive } from "vue";
const form = reactive<siteResponse>({
    qiNiu: {
        enable: false
    },
    ai: {
        enable: false
    },
    siteInfo: {
        title: "",
        logo: "",
        filing: "",
        mode: 0
    },
    project: {
        title: "",
        icon: "",
        webPath: ""
    },
    seo: {
        keywords: "",
        description: ""
    },
    about: {
        siteDate: "",
        qq: "",
        version: "",
        wechat: "",
        gitee: "",
        github: "",
        bilibili: ""
    },
    article: {
        noExamine: false,
        commentLine: 0
    },
    login: {
        qqpLogin: false,
        usernamePwdLogin: true,
        emailLogin: false,
        captcha: false
    },
    indexRight: {
        list: []
    }
})
const initFrom = async () => {
    try {
        const res = await siteApi("site")
        console.log(res)
        Object.assign(form, res.data)
    } catch (error) {
        console.log(error)
    }
    for (const item of form.indexRight.list) {
        if (item.enable) {
            selectKeys.value.push(item.title)
        }
        treeData.value.push({
            key: item.title,
            title: item.title,
        })
    }
    console.log(treeData.value)
}
initFrom()
interface treeData {
    title: string;
    key: number | string;
}
const selectKeys = ref<(number | string)[]>([]);
const treeData = ref<TreeNodeData[]>([])
const updateHandler = async () => {
    try {
        const res = await siteUpdate("site", form)
        console.log(res)
        Object.assign(form, res.data)
        Message.success("更新成功")
    } catch (error) {
        console.log(error)
    }
}
const onDrop = ({ dragNode, dropNode, dropPosition }: {
    dragNode: TreeNodeData;
    dropNode: TreeNodeData;
    dropPosition: number
}) => {
    const data = treeData.value;
    const loop = (data: TreeNodeData[], key: number | string, callback: (item: TreeNodeData, index: number, arr: TreeNodeData[]) => void) => {
        data.some((item, index, arr) => {
            if (item.key === key) {
                callback(item, index, arr);
                return true;
            }
            if (item.children) {
                return loop(item.children, key, callback);
            }
            return false;
        });
    };

    loop(data, dragNode.key, (_, index, arr) => {
        arr.splice(index, 1);
    });

    if (dropPosition === 0) {
        loop(data, dropNode.key, (item) => {
            item.children = item.children || [];
            item.children.push(dragNode);
        });
    } else {
        loop(data, dropNode.key, (_, index, arr) => {
            arr.splice(dropPosition < 0 ? index : index + 1, 0, dragNode);
        });
    }
}
const allowDropHandler = (options: { dropNode: TreeNodeData; dropPosition: -1 | 0 | 1; }) => {
    return options.dropPosition !== 0;
}
const dragEnd = (DragEvent: DragEvent, TreeNodeData: TreeNodeData) => {
    update()
}
const check = () => {
    console.log(selectKeys.value)
    update()
}

const update = () => {
    let list = []
    console.log(treeData.value)
    for (const tree of treeData.value) {
        const item = selectKeys.value.find((value) => value === tree.key);
        if (item) {
            list.push({
                title: tree.title,
                enable: true
            });
        } else {
            list.push({
                title: tree.title,
                enable: false
            });
        }
    }
    form.indexRight.list = list;
}
</script>

<style scoped lang="less">
.web_setting {
    padding: 20px;
    background-color: var(--color-bg-1);

    .form {
        margin-bottom: 20px;

        .body {
            margin-top: 10px;
        }
    }

    .index_right_tree {
        width: 400px;
        padding: 10px;
        border-radius: 5px;
        border: @fc_border;

        ::v-deep(.arco-tree-node) {
            background-color: var(--color-fill-1);
            border-radius: 5px;
            padding: 5px;
            margin-bottom: 3px;
        }
    }
}
</style>