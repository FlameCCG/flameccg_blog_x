import { createApp, defineComponent, h, ref } from 'vue';
import fc_login_modal from '../common/fc_login_modal.vue';
const visible = ref<boolean | undefined>(undefined);
export function showLogin() {
  if (visible.value === undefined) {
    console.log('create app', visible.value);
    const component = defineComponent({
      render: () =>
        h(fc_login_modal, {
          visible: visible.value,
          'onUpdate:visible': (val: boolean) => {
            console.log(val);
            visible.value = false;
          },
          onDestroy: () => {
            app.unmount();
            document.getElementById('fc_login_modal')?.remove();
            visible.value = false;
          },
        }),
    });
    // 生成app
    const app = createApp(component);
    // 挂载到真实dom上
    const div = document.createElement('div');
    div.id = 'fc_login_modal';
    app.mount(div);
    document.body.appendChild(div);
  }
  visible.value = true;
}
