import { createApp, defineComponent, h, ref } from 'vue';
import fc_update_password from './fc_update_password.vue';
const visible = ref<boolean>(false);
export function showUpdatePassword() {
  if (visible.value === false) {
    console.log('create app', visible.value);
    const component = defineComponent({
      render: () =>
        h(fc_update_password, {
          visible: visible.value,
          'onUpdate:visible': (val: boolean) => {
            visible.value = false;
          },
          onDestroy: () => {
            app.unmount();
            document.getElementById('fc_pwd_modal')?.remove();
            visible.value = false;
          },
        }),
    });
    // 生成app
    const app = createApp(component);
    // 挂载到真实dom上
    const div = document.createElement('div');
    div.id = 'fc_pwd_modal';
    app.mount(div);
    document.body.appendChild(div);
  }
  visible.value = true;
}
