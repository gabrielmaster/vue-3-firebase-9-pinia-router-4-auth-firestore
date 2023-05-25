<script setup>
import { reactive } from 'vue';
import { useDatabaseStore } from '../stores/database';
import { message } from 'ant-design-vue';

    const databaseStore = useDatabaseStore();

    const formState = reactive({
            url: ''
    });

    const patternURL = /^(https?:\/\/)?([\da-z\.-]+\.[a-z\.]{2,6}|[\d\.]+)([\/:?=&#]{1}[\da-z\.-]+)*[\/\?]?$/igm;

    const onFinish = async(value) => {

        // console.log('todocorrecto:', value);
        const error = await databaseStore.addUrls(formState.url);

        if(!error){
            formState.url = '';
            return message.success('Url Agregada.');
        }

        switch(error){            
            default:
                message.error('Error en el servidor volver a internarlo nuevamente.');          
                break;
            }


    }

</script>

<template>
    <a-form
        name="addForm"
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
                    >Agregar URL</a-button>
            </a-form-item>


    </a-form>
</template>

