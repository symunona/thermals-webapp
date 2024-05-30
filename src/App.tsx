
import { Component, onMount } from 'solid-js';
import { ITowns } from './maps/itowns';
import { MapLibre } from './maps/maplibre';
import { MapLibreDeck } from './maps/maplibre-deck';

export const App: Component = () => {

  return (
    <div class="h-screen w-screen">
      {/* <ITowns/> */}
      {/* <MapLibre/> */}
      <MapLibreDeck></MapLibreDeck>
    </div>
  );
};
