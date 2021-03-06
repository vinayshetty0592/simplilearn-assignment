import React, { useState, useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';
import axios from 'axios';

import TextField from '../../../components/text-field';
import Button from '../../../components/button';
import Loader from '../../../components/loader';

import UserContext from '../../../contexts/user';

import { isEmpty, isValidEmailId, isValidMobileNumber } from '../../../utils/common';

const RegistrationForm = () => {
  const [form, setForm] = useState({
    name: '',
    nameError: '',
    email: '',
    emailError: '',
    mobileNumber: '',
    mobileNumberError: '',
    password: '',
    passwordError: ''
  });
  const [error, setError] = useState({
    title: '',
    messages: [],
  });
  const [isLoading, setIsLoading] = useState(false);

  const { user, setUser } = useContext(UserContext);

  const history = useHistory();

  const validateForm = () => {
    const errors = {
    };

    if (isEmpty(form.name)) {
      errors.nameError = 'Please enter Name';
    }

    if (!isValidEmailId(form.email)) {
      errors.emailError = 'Please enter valid Email';
    }

    if (isEmpty(form.mobileNumber)) {
      errors.mobileNumberError = 'Please enter Mobile Number';
    }

    if (!errors.mobileNumberError && !isValidMobileNumber(form.mobileNumber)) {
      errors.mobileNumberError = 'Please enter valid Mobile Number';
    }

    if (isEmpty(form.password)) {
      errors.passwordError = 'Please enter Password';
    }

    return isEmpty(errors) ? false : errors;
  };

  const resetErrors = () => {
    setForm({
      ...form,
      emailError: '',
      nameError: '',
      mobileNumberError: '',
      passwordError: ''
    });
  };

  const handleFormChange = (event) => {
    const { name: field, value } = event.target;
    setForm({ ...form, [field]: value });
  };

  const handleFormSubmit = async () => {
    try {
      const errors = validateForm();
      if (!errors) {
        resetErrors();
        setIsLoading(true);
        const response = await axios.post(`${process.env.REACT_APP_API_HOST}/api/register`, form, { withCredentials: true });
        const { success, data } = response.data;
        if (success) {
          setUser({
            ...user,
            isLoggedIn: true,
            data
          });
          setIsLoading(false);
          history.push('/profile');
        }
      } else {
        setIsLoading(false);
        setForm({
          ...form,
          ...errors
        });
      }
    } catch (error) {
      setIsLoading(false);
      const { data, message } = error.response.data;
      setError({
        title: message,
        messages: data.errors || []
      });
    }
  };

  return (
    <>
      {isLoading && <Loader title='Setting up account. Please wait...' />}
      <div className='box'>
        <h1 className='margin-0 text-center'>Register</h1>
        {
          (error.messages.length > 0 || error.title.length > 0) &&
          <div className='errors'>
            {error.title.length > 0 && <h4 className='margin-0 title'>{error.title}</h4>}
            {
              error.messages.length > 0 &&
              <ul className='margin-0'>
                {error.messages.map((message, index) => <li key={index}>{message}</li>)}
              </ul>
            }
          </div>
        }
        <form className='form'>
          <TextField
            name='name'
            type='text'
            value={form.name}
            placeholder='Enter Name'
            onChange={handleFormChange}
            error={form.nameError}
          />
          <TextField
            name='email'
            type='text'
            value={form.email}
            placeholder='Enter Email'
            onChange={handleFormChange}
            error={form.emailError}
          />
          <TextField
            name='mobileNumber'
            type='text'
            value={form.mobileNumber}
            placeholder='Enter Mobile Number'
            onChange={handleFormChange}
            error={form.mobileNumberError}
          />
          <TextField
            name='password'
            type='password'
            value={form.password}
            placeholder='Enter Password'
            onChange={handleFormChange}
            error={form.passwordError}
          />
          <Button className='btn-fw' type='button' onClick={handleFormSubmit}>Register</Button>
        </form>
        <div className='text-center'>
          <span>Already have an account? </span>
          <Link to='/login'>Login</Link>
        </div>
      </div>
    </>
  );
};

export default RegistrationForm;