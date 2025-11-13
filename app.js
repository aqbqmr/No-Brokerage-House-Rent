const SAMPLE_LISTINGS = [
  { id:'1', title:'Near DGI Greater Noida - Private Room', address:'#27, APJ Abdul Kalam Road, Knowledge Park-III, Greater Noida, UP - 201306', rent:6500, type:'Room', image:'https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=1200&q=80', college:'DGI' },
  { id:'2', title:'PG for Boys - Near DGI College', address:'Alpha-1, Knowledge Park-III, Greater Noida (near DGI), UP - 201306', rent:5500, type:'PG', image:'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80', college:'DGI' },
  { id:'3', title:'Room near NIET College', address:'19, Knowledge Park-II, Institutional Area, Greater Noida, UP - 201306', rent:6000, type:'Room', image:'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80', college:'NIET' },
  { id:'4', title:'Furnished Apartment near NIET', address:'Omega 1 / Knowledge Park-II area, Greater Noida, UP - 201306', rent:15500, type:'Apartment', image:'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80', college:'NIET' },
  { id:'5', title:'PG near Galgotias University', address:'Plot No.2, Sector 17-A, Yamuna Expressway, Greater Noida, Gautam Buddh Nagar - 203201', rent:7000, type:'PG', image:'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80', college:'Galgotias' },
  { id:'6', title:'2BHK near Galgotias Campus', address:'Gamma 1 / Knowledge Park-II area, Greater Noida, UP', rent:18000, type:'Apartment', image:'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1200&q=80', college:'Galgotias' },
  { id:'7', title:'Room near Jamia Millia Islamia', address:'Jamia Nagar, Okhla, New Delhi - 110025', rent:8000, type:'Room', image:'https://images.unsplash.com/photo-1586105251261-72a756497a11?auto=format&fit=crop&w=1200&q=80', college:'Jamia' },
  { id:'8', title:'Furnished Apartment near Jamia University', address:'Abul Fazal Enclave / Jamia Nagar, New Delhi - 110025', rent:16000, type:'Apartment', image:'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1200&q=80', college:'Jamia' },
  { id:'9', title:'Near Gurugram Tech Hub - Private Room', address:'Sector 48 / Candor TechSpace area, Gurugram, Haryana', rent:12000, type:'Room', image:'https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=1200&q=80', college:'Gurugram' },
  { id:'10', title:'Room near Batla House (Okhla) - Secure PG', address:'Batla House, Jamia Nagar, New Delhi - 110025', rent:7500, type:'PG', image:'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1200&q=80', college:'Batla House' }
]

const STORAGE_KEY = 'sr_listings_v3'

// localStorage helpers
function getListings(){
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(SAMPLE_LISTINGS))
    return SAMPLE_LISTINGS.slice()
  }
  try { return JSON.parse(raw) } catch(e) { return SAMPLE_LISTINGS.slice() }
}
function saveListings(arr){ localStorage.setItem(STORAGE_KEY, JSON.stringify(arr)) }
function resetListingsToSample(){ localStorage.setItem(STORAGE_KEY, JSON.stringify(SAMPLE_LISTINGS)); location.reload() }

// util
function escapeHtml(s){ return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c]) }
function collegeClass(college){ return 'college-' + (college || 'other').toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g,'') }

// render card
function makeCardHtml(listing){
  const cClass = collegeClass(listing.college)
  return `
    <article class="listing-card ${cClass}">
      <div class="media"><img src="${listing.image}" alt="${escapeHtml(listing.title)}"></div>
      <div class="listing-body">
        <div>
          <h3>${escapeHtml(listing.title)}</h3>
          <p>${escapeHtml(listing.address)}</p>
          <div class="badge-college">${escapeHtml(listing.college || '')}</div>
        </div>
        <div style="text-align:right">
          <div class="price">₹${listing.rent}</div>
          <div style="margin-top:8px"><a href="listing.html?id=${listing.id}">View</a></div>
        </div>
      </div>
    </article>
  `
}

// HOME
function initHome(){
  const searchInput = document.getElementById('searchInput')
  const rentRange = document.getElementById('rentRange')
  const rentValue = document.getElementById('rentValue')
  const typeSelect = document.getElementById('typeSelect')
  const collegeSelect = document.getElementById('collegeSelect')
  const grid = document.getElementById('listingsGrid')
  const noResults = document.getElementById('noResults')
  const resetBtn = document.getElementById('resetListingsBtn')

  rentValue.textContent = rentRange.value

  function populateCollegeDropdown(){
    const listings = getListings()
    const seen = {}
    collegeSelect.innerHTML = '<option value="">All Colleges</option>'
    listings.forEach(l => {
      if (!l.college) return
      if (!seen[l.college]) {
        seen[l.college] = true
        const opt = document.createElement('option')
        opt.value = l.college
        opt.textContent = l.college
        collegeSelect.appendChild(opt)
      }
    })
  }

  function render(){
    const q = (searchInput.value || '').toLowerCase().trim()
    const maxRent = Number(rentRange.value)
    const type = typeSelect.value
    const college = collegeSelect.value
    let items = getListings().filter(l => {
      if (l.rent > maxRent) return false
      if (type && l.type !== type) return false
      if (college && l.college !== college) return false
      if (!q) return true
      return (l.title + ' ' + l.address + ' ' + (l.college||'')).toLowerCase().includes(q)
    })
    grid.innerHTML = items.map(makeCardHtml).join('')
    noResults.style.display = items.length ? 'none' : 'block'
  }

  searchInput.addEventListener('input', render)
  rentRange.addEventListener('input', () => { rentValue.textContent = rentRange.value; render() })
  typeSelect.addEventListener('change', render)
  collegeSelect.addEventListener('change', render)
  resetBtn.addEventListener('click', () => {
    if (confirm('Reset saved listings to default sample data?')) resetListingsToSample()
  })

  populateCollegeDropdown()
  render()
}

// DETAIL
function initDetail(){
  const detailArea = document.getElementById('detailArea')
  const params = new URLSearchParams(location.search)
  const id = params.get('id')
  const listings = getListings()
  const listing = listings.find(l => l.id === id)
  if (!listing) {
    detailArea.innerHTML = `<p>Listing not found. <a href="index.html">Back to home</a></p>`
    return
  }

  detailArea.innerHTML = `
    <div class="detail-hero">
      <div class="gallery">
        <img src="${listing.image}" alt="">
        <img src="${listing.image}" alt="">
      </div>
      <div class="card">
        <div class="detail-meta">
          <div>
            <h2 style="margin:0">${escapeHtml(listing.title)}</h2>
            <div style="color:#6b7280">${escapeHtml(listing.address)}</div>
            <div style="margin-top:8px" class="badge-college-large">${escapeHtml(listing.college || '')}</div>
          </div>
          <div style="text-align:right">
            <div style="font-size:20px;font-weight:700">₹${listing.rent}</div>
            <div style="color:#6b7280">${escapeHtml(listing.type)}</div>
          </div>
        </div>
        <hr style="margin:12px 0" />
        <p>This is a demo listing saved in your browser (localStorage).</p>
        <div style="margin-top:12px">
          <button class="btn-primary" onclick="contactOwner()">Contact Owner</button>
          <a class="btn-ghost" href="index.html" style="margin-left:8px">Back</a>
        </div>
      </div>
    </div>
  `
}

function contactOwner(){ alert('Demo: contact owner would open chat / call in real app.') }

// CREATE
function initCreate(){
  const form = document.getElementById('createForm')
  const msg = document.getElementById('createMsg')
  form.addEventListener('submit', e => {
    e.preventDefault()
    const fd = new FormData(form)
    const newItem = {
      id: Date.now().toString(),
      title: fd.get('title') || 'Untitled',
      address: fd.get('address') || '',
      rent: Number(fd.get('rent')||0),
      type: fd.get('type') || 'Room',
      image: fd.get('image') || 'https://images.unsplash.com/photo-1598928506312-3b3f1a43b3a0?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&s=8b6b1a3e6ef2a3d7e6a9d8a3b1f3c6c5',
      college: fd.get('college') || ''
    }
    const arr = getListings()
    arr.unshift(newItem)
    saveListings(arr)
    msg.style.display = 'block'
    msg.textContent = 'Listing saved locally. Go to Home to see it.'
    form.reset()
  })
}

// expose
window.initHome = initHome
window.initDetail = initDetail
window.initCreate = initCreate
window.resetListingsToSample = resetListingsToSample