var camera, scene, renderer, object = false, object2, key = 0;

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

    //camera = new THREE.PerspectiveCamera( 50, 800 /  600, 1, 10000 );
    camera = new THREE.OrthographicCamera( 800 / - 2, 800 / 2, 600 / 2, 600 / - 2, - 1, 1000 );
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



        //container = document.createElement( 'div' );
        //document.body.appendChild( container );

        //renderer = new THREE.WebGLRenderer( { antialias: false } );
        //renderer.setSize( window.innerWidth, window.innerHeight );
        //container.appendChild( renderer.domElement );

        //scene = new THREE.Scene();

        //camera = new THREE.OrthographicCamera( window.innerWidth / - 2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / - 2, - 1, 1000 );
        //scene.add( camera );

        var width = 800, height = 600;

        if ( ! renderer.context.getExtension( 'OES_texture_float' ) ) {
            alert( 'OES_texture_float is not :(' );
        }

        data = new Float32Array( width * height * 3 );

        var textGeo = new THREE.TextGeometry( "iBrush", {
            size: 0.2,
            height: 0,
            curveSegments: 0,

            font: "helvetiker",
            weight: "bold",
            style: "normal"
        });

        textGeo.applyMatrix( new THREE.Matrix4().makeTranslation( -0.3, -0.2, 0.30 ) );

        points = THREE.GeometryUtils.randomPointsInGeometry( textGeo, data.length / 3 );

        for ( var i = 0, j = 0, l = data.length; i < l; i += 3, j += 1 ) {

            data[ i ] = points[ j ].x*2;
            data[ i + 1 ] = points[ j ].y*2;
            data[ i + 2 ] = points[ j ].z * Math.random() * 50;

        }

        texture = new THREE.DataTexture( data, width, height, THREE.RGBFormat, THREE.FloatType );
        texture.needsUpdate = true;

        rtTexturePos = new THREE.WebGLRenderTarget(width, height, {});
        rtTexturePos2 = rtTexturePos.clone();

        simulationShader = new THREE.ShaderMaterial({

            uniforms: { origin: { type: "t", value: texture } },

            vertexShader: 'varying vec2 vUv;void main() {vUv = vec2(uv.x, 1.0 - uv.y);gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );}',
            fragmentShader:  'varying vec2 vUv;uniform sampler2D tPositions;uniform sampler2D origin;uniform float timer;float rand(vec2 co){return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);}void main() {vec3 pos = texture2D( tPositions, vUv ).xyz;if ( rand(vUv + timer ) > 0.97 ) {pos = texture2D( origin, vUv ).xyz;} else {float x = pos.x + timer;float y = pos.y;float z = pos.z;pos.x += sin( y * 7.0 ) * cos( z * 12.0 ) * 0.005;pos.y += sin( x * 8.0 ) * cos( z * 13.0 ) * 0.005;pos.z += sin( x * 9.0 ) * cos( y * 14.0 ) * 0.005;}gl_FragColor = vec4(pos, 1.0);}'

        });

        fboParticles = new THREE.FBOUtils( width, renderer, simulationShader );
        fboParticles.renderToTexture(rtTexturePos, rtTexturePos2);

        geometry = new THREE.Geometry();

        for ( var i = 0, l = width * height; i < l; i ++ ) {

            if( i % 2 != 0) {
                var vertex = new THREE.Vector3();
                vertex.x = ( i % width ) / width;
                vertex.y = Math.floor(i / width) / height;
                geometry.vertices.push(vertex);
            }

        }

        material = new THREE.ShaderMaterial( {
            uniforms: { width: { type: "f", value: width }, height: { type: "f", value: height }, pointSize: { type: "f", value: 3 } },
            vertexShader: 'uniform sampler2D map;uniform float width;uniform float height;uniform float pointSize;varying vec2 vUv;varying vec4 vPosition;void main() {vUv = position.xy + vec2( 0.5 / width, 0.5 / height );vec3 color = texture2D( map, vUv ).rgb * 200.0 - 100.0;gl_PointSize = pointSize;gl_Position = projectionMatrix * modelViewMatrix * vec4( color, 1.0 );}',
            fragmentShader: 'uniform sampler2D map;varying vec2 vUv;varying vec4 vPosition;void main() {float depth = smoothstep( 750.0, -500.0, gl_FragCoord.z / gl_FragCoord.w );gl_FragColor = vec4( texture2D( map, vUv ).xyz, depth );}'
        } );

        object2 = new THREE.Points( geometry, material );
        setObjectQuaternion( object2.quaternion, 2.4, 0.5, 0.3, 0 );
        scene.add( object2 );

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
                setObjectQuaternion( object2.quaternion, alpha, beta, gamma, orient );
            }

            return 'alpha:' + data.coord.alpha + '; ' + 'beta:' + data.coord.beta + '; ' + 'gamma:' + data.coord.gamma + ';';
        } else {
            return '';
        }
    }
});