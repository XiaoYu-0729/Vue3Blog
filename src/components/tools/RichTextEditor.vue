<template>
  <div class="rich-text-editor">
    <!-- 工具栏 -->
    <div class="editor-toolbar" v-if="editor">
      <!-- 字号选择 -->
      <div class="toolbar-group">
        <select v-model="fontSize" @change="setFontSize" class="toolbar-select">
          <option value="14px">小号</option>
          <option value="16px">常规</option>
          <option value="18px">中号</option>
          <option value="20px">大号</option>
          <option value="24px">特大</option>
        </select>
      </div>

      <!-- 字体选择 -->
      <div class="toolbar-group">
        <select v-model="fontFamily" @change="setFontFamily" class="toolbar-select">
          <option value="Microsoft YaHei">微软雅黑</option>
          <option value="Arial">Arial</option>
          <option value="SimSun">宋体</option>
          <option value="SimHei">黑体</option>
          <option value="KaiTi">楷体</option>
          <option value="FangSong">仿宋</option>
        </select>
      </div>

      <div class="toolbar-divider"></div>

      <!-- 粗体 -->
      <button 
        @click="editor.chain().focus().toggleBold().run()" 
        :class="{ active: editor.isActive('bold') }"
        class="toolbar-btn"
        title="粗体"
      >
        <i class="fas fa-bold"></i>
      </button>

      <!-- 斜体 -->
      <button 
        @click="editor.chain().focus().toggleItalic().run()" 
        :class="{ active: editor.isActive('italic') }"
        class="toolbar-btn"
        title="斜体"
      >
        <i class="fas fa-italic"></i>
      </button>

      <!-- 下划线 -->
      <button 
        @click="editor.chain().focus().toggleUnderline().run()" 
        :class="{ active: editor.isActive('underline') }"
        class="toolbar-btn"
        title="下划线"
      >
        <i class="fas fa-underline"></i>
      </button>

      <!-- 删除线 -->
      <button 
        @click="editor.chain().focus().toggleStrike().run()" 
        :class="{ active: editor.isActive('strike') }"
        class="toolbar-btn"
        title="删除线"
      >
        <i class="fas fa-strikethrough"></i>
      </button>

      <div class="toolbar-divider"></div>

      <!-- 有序列表 -->
      <button 
        @click="editor.chain().focus().toggleOrderedList().run()" 
        :class="{ active: editor.isActive('orderedList') }"
        class="toolbar-btn"
        title="有序列表"
      >
        <i class="fas fa-list-ol"></i>
      </button>

      <!-- 无序列表 -->
      <button 
        @click="editor.chain().focus().toggleBulletList().run()" 
        :class="{ active: editor.isActive('bulletList') }"
        class="toolbar-btn"
        title="无序列表"
      >
        <i class="fas fa-list-ul"></i>
      </button>

      <div class="toolbar-divider"></div>

      <!-- 对齐方式 -->
      <button 
        @click="editor.chain().focus().setTextAlign('left').run()" 
        :class="{ active: editor.isActive({ textAlign: 'left' }) || !editor.isActive({ textAlign: 'center' }) && !editor.isActive({ textAlign: 'right' }) && !editor.isActive({ textAlign: 'justify' }) }"
        class="toolbar-btn"
        title="左对齐"
      >
        <i class="fas fa-align-left"></i>
      </button>
      <button 
        @click="editor.chain().focus().setTextAlign('center').run()" 
        :class="{ active: editor.isActive({ textAlign: 'center' }) }"
        class="toolbar-btn"
        title="居中"
      >
        <i class="fas fa-align-center"></i>
      </button>
      <button 
        @click="editor.chain().focus().setTextAlign('right').run()" 
        :class="{ active: editor.isActive({ textAlign: 'right' }) }"
        class="toolbar-btn"
        title="右对齐"
      >
        <i class="fas fa-align-right"></i>
      </button>
      <!-- <button 
        @click="editor.chain().focus().setTextAlign('justify').run()" 
        :class="{ active: editor.isActive({ textAlign: 'justify' }) }"
        class="toolbar-btn"
        title="两端对齐"
      >
        <i class="fas fa-align-justify"></i>
      </button> -->

      <div class="toolbar-divider"></div>

      <!-- 文字颜色 -->
      <div class="toolbar-group color-picker-group">
        <input 
          type="color" 
          v-model="textColor"
          @input="setTextColor"
          class="color-picker"
          title="文字颜色"
        />
        <!-- <i class="fas fa-palette"></i> -->
      </div>

      <!-- 背景颜色 -->
      <!-- <div class="toolbar-group color-picker-group">
        <input 
          type="color" 
          v-model="bgColor"
          @input="setBackgroundColor"
          class="color-picker"
          title="背景颜色"
        />
        <i class="fas fa-highlighter"></i>
      </div> -->

      <div class="toolbar-divider"></div>

      <!-- 插入链接 -->
      <button 
        @click="setLink" 
        :class="{ active: editor.isActive('link') }"
        class="toolbar-btn"
        title="插入链接"
      >
        <i class="fas fa-link"></i>
      </button>

      <!-- 上传图片 -->
      <button 
        @click="triggerImageUpload"
        class="toolbar-btn"
        title="上传图片"
      >
        <i class="fas fa-image"></i>
      </button>
      <input 
        type="file" 
        ref="imageInput"
        accept="image/*"
        @change="handleImageUpload"
        style="display: none"
      />

      <div class="toolbar-divider"></div>

      <!-- 清除格式 -->
      <button 
        @click="editor.chain().focus().unsetAllMarks().run()" 
        class="toolbar-btn"
        title="清除格式"
      >
        <i class="fas fa-eraser"></i>
      </button>
    </div>

    <!-- 编辑器内容区域 -->
    <div class="editor-content-wrapper" @click="focusEditor">
      <editor-content 
        :editor="editor" 
        class="editor-content"
      />
    </div>

    <!-- 链接输入弹窗 -->
    <div v-if="showLinkModal" class="link-modal-overlay" @click.self="closeLinkModal">
      <div class="link-modal">
        <h3><i class="fas fa-link"></i> 插入链接</h3>
        <div class="modal-input-group">
          <label>链接文字</label>
          <input 
            type="text" 
            v-model="linkText" 
            placeholder="请输入要显示的文字" 
            class="modal-input"
          />
        </div>
        <div class="modal-input-group">
          <label>链接地址</label>
          <input 
            type="url" 
            v-model="linkUrl" 
            placeholder="https://example.com" 
            class="modal-input"
          />
        </div>
        <div class="modal-actions">
          <button class="modal-btn cancel" @click="closeLinkModal">取消</button>
          <button class="modal-btn confirm" @click="confirmLink">确认</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onBeforeUnmount, watch } from 'vue';
import { useEditor, EditorContent } from '@tiptap/vue-3';
import { uploadImage, revokeImageUrl } from '@/config/request.js';
import StarterKit from '@tiptap/starter-kit';
import { TextStyle, FontSize, BackgroundColor } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import Underline from '@tiptap/extension-underline';
import Strike from '@tiptap/extension-strike';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import { FontFamily } from '@tiptap/extension-font-family';


const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: '请输入内容...'
  }
});

const emit = defineEmits(['update:modelValue']);



// 工具栏状态
const fontSize = ref('16px');
const fontFamily = ref('Microsoft YaHei');
const textColor = ref('#333333');
// const bgColor = ref('#ffffff');
const showLinkModal = ref(false);
const linkText = ref('');
const linkUrl = ref('');
const imageInput = ref(null);



// 创建编辑器
const editor = useEditor({
  content: props.modelValue,
  autofocus: true,  // 自动聚焦
  extensions: [
    StarterKit.configure({
      textAlign: false,
      history: false, // 禁用内置历史，用自定义处理
    }),
    TextStyle,
    Color,
    FontSize,
    BackgroundColor,
    Underline,
    Strike,
    Image.configure({
      inline: false,
      allowBase64: true,
      HTMLAttributes: {
        class: 'editor-image',
        style: 'max-width: 100% !important; width: 100% !important; height: auto !important; display: block !important; margin: 10px auto !important;',
      },
    }),
    Link.configure({
      openOnClick: false,
      HTMLAttributes: {
        class: 'editor-link',
      },
    }),
    TextAlign.configure({
      types: ['heading', 'paragraph'],
      defaultAlignment: 'left',
    }),
    FontFamily.configure({
      types: ['textStyle'],
    }),
  ],
  onUpdate: ({ editor }) => {
    emit('update:modelValue', editor.getHTML());
  },
  onSelectionUpdate: ({ editor }) => {
    // 同步当前光标处的文字颜色到工具栏
    const attrs = editor.getAttributes('textStyle');
    textColor.value = attrs.color || '#333333';
    
    // 同步当前光标处的字体大小到工具栏
    const fontSizeAttr = attrs.fontSize;
    if (fontSizeAttr) {
      fontSize.value = fontSizeAttr;
    } else {
      fontSize.value = '16px'; // 默认常规大小
    }
  },
  editorProps: {
    attributes: {
      class: 'editor-inner',
    },
  },
});

// 监听外部内容变化
watch(() => props.modelValue, (newVal) => {
  if (editor.value && newVal !== editor.value.getHTML()) {
    editor.value.commands.setContent(newVal);
  }
});

// 设置字号
const setFontSize = () => {
  editor.value?.chain().focus().setFontSize(fontSize.value).run();
};

// 让编辑器获得焦点
const focusEditor = () => {
  editor.value?.commands.focus();
};



// 设置字体
const setFontFamily = () => {
  editor.value?.chain().focus().setFontFamily(fontFamily.value).run();
};

// 设置文字颜色 - 仅对当前选中区域或光标处生效
const setTextColor = () => {
  editor.value?.chain().focus().setColor(textColor.value).run();
};

// 设置背景颜色
// const setBackgroundColor = () => {
//   if (bgColor.value === '#ffffff' || bgColor.value === '#fff') {
//     editor.value?.chain().focus().unsetBackgroundColor().run();
//   } else {
//     editor.value?.chain().focus().setBackgroundColor({ color: bgColor.value }).run();
//   }
// };

// 设置链接
const setLink = () => {
  const selection = editor.value?.state.selection;
  if (selection) {
    const { from, to } = selection;
    const text = editor.value?.state.doc.textBetween(from, to);
    linkText.value = text || '';
    linkUrl.value = '';
    showLinkModal.value = true;
  } else {
    showLinkModal.value = true;
  }
};

// 确认链接
const confirmLink = () => {
  if (linkUrl.value) {
    if (linkText.value) {
      editor.value?.chain().focus().insertContent(linkText.value).run();
    }
    editor.value?.chain().focus().setLink({ href: linkUrl.value }).run();
  }
  closeLinkModal();
};

// 关闭链接弹窗
const closeLinkModal = () => {
  showLinkModal.value = false;
  linkText.value = '';
  linkUrl.value = '';
};

// 触发图片上传
const triggerImageUpload = () => {
  imageInput.value?.click();
};

// 处理图片上传 - 使用 tools.js 的 uploadImage
const handleImageUpload = async (event) => {
  const file = event.target.files[0];
  if (file && file.type.startsWith('image/')) {
    try {
      // 上传图片
      const reply = await uploadImage(file, 'editor');
      
      if (reply) {
        console.log('🔗 获取到图片接口URL:', reply);
        
        // 插入图片到编辑器
        const imageHtml = `<img src="/flask${reply}" alt="uploaded" style="max-width:100% !important;width:100%;display:block;margin:10px auto;border:2px solid #b983ff;border-radius:6px;" /><p></p>`;
        
        if (editor.value) {
          editor.value.commands.focus();
          editor.value.commands.insertContent(imageHtml);
          
          const { state } = editor.value;
          const endPos = state.doc.content.size;
          editor.value.commands.setTextSelection(endPos);
          editor.value.commands.focus();
          
          console.log('✅ 图片已插入编辑器');
        }
      }
    } catch (error) {
      console.error('❌ 图片上传失败:', error);
      // uploadImage 内部已经有 alert 提示，这里不需要重复
    }
  }
  event.target.value = '';
};

// 存储编辑器内的图片 URL，用于组件卸载时释放
const editorImageUrls = ref([]);

// 组件卸载时销毁编辑器并释放所有图片 URL
onBeforeUnmount(() => {
  // 释放编辑器内的所有图片 URL
  editorImageUrls.value.forEach(url => {
    revokeImageUrl(url);
  });
  editorImageUrls.value = [];
  
  // 销毁编辑器
  editor.value?.destroy();
});
</script>

<style scoped>
.rich-text-editor {
  width: 100%;
  background: transparent;
  border-radius: 16px;
  overflow: hidden;
}

/* 工具栏样式 */
.editor-toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 4px;
  padding: 12px;
  background: linear-gradient(135deg, rgba(248, 232, 255, 0.9), rgba(255, 245, 251, 0.9));
  border-radius: 16px 16px 0 0;
  min-height: 50px;
}

.toolbar-group {
  display: flex;
  align-items: center;
  gap: 6px;
}

.toolbar-select {
  padding: 6px 10px;
  border: 1px solid rgba(185, 131, 255, 0.4);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.9);
  color: #7c4caf;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.toolbar-select:hover {
  border-color: #b983ff;
}

.toolbar-select:focus {
  outline: none;
  border-color: #b983ff;
  box-shadow: 0 0 0 3px rgba(185, 131, 255, 0.15);
}

.toolbar-divider {
  width: 1px;
  height: 28px;
  background: rgba(185, 131, 255, 0.3);
  margin: 0 8px;
}

.toolbar-btn {
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.7);
  color: #7c4caf;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  font-size: 1rem;
}

.toolbar-btn:hover {
  background: rgba(185, 131, 255, 0.2);
  color: #b983ff;
  transform: translateY(-2px);
}

.toolbar-btn.active {
  background: linear-gradient(135deg, #b983ff, #ff9cef);
  color: white;
  box-shadow: 0 2px 8px rgba(185, 131, 255, 0.4);
}

.color-picker-group {
  position: relative;
  display: flex;
  align-items: center;
}

.color-picker {
  width: 28px;
  height: 28px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  padding: 0;
  background: transparent;
}

.color-picker-group i {
  position: absolute;
  right: -20px;
  color: #7c4caf;
  font-size: 0.85rem;
  pointer-events: none;
}

/* 编辑器内容区域*/
.editor-content-wrapper {
  padding: 10px 25px;
  height: 800px;
  max-height: 75vh;
  overflow-y: auto;
  background: transparent;
  border: 1px solid rgba(230, 180, 255, 0.4);
  border-radius: 0 0 16px 16px;
}

.editor-inner {
  min-height: 280px;
  outline: none;
  color: #333;
  line-height: 1.8;
  background: transparent;
  border: none;
}

/* 光标颜色 - 需要覆盖 ProseMirror 内部 */
:deep(.ProseMirror) {
  caret-color: #b983ff !important;
  outline: none !important;
}

/* 选中文字样式 - 移除黑色背景 */
:deep(.ProseMirror)::selection,
:deep(.ProseMirror) ::selection {
  background: rgba(185, 131, 255, 0.35) !important;
  color: inherit !important;
}

/* Firefox 兼容 */
:deep(.ProseMirror)::-moz-selection {
  background: rgba(185, 131, 255, 0.35) !important;
}

.editor-inner p {
  margin: 0.5em 0;
}

/* 列表样式 */
:deep(.ProseMirror) ul,
:deep(.ProseMirror) ol {
  padding-left: 1.5rem;
  margin: 0.5em 0;
}

:deep(.ProseMirror) ul {
  list-style-type: disc;
}

:deep(.ProseMirror) ol {
  list-style-type: decimal;
}

:deep(.ProseMirror) li {
  margin: 0.25em 0;
  line-height: 1.8;
}

:deep(.ProseMirror) ul ul,
:deep(.ProseMirror) ol ol {
  margin: 0.25em 0;
}

/* 图片样式 */
:deep(.ProseMirror) img {
  max-width: 100%;
  width: 100%;
  height: auto;
  border-radius: 8px;
  margin: 10px auto;
  display: block;
}

.editor-inner img:hover {
  transform: scale(1.02);
  box-shadow: 0 6px 24px rgba(185, 131, 255, 0.35);
}

.editor-inner a.editor-link {
  color: #b983ff;
  text-decoration: underline;
  transition: color 0.3s ease;
}

.editor-inner a.editor-link:hover {
  color: #ff9cef;
}

/* 滚动条样式 */
.editor-content-wrapper::-webkit-scrollbar {
  width: 6px;
}

.editor-content-wrapper::-webkit-scrollbar-track {
  background: rgba(242, 217, 255, 0.5);
  border-radius: 8px;
}

.editor-content-wrapper::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #ca9eff, #ffa2de);
  border-radius: 8px;
}

.editor-content-wrapper::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(135deg, #b57cff, #ff85d0);
}

/* 链接弹窗 */
.link-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
}

.link-modal {
  background: linear-gradient(180deg, #fff5fb 0%, #f8e8ff 100%);
  border-radius: 16px;
  padding: 24px;
  width: 90%;
  max-width: 400px;
  border: 1px solid rgba(230, 180, 255, 0.4);
  box-shadow: 0 8px 32px rgba(185, 131, 255, 0.3);
}

.link-modal h3 {
  color: #7c3a9e;
  margin: 0 0 20px;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  gap: 8px;
}

.modal-input-group {
  margin-bottom: 16px;
}

.modal-input-group label {
  display: block;
  color: #7c4caf;
  font-size: 0.9rem;
  margin-bottom: 6px;
  font-weight: 600;
}

.modal-input {
  width: 100%;
  padding: 12px 14px;
  border: 2px solid rgba(230, 180, 255, 0.4);
  border-radius: 10px;
  font-size: 0.95rem;
  color: #333;
  background: rgba(255, 255, 255, 0.9);
  transition: all 0.3s ease;
  box-sizing: border-box;
}

.modal-input:focus {
  outline: none;
  border-color: #b983ff;
  box-shadow: 0 0 0 4px rgba(185, 131, 255, 0.15);
}

.modal-input::placeholder {
  color: #bbb;
}

.modal-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 20px;
}

.modal-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 6px;
}

.modal-btn.cancel {
  background: rgba(255, 255, 255, 0.8);
  color: #7c4caf;
  border: 1px solid rgba(185, 131, 255, 0.3);
}

.modal-btn.confirm {
  background: linear-gradient(135deg, #b983ff, #ff9cef);
  color: white;
  box-shadow: 0 4px 12px rgba(185, 131, 255, 0.4);
}

.modal-btn:hover {
  transform: translateY(-2px);
}

.modal-btn.cancel:hover {
  background: rgba(200, 160, 255, 0.2);
}

.modal-btn.confirm:hover {
  box-shadow: 0 6px 16px rgba(185, 131, 255, 0.5);
}
</style>
