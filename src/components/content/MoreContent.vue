<template>
  <div class="more-content">
    <!-- 装饰背景 -->
    <div class="decorative-bg">
      <div class="decor-circle circle-1"></div>
      <div class="decor-circle circle-2"></div>
      <div class="decor-circle circle-3"></div>
    </div>

    <!-- 网站介绍 -->
    <div class="intro-section">
      <div class="intro-header">
        <div class="avatar-wrapper">
          <div class="avatar">
            <div class="avatar-inner">
              <i class="fas fa-cloud"></i>
            </div>
          </div>
          <div class="avatar-glow"></div>
        </div>
        <h2>网站介绍</h2>
        <p class="site-tagline">轻量级个人博客</p>
      </div>
      
      <div class="intro-card">
        <p class="intro-desc">
          这是一个<strong>轻量级个人博客</strong>，专注于分享前端技术、创意设计和开发心得。<br><br>
          网站采用<strong>Vue3 + Vite</strong> 构建，追求简洁高效的体验。在这里，你会看到关于 Vue、React、TypeScript 等前端技术的深度文章，也会发现一些有趣的实战项目。<br><br>
          感谢你的访问！如果你喜欢这里的内容，欢迎通过下方的联系方式与我交流。一起探索技术的乐趣吧 🚀
        </p>
      </div>

      <!-- 技能标签 -->
      <div class="skills-section">
        <h4>技术栈</h4>
        <div class="skills-tags">
          <span class="skill-tag">Vue3</span>
          <span class="skill-tag">Vite</span>
          <span class="skill-tag">TypeScript</span>
          <span class="skill-tag">CSS3</span>
          <span class="skill-tag">Node.js</span>
        </div>
      </div>
    </div>

    <!-- 分割线 -->
    <div class="divider">
      <span class="divider-dot"></span>
      <span class="divider-line"></span>
      <span class="divider-dot"></span>
    </div>

    <!-- 功能菜单 -->
    <div class="func-section">
      <div class="func-list">
        <div class="func-item" @click="handleHelp">
          <div class="func-icon" style="background: linear-gradient(135deg, #f093fb, #f5576c);">
            <i class="fas fa-question-circle"></i>
          </div>
          <div class="func-text">
            <span class="func-label">帮助</span>
            <span class="func-desc">使用指南与FAQ</span>
          </div>
          <i class="fas fa-chevron-right func-arrow"></i>
        </div>
        
        <div class="func-item" @click="handleFeedback">
          <div class="func-icon" style="background: linear-gradient(135deg, #4facfe, #00f2fe);">
            <i class="fas fa-comment-dots"></i>
          </div>
          <div class="func-text">
            <span class="func-label">反馈</span>
            <span class="func-desc">提出宝贵意见</span>
          </div>
          <i class="fas fa-chevron-right func-arrow"></i>
        </div>

        <div class="func-item" @click="handleGithub">
          <div class="func-icon" style="background: linear-gradient(135deg, #5a5a5a, #3a3a3a);">
            <i class="fab fa-github"></i>
          </div>
          <div class="func-text">
            <span class="func-label">GitHub</span>
            <span class="func-desc">查看开源项目</span>
          </div>
          <i class="fas fa-chevron-right func-arrow"></i>
        </div>

        <div class="func-item" @click="handleEmail">
          <div class="func-icon" style="background: linear-gradient(135deg, #ff6b6b, #ee5a5a);">
            <i class="fas fa-envelope"></i>
          </div>
          <div class="func-text">
            <span class="func-label">邮箱</span>
            <span class="func-desc">yuluoxr@163.com</span>
          </div>
          <i class="fas fa-chevron-right func-arrow"></i>
        </div>

        <div class="func-item" @click="handleQQ">
          <div class="func-icon" style="background: linear-gradient(135deg, #12b7f5, #0d95d6);">
            <i class="fab fa-qq"></i>
          </div>
          <div class="func-text">
            <span class="func-label">QQ</span>
            <span class="func-desc">在线即时沟通</span>
          </div>
          <i class="fas fa-chevron-right func-arrow"></i>
        </div>
      </div>
    </div>

    <!-- 底部信息 -->
    <div class="more-footer">
      <p class="copyright">© 2025 雨落筱然</p>
      <p class="version">Version 1.0.0</p>
    </div>
  </div>
</template>

<script setup>
const handleHelp = () => {
  console.log('点击了帮助');
};

const handleFeedback = () => {
  console.log('点击了反馈');
};

const handleGithub = () => {
  console.log('点击了GitHub');
};

const handleEmail = () => {
  console.log('点击了邮箱');
};

const handleQQ = () => {
  console.log('点击了QQ');
};
</script>

<style scoped>
.more-content {
  position: relative;
  overflow: hidden;
}

/* 装饰背景 */
.decorative-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}

.decor-circle {
  position: absolute;
  border-radius: 50%;
  opacity: 0.15;
}

.circle-1 {
  width: 200px;
  height: 200px;
  background: linear-gradient(135deg, #b983ff, #ff9cef);
  top: -50px;
  right: -50px;
}

.circle-2 {
  width: 150px;
  height: 150px;
  background: linear-gradient(135deg, #84fab0, #8fd3f4);
  bottom: 100px;
  left: -30px;
}

.circle-3 {
  width: 100px;
  height: 100px;
  background: linear-gradient(135deg, #f9a8d4, #a855f7);
  bottom: -20px;
  right: 20%;
}

/* 介绍区域 */
.intro-section {
  position: relative;
  z-index: 1;
  padding: 20px 0;
}

.intro-header {
  text-align: center;
  margin-bottom: 24px;
}

.avatar-wrapper {
  margin-bottom: 16px;
  position: relative;
  display: inline-block;
}

.avatar {
  width: 100px;
  height: 100px;
  background: linear-gradient(135deg, #b983ff 0%, #ff9cef 50%, #f9a8d4 100%);
  border-radius: 24px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-shadow: 
    0 10px 30px rgba(170, 75, 245, 0.4),
    0 0 0 4px rgba(255, 255, 255, 0.3),
    inset 0 2px 10px rgba(255, 255, 255, 0.3);
  position: relative;
  z-index: 2;
  transform: rotate(-5deg);
  transition: transform 0.3s ease;
}

.avatar:hover {
  transform: rotate(0deg) scale(1.05);
}

.avatar-inner {
  width: 70px;
  height: 70px;
  background: rgba(255, 255, 255, 0.25);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-inner i {
  font-size: 2rem;
  color: white;
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));
}

.avatar-glow {
  position: absolute;
  inset: -15px;
  background: radial-gradient(circle, rgba(185, 131, 255, 0.4) 0%, transparent 70%);
  border-radius: 50%;
  animation: pulse 2s ease-in-out infinite;
  z-index: 1;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); opacity: 0.6; }
  50% { transform: scale(1.1); opacity: 0.8; }
}

.site-tagline {
  color: #9b7bb5;
  font-size: 1rem;
  margin: 8px 0 0;
  font-style: italic;
}

.intro-header h2 {
  color: #7c3a9e;
  font-size: 1.7rem;
  margin: 0;
}

.intro-card {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  border-radius: 24px;
  padding: 24px;
  margin-bottom: 20px;
  border: 1px solid rgba(230, 180, 255, 0.5);
  box-shadow: 0 8px 32px rgba(170, 90, 220, 0.1);
}

.intro-desc {
  color: #5a4868;
  font-size: 0.95rem;
  line-height: 1.9;
  text-align: left;
  margin: 0;
}

.intro-desc strong {
  color: #7c4caf;
}

/* 技能标签 */
.skills-section {
  text-align: center;
}

.skills-section h4 {
  color: #7c3a9e;
  font-size: 1rem;
  margin-bottom: 14px;
}

.skills-tags {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 10px;
}

.skill-tag {
  background: linear-gradient(135deg, #f2e4ff, #ffe4f0);
  color: #7c4caf;
  padding: 8px 18px;
  border-radius: 30px;
  font-size: 0.9rem;
  font-weight: 500;
  border: 1px solid rgba(200, 150, 255, 0.4);
  transition: all 0.25s;
}

.skill-tag:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(170, 90, 220, 0.3);
  background: linear-gradient(135deg, #c49bff, #ffb3e6);
  color: white;
}

/* 分割线 */
.divider {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin: 28px 0;
}

.divider-dot {
  width: 8px;
  height: 8px;
  background: linear-gradient(135deg, #b983ff, #ff9cef);
  border-radius: 50%;
}

.divider-line {
  width: 60px;
  height: 2px;
  background: linear-gradient(90deg, transparent, rgba(200, 150, 255, 0.5), transparent);
}

/* 功能菜单 */
.func-section {
  position: relative;
  z-index: 1;
}

.func-section h3 {
  color: #7c3a9e;
  font-size: 1.2rem;
  margin-bottom: 16px;
  text-align: center;
}

.func-list {
  background: rgba(255, 255, 255, 0.7);
  border-radius: 20px;
  overflow: hidden;
  border: 1px solid rgba(230, 180, 255, 0.4);
}

.func-item {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px 18px;
  cursor: pointer;
  transition: all 0.2s;
  border-bottom: 1px solid rgba(230, 180, 255, 0.2);
}

.func-item:last-child {
  border-bottom: none;
}

.func-item:hover {
  background: rgba(240, 210, 255, 0.4);
}

.func-icon {
  width: 46px;
  height: 46px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.func-icon i {
  font-size: 1.2rem;
  color: white;
}

.func-text {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.func-label {
  color: #5a3b7a;
  font-weight: 500;
  font-size: 1rem;
}

.func-desc {
  color: #9b7bb5;
  font-size: 0.8rem;
}

.func-arrow {
  color: #b87cd9;
  font-size: 0.85rem;
  opacity: 0.6;
}

/* 社交链接 */
.social-section {
  position: relative;
  z-index: 1;
}

.social-section h3 {
  color: #7c3a9e;
  font-size: 1.2rem;
  margin-bottom: 16px;
  text-align: center;
}

.social-links {
  display: flex;
  justify-content: center;
  gap: 20px;
}

.social-link {
  width: 54px;
  height: 54px;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #7c4caf;
  font-size: 1.4rem;
  transition: all 0.3s;
  border: 1px solid rgba(200, 150, 255, 0.4);
}

.social-link:hover {
  transform: translateY(-4px) scale(1.1);
  background: linear-gradient(135deg, #c49bff, #ffb3e6);
  color: white;
  box-shadow: 0 10px 24px rgba(170, 90, 220, 0.4);
  border-color: transparent;
}

/* 底部信息 */
.more-footer {
  text-align: center;
  padding: 32px 20px 20px;
}

.copyright {
  color: #7c4caf;
  font-size: 1rem;
  margin: 0 0 6px;
  font-weight: 500;
}

.version {
  color: #9b7bb5;
  font-size: 0.85rem;
  margin: 0;
  opacity: 0.7;
}

/* 响应式 */
@media (max-width: 600px) {
  .intro-card {
    padding: 20px;
  }
  
  .avatar {
    width: 80px;
    height: 80px;
  }
  
  .avatar span {
    font-size: 1.8rem;
  }
  
  .intro-header h2 {
    font-size: 1.5rem;
  }
}
</style>