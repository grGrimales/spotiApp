import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SpotifyService {
  token: any = {};


  constructor( private http: HttpClient) { 
    console.log('Spotify Service listo');

   
  }

  saveToken() {


    this.http.get("https://spotify-get-token-grediana.herokuapp.com/spotify/1733df18b721410eb85dadfce94e2acf/db1c7f0ced264a218759ac78667974ee")
      .toPromise()
      .then((credenciales: any) => {
        let tokenNuevo = credenciales['access_token']

        localStorage.setItem('token-spotify', JSON.stringify({ token: tokenNuevo }));

      }, (err: any) => {
        console.log(err);
      })
   

  }
  getQuery(query: string) {

    this.saveToken();


    const url = `https://api.spotify.com/v1/${query}`;

    const credenciales =  JSON.parse( localStorage.getItem('token-spotify')|| '{}')


    const headers = new HttpHeaders({
      'Authorization': `Bearer ${credenciales['token']}`
    });

    return this.http.get(url, { headers });


  }


 getNewReleases(){

  return this.getQuery('browse/new-releases?limit=20')
      .pipe( map( (data: any) => data['albums'].items));
  
}

getArtistas ( termino: string ){

  return this.getQuery(`search?q=${ termino }&type=artist&limit=15&offset=5`)
    .pipe( map( (data: any) => data['artists'].items));

  
 }

 getArtista ( id: string ){

  return this.getQuery(`artists/${ id }`);
    //.pipe( map( (data: any) => data['artists'].items));

  
 }

 getTopTracks ( id: string ){

  return this.getQuery(`artists/${ id }/top-tracks?country=us`)
    .pipe( map( (data: any) => data['tracks']));

  
 }

}


