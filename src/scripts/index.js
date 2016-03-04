/*!
 * editors-lab-2016
 *
 * @version development
 */

var throttle, template, visualisation, slice,
    TOTAL,
    rootEl, sectionEls, visualisationUpdateFn;

throttle = require('throttleit');
template = require('../templates/container.hbs');
visualisation = require('./visualisation');
slice = Array.prototype.slice;

TOTAL = 22000000;

rootEl = document.getElementById('root');
rootEl.innerHTML = template({
    title: document.title
});

sectionEls = slice.call(document.querySelectorAll('.section'));

visualisationUpdateFn = visualisation(document.querySelector('.visualisation .value'), 22000000);

rootEl.addEventListener('click', function (event) {
    var targetEl = event.target;

    if (targetEl.dataset.choiceValue != null) {
        return makeChoice(targetEl);
    }
});

function makeChoice(buttonEl) {
    var sectionEl = buttonEl.parentElement;
    var choiceValue = buttonEl.dataset.choiceValue;
    var choiceName;

    function isSectionOptional(sectionEl) {
        return sectionEl.dataset.choiceName != null &&
            sectionEl.dataset.choiceValue != null;
    }

    function updateVisibility(sectionEl) {
        sectionEl.style.display = sectionEl.dataset.choiceValue === choiceValue ? '' : 'none';
    }

    while (sectionEl.dataset.choiceName == null) {
        sectionEl = sectionEl.parentElement;
    }

    choiceName = sectionEl.choiceName;

    sectionEls.filter(isSectionOptional).forEach(updateVisibility);

    slice.call(sectionEl.querySelectorAll('button[data-choice-value]')).forEach(function (el) {
        el.disabled = (el === buttonEl);
    });
}

function updateVisualisation() {
    var windowScrollY = window.scrollY;
    var halfWindowHeight = Math.round(window.innerHeight / 2);

    function isSectionApplied(sectionEl) {
        return sectionEl.dataset.multiplier != null &&
            sectionEl.offsetWidth > 0 &&
            sectionEl.offsetHeight > 0 &&
            sectionEl.offsetTop <= windowScrollY + halfWindowHeight;
    }

    function reducer(product, sectionEl) {
        return +sectionEl.dataset.multiplier * product;
    }

    var appliedSectionEls = sectionEls.filter(isSectionApplied);

    var product = Math.round(appliedSectionEls.reduce(reducer, TOTAL));

    visualisationUpdateFn(product);

    document.body.style.backgroundColor = appliedSectionEls.length % 2 ? 'red' : 'blue';
}

window.addEventListener('scroll', throttle(updateVisualisation, 200));

updateVisualisation();

sectionEls.forEach(function (sectionEl) {
    var buttonEl = sectionEl.querySelector('button[data-choice-value]');

    if (buttonEl != null) {
        makeChoice(buttonEl);
    }
});
