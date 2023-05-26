<template>
   <h2>Perfil de usuario</h2>
<div class="text-center mb-10">
    <a-avatar :src="userStore.userData.photoURL" :size="150" />
</div>
 <a-row>
        <a-col :xs="{ span: 24}" :sm="{ span: 12, offset: 6 }">
        <a-form
          name="basciPerfil"
          :model="userStore.userData"
          layout="vertical"
          @finish="onFinish"          
          autocomplete="off">
             <a-form-item
                label="Tu email (No modificable)"
                name="email"
                :rules="[
                { required: true, type: 'email', message: 'Porfavor, Ingresa un email valido!' },
                ]"
                >
                <a-input v-model:value="userStore.userData.email" disabled />
            </a-form-item>
             <a-form-item
                label="Ingrese su nickname"
                name="displayName"
                :rules="[
                { required: true, whitespace: true, message: 'Porfavor, Ingresa un nickname valido!' },
                ]"
                >
                <a-input v-model:value="userStore.userData.displayName" />
            </a-form-item>
            
            <a-form-item>
            <a-upload 
                v-model:file-list="fileList"
                list-type="picture"
                :max-count="1"
                :before-upload="beforeUpload"
                @change="handleChange"
            >
                <a-button>
                    <upload-outlined></upload-outlined>
                    Subir foto perfil
                </a-button>
            </a-upload>
            </a-form-item>
            <a-form-item>
                <a-button type="primary" html-type="submit" :loading="userStore.loadingUser">Actualizar informacion</a-button>
            </a-form-item>
        </a-form>
        </a-col>
    </a-row>
</template>

<script setup>
import { useUserStore } from '../stores/user';
import { message } from 'ant-design-vue';
import { ref } from 'vue';
import { UploadOutlined } from '@ant-design/icons-vue';
import { getStorage } from "firebase/storage";


const userStore = useUserStore();
const fileList = ref([]);

const beforeUpload = ( ) => false; 
const handleChange = (info) => {

 const isJpgOrPng = info.file.type === 'image/jpeg' || info.file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('Sólo puede cargar archivos JPG o PNG!');
  }
  const isLt2M = info.file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('La imagen debe pesar menos de 2 MB!');
  }

  if (info.file.status === 'error') {    
    message.error('error al subir la foto de perfil.');
  }

  if (!isJpgOrPng || !isLt2M || info.file.status === 'error'){
    fileList.value = [];
  }
};

const onFinish = async () => {
    let error = await userStore.updateUser(userStore.userData.displayName);

     if(fileList.value[0]){
        error = await userStore.updateUser(userStore.userData.displayName, fileList.value[0]);
     }

    if(!error){
        fileList.value = [];
        return message.success('Se actualizo tu informacion de eperfil.');
    }
    message.error('Ocurrio un error al actualizar el perfil.');
  
};

</script>
 <style scoped>

.mb-10 {

    margin-bottom: 10px;

}

</style>