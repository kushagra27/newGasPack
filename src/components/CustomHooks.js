import React, {useState} from 'react';

const useForm = (callback) => {
    const [inputs, setInputs] = useState({});

    const handleSubmit = (event) => {
        if (event) {
          event.preventDefault(); 
        }
        callback()
    }

    const handleInputChange = (event) => {
        event.persist();
        setInputs(inputs => ({...inputs, [event.target.name]: event.target.value}));
        // console.log(event.target.name, event.target.value)
    }

    const handleSelect = (event) => {
        // event.persist();
        setInputs(inputs => ({...inputs, [event]: event}));
        // console.log(event, inputs)
    }

    const setInitial = () => {
        // event.persist();
        setInputs({});
    }

    return {
        handleSubmit,
        handleInputChange,
        handleSelect,
        setInitial,
        inputs
    };
}
export default useForm;