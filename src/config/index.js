import { createRouter, createWebHistory } from 'vue-router'
import HomeContent from '../components/content/HomeContent.vue'
import MoreContent from '../components/content/MoreContent.vue'
import DiscoverContent from '../components/content/DiscoverContent.vue'
import ProfileContent from '../components/content/ProfileContent.vue'
import NotificationContent from '../components/content/NotificationContent.vue'
import CreateArticle from '../components/content/CreateArticle.vue'
import CreateProject from '@/components/content/CreateProject.vue'
import DetailPage from '@/components/content/DetailPage.vue'

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
    component: NotificationContent
  },
  {
    path: '/discover',
    name: 'discover',
    component: DiscoverContent
  },
  {
    path: '/profile',
    name: 'profile',
    component: ProfileContent
  },
  {
    path: '/create-article',
    name: 'create-article',
    component: CreateArticle
  },
  {
    path: '/create-project',
    name: 'create-project',
    component: CreateProject
  },
  {
    path: '/detail/:id',
    name: 'detail',
    component: DetailPage,
    props: true
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    // 每次切换页面都滚动到顶部
    return { top: 0, behavior: 'smooth' };
  }
})

export default router;