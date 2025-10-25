/* ------------------------------------------------------------------
   Travel-Recommendation  •  script.js
   Task 6:  fetch the JSON data and render recommendation “cards”
   ------------------------------------------------------------------ */

/**
 * Entry-point: wait for the DOM to be ready, then fetch data.
 */
document.addEventListener('DOMContentLoaded', () => {
    // Path is relative to travel_recommendation.html
    const DATA_URL = 'travel_recommendation_api.json';
  
    fetch(DATA_URL)
      .then(response => {
        if (!response.ok) throw new Error(`HTTP-error ${response.status}`);
        return response.json();
      })
      .then(json => {
        console.log('✔ Travel data fetched:', json);
        renderRecommendations(json);
      })
      .catch(err => console.error('✖ Unable to fetch travel data →', err));
  });
  
  /* ------------------------------------------------------------------
     Render logic
     ------------------------------------------------------------------ */
  
  /**
   * Given the full JSON object, extract every item that has
   *   name • imageUrl • description
   * and append a card to the grid for each.
   */
  function renderRecommendations(data) {
    const grid = ensureGrid();      // Get (or create) the host <div>
  
    // --- Countries → cities
    data.countries?.forEach(country =>
      country.cities?.forEach(city => grid.appendChild(makeCard(city)))
    );
  
    // --- Temples
    data.temples?.forEach(t => grid.appendChild(makeCard(t)));
  
    // --- Beaches
    data.beaches?.forEach(b => grid.appendChild(makeCard(b)));
  }
  
  /**
   * Create and return one DOM node representing a recommendation.
   * @param {Object} obj  { name, imageUrl, description }
   */
  function makeCard({ name, imageUrl, description }) {
    const card = document.createElement('div');
    card.className = 'card';
  
    // Defensive fallback if an image is missing
    const imgSrc = imageUrl || 'https://via.placeholder.com/300x180?text=No+Image';
  
    card.innerHTML = `
        <img src="${imgSrc}" alt="${name}">
        <h4>${name}</h4>
        <p>${description}</p>`;
    return card;
  }
  
  /**
   * Guarantee that the grid container exists and has minimal styling.
   * Returns that element.
   */
  function ensureGrid() {
    let grid = document.getElementById('rec_grid');
    if (!grid) {
      grid = document.createElement('div');
      grid.id = 'rec_grid';
      document.body.appendChild(grid);
    }
  
    /* light, in-file CSS so the cards don’t “stick” together
       (remove if you already added these styles in a .css file) */
    if (!document.getElementById('rec_grid_style')) {
      const css = document.createElement('style');
      css.id = 'rec_grid_style';
      css.textContent = `
        #rec_grid{
          display:grid;
          grid-template-columns:repeat(auto-fill,minmax(240px,1fr));
          gap:1rem;
          padding:1.5rem;
        }
        #rec_grid .card{
          border:1px solid #ccc;
          border-radius:.5rem;
          overflow:hidden;
          box-shadow:0 2px 6px rgba(0,0,0,.1);
          background:#fff;
          transition:transform .15s ease-in-out;
        }
        #rec_grid .card:hover{ transform:translateY(-4px); }
        #rec_grid img{
          width:100%;
          height:160px;
          object-fit:cover;
        }
        #rec_grid h4{
          margin:.75rem 1rem .25rem;
          font-size:1.05rem;
          color:#333;
        }
        #rec_grid p{
          margin:0 1rem 1rem;
          font-size:.9rem;
          color:#555;
        }`;
      document.head.appendChild(css);
    }
    return grid;
  }
  