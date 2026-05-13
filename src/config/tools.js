import { ref, computed } from 'vue';

// 解析 JWT 令牌(用于检查过期时间)
function parseToken(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
        return '%' +  ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return jsonPayload;
}

const TOKEN_KEY = 'auth_token';
export const setToken = (token) => localStorage.setItem(TOKEN_KEY, token);
export const removeToken = () => localStorage.removeItem(TOKEN_KEY);
export const getToken = () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return null;
    try {
        const jsonPayload = parseToken(token);
        // 过期时间检查
        if (jsonPayload.exp*1000 < Date.now()) {
            removeToken();
            return null;
        }
        return token;
    } catch (error) {
        return null;
    }
};

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