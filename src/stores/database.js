import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, query, updateDoc, where } from 'firebase/firestore/lite';
import { defineStore } from 'pinia';
import { db, auth } from '../firebaseConfig';
import { nanoid } from 'nanoid'
import router from '../router';

export const useDatabaseStore = defineStore("database", {

    state: () => ({
        document: [],
        loadingDoc: false,
    }),
    actions: {

        async getUrls(){

            if(this.document.length !== 0 ){
                return;
            }

            this.loadingDoc = true;
            try {
                const q = query(
                    collection(db,"urls"), 
                    where("user","==", auth.currentUser.uid)
                );
                const querySnapshot = await getDocs(q);
                querySnapshot.forEach( doc => {
                    this.document.push({
                        id: doc.id,
                        ...doc.data()
                    });
                })
                
            } catch (error) {
                console.log(error);
            } finally {
                this.loadingDoc = false;
            }

        },
        async addUrls(name){

            try {
                const objectoDoc = {
                        name: name,
                        short: nanoid(6),
                        user: auth.currentUser.uid
                };
                const docRef = await addDoc(collection(db,'urls'), objectoDoc);
                this.document.push({ id: docRef.id, ...objectoDoc });
            } catch (error) {
                console.log(error);
            } finally {

            }

        },
        async leerUrls(id){
            this.loadingDoc = true;
            try {
                const docRef = doc(db, 'urls', id);
                const docSnap = await getDoc(docRef);

                if(!docSnap.exists()){
                    throw new Error('No existe el doc');            
                }

                if(docSnap.data().user !== auth.currentUser.uid){
                    throw new Error('No eres el autor');            
                }

                return docSnap.data().name;
            } catch (error) {
                console.log(error.message);
            } finally {
                this.loadingDoc = false;
            }       


        },
        async updateUrl(id, name){
         this.loadingDoc = true;
         try {
            const docRef = doc(db, 'urls', id);
            const docSnap = await getDoc(docRef);

            if(!docSnap.exists()){
                throw new Error('No existe el doc');            
            }

            if(docSnap.data().user !== auth.currentUser.uid){
                throw new Error('No eres el autor');            
            }
            await updateDoc(docRef, {
                name
            });

            this.document = this.document.map( item => item.id === id ? ({...item, name: name }) : item);
            router.push('/');
         } catch (error) {
            console.log(error.message);
         } finally {
            this.loadingDoc = false;
         }
        
        },
        async deleteUrl(id){

            try {
                const docRef = doc(db, 'urls', id);
                const docSnap = await getDoc(docRef);

                if(!docSnap.exists()){
                    throw new Error('No existe el doc');            
                }

                if(docSnap.data().user === auth.currentUser.uid){
                    await deleteDoc(docRef);
                    this.document = this.document.filter( item => item.id !== id);
                } else {
                    throw new Error('No eres el autor');
                }  
            } catch (error) {
                console.log(error);
            } finally {

            }

        }

    }

});