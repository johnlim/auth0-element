# auth0-element

To publish to gh-pages:
1) clone/checkout gh-pages 
2) `rm -rf bower.json`
3) `rm -rf components`
4) `bower install https://github.com/johnlim/auth0-element.git#version`
5) `cp components/auth0-element/bower.json .`
6) `bower install`
7) `git push`
