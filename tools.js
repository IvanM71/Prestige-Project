class Tool {
    constructor(map) {
        this.map = map;

        this.onMouseClickHandler = this.onMouseClick.bind(this);
        this.onMouseUpHandler = this.onMouseUp.bind(this);
        this.onMouseDownHandler = this.onMouseDown.bind(this);
        this.onMouseDragHandler = this.onMouseDrag.bind(this);
    }

    activate() {
        this.map.on('click', this.onMouseClickHandler);
        this.map.on('mouseup', this.onMouseUpHandler);
        this.map.on('mousedown', this.onMouseDownHandler);
        this.map.on('mousemove', this.onMouseDragHandler);
        console.log("tool activated!");
    }

    deactivate() {
        this.map.off('click', this.onMouseClickHandler);
        this.map.off('mouseup', this.onMouseUpHandler);
        this.map.off('mousedown', this.onMouseDownHandler);
        this.map.off('mousemove', this.onMouseDragHandler);
        console.log("tool deactivated!");
    }

    onMouseClick(e) {}
    onMouseDown(e) {}
    onMouseUp(e) {}
    onMouseDrag(e) {}
}

class ViewTool extends Tool {
    onMouseClick(e) {
        console.log("click");
    }
}

class PencilTool extends Tool {
    onMouseClick(e) {
        console.log("click");
    }
}


class PointTool extends Tool {
    onMouseClick(e) {
        var m = L.marker(e.latlng).addTo(this.map);
        L.DomEvent.on(m, 'click', function (ev) {
            L.DomEvent.stopPropagation(ev);
        });
        // m.bindPopup("<b>Hello world!</b><br>I am a popup.").openPopup();
    }
}

class LineTool extends Tool {
    constructor(map) {
        super(map);
        this.latlngs = [];
        this.currentPolyline = null; // The polyline currently being drawn
        this.drawing = false; // Flag to track drawing state
    }

    onMouseClick(e) {
        if (!this.drawing) {
            // Start drawing the line
            this.drawing = true;
            this.latlngs = [e.latlng];
            this.currentPolyline = L.polyline(this.latlngs, { color: 'blue' }).addTo(this.map);
            console.log("Line drawing started!");
        } else {
            // Finish the line
            this.drawing = false;
            this.latlngs.push(e.latlng); // Add the final point
            this.currentPolyline.setLatLngs(this.latlngs); // Update the polyline
            this.currentPolyline = null;
            console.log("Line drawing finished!");
        }
    }

    onMouseDrag(e) {
        if (this.drawing && this.currentPolyline) {
            // Update the polyline to follow the mouse movement
            const updatedLatlngs = [...this.latlngs, e.latlng];
            this.currentPolyline.setLatLngs(updatedLatlngs);
        }
    }

    activate() {
        super.activate();
        console.log("Line tool activated!");
    }

    deactivate() {
        super.deactivate();
        // Reset the state if the tool is deactivated while drawing
        if (this.drawing) {
            this.drawing = false;
            this.latlngs = [];
            if (this.currentPolyline) {
                this.map.removeLayer(this.currentPolyline);
                this.currentPolyline = null;
            }
            console.log("Line tool deactivated mid-draw, resetting.");
        }
    }
}

class CircleTool extends Tool {
    constructor(map) {
        super(map);
        this.center = null; // The starting point of the circle
        this.previewCircle = null; // The translucent circle being drawn
        this.drawing = false; // Flag to track drawing state
    }

    onMouseClick(e) {
        if (!this.drawing) {
            // Start drawing the circle
            this.drawing = true;
            this.center = e.latlng;
            this.previewCircle = L.circle(this.center, {
                radius: 0, // Initial radius is zero
                color: 'blue',
                fillColor: 'blue',
                fillOpacity: 0.3, // Translucent appearance
            }).addTo(this.map);
            console.log("Circle drawing started!");
        } else {
            // Finish the circle
            this.drawing = false;
            const radius = this.map.distance(this.center, e.latlng);
            //this.previewCircle.setStyle({ fillOpacity: 1.0 }); // Make the circle fully opaque
            this.previewCircle.setRadius(radius); // Set final radius
            this.previewCircle = null;
            this.center = null;
            console.log("Circle drawing finished!");
        }
    }

    onMouseDrag(e) {
        if (this.drawing && this.previewCircle) {
            // Update the radius of the preview circle
            const radius = this.map.distance(this.center, e.latlng);
            this.previewCircle.setRadius(radius);
        }
    }

    activate() {
        super.activate();
        console.log("Circle tool activated!");
    }

    deactivate() {
        super.deactivate();
        // Reset the state if the tool is deactivated while drawing
        if (this.drawing) {
            this.drawing = false;
            this.center = null;
            if (this.previewCircle) {
                this.map.removeLayer(this.previewCircle);
                this.previewCircle = null;
            }
            console.log("Circle tool deactivated mid-draw, resetting.");
        }
    }
}



class RectTool extends Tool {
    constructor(map) {
        super(map);
        this.startPoint = null; // The first corner of the square
        this.previewSquare = null; // The translucent square being drawn
        this.drawing = false; // Flag to track drawing state
    }

    onMouseClick(e) {
        if (!this.drawing) {
            // Start drawing the square
            this.drawing = true;
            this.startPoint = e.latlng;
            this.previewSquare = L.polygon([], {
                color: 'green',
                fillColor: 'green',
                fillOpacity: 0.3, // Translucent appearance
            }).addTo(this.map);
            console.log("Square drawing started!");
        } else {
            // Finalize the square
            this.drawing = false;
            //this.previewSquare.setStyle({ fillOpacity: 1.0 }); // Make the square fully opaque
            this.previewSquare = null;
            this.startPoint = null;
            console.log("Square drawing finished!");
        }
    }

    onMouseDrag(e) {
        if (this.drawing && this.previewSquare) {
            const endPoint = e.latlng;
            const points = this.calculateSquare(this.startPoint, endPoint);
            this.previewSquare.setLatLngs(points);
        }
    }

    calculateSquare(start, end) {
        // Determine the bounding box
        const minLat = Math.min(start.lat, end.lat);
        const maxLat = Math.max(start.lat, end.lat);
        const minLng = Math.min(start.lng, end.lng);
        const maxLng = Math.max(start.lng, end.lng);

        // Return the four corners of the square
        return [
            [minLat, minLng], // Bottom-left
            [minLat, maxLng], // Bottom-right
            [maxLat, maxLng], // Top-right
            [maxLat, minLng], // Top-left
        ];
    }

    activate() {
        super.activate();
        console.log("Square tool activated!");
    }

    deactivate() {
        super.deactivate();
        // Reset the state if the tool is deactivated while drawing
        if (this.drawing) {
            this.drawing = false;
            if (this.previewSquare) {
                this.map.removeLayer(this.previewSquare);
                this.previewSquare = null;
            }
            this.startPoint = null;
            console.log("Square tool deactivated mid-draw, resetting.");
        }
    }
}


class PolygonTool extends Tool {
    constructor(map) {
        super(map);
        this.latlngs = [];  // Координаты точек
        this.currentPolygon = null;  // Рисуемая фигура
        this.circleMarker = null;  // Маленький круг для первой точки
    }

    activate() {
        super.activate();
        this.map.on('click', this.onMapClick.bind(this));  // Слушаем клик по карте
        this.map.on('mousemove', this.onMouseMove.bind(this));  // Слушаем движение мыши
    }

    deactivate() {
        super.deactivate();
        if (this.drawing) {
            this.removeShape();  // Убираем фигуру, если не завершена
        }
        this.map.off('click', this.onMapClick.bind(this));
        this.map.off('mousemove', this.onMouseMove.bind(this));
    }

    onMapClick(e) {
        if (!this.drawing) {
            // Начинаем рисовать полигон
            this.drawing = true;
            this.latlngs = [e.latlng];  // Первая точка
            this.circleMarker = L.circleMarker(e.latlng, { radius: 5, color: 'red' }).addTo(this.map);  // Маленький круг
        } else {
            // Если клик по кругу, замкнуть полигон
            if (this.circleMarker && e.latlng.distanceTo(this.circleMarker.getLatLng()) < 10) {
                this.finishPolygon();
            } else {
                // Добавляем точки для полигона
                this.latlngs.push(e.latlng);
                this.updatePolygon();
            }
        }
    }

    onMouseMove(e) {
        if (this.drawing && this.latlngs.length > 0) {
            // Обновляем линию, тянущуюся за мышью
            const lastLatLng = this.latlngs[this.latlngs.length - 1];
            this.updatePolygon(lastLatLng, e.latlng);
        }
    }

    updatePolygon(startLatLng, endLatLng = null) {
        // Если полигон рисуется, обновляем линии
        if (this.currentPolygon) {
            this.map.removeLayer(this.currentPolygon);
        }
        const points = this.latlngs.concat(endLatLng || []);
        this.currentPolygon = L.polygon(points, { color: 'blue', fillOpacity: 0 }).addTo(this.map);
    }

    finishPolygon() {
        // Заканчиваем рисовать полигон
        this.latlngs.push(this.latlngs[0]);  // Замкнули полигон
        this.currentPolygon.setLatLngs(this.latlngs);
        this.currentPolygon.setStyle({ fillOpacity: 0.3, color: 'blue' });  // Прозрачное заполнение
        this.circleMarker.remove();  // Убираем круг
        console.log("Polygon finished!");
        this.drawing = false;  // Завершаем рисование
    }

    removeShape() {
        if (this.currentPolygon) {
            this.map.removeLayer(this.currentPolygon);
            this.currentPolygon = null;
        }
        if (this.circleMarker) {
            this.map.removeLayer(this.circleMarker);
            this.circleMarker = null;
        }
        this.drawing = false;
    }
}