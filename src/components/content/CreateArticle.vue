<template>
  <div class="create-article">
    <!-- 装饰背景 -->
    <div class="decorative-bg">
      <div class="decor-circle circle-1"></div>
      <div class="decor-circle circle-2"></div>
    </div>

    <!-- 页面头部 -->
    <div class="page-header">
      <button class="back-btn" @click="goBack">
        <i class="fas fa-arrow-left"></i> 返回
      </button>
      <h2>创建文章</h2>
      <button class="publish-btn" @click="publishArticle">
        <i class="fas fa-paper-plane"></i> 发布
      </button>
    </div>

    <!-- 文章表单 - 自动高度 -->
    <div class="article-form" :style="{ minHeight: formHeight + 'px' }">

      <!-- 标题输入 -->
      <div class="form-section">
        <label class="section-label">文章标题 <span class="required">*</span></label>
        <input 
          type="text" 
          v-model="articleTitle" 
          placeholder="请输入文章标题..." 
          class="title-input"
          maxlength="100"
        />
        <span class="char-count">{{ articleTitle.length }}/100</span>
      </div>

      <div class="form-section">
        <label class="section-label">
          文章简介 <span class="required">*</span>
          <span class="hint">（1～2句话简短介绍）</span>
        </label>
        <textarea 
          v-model="articleIntro" 
          placeholder="请输入文章简介..." 
          class="textarea-input intro-textarea"
          maxlength="200"
          rows="2"
        ></textarea>
        <span class="char-count">{{ articleIntro.length }}/200</span>
      </div>

      <!-- 分类选择 -->
      <div class="form-section">
        <label class="section-label">文章分类 <span class="required">*</span></label>
        <div class="category-tags">
          <span 
            v-for="category in categories" 
            :key="category.id"
            class="category-tag"
            :class="{ active: selectedCategory === category.id }"
            @click="selectedCategory = category.id"
          >
            <i :class="category.icon"></i>
            {{ category.name }}
          </span>
        </div>
      </div>

      <!-- 文章内容 Markdown 编辑器 -->
      <div class="form-section">
        <label class="section-label">文章内容 <span class="required">*</span></label>
        <!-- <MarkdownEditor v-model="articleContent" placeholder="开始撰写你的文章..." /> -->
         <MarkdownVidtor v-model="articleContent" v-if="isParentReady" placeholder="开始撰写你的文章..." />
      </div>
    </div>

    <!-- 封面上传 -->
      <div class="form-section">
        <label class="section-label">文章封面</label>
        <div class="cover-upload" @click="triggerUpload" @dragover.prevent @drop.prevent="handleDrop">
          <input 
            type="file" 
            ref="fileInput" 
            accept="image/*" 
            @change="handleFileChange" 
            style="display: none"
          />
          <div v-if="!coverImage" class="upload-placeholder">
            <i class="fas fa-cloud-upload-alt"></i>
            <span>点击或拖拽上传封面图片</span>
          </div>
          <div v-else class="cover-preview">
            <div class="cover-image-wrapper">
              <img :src="coverImage" alt="封面预览" />
            </div>
            <div class="cover-overlay">
              <button class="change-btn" @click.stop="triggerUpload">
                <i class="fas fa-edit"></i> 更换
              </button>
              <button class="delete-btn" @click.stop="removeCover">
                <i class="fas fa-trash"></i> 删除
              </button>
            </div>
          </div>
        </div>
      </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import MarkdownVidtor from '../tools/MarkdownVditor.vue';
import { uploadImage, revokeImageUrl, imageView, contentLengthLimit } from '@/config/request.js';
import { request } from '@/config/request.js';
import router from '@/config';
import { useUserStore } from '@/store/userStore.js';

const emit = defineEmits(['close', 'publish']);
const articleIntro = ref('');

// 返回
const goBack = () => {
  window.history.back();
};

// 表单数据
const articleTitle = ref('');
const articleContent = ref('');  // Markdown 编辑器内容
const selectedCategory = ref(null);    
// const customTags = ref([]);
const coverImage = ref(null);
const coverName = ref(''); // 图片名称
const fileInput = ref(null);
const formHeight = ref(400); // 初始高度
const isParentReady = ref(false);

const userStore = useUserStore();

const load = async () => {
  isParentReady.value = true
};

onMounted(() => {
  load()  // 页面加载后自动调用
});

// 分类选项
const categories = [
  { id: 1, name: '生活随笔', icon: 'fas fa-coffee' },
  { id: 2, name: '读书笔记', icon: 'fas fa-book' },
  { id: 3, name: '技术教程', icon: 'fas fa-code' },
  { id: 4, name: '旅行见闻', icon: 'fas fa-plane' },
  { id: 5, name: '美食分享', icon: 'fas fa-utensils' },
  { id: 6, name: '摄影作品', icon: 'fas fa-camera' }
];

// 分类 ID 到名称的映射
const categoryMap = {
  1: '生活随笔',
  2: '读书笔记',
  3: '技术教程',
  4: '旅行见闻',
  5: '美食分享',
  6: '摄影作品'
};  

// 触发文件上传
const triggerUpload = () => {
  fileInput.value.click();
};

// 处理文件选择 - 使用 tools.js 的 uploadImage
const handleFileChange = async (event) => {
  const file = event.target.files[0];
  if (file) {
    try {
      const reply = await uploadImage(file, 'article');
      const imageUrl = await imageView(reply);
      coverImage.value = imageUrl;
      coverName.value = reply;
      console.log('封面上传成功:', imageUrl);
    } catch (error) {
      console.error('封面上传失败:', error);
      // uploadImage 和 imageView 内部已经有 alert 提示，这里不需要重复
    }
  }
};

// 处理拖拽上传 - 使用 tools.js 的 uploadImage
const handleDrop = async (event) => {
  const file = event.dataTransfer.files[0];
  if (file && file.type.startsWith('image/')) {
    try {
      const reply = await uploadImage(file, 'article');
      const imageUrl = await imageView(reply);
      coverImage.value = imageUrl;
      coverName.value = reply;
      console.log('封面上传成功:', imageUrl);
    } catch (error) {
      console.error('封面上传失败:', error);
      // uploadImage 和 imageView 内部已经有 alert 提示，这里不需要重复
    }
  }
};

// 删除封面
const removeCover = () => {
  if (coverImage.value) {
    revokeImageUrl(coverImage.value);
  }
  coverImage.value = null;
  if (fileInput.value) {
    fileInput.value.value = '';
  }
};

// 组件卸载时释放所有 Blob URL
onBeforeUnmount(() => {
  if (coverImage.value) {
    revokeImageUrl(coverImage.value);
  }
});

// 发布文章
const publishArticle = async () => {
  if (!articleTitle.value.trim()) {
    alert('请输入文章标题');
    return;
  }
  if (!selectedCategory.value) {
    alert('请选择文章分类');
    return;
  }
  if (!articleIntro.value.trim()) {
    alert('请输入文章简介');
    return;
  }
  if (!articleContent.value.trim()) {
    alert('请输入文章内容');
    return;
  }
  if (!contentLengthLimit(articleContent.value)) {
    console.error('内容长度超过限制');
    return;
  }

  const articleData = {
    title: articleTitle.value,
    category: categoryMap[selectedCategory.value] || '',
    intro: articleIntro.value,
    content: articleContent.value,
    // tags: customTags.value,
    coverName: coverName.value,
    createTime: new Date().toISOString(),
    user_id: userStore.userInfo.id
  };

  console.log('发布文章:', articleData);
  
  // 调用 api 发送给后端然后录入数据库
  try {
    const response = await request.post('/upload/article', articleData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('后端响应:', response.data);
    
    if (response.data && response.status === 200 && response.data.message === 'success') {
      console.log('✅ 文章已成功保存到数据库');
      alert('文章发布成功！');
      router.push('/');
    } else {
      throw new Error('响应数据异常');
    }
  } catch (error) {
    console.error('❌ 发布失败:', error);
    
    // 提取后端返回的错误信息（400 状态码时 jsonify(e) 的内容）
    let errorMsg = '发布失败';
    if (error.response?.status === 500 && error.response?.data?.message) {
      errorMsg = error.response.data.message;
    } else if (error.response?.status) {
      // 其他状态码错误
      errorMsg = `发布失败：HTTP ${error.response.status} ${error.response.statusText}`;
    } else if (error.message) {
      errorMsg = error.message;
    }
    
    alert(`发布失败：${errorMsg}`);
  }
};

</script>

<style scoped>
@import '/public/css/article.css';
</style>
