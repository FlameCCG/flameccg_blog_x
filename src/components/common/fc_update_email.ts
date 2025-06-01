import { createApp, defineComponent, h, ref } from 'vue';
import fc_update_email from './fc_update_email.vue';
const visible = ref<boolean>(false);
export function showUpdateEmailModal() {
  if (visible.value === undefined) {
    console.log('create app', visible.value);
    const component = defineComponent({
      render: () =>
        h(fc_update_email, {
          visible: visible.value,
          'onUpdate:visible': () => {
            visible.value = false;
          },
          onDestroy: () => {
            app.unmount();
            document.getElementById('fc_update_email_modal')?.remove();
            visible.value = false;
          },
        }),
    });
    // 生成app
    const app = createApp(component);
    // 挂载到真实dom上
    const div = document.createElement('div');
    div.id = 'fc_update_email_modal';
    app.mount(div);
    document.body.appendChild(div);
  }
  visible.value = true;
}
