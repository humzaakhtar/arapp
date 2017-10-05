var scene = document.querySelector('a-scene');


var title = document.createElement('a-text');
					title.setAttribute('value', "-Equipment Name : xxxxx");
					title.setAttribute('color', 'crimson');
					title.setAttribute('position', '0.6 0 0');
					title.setAttribute('rotation', '-90 0 0');
					title.setAttribute('scale', '0.5 0.5 0.5');
					scene.appendChild(title);

var dataofinstall = document.createElement('a-text');
					dataofinstall.setAttribute('value', "-Date of Installation : 10/7/2016");
					dataofinstall.setAttribute('color', 'blue');
					dataofinstall.setAttribute('position', '0.6 0 0.2');
					dataofinstall.setAttribute('rotation', '-90 0 0');
					dataofinstall.setAttribute('scale', '0.5 0.5 0.5');
					scene.appendChild(dataofinstall);

var description = document.createElement('a-text');
					description.setAttribute('value', "-The existing NTX 1000 is a compact integrated mill turn center which is capable of high-efficiency machining of complex-shaped workpieces with a perfect combination of turning and milling.");
					description.setAttribute('color', 'red');
					description.setAttribute('position', '0.6 0 0.6');
					description.setAttribute('rotation', '-90 0 0');
					description.setAttribute('scale', '0.5 0.5 0.5');
					scene.appendChild(description);


var projectsrunning = document.createElement('a-text');
					projectsrunning.setAttribute('value', "-Current Projects Running on this Equipment:");
					projectsrunning.setAttribute('color', 'green');
					projectsrunning.setAttribute('position', '0.6 0 1');
					projectsrunning.setAttribute('rotation', '-90 0 0');
					projectsrunning.setAttribute('scale', '0.5 0.5 0.5');
					scene.appendChild(projectsrunning);

var projectsrunning1 = document.createElement('a-text');
					projectsrunning1.setAttribute('value', "Project 1");
					projectsrunning1.setAttribute('color', 'green');
					projectsrunning1.setAttribute('position', '0.6 0 1.2');
					projectsrunning1.setAttribute('rotation', '-90 0 0');
					projectsrunning1.setAttribute('scale', '0.5 0.5 0.5');
					scene.appendChild(projectsrunning1);

var projectsrunning2 = document.createElement('a-text');
					projectsrunning2.setAttribute('value', "Project 2");
					projectsrunning2.setAttribute('color', 'green');
					projectsrunning2.setAttribute('position', '0.6 0 1.4');
					projectsrunning2.setAttribute('rotation', '-90 0 0');
					projectsrunning2.setAttribute('scale', '0.5 0.5 0.5');
					scene.appendChild(projectsrunning2);