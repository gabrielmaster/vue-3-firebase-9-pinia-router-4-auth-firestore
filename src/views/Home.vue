<template>
    <div>
        <h1>Home</h1>
        <p>{{ userStore.userData?.email }}</p>



        <add-form></add-form>

        <p v-if="databaseStore.loadingDoc">Loading Docs...</p>

        <a-space direction="vertical" style="width: 100%">   
            <a-card
                v-for="item of databaseStore.document" 
                :key="item.id"
                :title="item.short"               
            >   
            <template #extra>
            <a-space>
                <a-popconfirm
                    title="¿Estas seguro que deseas eliminar?"
                    ok-text="Si"
                    cancel-text="No"
                    @confirm="confirm(item.id)"
                    @cancel="cancel"
                >
                    <a-button danger @click="handleDelete(item.id)" :loading="databaseStore.loading">Eliminar</a-button>
                </a-popconfirm>
                <a-button type="primary" @click="router.push(`/editar/${ item.id }`)">Editar</a-button>
            </a-space>
            </template>
                <p>{{ item.name }}</p>
            </a-card>
        </a-space>
      
    </div>
</template>

<script setup>
import { useUserStore } from '../stores/user';
import { useDatabaseStore } from '../stores/database';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { message } from 'ant-design-vue';

const confirm = async (id) => {
  const error = await databaseStore.deleteUrl(id);
  if(!error) return message.success('Se elimino con exito.');
  return message.error(error);
};

const cancel = (e) => {
  message.error('No se elimino.');
};


const userStore = useUserStore();
const databaseStore = useDatabaseStore();
const router = useRouter();

databaseStore.getUrls();

const url = ref('');

const handleSubmit = () => {

    if(!url.value || url.value.length == 0 ){
        return;
    }
    databaseStore.addUrls(url.value);

}

const handleDelete = (id) =>{

    // databaseStore.deleteUrl(id);

}

</script>
