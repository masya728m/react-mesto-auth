import React from 'react';
import PopupField from './PopupField';
import {Link} from 'react-router-dom';

export default function Login(props) {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
  }

  return (
    <div className="popup__container unauthorized-container">
      <form className="popup__form" name="popup__window" noValidate={true} onSubmit={handleSubmit}>
        <h2 className="popup__title popup__title_centered">Вход</h2>
        <fieldset className="popup__input-container unauthorized-container__fieldset">
          <PopupField
            additionalClass="unauthorized-container unauthorized-container__field"
            placeholderText="Email"
            fieldValue={email}
            onChange={(text) => setEmail(text)}
          />
          <PopupField
            additionalClass="unauthorized-container unauthorized-container__field"
            placeholderText="Пароль"
            fieldValue={password}
            onChange={(text) => setPassword(text)}
          />
        </fieldset>
        <button
          type="submit"
          className="popup__submit-button unauthorized-container__button"
        >
          Войти
        </button>
        <Link
          className="popup__submit-button"
          to="/register"
        >
          Уже зарегестрированы? Войти
        </Link>
      </form>
    </div>
  );
}