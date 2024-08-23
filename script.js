document.addEventListener('DOMContentLoaded', function() {
    // Tab switching functionality
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
  
    // Ensure Info Terminal is displayed by default
    document.getElementById('terminal-tab').style.display = 'block';
  
    tabButtons.forEach(button => {
      button.addEventListener('click', () => {
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabContents.forEach(content => content.style.display = 'none');
  
        button.classList.add('active');
        document.getElementById(button.getAttribute('data-tab')).style.display = 'block';
  
        // Initialize map if map tab is clicked
        if (button.getAttribute('data-tab') === 'map-tab') {
          setTimeout(() => {
            var map = L.map('map').setView([40, -45], 3);
  
            L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
              attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
              subdomains: 'abcd',
              maxZoom: 19
            }).addTo(map);
  
            var journeyPoints = [
              {
                name: "University of Stirling Undergraduate",
                location: [56.1465, -3.9203],
                description: "BSc (Hons) Computer Science Student and IT Assistant within the Information Services Team"
              },
              {
                name: "Citi - Tech Summer Analyst",
                location: [54.5973, -5.9301],
                description: "Summer Infrastructure Analyst working within Citi Technology Infrastructure Team (CTI)."
              },
              {
                name: "San Diego State University (Visiting Student)",
                location: [32.7757, -117.0719],
                description: "Exchange program in the United States focusing on Artificial Intelligence, Networks & Distributed Systems, Operating Systems and Programming Paradigms." 
              }
            ];
  
            var customIcon = L.icon({
              iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
              shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
              iconSize: [25, 41],
              iconAnchor: [12, 41],
              popupAnchor: [1, -34],
              shadowSize: [41, 41]
            });
  
            var markers = [];
            journeyPoints.forEach(function(point) {
              var marker = L.marker(point.location, {icon: customIcon})
                .addTo(map)
                .bindPopup('<b>' + point.name + '</b><br>' + point.description);
              markers.push(marker);
            });
  
            var pathCoordinates = journeyPoints.map(point => point.location);
            var pathLine = L.polyline(pathCoordinates, {
              color: '#1DB954',
              weight: 3,
              opacity: 0.7,
              dashArray: '10, 10',
              animate: true
            }).addTo(map);
  
            function highlightFeature(e) {
              var layer = e.target;
              layer.setStyle({
                fillOpacity: 0.7
              });
            }
  
            function resetHighlight(e) {
              var layer = e.target;
              layer.setStyle({
                fillOpacity: 0.5
              });
            }
  
            function onEachFeature(feature, layer) {
              layer.on({
                mouseover: highlightFeature,
                mouseout: resetHighlight,
              });
            }
  
            var highlightStyle = {
              fillColor: '#1DB954',
              weight: 1,
              opacity: 0.7,
              color: '#666',
              fillOpacity: 0.5
            };
  
            // Highlight UK
            var ukLayer = new L.GeoJSON.AJAX("https://raw.githubusercontent.com/johan/world.geo.json/master/countries/GBR.geo.json", {
              style: highlightStyle,
              onEachFeature: onEachFeature
            }).addTo(map);
  
            // Highlight USA
            var usaLayer = new L.GeoJSON.AJAX("https://raw.githubusercontent.com/johan/world.geo.json/master/countries/USA.geo.json", {
              style: highlightStyle,
              onEachFeature: onEachFeature
            }).addTo(map);
  
            // Fit the map to show all markers and highlighted regions
            ukLayer.on('data:loaded', function() {
              usaLayer.on('data:loaded', function() {
                var group = new L.featureGroup([...markers, ukLayer, usaLayer]);
                map.fitBounds(group.getBounds().pad(0.1));
              });
            });
          }, 300); // Delay to allow tab transition
        }
      });
    });
  
    // Existing terminal functionality
    const terminal = document.getElementById('terminal');
    const input = document.getElementById('terminal-input');
    
    const commands = {
      help: "Available commands: about, skills, projects, contact, clear",
      about: "Jamie Clements is a passionate computer scientist with expertise in AI, blockchain, and web development.",
      skills: "Core skills: Python, JavaScript, Java, Machine Learning, Blockchain, Web Development",
      projects: "Featured projects: AI Chess Engine, Blockchain Voting System, Face Recognition App",
      contact: "Email: jamieclements72243@email.com | LinkedIn: linkedin.com/in/jamie-clements | GitHub: github.com/jamie-clements",
      clear: "Clearing the terminal..."
    };
  
    input.addEventListener('keyup', function(event) {
      if (event.key === 'Enter') {
        const command = input.value.toLowerCase();
        terminal.innerHTML += `<p>> ${input.value}</p>`;
        
        if (command === 'clear') {
          setTimeout(() => {
            terminal.innerHTML = 'Clearing terminal... Type Help For More Options';
          }, 500);
        } else if (commands[command]) {
          terminal.innerHTML += `<p>${commands[command]}</p>`;
        } else {
          terminal.innerHTML += `<p>Command not recognized. Type 'help' for available commands.</p>`;
        }
  
        input.value = '';
        terminal.scrollTop = terminal.scrollHeight;
      }
    });
  
    // Smooth scrolling for navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
  
        document.querySelector(this.getAttribute('href')).scrollIntoView({
          behavior: 'smooth'
        });
      });
    });
  
    // Handle active nav item
    const navLinks = document.querySelectorAll('nav ul li a');
    const sections = document.querySelectorAll('section');
  
    window.addEventListener('scroll', () => {
      let current = '';
      sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= sectionTop - sectionHeight / 3) {
          current = section.getAttribute('id');
        }
      });
  
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
          link.classList.add('active');
        }
      });
  
      // Handle navbar opacity
      const header = document.querySelector('header');
      if (window.scrollY > 100) {
        header.classList.add('navbar-scrolled');
      } else {
        header.classList.remove('navbar-scrolled');
      }
    });
    
    // Particles.js configuration
    particlesJS("particles-js", {
      particles: {
        number: { value: 80, density: { enable: true, value_area: 800 } },
        color: { value: "#ffffff" },
        shape: { type: "circle", stroke: { width: 0, color: "#000000" }, polygon: { nb_sides: 5 }, image: { src: "img/github.svg", width: 100, height: 100 } },
        opacity: { value: 0.5, random: false, anim: { enable: false, speed: 1, opacity_min: 0.1, sync: false } },
        size: { value: 3, random: true, anim: { enable: false, speed: 20, size_min: 0.1, sync: false } },
        line_linked: { enable: true, distance: 150, color: "#ffffff", opacity: 0.4, width: 1 },
        move: { 
          enable: true, 
          speed: 1,
          direction: "none", 
          random: false, 
          straight: false, 
          out_mode: "out", 
          bounce: false, 
          attract: { enable: false, rotateX: 600, rotateY: 1200 } 
        }
      },
      interactivity: {
        detect_on: "canvas",
        events: {
          onhover: { enable: true, mode: "repulse" },
          onclick: { enable: true, mode: "push" },
          resize: true
        },
        modes: {
          grab: { distance: 400, line_linked: { opacity: 1 } },
          bubble: { distance: 400, size: 40, duration: 2, opacity: 8, speed: 0 },
          repulse: { distance: 200, duration: 0.4 },
          push: { particles_nb: 4 },
          remove: { particles_nb: 2 }
        }
      },
      retina_detect: true
    });
  });
  