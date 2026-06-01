<template>
  <!-- 智能体悬浮球 -->
    <div
      class="floating-ball agent-ball"
      :class="{ 'ball-active': showAgentCard }"
      @click="toggleAgentCard"
    >
      <i class="fas fa-robot ball-icon"></i>
    </div>

    <!-- 智能体聊天卡片区域 -->
    <transition name="fade-scale">
      <div v-if="showAgentCard" class="action-card agent-card">
        <div class="agent-root">
          <!-- 头部 -->
          <div class="card-header">
            <span class="card-title"><i class="fas fa-robot"></i> 智能助手</span>
            <button class="close-btn" @click="showAgentCard = false">
              <i class="fas fa-times"></i>
            </button>
          </div>

          <!-- 消息列表 -->
          <div class="chat-messages" ref="messagesContainer">
            <div
              v-for="(msg, index) in messages"
              :key="index"
              :class="['message', msg.role]"
            >
              <i :class="msg.role === 'assistant' ? 'fas fa-robot' : 'fas fa-user'"></i>
              <div v-if="msg.role === 'assistant'" class="bubble" v-html="renderHTML(msg.content)"></div>
              <div v-else class="bubble">{{ msg.content }}</div>
            </div>

            <!-- 加载指示器（思考中） -->
            <div v-if="isThinking" class="message agent">
              <i class="fas fa-robot"></i>
              <div class="bubble thinking">
                正在输入<span class="dots"></span>
              </div>
            </div>
          </div>

          <!-- 分割线 -->
          <div class="options-divider"></div>

          <!-- 输入区域 -->
          <div class="chat-input">
            <input
              type="text"
              placeholder="输入消息..."
              v-model="newMessage"
              @keyup.enter="sendMessage"
              :disabled="isThinking"
            />
            <button @click="sendMessage" :disabled="isThinking">
              <i class="fas fa-paper-plane"></i>
            </button>
          </div>

          <!-- 分割线 -->
          <!--<div class="options-divider"></div>-->

          <!-- 选项栏 -->
          <div class="chat-options">
            <button
              v-for="option in options"
              :key="option.value"
              class="option-btn"
              :class="{ active: selectedOption === option.value }"
              @click="selectOption(option.value)"
            >
              <i :class="option.icon"></i>
              {{ option.label }}
            </button>
          </div>

          <!-- 小三角（指向悬浮球） -->
          <div class="card-arrow agent-arrow"></div>
        </div>
      </div>
    </transition>
</template>

<script setup>
import axios from 'axios';
import { ref, nextTick, watch } from 'vue';
import { marked } from 'marked';
import DOMPurify from 'dompurify';

marked.setOptions({
  breaks: true,
  gfm: true
});

const showAgentCard = ref(false);

// 定义组件事件
const emit = defineEmits(['AgentStatus']);

// 消息列表（初始示例对话）
const messages = ref([
  { role: 'assistant', content: '你好！我是智能体小紫，请问有什么可以帮到您？' }
]);

const newMessage = ref('');
const isThinking = ref(false);
const messagesContainer = ref(null);

// 选项定义
const options = [
  { label: '通用对话', value: 'general', icon: 'fas fa-comments' },
  { label: 'AI 搜索', value: 'search', icon: 'fas fa-search' }
];
const selectedOption = ref('general');

// 切换智能体卡片
const toggleAgentCard = () => {
  showAgentCard.value = !showAgentCard.value;
};

// 选择选项
const selectOption = (value) => {
  selectedOption.value = value;
};

// 渲染 Markdown 内容为安全的 HTML
const renderHTML = (content) => {
  if (!content) return '';
  let html = marked.parse(content);
  
  // 过滤逻辑：ol、ul 标签删除，li 标签转为 p 标签，并添加中心点
  html = html.replace(/<\/?ol[^>]*>/gi, '');
  html = html.replace(/<\/?ul[^>]*>/gi, '');
  html = html.replace(/<li[^>]*>/gi, '<p>• ');
  html = html.replace(/<\/li>/gi, '</p>');
  
  // 标题过滤逻辑：h1→h5, h2/h3/h4→h6
  html = html.replace(/<h1([^>]*)>/gi, '<p><i>');
  html = html.replace(/<\/h1>/gi, '</i></p>');
  html = html.replace(/<h2([^>]*)>/gi, '<p><i>');
  html = html.replace(/<\/h2>/gi, '</i></p>');
  html = html.replace(/<h3([^>]*)>/gi, '<p><i>');
  html = html.replace(/<\/h3>/gi, '</i></p>');
  html = html.replace(/<h4([^>]*)>/gi, '<p><i>');
  html = html.replace(/<\/h4>/gi, '</i></p>');
  
  return DOMPurify.sanitize(html);
};

// 发送消息
const sendMessage = async () => {
  const text = newMessage.value.trim();
  if (!text || isThinking.value) return;

  messages.value.push({ role: 'user', content: text });
  newMessage.value = '';
  scrollToBottom();

  isThinking.value = true;
  scrollToBottom();

  const commit = {
    'text' : text,
    'type' : selectedOption.value
  }

  try{
    const response = await axios.post('/flask/agent/message', commit, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 60000 // 60 秒超时
    });
    if (response.data === undefined || response.data === '' || response.data === null) {
      throw new Error('后端返回了空响应');
    }
    const reply = response.data; 
    console.log('后端返回:', reply);
    messages.value.push({ role: 'assistant', content: reply });
    isThinking.value = false;
    scrollToBottom();
  } catch (error) {
    console.error('消息发送失败:', error.message);
    if (error.response?.status) {
      if (error.response.status === 500) {
        console.error('后端返回的错误信息:', error.response.data.message || '未知错误');
      } else {
        console.error(`错误信息: HTTP ${error.response.status} ${error.response.statusText}`);
      }
    }
    messages.value.push({ role: 'assistant', content: '抱歉，消息发送失败，请稍后再试。' });
    isThinking.value = false;
  }
};

const scrollToBottom = async () => {
  await nextTick();
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
  }
};

watch(messages, scrollToBottom, { deep: true });

defineExpose({
  showAgentCard,
  toggleAgentCard
});
</script>

<style scoped>

.agent-root {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
}

.thinking .dots::after {
  display: inline-block;
  content: '...';
  animation: ellipsis 1.5s steps(4, end) infinite;
  width: 1.5em;
  text-align: left;
}

@keyframes ellipsis {
  0% { content: ''; }
  25% { content: '.'; }
  50% { content: '..'; }
  75% { content: '...'; }
  100% { content: ''; }
}

.chat-input input:disabled,
.chat-input button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.chat-messages::-webkit-scrollbar {
  width: 8px;
}
.chat-messages::-webkit-scrollbar-track {
  background: #f2d9ff;
  border-radius: 8px;
}
.chat-messages::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #ca9eff, #ffa2de);
  border-radius: 8px;
  border: 2px solid #f7d0ff;
}
.chat-messages::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(135deg, #b57cff, #ff85d0);
}

.options-divider {
  height: 1px;
  background: linear-gradient(90deg, transparent, #e0b0ff, #ffb3e6, transparent);
  margin: 8px 16px 4px;
}

.chat-options {
  display: flex;
  justify-content: space-around;
  padding: 8px 16px 12px;
  gap: 8px;
}

.option-btn {
  background: transparent;
  border: none;
  padding: 6px 12px;
  font-size: 0.9rem;
  font-weight: 500;
  color: #7a5a9c;
  border-radius: 30px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  border: 1px solid transparent;
  flex: 1;
  justify-content: center;
  white-space: nowrap;
}

.option-btn i {
  font-size: 0.9rem;
  color: #b87cd9;
}

.option-btn:hover {
  background: rgba(220, 180, 255, 0.2);
  color: #9b4bcf;
}

.option-btn.active {
  background: linear-gradient(135deg, #c49bff, #ffb3e6);
  color: white;
  box-shadow: 0 2px 8px rgba(180, 90, 230, 0.3);
  border-color: rgba(255, 255, 255, 0.2);
}

.option-btn.active i {
  color: white;
}

.message {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  max-width: 100%;
}

.message i {
  font-size: 1.2rem;
  color: #b87cd9;
  flex-shrink: 0;
  margin-top: 2px;
}

.message.user i {
  color: #7a5a9c;
}

.bubble {
  background: #f5f0ff;
  border-radius: 12px;
  padding: 10px 14px;
  max-width: 100%;
  word-wrap: break-word;
  word-break: break-word;
  overflow-wrap: break-word;
  line-height: 1.5;
  font-size: 0.95rem;
  color: #333;
  display: inline-block;
  vertical-align: top;
}

.message.user .bubble {
  background: linear-gradient(135deg, #c49bff, #ffb3e6);
  color: white;
}

@media (max-width: 600px) {
  .chat-options {
    flex-wrap: wrap;
  }
  .option-btn {
    font-size: 0.8rem;
    padding: 4px 8px;
  }
}
</style>
