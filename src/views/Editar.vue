<template>
    <div>
        <h1>Editar id: {{ route.params.id }}</h1>
        <p v-if="databaseStore.loadingDoc">Loading doc...</p>
        <form @submit.prevent="handleSubmit" v-else>
            <input type="text" placeholder="Ingrese URL" v-model="url">
            <button type="submit">Editar</button>
        </form>
    </div>
</template>

<script setup>
import { useRoute } from 'vue-router'; 
import { onMounted, ref } from 'vue';
import { useDatabaseStore } from '../stores/database';

const url = ref('');

const route = useRoute();
const databaseStore = useDatabaseStore();


const handleSubmit = () => {

    databaseStore.updateUrl(route.params.id, url.value);

}

onMounted(async() => {

    url.value = await databaseStore.leerUrls(route.params.id);
});
</script>

