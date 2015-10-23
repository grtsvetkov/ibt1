var camera, scene, renderer, object = false, key = 0;

function animate() {
    requestAnimationFrame(animate);
    renderer.render( scene, camera );
}

function generateUid(min, max) {
    var rand = Math.floor(Math.random() * (max - min)) + min;
    return 'undefined' === typeof ServerSession.get(rand) ? rand : generateUid(min, max);
}

Template.desktopIndex.created = function(){

    var container = document.createElement( 'div' );
    document.body.appendChild( container );

    camera = new THREE.PerspectiveCamera( 50, 800 /  600, 1, 10000 );
    camera.position.set( 0, 0, 650 );
    camera.target = new THREE.Vector3( 0, 0, 0 );

    scene = new THREE.Scene();

    renderer = new THREE.WebGLRenderer({antialias : true});
    renderer.setClearColor( 0xf0f0f0 );
    renderer.setSize( 800, 600 );

    container.appendChild(renderer.domElement);

    var loader = new THREE.ObjectLoader();
    loader.load( '/models/iphone-5s.json', function ( obj ) {
        scene.add( obj );
        object = obj;

    });

    animate();

    key = generateUid(1, 500);
    ServerSession.set(key, {status:1});

};

var setObjectQuaternion = function () {

    var zee = new THREE.Vector3( 0, 0, 1 );

    var euler = new THREE.Euler();

    var q0 = new THREE.Quaternion();

    var q1 = new THREE.Quaternion( - Math.sqrt( 0.5 ), 0, 0, Math.sqrt( 0.5 ) ); // - PI/2 around the x-axis

    return function ( quaternion, alpha, beta, gamma, orient ) {

        euler.set( beta, alpha, - gamma, 'YXZ' );                       // 'ZXY' for the device, but 'YXZ' for us

        quaternion.setFromEuler( euler );                               // orient the device

        quaternion.multiply( q1 );                                      // camera looks out the back of the device, not the top

        quaternion.multiply( q0.setFromAxisAngle( zee, - orient ) );    // adjust for screen orientation

    }

}();

Template.desktopIndex.helpers({

    key: function(){
        return key;
    },

    keyIsConnected: function(){

        if(key) {
            var data = ServerSession.get(key);

            if (data && data.status == 2) {
                ServerSession.set(key, {status: 3});
                return true;
            } else if (data && data.status == 4) {
                return true;
            }
        }

        return false;
    },

    renderData: function() {
        var data = ServerSession.get(key);

        if(data.status == 4) {

            if(object !== false) {
                var alpha  = data.coord.alpha ? THREE.Math.degToRad( data.coord.alpha ) : 0; // Z
                var beta   = data.coord.beta  ? THREE.Math.degToRad( data.coord.beta  ) : 0; // X'
                var gamma  = data.coord.gamma ? THREE.Math.degToRad( data.coord.gamma ) : 0; // Y''
                var orient = data.coord.orient? THREE.Math.degToRad( data.coord.orient) : 0; // O

                setObjectQuaternion( object.quaternion, alpha, beta, gamma, orient );
            }

            return 'alpha:' + data.coord.alpha + '; ' + 'beta:' + data.coord.beta + '; ' + 'gamma:' + data.coord.gamma + ';';
        } else {
            return '';
        }
    }
});