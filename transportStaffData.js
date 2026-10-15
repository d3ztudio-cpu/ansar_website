// Initial 2026–27 transport roster imported from "Vehicle Staffs Details.xlsx".
// Google Sheets records with the same id override these values at runtime.
export const DEFAULT_TRANSPORT_STAFF = [
  ['1', 'Vinod Kumar K G', '9539625023', 'Girija', '9946710373'],
  ['2', 'Shaji', '9744013100', 'Sajitha', '8078846080'],
  ['3', 'Paramanathan', '9846460834', 'Sheeja', '7736363423'],
  ['4', 'Usman', '7592893985', 'Kavitha', '8075201233'],
  ['5', 'Babu T V', '9447709788', 'Preethidra', '9072078058'],
  ['6', 'Rudran K', '9048806827', 'Jamsheera', '9048499528'],
  ['7', 'Stephen', '9562619393', 'Sreeja', '9048529736'],
  ['8', 'Abdul Shukkoor', '8943001904', 'Ramya Rajesh', '8943568382'],
  ['9', 'Rajan C G', '9995546034', 'Thankamani', '9961659584'],
  ['10', 'Prasad', '9048708808', 'Shameena', '8891148619'],
  ['11', 'Muhammed Ali', '9961920095', 'Bindu', '9605082635'],
  ['12', 'Suresh', '9846119939', 'Sheeba', '9605850732'],
  ['13', 'Noushad', '9747999467', 'Vidya C K', '8838858735'],
  ['14', 'Muhammed E P', '9495404123', 'Chandramathi', '8593068561'],
  ['15', 'Ratnakumar', '7736189602', 'Preethi Ratnakumar', '9496516801'],
  ['AWC 16', 'Shaji', '9539383141', 'Anitha', '9048113292'],
  ['17', 'Raheem', '9645618867', 'Suhara', '9745917996'],
  ['18', 'Babu P K', '8281932759', 'Sowmini', '9061939371'],
  ['19', 'Jamal', '9645828264', 'Savithri', '9946520462'],
  ['20', 'Hyder Ali', '6235694995', 'Sabeena', '8138853457'],
  ['AWC 21', 'Noushad', '9947076148', 'Geetha', '9745683338'],
  ['22', 'Mohanan', '9539817477', 'Sabitha', '9746478744'],
  ['AWC 23', 'Ashraf', '9074869480', 'Shalini', '8086447428'],
  ['24', 'Muhammed Shafi', '9037146247', 'Faseela', '9037623354'],
  ['25', 'Baburaj', '9447943713', 'Sheeja', '8086620064'],
  ['26', 'Balan A P', '9447967962', 'Sujatha', '9048998864'],
  ['AWC 27', 'Farooq', '9846689533', 'Sindhu', '9539372901'],
  ['28', 'Muraleedharan', '9846151014', 'Jijitha', '8086026085'],
  ['29', 'Joshua', '9895134576', 'Sajitha', '9846503144']
].map(([busNumber, driverName, driverPhone, conductorName, conductorPhone], index) => ({
  id: `bus-${String(busNumber).toLowerCase().replace(/\s+/g, '-')}`,
  busNumber,
  driverName,
  driverPhone,
  conductorName,
  conductorPhone,
  order: index + 1,
  published: true
}));

export function mergeTransportStaff(savedRows = []) {
  const savedById = new Map(savedRows.map(item => [item.id, item]));
  const defaults = DEFAULT_TRANSPORT_STAFF.map(item => ({ ...item, ...(savedById.get(item.id) || {}) }));
  const extra = savedRows.filter(item => !DEFAULT_TRANSPORT_STAFF.some(defaultItem => defaultItem.id === item.id));
  return [...defaults, ...extra]
    .filter(item => item.published !== false)
    .sort((a, b) => Number(a.order || 0) - Number(b.order || 0));
}
