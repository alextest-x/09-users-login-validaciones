import { useReducer, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { usersReducer } from "../reducers/usersReducer";
//import { findAll, remove, save, update } from "../services/UserService";
import { findAll, remove, save, update } from "../services/userService";

  /*
    //se comenta porque se pone el axios para la conexion 
    //con el backend y dejamos vacio el arreglo 
    const initialUsers = [
       {
            id: 1,
            username: 'pepe',
            password: '1234',
            email: 'pepe@correo.com'
        },
    ];
  */     
      
    const initialUsers = [];
    
    const initialUserForm = {
        id: 0,
        username: '',
        password: '',
        email: '',
    }


    // validando los errorres lo pasamos al 
    // [errors, setErrors] = useState//({initialErrors});

    const initialErrors = {
      username: '',
      password: '',
      email: '',
  }
        

export const useUsers = () => {


    //users nueva constante donde modifica la lista de usuarios
    //y ponemos el users en  /*users={initialUsers}*/ 
    const [users, dispatch] = useReducer(usersReducer, initialUsers);

    //selecionar un usuario
    const [userSelected, setUserSelected] = useState(initialUserForm);

    //maneja el cambio de estado del boton visble formulario
    const [visibleForm, setVisibleForm] = useState(false);


    
    //capturamos los errrores y se lo ponemos en setErrors 
    // para que los gurade en el estado
    //como tenemos la variable errors hay que ponerla hasta abajo 
    //en return donde estan las otras variables
    const [errors, setErrors] = useState(initialErrors);


    const navigate = useNavigate();
   

    //funcion para el backend que viene del service
    //le ponemos el async y el await 
    //y la agregamos en el return getUsers

    //el await es para recibir la respuesta convertirla a json para actualizar el estado en react
    const getUsers = async () => {
        //findAll() viene del service para la conexion con el backend
        
        const result = await findAll();
       
        console.log(result);

        //lo guardamos en el estado
        dispatch({
          type: 'loadingUsers',
          payload: result.data,
        });
    }


    //el await es para recibir la respuesta convertirla a json para actualizar el estado en react
    //simpre que lleva await debe llevar el async en la funcion 
    // y para actualizarlo se requiere el id
    const handlerAddUser =async (user) => {
      let  response;

      try {
          
             if ( user.id === 0 ) {
               response = await save(user); 
             } else {
               response = await update(user);
             }


        //user es igual a cero agrega sino actualiza
        //let type; (user=== 0) ? 'addUser' : 'updateUser';
        /*
        let type; 
        if(user.id === 0) {
          type = 'addUser';
        } else {
            type = 'updateUser';
        }
        */

        //console.log(user);
             //enviando los cambios 
        dispatch({
            //type: 'addUser',
            //type: type, se simplifica porque tiene el mismos nombre que el atributo
            type: (user.id === 0) ? 'addUser' : 'updateUser',
            //comentamos porque ahora el payload trae el user actualizado
            //payload: user,
            
            //aqui en el response.data trae el user actualizado
            payload: response.data,
        });
        Swal.fire(
            (user.id === 0 ) ? 
            'Usuario Registrado' :
            'Usuario Actualizado',
            (user.id === 0 ) ? 
            'El usuario ha sido creado con exito!' :
            'El usuario ha sido actualizado con exito!',
            'success'
          );
          
            handlerCloseForm();
            navigate('/users');

      } catch (error) {
         //console.error(error)
         if (error.response && error.response.status == 400) {
            console.log(error.response.data);
            //con setError lo asignamos al estado useState
            setErrors(error.response.data);
             // con else cualquier otro error lanza de nuevo el error con  throw error;
             // hay que pasar los mensajes de error al formulario
         } 
         // valida los campos personalizado de username, email
         //valida busca por el constrain del campo usernam y email
         else if (error.response && error.response.status == 500 && 
                     error.response.data?.message?.includes('constrain')) {
                     
                   if(error.response.data?.message?.includes('UK_username')) {
                        setErrors({username: 'El username ya existe!'})
                      }

                    if(error.response.data?.message?.includes('UK_email')) {
                       setErrors({email: 'El email ya existe!'})
                    }
                    
            } else {
            
            throw error;
         }
       
        }
      
   }
  
            
          //hace visible le formulario
          //setVisibleForm(false);
          //reseta el formulario a valores iniciales de initialUserForm()
          //setUserSelected(initialUserForm);
   // }


    //el await aqui no es necesario porque no espera recibir solo elimina 
    //con el id 
    const handlerRemoveUser = (id) =>{
        //console.log(id)
        //dispatch llama la action del reducer 
        //pasamos el objeto por parametro con el type 
        //dispatch({  lo pasamos en el mensaje sweetalert line 82
        //    type: 'removeUser',
        //    payload: id,
        //});

        Swal.fire({
            title: "Estas seguro?",
            text: "Cuiadado el usuario sera eliminado!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Eliminar!"
          }).then((result) => {
            if (result.isConfirmed) {
               remove(id);
               dispatch({
                    type: 'removeUser',
                    payload: id,
                }); 

              Swal.fire({
                title: "Usuario eliminado!",
                text: "El Usuario ha sido eliminado con exito!.",
                icon: "success"
            });
            }
          });

    }

    const handlerUserSelectedForm = (user) => {

      //hace vible el formulario
      setVisibleForm(true);
      
        // console.log(user)
        //pasando los datos con ...user un clon 
        //se crea una nueva instancia queda inmutable
        setUserSelected({ ...user });
    }

    const handlerOpenForm = () =>{
          setVisibleForm(true);

    }

    const handlerCloseForm = () => {
          setVisibleForm(false);
          setUserSelected(initialUserForm);

          //limpia los mensajes de error al cerrar la venatana
          setErrors({});

    }


     //regresa un objeto que tiene valores o atributos
      return {

        //atributos o propiedades
        users,
        userSelected,
        initialUserForm,
        visibleForm,
        errors,  //hay que pasar el errors al UserProvider
        //funciones que pasamos 
        handlerAddUser,
        handlerRemoveUser,
        handlerUserSelectedForm,
        handlerOpenForm,
        handlerCloseForm,
        getUsers,
      }

    }
