/* -----------------------------------------------------------
   TravelBloom · app.js
   Tasks 6–8  →  fetch, render, keyword search & recommendations
   ----------------------------------------------------------- */

   let travelData = null;   // JSON once loaded
   let grid = null;         // <div id="rec_grid">
   
   /* ---------- bootstrap ---------- */
   document.addEventListener('DOMContentLoaded', () => {
     const form   = document.getElementById('searchForm');
     const query  = document.getElementById('q');
     const reset  = document.getElementById('resetBtn');
   
     /* 1 | fetch once */
     fetch('travel_recommendation_api.json')
       .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })
       .then(json => {
         travelData = json;
         console.log('✔ travel data:', json);
         renderAll(json);                  // show everything on first load
       })
       .catch(err => console.error('✖ fetch failed →', err));
   
     /* 2 | search submit */
     form.addEventListener('submit', e => {
       e.preventDefault();
       const term = query.value.trim().toLowerCase();
       if (!term) { flash('Please enter a valid search query.'); return; }
       if (!travelData) { flash('Data still loading—try again.'); return; }
   
       filterAndRender(term);
       query.value = '';
     });
   
     /* 3 | clear button */
     reset.addEventListener('click', () => {
       query.value = '';
       flash('');
       clearGrid();
     });
   });
   
   /* ---------- grid helpers ---------- */
   function ensureGrid(){
     if (grid) return grid;
   
     const host = document.querySelector('.results-panel');   // right-side column
     grid = document.createElement('div');
     grid.id = 'rec_grid';
     host.appendChild(grid);
     return grid;
   }
   
   function makeCard({ name, imageUrl, description }){
     const card = document.createElement('div');
     card.className = 'card';
     card.innerHTML = `
       <img src="${imageUrl || 'https://via.placeholder.com/300x180?text=No+Image'}" alt="${name}">
       <h4>${name}</h4>
       <p>${description}</p>`;
     return card;
   }
   
   /* ---------- render everything ---------- */
   function renderAll(d){
     clearGrid();
     const g = ensureGrid();
     d.countries.forEach(c => c.cities.forEach(city => g.appendChild(makeCard(city))));
     d.temples .forEach(t => g.appendChild(makeCard(t)));
     d.beaches .forEach(b => g.appendChild(makeCard(b)));
   }
   
   /* ---------- keyword filter ---------- */
   function filterAndRender(term){
     clearGrid();
     const g = ensureGrid();
   
     const beachesKW   = ['beach','beaches'];
     const templesKW   = ['temple','temples'];
     const countriesKW = ['country','countries'];
   
     /* ① category words */
     if (beachesKW.includes(term)){ travelData.beaches.forEach(b => g.appendChild(makeCard(b))); return; }
     if (templesKW.includes(term)){ travelData.temples.forEach(t => g.appendChild(makeCard(t))); return; }
   
     /* ①-bis  country / countries → at least two recs */
     if (countriesKW.includes(term)){
       travelData.countries.slice(0,2).forEach(c =>
         c.cities.slice(0,1).forEach(city => g.appendChild(makeCard(city)))
       );
       return;
     }
   
     /* ② exact country name */
     const cHit = travelData.countries.find(c => c.name.toLowerCase() === term);
     if (cHit){ cHit.cities.forEach(city => g.appendChild(makeCard(city))); return; }
   
     /* ③ substring in any city */
     let found = false;
     travelData.countries.forEach(c =>
       c.cities.forEach(city => {
         if (city.name.toLowerCase().includes(term)){
           g.appendChild(makeCard(city));
           found = true;
         }
       })
     );
   
     if (!found) flash('No matches found. Try beach, temple, country, or city name.');
   }
   
   /* ---------- utilities ---------- */
   function clearGrid(){ ensureGrid().innerHTML = ''; }
   
   function flash(msg){
     let n = document.querySelector('.search-note');
     if (!n){
       n = document.createElement('p');
       n.className = 'search-note';
       n.style.cssText =
         'position:fixed;top:5rem;right:2rem;background:#333;padding:.45rem .8rem;'+
         'border-radius:4px;font-size:.9rem;color:#fff;opacity:.9;z-index:1000';
       document.body.appendChild(n);
     }
     n.textContent = msg;
   }
   