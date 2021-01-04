import{useState, useEffect} from 'react'
import './App.css';
import {InfoBox,Map,Table,LineGraph} from './components'
import{FormControl,Select,MenuItem,Card,CardContent, Paper,Switch} from '@material-ui/core'
import{createMuiTheme, ThemeProvider} from '@material-ui/core/styles'
import {sortData,prettyPrintStat}from './components/util'
import numeral from 'numeral'
import "leaflet/dist/leaflet.css";

function App() {
  const darkTheme = createMuiTheme({
    palette: {
      type:  'dark',
      
    },
  })

  const lightTheme = createMuiTheme({})
  const [darkMode, setDarkMode] =useState(false)
   const [countries, setCountries] = useState([])
   const [country, setCountry] = useState('worldwide')
   const [countryInfo, setCountryInfo] = useState({})
   const [tableData, setTableData] = useState([])
   const[mapCenter, setMapCenter] = useState({lat: 34.80746, lng: -40.4796})
   const[mapZoom, setMapZoom] = useState(3)
   const[mapCountries, setMapCountries] =useState([])
   const[casesType,setCasesType] = useState('cases')

  useEffect(() => {
    fetch('https://disease.sh/v3/covid-19/all') 
    .then((response) => response.json())
    .then((data) => {
      setCountryInfo(data)
    })
  }, [])

  useEffect(() => { 
    const getCountriesData = async () => {
      await fetch('https://disease.sh/v3/covid-19/countries')
      .then((response) => response.json())
      .then((data) => {
        const countries = data.map((country) => ({
            name: country.country,
            value: country.countryInfo.iso2,
          }))

          let sortedData = sortData(data)
          setTableData(sortedData)
          setMapCountries(data)
          setCountries(countries)
      })
    }
    getCountriesData()
  }, [])

  const onCountryChange = async e => {
    const countryCode = e.target.value;
    setCountry(countryCode)

    const url = countryCode === 'worldwide' 
    ? 'https://disease.sh/v3/covid-19/all' 
    :`https://disease.sh/v3/covid-19/countries/${countryCode}`

    await fetch(url)
    .then((response) => response.json())
    .then(data => {
      setCountry(countryCode)
      setCountryInfo(data)
      setMapCenter([data.countryInfo.lat, data.countryInfo.long])
      setMapZoom(4)
    })
  }
  
  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <Paper style={{height: '120vh'}}>
    <div className="app">
      <Switch checked={darkMode} onChange={() => setDarkMode(!darkMode)} />
      <div className="app__left">
      <div className="app__header">
      <h1>Covid-19 Tracker</h1>
        <FormControl className='app_dropdown'>
          <Select variant ='outlined' 
          onChange={onCountryChange}
          value={country}>

            <MenuItem value='worldwide'>Worldwide</MenuItem>
            {
              countries.map((country) => (
              <MenuItem value={country.value}>{country.name}</MenuItem>
              ))
            }
          </Select> 
        </FormControl>
      </div>

      <div className="app__stats">
        <InfoBox 
        isRed
        active={casesType ==='cases'}
        onClick={e => setCasesType('cases')}
        title='Coronavirus Cases' 
        cases={prettyPrintStat(countryInfo.todayCases)} 
        total={numeral(countryInfo.cases).format('0.0a')}
        />
        <InfoBox 
        active={casesType ==='recovered'}
        onClick={e => setCasesType('recovered')}
        title='Recovered' 
        cases={prettyPrintStat(countryInfo.todayRecovered)} 
        total={numeral(countryInfo.recovered).format('0.0a')} 
        />
        <InfoBox 
        isBlack
        active={casesType ==='deaths'}
        onClick={e => setCasesType('deaths')}
        title='Deaths'  
        cases={prettyPrintStat(countryInfo.todayDeaths)} 
        total={numeral(countryInfo.deaths).format('0.0a')}
        />
      </div>
        <Map 
        casesType={casesType}
        countries={mapCountries}
        center={mapCenter}
        zoom={mapZoom}
        />
      </div>
            <Card className='app__right'>
              <CardContent>
                  <h3>Live Cases by Country</h3>
                    <Table countries={tableData} />
                  <h3 className='app__graphTitle'>Worldwide new {casesType}</h3>
                  <LineGraph casesType={casesType} />
              </CardContent>
            </Card>
     

      
    </div>
    </Paper>
    </ThemeProvider>
  );
}

export default App;
