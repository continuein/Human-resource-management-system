import layout from '@/layout'
export default {
  path: '/approval',
  component: layout,
  children: [{
    path: '',
    name: 'approval',
    component: () => import('@/views/approval'),
    meta: {
      title: 'Approval',
      icon: 'tree-table'
    }
  }]
}
