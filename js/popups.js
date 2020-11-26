'use strict';

const popupLinks = document.querySelectorAll('.popup-link');
const body = document.querySelector('body');
const lockPadding = document.querySelectorAll('.lock-padding'); // для эл. с фиксир. позицией(fixed); чтобы при появлении окна контент не сдвиг-я, ему, как и body, задаём padding-right: шир. скролла

let unlock = true; // чтобы не было двойных нажатий

const timeout = 800; // как и в css transition: 0.8s, для блокировки скролла

if (popupLinks.length > 0) {
	for (let i = 0; i < popupLinks.length; i++) {
		const popupLink = popupLinks[i];
		popupLink.addEventListener('click', function (e) {
			const popupName = popupLink.getAttribute('href').replace('#', ''); // получаю чистое имя без #(id)
			const curentPopup = document.getElementById(popupName); // получаю эл. по id
			popupOpen(curentPopup); // открытие  popup
			e.preventDefault(); // запрет перезагрузки стр. т.к. это ссылка
		});
	}
}

const popupCloseIcon = document.querySelectorAll('.close-popup'); // получ. наши "крестики"
if (popupCloseIcon.length > 0) {
	for (let i = 0; i < popupCloseIcon.length; i++) {
		const el = popupCloseIcon[i];
		el.addEventListener('click', function (e) {
			popupClose(el.closest('.popup')); // закрытие окна, т.е. родителя, это popup
			e.preventDefault();
		});
	}
}

/* Открытие окна по id */
function popupOpen(curentPopup) {
	if (curentPopup && unlock) { // если существ. и unlock=true
		const popupActive = document.querySelector('.popup.open'); // получ. объект с этим классами
		if (popupActive) {
			popupClose(popupActive, false); // закрыв. окно если эл. существует
		} else {
			bodyLock(); // блокировка скролла
		}
		curentPopup.classList.add('open'); // добавл. класс, открыв. окно
		curentPopup.addEventListener('click', function(e) {
			if (!e.target.closest('.popup__content')) { // если при нажатии на объект нет родителя
				popupClose(e.target.closest('.popup')); // закрыв. окно, объект с кл. popup
			}
		});
	}
}

/* Закрытие окна */
function popupClose (popupActive, doUnlock = true) {
	if (unlock) {
		popupActive.classList.remove('open'); // удал. класс open
		if (doUnlock) {
			bodyUnlock(); // разблокирова скролла
		}
	}
}

/* Блокируем скролл  */
function bodyLock() {
	//ширина скролла = разница шир. вьюпорта - шир. объекта внутри него
	const lockPaddingValue = window.innerWidth - document.querySelector('.wrapper').offsetWidth + 'px';

	for (let i = 0; i < lockPadding.length; i++) {// кажд. эл. с фикс. позицией(см. начало) задаём отступ
		const el = lockPadding[i];
		el.style.paddingRight = lockPaddingValue; // отступ = шир. скролла
	}
	body.style.paddingRight = lockPaddingValue; // присваиваем body padding-right: шир. скролла, чтобы не сдвиг. контент и не было 2-го скролла
	body.classList.add('lock');

	unlock = false;
	setTimeout(function() {
		unlock = true;
	}, timeout);
}
