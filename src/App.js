import React from "react";
import "./App.css";
import Spotify from "./util/spotify.js";

// Handles the app's searchbar component
class Search extends React.Component {
  constructor(props) {
    super(props);

    this.handleTermChange = this.handleTermChange.bind(this);
  }

  handleTermChange(e) {
    this.props.search(e.target.value);
  }

  render() {
    return (
      <div className="SearchBar">
        <input placeholder="Search By Artist" />
        <br />
        <input placeholder="Search By Album" />
        <br />
        <input placeholder="Search By Song" />
        <br />
        <input
          placeholder="Enter A Song, Album, or Artist"
          onChange={this.handleTermChange}
        />
      </div>
    );
  }
}
// Renders the results of the search
class SearchResults extends React.Component {
  constructor(props) {
    super(props);

    this.searchResults = this.searchResults.bind(this);
  }

  searchResults = () => {
    return (
      <div className="SearchResults">
        <h1>Search Results: </h1>

        {this.props.searchResults.map(track => {
          return (
            <div className="renderedResults">
              <h2>
                <li>Artist: {track.artist}</li>
                <li>Song: {track.name}</li>
                <li>Album: {track.album}</li>
              </h2>
              <button
                className="Sell"
                album={track.album}
                song={track.name}
                artist={track.artist}
                popularity={track.popularity}
                onClick={e =>
                  this.props.handleAddToCart(
                    e,
                    track.artist,
                    track.album,
                    track.popularity,
                    track.name,
                    track.label
                  )
                }
              >
                Sell
              </button>
            </div>
          );
        })}
      </div>
    );
  };
  render() {
    return (
      <div className="SearchResults">
        <ul>{this.searchResults()}</ul>
      </div>
    );
  }
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      birfWallet: 1000,
      yourWallet: 0,
      searchResults: []
    };

    this.addToCart = this.addToCart.bind(this);
    this.search = this.search.bind(this);
    this.handleAddToCart = this.handleAddToCart.bind(this);
  }

  handleAddToCart = (e, artist, album, song, popularity) => {
    console.log(artist);
    console.log(album);
    console.log(song);
    console.log(popularity);
  };

  addToCart = e => {
    console.log(this.state.value);
  };

  search(input) {
    Spotify.search(input).then(searchResults => {
      return this.setState({ searchResults: searchResults });
    });
  }
  render() {
    console.log(this.state);
    return (
      <div>
        <div className="Header">
          <h1>What d'ya got?</h1>
        </div>
        <div className="Wallets">
          <h2>Birf's wallet: ${this.state.birfWallet}</h2>
          <h2>Your wallet: ${this.state.yourWallet}</h2>
        </div>
        <div className="App">
          <Search search={this.search} />
          <SearchResults
            searchResults={this.state.searchResults}
            addToCart={this.addToCart}
            handleAddToCart={this.handleAddToCart}
          />
        </div>
      </div>
    );
  }
}

export default App;
