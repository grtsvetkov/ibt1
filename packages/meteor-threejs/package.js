Package.describe({
    name: 'rim:threejs',
    summary: 'Three.js meteor package',
    version: '1.0.0',
    git: ''
});

Package.onUse(function(api) {
    api.versionsFrom('1.0');
    api.addFiles('./lib/three.js', 'client');
});