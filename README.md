# node implementation :

requirement postgresql 13.1
nodejs 14.7

- git clone the repo.
- With command line (CLI) go into api folder :<pre><code>cd api</code></pre> and
    <pre><code>npm install</code></pre>
- In pgAdmin 4 create an empty database called fil_rouge (owner postgres).

    <pre><code>npm start</code></pre>
With this you :
    <ul>
        <li>Start a node server on localhost:8000</li>
        <li>Synchronize node server with fil_rouge's database schema</li>
        <li>Fill the database with test data (if empty)</li>
    </ul>
