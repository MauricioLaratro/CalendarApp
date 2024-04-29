import { addHours, differenceInSeconds } from 'date-fns';
import { useMemo, useState } from 'react';
import Modal from 'react-modal';
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { es } from 'date-fns/locale/es';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css'
import { useCalendarStore, useUiStore } from '../../hooks';
import { useEffect } from 'react';


registerLocale('es', es)


const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
    },
};

Modal.setAppElement('#root');

export const CalendarModal = () => {

    const { isDateModalOpen, closeDateModal } = useUiStore()

    const { activeEvent } = useCalendarStore()

    const [formSubmitted, setFormSubmitted] = useState(false)


    const [formValues, setFormValues] = useState({
        title: '',
        notes: '',
        start: new Date(),
        end: addHours( new Date(), 2 )
    })

    // Utilizamos useMemo para memorizar el valor del titulo y el estado de submited, para cambiar la clase del input a is-invalid, en el caso de que el titulo que se quiere enviar este vacio, pero solo en ese caso y utilizamos useMemo, paro no cambiar la clase cuando se borra todo el input simplemente, si no cuando se intenta hacer el onSubmit
    const titleClass = useMemo(() => {
        // Si el estado de forSubmitted es falso, quiere decir que no se ha intenta realizar el submit por lo tanto retornamos un string vacio para la clase del input
        if ( !formSubmitted ) return ''
        
        // En el caso de que se salte la validación anterior quiere decir que se intento hacer el submit, por lo tanto validamos ahora si el length del title es mayor a 0, seguimos regresando un string vacio, pero si es igual a 0. regresaremos la clase is-invalid
        return ( formValues.title.length > 0 )
            ? ''
            : 'is-invalid'
    }, [ formValues.title, formSubmitted ])

    useEffect(() => {

        if (activeEvent !== null) {
            setFormValues({ ...activeEvent })
        }
      
    }, [activeEvent])
    

    const onInputChanged = ({ target }) => {
        setFormValues({
            ...formValues,
            [target.name]: target.value
        })
    }

    const onDateChanged = ( event, changing ) => {
        setFormValues({
            ...formValues,
            [changing]: event
        })
    }

    const onCloseModal = () => {
        closeDateModal()
    }

    const minEndTime = new Date(formValues.start);
    minEndTime.setHours(minEndTime.getHours() + 1); // Minimo 1 hora posterior a la hora de start

    const maxEndTime = new Date(formValues.start);
    maxEndTime.setHours(23); // Maximo requerido al utilizar minTime

    // Verificar si la fecha de inicio y la fecha de finalización son el mismo día
    const isSameDay =
        formValues.end &&
        formValues.start.getDate() === formValues.end.getDate() &&
        formValues.start.getMonth() === formValues.end.getMonth() &&
        formValues.start.getFullYear() === formValues.end.getFullYear();

    const onSubmit = ( event ) => {
        event.preventDefault()
        setFormSubmitted(true)

        const difference = differenceInSeconds( formValues.end, formValues.start )
        if ( isNaN( difference ) || difference <= 0 ) {
            Swal.fire({
                title:'Revisar las fechas ingresadas',
                text: 'Fechas incorrectas',
                icon:'error',
                timer: '3000',
                timerProgressBar: true,
            })
            return
        }

        if ( formValues.title.length <= 0 ) return

        console.log(formValues)

    }

  return (
    <Modal
        isOpen={ isDateModalOpen }
        onRequestClose={ onCloseModal }
        style={ customStyles }
        className='modal'
        overlayClassName='modal-fondo'
        closeTimeoutMS={ 200 }
    >
        <h1> Nuevo evento </h1>
        <hr />
        <form className="container" onSubmit={ onSubmit }>

            <div className="form-group mb-2">
                <label>Fecha y hora inicio</label>
                <DatePicker
                    selected={ formValues.start }
                    onChange={ (event) => onDateChanged(event, 'start') }
                    className='form-control'
                    dateFormat='dd/MM/yyyy h:mm aa'
                    showTimeSelect
                    locale="es"
                    timeCaption='Hora'
                />
            </div>

            <div className="form-group mb-2">
                <label>Fecha y hora fin</label>
                <DatePicker
                    minDate={ formValues.start }
                    minTime={isSameDay ? minEndTime : null} // Aplicar restricción solo si es el mismo día
                    maxTime={isSameDay ? maxEndTime : null} // Aplicar restricción solo si es el mismo día
                    selected={ formValues.end }
                    onChange={ (event) => onDateChanged(event, 'end') }
                    className='form-control'
                    dateFormat='dd/MM/yyyy h:mm aa'
                    showTimeSelect
                    locale="es"
                    timeCaption='Hora'
                />
            </div>

            <hr />
            <div className="form-group mb-2">
                <label>Titulo y notas</label>
                <input 
                    type="text" 
                    className={`form-control ${ titleClass }`}
                    placeholder="Título del evento"
                    name="title"
                    autoComplete="off"
                    value={ formValues.title }
                    onChange={ onInputChanged }
                />
                <small id="emailHelp" className="form-text text-muted">Una descripción corta</small>
            </div>

            <div className="form-group mb-2">
                <textarea 
                    type="text" 
                    className="form-control"
                    placeholder="Notas"
                    rows="5"
                    name="notes"
                    value={ formValues.notes }
                    onChange={ onInputChanged }
                ></textarea>
                <small id="emailHelp" className="form-text text-muted">Información adicional</small>
            </div>

            <button
                type="submit"
                className="btn btn-outline-primary btn-block"
            >
                <i className="far fa-save"></i>
                <span> Guardar</span>
            </button>

        </form>
    </Modal>
  )
}
