
<template>
    <a-row>
        <a-col :xs="{ span: 24}" :sm="{ span: 12, offset: 6 }">
        <a-form
          name="basciLogin"
          :model="formState"
          layout="vertical"
          @finish="onFinish"
          @finishFailed="onFinishFailed"
          autocomplete="off">
             <a-form-item
                label="Ingresa tu email"
                name="email"
                :rules="[
                { required: true, type: 'email', message: 'Porfavor, Ingresa un email valido!' },
                ]"
                >
                <a-input v-model:value="formState.email" />
            </a-form-item>

             <a-form-item
                label="Ingrese contraseña"
                name="password"
                :rules="[{ required: true, whitespace: true, message: 'Ingresa una contraseña!' }]"
                >
                <a-input-password v-model:value="formState.password" autocomplete="off" />
                </a-form-item>

            <a-form-item>
                <a-button type="primary" html-type="submit" :loading="userStore.loadingUser">Acceso</a-button>
            </a-form-item>
        </a-form>
        </a-col>
    </a-row>
</template>

<script setup>
import { reactive } from 'vue';
import { useUserStore } from '../stores/user';
import { message } from 'ant-design-vue';

const userStore = useUserStore();

const formState = reactive({
  email: 'jose1@gmail.com',
  password: '123456',
});



const onFinish = async (values) => {
//   console.log('Success:', values);
    const resp = await userStore.loginUser(formState.email, formState.password);

    if(!resp){
        return
    }

    switch(resp){
        case 'auth/user-not-found':            
            message.error('No existe esa cuenta');
            break;
        case 'auth/wrong-password':           
            message.error('Error de contraseña.');
            break;
        default:
            message.error('Error en el servidor volver a internarlo nuevamente.');          
            break;
    }
};
const onFinishFailed = errorInfo => {
  console.log('Failed:', errorInfo);
};
</script>
