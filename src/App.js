import React from "react";
import "./App.css";
import Spotify from "./util/spotify.js";

// Handles the app's searchbar component
class Search extends React.Component {
  constructor(props) {
    super(props);

    this.handleTermChange = this.handleTermChange.bind(this);
  }

  handleTermChange(type, e) {
    this.props.search(type, e.target.value);
  }

  render() {
    return (
      <div className="SearchBar">
        <input
          placeholder="Search Albums"
          onChange={e => this.handleTermChange("album", e)}
        />
      </div>
    );
  }
}
// Renders the results of the search

const AlbumSearchResults = props => {
  const results = props.searchResults || [];

  return (
    <div className="SearchResults">
      <ul>
        <div className="SearchResults">
          <h1>Search Results: </h1>

          {results.map(album => {
            return (
              <div className="renderedResults">
                <h2>
                  <li>{album.artists[0].name}</li>
                  <li>{album.name}</li>
                  <img src={album.images[0].url} />
                  <br />
                  <button
                    className="Sell"
                    onClick={e =>
                      props.handleAddToCart(
                        e,
                        album.artists[0].name,
                        album.name,
                        album.images[0].url,
                        album.id
                      )
                    }
                  >
                    Sell
                  </button>
                </h2>{" "}
              </div>
            );
          })}
        </div>
      </ul>
    </div>
  );
};

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      birfWallet: 1000,
      yourWallet: 0,
      searchResults: [],
      popResults: [],
      trackPop: []
    };

    this.addToCart = this.addToCart.bind(this);
    this.search = this.search.bind(this);
    this.handleAddToCart = this.handleAddToCart.bind(this);
    this.handleGetTrackPop = this.handleGetTrackPop.bind(this);
    this.filterResults = this.filterResults.bind(this);
  }

  handleAddToCart = (e, artist, album, images, id) => {
    console.log(artist);
    console.log(album);
    console.log(id);
    this.handleGetTrackPop(id);
  };

  handleGetTrackPop = () => {
    let results = this.state.searchResults.map(item => item.id);
    console.log(results);
    let firstTrack = results[0];
    Spotify.search("track", null, firstTrack).then(searchResults => {
      return this.setState({
        popResults: searchResults
      });
    });
    console.log(this.state.popResults);
  };

  addToCart = e => {
    console.log(this.state.popResults);
  };

  search(type, input, id) {
    Spotify.search(type, input, id).then(searchResults => {
      return this.setState({
        searchResults: searchResults,
        currentSearchType: type
      });
    });
  }

  filterResults() {
    let genResults = this.state.searchResults.map(results => results.id);
    let popResults = this.state.popResults.map(results => results.id);
  }

  render() {
    let resultComponent;

    resultComponent = (
      <div>
        <AlbumSearchResults
          searchResults={this.state.searchResults}
          addToCart={this.addToCart}
          handleAddToCart={this.handleAddToCart}
          handleGetTrackPop={this.handleGetTrackPop}
          popResults={this.popResults}
          popSearch={this.popSearch}
        />
      </div>
    );
    return (
      <div>
        <meta name="pinterest" content="nopin" />
        <div className="Header">
          <h1>What d'ya got?</h1>
        </div>
        <div className="Wallets">
          <h2>Birf's wallet: ${this.state.birfWallet}</h2>
          <h2>Your wallet: ${this.state.yourWallet}</h2>
        </div>
        <div className="App">
          <Search search={this.search} />
          {resultComponent}
        </div>
      </div>
    );
  }
}

export default App;
