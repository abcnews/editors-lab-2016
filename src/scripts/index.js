/*!
 * editors-lab-2016
 *
 * @version development
 */

var template, rootEl;

template = require('../templates/container.hbs');

rootEl = document.getElementById('root');

rootEl.innerHTML = template({
    title: document.title
});
