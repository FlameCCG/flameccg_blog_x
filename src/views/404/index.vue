<template>
  <div class="not-found-container">
    <!-- 星空背景 -->
    <div class="stars-container">
      <div
        v-for="star in stars"
        :key="star.id"
        class="star"
        :style="{
          left: star.x + '%',
          top: star.y + '%',
          width: star.size + 'px',
          height: star.size + 'px',
          opacity: star.opacity,
        }"
      ></div>
    </div>

    <!-- 旋转的宇宙环 -->
    <div class="cosmic-rings">
      <div class="ring ring-1"></div>
      <div class="ring ring-2"></div>
      <div class="ring ring-3"></div>
    </div>

    <!-- 主要内容 -->
    <div class="content">
      <!-- 故障效果404 -->
      <div class="glitch-container">
        <h1 class="glitch-text" :class="{ 'glitch-active': isGlitching }">{{ glitchText }}</h1>
        <div class="glitch-shadow"></div>
      </div>

      <!-- 信息文本 -->
      <h2 class="lost-text">
        <span
          v-for="(char, index) in '页面已迷失在宇宙中'"
          :key="index"
          class="float-char"
          :style="{ animationDelay: index * 0.1 + 's' }"
          >{{ char }}</span
        >
      </h2>

      <!-- 按钮 -->
      <div class="buttons">
        <a href="/" class="home-button">
          <span class="icon"><i class="home-icon"></i></span>
          <span>返回首页</span>
        </a>

        <button class="refresh-button" @click="refreshPage">
          <span class="icon"><i class="refresh-icon"></i></span>
          <span>刷新页面</span>
        </button>
      </div>
    </div>

    <!-- 宇航员 -->
    <div class="astronaut">
      <svg width="80" height="80" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
          fill="#DDDDDD"
          stroke="white"
          stroke-width="0.5"
        />
        <path d="M9 9H15V15H9V9Z" fill="#555555" stroke="white" stroke-width="0.5" />
        <path
          d="M17 7C17 8.65685 14.7614 10 12 10C9.23858 10 7 8.65685 7 7C7 5.34315 9.23858 4 12 4C14.7614 4 17 5.34315 17 7Z"
          fill="#AAAAAA"
          stroke="white"
          stroke-width="0.5"
        />
        <path d="M16 15L18 19" stroke="white" stroke-width="1.5" stroke-linecap="round" />
        <path d="M8 15L6 19" stroke="white" stroke-width="1.5" stroke-linecap="round" />
      </svg>
    </div>

    <!-- 行星 -->
    <div class="planet"></div>
  </div>
</template>

<script>
export default {
  name: 'NotFound404',
  data() {
    return {
      stars: [],
      glitchText: '404',
      isGlitching: false,
    };
  },
  mounted() {
    this.generateStars();
    this.animateStars();
    this.setupGlitchEffect();
  },
  beforeUnmount() {
    if (this.starAnimationInterval) {
      clearInterval(this.starAnimationInterval);
    }
    if (this.glitchInterval) {
      clearInterval(this.glitchInterval);
    }
  },
  methods: {
    generateStars() {
      for (let i = 0; i < 100; i++) {
        this.stars.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 2 + 1,
          opacity: Math.random() * 0.8 + 0.2,
          speed: Math.random() * 0.5 + 0.1,
        });
      }
    },
    animateStars() {
      this.starAnimationInterval = setInterval(() => {
        this.stars = this.stars.map((star) => ({
          ...star,
          y: (star.y + star.speed) % 100,
        }));
      }, 50);
    },
    setupGlitchEffect() {
      this.glitchInterval = setInterval(() => {
        const glitchChance = Math.random();
        if (glitchChance > 0.7) {
          this.isGlitching = true;
          this.glitchText = '40' + (Math.random() > 0.5 ? '3' : '5');

          setTimeout(() => {
            this.glitchText = '404';
            this.isGlitching = false;
          }, 150);
        }
      }, 2000);
    },
    refreshPage() {
      window.location.reload();
    },
  },
};
</script>

<style scoped>
.not-found-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: #000000;
  overflow: hidden;
  position: relative;
  color: white;
  font-family:
    -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans',
    'Helvetica Neue', sans-serif;
}

/* 星空背景 */
.stars-container {
  position: absolute;
  inset: 0;
  overflow: hidden;
}

.star {
  position: absolute;
  border-radius: 50%;
  background-color: white;
}

/* 宇宙环 */
.cosmic-rings {
  position: absolute;
}

.ring {
  position: absolute;
  border-radius: 50%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.ring-1 {
  width: 256px;
  height: 256px;
  border: 4px solid rgba(66, 153, 225, 0.2);
  animation: spin 10s linear infinite;
}

.ring-2 {
  width: 320px;
  height: 320px;
  border: 2px solid rgba(159, 122, 234, 0.1);
  animation: reverse-spin 15s linear infinite;
}

.ring-3 {
  width: 384px;
  height: 384px;
  border: 1px solid rgba(103, 232, 249, 0.05);
  animation: spin 20s linear infinite;
}

/* 主要内容 */
.content {
  position: relative;
  z-index: 10;
  text-align: center;
}

/* 故障效果404 */
.glitch-container {
  position: relative;
  margin-bottom: 24px;
}

.glitch-text {
  font-size: 9rem;
  font-weight: 700;
  margin-bottom: 24px;
  background: linear-gradient(to right, #3182ce, #805ad5, #d53f8c);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.glitch-shadow {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  font-size: 9rem;
  font-weight: 700;
  color: #3182ce;
  opacity: 0.7;
  filter: blur(4px);
  animation: pulse 2s infinite;
}

.glitch-active {
  text-shadow:
    2px 0 #ff00ff,
    -2px 0 #00ffff;
  animation: glitch 0.3s infinite;
}

/* 信息文本 */
.lost-text {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 32px;
  color: #90cdf4;
}

.float-char {
  display: inline-block;
  animation: float 2s ease-in-out infinite;
}

/* 按钮 */
.buttons {
  display: flex;
  gap: 16px;
  justify-content: center;
}

.home-button,
.refresh-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  border-radius: 9999px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
  text-decoration: none;
}

.home-button {
  background: linear-gradient(to right, #2563eb, #7c3aed);
  color: white;
  border: none;
}

.home-button:hover {
  transform: scale(1.05);
  box-shadow: 0 10px 15px -3px rgba(124, 58, 237, 0.3);
}

.refresh-button {
  background: linear-gradient(to right, #1f2937, #111827);
  color: #d1d5db;
  border: 1px solid #4b5563;
}

.refresh-button:hover {
  color: white;
  border-color: #9ca3af;
}

.icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

.home-icon::before {
  content: '⌂';
}

.home-button:hover .home-icon {
  animation: bounce 1s infinite;
}

.refresh-icon::before {
  content: '↻';
}

.refresh-icon {
  animation: spin 3s linear infinite;
}

/* 宇航员 */
.astronaut {
  position: absolute;
  right: 25%;
  top: 33%;
  animation: float-astronaut 6s ease-in-out infinite;
}

/* 行星 */
.planet {
  position: absolute;
  left: 25%;
  bottom: 25%;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(to bottom right, #f6ad55, #c53030);
  animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* 动画 */
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@keyframes reverse-spin {
  0% {
    transform: translate(-50%, -50%) rotate(360deg);
  }
  100% {
    transform: translate(-50%, -50%) rotate(0deg);
  }
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

@keyframes float-astronaut {
  0%,
  100% {
    transform: translateY(0) rotate(5deg);
  }
  50% {
    transform: translateY(-20px) rotate(-5deg);
  }
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

@keyframes bounce {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
}

@keyframes glitch {
  0% {
    transform: translate(2px, 0);
  }
  25% {
    transform: translate(-2px, 2px);
  }
  50% {
    transform: translate(-1px, -2px);
  }
  75% {
    transform: translate(3px, -1px);
  }
  100% {
    transform: translate(-2px, 1px);
  }
}
</style>
