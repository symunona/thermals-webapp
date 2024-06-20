import { createSignal } from "solid-js";
import './modals.css'

export function About(){
    const [showModal, setShowModal] = createSignal(false);

    return (<div class="menu-item" onClick={() => setShowModal(true)}>
        <a class="about">About</a>
        {showModal() && (
        <div class="modal-overlay" onClick={() => setShowModal(false)}>
          <div class="modal-wrapper" onClick={(e) => e.stopPropagation()}>
            <AboutModal />
            <button class="close-button" onClick={() => setShowModal(false)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>)
}


const AboutModal = () => {

    return (
      <div class="modal">
        <div class="modal-content">
            <div>
            <h2>thermals.tmpx.space DEMO</h2>
            <p>
                When I started flying, <a>thermal.kk7.ch</a> was
                an awesome resource as a rookie pilot. As I gained some
                experience and went off the map, I realized that the
                skyways are especially useful for planning XC flights but
                it would be even more useful to have the individual flights
                navigable in 3D to understand how a certain region works.
            </p>
            <p>
                This is my contribution to the flying community. I hope
                with this, you'll be able to understand how to navigate
                landscapes all around the world safely.
            </p>
            <p>
                For now, I only have a list of regions I compiled from
                the data I already scraped. Scraping goes on, and new data
                is being generated regularly, I hope I'll be able to create
                my proper 3d tile server eventually.
            </p>
            <p>
                Safe flights!<br/>
                the dude
            </p>
            </div>
        </div>
      </div>
    );
  };