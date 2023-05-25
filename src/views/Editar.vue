<template>
    <h1>Editar id: {{ route.params.id }}</h1>
    <a-form
        name="editForm"
        :model="formState"
          layout="vertical"
          @finish="onFinish"         
          autocomplete="off"
        >

            <a-form-item
            name="url"
            label="Ingrese una URL"
            :rules="[{
                required: true,
                whitespace: true,
                pattern: patternURL,
                message: 'Ingrese una URL valida.'
            }]"          
            >
                <a-input v-model:value="formState.url"></a-input>
            </a-form-item>
            <a-form-item>
                <a-button
                    html-type="submit"
                    type="primary"
                    :loading="databaseStore.loading"
                    >Editar URL</a-button>
            </a-form-item>


    </a-form>
</template>

<script setup>
import { useRoute } from 'vue-router'; 
import { onMounted, reactive } from 'vue';
import { useDatabaseStore } from '../stores/database';
import { message } from 'ant-design-vue';

const formState = reactive({
            url: ''
    });

const patternURL = /^(https?:\/\/)?([\da-z\.-]+\.[a-z\.]{2,6}|[\d\.]+)([\/:?=&#]{1}[\da-z\.-]+)*[\/\?]?$/igm;
const route = useRoute();
const databaseStore = useDatabaseStore();


const onFinish = async(value) => {

        // console.log('todocorrecto:', value);
        const error = await databaseStore.updateUrl(route.params.id, formState.url);

        if(!error){
            formState.url = '';
            return message.success('Url Editada.');
        }

        switch(error){            
            default:
                message.error('Error en el servidor volver a internarlo nuevamente.');          
                break;
            }


    }

onMounted(async() => {

    formState.url = await databaseStore.leerUrls(route.params.id);
});
</script>

