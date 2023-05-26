import { defineStore } from "pinia";
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut, sendEmailVerification, getAuth, updateProfile } from "firebase/auth";
import { auth, db, storage } from "../firebaseConfig";
import router from '../router';
import { useDatabaseStore } from './database';
import { doc, getDoc, setDoc } from "firebase/firestore/lite";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";


export const useUserStore = defineStore("user", {
    state: () => ({
        userData: null,
        loadingUser: false,
        loadingSession: false,
    }),
    actions: {

        async registerUser(email, password){
            this.loadingUser = true;
            try {
                await createUserWithEmailAndPassword(auth, email, password);
                // await sendEmailVerification(auth.currentUser);
                router.push('/login');
            } catch (error) {
                console.log(error);
                this.userData = {};
                return error.code;
            } finally {
                this.loadingUser = false;
            }

        },
        async updateUser(displayName, imagen){
            this.loadingUser = true;
            try {                
                await updateProfile(auth.currentUser, { displayName, });
                this.setUser(auth.currentUser);

                if (imagen) {
                    const storageRef = ref(storage, `${this.userData.uid}/perfil`);
                    await uploadBytes(storageRef, imagen.originFileObj);
                    const photoURL = await getDownloadURL(storageRef);
                    await updateProfile(auth.currentUser, { photoURL });
                    this.setUser(auth.currentUser);
                }

            } catch (error) {
                console.log(error);
                return error.code;
            } finally {
                this.loadingUser = false;
            }           
        },
        async setUser(user){

            try {
                const docRef = doc(db, 'users', user.uid);                    

                    this.userData = { 
                        email: user.email, 
                        uid: user.uid,
                        displayName: user.displayName,
                        photoURL:  user.photoURL
                    };

                    await setDoc(docRef, { ...this.userData });
                
            } catch (error) {
                console.log(error);
            }


        },
        async loginUser(email, password){
            this.loadingUser = true;
            try {
                const { user } = await signInWithEmailAndPassword(auth, email, password);
                await this.setUser(user);              
                router.push('/');
            } catch (error) {
                // console.log(error.code);
                return error.code;
            } finally {
                this.loadingUser = false;
            }

        },
        async logoutUser(){
            const databaseStore = useDatabaseStore();
            databaseStore.$reset();
            try {
                router.push('/login');
                await signOut(auth);
                this.userData = null;
            } catch (error) {
                console.log(error);
            } 

        },
        currentUser(){

            return new Promise( (resolve, reject) => {

                const unsuscribe = onAuthStateChanged(auth, async (user)=> {

                    // if(user && user.emailVerified){                        
                    if(user){            
                        console.log(user);            
                        // await this.setUser(user);
                         this.userData = { 
                            email: user.email, 
                            uid: user.uid,
                            displayName: user.displayName,
                            photoURL:  user.photoURL
                        };
                    }else {
                        this.userData = null;
                        const databaseStore = useDatabaseStore();
                        databaseStore.$reset();                        
                       
                    }
                    resolve(user);

                }, error => reject(error));

                unsuscribe();
            
            });

        }

    }
});
