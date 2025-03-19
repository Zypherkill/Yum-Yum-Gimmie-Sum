
export function showLocation() {
    document.addEventListener("DOMContentLoaded", function () {
        const map = L.map('map', {
            zoomControl: false // Stängde av zoom knapparna för dom gick igenom dropdown menyn
        }).setView([59.3793, 13.5036], 13); // Startposition
        
        // Ladda OpenStreetMap-lager
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors'
        }).addTo(map);

        // Generera en slumpmässig position inom viss radius
        function getRandomLocation(center, radius) {
            const y0 = center.lat;
            const x0 = center.lng;
            const rd = radius / 111300;  // Radius 

            const u = Math.random();
            const v = Math.random();
            const w = rd * Math.sqrt(u);
            const t = 2 * Math.PI * v;
            const x = w * Math.cos(t);
            const y = w * Math.sin(t);

            return { lat: y0 + y, lng: x0 + x };
        }

        // Uppdatera foodtruckens position (slumpmässig vid laddning av sidan)
        const randomLocation = getRandomLocation({ lat: 59.3793, lng: 13.5036 }, 1500); // Slumpad plats inom 1.5km
        map.setView([randomLocation.lat, randomLocation.lng], 13); // Kartans vy

        // Foodtruckens marker 
        L.marker([randomLocation.lat, randomLocation.lng]).addTo(map)
            .bindPopup("Här är vi idag!")
            .openPopup();
    });
}