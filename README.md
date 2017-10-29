# babel-plugin-make-lazy

Allows for Universal Rendering and Lazy Loading by appending bundle-loader?lazy! just when you need it.

Why?
----

If you want both server side (universal) rendering and lazy loading, life can be tricky. Node + Babel generally don't know how to process things like `bundle-loader?lazy!`. This may cause you to run webpack server side in some interesting way or it may cause you to make a decision between lazy loading or server side rendering. There are likely a variety of other methods, but combine this all with the need to get routing to work correctly and you're left with very few options.... well, until now!

How?
----

In our project [fervor](https://github.com/fervorous/fervor) we wanted to take advantage of both lazy loading and server rendering. For us, we ended up storing a map from routes to components ([example](https://github.com/fervorous/fervor-todo-mvc/blob/master/src/urls.js)) for our apps. As a result of this predictability we are able to take all imports in that file and compile them differently for the server side than on the client side. In other words, our client side babel config (that is used as a loader in webpack) has an extra plugin (this one) and our server side code doesn't need to care at all.

Configuration
----

This is pretty straightforward. Install this package as usual

```
yarn add babel-plugin-make-lazy
# or  
npm install babel-plugin-make-lazy
```   

Next add the lazy plugin

```
let config = {
    presets: [
      ['env'],
    ],
    plugins: [
      [
        'make-lazy',
        {
          // paths is used to specify which files should have their imports laze'ified
          paths: ['src\/urls\.js'],
          // moduleExceptions is used to prevent adding `bundle-loader?lazy!` to some of your imports
          // here I enforce that laziness only happens for relative imports
          moduleExceptions: ['^[^(./|../)]'],
        },
      ],
    ],
  };
```

Note - both paths and moduleExceptions are an array of strings that represent regular expressions.
