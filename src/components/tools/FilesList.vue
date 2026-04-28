<template>
  <div class="files-list">
    <div class="file-list">
      <div 
        v-for="file in files" 
        :key="file.id" 
        class="file-item"
      >
        <i :class="getFileIcon(file.fileName)" class="file-icon"></i>
        <span class="file-name" :title="file.fileName">{{ file.fileName }}</span>
        <span class="file-size" v-if="file.size">{{ formatFileSize(file.size) }}</span>
        <div class="file-actions">
          <button class="action-btn" @click="downloadFile(file)" title="下载">
            <i class="fas fa-download"></i>
          </button>
          <button class="action-btn" @click="previewFile(file)" title="预览">
            <i class="fas fa-eye"></i>
          </button>
        </div> 
      </div>
      
      <!-- <div v-if="files.length === 0" class="empty-state">
        <i class="fas fa-folder-open"></i>
        <p>暂无文件</p>
      </div> -->
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

// 接收文件列表 props
const props = defineProps({
  files: {
    type: Array,
    default: () => []
  }
});

// 获取文件图标
const getFileIcon = (fileName) => {
  const ext = fileName.split('.').pop().toLowerCase();
  const iconMap = {
    // 压缩文件
    zip: 'fas fa-file-archive',
    rar: 'fas fa-file-archive',
    // Word 文档
    doc: 'fas fa-file-word',
    docx: 'fas fa-file-word',
    // PPT 演示文稿
    ppt: 'fas fa-file-powerpoint',
    pptx: 'fas fa-file-powerpoint',
    // PDF 文件
    pdf: 'fas fa-file-pdf',
    // 文本文件
    txt: 'fas fa-file-alt',
    rtf: 'fas fa-file-alt',
    // Excel 表格
    xls: 'fas fa-file-excel',
    xlsx: 'fas fa-file-excel',
    // 代码文件
    html: 'fab fa-html5',
    css: 'fab fa-css3',
    js: 'fab fa-js',
    py: 'fab fa-python',
    java: 'fab fa-java',
    c: 'fas fa-code',
    cpp: 'fas fa-code',
    h: 'fas fa-code',
    hpp: 'fas fa-code',
    // 配置文件
    yml: 'fas fa-cog',
    yaml: 'fas fa-cog',
    properties: 'fas fa-cog',
    // 其他
    md: 'fab fa-markdown',
  };
  return iconMap[ext] || 'fas fa-file';
};

// 格式化文件大小
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

// 下载文件
const downloadFile = (file) => {
  console.log('📥 下载文件:', file.name);
  // TODO: 实现下载逻辑
};

// 预览文件
const previewFile = (file) => {
  console.log('👁️ 预览文件:', file.name);
  // TODO: 实现预览逻辑
};
</script>

<style scoped>
/* ===== 文件列表 ===== */
.files-list {
  width: 100%;
}

.file-list {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  padding-top: 15px;
  border-top: 1px solid rgba(200, 150, 255, 0.2);
}

/* 文件项 */
.file-item {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 10px 14px;
  background: rgba(255, 255, 255, 0.6);
  border: 1px solid rgba(200, 150, 255, 0.3);
  border-radius: 16px;
  transition: all 0.2s ease;
  flex: 0 0 calc(50% - 6px);
  max-width: calc(50% - 6px);
  line-clamp: 1;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.file-item:hover {
  background: rgba(255, 255, 255, 0.8);
  border-color: rgba(200, 150, 255, 0.5);
  box-shadow: 0 4px 12px rgba(180, 90, 230, 0.15);
}

/* 文件图标 */
.file-icon {
  font-size: 1.5rem;
  color: #b87cd9;
  width: 40px;
  text-align: center;
  flex-shrink: 0;
}

/* 文件名 */
.file-name {
  flex: 1;
  font-size: 0.95rem;
  color: #4a2c5f;
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  min-width: 0;
}

/* 文件大小 */
.file-size {
  font-size: 0.8rem;
  color: #8b6fa3;
  background: rgba(255, 255, 255, 0.5);
  padding: 3px 10px;
  border-radius: 12px;
  flex-shrink: 0;
}

/* 操作按钮 */
.file-actions {
  display: flex;
  gap: 6px;
  flex-shrink: 0;
}

.action-btn {
  width: 32px;
  height: 32px;
  border-radius: 10px;
  border: 1px solid rgba(200, 150, 255, 0.4);
  background: rgba(255, 255, 255, 0.6);
  color: #7c3a9e;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.action-btn:hover {
  background: linear-gradient(135deg, #f3e8ff, #fce4f0);
  border-color: #c084fc;
  color: #9b4bcf;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(180, 90, 230, 0.2);
}

/* 空状态 */
.empty-state {
  text-align: center;
  padding: 40px 20px;
  color: #a890b8;
}

.empty-state i {
  font-size: 2.5rem;
  margin-bottom: 12px;
  opacity: 0.5;
}

.empty-state p {
  font-size: 1rem;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .file-list {
    gap: 10px;
  }
  
  .file-item {
    flex: 0 0 100%;
    max-width: 100%;
    padding: 12px 14px;
  }
  
  .file-icon {
    font-size: 1.2rem;
    width: 32px;
  }
  
  .file-name {
    font-size: 0.85rem;
  }
  
  .file-size {
    font-size: 0.7rem;
    padding: 2px 8px;
  }
  
  .action-btn {
    width: 28px;
    height: 28px;
    font-size: 0.8rem;
  }
}
</style>
