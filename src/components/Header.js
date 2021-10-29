import React from 'react';
import logo from '../images/logo.svg';
import '../pages/index.css';

export default function Header() {
  return (
    <header className="header">
      <img className="header__logo" src={logo} alt="logo"/>
    </header>
  );
}