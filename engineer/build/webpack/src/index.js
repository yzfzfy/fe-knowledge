// function component() {
//     const element = document.createElement('div');

//     // Lodash, currently included via a script, is required for this line to work
//     element.innerHTML = ['Hello', 'webpack'].join(' ');

//     return element;
// }

// document.body.appendChild(component());

document.getElementById('root').onclick = function () {
    console.log('first');
    import('./s.json').then((json) => {
        console.log(json);
    });
};
