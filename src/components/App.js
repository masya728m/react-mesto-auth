import React from 'react';
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

function App() {
  const [isEditProfilePopupOpen, setEditProfilePopupOpen] = React.useState(false);
  const [isAddPlacePopupOpen, setAddPlacePopupOpen] = React.useState(false);
  const [isEditAvatarPopupOpen, setEditAvatarPopupOpen] = React.useState(false);
  const [isConfirmPopupOpen, setConfirmPopupOpen] = React.useState(false);
  const [isImagePopupOpen, setImagePopupOpen] = React.useState(false);
  const [targetCard, setTargetCard] = React.useState(null);
  const [cards, setCards] = React.useState([]);
  const [popupImageName, setPopupImageName] = React.useState('');
  const [popupImageLink, setPopupImageLink] = React.useState('');
  const [currentUser, setCurrentUser] = React.useState({});

  React.useEffect(() => {
    Promise.all([yandexApi.getUserInfo(), yandexApi.getInitialCards()])
      .then(([info, cardList]) => {
        setCurrentUser({
          avatar:    info.avatar,
          name:      info.name,
          about:     info.about,
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
    setEditProfilePopupOpen(false);
    setAddPlacePopupOpen(false);
    setEditAvatarPopupOpen(false);
    setConfirmPopupOpen(false);
    setImagePopupOpen(false);

  };

  const handleEditProfileClick = () => {
    setEditProfilePopupOpen(true);

  };

  const handleEditProfileSubmit = ({profileName, profileAbout}) => {
    yandexApi.setUserInfo({name: profileName, about: profileAbout})
      .then(() => {
        setCurrentUser({
          ...currentUser,
          name:  profileName,
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
    setAddPlacePopupOpen(true);

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
    setEditAvatarPopupOpen(true);

  };

  const handleCardClick = (card) => {
    setPopupImageName(card.name);
    setPopupImageLink(card.link);
    setImagePopupOpen(true);

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
    setConfirmPopupOpen(true);
    console.log(card);
    setTargetCard(card);
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
    <CurrentUserContext.Provider value={currentUser}>
      <div className="page">
        <EditProfilePopup
          isOpen={isEditProfilePopupOpen}
          onClose={closeAllPopups}
          onSubmit={handleEditProfileSubmit}
        />

        <AddPlacePopup
          isOpen={isAddPlacePopupOpen}
          onClose={closeAllPopups}
          onSubmit={handleAddPlaceSubmit}
        />

        <EditAvatarPopup
          isOpen={isEditAvatarPopupOpen}
          onClose={closeAllPopups}
          onSubmit={handleEditAvatarSubmit}
        />

        <ConfirmDialogPopup
          isOpen={isConfirmPopupOpen}
          onClose={closeAllPopups}
          onSubmit={handleDeleteConfirmSubmit}
        />
        <ImagePopup
          name="image-overview"
          opened={isImagePopupOpen}
          imageName={popupImageName}
          imageLink={popupImageLink}
          onClose={closeAllPopups}
        />

        <Header/>
        <Main
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
  );
}

export default App;
