
import { Component, onMount } from 'solid-js';
import { ITowns } from './maps/itowns';
import { MapLibre } from './maps/maplibre';

export const App: Component = () => {

  return (
    <div class="h-screen w-screen">
      {/* <ITowns/> */}
      <MapLibre/>
    </div>
  );
};
