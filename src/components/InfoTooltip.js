import React from 'react';
import PopupBase from './PopupBase';
import FailIcon from '../images/fail.svg';
import SuccessIcon from '../images/success.svg';

export default class InfoTooltip extends PopupBase {
  render() {
    return (
      <div className={`popup popup_type_tooltip-dialog ${this.props.isOpen && 'popup_opened'}`}>
        <div className="popup__container">
          <form className="popup__form popup__form_type_tooltip-dialog">
            <button className="popup__exit-button" type="button" onClick={this.props.onClose}/>
            {
              this.props.success ? (
                <>
                  <img src={SuccessIcon}/>
                  <h2 className="popup__title popup__title_centered">
                    Вы успешно зарегистрировались!
                  </h2>
                </>
              ) : (
                <>
                  <img src={FailIcon}/>
                  <h2 className="popup__title popup__title_centered">
                    Что-то пошло не так!
                    Попробуйте ещё раз.
                  </h2>
                </>
              )
            }
          </form>
        </div>
      </div>
    );
  }
}