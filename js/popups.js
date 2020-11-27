'use strict';

const popupLinks = document.querySelectorAll('.popup-link');
const body = document.querySelector('body');
const lockPadding = document.querySelectorAll('.lock-padding'); // для эл. с фиксир. позицией(fixed); чтобы при появлении окна контент не сдвиг-я, ему, как и body, задаём padding-right: шир. скролла

let unlock = true; // чтобы не было двойных нажатий и 2-х скроллов

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
			popupClose(popupActive, false); // закрыв. окно если эл. существует, стр. не прокручи-я, т.к. 1 окно закрыва-я, 2-е открывается
		} else {
			bodyLock(); // блокировка скролла
		}
		curentPopup.classList.add('open'); // добавл. класс, открыв. окно
		curentPopup.addEventListener('click', function (e) {
			if (!e.target.closest('.popup__content')) { // если при нажатии на объект нет родителя
				popupClose(e.target.closest('.popup')); // закрыв. окно, объект с кл. popup
			}
		});
	}
}


/* Закрытие окна. Код изменён для IE */

function popupClose(popupActive, doUnlock) {
	if (doUnlock !== false) { // если не false запуск. bodyUnlock
		doUnlock = true;
	}
	if (unlock) {
		popupActive.classList.remove('open'); // удал. класс open
		if (doUnlock) { // если false при открытии 2-го popup запрет разблокировки скролла
			bodyUnlock(); // разблокирова скролла, стр. прокручивается
		}
	}
}

/* Для соврем. браузеров */
// function popupClose(popupActive, doUnlock = true) {
// 	if (unlock) {
// 		popupActive.classList.remove('open'); // удал. класс open
// 		if (doUnlock) { // если false при открытии 2-го popup запрет разблокировки скролла
// 			bodyUnlock(); // разблокирова скролла, стр. прокручивается
// 		}
// 	}
// }


/* Блокируем скролл  */
function bodyLock() {
	//ширина скролла = разница шир. вьюпорта - шир. объекта внутри него
	const lockPaddingValue = window.innerWidth - document.querySelector('.wrapper').offsetWidth + 'px';

	if (lockPadding.length > 0) { // если объекты есть

		for (let i = 0; i < lockPadding.length; i++) { // кажд. эл. с фикс. позицией(см. начало) задаём отступ
			const el = lockPadding[i];
			el.style.paddingRight = lockPaddingValue; // отступ = шир. скролла
		}
	}
	body.style.paddingRight = lockPaddingValue; // присваиваем body padding-right: шир. скролла, чтобы не сдвиг. контент и не было 2-го скролла
	body.classList.add('lock'); // убираем скролл в большинстве браузеров

	unlock = false; // можем открыть наш popup снова только через 800ms, иначе если сразу true, то появл. скролл
	setTimeout(function () {
		unlock = true;
	}, timeout);
}

/* Разблокировка скролла */
function bodyUnlock() {

	setTimeout(function () { // скролл появляется только после закрытия popup(конец анимации)800ms, иначе окно дёргается

		if (lockPadding.length > 0) {
			for (let i = 0; i < lockPadding.length; i++) {
				const el = lockPadding[i];
				el.style.paddingRight = '0px'; // убираем отступ = шир. скролла
			}
		}
		body.style.paddingRight = '0px'; // присваиваем body padding-right: 0
		body.classList.remove('lock');

	}, timeout);

	unlock = false;
	setTimeout(function () {
		unlock = true;
	}, timeout);

}

document.addEventListener('keydown', function (e) { // закрытие по нажатию на esc

	if (e.code === 'Escape' || e.key === 'Esc' || e.key === 'Escape') { // key для IE 11 and Edge
		e.preventDefault();
		const popupActive = document.querySelector('.popup.open');
		if (popupActive) {
			popupClose(popupActive);
		}
	}
});


/* Полифилы IE 11, релизация работы closest and matches */
(function () {
	// Проверяем поддержку
	if (!Element.prototype.closest) {
		//Реализуем
		Element.prototype.closest = function (css) {
			var node = this;
			while (node) {
				if (node.matches(css)) return node;
				else node = node.parentElement;
			}
			return null;
		};
	}
})();

(function () {
	// Проверяем поддержку
	if (!Element.prototype.matches) {
		// определяем свойство
		Element.prototype.matches = Element.prototype.matchesSelector ||
			Element.prototype.webkitMatchesSelector ||
			Element.prototype.mozMatchesSelector ||
			Element.prototype.msMatchesSelector;
	}
})();
