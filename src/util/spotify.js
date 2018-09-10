const client_id = "1a5cb04b911c4b0c8924e6f92be3139a";
const redirect_uri = encodeURIComponent("http://localhost:3000");
let accessToken = undefined;
let expiresIn = undefined;

const Spotify = {
  getAccessToken() {
    if (accessToken) {
      return accessToken;
    }

    let urlAccessToken = window.location.href.match(/access_token=([^&]*)/);
    let urlExpiresIn = window.location.href.match(/expires_in=([^&]*)/);

    if (urlAccessToken && urlExpiresIn) {
      accessToken = urlAccessToken[1];
      expiresIn = urlExpiresIn[1];
    } else {
      window.location.href = `https://accounts.spotify.com/authorize?client_id=${client_id}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirect_uri}`;
    }
  },

  search(type, term) {
    this.getAccessToken();

    const query = () => {
      if (type === "artist") {
        return `https://api.spotify.com/v1/search?q=${term}&type=${type}&includes_group=album`;
      } else if (type === "album" || "track") {
        return `https://api.spotify.com/v1/search?q=${term}&type=${type}&includes_group=tracks`;
      }
    };

    return fetch(query(), {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
      .then(response => response.json())
      .then(jsonResponse => {
        if (`${type}` === "album" && jsonResponse.albums) {
          return jsonResponse.albums.items;
        } else if (`${type}` === "artist" && jsonResponse.artists) {
          return jsonResponse.artists.items;
        }
      });
  }
};

export default Spotify;
