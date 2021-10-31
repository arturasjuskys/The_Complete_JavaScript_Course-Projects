'use strict';

//////////////////////////////////////////////////////////////////////////////
// Element Selection

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnSrcollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');
const nav = document.querySelector('.nav');

//////////////////////////////////////////////////////////////////////////////
// Modal window

const openModal = function (e) {
    e.preventDefault();
    modal.classList.remove('hidden');
    overlay.classList.remove('hidden');
};
const closeModal = function () {
    modal.classList.add('hidden');
    overlay.classList.add('hidden');
};
btnsOpenModal.forEach((btn) => btn.addEventListener('click', openModal));
btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);
document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
        closeModal();
    }
});

//////////////////////////////////////////////////////////////////////////////
// Button Scrolling

btnSrcollTo.addEventListener('click', function (e) {
    // Some Examples
    console.log(e.target.getBoundingClientRect());
    console.log('Current scroll (X/Y)', window.pageXOffset, window.pageYOffset);
    console.log(
        'Height/Width viewport',
        document.documentElement.clientHeight,
        document.documentElement.clientWidth
    );

    // Scrolling
    const s1coords = section1.getBoundingClientRect();
    // Old Way
    // window.scrollTo(s1coords.left + window.pageXOffset, s1coords.top + window.pageYOffset);
    // window.scrollTo({
    //     left: s1coords.left + window.pageXOffset,
    //     top: s1coords.top + window.pageYOffset,
    //     behavior: 'smooth',
    // });

    // New Way
    section1.scrollIntoView({ behavior: 'smooth' });
});

//////////////////////////////////////////////////////////////////////////////
// Page Navigation

/*

// Old Inaficient Way

document.querySelectorAll('.nav__link').forEach(function (el) {
    el.addEventListener('click', function (e) {
        e.preventDefault();
        const id = this.getAttribute('href');
        document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
    });
});

*/

// New Aficient Way, with event bubbling
// 1. Add event listener to common parent element
// 2. Determine what element originated the event
document.querySelector('.nav__links').addEventListener('click', function (e) {
    e.preventDefault();
    // Matching strategy
    if (e.target.classList.contains('nav__link')) {
        const id = e.target.getAttribute('href');
        document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
    }
});

//////////////////////////////////////////////////////////////////////////////
// Tabbed Component

tabsContainer.addEventListener('click', function (e) {
    // this will solve a problem of <span> selection inside <button>
    const clicked = e.target.closest('.operations__tab');

    // Guard clause, this will prevent false clicks outside <button> and a return of 'null'
    if (!clicked) return;

    // Active tab
    tabs.forEach((tab) => tab.classList.remove('operations__tab--active'));
    clicked.classList.add('operations__tab--active');

    // Active content area
    tabsContent.forEach((content) => content.classList.remove('operations__content--active'));
    document
        .querySelector(`.operations__content--${clicked.dataset.tab}`)
        .classList.add('operations__content--active');
});

//////////////////////////////////////////////////////////////////////////////
// Menu fade animation

const handleHover = function (e) {
    // console.log(this, e.target);
    if (e.target.classList.contains('nav__link')) {
        const link = e.target;
        const siblings = link.closest('.nav').querySelectorAll('.nav__link');
        const logo = link.closest('.nav').querySelector('img');

        siblings.forEach((el) => {
            if (el !== link) el.style.opacity = this;
        });
        logo.style.opacity = this;
    }
};

/*

// Ugly way

nav.addEventListener('mouseover', function (e) {
    handleHover(e, 0.5);
});
nav.addEventListener('mouseout', function (e) {
    handleHover(e, 1);
});

*/

// Passing "argument" into handler
nav.addEventListener('mouseover', handleHover.bind(0.5));
nav.addEventListener('mouseout', handleHover.bind(1));

//////////////////////////////////////////////////////////////////////////////
// Sticky navigation

/*

// Inaficient way

const initialCoords = section1.getBoundingClientRect();
// console.log(initialCoords);

window.addEventListener('scroll', function () {
    console.log(window.scrollY);
    if (window.scrollY > initialCoords.top) nav.classList.add('sticky');
    else nav.classList.remove('sticky');
});

*/

// Sticky navigation: Intersection Observer API

/*

const obsCallback = function (entries, observer) {
    entries.forEach((entry) => {
        console.log(entry);
    });
};
const obsOptions = {
    // root: its the target
    root: null,
    // threshhold: at what condition
    threshold: [0, 0.2],
};
const observer = new IntersectionObserver(obsCallback, obsOptions);
observer.observe(section1);

*/

// Sticky navigation: Intersection Observer API

const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;

const stickyNav = function (entries, observer) {
    const [entry] = entries;
    if (!entry.isIntersecting) nav.classList.add('sticky');
    else nav.classList.remove('sticky');
};

const headerObserver = new IntersectionObserver(stickyNav, {
    root: null,
    threshold: 0,
    rootMargin: `-${navHeight}px`,
});

headerObserver.observe(header);

//////////////////////////////////////////////////////////////////////////////
// Reveale Sections

const allSections = document.querySelectorAll('.section');
const revealSections = function (entries, observer) {
    const [entry] = entries;

    // this if is to make 1st observer event to be ignored, so 1st section would get the animation too
    if (!entry.isIntersecting) return;
    entry.target.classList.remove('section--hidden');

    // to unobserve sections, because the work is done, and we dont need to observe them all over again
    observer.unobserve(entry.target);
};
const sectionObserver = new IntersectionObserver(revealSections, { root: null, threshold: 0.15 });
allSections.forEach(function (section) {
    sectionObserver.observe(section);
    // section.classList.add('section--hidden');
});

//////////////////////////////////////////////////////////////////////////////
// Lazy Image Loading

const imgTarget = document.querySelectorAll('img[data-src]');
const loadImg = function (entries, observer) {
    const [entry] = entries;

    // Guard clause
    if (!entry.isIntersecting) return;

    // Replace src with data-src
    entry.target.src = entry.target.dataset.src;

    // Listen for load-img event, 1rst lazy-img load and after large-img are finished loading lazy-img are relaced and filter is removed
    entry.target.addEventListener('load', function () {
        entry.target.classList.remove('lazy-img');
    });

    observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg, {
    root: null,
    threshold: 0,
    // rootMargin: will start lazy-img loading ahead of time, so the user wount see the process, but the loading aficiency will be preserved
    rootMargin: '200px',
});
imgTarget.forEach((img) => imgObserver.observe(img));

//////////////////////////////////////////////////////////////////////////////
// Slider

const slider = function () {
    const slides = document.querySelectorAll('.slide');
    const btnLeft = document.querySelector('.slider__btn--left');
    const btnRight = document.querySelector('.slider__btn--right');
    let currentSlide = 0;
    const maxSlide = slides.length;
    const dotContainer = document.querySelector('.dots');

    // scale down slider for easier development
    // const slider = document.querySelector('.slider');
    // slider.style.transform = 'scale(0.4) translateX(-1400px)';
    // slider.style.overflow = 'visible';

    const createDots = function () {
        slides.forEach(function (_, i) {
            dotContainer.insertAdjacentHTML(
                'beforeend',
                `<button class="dots__dot" data-slide="${i}"></button>`
            );
        });
    };

    const activeDot = function (slide) {
        document
            .querySelectorAll('.dots__dot')
            .forEach((dot) => dot.classList.remove('dots__dot--active'));
        document
            .querySelector(`.dots__dot[data-slide="${slide}"]`)
            .classList.add('dots__dot--active');
    };

    const goToSlide = function (slide) {
        slides.forEach((s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`));
    };

    // Next slide
    const nextSlide = function () {
        if (currentSlide === maxSlide - 1) {
            currentSlide = 0;
        } else {
            currentSlide++;
        }
        // currentSlide = 1: -100%, 0%, 100%, 200%
        goToSlide(currentSlide);
        activeDot(currentSlide);
    };

    const prevSlide = function () {
        if (currentSlide === 0) {
            currentSlide = maxSlide - 1;
        } else {
            currentSlide--;
        }
        goToSlide(currentSlide);
        activeDot(currentSlide);
    };

    const init = function () {
        createDots();

        goToSlide(0);
        // 0%, 100%, 200%, 300%
        // slides.forEach((slide, i) => (slide.style.transform = `translateX(${100 * i}%)`));

        activeDot(0);
    };
    init();

    // Event Listeners
    btnRight.addEventListener('click', nextSlide);
    btnLeft.addEventListener('click', prevSlide);
    document.addEventListener('keydown', function (e) {
        // if else statement, you pick
        if (e.key === 'ArrowLeft') prevSlide();
        // short circuiting, you pick
        e.key === 'ArrowRight' && nextSlide();
    });
    dotContainer.addEventListener('click', function (e) {
        if (e.target.classList.contains('dots__dot')) {
            // const slide = e.target.dataset.slide;
            const { slide } = e.target.dataset;
            goToSlide(slide);
            activeDot(slide);
        }
    });
};
slider();

//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
// Cookie message

const message = document.createElement('div');
message.classList.add('cookie-message');
message.innerHTML =
    'We use cookies for improved functionality and analytics. <button class="btn btn--close--cookie">Got it!</button>';
header.append(message);
document.querySelector('.btn--close--cookie').addEventListener('click', function () {
    // message.parentElement.removeChild(message); // old way of deleting elements
    message.remove();
});
message.style.height = Number.parseFloat(getComputedStyle(message).height, 10) + 30 + 'px';
// document.documentElement.style.setProperty('--color-primary', 'orangered');

//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////

const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);
const randomColor = () => `rgb(${randomInt(0, 255)},${randomInt(0, 255)},${randomInt(0, 255)})`;
