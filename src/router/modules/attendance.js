import layout from '@/layout'
export default {
  path: '/attendance',
  component: layout,
  children: [{
    path: '',
    name: 'attendance',
    component: () => import('@/views/attendance'),
    meta: {
      title: 'Attendancs',
      icon: 'excel'
    }
  }]
}
