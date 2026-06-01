import { ref, computed } from 'vue';

// 检测是否为移动端/小屏幕
export const isMobile = ref(false);
export const currentRouteName = ref('');

// 设置路由名称（需要在 App.vue 中调用）
export const setRouteName = (name) => {
    currentRouteName.value = name;
};

// 检测是否为移动端/小屏幕
export const checkMobile = () => {
    isMobile.value = window.innerWidth < 768;
};

// 判断是否为创建页面（创建文章或创建项目或文章详情页）
export const isPage = computed(() => {
    return currentRouteName.value === 'create-article' || currentRouteName.value === 'create-project' || currentRouteName.value === 'my-articles';
});

// 洗牌算法
export const shuffleArray = (arr) => {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr
}