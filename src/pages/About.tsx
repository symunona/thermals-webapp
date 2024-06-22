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
            <h2>thermal.tmpx.space DEMO</h2>
            <p>
                It's like <a target="_blank" href="https://thermal.kk7.ch">thermal.kk7.ch</a>,
                except it's 3D!
            </p>
            <p>
                A map which shows where the thermals were before based on flights already done.
            </p>
            <p>
                I made this to understand how to fly cross country and navigate
                landscapes I have not flown yet all around the world.
            </p>
            <p>
                For now, I only have a list of regions I compiled from
                the data I already have.
            </p>
            <div>
                Roadmap:
                <ul>
                  <li>Add more data</li>
                  <li>Add filters: time of day, day of year</li>
                  <li>Create a proper 3d tile server for dynamic loading</li>
                  <li>FPS Mode: Real time navigation to where you are</li>
                </ul>
            </div>
            <p>
                Safe flights!<br/>
                the dude
            </p>
            </div>
        </div>
      </div>
    );
  };