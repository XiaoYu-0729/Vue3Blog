<template>
  <div class="discover-content">
    <!-- 轮播 banner -->
    <div class="banner-section">
      <div class="banner-slides">
        <div 
          v-for="(banner, index) in banners" 
          :key="index"
          class="banner-slide"
          :class="{ active: currentBanner === index }"
          :style="{ background: banner.gradient }"
        >
          <div class="banner-info">
            <h3>{{ banner.title }}</h3>
            <p>{{ banner.desc }}</p>
          </div>
        </div>
      </div>
      <div class="banner-dots">
        <span 
          v-for="(banner, index) in banners" 
          :key="index"
          class="dot"
          :class="{ active: currentBanner === index }"
          @click="currentBanner = index"
        ></span>
      </div>
    </div>

    <!-- 热门推荐 -->
    <div class="section">
      <h3 class="section-title"><i class="fas fa-fire"></i> 热门推荐</h3>
      <div class="card-grid">
        <div v-for="item in hotItems" :key="item.id" class="discover-card">
          <div class="card-cover" :style="{ background: item.gradient }">
            <i :class="item.icon"></i>
          </div>
          <div class="card-info">
            <h4>{{ item.title }}</h4>
            <p>{{ item.desc }}</p>
            <span class="card-tag">{{ item.tag }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 分类浏览 -->
    <div class="section">
      <h3 class="section-title"><i class="fas fa-th-large"></i> 分类浏览</h3>
      <div class="category-grid">
        <div 
          v-for="cat in categories" 
          :key="cat.id" 
          class="category-item"
          :style="{ background: cat.gradient }"
          @click="handleCategoryClick(cat)"
        >
          <i :class="cat.icon"></i>
          <span>{{ cat.name }}</span>
        </div>
      </div>
    </div>

    <!-- 标签云 -->
    <div class="section">
      <h3 class="section-title"><i class="fas fa-tags"></i> 标签云</h3>
      <div class="tag-cloud">
        <span 
          v-for="tag in tags" 
          :key="tag" 
          class="cloud-tag"
          @click="handleTagClick(tag)"
        >
          {{ tag }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const currentBanner = ref(0);

// Banner 数据
const banners = [
  { 
    title: 'Vue3 全家桶', 
    desc: '探索 Vue3 + Vite + Pinia 的最佳实践',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  },
  { 
    title: 'UI 设计趋势', 
    desc: '2025 年最流行的界面设计趋势',
    gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
  },
  { 
    title: '前端工程化', 
    desc: '从零构建现代化前端项目',
    gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
  }
];

// 热门推荐
const hotItems = [
  { 
    id: 1, 
    title: 'Vue3 响应式原理', 
    desc: '深入理解 Proxy 与 Reflect',
    icon: 'fas fa-code',
    tag: 'Vue',
    gradient: 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)'
  },
  { 
    id: 2, 
    title: 'CSS3 动画实战', 
    desc: '打造流畅的交互动画效果',
    icon: 'fas fa-paint-brush',
    tag: 'CSS',
    gradient: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)'
  },
  { 
    id: 3, 
    title: 'TypeScript 进阶', 
    desc: '类型系统与泛型编程',
    icon: 'fas fa-file-code',
    tag: 'TS',
    gradient: 'linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)'
  },
  { 
    id: 4, 
    title: 'Node.js 实战', 
    desc: '构建高性能后端服务',
    icon: 'fas fa-server',
    tag: 'Node',
    gradient: 'linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)'
  }
];

// 分类
const categories = [
  { id: 1, name: '前端', icon: 'fab fa-js', gradient: 'linear-gradient(135deg, #f7df1e, #d4b802)' },
  { id: 2, name: '后端', icon: 'fas fa-code', gradient: 'linear-gradient(135deg, #68a063, #4a7c4e)' },
  { id: 3, name: '移动端', icon: 'fas fa-mobile-alt', gradient: 'linear-gradient(135deg, #ff6b6b, #ee5a5a)' },
  { id: 4, name: '算法', icon: 'fas fa-brain', gradient: 'linear-gradient(135deg, #a855f7, #7c3aed)' },
  { id: 5, name: '设计', icon: 'fas fa-palette', gradient: 'linear-gradient(135deg, #ec4899, #be185d)' },
  { id: 6, name: '工具', icon: 'fas fa-wrench', gradient: 'linear-gradient(135deg, #6366f1, #4f46e5)' }
];

// 标签
const tags = [
  'Vue', 'React', 'Angular', 'Node.js', 'Python', 'Go', 
  'Rust', 'TypeScript', 'JavaScript', 'CSS', 'HTML', 
  'Git', 'Docker', 'Kubernetes', 'AWS', 'MongoDB'
];

// 自动轮播
setInterval(() => {
  currentBanner.value = (currentBanner.value + 1) % banners.length;
}, 5000);

const handleCategoryClick = (cat) => {
  console.log('点击分类:', cat.name);
};

const handleTagClick = (tag) => {
  console.log('点击标签:', tag);
};
</script>

<style scoped>
/* Banner 轮播 */
.banner-section {
  position: relative;
  margin-bottom: 28px;
  border-radius: 24px;
  overflow: hidden;
}

.banner-slides {
  height: 160px;
  position: relative;
}

.banner-slide {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  padding: 24px 28px;
  opacity: 0;
  transition: opacity 0.5s ease;
}

.banner-slide.active {
  opacity: 1;
}

.banner-info h3 {
  color: white;
  font-size: 1.5rem;
  margin-bottom: 8px;
  text-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

.banner-info p {
  color: rgba(255,255,255,0.9);
  font-size: 1rem;
}

.banner-dots {
  position: absolute;
  bottom: 12px;
  right: 16px;
  display: flex;
  gap: 8px;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(255,255,255,0.5);
  cursor: pointer;
  transition: all 0.3s;
}

.dot.active {
  width: 20px;
  border-radius: 4px;
  background: white;
}

/* 区块 */
.section {
  margin-bottom: 28px;
}

.section-title {
  color: #7c3a9e;
  font-size: 1.2rem;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.section-title i {
  color: #b87cd9;
}

/* 热门推荐卡片 */
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 16px;
}

.discover-card {
  background: rgba(255,255,255,0.7);
  backdrop-filter: blur(8px);
  border-radius: 20px;
  overflow: hidden;
  border: 1px solid rgba(230,180,255,0.4);
  transition: all 0.25s;
}

.discover-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px -8px rgba(170,90,220,0.25);
}

.card-cover {
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.card-cover i {
  font-size: 2.5rem;
  color: white;
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));
}

.card-info {
  padding: 16px;
}

.card-info h4 {
  color: #5a3b7a;
  font-size: 1.1rem;
  margin-bottom: 6px;
}

.card-info p {
  color: #7b6b8a;
  font-size: 0.9rem;
  margin-bottom: 10px;
  line-height: 1.4;
}

.card-tag {
  display: inline-block;
  background: linear-gradient(135deg, #f2e4ff, #ffe4f0);
  color: #7c4caf;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
}

/* 分类网格 */
.category-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.category-item {
  aspect-ratio: 1;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.25s;
}

.category-item:hover {
  transform: scale(1.05);
}

.category-item i {
  font-size: 1.8rem;
  color: white;
}

.category-item span {
  color: white;
  font-weight: 500;
  font-size: 0.95rem;
}

/* 标签云 */
.tag-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.cloud-tag {
  background: rgba(255,255,255,0.7);
  border: 1px solid rgba(200,150,255,0.4);
  padding: 8px 16px;
  border-radius: 30px;
  color: #7c4caf;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;
}

.cloud-tag:hover {
  background: linear-gradient(135deg, #c49bff, #ffb3e6);
  color: white;
  border-color: transparent;
}

/* 响应式 */
@media (max-width: 600px) {
  .banner-slides {
    height: 140px;
  }
  
  .banner-info h3 {
    font-size: 1.3rem;
  }
  
  .card-grid {
    grid-template-columns: 1fr;
  }
  
  .category-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .category-item {
    aspect-ratio: 1.2;
  }
}
</style>