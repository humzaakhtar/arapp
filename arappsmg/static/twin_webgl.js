/** coding: utf-8; **
 *
 * (c) 2017 SMG Team
 *
 * This file is part of the:
 *
 * ARTC-SMG Digital Twin SDK
 *
 * The ARTC-SMG SDK is registered software; you cannot redistribute it and/or
 * modify without express knowledge of ARTC, parts of this software are
 * distributed WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the LGPL License
 * for more details.
 *
 * You should have received a copy of the LGPL License along with this software.
 * If not, see <http://www.gnu.org/licenses/old-licenses/lgpl-2.1.en.html>.
 *
 *
 * @Author: Humza Akhtar
 * @date: 28/08/2017 Sunday, 01:13:29 AM
 * @Copyright: ARTC-SMG SDK
 * @License: LGPL
 * @Version: 1.0.0
 * @Maintainer: akhtarh
 * @Email: akhtarh@artc.a-star.edu.sg
 * @Status: development
 * @Last Update: 28/08/2017 Sunday, 01:13:29 AM
 *
 */


//GLOBAL VARIABLES FOR JOINTS/MOVING PARTS OF ROBOT/MODEL
var spec = 	static_url = document.getElementById("spec").innerHTML;
var cadarraylength;
var link_files=[];
var link_angle=[];
var link_name=[];
var distance_from_origin=[];
var slider =[];
var link_order = [];
var flag = 0;
var lo = 0;
var loadedorder=[];
var twinmodel = new THREE.Object3D();
var container, stats;

//GLOBAL SCENE VARIABLES
var camera;
var scene;
var renderer;
var controls;
var effectController = [];
var objects = [];
var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;
var earthPivot;
var clock;
var prerotation;
var rotObjectMatrix;

//GLOBAL HTML VARIABLES FOR INFORMATION/GUI DISPLAY
var wsoverlay = document.getElementById('wsoverlay'); //new websocket overlay variable
var wsform = document.getElementById('wsform');
var wsbutton = document.getElementById('wsbutton');
var consbutton = document.getElementById('consbutton');
var wsconnect = document.getElementById('wsConnect');
var connectstat = document.getElementById('ConnectStatus');
var buttongroup = document.getElementById('buttongroup');
var guielement;
var ws = null;
var h;
var gui;
var weburi = getQueryVariable("ws");

// Tolerance for joint position comparisons
var absTol = 0.001;
var relTol = 0.1;

//initialize links
var static_url;

//MAIN FUNCTION BLOCK
window.onload = function() {

// INIT WITH EITHER WEBSOCKET OR WITHOUT WEBSOCKET
if (weburi !== null) {
	
	static_url = document.getElementById("cadurl").innerHTML;
	spec1 = spec.replace(/u'(?=[^:]+')/g, "'");
	spec2 = spec1.replace(/'/g, '"');
	weburi = decodeURIComponent(weburi);
	init_withWS();
	loadModel(static_url,spec2);
	WebSocketListen();

} else {

	static_url = document.getElementById("cadurl").innerHTML;
	spec1 = spec.replace(/u'(?=[^:]+')/g, "'");
	spec2 = spec1.replace(/'/g, '"');
	init();
	loadModel(static_url,spec2);
}
}

// TO GET THE WEBURI OF WEBSOCKET FROM TEXTBOX
function getQueryVariable(variable) {
	var query = window.location.search.substring(1);
	var vars = query.split("&");
	for (var i = 0; i < vars.length; i++) {
		var pair = vars[i].split("=");
		if (pair[0] == variable) {
			return pair[1];
		}
	}
	return (null);
}

// TO UPDATE THE JOINTS BASED ON THE ANGLE SET BY THE UI OR THROUGH CONTROL UNIT
function jointUpdater(obj,val,linkname,i){
	if(link_angle[i] == 'z'){
		if (!almostEqual((obj.rotation.z * 100) / 100, ((-val * Math.PI / 180) * 100) / 100, absTol)) {
			
			//APPLY TRANSLATION AND ROTATION MATRIX
			var transformation = new THREE.Matrix4().makeTranslation(-1*distance_from_origin[i]["x"], -1*distance_from_origin[i]["y"], -1*distance_from_origin[i]["z"]);
			
			var rerotate = new THREE.Matrix4().makeRotationZ(-obj.rotation.z);
			
			obj.applyMatrix(rerotate.multiply(transformation));
			
			var rotation = new THREE.Matrix4().makeRotationZ((((-val * Math.PI / 180) * 100) / 100));
			
			obj.applyMatrix(rotation);
			
			transformation = new THREE.Matrix4().makeTranslation(distance_from_origin[i]["x"], 1*distance_from_origin[i]["y"], distance_from_origin[i]["z"]);
			
			obj.applyMatrix(transformation);
		}
	}
	else if(link_angle[i] == 'y'){
		if (!almostEqual((obj.rotation.y * 100) / 100, ((-val * Math.PI / 180) * 100) / 100, absTol)) {
			
			//APPLY ROTATION AND TRANSLATION MATRIX
			var transformation = new THREE.Matrix4().makeTranslation(-1*distance_from_origin[i]["x"], -1*distance_from_origin[i]["y"], -1*distance_from_origin[i]["z"]);
			
			var rerotate = null;
			
			if (Math.abs(val * Math.PI / 180) > Math.PI / 2) {
				
				rerotate = new THREE.Matrix4().makeRotationY( - (Math.PI - obj.rotation.y));
				
			} else {
				rerotate = new THREE.Matrix4().makeRotationY((-obj.rotation.y));
			}
			
			
			obj.applyMatrix(rerotate.multiply(transformation));
			
			var rotation = new THREE.Matrix4().makeRotationY((((-val * Math.PI / 180) * 100) / 100));
			
			obj.applyMatrix(rotation);
			
			transformation = new THREE.Matrix4().makeTranslation(distance_from_origin[i]["x"], 1*distance_from_origin[i]["y"], distance_from_origin[i]["z"]);
			
			obj.applyMatrix(transformation);
		}
	}
	else if(link_angle[i] == 'x'){
		if (!almostEqual((obj.rotation.x * 100) / 100, ((-val * Math.PI / 180) * 100) / 100, absTol)) {
			
			//APPLY ROTATION AND TRANSLATION MATRIX
			var transformation = new THREE.Matrix4().makeTranslation(-1*distance_from_origin[i]["x"], -1*distance_from_origin[i]["y"], -1*distance_from_origin[i]["z"]);
			
			var rerotate = new THREE.Matrix4().makeRotationX(-obj.rotation.x);
			
			obj.applyMatrix(rerotate.multiply(transformation));
			
			var rotation = new THREE.Matrix4().makeRotationX((((-val * Math.PI / 180) * 100) / 100));
			
			obj.applyMatrix(rotation);
			
			transformation = new THREE.Matrix4().makeTranslation(distance_from_origin[i]["x"], 1*distance_from_origin[i]["y"], distance_from_origin[i]["z"]);
			
			obj.applyMatrix(transformation);
		}
	}
	
}
	

//FUNCTION FOR TURNING RADIAN TO DEGREE
function rad2deg(radVal) {
	return radVal * (180 / Math.PI);
}

//--INITIALIZATION FUNCTION THIS RUNS AFTER THE MODEL HAS BEEN LOADED--//
function init() {
	//SETTING CAMERA POSITION AND ADDING LIGHTS
	container = document.createElement('div');
	document.body.appendChild(container);
	camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 100, 20000);
	camera.position.z = 5000;
	camera.position.y = 5000;
	camera.position.x = 5000;
	wsbutton.onclick = function () {
		var x = document.getElementById('wsoverlay-content');
		if (x.style.display === 'none') {
        	x.style.display = 'block';
    	}
		useWS();
	};
	consbutton.onclick = function () {
		var x = document.getElementById('wsoverlay-content');
		if (x.style.display === 'block') {
        	x.style.display = 'none';
    	}
		useGUI();
	};

}

//--INITIALIZATION FUNCTION WITH WS THIS RUNS AFTER THE MODEL HAS BEEN LOADED--//
function init_withWS() {
	container = document.createElement('div');
	document.body.appendChild(container);

	camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 100, 20000);
	camera.position.z = 5000;
	camera.position.y = 5000;
	camera.position.x = 5000;

}



//--FUNCTION FOR LOADING ROBOT MODEL--//
function loadModel(relativePath,specs) {
	//LOAD NEW SCENE
	scene = new THREE.Scene();
	//LOAD LIGHTING FOR SCENE
	scene.fog = new THREE.Fog(0x808080, 2000, 4000);
	var ambientLight = new THREE.AmbientLight(0x444444);
	var light = new THREE.DirectionalLight(0xFFFFFF, 1.0);
	light.position.set(200, 400, 500);
	var light2 = new THREE.DirectionalLight(0xFFFFFF, 1.0);
	light2.position.set(-500, 250, -200);
	var light3 = new THREE.DirectionalLight(0xFFFFFF, 1.0);
	light3.position.set(5000, 5000, 5000);
	scene.add(ambientLight);
	scene.add(light);
	scene.add(light2);
	scene.add(light3);
	// CREATE LOAD MANAGER
	var manager = new THREE.LoadingManager();
	manager.onLoad = function(){
			for (var g = 0; g<cadarraylength;g++)
				{
					if(link_files[g] != loadedorder[g])
					{
						if(loadedorder[g] === undefined){}
						else{
								for(var h = 0; h<cadarraylength; h++)
									{
										if(link_files[g] == loadedorder[h]){
											//SWAP THE OBJECTS IF REQUIRED
											var temp1 = objects[g];
											var temp2 = objects[h];
											var temp3 = loadedorder[g];
											var temp4 = loadedorder[h];
											loadedorder[h] = temp3;
											loadedorder[g] = temp4;
											objects[h] = temp1;
											objects[g] = temp2;
											break;
										}
									}
						}
					}
				}
			for (var g = cadarraylength-1; g >0;g--)
				{
						var newobj = objects[g-1].add(objects[g]);
						twinmodel.add(newobj);
				}
	scene.add(twinmodel);
		
	//INITIATE RENDERER
	renderer = new THREE.WebGLRenderer();
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.setClearColor(0x289028, 1);
	container.appendChild(renderer.domElement);

	// ADD AXIS
	var axisHelper = new THREE.AxisHelper( 500 );
	scene.add( axisHelper );

	//SET CONTROLLERS
	controls = new THREE.OrbitControls(camera, renderer.domElement);
	controls.addEventListener('change', render);
	controls.minDistance = 20;
	controls.maxDistance = 4000;
	controls.maxPolarAngle = Math.PI;
	controls.enablePan = false;
	controls.target.copy(twinmodel.position);
	controls.update();

	setupGui();
	animate();

	}
	
	manager.onProgress = function (item, loaded, total) {
		var itemarray = item.split('/');
		var itemname = itemarray[itemarray.length - 1];
		var fl = 1;
		for(var b = 0; b <=lo;b++){
			if(itemname == loadedorder[b]){
				fl = 0;
			}
		}
		if(itemname != "UV_Grid_Sm.jpg" && fl == 1){
			
			loadedorder[lo] = itemname;
			lo++;
		}
	};

	// ADD TEXTURE FOR THE ROBOT MODEL
	var texture = new THREE.Texture();
	var onProgress = function (xhr) {
		if (xhr.lengthComputable) {
			var percentComplete = xhr.loaded / xhr.total * 100;
		}
	};
	var onError = function (xhr) {};
	var onLoad = function (xhr) {};
	var loader = new THREE.ImageLoader(manager);
	loader.load(static_url + 'UV_Grid_Sm.jpg', function (image) {
		texture.image = image;
		texture.mapping = THREE.UVMapping;
		texture.needsUpdate = true;

	});

	fileloader(texture, manager, onLoad, onProgress, onError, loader, relativePath,specs);
	
}

//INITIALIZE THE MATRICES FOR CAD ARRAY
function fileloader(texture, manager, onLoad, onProgress, onError, loader, relativePath,specs) {
	var twinspecs = JSON.parse(specs)
	cadarraylength = twinspecs["twin_definition"]["twin_links"]["CAD_files"].length;
	var cadarray = twinspecs["twin_definition"]["twin_links"]["CAD_files"];
	for(var i= 0; i<cadarraylength;i++){
		link_files[i] = cadarray[i]["file"];
		link_angle[i] = cadarray[i]["rot_angle"];
		link_name[i] =cadarray[i]["name"];
		link_order[i] = cadarray[i]["order"];
		distance_from_origin[i] = cadarray[i]["distance_from_origin"];
		effectController[link_name[i]] = 0.0;
	}
//THIS IS FOR FUTURE USE
var basematerial = new THREE.MeshPhongMaterial({
		ambient: 0x000000,
		color: 0xffffff,
		specular: 0x555555,
		shininess: 30
});
	
//LOAD model
loadobjs(manager,texture,relativePath,onLoad, onProgress, onError,0);
}


// LOAD THE OBJ FILES
function loadobjs(manager,texture,relativePath,onLoad,onProgress, onError,j){
	var i = 0;
	var count = 0;
	var count1 = -1;
	for(var i = 0; i < cadarraylength; i++){ 
		(function(foo){
			loader = new THREE.OBJLoader(manager);
			count1++;
			loader.load(relativePath + link_files[count1] , function (object) {
				object.traverse(function (child) {
					if (child instanceof THREE.Mesh) {
						child.material = new THREE.MeshStandardMaterial({ map: texture});
						console.log("texture applied");
					}
				});
				object.scale.set(0.07, 0.07, 0.07);
				this.modelpart = object;
				
				var transformation = new THREE.Matrix4().makeTranslation(0, 0, 0);
				this.modelpart.applyMatrix(transformation);
				if(link_angle[count] == "z")
				{
					var initrotate = new THREE.Matrix4().makeRotationZ(0);
					this.modelpart.applyMatrix(initrotate);
					
				}
				else if (link_angle[count] == "y")
				{
					var initrotate = new THREE.Matrix4().makeRotationY(0);
					this.modelpart.applyMatrix(initrotate);
					
				}
				else if(link_angle[count] == "x")
				{
					var initrotate = new THREE.Matrix4().makeRotationX(0);
					this.modelpart.applyMatrix(initrotate);
				
				}
				objects[count] = this.modelpart ;
				count++;
            	if (count > cadarraylength - 1) done();
			}, onLoad, onProgress, onError);
		}(i));
	 }
}

//JUST A SIMPLE FUNCTION WHICH IS CALLED WHEN ALL OBJS ARE UPLOADED
function done() {
	
	console.log("the objects have been loaded");
		
}



//--FUNCTION FOR ANIMATING THE SCENE (INITIATES RENDERERS)--//
function animate() {
	requestAnimationFrame(animate);
	render();
}

//--ACTUAL RENDER FUNCTION THAT IS CALLED--//
function render() {
	renderer.render(scene, camera);
}

//--FUNCTION FOR SETTING UP GUI--//
function setupGui() {
	gui = new dat.GUI({ autoPlace: false });
	gui.domElement.id = 'canvas';
	h = gui.addFolder("Move Joints");
	var customContainer = $('#moveGUI1').append($(gui.domElement)); 
	var rerotate;
	
	// CREATING SLIDERS
	for(var i = 0;i<cadarraylength;i++){
		if(link_angle[i] == 'z'){
		slider[i] = h.add(effectController, link_name[i], -180.0, 180.0, 1).name(link_name[i]);}
		else if(link_angle[i] == 'x') {
			slider[i] = h.add(effectController, link_name[i], -180.0, 180.0, 1).name(link_name[i]);
		}
		else if(link_angle[i] == 'y') {
			slider[i] = h.add(effectController, link_name[i], -180.0, 180.0, 1).name(link_name[i]);
		}
		else  {
			slider[i] = h.add(effectController, link_name[i], 0.0, 0.0, 1).name(link_name[i]);
		}
	}

	for(let i = 0; i < slider.length; i++){
		slider[i].onChange(function (value) {
			 updatecad( value,i );
	});
	}
	//make sure folder is open to show slider update in real time
	h.open();
	//added variable reference to the gui element so that it's appearance can be toggled by a button or other actions within the web page
	guielement = document.querySelector(".dg.main.a");

}

function updatecad( value,j ) {
	jointUpdater(objects[j],value,link_name[j],j);
}


//--FUNCTION FOR UPDATING VALUES, TO BE USED BY WEBSOCKET CONNECTION--//
function updatevalues() {
	for (var i in h.__controllers) {
		h.__controllers[i].updateDisplay();
	}
}

//--FUNCTION FOR TOGGLING DATGUI/CONSOLE INSTEAD OF WEBSOCKET--//
function useGUI() {
	if (ws != null) {
		ws.close();
	}
	//enable all the sliders and make them 'bright' again
	for (var i in h.__controllers) {
		h.__controllers[i].domElement.style.pointerEvents = "auto";
		h.__controllers[i].domElement.style.opacity = 1;
	}
	wsform.style.backgroundColor = "none";
	connectstat.innerHTML = "CONNECTION CLOSED !";
}

//--FUNCTION FOR ENABLING WEBSOCKET WINDOW/FORM --//
function useWS() {
	for (var i in h.__controllers) {
		h.__controllers[i].domElement.style.pointerEvents = "none";
		h.__controllers[i].domElement.style.opacity = 0.5;
	}
	wsconnect.onclick = function () {
		connectWS();
	};
}

//--FUNCTION TO INITIATE WEBSOCKET CONNECTION--//
function connectWS() {
	//console.log('Clicked');
	weburi = wsform.elements[0].value;
	WebSocketListen();
}

//--FUNCTION FOR SPECIFYING THE WEBSOCKET CONNECTION--//
function WebSocketListen() {
	if ("WebSocket" in window) {
		if (weburi.split("://")[0] !== "ws") {

			return;
		}
		ws = new WebSocket(weburi);
		ws.onopen = function () {
		//reflect connection update by stating the connection is established
		wsform.style.backgroundColor = "green";
		connectstat.innerHTML = "CONNECTION ESTABLISHED!";
		//SAMPLE STRING
		ws.send("send_joint_data");

		};
		ws.onmessage = function (evt) {
			var received_msg = evt.data;
			if (received_msg !== null) {
				var receivedJson = received_msg;
				var parsedJson = JSON.parse(receivedJson);
					var i = 0;
					for (var key in parsedJson) {
    					if (parsedJson.hasOwnProperty(key)) {
							var degvalue = rad2deg(parsedJson[key]);
							console.log(parsedJson[key])
							updatecad( degvalue,i );
							i++;
    					}
					}
					
					updatevalues();
			}
		};
		ws.onclose = function () {
			// websocket is closed.
			console.log("Connection is closed...");
		};
	} else {
		// The browser doesn't support WebSocket
		console.log("WebSocket NOT supported by your Browser!");
	}
}



//USELESS FUNCTION - WILL BE REMOVED IN THE FUTURE.
var contains = function(needle) {
    // Per spec, the way to identify NaN is that it is not equal to itself
    var findNaN = needle !== needle;
    var indexOf;
    if(!findNaN && typeof Array.prototype.indexOf === 'function') {
        indexOf = Array.prototype.indexOf;
    } else {
        indexOf = function(needle) {
            var i = -1, index = -1;

            for(i = 0; i < this.length; i++) {
                var item = this[i];

                if((findNaN && item !== item) || item === needle) {
                    index = i;
                    break;
                }
            }
            return index;
        };
    }
    return indexOf.call(this, needle) > -1;
};
