// 引入 pinia 模块
import { createPinia } from 'pinia'
// 注册定义的插件
// import { persistedstate } from './plugins/persistedstate'
// 创建pinia并返回pinia实例
const pinia = createPinia();
// pinia.use(persistedstate)
export default pinia; 