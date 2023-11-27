import layout from '@/layout'
export default {
  path: '/social',
  component: layout,
  children: [{
    path: '',
    name: 'social',
    component: () => import('@/views/social'),
    meta: {
      title: 'Social',
      icon: 'table'
    }
  }]
}
