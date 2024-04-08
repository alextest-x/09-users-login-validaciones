import { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";


//3. poniendo el value en el initialUserForm
//para pasarlos a useState useState(initialUserForm);

 //lo pasamos al UsersApp y pasamos como props initialUserForm
 //const initialUserForm = {
 //   username: '',
 //   password: '',
 //   email: '',

//}

//export const UserForm = ({ userSelected, handlerAddUser, initialUserForm, handlerCloseForm }) => {
export const UserForm = ({ userSelected, handlerCloseForm }) => {

                                                                         
  //ponemos el errors para poner losmensajes de error que viene en el UserProvider y userUsers
  const {initialUserForm, handlerAddUser, errors} = useContext(UserContext);

    //2. useState();
    const [userForm, setUserForm] = useState(initialUserForm);


    //4. desestructurando para pasarlos al formulario con el value={}
    const {id, username, password, email } = userForm;

    //userSelected lo pasa como un nuevo objeto
    useEffect( () => {
        setUserForm({ 
          ...userSelected,
            password: '',    //limpia el password
        });
     }, [userSelected]);



    //1 poniendo onInputChange
    //guardar los datos en el estado de react
      const onInputChange = ({ target }) => {

        //console.log(target.value);

        //desestruturando el target
        const { name, value } = target;

        //5. guardar en el estado con el operador spred
        setUserForm({
                ...userForm, 
                //actualizando el atributo del campo del formulario
                //name, password, o email.
                /*
                donde este se llama propiedad computada del objeto que es 
                variable segun el campo o input del formulario
                */
                [name]: value,
            })

      }


      

      const onSubmit = (event) => {
          //preventDefault() no actualiza la pagina cuando refresca 
          event.preventDefault();
          //valida que no vayan campos vacios despues del submit 
          //if(!username || !password || !email){
          
          //entonces validamos el password al actualizar
          //cuando no hay password y si hay id que es igual a cero => actualiza
         

    /* 
        // inicio comentamos esta validacion porque la valida des del backend    
            if(!username || (!password && id === 0)  || !email){
              Swal.fire(
                'Error de validacion',
                'Debe completar los campos del formulario',
                'error'
              );
            
            return;
        }
	
         //guardamos el objeto {username password email}
         //el userForm guarda el estado del formulario
         //valida si el email no incluye el @ muetsra el error
        if (!email.includes('@')) {
            Swal.fire(
                'Error de validacion email',
                'El email debe ser valido, incluir un @!',
                'error'
            );
            return;
        }

       //fin comentamos esta validacion porque la valida des del backend
    */


        // console.log(userForm);

          //se envia al componente padre
          // guardar el user form en el listado de usuarios
          handlerAddUser(userForm);
          //guarda el user form en el listado de usuarios
          //limpia el formulario al hacer el submit
          //setUserForm(initialUserForm);

          //lo comentamos para que no inicialize los valores en el formulario
          //porque lo mensajes de errror los maneja backend
          //setUserForm(initialUserForm);
          //alert('Datos enviados')

      }




      const onCloseForm = () => {
        handlerCloseForm();
        setUserForm(initialUserForm);
      }

    return (
      
      
          <form onSubmit = { onSubmit } >

            <input
              className="form-control my-3 w-80" 
              placeholder = "Username"
              name= "username" 
              value={ username }
              onChange={onInputChange} />
              <p className="text-danger">{errors?.username}</p>

             { id > 0 || <input
              className="form-control my-3 w-80" 
              placeholder = "Password"
              type="password"
              name= "password" 
              value={ password }
              onChange={onInputChange} />}
              <p className="text-danger">{errors?.password}</p>
             

            <input
              className="form-control my-3 w-80" 
              placeholder = "Email"
              name= "email"
              value={ email }             
              onChange={onInputChange} />
              <p className="text-danger">{errors?.email}</p>

            <input type="hidden"
              name="id"
              value={id} />
            
            <button 
                className="btn btn-primary"
                type="submit">
                { id > 0? 'Editar' : 'Crear'} 
            </button>

           

            {!handlerCloseForm || <button 
                className="btn btn-primary mx-2"
                type="button" 
                onClick={() => onCloseForm()}>
                Cerrar
              </button>}
          
        </form>
      
    )
}