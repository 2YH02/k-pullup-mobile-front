import type { KakaoMap } from "@/types/kakao-map.types";

class MapWalker {
  walker: any;
  content: HTMLElement;
  startX: any;
  startY: any;
  startOverlayPoint: any;
  map: KakaoMap;
  roadview: any;
  roadviewClient: any;
  newPos: any;
  prevPos: any;

  constructor(
    position: any,
    map: KakaoMap,
    roadview: any,
    roadviewClient: any
  ) {
    const content: HTMLElement = document.createElement("div");
    const figure: HTMLElement = document.createElement("div");
    const angleBack: HTMLElement = document.createElement("div");

    content.className = "MapWalker";
    figure.className = "figure";
    angleBack.className = "angleBack";

    content.appendChild(angleBack);
    content.appendChild(figure);

    const walker = new window.kakao.maps.CustomOverlay({
      position,
      content,
      yAnchor: 1,
    });

    this.walker = walker;
    this.content = content;
    this.map = map;

    this.roadviewClient = roadviewClient;
    this.roadview = roadview;

    this.newPos;
    this.prevPos;

    this.onMouseUp = this.onMouseUp.bind(this);
    this.toggleRoadview = this.toggleRoadview.bind(this);
  }

  setAngle(angle: any) {
    const threshold = 22.5;
    for (let i = 0; i < 16; i++) {
      if (angle > threshold * i && angle < threshold * (i + 1)) {
        const className = "m" + i;
        this.content.className = this.content.className.split(" ")[0];
        this.content.className += " " + className;
        break;
      }
    }
  }

  setPosition(position: any) {
    this.walker.setPosition(position);
    this.newPos = position;
  }

  setPrevPosition(position: any) {
    this.walker.setPosition(position);
    this.prevPos = position;
  }

  setMap() {
    this.walker.setMap(this.map);
  }

  onMouseUp() {
    this.toggleRoadview();
  }

  addEventHandle(target: any, type: any, callback: any) {
    if (target.addEventListener) {
      target.addEventListener(type, callback);
    } else {
      target.attachEvent("on" + type, callback);
    }
  }

  removeEventHandle(target: any, type: any, callback: any) {
    if (target.removeEventListener) {
      target.removeEventListener(type, callback);
    } else {
      target.detachEvent("on" + type, callback);
    }
  }

  toggleRoadview() {
    if (!this.newPos || this.newPos === this.prevPos) return;

    this.roadviewClient.getNearestPanoId(this.newPos, 50, (panoId: number) => {
      if (panoId === null) {
        this.walker.setPosition(this.prevPos);
        if (this.map) this.map.setCenter(this.prevPos);
      } else {
        this.prevPos = this.newPos;
        this.walker.setPosition(this.newPos);

        this.roadview.setPanoId(panoId, this.newPos);
        this.roadview.relayout();
      }
      this.map.relayout();
    });
  }
}

export default MapWalker;
