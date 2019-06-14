// eslint-disable-next-line
import { UserLayout, BasicLayout, RouteView, BlankLayout, PageView } from '@/components/layouts'

export const asyncRouterMap = [

  {
    path: '/',
    name: 'index',
    component: BasicLayout,
    meta: { title: '首页' },
    redirect: '/dashboard/workplace',
    children: [
      // dashboard
      {
        path: '/dashboard',
        name: 'dashboard',
        hidden: true,
        redirect: '/dashboard/workplace',
        component: RouteView,
        meta: { title: '仪表盘', keepAlive: true, icon: 'dashboard' },
        children: [
          {
            path: '/dashboard/analysis',
            name: 'Analysis',
            component: () => import('@/views/dashboard/Analysis'),
            meta: { title: '分析页', keepAlive: false }
          },
          {
            path: '/dashboard/monitor',
            name: 'Monitor',
            hidden: true,
            component: () => import('@/views/dashboard/Monitor'),
            meta: { title: '监控页', keepAlive: true }
          },
          {
            path: '/dashboard/workplace',
            name: 'Workplace',
            component: () => import('@/views/dashboard/Workplace'),
            meta: { title: '工作台', keepAlive: true }
          },
          {
            path: '/dashboard/test',
            name: 'test',
            component: () => import('@/views/dashboard/test'),
            meta: { title: '测试页面', keepAlive: true }
          },
          {
            path: '/exception/Coming',
            name: 'Coming',
            component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/Coming'),
            meta: { title: 'Coming' }
          },
          {
            path: '/dashboard/multistage',
            name: 'multistage-router',
            component: RouteView,
            meta: { title: '多级', multistage: true },
            children: [
              {
                path: '/dashboard/multistage/index',
                name: 'mulindex',
                // hidden:true,
                component: () => import('@/views/dashboard/multistage'),
                meta: { title: '多级首页', index: true }
              },
              {
                path: '/dashboard/multistage/detaill/:id',
                name: 'muldetaill',
                hidden: true,
                component: () => import('@/views/dashboard/muldetaill'),
                meta: { title: '多级详情', detail: true }
              }
            ]
          }
        ]
      },

            // test
            {
                path: '/knowledgebase',
                name: 'knowledgebase',
                component: PageView,
                meta: { title: '知识库维护', keepAlive: false, icon: 'laptop' },
                children:[
                    {
                        path: '/knowledgebase/diagnosisMgt',
                        name: 'diagnosisMgt',
                        component: RouteView,
                        meta: { title: '诊断管理', multistage: true },
                        children: [
                            {
                                path: '/knowledgebase/diagnosisMgt/index',
                                name: 'diagnosisIndex',
                                component: () => import( '@/views/knowledgebase/diagnosisMgt/index.vue'),
                                meta: { title: '诊断管理', hiddenHeaderContent: true, index: true }
                            },
                            {
                                path: '/knowledgebase/diagnosisMgt/detail',
                                name: 'diagnosisMgtDetail',
                                hidden: true,
                                component: () => import( '@/views/knowledgebase/diagnosisMgt/detail.vue'),
                                meta: { title: '诊断详情', detail: true, description: '诊断自定义设置' }
                            },
                        ]
                    },
                    {
                      path: '/knowledgebase/indicatorsMgt',
                      name: 'indicatorsMgt',
                      component: RouteView,
                      meta: { title: '检验指标管理', multistage: true },
                      children: [
                          {
                              path: '/knowledgebase/indicatorsMgt/index',
                              name: 'indicatorsIndex',
                              component: () => import( '@/views/knowledgebase/indicatorsMgt/index.vue'),
                              meta: { title: '检验指标管理', hiddenHeaderContent: true, index: true }
                          },
                          {
                              path: '/knowledgebase/indicatorsMgt/detail',
                              name: 'indicatorsMgtDetail',
                              hidden: true,
                              component: () => import( '@/views/knowledgebase/indicatorsMgt/detail.vue'),
                              meta: { title: '检验指标详情', detail: true, description: '检验指标自定义设置' }
                          },
                      ]
                  },
                ]
            },
            {
                path: '/auditWorkstation',
                name: 'auditWorkstation',
                component: PageView,
                meta: { title: '审方工作站', keepAlive: false, icon: 'laptop' },
                children: [
                    {
                        path: '/auditWorkstation/problemLevel',
                        name: 'problemLevel',
                        component: RouteView,
                        meta: { title: '问题等级设置', multistage: true },
                        children: [
                            {
                                path: '/auditWorkstation/problemLevel/index',
                                name: 'problemLevelIndex',
                                component: () => import( '@/views/auditWorkstation/problemLevel/index.vue'),
                                meta: { title: '问题等级设置', hiddenHeaderContent: true, index: true }
                            },
                            {
                                path: '/auditWorkstation/problemLevel/detail',
                                name: 'problemLevelDetail',
                                hidden: true,
                                component: () => import( '@/views/auditWorkstation/problemLevel/detail.vue'),
                                meta: { title: '问题等级详情', detail: true, description: '问题等级自定义设置' }
                            }
                        ]
                    },
                    {
                        path: '/auditWorkstation/PrescriptionsSetting',
                        name: 'PrescriptionsSetting',
                        component: RouteView,
                        meta: { title: '审方方案设置', multistage: true },
                        children: [
                            {
                                path: '/auditWorkstation/PrescriptionsSetting/index',
                                name: 'PrescriptionsSettingIndex',
                                component: () => import( '@/views/auditWorkstation/PrescriptionsSetting/index.vue'),
                                meta: { title: '审方方案设置', hiddenHeaderContent: true, index: true }
                            },
                            {
                                path: '/auditWorkstation/PrescriptionsSetting/detail',
                                name: 'PrescriptionsDetail',
                                hidden: true,
                                component: () => import( '@/views/auditWorkstation/PrescriptionsSetting/detail.vue'),
                                meta: { title: '审方方案设置详情', detail: true, description: '审方设置方案描述' }
                            }
                        ]
                    },
                    {
                        path: '/auditWorkstation/presOutpatient',
                        name: 'presOutpatient',
                        component: RouteView,
                        meta: { title: '审方中心(门诊)', multistage: true },
                        children: [
                            {
                                path: '/auditWorkstation/presOutpatient/index',
                                name: 'presOutpatientIndex',
                                component: () => import( '@/views/auditWorkstation/presOutpatient/index.vue'),
                                meta: { title: '审方中心(门诊)', hiddenHeaderContent: true, index: true }
                            },
                            {
                                path: '/auditWorkstation/presOutpatient/detail',
                                name: 'presOutpatientDetail',
                                hidden: true,
                                component: () => import( '@/views/auditWorkstation/presOutpatient/detail.vue'),
                                meta: { title: '审方中心详情(门诊)', hiddenHeaderContent: true, detail: true }
                            }
                        ]
                    },
                    {
                        path: '/auditWorkstation/presHospitalized',
                        name: 'presHospitalized',
                        component: RouteView,
                        meta: { title: '审方中心(住院)', multistage: true },
                        children: [
                            {
                                path: '/auditWorkstation/presHospitalized/index',
                                name: 'presHospitalizedIndex',
                                component: () => import( '@/views/auditWorkstation/presHospitalized/index.vue'),
                                meta: { title: '审方中心(住院)', hiddenHeaderContent: true, index: true }
                            },
                            {
                                path: '/auditWorkstation/presHospitalized/detail',
                                name: 'presHospitalizedDetail',
                                hidden: true,
                                component: () => import( '@/views/auditWorkstation/presHospitalized/detail.vue'),
                                meta: { title: '审方中心详情(住院)', detail: true, description: '审方中心详情页设置' }
                            }
                        ]
                    }
                ]
            },
            {
                path: '/knowledgeMgt',
                name: 'knowledgeMgt',
                component: PageView,
                meta: { title: '规则管理', keepAlive: false, icon: 'diff' },
                children: [
                    {
                        path: '/knowledgeMgt/ruleMgt',
                        name: 'ruleMgt',
                        component: RouteView,
                        meta: { title: '规则管理', multistage: true },
                        children: [
                            {
                                path: '/knowledgeMgt/ruleMgt/index',
                                name: 'ruleIndex',
                                component: () => import( '@/views/knowledgeMgt/ruleMgt/index.vue'),
                                meta: { title: '规则管理', hiddenHeaderContent: true, index: true }
                            }
                        ]
                    },
                  
                   
                    {
                        path: '/knowledgeMgt/ruleMgt-copy',
                        name: 'ruleMgt-copy',
                        component: RouteView,
                        meta: { title: '规则管理副本', multistage: true },
                        children: [
                            {
                                path: '/knowledgeMgt/ruleMgt-copy/index',
                                name: 'ruleMgtCopyIndex',
                                component: () => import( '@/views/knowledgeMgt/ruleMgt-copy/index.vue'),
                                meta: { title: '规则管理副本', hiddenHeaderContent: true, index: true }
                            }
                        ]
                    },
                    {
                        path: '/knowledgeMgt/questionMgt',
                        name: 'questionMgt',
                        component: RouteView,
                        meta: { title: '问题分类管理', multistage: true },
                        children: [
                            {
                                path: '/knowledgeMgt/questionMgt/index',
                                name: 'questionIndex',
                                component: () => import( '@/views/knowledgeMgt/questionMgt/index.vue'),
                                meta: { title: '问题分类管理', hiddenHeaderContent: true, index: true }
                            },
                            {
                                path: '/knowledgeMgt/questionMgt/detail',
                                name: 'questionMgtDetail',
                                hidden: true,
                                component: () => import( '@/views/knowledgeMgt/questionMgt/detail.vue'),
                                meta: { title: '问题分类详情', detail: true, description: '问题分类自定义设置' }
                            },
                        ]
                    },
                ]
            },
            {
                path: '/baseData',
                name: 'baseData',
                component: PageView,
                meta: { title: '基础数据', keepAlive: false, icon: 'diff' },
                children: [
                    {
                        path: '/baseData/drugSpec',
                        name: 'DrugSpec',
                        component: RouteView,
                        meta: { title: '药品字典管理', multistage: true },
                        children: [
                            {
                                path: '/baseData/drugSpec/index',
                                name: 'drugSpecIndex',
                                component: () => import( '@/views/baseData/drugSpec/index.vue'),
                                meta: { title: '药品字典管理', hiddenHeaderContent: true, index: true }
                            },
                            {
                                path: '/baseData/drugSpec/detail/:drugCode/',
                                name: 'drugSpecDetail',
                                hidden: true,
                                component: () => import( '@/views/baseData/drugSpec/detail.vue'),
                                meta: { title: '药品说明书', hiddenHeaderContent: true, detail: true }
                            },
                          {
                            path: '/baseData/drugSpec/updateDetail/:drugCode/',
                            name: 'drugSpecUpdateDetail',
                            hidden: true,
                            component: () => import( '@/views/baseData/drugSpec/updateDetail.vue'),
                            meta: { title: '药品说明书详情', hiddenHeaderContent: false, detail: true, }
                          },
                        ]
                    },
                    {
                        path: '/baseData/dictionary',
                        name: 'dictionary',
                        component: RouteView,
                        meta: { title: '基础字典', multistage: true },
                        children: [
                            {
                                path: '/baseData/dictionary/index',
                                name: 'dictionaryIndex',
                                component: () => import( '@/views/baseData/dictionary/index.vue'),
                                meta: { title: '基础字典数据', hiddenHeaderContent: true, index: true }
                            },
                            {
                                path: '/baseData/dictionary/detailBaseClass/:code/',
                                name: 'detailBaseClass',
                                hidden: true,
                                component: () => import( '@/views/baseData/dictionary/detailBaseClass.vue'),
                                meta: { title: '分类详情',hiddenHeaderContent: true, detail: true,}
                            },
                        ]
                    },
                    {
                        path: '/baseData/drugAdministration',
                        name: 'drugAdministration',
                        component: RouteView,
                        meta: { title: '药品组管理', multistage: true },
                        children: [
                            {
                                path: '/baseData/drugAdministration/index',
                                name: 'drugAdminIndex',
                                component: () => import( '@/views/baseData/drugAdministration/index.vue'),
                                meta: { title: '药品组管理', hiddenHeaderContent: true, index: true }
                            }
                            // {
                            //   path: '/baseData/drugSpec/detail',
                            //   name: 'drugAdministration',
                            //   hidden: true,
                            //   component: () => import( '@/views/baseData/drugSpec/detail.vue'),
                            //   meta: { title: '药品说明书',hiddenHeaderContent: true, detail: true,}
                            // },
                        ]
                    }
                ]
            },

      // test
      {
        path: '/testPage',
        name: 'testPage',
        component: PageView,
        redirect: '/test/test',
        meta: { title: '测试', icon: 'check-circle-o', permission: ['result'] },
        children: [
          {
            path: '/test/test',
            name: 'test',
            component: () => import(/* webpackChunkName: "result" */ '@/views/test/test'),
            meta: { title: '测试页面', hiddenHeaderContent: true, permission: ['result'] }
          },
          {
            path: '/test/gridLayOut',
            name: 'gridLayOut',
            component: () => import(/* webpackChunkName: "result" */ '@/views/test/gridLayOut'),
            meta: { title: '拖拽测试', hiddenHeaderContent: true, permission: ['result'] }
          }, {
            path: '/test/combineTest',
            name: 'combineTest',
            component: () => import(/* webpackChunkName: "result" */ '@/views/test/combineTest'),
            meta: { title: '合并测试', permission: ['result'] }
          }, {
            path: '/test/combineTwo',
            name: 'combineTwo',
            component: () => import(/* webpackChunkName: "result" */ '@/views/test/combineTwo'),
            meta: { title: '合并测试2', permission: ['result'] }
          }, {
            path: '/test/combineThree',
            name: 'combineThree',
            component: () => import(/* webpackChunkName: "result" */ '@/views/test/combineThree'),
            meta: { title: '合并测试3', permission: ['result'] }
          }, {
            path: '/test/picCropper',
            name: 'picCropper',
            component: () => import(/* webpackChunkName: "result" */ '@/views/test/picCropper'),
            meta: { title: '图片剪裁', permission: ['result'] }
          }
        ]
      },
      {
        path: '/sys',
        name: 'sys',
        component: RouteView,
        redirect: '/sys/org',
        meta: { title: '系统设置', icon: 'check-circle-o', permission: ['result'] },
        children: [
          {
            path: '/sys/org',
            name: 'org_org_route',
            component: RouteView,
            meta: { title: '机构维护', keepAlive: false, multistage: true },
            children: [
              {
                path: '/sys/org/index',
                name: 'sys_org',
                component: () => import('@/views/sys/org/index.vue'),
                meta: { title: '机构维护', index: true }
              },
              {
                path: '/sys/org/detail',
                name: 'sys_org_detail',
                hidden: true,
                component: () => import('@/views/sys/org/detail.vue'),
                meta: { title: '机构详情', detail: true }
              }
            ]
          },
          {
            path: '/sys/org_dept',
            name: 'org_dept_route',
            component: RouteView,
            meta: { title: '科室维护', keepAlive: false, multistage: true },
            children: [
              {
                path: '/sys/org_dept/index',
                name: 'org_dept',
                component: () => import('@/views/sys/org_dept/org_dept.vue'),
                meta: { title: '科室维护', index: true }
              },
              {
                path: '/sys/org_dept/dept/:deptId/:orgId',
                name: 'deptDetail',
                hidden: true,
                component: () => import('@/views/sys/org_dept/dept.vue'),
                meta: { title: '部门详情', detail: true }
              }
            ]
          },
          {
            path: '/sys/org_user',
            name: 'org_user_route',
            component: RouteView,
            meta: { title: '人员维护', keepAlive: false, multistage: true },
            children: [
              {
                path: '/sys/org_user/index',
                name: 'org_user',
                component: () => import('@/views/sys/org_user/user.vue'),
                meta: { title: '人员维护', index: true }
              },
              {
                path: '/sys/org_user/user/:id/',
                name: 'userDetail',
                hidden: true,
                component: () => import('@/views/sys/org_user/userDetail.vue'),
                meta: { title: '人员详情', detail: true }
              }
            ]
          },
          {
            path: '/sys/userMgt',
            name: 'userMgt',
            component: () => import('@/views/sys/userMgt/userMgt.vue'),
            meta: { title: '用户管理', keepAlive: false }
          },
          {
            path: '/sys/roleMgt',
            name: 'roleMgt',
            component: () => import('@/views/sys/roleMgt/roleMgt.vue'),
            meta: { title: '角色管理', keepAlive: false }
          },
          {
            path: '/sys/roleFunc',
            name: 'roleFunc',
            component: () => import('@/views/sys/roleFunc/roleFunc.vue'),
            meta: { title: '权限管理', keepAlive: false }
          },
          {
            path: '/sys/log',
            name: 'log',
            component: () => import('@/views/sys/log/log.vue'),
            meta: { title: '日志管理', keepAlive: false }
          },
          {
            path: '/sys/param',
            name: 'param',
            component: () => import('@/views/sys/param/param.vue'),
            meta: { title: '参数管理', keepAlive: false }
          },
          {
            path: '/sys/modules',
            name: 'modules',
            component: () => import('@/views/sys/modules/modules.vue'),
            meta: { title: '模块管理', keepAlive: false }
          }
        ]
      }
    ]
  },
  {
    path: '*', redirect: '/404', hidden: true
  }
]

/**
 * 基础路由
 * @type { *[] }
 */
export const constantRouterMap = [
  {
    path: '/user',
    component: UserLayout,
    redirect: '/user/login',
    hidden: true,
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/Login')
      },
      {
        path: 'register',
        name: 'register',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/Register')
      },
      {
        path: 'register-result',
        name: 'registerResult',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/RegisterResult')
      },
      {
        path: 'lock',
        name: 'lock',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/LockScreen')
      }
    ]
  },

  {
    path: '/test',
    component: BlankLayout,
    redirect: '/test/home',
    children: [
      {
        path: 'home',
        name: 'TestHome',
        component: () => import('@/views/Home')
      }
    ]
  },

  {
    path: '/g6',
    component: BlankLayout,
    redirect: '/g6/flowChartEditor',
    children: [
      {
        path: 'flowChartEditor',
        name: 'flowChartEditor',
        component: () => import('@/views/flowChartEditor/flowChartEditor')
      }
    ]
  },
  {
    path: '/500',
    component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/500')
  },
  {
    path: '/403',
    component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/403')
  },
  {
    path: '/404',
    component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/404')
  }

]

