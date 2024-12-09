class MapEditor {
    constructor() {
        const openStreetTL = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '© OpenStreetMap contributors'
        });
        const googleHybridTL = L.tileLayer('http://{s}.google.com/vt?lyrs=s,h&x={x}&y={y}&z={z}', {
            maxZoom: 20,
            subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
        });
        const googleSat = L.tileLayer('http://{s}.google.com/vt?lyrs=s&x={x}&y={y}&z={z}', {
            maxZoom: 20,
            subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
        });

        this.map = L.map('map').setView([51.505, -0.09], 13);
        googleSat.addTo(this.map);


        this.drawMode = null;

        this.map.on('click', this.HandleMapClick.bind(this));

        this.SetupButtons();
    }

    SetupButtons() {
        document.getElementById('tool_circle').addEventListener('click', () => {
            this.drawMode = DrawMode.Circle;
        });
        document.getElementById('tool_shape').addEventListener('click', () => {
            this.drawMode =  DrawMode.Shape;
        });
        document.getElementById('tool_point').addEventListener('click', () => {
            this.drawMode = DrawMode.Point;
        });
        document.getElementById('tool_line').addEventListener('click', () => {
            this.drawMode = DrawMode.Line;
        });
        document.getElementById('tool_pencil').addEventListener('click', () => {
            this.drawMode = DrawMode.Pencil;
        });
    }


    HandleMapClick(e) {
        switch (this.drawMode) {
            case 'circle':
                L.circle(e.latlng, { radius: 200 }).addTo(this.map);
                break;
            case 'circle':
                L.circle(e.latlng, { radius: 200 }).addTo(this.map);
                break;
            case 'circle':
                L.circle(e.latlng, { radius: 200 }).addTo(this.map);
                break;
            case 'circle':
                L.circle(e.latlng, { radius: 200 }).addTo(this.map);
                break;
            case 'shape':
                const bounds = [
                    [e.latlng.lat - 0.01, e.latlng.lng - 0.01],
                    [e.latlng.lat + 0.01, e.latlng.lng + 0.01],
                ];
                L.rectangle(bounds, { color: "blue", weight: 2 }).addTo(this.map);
                break;
            default:
            // code block
        }

        if (this.drawMode === 'circle') {

        } else if (this.drawMode === 'shape') {

        }
    }
}

// Инициализация MapEditor
document.addEventListener('DOMContentLoaded', function () {
    const editor = new MapEditor();
});

const DrawMode = {
    Point: 'point',
    Line: 'line',
    Circle: 'circle',
    Shape: 'shape',
    Pencil: 'pencil',
};