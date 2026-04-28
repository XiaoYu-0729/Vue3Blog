<template>
  <div class="markdown-vidtor-wrapper">
    <div id="vidtor-editor" class="vidtor-container"></div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount, nextTick } from 'vue';
import Vditor from 'vditor';
import 'vditor/dist/index.css';
import { uploadImage, imageView } from '@/config/request.js';

// 获取父组件传递的值
const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: '开始撰写你的文章...'
  }
});

const emit = defineEmits(['update:modelValue']);

let vditor = null;

// 初始化编辑器
onMounted(() => {
  nextTick(() => {
    try {
      // 确保语言包已加载
      if (!window.VditorI18n) {
        window.VditorI18n = {};
      }
      
      vditor = new Vditor('vidtor-editor', {
        lang: 'zh_CN',
        value: props.modelValue,
        placeholder: props.placeholder,
        mode: 'ir',
        cdn: '/vditor',
        locale: 'zh_CN',
        // 代码块配置
        markdown: {
          codeBlockPreview: true
        },
        // 自定义语言显示名称
        hljs: {
          style: 'github',
          langs: []
        },
        toolbarConfig: {
          pin: true,
          wrap: false
        },
        after: () => {
          // 初始化后样式处理
        },
        toolbar: [
          'bold',
          'italic',
          'strike',
          '|',
          'headings',
          '|',
          'quote',
          '|',
          'list',
          'ordered-list',
          'check',
          '|',
          'link',
          'code',
          'inline-code',
          '|',
          {'name': 'upload', 'tip': '上传图片'},
          'table',
          '|',
          'undo',
          'redo',
          '|',
          'preview'
        ],
        theme: 'classic',
        icon: 'ant',
        preview: {
          mode: 'both'
        },
        input: (value) => {
          emit('update:modelValue', value);
        },
        upload: {
          accept: 'image/*',
          handler: async (files) => {
            const file = files[0];
            if (!file) {
              alert('请选择一个文件进行上传');
              return;
            }
            try {
              const reply = await uploadImage(file, 'markdown');
              vditor.insertValue(`![${file.name}](/flask${reply})\n`);
              console.log('图片上传成功:', reply);
            } catch (error) {
              console.error('图片上传失败:', error);
              alert('图片上传失败，请稍后再试。');
            }
          }
        },
        cache: {
          enable: false
        },
        height: '75vh',
        resize: {
          enable: true,
          position: 'bottom'
        }
      });
    } catch (err) {
      console.error('❌ [Vditor] 初始化失败:', err);
      alert('编辑器初始化失败，请联系管理员。');
    }
  });
});

onBeforeUnmount(() => {
  if (vditor) {
    try {
      vditor.destroy();
    } catch (e) {
      // ignore destroy error
    }
    vditor = null;
  }
});

// 监听外部值变化
watch(() => props.modelValue, (newVal) => {
  if (vditor && newVal !== vditor.getValue()) {
    vditor.setValue(newVal);
  }
});

// 暴露方法
defineExpose({
  getValue: () => vditor?.getValue() || '',
  setValue: (value) => {
    if (vditor) {
      vditor.setValue(value);
    }
  }
});
</script>

<style>
.markdown-vidtor-wrapper {
  width: 100%;
  height: auto;
}

.vidtor-container {
  border: 1px solid rgba(230, 180, 255, 0.4) !important;
  border-radius: 16px !important;
}

/* 紫色主题覆盖 */
.vditor {
  border: 1px solid rgba(230, 180, 255, 0.4) !important;
  border-radius: 16px !important;
  font-family: 'Microsoft YaHei', sans-serif !important;
  background: transparent !important;
}

/* 工具栏样式 */
.vditor-toolbar {
  background: linear-gradient(135deg, rgba(248, 232, 255, 0.95), rgba(255, 245, 251, 0.95)) !important;
  border-bottom: 1px solid rgba(230, 180, 255, 0.4) !important;
  border-radius: 16px 16px 0 0 !important;
  padding: 8px 12px !important;
}

/* “斜体”按钮的图标大小 */
.vditor-toolbar__item button[data-type="italic"] svg {
    width: 13px;
    height: 13px;
}

/* “粗体”按钮的图标大小 */
.vditor-toolbar__item button[data-type="bold"] svg {
    width: 13px;
    height: 13px;
}

.vditor-toolbar__icon {
  color: #7c4caf !important;
}

.vditor-toolbar__icon:hover {
  background: rgba(185, 131, 255, 0.2) !important;
  color: #b983ff !important;
}

.vditor-toolbar__icon--current {
  background: linear-gradient(135deg, #b983ff, #ff9cef) !important;
  color: white !important;
}

/* 编辑区域 */
.vditor-reset {
  font-family: 'Microsoft YaHei', sans-serif !important;
  font-size: 16px !important;
  line-height: 1.8 !important;
  padding: 20px 25px !important;
  border-radius: 0 0 16px 16px !important;
}

.vditor-reset h1,
.vditor-reset h2,
.vditor-reset h3 {
  color: #7c3a9e !important;
}

.vditor-reset a {
  color: #b983ff !important;
}

.vditor-reset blockquote {
  border-left: 4px solid #b983ff !important;
  background: rgba(248, 232, 255, 0.5) !important;
}

.vditor-reset img {
  border: 2px solid rgba(185, 131, 255, 0.3) !important;
  border-radius: 8px !important;
}

/* 滚动条 */
.vditor-reset::-webkit-scrollbar,
.vditor-ir::-webkit-scrollbar {
  width: 6px;
}

.vditor-reset::-webkit-scrollbar-track,
.vditor-ir::-webkit-scrollbar-track {
  background: rgba(242, 217, 255, 0.5);
  border-radius: 8px;
}

.vditor-reset::-webkit-scrollbar-thumb,
.vditor-ir::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #ca9eff, #ffa2de);
  border-radius: 8px;
}

/* 预览区域 */
.vditor-preview {
  font-family: 'Microsoft YaHei', sans-serif !important;
  font-size: 16px !important;
  line-height: 1.8 !important;
  padding: 20px 25px !important;
  background: transparent !important;
}

/* 移动端优化 */
@media (max-width: 768px) {
  .vditor-toolbar {
    padding: 4px 6px !important;
  }

  /* 将默认的左右6px内边距改为12px */
  .vditor-toolbar__item {
      padding: 0;
  }

  /* 统一调整工具栏所有图标的大小 */
  .vditor-toolbar__item svg {
      width: 13px;   /* 设置宽度 */
      height: 13px;  /* 设置高度 */
  }

  /* “斜体”按钮的图标大小 */
  .vditor-toolbar__item button[data-type="italic"] svg {
      width: 11px;
      height: 11px;
  }

  /* “粗体”按钮的图标大小 */
  .vditor-toolbar__item button[data-type="bold"] svg {
      width: 11px;
      height: 11px;
  }

  .vditor-reset,
  .vditor-preview {
    font-size: 15px !important;
    padding: 15px !important;
  }
}
</style>
