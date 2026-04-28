<template>
  <div class="create-project">
    <div class="decorative-bg">
      <div class="decor-circle circle-1"></div>
      <div class="decor-circle circle-2"></div>
    </div>

    <div class="page-header">
      <button class="back-btn" @click="goBack">
        <i class="fas fa-arrow-left"></i> 返回
      </button>
      <h2>创建项目</h2>
      <button class="publish-btn" @click="publishProject">
        <i class="fas fa-paper-plane"></i> 发布
      </button>
    </div>

    <div class="project-form">
      <div class="form-section">
        <label class="section-label">
          项目名称 <span class="required">*</span>
        </label>
        <input 
          type="text" 
          v-model="projectName" 
          placeholder="请输入项目名称..." 
          class="text-input"
          maxlength="50"
        />
        <span class="char-count">{{ projectName.length }}/50</span>
      </div>

      <div class="form-section">
        <label class="section-label">
          项目简介 <span class="required">*</span>
          <span class="hint">（1～2句话简短介绍）</span>
        </label>
        <textarea 
          v-model="projectIntro" 
          placeholder="请输入项目简介..." 
          class="textarea-input intro-textarea"
          maxlength="200"
          rows="2"
        ></textarea>
        <span class="char-count">{{ projectIntro.length }}/200</span>
      </div>

      <div class="form-section">
        <label class="section-label">
          技术栈 <span class="required">*</span>
        </label>
        <input 
          type="text" 
          v-model="techStack" 
          placeholder="例如：Vue3, Python, Flask, MySQL" 
          class="text-input"
        />
        <span class="hint-text">多个技术栈请用 “ , ” 连接</span>
      </div>

      <div class="form-section">
        <label class="section-label">
          项目状态 <span class="required">*</span>
        </label>
        <div class="status-tags">
          <span 
            v-for="status in projectStatuses" 
            :key="status.value"
            class="status-tag"
            :class="{ active: projectStatus === status.value }"
            @click="projectStatus = status.value"
          >
            {{ status.label }}
          </span>
        </div>
      </div>

      <div class="form-section">
        <label class="section-label">项目时间</label>
        <div class="time-range">
          <div class="time-input-group">
            <input type="date" v-model="startDate" class="date-input" />
            <!-- <span class="time-label">开始时间</span> -->
          </div>
          <span class="time-divider">至</span>
          <div class="time-input-group">
            <input type="date" v-model="endDate" class="date-input" />
            <!-- <span class="time-label">结束时间</span> -->
          </div>
        </div>
      </div>

      <div class="form-section">
        <label class="section-label">
          项目描述 <span class="required">*</span>
          <span class="hint">（详细介绍）</span>
        </label>
        <!-- Markdown 编辑器区域 -->
        <MarkdownVditor v-if="isParentReady" v-model="projectDescription" placeholder="请输入项目描述..." />
      </div>

      <div class="form-section">
        <label class="section-label">
          文件上传
          <span class="hint">（支持 .zip, .rar, .doc, .docx, .ppt, .pptx, .pdf, .txt, .rtf, .xls, .xlsx, .c, .cpp, .yml, .yaml, .properties 等文件）</span>
        </label>
        <div class="file-upload-area" @click="triggerFileUpload" @dragover.prevent @drop.prevent="handleFileDrop">
          <input 
            type="file" 
            ref="fileInput" 
            multiple
            accept=".zip,.rar,.doc,.docx,.ppt,.pptx,.pdf,.txt,.rtf,.xls,.xlsx,.html,.css,.js,.py,.java,.md,.c,.cpp,.h,.hpp,.yml,.yaml,.properties"
            @change="handleFileChange" 
            style="display: none"
          />
          <div v-if="uploadedFiles.length === 0" class="upload-placeholder">
            <i class="fas fa-cloud-upload-alt"></i>
            <span>点击或拖拽上传文件</span>
            <span class="upload-hint">支持多个文件</span>
          </div>
          <div v-else class="file-list-wrapper">
            <div class="file-list">
              <div v-for="(file, index) in uploadedFiles" :key="index" class="file-item">
                <i :class="getFileIcon(file.name)"></i>
                <span class="file-name" :title="file.name">{{ file.name }}</span>
                <button class="file-remove-btn" @click.stop="removeFile(index)">
                  <i class="fas fa-times"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="form-section">
        <label class="section-label">项目封面图 </label>
        <div class="cover-upload" @click="triggerCoverUpload" @dragover.prevent @drop.prevent="handleCoverDrop">
          <input type="file" ref="coverInput" accept="image/*" @change="handleCoverChange" style="display: none" />
          <div v-if="!coverImage" class="upload-placeholder">
            <i class="fas fa-cloud-upload-alt"></i>
            <span>点击或拖拽上传封面图片</span>
            <span class="upload-hint">建议尺寸 16:9</span>
          </div>
          <div v-else class="cover-preview-wrapper">
            <div class="cover-image-container">
              <img :src="coverImage" alt="封面预览" />
            </div>
            <div class="cover-overlay">
              <button class="change-btn" @click.stop="triggerCoverUpload">
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
  </div>
</template>

<script setup>
import router from '@/config';
import MarkdownVditor from '../tools/MarkdownVditor.vue';
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { uploadImage, uploadFiles, revokeImageUrl, 
  imageView, contentLengthLimit, request } from '@/config/request.js';

// ============================================================
//  事件
// ============================================================
const emit = defineEmits(['close', 'publish']);

const goBack = () => {
  router.push('/profile');
};

// ============================================================
//  表单数据
// ============================================================
const projectName = ref('');
const projectIntro = ref('');
const techStack = ref('');
const projectDescription = ref('');
const projectStatus = ref(null);
const startDate = ref('');
const endDate = ref('');
const isParentReady = ref(false);

const load = async () => {
  // 模拟异步加载（数据请求、图片加载等）
  await new Promise(resolve => setTimeout(resolve, 2000))
  isParentReady.value = true
};

onMounted(() => {
  load();
});

// 项目状态选项
const projectStatuses = [
  { value: 'ongoing', label: '进行中', icon: 'fas fa-sync-alt' },
  { value: 'completed', label: '已完成', icon: 'fas fa-check-circle' },
  { value: 'maintaining', label: '维护中', icon: 'fas fa-tools' }
];

// ============================================================
//  封面图
// ============================================================
const coverImage = ref(null);
const coverName = ref('');
const coverInput = ref(null);

const triggerCoverUpload = () => {
  coverInput.value.click();
};

const handleCoverChange = async (event) => {
  const file = event.target.files[0];
  if (file) {
    try {
      const reply = await uploadImage(file, 'project');
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

const handleCoverDrop = async (event) => {
  const file = event.dataTransfer.files[0];
  if (file && file.type.startsWith('image/')) {
    try {
      const reply = await uploadImage(file, 'project');
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

const removeCover = () => {
  if (coverImage.value) {
    revokeImageUrl(coverImage.value);
  }
  coverImage.value = null;
  if (coverInput.value) {
    coverInput.value.value = '';
  }
};

// 组件卸载时释放所有 Blob URL
onBeforeUnmount(() => {
  if (coverImage.value) {
    revokeImageUrl(coverImage.value);
  }
});

// ============================================================
//  文件上传
// ============================================================
const uploadedFiles = ref([]);
const fileInput = ref(null);

const triggerFileUpload = () => {
  fileInput.value.click();
};

const handleFileChange = (event) => {
  const files = Array.from(event.target.files);
  files.forEach((file) => {
    uploadedFiles.value.push(file);
  });
};

const handleFileDrop = (event) => {
  const files = Array.from(event.dataTransfer.files);
  files.forEach((file) => {
    uploadedFiles.value.push(file);
  });
};

const removeFile = (index) => {
  uploadedFiles.value.splice(index, 1);
};

const getFileIcon = (fileName) => {
  const ext = fileName.split('.').pop().toLowerCase();
  const iconMap = {
    // 压缩文件
    zip:   'fas fa-file-archive',
    rar:   'fas fa-file-archive',
    // Word 文档
    doc:   'fas fa-file-word',
    docx:  'fas fa-file-word',
    // PPT 演示文稿
    ppt:   'fas fa-file-powerpoint',
    pptx:  'fas fa-file-powerpoint',
    // PDF 文件
    pdf:   'fas fa-file-pdf',
    // 文本文件
    txt:   'fas fa-file-alt',
    rtf:   'fas fa-file-alt',
    // Excel 表格
    xls:   'fas fa-file-excel',
    xlsx:  'fas fa-file-excel',
    // 代码文件
    html:  'fab fa-html5',
    css:   'fab fa-css3',
    js:    'fab fa-js',
    py:    'fab fa-python',
    java:  'fab fa-java',
    c:     'fas fa-code',
    cpp:   'fas fa-code',
    h:     'fas fa-code',
    hpp:   'fas fa-code',
    // 配置文件
    yml:   'fas fa-cog',
    yaml:  'fas fa-cog',
    properties: 'fas fa-cog',
    // 其他
    md:    'fab fa-markdown',
  };
  return iconMap[ext] || 'fas fa-file';
};

// ============================================================
//  发布
// ============================================================
const publishProject = async () => {
  if (!projectName.value.trim()) {
    alert('请输入项目名称');
    return;
  }
  if (!projectIntro.value.trim()) {
    alert('请输入项目简介');
    return;
  }
  if (!techStack.value.trim()) {
    alert('请输入技术栈');
    return;
  }
  if (!projectDescription.value.trim()) {
    alert('请输入项目描述');
    return;
  }
  if (!projectStatus.value) {
    alert('请选择项目状态');
    return;
  }
  if (!contentLengthLimit(projectDescription.value)) {
    console.error('内容长度超过限制');
    return;
  }

  // 先上传文件（如果有）
  let fileUrls = [];
  if (uploadedFiles.value.length > 0) {
    try {
      fileUrls = await uploadFiles(uploadedFiles.value, 'project');
      console.log('✅ 文件上传成功:', fileUrls);
    } catch (error) {
      console.error('❌ 文件上传失败:', error);
      return;
    }
  }

  const projectData = {
    title:        projectName.value,
    intro:       projectIntro.value,
    techStack:   techStack.value,
    content: projectDescription.value,
    status:      projectStatus.value,
    startDate:   startDate.value,
    endDate:     endDate.value,
    coverName:   coverName.value,
    files:       fileUrls, // 使用上传后的文件 URL
    createTime:  new Date().toISOString(),
  };

  console.log('发布项目:', projectData);

  try {
    const response = await request.post('/upload/project', projectData, {
      headers: {
        'Content-Type': 'application/json'
      },
      _skipAuth: false // 需要认证
    });

    console.log('后端响应:', response.data);

    if (response.data && response.status === 200 && response.data === 'success') {
      console.log('✅ 项目已成功保存到数据库');
      alert('项目发布成功！');
      router.push('/');
    } else {
      throw new Error('响应数据异常');
    }
  } catch (error) {
    console.error('❌ 发布失败:', error);
    console.error('❌ 错误状态:', error.response?.status);
    console.error('❌ 错误响应:', error.response?.data);
    
    // 提取后端返回的错误信息（400 状态码时 jsonify(e) 的内容）
    let errorMsg = '发布失败';
    if (error.response?.status === 400 && error.response?.data) {
      // 后端出现错误返回 jsonify(e)，可能是字符串或对象
      const backendError = typeof error.response.data === 'string' 
        ? error.response.data 
        : (error.response.data.error || error.response.data.message || JSON.stringify(error.response.data));
      errorMsg = backendError;
    } else if (error.response?.status) {
      // 其他状态码错误
      errorMsg = `发布失败：HTTP ${error.response.status}`;
    } else if (error.message) {
      errorMsg = error.message;
    }
    
    alert(errorMsg);
  }
};

</script>

<style scoped>
@import '/public/css/article.css';
@import '/public/css/project.css';
</style>