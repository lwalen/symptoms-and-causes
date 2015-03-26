# Symptoms and Causes

First attempt at a web app for [Kari's Carpal Tunnel Project](http://carpaltunnelsyndrome.walen.me).

`symptoms-and-causes.js` reads from `data.json`, which contains an array of cause objects.
Each cause has an array of symptoms.

So, causes are mapped to symptoms, then symptoms are mapped to causes, resulting in a well-linked app.

Furthermore, multiple symptoms can be specified in a form like `?symptoms=Tiredness,Vomitting` to see 
all matching causes, sorted by relevance. Relevance is determined by the number of matching symptoms.
