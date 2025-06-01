<template>
  <Fc_nav> </Fc_nav>
  <div class="user_home">
    <Fc_main>
      <div class="user_view">
        <div class="user_info">
          <div class="avatar">
            <a-avatar :size="100" :image-url="store.userBaseInfo.avatar"></a-avatar>
          </div>
          <div class="info">
            <div class="user-header">
              <div class="nick">{{ store.userBaseInfo.username }}</div>
              <div class="code-age">码龄:{{ store.userBaseInfo.codeAge }}年</div>
            </div>
            <div class="data">
              <div class="data-item">
                <div class="data-num">{{ store.userBaseInfo.lookCount }}</div>
                <div class="data-label">总访问量</div>
              </div>
              <div class="data-item">
                <div class="data-num">{{ store.userBaseInfo.lookCount }}</div>
                <div class="data-label">文章</div>
              </div>
              <div class="data-item">
                <div class="data-num">{{ store.userBaseInfo.fansCount }}</div>
                <div class="data-label">粉丝</div>
              </div>
              <div class="data-item">
                <div class="data-num">{{ store.userBaseInfo.followCount }}</div>
                <div class="data-label">关注</div>
              </div>
            </div>
            <div class="place">ip归属地: {{ store.userBaseInfo.place }}</div>
          </div>
          <div class="actions">
            <template v-if="store.userBaseInfo.userID !== myStore.userBaseInfo.userID">
              <Fc_a>
                <a-button type="outline" size="mini" @click="focus(true)"
                  v-if="store.userBaseInfo.relation === 1 || store.userBaseInfo.relation === 3">
                  <i class="iconfont icon-guanzhu"></i>关注
                </a-button>
                <a-button type="outline" size="mini" @click="focus(false)"
                  v-else-if="store.userBaseInfo.relation === 2">
                  <i class="iconfont icon-guanzhu"></i>已关注
                </a-button>
                <a-button type="outline" size="mini" @click="focus(false)"
                  v-else-if="store.userBaseInfo.relation === 4">
                  <i class="iconfont icon-guanzhu"></i>互相关注
                </a-button>
              </Fc_a>
              <router-link :to="{ name: 'msgChat', query: { userID: store.userBaseInfo.userID } }">
                <a-button type="outline" size="mini">
                  <i class="iconfont icon-sixin"></i> 私信
                </a-button></router-link>
            </template>
            <template v-else>
              <RouterLink :to="{ name: 'userInfo' }">
                <a-button type="outline" size="mini">编辑资料</a-button>
              </RouterLink>
              <RouterLink :to="{ name: 'platformArticle' }"><a-button type="outline" size="mini">管理博文</a-button>
              </RouterLink>
            </template>
          </div>
        </div>
        <div class="user_sub_view">
          <div class="head">
            <div class="left">
              <RouterLink :to="{ name: 'userArticle' }" class="nav-link" active-class="active"
                v-if="(store.userBaseInfo.openFollow) || store.isMe">
                {{ store.isMe ? '我的文章' : '他的文章' }}
              </RouterLink>
              <RouterLink :to="{ name: 'userCollect' }" class="nav-link" active-class="active"
                v-if="(store.userBaseInfo.openCollect) || store.isMe">
                {{ store.isMe ? '我的收藏' : '他的收藏' }}
              </RouterLink>
              <RouterLink :to="{ name: 'userFollow' }" class="nav-link" active-class="active"
                v-if="(store.userBaseInfo.openFollow) || store.isMe">
                {{ store.isMe ? '我的关注' : '他的关注' }}
              </RouterLink>
              <RouterLink :to="{ name: 'userFans' }" class="nav-link" active-class="active"
                v-if="(store.userBaseInfo.openFans) || store.isMe">
                {{ store.isMe ? '我的粉丝' : '他的粉丝' }}
              </RouterLink>
            </div>
            <a-input-search class="search-input" placeholder="搜TA的内容" v-model="text" @search="search"
              @keyup.enter="search"></a-input-search>
          </div>
          <div class="body">
            <RouterView></RouterView>
          </div>
        </div>
      </div>
    </Fc_main>
  </div>

</template>

<script setup lang="ts">
import Fc_nav from '@/components/web/fc_nav.vue';
import Fc_main from '@/components/web/fc_main.vue';
import { userBaseInfoStore } from '@/stores/user_base_store';
import Fc_a from '@/components/common/fc_a.vue';
import { useUserStore } from '@/stores/user_store';
const store = userBaseInfoStore();
import { useRoute } from 'vue-router';
import { ref, watch } from 'vue';
import router from '@/router';
import { useUserCenterStore } from '@/stores/user_center_store';
import { focusService } from '@/service/focus';
const myStore = useUserStore();
const route = useRoute();
const focus = async (isFocus: boolean) => {
  await focusService(isFocus, store.userBaseInfo.userID);
  store.getUserBaseInfo(store.userBaseInfo.userID);
  console.log(store.userBaseInfo.relation);
}
store.getUserBaseInfo(Number(route.params.id));
watch(() => route.params.id, (id) => {
  store.getUserBaseInfo(Number(id));
});
const text = ref('');
const search = async () => {
  router.push({
    name: route.name,
    query: {
      ...route.query,
      key: text.value,
    },
    params: route.params
  })
}
const userCenterStore = useUserCenterStore();
userCenterStore.getUserDetail();
</script>

<style lang="less">
.user_home {
  .user_style_1 {
    background-image: url("/src/assets/images/miku.png");
    background-size: cover;
    background-position: center;
  }

  .user_style_2 {
    background-image: url("/src/assets/images/日系.png");
    background-size: cover;
    background-position: center;
  }

  .user_style_3 {
    background-image: url("/src/assets/images/星系.png");
    background-size: cover;
    background-position: center;
  }

  .user_view {
    width: 100%;

    .user_info {
      background-color: var(--color-bg-1);
      border-radius: 2px;
      padding: 20px;
      position: relative;
      margin-top: 20px;
      display: flex;

      .avatar {
        width: 100px;
        margin-right: 20px;
      }

      .info {
        flex: 1;

        .user-header {
          display: flex;
          align-items: baseline;
          margin-bottom: 15px;
        }

        .nick {
          font-size: 22px;
          font-weight: 500;
          color: var(--color-text-1);
          margin-right: 10px;
        }

        .code-age {
          font-size: 14px;
          color: var(--color-text-3);
          background-color: var(--color-bg-2);
          padding: 5px;
          border-radius: 5px;
        }

        .data {
          display: flex;
          margin-bottom: 15px;

          .data-item {
            margin-right: 20px;
            display: flex;
            align-items: baseline;

            .data-num {
              font-size: 18px;
              font-weight: 500;
              color: var(--color-text-1);
              margin-right: 5px;
            }

            .data-label {
              font-size: 14px;
              color: var(--color-text-3);
            }
          }
        }

        .place {
          font-size: 13px;
          color: var(--color-text-3);
        }
      }

      .actions {
        position: absolute;
        right: 0px;

        a {
          margin-right: 15px;

          .arco-btn {
            border-radius: 20px;

            i {
              margin-right: 4px;
            }
          }
        }
      }
    }

    .user_sub_view {
      margin-top: 16px;
      background-color: var(--color-bg-1);
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 10px rgba(var(--primary-2), 0.1);

      .head {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0;
        position: relative;
        background: linear-gradient(to right, rgba(var(--primary-1), 0.1), rgba(var(--primary-1), 0.05));
        border-bottom: 1px solid rgba(var(--primary-3), 0.2);

        .left {
          display: flex;
          flex-wrap: nowrap;
          overflow-x: auto;
          padding: 0 10px;
          -ms-overflow-style: none;
          scrollbar-width: none;

          &::-webkit-scrollbar {
            display: none;
          }

          .nav-link {
            font-size: 14px;
            text-decoration: none;
            padding: 16px 20px;
            margin: 0;
            transition: all 0.3s ease;
            position: relative;
            color: var(--color-text-2);
            font-weight: 500;
            white-space: nowrap;

            &:hover {
              color: rgb(var(--primary-6));
              background-color: rgba(var(--primary-5), 0.1);
            }

            &.active {
              color: rgb(var(--primary-6));

              &::after {
                content: '';
                position: absolute;
                bottom: 0;
                left: 20%;
                width: 60%;
                height: 3px;
                background: rgb(var(--primary-6));
                border-radius: 3px 3px 0 0;
                transition: all 0.3s ease;
              }
            }
          }
        }

        .search-input {
          width: 240px;
          margin-right: 20px;
          transition: all 0.3s ease;

          .arco-input-wrapper {
            border-radius: 20px;
            border: 1px solid rgba(var(--primary-4), 0.3);
            background: rgba(var(--primary-1), 0.05);
            transition: all 0.25s ease;

            &:hover,
            &:focus-within {
              border-color: rgb(var(--primary-5));
              box-shadow: 0 0 0 2px rgba(var(--primary-3), 0.2);
              background: var(--color-bg-2);
            }
          }

          .arco-icon {
            color: rgb(var(--primary-6));
          }
        }
      }

      .body {
        padding: 24px;
        min-height: 300px;
        overflow-y: auto;
      }
    }
  }
}


// .user_style_2 {
//   .banner {
//     position: absolute;
//     width: 100%;
//     height: 200px;
//     background-image: url("/src/assets/images/miku.png");
//     background-size: cover;
//     background-repeat: no-repeat;
//     margin: 0 auto;
//     z-index: 0;
//   }
// }</style>
