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
        this.map.locate({setView: true, maxZoom: 16});


        this.drawMode = null;

        this.map.on('click', this.HandleMapClick.bind(this));
        this.map.on('mouseup', this.HandleMapClick.bind(this));
        this.map.on('mousedown', this.HandleMapClick.bind(this));
        this.map.on('mousemove', this.HandleMapClick.bind(this));

        this.SetupButtons();
    }

    SetupButtons() {
        document.getElementById('tool_point').addEventListener('click', () => {
            this.drawMode = DrawMode.Point;
        });
        document.getElementById('tool_line').addEventListener('click', () => {
            this.drawMode = DrawMode.Line;
        });
        document.getElementById('tool_circle').addEventListener('click', () => {
            this.drawMode = DrawMode.Circle;
        });
        document.getElementById('tool_rect').addEventListener('click', () => {
            this.drawMode = DrawMode.Rect;
        });
        document.getElementById('tool_shape').addEventListener('click', () => {
            this.drawMode =  DrawMode.Shape;
        });
        document.getElementById('tool_pencil').addEventListener('click', () => {
            this.drawMode = DrawMode.Pencil;
        });
    }


    HandleMapClick(e) {
        switch (this.drawMode) {
            case DrawMode.Point:
                var m = L.marker(e.latlng).addTo(this.map);
                //m.bindPopup("<b>Hello world!</b><br>I am a popup.").openPopup();
                break;
            case DrawMode.Line:
                L.line(e.latlng, { radius: 200 }).addTo(this.map);
                break;
            case DrawMode.Circle:
                L.circle(e.latlng, { radius: 200 }).addTo(this.map);
                break;
            case DrawMode.Rect:
                const bounds = [
                    [e.latlng.lat - 0.01, e.latlng.lng - 0.01],
                    [e.latlng.lat + 0.01, e.latlng.lng + 0.01],
                ];
                L.rectangle(bounds, { color: "blue", weight: 2 }).addTo(this.map);
                break;
            case DrawMode.Shape:
                L.circle(e.latlng, { radius: 200 }).addTo(this.map);
                break;
            case DrawMode.Pencil:
                L.pencil(e.latlng, { radius: 200 }).addTo(this.map);
                break;
            default:
                console.log("Unknown tool!");
                break;
        }

        this.drawMode = null;
    }
}

// init class
document.addEventListener('DOMContentLoaded', function () {
    const editor = new MapEditor();
});

const DrawMode = {
    Point: 'point',
    Line: 'line',
    Circle: 'circle',
    Rect: 'rect',
    Shape: 'shape',
    Pencil: 'pencil',
};