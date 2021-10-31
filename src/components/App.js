import React from 'react';
import {Route, Switch, useHistory, withRouter} from 'react-router-dom';
import Header from './Header';
import Main from './Main';
import Footer from './Footer';
import '../pages/index.css';
import {yandexApi} from '../utils/Api';
import ImagePopup from './ImagePopup';
import {CurrentUserContext} from '../contexts/CurrentUserContext';
import {EditProfilePopup} from './EditProfilePopup';
import {EditAvatarPopup} from './EditAvatarPopup';
import {AddPlacePopup} from './AddPlacePopup';
import {ConfirmDialogPopup} from './ConfirmDialogPopup';
import ProtectedRoute from './ProtectedRoute';
import Login from './Login';

function App() {
  const [targetCard, setTargetCard] = React.useState(null);
  const [cards, setCards] = React.useState([]);
  const [popupImageName, setPopupImageName] = React.useState('');
  const [popupImageLink, setPopupImageLink] = React.useState('');
  const [currentUser, setCurrentUser] = React.useState({});

  const appHistory = useHistory();

  React.useEffect(() => {
    Promise.all([yandexApi.getUserInfo(), yandexApi.getInitialCards()])
      .then(([info, cardList]) => {
        setCurrentUser({
          avatar: info.avatar,
          name: info.name,
          about: info.about,
          profileId: info._id
        });
        cardList = Array.from(cardList).map(card => {
          const isLiked = Array.from(card.likes).some(like => like._id === info._id);
          return {
            ...card,
            isLiked
          };
        });
        setCards(cardList);
      })
      .catch(err => {
        console.log(err);
      });
  }, []);

  const closeAllPopups = () => {
    appHistory.push('/main');
  };

  const handleEditProfileClick = () => {
    appHistory.push('profile-edit');
  };

  const handleEditProfileSubmit = ({profileName, profileAbout}) => {
    yandexApi.setUserInfo({name: profileName, about: profileAbout})
      .then(() => {
        setCurrentUser({
          ...currentUser,
          name: profileName,
          about: profileAbout
        });
        closeAllPopups();
      })
      .catch(console.log);

  };

  const handleAddPlaceSubmit = ({placeName, placeImage}) => {
    yandexApi.addCard({name: placeName, link: placeImage})
      .then(card => {
        setCards([card, ...cards]);
        closeAllPopups();
      })
      .catch(console.log);

  };

  const handleAddPlaceClick = () => {
    appHistory.push('/add-place');
  };

  const handleEditAvatarSubmit = ({profileAvatar}) => {
    yandexApi.updateProfileImage(profileAvatar)
      .then(() => {
        setCurrentUser({
          ...currentUser,
          avatar: profileAvatar
        });
        closeAllPopups();
      })
      .catch(console.log);

  };

  const handleEditAvatarClick = () => {
    appHistory.push('/avatar-edit');
  };

  const handleCardClick = (card) => {
    setPopupImageName(card.name);
    setPopupImageLink(card.link);
    appHistory.push(`/cards/${card.name}`);
  };

  const handleCardLike = (card) => {
    const isLiked = !Array.from(card.likes).some(like => like._id === currentUser.profileId);
    yandexApi.changeLikeCardStatus(isLiked, card._id)
      .then(cardObj => {
        cardObj.isLiked = isLiked;
        const newCards = Array.from(cards).map(card => card._id === cardObj._id ? cardObj : card);
        setCards(newCards);
      })
      .catch(console.log);

  };

  const handleCardDelete = (card) => {
    setTargetCard(card);
    appHistory.push(`/delete/cards/${card}`);
  };

  const handleDeleteConfirmSubmit = () => {
    console.log(targetCard);
    yandexApi.deleteCard(targetCard._id)
      .then(() => {
        setCards(cards.filter(card => card._id !== targetCard._id));
        closeAllPopups();
      })
      .catch(console.log);

  };

  return (
    <Switch>
      <CurrentUserContext.Provider value={currentUser}>
        <div className="page">
          <Header
            buttonText="Выйти"
            onClick={() => {
            }}
            userEmail="masya728@gmail.com"
          />

          <Route path="/login">
            <Login/>
          </Route>

          <ProtectedRoute
            path="/profile-edit"
            component={EditProfilePopup}
            onClose={closeAllPopups}
            onSubmit={handleEditProfileSubmit}
          />

          <ProtectedRoute
            path="/add-place"
            component={AddPlacePopup}
            onClose={closeAllPopups}
            onSubmit={handleAddPlaceSubmit}
          />

          <ProtectedRoute
            path="/avatar-edit"
            component={EditAvatarPopup}
            onClose={closeAllPopups}
            onSubmit={handleEditAvatarSubmit}
          />

          <ProtectedRoute
            path={`/delete/cards/${targetCard}`}
            component={ConfirmDialogPopup}
            onClose={closeAllPopups}
            onSubmit={handleDeleteConfirmSubmit}
          />
          <ProtectedRoute
            path={`/cards/${popupImageName}`}
            component={ImagePopup}
            name="image-overview"
            imageName={popupImageName}
            imageLink={popupImageLink}
            onClose={closeAllPopups}
          />
          <ProtectedRoute
            path="/main"
            component={Main}
            cards={cards}
            onCardClick={handleCardClick}
            onCardLike={handleCardLike}
            onCardDelete={handleCardDelete}
            onEditProfile={handleEditProfileClick}
            onAddPlace={handleAddPlaceClick}
            onEditAvatar={handleEditAvatarClick}
          />
          <Footer/>
        </div>
      </CurrentUserContext.Provider>
    </Switch>
  );
}

export default withRouter(App);
