<script setup lang="ts">
import Fc_card from "@/components/common/fc_card.vue";
import { theme } from "@/components/common/fc_theme";
import { useSiteStore } from "@/stores/site_store";
import { Icon } from '@iconify/vue';
const store = useSiteStore();
store.getSiteInfo();
</script>

<template>
    <fc_card title="关于我们" class="about-card-com">
        <div class="item">
            <span>建站日期</span>
            <span>{{ store.siteInfo.about.siteDate }}</span>
        </div>
        <div class="item">
            <span>网站版本</span>
            <span>{{ store.siteInfo.about.version }}</span>
        </div>
        <div class="item">
            <span>开发者简介</span>
            <span>前后端开发者，对游戏开发有浓厚兴趣，在校学生</span>
        </div>
        <div class="item">
            <span>联系作者</span>
            <div class="contact-icons">
                <div class="contact-icon" v-if="store.siteInfo.about.wechat">
                    <Icon icon="mdi:wechat" width="24" height="24" class="wechat-icon" />
                    <div class="qrcode-popup">
                        <img :src="store.siteInfo.about.wechat" alt="微信">
                    </div>
                </div>
                <div class="contact-icon" v-if="store.siteInfo.about.qq">
                    <Icon icon="mdi:qqchat" width="24" height="24" class="qq-icon" />
                    <div class="qrcode-popup">
                        <img :src="store.siteInfo.about.qq" alt="QQ">
                    </div>
                </div>
            </div>
        </div>
        <div class="item">
            <span>社交平台</span>
            <div class="social-links">
                <a v-if="store.siteInfo.about.github" :href="store.siteInfo.about.github" target="_blank">
                    <Icon icon="mdi:github" :class="{ active: theme === 'dark' }" width="24" height="24" />
                </a>
                <a v-if="store.siteInfo.about.gitee" :href="store.siteInfo.about.gitee" target="_blank">
                    <Icon icon="simple-icons:gitee" width="24" height="24" />
                </a>
                <a v-if="store.siteInfo.about.bilibili" :href="store.siteInfo.about.bilibili" target="_blank">
                    <Icon icon="simple-icons:bilibili" width="24" height="24" />
                </a>
            </div>
        </div>
    </fc_card>
</template>

<style lang="less">
.about-card-com {
    .body {
        padding: 20px;
    }

    .item {
        display: flex;
        align-items: center;
        margin-bottom: 15px;
        color: var(--color-text-1);

        span:first-child {
            font-weight: bold;
            min-width: 80px;
            color: var(--color-text-2);
        }

        .contact-icons {
            display: flex;
            gap: 15px;

            .contact-icon {
                position: relative;
                cursor: pointer;

                .wechat-icon {
                    color: #07C160;
                }

                .qq-icon {
                    color: #12B7F5;
                }

                .qrcode-popup {
                    position: absolute;
                    top: 30px;
                    left: 0;
                    z-index: 10;
                    background: var(--color-bg-2);
                    padding: 8px;
                    border-radius: 4px;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
                    opacity: 0;
                    visibility: hidden;
                    transition: all 0.3s ease;
                    transform: translateY(10px);

                    img {
                        width: 120px;
                        height: 120px;
                        object-fit: cover;
                    }
                }

                &:hover .qrcode-popup {
                    opacity: 1;
                    visibility: visible;
                    transform: translateY(0);
                }
            }
        }

        .social-links {
            display: flex;
            gap: 15px;

            a {
                text-decoration: none;
                transition: opacity 0.3s;

                &:hover {
                    opacity: 0.7;
                }

                & svg.active {
                    color: var(--color-text-1);
                }

                &[href*="github"] {
                    color: #24292e;
                }

                &[href*="gitee"] {
                    color: #c71d23;
                }

                &[href*="bilibili"] {
                    color: #00a1d6;
                }
            }
        }
    }
}
</style>