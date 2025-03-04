export type Pos = {
  La: number;
  Ma: number;
};

export type LatLngFunctions = {
  getLat: () => number;
  getLng: () => number;
};

export interface KaKaoMapMouseEvent {
  latLng: Pos & LatLngFunctions;
  point: { x: number; y: number };
}

export interface KakaoMap {
  getCenter: () => LatLngFunctions;
  setLevel: (level: number, options?: { anchor: any }) => void;
  setCenter: (pos: Pos) => LatLngFunctions;
  panTo: (pos: Pos) => LatLngFunctions;
  getLevel: () => number;
  relayout: VoidFunction;
  addOverlayMapTypeId: (data: any) => void;
  getProjection: () => any;
  setDraggable: (draggable: boolean) => void;
  setZoomable: (zoomable: boolean) => void;
}

export interface KakaoMarker {
  setPosition: (data: Pos & LatLngFunctions) => void;
  getPosition: () => Pos;
  setImage: (img: any) => void;
  setMap: (data: KakaoMap | null | number) => void;
  getTitle: () => string;
  setVisible: (visible: boolean) => void;
  Gb: string;
}

export interface Qa {
  La: number;
  Ma: number;
}

export interface KakaoLatLng {
  center: Qa;
  level: number;
  maxLevel: number;
}

export type KakaoPlace = {
  address_name: string;
  category_group_code: string;
  category_group_name: string;
  category_name: string;
  distance: string;
  id: string;
  phone: string;
  place_name: string;
  place_url: string;
  road_address_name: string;
  x: string;
  y: string;
};

export type KakaoPagination = {
  totalCount: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  first: number;
  current: number;
  last: number;
  perPage: number;
  nextPage: VoidFunction;
  prevPage: VoidFunction;
};
