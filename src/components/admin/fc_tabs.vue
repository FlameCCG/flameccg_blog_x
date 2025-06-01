<template>
    <div class="fc_tabs_inner">
        <!-- 添加左侧导航按钮 -->
        <div class="nav-button prev" @click="slidePrev" v-show="showPrevButton">
            <span class="arrow">←</span>
        </div>

        <swiper :slides-per-view="slideCount" class="fc_tabs_swiper" :slides-per-group="1" :resistance="true"
            :resistance-ratio="0.85" :watch-slides-progress="true" @swiper="onSwiperInit" @progress="updateNavButtons"
            @resize="updateNavButtons" @slideChange="updateNavButtons">
            <swiper-slide v-for="item in tabs" :key="item.name" :class="{ active: route.name === item.name }">
                <div class="item" :class="{ active: route.name === item.name }" @click="tabCheck(item.name)"
                    @mousedown.middle="removeActive(item)">
                    {{ item.title }}
                    <span class="close" title="删除" v-if="item.name !== 'home'" @click.stop="removeActive(item)">
                        <IconClose></IconClose>
                    </span>
                </div>
            </swiper-slide>
        </swiper>

        <!-- 添加右侧导航按钮 -->
        <div class="nav-button next" @click="slideNext" v-show="showNextButton">
            <span class="arrow">→</span>
        </div>

        <div class="removeAll" @click="removeAll" @mousedown.middle="removeAll">
            删除全部
        </div>
    </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { onMounted, ref, watch, computed, nextTick } from 'vue';
import 'swiper/css';
// 不需要手动注册模块了，新版本Swiper自动处理

const route = useRoute();
const router = useRouter();
interface TabType {
    title: string;
    name: string;
    icon?: string | Comment;
}

const tabs = ref<TabType[]>([]);
const showPrevButton = ref(false);
const showNextButton = ref(false);
const swiperInstance = ref<any>(null);

// 获取Swiper实例
function onSwiperInit(swiper: any) {
    swiperInstance.value = swiper;
    updateNavButtons();
}

// 更新导航按钮的显示状态
function updateNavButtons() {
    if (!swiperInstance.value) return;

    // 判断是否显示前后导航按钮
    showPrevButton.value = !swiperInstance.value.isBeginning;
    showNextButton.value = !swiperInstance.value.isEnd;
}

// 向前滑动
function slidePrev() {
    if (swiperInstance.value) {
        swiperInstance.value.slidePrev();
    }
}

// 向后滑动
function slideNext() {
    if (swiperInstance.value) {
        swiperInstance.value.slideNext();
    }
}

const tabCheck = (name: string) => {
    console.log(name);
    // 只做路由切换，不进行滑动操作
    router.push({ name });
};

const initTabs = () => {
    const value = localStorage.getItem('tabs');
    if (value) {
        tabs.value = JSON.parse(value);
    } else {
        // 确保至少有首页标签
        tabs.value = [{ title: '首页', name: 'home' }];
    }
};

initTabs();

const saveTabs = () => {
    localStorage.setItem('tabs', JSON.stringify(tabs.value));
};

// 修改标签移除逻辑，确保在移除标签时不触发不必要的滑动
const removeActive = (item: TabType) => {
    if (item.name === 'home') {
        return;
    }
    const index = tabs.value.findIndex((value) => value.name === item.name);
    if (index !== -1) {
        console.log('index', index, 'item.name', item.name, 'route.name', route.name);

        // 如果移除的是当前活动标签，则需要切换到其他标签
        if (item.name === route.name) {
            // 路由切换会触发watch，所以不需要在这里手动调用滚动
            router.push({
                name: tabs.value[index - 1].name,
            });
        }

        tabs.value.splice(index, 1);
        saveTabs();

        // 只在移除可能导致布局变化时更新导航按钮状态
        nextTick(() => {
            updateNavButtons();
        });
    }
};

const removeAll = () => {
    tabs.value = [{ title: '首页', name: 'home' }];
    router.push({ name: 'home' });
    saveTabs();
};

watch(
    () => route.name,
    (newVal, oldVal) => {
        // 判断当前的路由名称是否在tabs中
        const index = tabs.value.findIndex((value) => value.name === newVal);
        if (index === -1) {
            tabs.value.push({
                name: newVal as string,
                title: route.meta.title,
            });
            saveTabs();

            // 只有添加新标签时才滚动到该标签
            nextTick(() => {
                scrollToActiveTab();
            });
        }
        // 不要在每次路由变化时都调用scrollToActiveTab
    },
    { immediate: true },
);

// 滚动到活动标签 - 只在需要时调用此函数
function scrollToActiveTab() {
    if (!swiperInstance.value) return;

    const activeIndex = tabs.value.findIndex(tab => tab.name === route.name);
    const currentIndex = swiperInstance.value.activeIndex;

    // 只有当活动标签不在可视区域时才滚动
    // 检查是否需要滚动（例如，添加新标签或标签溢出时）
    if (activeIndex >= 0 && Math.abs(activeIndex - currentIndex) > slideCount.value - 1) {
        swiperInstance.value.slideTo(activeIndex, 300, false);
    }
}

const slideCount = ref(1);

onMounted(() => {
    // 初始化完成后调用一次更新按钮状态
    nextTick(() => {
        if (swiperInstance.value) {
            updateNavButtons();
            scrollToActiveTab();
        }
    });

    // 监听窗口大小变化，更新可见滑块数量
    window.addEventListener('resize', () => {
        calculateVisibleSlides();
        updateNavButtons();
    });

    calculateVisibleSlides();
});

// 计算可见滑块数量
function calculateVisibleSlides() {
    const swiperDom = document.querySelector('.fc_tabs_swiper') as HTMLDivElement;
    if (!swiperDom) return;

    // 显示的总宽度
    const swiperWidth = swiperDom.clientWidth;

    const swiperWrapperDom = document.querySelector(
        '.fc_tabs_swiper .swiper-wrapper',
    ) as HTMLDivElement;

    if (!swiperWrapperDom) return;

    // 实际的总宽度
    const swiperWrapperWidth = swiperWrapperDom.clientWidth;

    if (swiperWidth > swiperWrapperWidth) {
        slideCount.value = tabs.value.length;
        showPrevButton.value = false;
        showNextButton.value = false;
        return;
    }

    const slideList = document.querySelectorAll(
        '.fc_tabs_swiper .swiper-wrapper .swiper-slide',
    ) as NodeListOf<HTMLDivElement>;

    let allWidth = 0;
    let index = 0;

    for (const slideListElement of slideList) {
        allWidth += slideListElement.clientWidth + 10;
        index++;

        if (allWidth > swiperWidth) {
            break;
        }
    }

    slideCount.value = Math.max(1, index - 1);

    // 更新导航按钮状态
    updateNavButtons();
}
</script>

<style scoped lang="less">
.fc_tabs_inner {
    display: flex;
    align-items: center;
    padding: 0 10px;
    justify-content: space-between;
    position: relative;

    .nav-button {
        cursor: pointer;
        padding: 4px 8px;
        background-color: var(--color-fill-1);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 5px;
        z-index: 2;

        &:hover {
            background-color: var(--color-fill-2);
        }

        .arrow {
            font-size: 14px;
            line-height: 1;
        }
    }

    ::v-deep(.swiper) {
        width: calc(100% - 140px); // 预留两侧按钮和删除按钮的空间
        display: flex;
        overflow-y: hidden;
        overflow-x: hidden;

        .swiper-wrapper {
            display: flex;
            align-items: center;
            transition-property: transform;
            transition-duration: 300ms;
        }

        .swiper-slide {
            width: fit-content !important;
            flex-shrink: 0;
        }
    }

    .removeAll {
        color: var(--color-text-2);
        cursor: pointer;
        font-size: 12px;
        padding: 0 10px;
        border-radius: 4px;
        white-space: nowrap;

        &:hover {
            background-color: var(--color-fill-1);
            color: var(--color-text-1);
        }
    }

    .item {
        padding: 3px 8px;
        background-color: var(--color-bg-1);
        border: @fc_border;
        margin-right: 10px;
        cursor: pointer;
        border-radius: 18px;
        white-space: nowrap;
        display: flex;
        align-items: center;

        &:hover {
            background-color: var(--color-fill-1);
        }

        &.active {
            background-color: @primary-6;
            color: white;
        }
    }
}

.close {
    margin-left: 10px;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
}
</style>