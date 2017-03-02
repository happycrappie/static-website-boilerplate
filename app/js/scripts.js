// This is a boilerplate.

var div = document.createElement('div'),
    p = document.createElement('p'),
    node = document.createTextNode("Hey, look at me, I'm a script!"),
    body = document.getElementsByTagName('body')[0];

    p.appendChild(node);
    div.appendChild(p);
    div.classList.add('card');
    div.classList.add('purple');
    body.appendChild(div);