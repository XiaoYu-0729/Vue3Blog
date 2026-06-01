import { createRouter, createWebHistory } from 'vue-router'
import HomeContent from '../components/content/HomeContent.vue'
import MoreContent from '../components/content/MoreContent.vue'
import DiscoverContent from '../components/content/DiscoverContent.vue'
import ProfileContent from '../components/content/ProfileContent.vue'
import NotificationContent from '../components/content/NotificationContent.vue'
import CreateArticle from '../components/content/CreateArticle.vue'
import CreateProject from '@/components/content/CreateProject.vue'
import DetailPage from '@/components/content/DetailPage.vue'
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
    props: { type: 'article' },
    meta: { requiresAuth: true }
  },
  {
    path: '/my-projects',
    name: 'my-projects',
    component: () => import('../components/tools/MyFiles.vue'),
    props: { type: 'project' },
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

/** 路由守卫，检查登录状态
 * 由于设置了httponly，前端无法直接访问cookie中的token，
 * 需要调用API让后端检查token是否有效
 */
router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore();
  if (to.meta.requiresAuth) {
    if (userStore.isLoggedIn) {
      next();
    } else {
      await userStore.fetchUserInfo();
      if (userStore.isLoggedIn) {
        next();
      } else {
        const confirmLogin = confirm('尚未登录，是否前往登录？');
        if (confirmLogin) {
          next('/login');
          return;
        }
        next(false);
      }
  }
  } else {
    next();
  }
})

export default router;