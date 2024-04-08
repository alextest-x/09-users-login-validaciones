import axios from "axios";


const BASE_URL = 'http://localhost:8080/users';

export const findAll = async () => {

    try {
        const response = await axios.get(BASE_URL);
        return response;

    } catch (error) {
       console.error(error);

    }

    return null;

}

export const save = async ({ username, email, password }) => {

    try {
        return await axios.post(BASE_URL, 
            {
            username, 
            email, 
            password,
            }); 
        }catch (error) {
          //console.error(error);
          throw error;
          
    }
      
       //return undefined;
}


export const update = async( {id, username, email} ) => {
    try {
        //pasamo el id y el objeto { username, email} en el segundo argumento
        return await axios.put(`${BASE_URL}/${id}`, {
            username,
             email,

             /*
             //se pone password porque para que no haya error en la actualizacion 
             //porque nos pide poner el password pero este solo lo valida en backend
             //en el controlador al actualizar al usuario pero el que hace la logica es el 
             //userServiceImpljava ahi no validad el password
             //y no viaja desde front para que no se vea 
             //solo ponemos en password un valor que no dice nada
             */
            
             //lo comentamos porque lo validamos en el backend de otra forma
             //password: 'nothing',
            });
        
    } catch (error) {
        //console.error(error);
        throw error;
    }

}


export const remove = async (id) => {
    try {
        await axios.delete(`${BASE_URL}/${id}`);
    } catch (error) {
        console.error(error);
        
    }

}