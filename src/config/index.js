import { createRouter, createWebHistory } from 'vue-router'
import HomeContent from '../components/content/HomeContent.vue'
import MoreContent from '../components/content/MoreContent.vue'
import DiscoverContent from '../components/content/DiscoverContent.vue'
import ProfileContent from '../components/content/ProfileContent.vue'
import NotificationContent from '../components/content/NotificationContent.vue'
import CreateArticle from '../components/content/CreateArticle.vue'
import CreateProject from '@/components/content/CreateProject.vue'
import DetailPage from '@/components/content/DetailPage.vue'
import { getToken, removeToken } from '@/config/tools'
import { useUserStore } from '../store/userStore'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeContent
  },
  {
    path: '/more',
    name: 'more',
    component: MoreContent
  },
  {
    path: '/notification',
    name: 'notification',
    component: NotificationContent,
    meta: { requiresAuth: true }
  },
  {
    path: '/discover',
    name: 'discover',
    component: DiscoverContent
  },
  {
    path: '/profile',
    name: 'profile',
    component: ProfileContent,
    meta: { requiresAuth: true }
  },
  {
    path: '/create-article',
    name: 'create-article',
    component: CreateArticle,
    meta: { requiresAuth: true }
  },
  {
    path: '/create-project',
    name: 'create-project',
    component: CreateProject,
    meta: { requiresAuth: true }
  },
  {
    path: '/detail/:id',
    name: 'detail',
    component: DetailPage,
    props: true
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../components/content/LoginContent.vue')
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('../components/content/RegisterContent.vue')
  },
  {
    path: '/my-articles',
    name: 'my-articles',
    component: () => import('../components/tools/MyFiles.vue'),
    props: { type: 'articles' },
    meta: { requiresAuth: true }
  },
  {
    path: '/my-projects',
    name: 'my-projects',
    component: () => import('../components/tools/MyFiles.vue'),
    props: { type: 'projects' },
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return { top: 0, behavior: 'smooth' };
  }
})

// 路由守卫，检查登录状态
router.beforeEach(async (to, from, next) => {
  const token = getToken();
  const userStore = useUserStore();
  // 需要验证登录的路由
  if (to.meta.requiresAuth) {
    // 检查 token 是否存在
    if (!token || token === null) {
      const confirmLogin = confirm('尚未登录，是否前往登录？');
      if(confirmLogin){
        return router.push('/login' );
      } else {
        return next(false);
      }
    } else {
      // token 存在，检查用户信息是否存在状态管理
      if (userStore.token && (userStore.userInfo === null || !userStore.userInfo)) {
        try {
          // 获取用户信息
          await userStore.fetchUserInfo();
        } catch (error) {
          console.error("获取用户信息失败:", error.message);
        }
        // 经过获取登录状态失效(或获取失败异常)
        if (!userStore.isLoggedIn) {
          removeToken();
          const confirmLogin = confirm('登录过期，请重新登录。');
          if(confirmLogin){
            return router.push('/login' );
          } else {
            return next(false);
          }
        }
      } 
    }
  } 
  // 不需要验证登录的路由
  return next();
})

export default router;