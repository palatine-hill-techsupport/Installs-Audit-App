		document.addEventListener('DOMContentLoaded', function() {
		let selectedItems = new Set();
		let previousCategory = null;

		let categoryData = {
			"📺 TV & Audio": {
				"TV Wall Mount": [
					"Panel check front w/power on", "Internet connected", "FTA connected", "Position marked w/tape", 
					"Spirit level shown", "Bracket Secured", "Cable hiding entry/exit", "Peripherals connected & shown", 
					"Blocked/Unclear photos", "Return photo required", "Remove/Recycle photo required", "Poor completion, too close", "No completion"
				],
				"TV Setup & Connect": [
					"Panel check front w/power on", "Internet connected", "FTA connected", "Peripherals connected & shown", 
					"Blocked/Unclear photos", "Return photo required", "Remove/Recycle photo required", "Poor completion, too close", "No completion"
				],
				"Soundbar Wall Mount": [
					"Position marked w/tape", "Spirit level shown", "Bracket Secured", 
					"Blocked/Unclear photos", "Return photo required", "Remove/Recycle photo required", "Poor completion, too close", "No completion"
				],
				"Soundbar Setup & Connect": [
					"Blocked/Unclear photos", "Return photo required", "Remove/Recycle photo required", "Poor completion, too close", "No completion"
				],
				"Projector Ceiling Mount": [
					"Internet connected", "Position marked w/tape", "Spirit level shown", "Bracket Secured", 
					"Cable hiding entry/exit", "Blocked/Unclear photos", "Return photo required", 
					"Remove/Recycle photo required", "Poor completion, too close", "No completion"
				],
				"Projector": [
					"Internet connected", "Blocked/Unclear photos", "Return photo required", 
					"Remove/Recycle photo required", "Poor completion, too close", "No completion"
				]
			},
			"🚿 Whitegoods": {
				"Washing Machine Setup & Connect": [
					"Front check, power on", "Cleaned area", "Transit bolts removed", "Water clamp", "Drainage hose", 
					"Parts & manual left w/CX", "Blocked/Unclear photos", "Return photo required", "Remove/Recycle photo required", 
					"Poor completion, too close", "No completion"
				],
				"Dryer Wall Mount": [
					"Front check, power on", "Cleaned area", "Spirit level w/WM unit", 
					"Parts & manual left w/CX", "Blocked/Unclear photos", "Return photo required", 
					"Remove/Recycle photo required", "Poor completion, too close", "No completion"
				],
				"Dryer Stacker": [
					"Front check, power on", "Cleaned area", "Spirit level w/stacked unit", 
					"Parts & manual left w/CX", "Blocked/Unclear photos", "Return photo required", 
					"Remove/Recycle photo required", "Poor completion, too close", "No completion"
				],
				"Dryer Setup & Connect": [
					"Front check, power on", "Cleaned area", "Parts & manual left w/CX", 
					"Blocked/Unclear photos", "Return photo required", "Remove/Recycle photo required", 
					"Poor completion, too close", "No completion"
				],
				"Fridges": [
					"Front check, power on", "Cleaned area", "Water clamp", "Parts & manual left w/CX", 
					"Blocked/Unclear photos", "Return photo required", "Remove/Recycle photo required", 
					"Poor completion, too close", "No completion"
				],
				"Dishwasher": [
					"Front check, power on", "Cleaned area", "Water clamp", 
					"Drainage hose", "Parts & manual left w/CX", "Blocked/Unclear photos", "Return photo required", 
					"Remove/Recycle photo required", "Poor completion, too close", "No completion"
				]
			},
			"📱 IT & Smarthome": {
				"PC Setup": [
					"Device(s) powered & working", "Screenshot of data transfer(s)", "Screenshot of software/apps installed", 
					"Blocked/Unclear photos", "Return photo required", "Remove/Recycle photo required", 
					"Poor completion, too close", "No completion"
				],
				"Mobile Setup": [
					"Device(s) powered & working", "Screenshot of data transfer(s)", 
					"Blocked/Unclear photos", "Return photo required", "Remove/Recycle photo required", 
					"Poor completion, too close", "No completion"
				],
				"Wi-Fi Setup": [
					"Device(s) powered & working", "Screenshot of software/apps installed", 
					"Blocked/Unclear photos", "Return photo required", "Remove/Recycle photo required", 
					"Poor completion, too close", "No completion"
				],
				"Smart home Setup": [
					"Device(s) powered & working", "Screenshot of software/apps installed", 
					"Blocked/Unclear photos", "Return photo required", "Remove/Recycle photo required", 
					"Poor completion, too close", "No completion"
				]
			},
			"🔍 Misc": [
				"No missed photos, well done tech.", "Small job, single photo, meets requirements.", 
				"Small job, photos meet requirements.", "SKUs & image(s) don't match work", 
				"DTOW job ❌ No photo taken of variation.", "DTOW job ✅ Photo taken of variation.", "Escalated to FCM"
			]
		};

		function loadCategories() {
			previousCategory = null;
			selectedItems.clear(); 
			updateOutput();
			renderButtons(Object.keys(categoryData), loadSubcategories, 'category');
		}

		function loadSubcategories(category) {
			if (!categoryData[category]) {
				console.error(`Category "${category}" not found.`);
				return;
			}

			previousCategory = loadCategories;

			if (Array.isArray(categoryData[category])) {
				loadChecklist(categoryData[category], loadCategories);
			} else {
				renderButtons(Object.keys(categoryData[category]), subcategory => {
					if (!categoryData[category][subcategory]) {
						console.error(`Subcategory "${subcategory}" not found in "${category}".`);
						return;
					}
					previousCategory = () => loadSubcategories(category);
					loadChecklist(categoryData[category][subcategory], () => loadSubcategories(category));
				}, 'subcategory');
			}
		}

		function loadChecklist(items, backFunction) {
			previousCategory = backFunction;
			renderButtons(items, toggleItem, 'option');
		}

		function renderButtons(items, callback, type = '') {
			const container = document.getElementById('checklist-container');
			container.innerHTML = "";
			if (previousCategory) addBackButton(previousCategory);
			items.forEach(item => {
				let button = document.createElement('button');
				button.textContent = item;
				button.classList.add(type);
				button.addEventListener('click', () => callback(item));
				if (type === 'option' && selectedItems.has(item)) {
					button.classList.add('selected');
				}
				container.appendChild(button);
			});
		}

		function addBackButton(callback) {
			let backButton = document.createElement('button');
			backButton.textContent = "Back";
			backButton.classList.add('back-button');
			backButton.addEventListener('click', callback);
			document.getElementById('checklist-container').prepend(backButton);
		}

		function toggleItem(item) {
			if (selectedItems.has(item)) {
				selectedItems.delete(item);
			} else {
				selectedItems.add(item);
			}
			updateOutput();
			refreshChecklistButtons();
		}

		function updateOutput() {
			let outputBox = document.getElementById('output');
			
			let isMisc = previousCategory === loadCategories && categoryData["🔍 Misc"].some(item => selectedItems.has(item));

			if (selectedItems.size > 0) {
				if (isMisc) {
					outputBox.value = Array.from(selectedItems).join('\n- ');
				} else {
					outputBox.value = `Missing/Noncompliant photos:\n- ${Array.from(selectedItems).join('\n- ')}`;
				}
			} else {
				outputBox.value = "";
			}
}
		function refreshChecklistButtons() {
			document.querySelectorAll('.option').forEach(button => {
				if (selectedItems.has(button.textContent)) {
					button.classList.add('selected');
				} else {
					button.classList.remove('selected');
				}
			});
		}
		
		document.getElementById('clear-button').addEventListener('click', () => {
			selectedItems.clear();  // Clear selected options
			updateOutput();  // Update the output text area
			refreshChecklistButtons();  // Refresh button highlights
		});

		document.getElementById('refresh-button').addEventListener('click', loadCategories);
		document.getElementById('copy-button').addEventListener('click', () => {
			navigator.clipboard.writeText(document.getElementById('output').value).then(() => {
				let copyButton = document.getElementById('copy-button');
				let originalText = copyButton.textContent;
				copyButton.textContent = "Copied!";
				setTimeout(() => {
					copyButton.textContent = originalText;
				}, 1500);
			}).catch(err => {
				console.error("Failed to copy: ", err);
			});
		});

		document.getElementById('changelog-popup').style.display = 'none';
		document.getElementById('changelog-link').addEventListener('click', function() {
			document.getElementById('changelog-popup').style.display = 'block';
		});
		document.querySelector('.close-button').addEventListener('click', function() {
			document.getElementById('changelog-popup').style.display = 'none';
		});
		loadCategories();
	});