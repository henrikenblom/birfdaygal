// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  profileImageUploadEndpoint: 'https://titan.enblom.com/profile_image_upload',
  twinsImageUploadEndpoint: 'https://titan.enblom.com/twins/compare_by_photo',
  firebase: {
    apiKey: 'AIzaSyCgaKwpXsQmHj0iJK-IDv_BdhB6ETC7Aog',
    authDomain: 'birfday-gal.firebaseapp.com',
    databaseURL: 'https://birfday-gal.firebaseio.com',
    projectId: 'birfday-gal',
    storageBucket: 'birfday-gal.appspot.com',
    messagingSenderId: '1027434202117'
  }
};
