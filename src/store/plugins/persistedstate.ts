import { PiniaPluginContext } from 'pinia';
export function persistedstate(context: PiniaPluginContext) {
    // 根据模块名，拿到对应的 localStorage
    const currentState = JSON.parse(localStorage.getItem(context.store.$id) || "{}")
    // 把我们的数据放在pinia对应的模块里面
    context.store.$patch(currentState)
    context.store.$subscribe((_store, state) => {
        // 存到 localStorage里面
        localStorage.setItem(_store.storeId,JSON.stringify(state))
    }, {
        // 组件卸载依赖还在
        detached: true
    })
}