import React from 'react';
import { render } from 'react-dom';
import { FormProvider } from 'react-advanced-form';
import rules from './validation-rules';
import './index.css';
import messages from './validation-messages';
import RegistrationForm from './RegistrationForm';

const App = () => (
  <FormProvider rules={rules} messages={messages}>
    <RegistrationForm />
  </FormProvider>
);

render(<App />, document.getElementById('root'));
