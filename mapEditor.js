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
        this.map.locate({ setView: true, maxZoom: 16 });


        this.SetupButtons();
        this.drawMode = null;
        this.UpdateButtonStyle('tool_view');


        this.viewTool = new ViewTool(this.map);
        this.pointTool = new PointTool(this.map);
        this.lineTool = new LineTool(this.map);
        this.circleTool = new CircleTool(this.map);
        this.rectTool = new RectTool(this.map);
        this.shapeTool = new PolygonTool(this.map);
        this.pencilTool = new PencilTool(this.map);
    }

    SetupButtons() {
        document.getElementById('tool_view').addEventListener('click', () => {
            this.SelectTool(this.viewTool,'tool_view');
        });
        
        document.getElementById('tool_point').addEventListener('click', () => {
            this.SelectTool(this.pointTool,'tool_point');
        });

        document.getElementById('tool_line').addEventListener('click', () => {
            this.SelectTool(this.lineTool,'tool_line');
        });

        document.getElementById('tool_circle').addEventListener('click', () => {
            this.SelectTool(this.circleTool,'tool_circle');
        });

        document.getElementById('tool_rect').addEventListener('click', () => {
            this.SelectTool(this.rectTool,'tool_rect');
        });

        document.getElementById('tool_shape').addEventListener('click', () => {
            this.SelectTool(this.shapeTool,'tool_shape');
        });

        document.getElementById('tool_pencil').addEventListener('click', () => {
            this.SelectTool(this.pencilTool,'tool_pencil');
        });
    }

    DeactivateAllTools(){
        this.viewTool.deactivate();
        this.pointTool.deactivate();
        this.lineTool.deactivate();
        this.circleTool.deactivate();
        this.rectTool.deactivate();
        this.shapeTool.deactivate();
        this.pencilTool.deactivate();
    }

    SelectTool(tool, buttonName) {
        this.UpdateButtonStyle(buttonName);
        this.DeactivateAllTools();
        tool.activate();
    }

    UpdateButtonStyle(selectedButtonId) {
        const buttons = document.querySelectorAll('.tool-bar button');
        buttons.forEach(button => {
            button.classList.remove('selected');
        });

        const selectedButton = document.getElementById(selectedButtonId);
        selectedButton.classList.add('selected');
    }
}

// init class
document.addEventListener('DOMContentLoaded', function () {
    const editor = new MapEditor();
});
